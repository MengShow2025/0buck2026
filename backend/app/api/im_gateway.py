from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.butler import UserIMBinding
from app.services.agent import run_agent
from app.core.config import settings
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/feishu")
async def feishu_webhook(request: Request, db: Session = Depends(get_db)):
    """
    v5.5: Unified IM Gateway - Feishu (Lark) Adapter.
    Handles message reception, identity mapping, and AI Brain routing.
    """
    data = await request.body()
    payload = json.loads(data)
    
    # 1. Handle Feishu URL Verification
    if payload.get("type") == "url_verification":
        return {"challenge": payload.get("challenge")}
    
    # 2. Extract Message Info
    event = payload.get("event", {})
    sender = event.get("sender", {})
    sender_id = sender.get("sender_id", {}).get("open_id")
    message = event.get("message", {})
    text_content = json.loads(message.get("content", "{}")).get("text", "")
    
    if not sender_id or not text_content:
        return {"status": "ignored"}

    # 3. Identity Mapping (The Bridge)
    binding = db.query(UserIMBinding).filter_by(platform="feishu", platform_uid=sender_id, is_active=True).first()
    
    if not binding:
        # v5.5: Implicit creation for Demo, but in Prod we'd trigger a binding flow
        # For now, we assume user_id=1 for testing if not bound
        user_id = 1 
        logger.warning(f"⚠️ Unbound Feishu User {sender_id}. Defaulting to User 1.")
    else:
        user_id = binding.user_id

    # 4. Route to AI Brain (LangGraph)
    # We use sender_id as the session_id to maintain IM-specific context
    ai_response = await run_agent(
        content=text_content, 
        user_id=user_id,
        session_id=f"feishu_{sender_id}"
    )
    
    # 5. TODO: Implement Feishu-specific Card Renderer
    # For now, return plain text
    return {
        "msg_type": "text",
        "content": {
            "text": ai_response.get("content", "AI Brain is processing...")
        }
    }

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """v5.5: Unified IM Gateway - WhatsApp Adapter (Refactored)"""
    # ... logic similar to Feishu but using WhatsApp Cloud API format ...
    return {"status": "ok"}
