from fastapi import APIRouter, Request, Header, HTTPException, Depends
from fastapi.responses import JSONResponse
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

@router.get("/feishu/test")
async def test_feishu_connectivity():
    """v5.5.4: Manual connectivity test for Boss"""
    return {"status": "ok", "message": "IM Gateway is active and reachable"}

@router.post("/feishu")
@router.post("/feishu/") # v5.5.4: Handle trailing slash variants
async def feishu_webhook(request: Request):
    """
    v5.5.4: Ultra-Robust Feishu Webhook Handler.
    """
    try:
        raw_body = await request.body()
        if not raw_body:
            return JSONResponse(content={"status": "empty"}, status_code=200)
            
        payload = json.loads(raw_body)
        
        # 1. IMMEDIATE CHALLENGE RESPONSE (Highest Priority)
        if payload.get("type") == "url_verification":
            challenge = payload.get("challenge")
            return JSONResponse(content={"challenge": challenge}, status_code=200)
        
        # 2. EVENT PROCESSING
        event = payload.get("event", {})
        sender_id = event.get("sender", {}).get("sender_id", {}).get("open_id")
        message = event.get("message", {})
        
        if not sender_id or not message:
            return JSONResponse(content={"status": "ignored"}, status_code=200)

        # Parse content
        try:
            content_obj = json.loads(message.get("content", "{}"))
            text_content = content_obj.get("text", "")
        except:
            text_content = ""

        if not text_content:
            return JSONResponse(content={"status": "no_text"}, status_code=200)

        # 3. BRAIN ROUTING
        from app.db.session import SessionLocal
        db = SessionLocal()
        try:
            binding = db.query(UserIMBinding).filter_by(platform="feishu", platform_uid=sender_id, is_active=True).first()
            user_id = binding.user_id if binding else 1 # Default to User 1 for Demo
            
            # Call AI Brain
            ai_response = await run_agent(
                content=text_content, 
                user_id=user_id,
                session_id=f"feishu_{sender_id}"
            )
            
            # TODO: Future - Send back via Feishu Message API (Async)
            # For now, return as direct response (Feishu allows this for simple bots)
            return JSONResponse(content={
                "msg_type": "text",
                "content": {"text": ai_response.get("content", "Brain is thinking...")}
            }, status_code=200)
        finally:
            db.close()

    except Exception as e:
        logger.error(f"❌ Feishu Critical Error: {str(e)}")
        # Still return 200 to Feishu to avoid retries, but log the error
        return JSONResponse(content={"status": "error", "msg": str(e)}, status_code=200)

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """v5.5: Unified IM Gateway - WhatsApp Adapter (Refactored)"""
    # ... logic similar to Feishu but using WhatsApp Cloud API format ...
    return {"status": "ok"}
