
import shopify
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.ledger import AvailableCoupon
from app.core.config import settings

class DiscountSyncService:
    def __init__(self, db: Session):
        self.db = db
        # Configure Shopify session
        self.shop_url = f"{settings.SHOPIFY_SHOP_NAME}.myshopify.com"
        self.session = shopify.Session(self.shop_url, "2024-01", settings.SHOPIFY_ACCESS_TOKEN)
        shopify.ShopifyResource.activate_session(self.session)

    def sync_from_shopify(self):
        """
        v3.1: Sync Price Rules and Discount Codes from Shopify to local DB.
        """
        print("🚀 Syncing Coupons from Shopify...")
        # 1. Fetch Price Rules (The logic behind the codes)
        price_rules = shopify.PriceRule.find()
        
        synced_count = 0
        for rule in price_rules:
            # 2. Fetch Discount Codes for each rule
            codes = shopify.DiscountCode.find(price_rule_id=rule.id)
            
            for dc in codes:
                # Map Shopify types to 0Buck types
                coupon_type = "fixed_amount"
                if rule.value_type == "percentage":
                    coupon_type = "percentage"
                elif rule.target_selection == "shipping_line":
                    coupon_type = "free_shipping"
                
                # Check if exists
                existing = self.db.query(AvailableCoupon).filter_by(code=dc.code).first()
                if not existing:
                    new_coupon = AvailableCoupon(
                        code=dc.code,
                        type=coupon_type,
                        value=abs(float(rule.value)),
                        min_requirement=float(rule.prerequisite_subtotal_range.get("greater_than_or_equal_to", 0.0)) if rule.prerequisite_subtotal_range else 0.0,
                        is_active=True,
                        expires_at=datetime.fromisoformat(rule.ends_at.replace('Z', '+00:00')) if rule.ends_at else None
                    )
                    self.db.add(new_coupon)
                else:
                    existing.value = abs(float(rule.value))
                    existing.is_active = True
                    
                synced_count += 1
        
        self.db.commit()
        shopify.ShopifyResource.clear_session()
        print(f"✅ Successfully synced {synced_count} coupons.")
        return synced_count

    def get_coupon_for_ai(self, category: str, min_spend: float = 0.0):
        """
        AI Retrieval logic: Find a suitable coupon from the database.
        """
        coupon = self.db.query(AvailableCoupon).filter(
            AvailableCoupon.ai_category == category,
            AvailableCoupon.is_active == True,
            AvailableCoupon.min_requirement <= min_spend
        ).first()
        return coupon
