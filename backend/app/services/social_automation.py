import asyncio
import logging
from datetime import datetime, date
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.services.whatsapp import send_whatsapp_message
from app.services.stream_chat import stream_chat_service
from app.models.ledger import (
    Order, UserExt, CheckinPlan, CheckinLog, GroupBuyCampaign, SquareActivity
)
from app.core.config import settings

logger = logging.getLogger(__name__)

class SocialAutomationService:
    def __init__(self, db: Session):
        self.db = db

    async def notify_order_paid(self, order_id: int):
        """
        v3.4: Multi-channel notification for paid orders.
        """
        order = self.db.query(Order).filter_by(shopify_order_id=order_id).first()
        if not order:
            return

        user = self.db.query(UserExt).filter_by(customer_id=order.user_id).first()
        
        # 1. WhatsApp Notification
        # (Assuming we have user phone or fetch it from Shopify if needed)
        # For now, we assume phone is available or fetched in the webhook caller
        
        # 2. Square Activity (Social Feed)
        activity = SquareActivity(
            user_id=order.user_id,
            type="order_paid",
            content=f"🛍️ Order #{order.order_number} confirmed! 20-phase cashback path activated.",
            metadata_json={"order_id": order_id, "amount": str(order.total_price)}
        )
        self.db.add(activity)
        
        # 3. Stream 'Social Lounge' Broadcast (v3.4 VCC)
        # We send a message to the global lounge to create 'Vortex' social proof
        try:
            lounge = stream_chat_service.server_client.channel("social", "global_lounge")
            lounge.send_message({
                "text": f"🎉 Congratulations to User {str(order.user_id)[-4:]} for their new order! The 500-day cashback journey starts now.",
                "attachments": [{
                    "type": "0B_CARD_V3",
                    "component": "0B_CASHBACK_RADAR",
                    "data": {"status": "activated", "order_number": order.order_number}
                }]
            }, user_id="0buck_system")
        except Exception as e:
            logger.error(f"Failed to broadcast to Stream Lounge: {e}")

        self.db.commit()

    async def notify_group_buy_update(self, campaign_id: str):
        """
        v3.4: Update users on Group Buy progress.
        """
        campaign = self.db.query(GroupBuyCampaign).filter_by(id=campaign_id).first()
        if not campaign:
            return

        # Notify the owner via WhatsApp or Stream
        owner_order = self.db.query(Order).filter_by(shopify_order_id=campaign.owner_order_id).first()
        if owner_order:
            msg = f"🙌 Your Group Buy is growing! Current progress: {campaign.current_count}/{campaign.required_count}. "
            if campaign.status == "success":
                msg += "Success! Your order is now FREE. Refund processing..."
            
            # Send to owner's private concierge channel
            try:
                concierge = stream_chat_service.server_client.channel("concierge", f"butler_{owner_order.user_id}")
                concierge.send_message({"text": msg}, user_id="0buck_system")
            except Exception as e:
                logger.error(f"Failed to notify Group Buy update to Stream: {e}")

    async def send_checkin_reminders(self):
        """
        v3.4: Scan for users who haven't checked in today and send reminders.
        Runs daily at 8 PM (local time per user).
        """
        # 1. Fetch active plans
        active_plans = self.db.query(CheckinPlan).filter(
            CheckinPlan.status == "active_checkin"
        ).all()
        
        reminded_count = 0
        for plan in active_plans:
            # Check if user already checked in today in their timezone
            # (Simplified: using plan.timezone)
            import pytz
            user_tz = pytz.timezone(plan.timezone or "UTC")
            user_now = datetime.now(user_tz)
            
            # If it's after 8 PM in user's timezone and they haven't checked in
            if user_now.hour >= 20:
                last_checkin = plan.last_checkin_at
                if not last_checkin or last_checkin < user_now.date():
                    # Send reminder
                    try:
                        # 1. Stream Concierge nudge
                        concierge = stream_chat_service.server_client.channel("concierge", f"butler_{plan.user_id}")
                        concierge.send_message({
                            "text": "⏰ Don't forget your daily 0Buck check-in! Keep your streak alive to secure your cashback.",
                            "attachments": [{
                                "type": "0B_CARD_V3",
                                "component": "0B_RENEWAL_ALERT",
                                "data": {"type": "reminder", "deadline": "4 hours remaining"}
                            }]
                        }, user_id="0buck_system")
                        
                        # 2. WhatsApp Backup (if phone exists)
                        # await send_whatsapp_message(user_phone, "...")
                        
                        reminded_count += 1
                    except Exception as e:
                        logger.error(f"Failed to send check-in reminder to user {plan.user_id}: {e}")
        
        return reminded_count

    def map_bap_to_whatsapp(self, card_type: str, data: dict) -> dict:
        """
        v3.4 Bridge: Convert React BAP cards to WhatsApp Interactive Messages (Buttons/Lists).
        """
        if card_type == "0B_PRODUCT_GRID":
            products = data.get("products", [])
            rows = []
            for p in products[:10]:
                rows.append({
                    "id": f"buy_{p.get('id')}",
                    "title": p.get("title")[:24],
                    "description": f"${p.get('price')} - {p.get('category')}"
                })
            
            return {
                "type": "list",
                "header": {"type": "text", "text": "0Buck Daily Picks"},
                "body": {"text": "Select a product to view details and start your cashback journey."},
                "footer": {"text": "Powered by 0Buck AI Butler"},
                "action": {
                    "button": "View Products",
                    "sections": [{"title": "Recommended", "rows": rows}]
                }
            }
        
        # Default to simple text for other cards
        return {"type": "text", "text": f"Business Card: {card_type}. Please check the 0Buck App for full details."}
