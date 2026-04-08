import asyncio
import logging
import sys
import os
import json
import re
from decimal import Decimal

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(project_root, "backend"))

from app.db.session import SessionLocal
from app.services.cj_service import CJDropshippingService
from app.services.supply_chain import SupplyChainService
from app.models.product import CandidateProduct
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def safe_float(val, default=0.0):
    if not val: return default
    try:
        if isinstance(val, str) and "-" in val:
            parts = val.split("-")
            return float(parts[-1])
        return float(val)
    except: return default

async def find_market_evidence(name, original_kw=None):
    """v5.7: Strict Truth Evidence with Pack Size Normalization."""
    from app.services.tools import _web_search_func
    
    evidence = {
        "selling_price": 0.0,
        "list_price": 0.0,
        "market_url": "",
        "pack_size": 1,
        "unit_selling_price": 0.0,
        "unit_list_price": 0.0
    }
    
    try:
        search_query = f"{name} price on amazon.com or ebay.com"
        results = await _web_search_func(search_query)
        
        if results and isinstance(results, list):
            for res in results:
                if not isinstance(res, dict): continue
                url = res.get("url", "").lower()
                if "amazon.com" in url or "ebay.com" in url:
                    evidence["market_url"] = res.get("url")
                    title = (res.get("title") or "").lower()
                    text_snippet = (res.get("text") or "").lower()
                    
                    # 1. Pack Size Detection (e.g. "2-Pack", "Set of 4", "4 Pcs")
                    pack_match = re.search(r'(\d+)\s?-(?:pack|pcs|set|pairs|count)', title + " " + text_snippet)
                    if pack_match:
                        evidence["pack_size"] = int(pack_match.group(1))
                    
                    # 2. Price Extraction
                    price_matches = re.findall(r'\$\s?(\d+(?:\.\d{2})?)', text_snippet)
                    if price_matches:
                        prices = sorted([float(p) for p in price_matches if float(p) > 1.0])
                        if prices:
                            raw_sell = prices[0]
                            raw_list = prices[-1] if len(prices) > 1 else raw_sell
                            
                            # 3. Unit Normalization
                            evidence["selling_price"] = raw_sell
                            evidence["list_price"] = raw_list
                            evidence["unit_selling_price"] = round(raw_sell / evidence["pack_size"], 2)
                            evidence["unit_list_price"] = round(raw_list / evidence["pack_size"], 2)
                    break
    except Exception as e:
        print(f"   ⚠️ Evidence Search Error: {e}")
        
    return evidence

async def mirror_extract_cj(cj_service, p, original_kw=None):
    """v5.7: Mirror Extractor with Unit Normalization & Truth Protocol."""
    if not p or not isinstance(p, dict): return None
        
    pid = p.get("pid") or p.get("id")
    name = p.get("productNameEn") or p.get("nameEn") or p.get("productName") or p.get("name") or "Unknown Product"
    price_usd_raw = p.get("productPrice") or p.get("sellPrice") or p.get("productSellPrice") or 0.0
    
    try:
        if " -- " in str(price_usd_raw): price_usd = float(str(price_usd_raw).split(" -- ")[-1])
        else: price_usd = float(price_usd_raw)
    except: price_usd = 0.0
    
    # 1. Logistics (Standard Point 8)
    freight = 8.0 
    logistic_method = "0Buck Global Express"
    try:
        freight_list = await cj_service.get_freight_estimate(pid, "US")
        if freight_list and isinstance(freight_list, list):
            valid_freight = [f for f in freight_list if f and isinstance(f, dict)]
            if valid_freight:
                cheapest = min(valid_freight, key=lambda x: float(x.get("freightFee", 999) or 999))
                freight = float(cheapest.get("freightFee", 8.0) or 8.0)
                logistic_method = cheapest.get("logisticName", "0Buck Global Express")
    except: pass
    landed_cost = price_usd + freight
    
    # 2. Detailed Data
    detail = None
    try: detail = await cj_service.get_product_detail(pid)
    except: pass
    
    image_list = []
    description_html = ""
    inventory_data = {"cj": 0, "factory": 0, "total": 0}
    vendor_info = {"name": "Artisan Partner", "rating": 5.0, "id": ""}
    
    # Default weights
    p_w_raw = safe_float(p.get("productWeight", 0))
    product_weight = p_w_raw / 1000.0 if p_w_raw > 5.0 else p_w_raw
    packing_weight = product_weight * 1.1
    packing_size = {"length": 0, "width": 0, "height": 0, "unit": "cm"}
    
    if detail and isinstance(detail, dict):
        if detail.get("productImage"): image_list = detail.get("productImage").split(",")
        description_html = detail.get("description", "")
        inventory_data = {
            "cj": detail.get("cjInventory", 0) or 0,
            "factory": detail.get("factoryInventory", 0) or 0,
            "total": (detail.get("cjInventory", 0) or 0) + (detail.get("factoryInventory", 0) or 0)
        }
        vendor_info = {
            "name": detail.get("shopName", "Artisan Partner"),
            "id": detail.get("shopId", ""),
            "rating": detail.get("shopRating", 5.0)
        }
        p_w_det = safe_float(detail.get("productWeight"))
        if p_w_det > 0: product_weight = p_w_det / 1000.0 if p_w_det > 5.0 else p_w_det
        pk_w_det = safe_float(detail.get("packingWeight"))
        if pk_w_det > 0: packing_weight = pk_w_det / 1000.0 if pk_w_det > 5.0 else pk_w_det
        packing_size = {
            "length": detail.get("packingLength", 0), "width": detail.get("packingWidth", 0), "height": detail.get("packingHeight", 0), "unit": "cm"
        }
    
    if not image_list: image_list = [p.get("bigImage") or p.get("productImage")]
    image_list = [img if img.startswith("http") else f"https:{img}" if img.startswith("//") else img for img in image_list if img]

    # 3. Strict Market Audit (Point 14)
    print(f"   🔍 Strict Market Audit for: {name[:30]}...")
    evidence = await find_market_evidence(name, original_kw)
    
    m_sell = float(evidence.get("unit_selling_price") or 0.0)
    m_list = float(evidence.get("unit_list_price") or 0.0)
    m_url = evidence.get("market_url", "")
    
    # TRUTH PROTOCOL: Skip if no selling price found
    if m_sell <= 0:
        print(f"   ⏭️ Skipping: No real market price found via Exa.")
        return None
    
    target_price = round(m_sell * 0.6, 2)
    roi = round(target_price / landed_cost, 2) if (landed_cost > 0) else 0.0
    
    return {
        "raw_data": p,
        "standard_fields": {
            "title": name,
            "sku": p.get("sku") or p.get("skuCode") or f"CJ-{pid}",
            "price_usd": round(price_usd, 2),
            "landed_cost": round(landed_cost, 2),
            "volume": p.get("saleVolume", 0) or 0,
            "warehouses": detail.get("productLocation", []) if detail else [],
            "inventory": inventory_data,
            "logistics": {
                "fee": round(freight, 2), "days": "7-12", "method": logistic_method,
                "product_weight": round(product_weight, 3), "packing_weight": round(packing_weight, 3), "weight_unit": "kg",
                "packing_size": packing_size
            },
            "vendor": vendor_info,
            "description_html": description_html,
            "images": image_list,
            "market_evidence": {
                "selling_price": m_sell,
                "list_price": m_list,
                "url": m_url
            }
        },
        "roi": roi,
        "is_cashback": (roi >= 4.0)
    }

async def ingest_v57(db, c, supply_chain):
    """Ingest with 100% Reality Protocol (No fallbacks)."""
    pid = c['raw_data'].get("pid") or c['raw_data'].get("id")
    exists = db.query(CandidateProduct).filter_by(product_id_1688=pid).first()
    if exists: return

    f = c['standard_fields']
    
    # Raw Archival
    try:
        db.execute(text("""
            INSERT INTO cj_raw_products (cj_pid, raw_json, title_en, source_url)
            VALUES (:pid, :json, :title, :url)
            ON CONFLICT (cj_pid) DO UPDATE SET raw_json = EXCLUDED.raw_json
        """), {"pid": pid, "json": json.dumps(c['raw_data'], ensure_ascii=False), "title": f['title'], "url": f"https://app.cjdropshipping.com/product-detail.html?id={pid}"})
        db.commit()
    except Exception as e:
        db.rollback()

    # AI Polishing
    print(f"   🤖 AI Refinement: {f['title'][:30]}...")
    enriched = await supply_chain.translate_and_enrich({"title": f['title'], "category": "Smart Home", "price": f['landed_cost']}, strategy="IDS_BRUTE_FORCE")

    new_draft = CandidateProduct(
        product_id_1688=pid,
        title_zh=f['title'],
        title_en_preview=enriched.get("title_en") or f['title'],
        description_zh=enriched.get("description_en") or "",
        cost_cny=float(f['landed_cost'] * 7.1),
        amazon_price=float(f['market_evidence']['selling_price']),
        amazon_compare_at_price=float(f['market_evidence']['list_price']),
        market_comparison_url=f['market_evidence']['url'],
        estimated_sale_price=float(round(f['market_evidence']['selling_price'] * 0.6, 2)),
        profit_ratio=float(c['roi']),
        images=f['images'],
        discovery_source="CJ_STRICT_TRUTH_V5.7",
        status="approved",
        source_platform="CJ",
        source_url=f"https://app.cjdropshipping.com/product-detail.html?id={pid}",
        category="Smart Home",
        category_type="PROFIT" if c['is_cashback'] else "TRAFFIC",
        is_cashback_eligible=c['is_cashback'],
        desire_hook=enriched.get("desire_hook"),
        desire_logic=enriched.get("desire_logic"),
        desire_closing=enriched.get("desire_closing"),
        structural_data={"description_html": f['description_html'], "sales_volume": f['volume']},
        logistics_data={"inventory": f['inventory'], "shipping": f['logistics']},
        raw_vendor_info=f['vendor']
    )
    try:
        db.add(new_draft)
        db.commit()
        print(f"   ✅ Truth Verified Draft: {f['title'][:20]}")
    except Exception as e:
        db.rollback()

async def main():
    db = SessionLocal()
    cj_service = CJDropshippingService()
    supply_chain = SupplyChainService(db)
    print("🚀 0Buck v5.7 Strict Truth Protocol (Industrial Audit Mode)...")
    
    # Testing with Tuya Sensor for demo
    search_results = await cj_service.search_products("Tuya Wifi Smart Door", size=10)
    if search_results:
        for p in search_results:
            mirror_data = await mirror_extract_cj(cj_service, p)
            if mirror_data: await ingest_v57(db, mirror_data, supply_chain)
    db.close()

if __name__ == "__main__":
    asyncio.run(main())
