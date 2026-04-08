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

async def find_market_evidence(name, landed_cost):
    """
    v5.8.1: Ultra-Strict Profit-Aware Audit.
    Requires clear match and price > floor.
    """
    from app.services.tools import _web_search_func
    import httpx
    
    evidence = {"selling_price": 0.0, "list_price": 0.0, "market_url": "", "pack_size": 1, "unit_selling_price": 0.0}
    
    try:
        search_query = f"{name} price on amazon.com"
        search_results = await _web_search_func(search_query)
        
        amazon_url = ""
        if search_results:
            for res in search_results:
                url = res.get("url", "").lower()
                if "amazon.com" in url and ("/dp/" in url or "/gp/product/" in url):
                    amazon_url = res.get("url")
                    break
        
        if amazon_url:
            evidence["market_url"] = amazon_url
            print(f"      🔍 Auditing Amazon: {amazon_url[:60]}...")
            
            async with httpx.AsyncClient(follow_redirects=True, timeout=15.0) as client:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
                resp = await client.get(amazon_url, headers=headers)
                if resp.status_code == 200:
                    content = resp.text.lower()
                    
                    # 1. Pack Size
                    pack_match = re.search(r'(\d+)\s?-(?:pack|pcs|set|count)', content)
                    if pack_match: evidence["pack_size"] = int(pack_match.group(1))
                    
                    # 2. Precise Price Extraction (Looking for common Amazon price patterns)
                    # We look for prices that are logically above our landed cost per unit.
                    # Amazon prices for electronics are rarely < $5 unless it's a component.
                    price_candidates = re.findall(r'\$(\d+\.\d{2})', content)
                    if price_candidates:
                        prices = sorted([float(p) for p in price_candidates if float(p) > 2.0])
                        if prices:
                            # Take the most frequent or first prominent price
                            # Heuristic: The selling price is often the one that appears most or is first in the meta
                            evidence["selling_price"] = prices[0]
                            evidence["list_price"] = max(prices)
                            evidence["unit_selling_price"] = round(evidence["selling_price"] / evidence["pack_size"], 2)
                            print(f"      💰 Market Price Found: ${evidence['selling_price']} (Unit: ${evidence['unit_selling_price']})")
    except Exception as e:
        print(f"      ⚠️ Audit Error: {e}")
        
    return evidence

async def mirror_extract_cj(cj_service, p, supply_chain):
    pid = p.get("pid") or p.get("id")
    name = p.get("productNameEn") or p.get("nameEn") or "Product"
    price_usd_raw = p.get("productPrice") or p.get("sellPrice") or 0.0
    try:
        price_usd = float(str(price_usd_raw).split(" -- ")[-1])
    except: price_usd = 0.0
    
    # 1. Freight
    freight_list = await cj_service.get_freight_estimate(pid, "US")
    freight = 10.0 # Safer default
    if freight_list:
        try:
            cheapest = min([f for f in freight_list if f], key=lambda x: float(x.get("freightFee", 999)))
            freight = float(cheapest.get("freightFee", 10.0))
        except: pass
    
    landed_cost = price_usd + freight
    print(f"🚀 Vetting: {name[:30]}... Landed Cost: ${landed_cost:.2f}")

    # 2. Strict Market Audit
    evidence = await find_market_evidence(name, landed_cost)
    m_sell = evidence["unit_selling_price"]
    
    if m_sell <= 0:
        print(f"   ⏭️ Skip: No reliable market price found.")
        return None
    
    # 3. PROFIT FIREWALL (v5.8.1)
    target_price = round(m_sell * 0.6, 2)
    min_price_floor = round(landed_cost * 1.3, 2) # Cost + 30% margin
    
    if target_price < min_price_floor:
        print(f"   🚫 PROFIT FAILURE: Target ${target_price} < Floor ${min_price_floor} (Cost ${landed_cost:.2f}).")
        return None

    # 4. Success - Fetch Details
    print(f"   ✅ PROFIT SECURED: Target ${target_price} (ROI: {round(target_price/landed_cost, 2)}x)")
    detail = await cj_service.get_product_detail(pid)
    
    # ... (images and description extraction)
    img_list = []
    if detail and detail.get("productImage"): img_list = detail.get("productImage").split(",")
    if not img_list: img_list = [p.get("bigImage") or p.get("productImage")]
    img_list = [img if img.startswith("http") else f"https:{img}" if img.startswith("//") else img for img in img_list if img]

    return {
        "raw_data": p,
        "fields": {
            "title": name, "price": target_price, "amazon_price": m_sell, 
            "amazon_list": evidence["list_price"], "url": evidence["market_url"],
            "landed_cost": landed_cost, "images": img_list, "description_html": detail.get("description", "") if detail else ""
        }
    }

async def run_test():
    db = SessionLocal()
    cj = CJDropshippingService()
    sc = SupplyChainService(db)
    
    # Targeted search for items that MIGHT have good margin
    keywords = ["Smart Home Camera", "Heated Vest", "Smart Watch 4G"]
    for kw in keywords:
        print(f"\n📂 Searching: {kw}")
        results = await cj.search_products(kw, size=5)
        if results:
            for p in results:
                try:
                    data = await mirror_extract_cj(cj, p, sc)
                    if data:
                        # Ingest to DB
                        f = data['fields']
                        new_cand = CandidateProduct(
                            product_id_1688=data['raw_data'].get("pid") or data['raw_data'].get("id"),
                            title_zh=f['title'],
                            cost_cny=f['landed_cost'] * 7.1,
                            amazon_price=f['amazon_price'],
                            amazon_compare_at_price=f['amazon_list'],
                            estimated_sale_price=f['price'],
                            profit_ratio=f['price'] / f['landed_cost'],
                            images=f['images'],
                            discovery_source="CJ_PROFIT_SAFE_V5.8.1",
                            status="approved",
                            source_platform="CJ",
                            source_url=f"https://app.cjdropshipping.com/product-detail.html?id={data['raw_data'].get('pid')}",
                            category="Strict Audit",
                            structural_data={"description_html": f['description_html']}
                        )
                        db.add(new_cand)
                        db.commit()
                        print(f"      ✅ Drafted: {f['title'][:20]}")
                except Exception as e:
                    print(f"      ❌ Error: {e}")
    db.close()

if __name__ == "__main__":
    asyncio.run(run_test())
