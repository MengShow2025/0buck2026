import asyncio
import sys
import os
import json
from decimal import Decimal

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.db.session import SessionLocal
from app.models.product import CandidateProduct
from app.services.cj_service import CJDropshippingService

async def generate_roi_matrix():
    db = SessionLocal()
    candidates = db.query(CandidateProduct).filter(CandidateProduct.status == "new").all()
    
    print(f"📊 Generating ROI Matrix for {len(candidates)} candidates...")
    print("-" * 80)
    print(f"{'Product Name':<30} | {'CJ ROI':<8} | {'YunEx ROI':<8} | {'Decision'}")
    print("-" * 80)
    
    results = []
    
    for c in candidates:
        # 1. CJ Landed Cost
        cj_landed = c.discovery_evidence.get("landed_cost_usd", 0)
        target_price = c.estimated_sale_price
        cj_roi = target_price / cj_landed if cj_landed > 0 else 0
        
        # 2. YunExpress Hypothetical (Mock for now since Auth failed)
        # Landed = Cost(1688) + YunExpress(Freight) + ServiceFee
        cost_usd = c.cost_cny / 7.1
        yunex_freight = 10.0 # Mock $10 flat for now
        yunex_landed = cost_usd + yunex_freight
        yunex_roi = target_price / yunex_landed if yunex_landed > 0 else 0
        
        decision = "CJ" if cj_roi >= yunex_roi else "YunExpress"
        if cj_roi < 1.5 and yunex_roi < 1.5:
            decision = "PASS"
            
        print(f"{c.title_en_preview[:30]:<30} | {round(cj_roi, 2):<8}x | {round(yunex_roi, 2):<8}x | {decision}")
        
        results.append({
            "name": c.title_en_preview,
            "cj_roi": float(cj_roi),
            "yunex_roi": float(yunex_roi),
            "decision": decision
        })
    
    # Save as deliverable
    output_path = os.path.join(project_root, "deliverables/roi_matrix_v5.3.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
        
    print(f"\n✅ ROI Matrix saved to {output_path}")
    db.close()

if __name__ == "__main__":
    asyncio.run(generate_roi_matrix())
