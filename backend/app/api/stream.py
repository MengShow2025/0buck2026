from fastapi import APIRouter, Request, Header, Depends, HTTPException
from sqlalchemy.orm import Session
import json
import logging
import asyncio

from app.db.session import get_db
from app.services.stream_chat import stream_chat_service
from app.services.agent import agent_executor
from app.services.reflection_service import run_butler_learning
from app.models.ledger import ProcessedWebhookEvent
from langchain_core.messages import HumanMessage
from app.core.bap_protocol import BAPCardType, BAP_ProductGrid, BAPAttachment
from app.core.config import settings
from app.core.celery_app import celery_app

router = APIRouter()
logger = logging.getLogger(__name__)


def _enqueue_ai_response(user_id: str, channel_type: str, channel_id: str, content: str) -> None:
    if settings.CELERY_ENABLED:
        try:
            celery_app.send_task("stream_ai_response", args=[user_id, channel_type, channel_id, content])
            return
        except Exception:
            pass
    asyncio.create_task(process_ai_response(user_id, channel_type, channel_id, content))

async def send_targeted_bap_card(channel_id: str, user_id: str, bap_payload: dict):
    """
    v3.4 BAP: Send targeted business card to specific user.
    In Lounge (group chat), uses 'Private Projection' so only target user sees it.
    """
    channel_type = "concierge"
    actual_channel_id = channel_id
    if ":" in channel_id:
        channel_type, actual_channel_id = channel_id.split(":", 1)
    
    card_type = bap_payload.get("component")
    data = bap_payload.get("data")
    
    return stream_chat_service.send_bap_card(
        channel_type=channel_type,
        channel_id=actual_channel_id,
        card_type=card_type,
        data=data,
        targeted_user_id=user_id
    )

@router.post("/webhook")
async def stream_webhook(
    request: Request,
    x_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    v3.4 VCC Webhook Handler:
    Listens for new messages from GetStream and triggers AI reflection/response.
    """
    body = await request.body()
    
    # 1. Verify Webhook Signature
    if not stream_chat_service.verify_webhook(body, x_signature):
        logger.error("Invalid Stream Webhook Signature")
        raise HTTPException(status_code=403, detail="Invalid signature")

    event = json.loads(body)
    event_type = event.get("type")
    
    # 2. Handle New Message
    if event_type == "message.new":
        message = event.get("message", {})
        msg_id = message.get("id")
        
        # v3.4 VCC: Idempotency check via Database
        existing_event = db.query(ProcessedWebhookEvent).filter_by(event_id=msg_id, provider="stream").first()
        if existing_event:
            logger.info(f"  [VCC Webhook] Skipping duplicate message: {msg_id}")
            return {"status": "skipped", "reason": "duplicate"}
        
        # Mark as processed
        try:
            new_event = ProcessedWebhookEvent(event_id=msg_id, provider="stream")
            db.add(new_event)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.warning(f"  [VCC Webhook] Conflict or Error saving msg_id {msg_id}: {e}")
            return {"status": "skipped", "reason": "processing_or_duplicate"}

        user = event.get("user", {})
        channel_id = event.get("channel_id")
        channel_type = event.get("channel_type")
        
        # Skip messages sent by the system bot to avoid loops
        if user.get("id") == "0buck_system":
            return {"status": "skipped", "reason": "system_message"}

        content = message.get("text", "")
        user_id = user.get("id")
        
        logger.info(f"  [VCC Webhook] New message from {user_id} in {channel_type}:{channel_id}: {content[:50]}...")

    # 3. Trigger AI Agent (Asynchronous)
    if settings.CELERY_ENABLED:
        try:
            # P0 Fix: Enqueue to Celery for reliable background processing (Prevents lost messages on restart)
            celery_app.send_task("stream_ai_response", args=[user_id, channel_type, channel_id, content])
            return {"status": "ok"}
        except Exception as e:
            logger.warning(f"  [VCC Webhook] Celery enqueue failed, falling back to asyncio: {e}")
            
    # Fallback if Celery is disabled or fails
    asyncio.create_task(process_ai_response(user_id, channel_type, channel_id, content))
    return {"status": "ok"}

async def process_ai_response(user_id: str, channel_type: str, channel_id: str, content: str):
    """
    Handles the AI logic for a new message and sends back a BAP card or text.
    """
    # Simple keyword detection for 'Intent Anchors' (v3.4 Protocol)
    is_intent = any(kw in content.lower() for kw in ["want", "buy", "wish", "track", "price", "想要", "买", "许愿", "进度"])
    
    # User-to-User private chat (concierge) or Group chat (social)
    # AI is silent by default unless explicitly called or strong intent detected
    should_respond = is_intent or "@butler" in content.lower()
    
    if not should_respond:
        return

    try:
        # Run LangGraph Agent
        config = {"configurable": {"thread_id": f"stream_{user_id}"}}
        initial_input = {"messages": [HumanMessage(content=content)], "user_id": user_id}
        
        final_state = await agent_executor.ainvoke(initial_input, config=config)
        last_msg = final_state["messages"][-1]
        
        # Check for BAP Cards from Tool Messages
        search_results = []
        order_info = None
        wish_info = None
        
        for m in reversed(final_state["messages"]):
            if m.type == "human":
                break
            if m.type == "tool":
                try:
                    parsed = json.loads(m.content)
                    if m.name == "product_search" and isinstance(parsed, list):
                        search_results = parsed
                    elif m.name == "get_order_status" and isinstance(parsed, dict) and "order_id" in parsed:
                        order_info = parsed
                    elif m.name == "trigger_wishing_well" and isinstance(parsed, dict) and "wish_id" in parsed:
                        wish_info = parsed
                except Exception:
                    pass
        
        if search_results:
            # Send BAP Product Card
            stream_chat_service.send_bap_card(
                channel_type=channel_type,
                channel_id=channel_id,
                card_type="0B_PRODUCT_GRID",
                data={"products": search_results[:10], "butler_comment": last_msg.content},
                targeted_user_id=user_id if channel_type == "social" else None # Private Projection
            )
        elif order_info:
            # Send BAP Logistics Radar Card
            stream_chat_service.send_bap_card(
                channel_type=channel_type,
                channel_id=channel_id,
                card_type="0B_LOGISTICS_RADAR",
                data={"order": order_info, "butler_comment": last_msg.content},
                targeted_user_id=user_id if channel_type == "social" else None # Private Projection
            )
        elif wish_info:
            # Send BAP Wish Well Card
            stream_chat_service.send_bap_card(
                channel_type=channel_type,
                channel_id=channel_id,
                card_type="0B_WISH_WELL",
                data={"wish": wish_info, "butler_comment": last_msg.content},
                targeted_user_id=user_id if channel_type == "social" else None # Private Projection
            )
        else:
            # Send standard text response
            channel = stream_chat_service.server_client.channel(channel_type, channel_id)
            channel.send_message({"text": last_msg.content}, user_id="0buck_system")
            
        # 4. Trigger AI Reflection (Long-term memory)
        # This will extract facts like 'user likes purple' and save to 0Buck DB
        history = [{"role": "user", "content": content}, {"role": "assistant", "content": last_msg.content}]
        # run_butler_learning requires a Session, so we use SessionLocal for the background task
        from app.db.session import SessionLocal
        def background_reflection(hist, uid):
            db = SessionLocal()
            try:
                # We can't await in sync thread directly, so use asyncio.run
                asyncio.run(run_butler_learning(hist, uid, db))
            finally:
                db.close()

        if settings.CELERY_ENABLED:
            try:
                celery_app.send_task("butler_learning", args=[history, user_id])
            except Exception:
                asyncio.create_task(asyncio.to_thread(background_reflection, history, user_id))
        else:
            asyncio.create_task(asyncio.to_thread(background_reflection, history, user_id))
    except Exception as e:
        logger.error(f"Error in VCC AI Response: {e}")
