
import asyncio
from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import Session
from backend.app.db.session import SessionLocal
from backend.app.models.product import Product
from backend.app.services.supply_chain import SupplyChainService
from backend.app.services.sync_shopify import SyncShopifyService
from backend.app.services.config_service import ConfigService

class MeltingService:
    def __init__(self, db: Session):
        self.db = db
        self.config_service = ConfigService(db)
        self.sc_service = SupplyChainService(db)
        self.shopify_service = SyncShopifyService()

    async def scan_and_melt(self):
        """
        v3.1 Industrial-grade Price Melting Engine:
        1. Tiered Scanning: High (Hourly), Med (4h), Low (12h).
        2. Cooling-off Period: Skip melt if product manually reactivated within 24h.
        3. Detailed Traceability: Log melted_at and last_stable_cost.
        """
        now = datetime.utcnow()
        print(f"🚀 [{now}] Starting Tiered Price Melting Scan...")
        
        # Global threshold from Admin Config
        global_threshold = float(self.config_service.get("GLOBAL_PRICE_MELTING_THRESHOLD", 0.15))
        
        # v3.1: Tiered logic based on current hour
        # (Simplified: High is always scanned, Med every 4 scans, Low every 12)
        hour = now.hour
        priority_filter = [1] # Always scan priority 1 (Hot sellers)
        if hour % 4 == 0: priority_filter.append(2)
        if hour % 12 == 0: priority_filter.append(3)

        products = self.db.query(Product).filter(
            Product.is_active == True,
            Product.scan_priority.in_(priority_filter)
        ).all()
        
        stats = {"scanned": 0, "melted": 0, "updated": 0, "errors": 0}
        
        for product in products:
            stats["scanned"] += 1
            try:
                # Cooling-off Check: If manually un-melted within 24h, skip automatic melting
                # (Prevents SEO oscillation)
                if product.is_melted == False and product.melted_at:
                    hours_since_last_melt = (now - product.melted_at).total_seconds() / 3600
                    if hours_since_last_melt < 24:
                        print(f"  ❄️ Cooling-off period for {product.title_en}. Skipping scan.")
                        continue

                raw_details = await self.sc_service.fetch_product_details(product.product_id_1688)
                new_cost_cny = Decimal(str(raw_details.get("price", product.original_price)))
                old_cost_cny = Decimal(str(product.original_price))
                
                if old_cost_cny <= 0: continue
                    
                fluctuation_ratio = (new_cost_cny - old_cost_cny) / old_cost_cny
                threshold = Decimal(str(product.price_fluctuation_threshold or global_threshold))
                
                if fluctuation_ratio > threshold:
                    # 🔥 MELT TRIGGERED
                    print(f"  ⚠️ MELT TRIGGERED for {product.title_en} (Ratio: {fluctuation_ratio:.2%})")
                    product.is_melted = True
                    product.melted_at = now # Traceability v3.1
                    product.last_stable_cost = float(old_cost_cny) # Traceability v3.1
                    product.melting_reason = f"Cost increased by {fluctuation_ratio:.2%} (from {old_cost_cny} to {new_cost_cny})"
                    
                    if product.shopify_product_id:
                        import shopify
                        sp = shopify.Product.find(product.shopify_product_id)
                        if sp:
                            sp.status = "draft"
                            sp.save()
                    
                    stats["melted"] += 1
                
                elif abs(fluctuation_ratio) > Decimal("0.01"):
                    # ✅ SYNC PRICE (Normal fluctuation)
                    product.original_price = float(new_cost_cny)
                    pricing = self.sc_service.calculate_price(float(new_cost_cny), float(product.compare_at_price / 0.95) if product.compare_at_price else None)
                    
                    if pricing.get("sale_price"):
                        product.sale_price = pricing["sale_price"]
                        product.compare_at_price = pricing.get("display_price")
                        product.source_cost_usd = pricing["cost_usd_buffered"]
                        self.shopify_service.sync_to_shopify(product)
                        stats["updated"] += 1
                
                product.last_synced_at = now
                self.db.commit()

            except Exception as e:
                print(f"  ❌ Error scanning {product.title_en}: {str(e)}")
                stats["errors"] += 1
                self.db.rollback()
        
        print(f"✅ Tiered Scan completed: {stats}")
        return stats

async def run_cron():
    db = SessionLocal()
    service = MeltingService(db)
    await service.scan_and_melt()
    db.close()

if __name__ == "__main__":
    asyncio.run(run_cron())
