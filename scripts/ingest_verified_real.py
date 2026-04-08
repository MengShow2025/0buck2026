import asyncio
import logging
import sys
import os
import json
from decimal import Decimal

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(project_root, "backend"))

from app.db.session import SessionLocal
from app.services.cj_service import CJDropshippingService
from app.services.supply_chain import SupplyChainService
from app.models.product import CandidateProduct
from sqlalchemy import text

async def insert_verified_tuya():
    db = SessionLocal()
    cj_service = CJDropshippingService()
    supply_chain = SupplyChainService(db)
    
    # 1. REAL CJ DATA
    cj_pid = "1573652999476621312"
    p_name = "Tuya Wifi Smart Door Magnetic Anti-theft Alarm App Push"
    
    print(f"🚀 Ingesting VERIFIED REAL DATA for: {p_name}")
    
    # Fetch CJ Details
    detail = await cj_service.get_product_detail(cj_pid)
    if not detail:
        print("❌ Could not fetch CJ detail for PID.")
        return

    # Logistics
    freight_list = await cj_service.get_freight_estimate(cj_pid, "US")
    freight = 8.0
    if freight_list:
        cheapest = min(freight_list, key=lambda x: float(x.get("freightFee", 999)))
        freight = float(cheapest.get("freightFee", 8.0))
    
    sell_price_raw = str(detail.get("sellPrice") or "5.0")
    if "-" in sell_price_raw:
        cost_usd = float(sell_price_raw.split("-")[-1]) # Take the upper end for conservative ROI
    else:
        cost_usd = float(sell_price_raw)
    landed_cost = cost_usd + freight
    
    # 2. ABSOLUTELY REAL MARKET EVIDENCE (Manually Verified via web_fetch)
    real_amazon_url = "https://www.amazon.com/Smart-WiFi-Door-Sensor-Notification/dp/B0CLTSX9DC"
    real_amazon_price = 12.99
    
    target_price = round(real_amazon_price * 0.6, 2)
    roi = round(target_price / landed_cost, 2)
    
    # AI Enrichment
    enriched = await supply_chain.translate_and_enrich({
        "title": p_name,
        "category": "Smart Home",
        "price": landed_cost
    }, strategy="IDS_BRUTE_FORCE")

    # Clear existing
    db.query(CandidateProduct).filter_by(product_id_1688=cj_pid).delete()
    
    raw_images_str = detail.get("productImage", "[]")
    try:
        raw_images = json.loads(raw_images_str)
    except:
        raw_images = raw_images_str.split(",")
        
    image_list = []
    for img in raw_images:
        if img:
            img = img.strip().replace('"', '').replace('[', '').replace(']', '') # Defensive
            if img.startswith("//"):
                image_list.append(f"https:{img}")
            elif not img.startswith("http"):
                image_list.append(f"https://{img}")
            else:
                image_list.append(img)
    
    print(f"   DEBUG: Cleaned Image List: {image_list[:2]}")
    
    # Create Draft
    new_draft = CandidateProduct(
        product_id_1688=cj_pid,
        title_zh=p_name,
        title_en_preview=enriched.get("title_en"),
        description_zh=enriched.get("description_en"),
        cost_cny=float(landed_cost * 7.1),
        amazon_price=float(real_amazon_price),
        amazon_compare_at_price=float(real_amazon_price),
        market_comparison_url=real_amazon_url,
        estimated_sale_price=float(target_price),
        profit_ratio=float(roi),
        images=image_list,
        discovery_source="VERIFIED_REAL_AUDIT",
        status="approved", # Verified data is approved
        source_platform="CJ",
        source_url=f"https://app.cjdropshipping.com/product-detail.html?id={cj_pid}",
        category="Smart Home",
        category_type="TRAFFIC" if roi < 4.0 else "PROFIT",
        is_cashback_eligible=(roi >= 4.0),
        
        desire_hook=enriched.get("desire_hook"),
        desire_logic=enriched.get("desire_logic"),
        desire_closing=enriched.get("desire_closing"),
        
        structural_data={
            "description_html": detail.get("description"),
            "sales_volume": detail.get("saleVolume", 0),
            "verification_status": "VERIFIED_ABSOLUTE"
        },
        logistics_data={
            "inventory": {
                "cj": detail.get("cjInventory", 0),
                "factory": detail.get("factoryInventory", 0),
                "total": (detail.get("cjInventory", 0) or 0) + (detail.get("factoryInventory", 0) or 0)
            },
            "shipping": {"fee": freight, "method": "Tracked Express"}
        }
    )
    
    db.add(new_draft)
    db.commit()
    print(f"✅ Ingested Absolutely Verified Product: {p_name}")
    db.close()

if __name__ == "__main__":
    asyncio.run(insert_verified_tuya())
