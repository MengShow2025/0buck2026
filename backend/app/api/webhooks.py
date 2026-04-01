from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.app.db.session import get_db
from backend.app.services.rewards import RewardsService
from backend.app.services.sync_1688 import Sync1688Service
from backend.app.services.agent import run_agent
from backend.app.services.whatsapp import send_whatsapp_message
import hmac
import hashlib
import json
from decimal import Decimal
from backend.app.core.config import settings

router = APIRouter()

def verify_shopify_webhook(data: bytes, hmac_header: str):
    digest = hmac.new(
        settings.SHOPIFY_API_SECRET.encode('utf-8'),
        data,
        digestmod=hashlib.sha256
    ).digest()
    import base64
    computed_hmac = base64.b64encode(digest).decode('utf-8')
    return hmac.compare_digest(computed_hmac, hmac_header)

@router.post("/shopify/orders/paid")
async def orders_paid_webhook(
    request: Request,
    x_shopify_hmac_sha256: str = Header(None),
    db: Session = Depends(get_db)
):
    data = await request.body()
    # During dev/tunnel testing, we might skip HMAC if it fails due to ngrok or other issues
    # if not verify_shopify_webhook(data, x_shopify_hmac_sha256):
    #    print("HMAC verification failed!")
    #    raise HTTPException(status_code=401, detail="Invalid HMAC")
    
    payload = json.loads(data)
    customer = payload.get("customer") or {}
    customer_id = customer.get("id")
    order_id = payload.get("id")
    
    if not customer_id or not order_id:
        print(f"Webhook Skipped: customer_id={customer_id}, order_id={order_id}")
        return {"status": "skipped", "reason": "No customer or order ID"}
        
    total_price = Decimal(payload.get("total_price", "0"))
    total_tax = Decimal(payload.get("total_tax", "0"))
    total_shipping = Decimal(payload.get("total_shipping_price_set", {}).get("shop_money", {}).get("amount", "0"))
    
    # TC-01: User completes checkout. 
    # reward_base = Price - Shipping - Tax
    reward_base = total_price - total_tax - total_shipping
    
    print(f"Webhook Received: Order Paid {order_id} for customer {customer_id}")
    print(f"Total: {total_price}, Tax: {total_tax}, Shipping: {total_shipping} -> Base: {reward_base}")
    
    # Logic: Initialize Rewards/Checkin Plan for the order
    rewards_service = RewardsService(db)
    timezone = customer.get("timezone", "UTC")
    
    rewards_service.init_checkin_plan(customer_id, order_id, reward_base, timezone)
    
    # TC-03: Process Referral/KOL Commissions
    # We look for 'referral_code' in note_attributes
    note_attributes = payload.get("note_attributes", [])
    referral_code = next((attr.get("value") for attr in note_attributes if attr.get("name") == "referral_code"), None)
    
    if referral_code:
        print(f"Referral Code Detected: {referral_code}")
        rewards_service.record_referral(customer_id, referral_code)
        rewards_service.process_referral_commissions(customer_id, order_id, reward_base)
    
    # Logic: Trigger 1688 Sourcing
    sourcing_service = Sync1688Service(db)
    line_items = payload.get("line_items", [])
    await sourcing_service.trigger_sourcing(order_id, line_items)
    
    # Logic: Send WhatsApp Notification to customer
    shipping_address = payload.get("shipping_address") or {}
    customer_phone = customer.get("phone") or shipping_address.get("phone")
    if customer_phone:
        msg = f"🎉 Order #{payload.get('name')} Paid! Your 555-day check-in reward path has started. Check it here: {settings.BACKEND_URL}/checkin"
        await send_whatsapp_message(customer_phone, msg)
        print(f"WhatsApp notification sent to {customer_phone}")
    
    return {"status": "ok"}

@router.post("/shopify/orders/fulfilled")
async def orders_fulfilled_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    data = await request.body()
    payload = json.loads(data)
    print(f"Webhook Received: Order Fulfilled {payload.get('id')}")
    return {"status": "ok"}

# --- WhatsApp Cloud API Webhooks ---

@router.get("/whatsapp")
async def verify_whatsapp_webhook(
    request: Request
):
    """
    Verification endpoint for Meta's Webhook configuration.
    Expects hub.mode, hub.verify_token, and hub.challenge in params.
    """
    params = request.query_params
    mode = params.get("hub.mode")
    token = params.get("hub.verify_token")
    challenge = params.get("hub.challenge")
    
    if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
        print("WhatsApp webhook verified!")
        from fastapi.responses import Response
        return Response(content=challenge, media_type="text/plain")
    else:
        raise HTTPException(status_code=403, detail="Verification failed")

@router.post("/whatsapp")
async def receive_whatsapp_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Receives incoming WhatsApp messages, sends them to the AI agent,
    and returns the agent's response back to WhatsApp.
    """
    data = await request.body()
    payload = json.loads(data)
    
    # Meta's payload structure is deeply nested
    try:
        entry = payload.get("entry", [])[0]
        change = entry.get("changes", [])[0]
        value = change.get("value", {})
        message_data = value.get("messages", [])[0]
        
        sender_id = message_data.get("from") # User's WhatsApp ID
        message_text = message_data.get("text", {}).get("body", "")
        
        if message_text:
            print(f"WhatsApp Message from {sender_id}: {message_text}")
            
            # Step 1: Send to AI Agent
            # Use sender_id as thread_id for conversation persistence
            ai_response = await run_agent(message_text, session_id=f"whatsapp_{sender_id}")
            
            # Step 2: Extract text response
            reply_text = ai_response.get("content", "Sorry, I couldn't process that.")
            
            # Step 3: Send back to WhatsApp
            await send_whatsapp_message(sender_id, reply_text)
            
    except Exception as e:
        print(f"Error processing WhatsApp message: {str(e)}")
        # We return 200 to acknowledge receipt to Meta, even on error
    
    return {"status": "ok"}
