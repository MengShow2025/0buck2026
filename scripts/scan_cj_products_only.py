import asyncio
import sys
import os
import json

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.services.cj_service import CJDropshippingService

async def scan_all_cj_categories():
    service = CJDropshippingService()
    print("🚀 Fetching all categories...")
    categories = await service.get_categories()
    
    if not categories:
        print("❌ No categories found.")
        return
        
    all_candidates = []
    
    # Just take top level categories for now to avoid too many requests
    for cat in categories[:15]: 
        cat_name = cat.get("categoryName")
        cid = cat.get("categoryId")
        print(f"📂 Scanning: {cat_name} ({cid})...")
        
        # Search products in this category (CJ owned only)
        # Increase size to get more products per category
        products = await service.search_products(category_id=cid, size=20, only_cj_owned=True)
        
        print(f"   Found {len(products)} safe-path products.")
        for p in products:
            cost_usd_raw = p.get("sellPrice") or p.get("productSellPrice") or "0"
            if " -- " in str(cost_usd_raw):
                cost_usd = float(str(cost_usd_raw).split(" -- ")[1])
            else:
                cost_usd = float(str(cost_usd_raw))
            
            # Use pid if id is missing
            pid = p.get("id") or p.get("pid")
            
            # Add to list
            all_candidates.append({
                "pid": pid,
                "name": p.get("nameEn") or p.get("productName"),
                "cost_usd": cost_usd,
                "category": cat_name,
                "bigImage": p.get("bigImage") or p.get("productImage")
            })
            
    # Save to raw file
    output_path = "candidates_raw.json"
    with open(output_path, "w") as f:
        json.dump(all_candidates, f, indent=2)
        
    print(f"\n✅ Total {len(all_candidates)} candidates saved to {output_path}")

if __name__ == "__main__":
    asyncio.run(scan_all_cj_categories())
