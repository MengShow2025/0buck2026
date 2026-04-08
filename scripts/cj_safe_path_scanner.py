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

async def find_market_evidence(name, landed_cost):
    """v5.9.3: Flexible Evidence Extractor for Demo."""
    from app.services.tools import _web_search_func
    
    evidence = {
        "selling_price": 0.0, "list_price": 0.0, "market_url": "", 
        "pack_size": 1, "unit_selling_price": 0.0, "unit_list_price": 0.0,
        "identity_confirmed": False
    }
    
    try:
        # 1. Search without site restriction for broader snippets
        search_query = f"{name} amazon price"
        results = await _web_search_func(search_query)
        
        if results and isinstance(results, list):
            for res in results:
                url = res.get("url", "").lower()
                if "amazon.com" in url:
                    # Found an Amazon link
                    amz_title = (res.get("title") or "").lower()
                    text_blob = (amz_title + " " + (res.get("text") or "")).lower()
                    
                    # More robust price regex
                    price_matches = re.findall(r'\$\s?(\d+(?:\.\d{2})?)', text_blob)
                    if price_matches:
                        prices = sorted([float(p) for p in price_matches if float(p) > 1.0])
                        if prices:
                            evidence["selling_price"] = prices[0]
                            evidence["list_price"] = prices[-1] if len(prices) > 1 else prices[0] * 1.2
                            evidence["unit_selling_price"] = evidence["selling_price"]
                            evidence["unit_list_price"] = evidence["list_price"]
                            evidence["market_url"] = res.get("url")
                            evidence["identity_confirmed"] = True
                            print(f"      ✨ Evidence Captured: ${evidence['unit_selling_price']} from {url[:40]}...")
                            return evidence
    except Exception as e:
        print(f"      ⚠️ Search Error: {e}")
    return evidence

async def mirror_extract_cj(cj_service, p, sc):
    """Mirror Extractor following the strict 14-point standard."""
    pid = p.get("pid") or p.get("id")
    name = p.get("productNameEn") or p.get("nameEn") or "Unknown Product"
    
    # 1. Landed Cost
    price_usd_raw = p.get("productPrice") or p.get("sellPrice") or 0.0
    try: price_usd = float(str(price_usd_raw).split(" -- ")[-1])
    except: price_usd = 0.0
    
    freight_list = await cj_service.get_freight_estimate(pid, "US")
    freight = 10.0
    if freight_list:
        try:
            cheapest = min([f for f in freight_list if f], key=lambda x: float(x.get("freightFee", 999)))
            freight = float(cheapest.get("freightFee", 10.0))
        except: pass
    landed_cost = price_usd + freight

    # 2. Deep Audit
    print(f"   🔍 14-Point Audit: {name[:30]}... Cost: ${landed_cost:.2f}")
    evidence = await find_market_evidence(name, landed_cost)
    
    if not evidence["identity_confirmed"] or evidence["unit_selling_price"] <= 0:
        print(f"   ⏭️ Skip: Unreliable evidence or identity mismatch.")
        return None
        
    m_sell = evidence["unit_selling_price"]
    target_price = round(m_sell * 0.6, 2)
    
    # 3. Model Logic: MUST cover cost.
    if target_price < landed_cost:
        print(f"   🚫 Ineligible: Model Price ${target_price} < Cost ${landed_cost:.2f}.")
        return None

    # 4. Comprehensive Extraction (14 Points)
    detail = await cj_service.get_product_detail(pid)
    if not detail: return None
    
    # Physical Specs
    p_w_raw = safe_float(detail.get("productWeight"))
    product_weight = p_w_raw / 1000.0 if p_w_raw > 5.0 else p_w_raw
    packing_size = {
        "length": detail.get("packingLength", 0),
        "width": detail.get("packingWidth", 0),
        "height": detail.get("packingHeight", 0)
    }
    
    img_list = []
    if detail.get("productImage"): img_list = detail.get("productImage").split(",")
    img_list = [img if img.startswith("http") else f"https:{img}" if img.startswith("//") else img for img in img_list if img]

    return {
        "raw_data": p,
        "standard_fields": {
            "title": name, "sku": detail.get("sku") or f"CJ-{pid}", "price": target_price,
            "cost": landed_cost, "amazon_price": m_sell, "amazon_list": evidence["unit_list_price"],
            "amazon_url": evidence["market_url"], "weight": round(product_weight, 3),
            "size": packing_size, "images": img_list, "description_html": detail.get("description", ""),
            "inventory": detail.get("cjInventory", 0) + detail.get("factoryInventory", 0),
            "vendor": {"name": detail.get("shopName"), "rating": detail.get("shopRating")},
            "category": p.get("categoryName") or "General"
        }
    }

async def run_silent_ingestion():
    db = SessionLocal()
    cj = CJDropshippingService()
    sc = SupplyChainService(db)
    
    print("🚀 0Buck v5.9.2 Silent Master Ingestion (Draft Library Mode)...")
    
    search_keywords = ["Mini Smart WiFi Gateway", "Portable Neck Fan USB"]
    for kw in search_keywords:
        print(f"\n📂 Ingesting Platform Category: {kw}")
        results = await cj.search_products(kw, size=5)
        if results:
            for p in results:
                try:
                    exists = db.query(CandidateProduct).filter_by(product_id_1688=p.get('pid')).first()
                    if exists: continue
                    
                    await asyncio.sleep(1.0)
                    data = await mirror_extract_cj(cj, p, sc)
                    if data:
                        f = data['standard_fields']
                        # Ingest STRICTLY to Draft Library
                        new_cand = CandidateProduct(
                            product_id_1688=p.get('pid'), title_zh=f['title'], title_en_preview=f['title'],
                            cost_cny=f['cost'] * 7.1, amazon_price=f['amazon_price'], amazon_compare_at_price=f['amazon_list'],
                            market_comparison_url=f['amazon_url'], estimated_sale_price=f['price'],
                            profit_ratio=f['price'] / f['cost'], images=f['images'],
                            discovery_source="MASTER_INGEST_V5.9.2", status="draft", # SET TO DRAFT ONLY
                            source_platform="CJ", source_url=f"https://app.cjdropshipping.com/product-detail.html?id={p.get('pid')}",
                            structural_data={"description_html": f['description_html']},
                            logistics_data={"shipping": {"product_weight": f['weight'], "weight_unit": "kg", "packing_size": f['size']}},
                            raw_vendor_info=f['vendor']
                        )
                        db.add(new_cand)
                        db.commit()
                        print(f"      ✅ Draft Logged: {f['title'][:25]}")
                except Exception as e: print(f"      ❌ Ingest Error: {e}")
    db.close()

if __name__ == "__main__":
    asyncio.run(run_silent_ingestion())
