import asyncio
import sys
import os
import json

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.db.session import SessionLocal
from app.services.cj_service import CJDropshippingService
from app.services.supply_chain import SupplyChainService
from scripts.cj_safe_path_scanner import mirror_extract_cj, ingest_v56

async def scan_specific_pid(pid):
    db = SessionLocal()
    cj_service = CJDropshippingService()
    supply_chain = SupplyChainService(db)
    
    print(f"🚀 Targeting Specific PID: {pid} (Truth Audit Mode)...")
    
    # 1. Fetch from CJ
    detail = await cj_service.get_product_detail(pid)
    if detail:
        print(f"✅ Found product: {detail.get('productNameEn')}")
        # 2. Extract 14 Points
        mirror_data = await mirror_extract_cj(cj_service, detail, "Tuya Smart Home")
        if mirror_data:
            # 3. Ingest
            await ingest_v56(db, mirror_data, supply_chain)
    else:
        print("❌ Product not found on CJ.")
    
    db.close()

if __name__ == "__main__":
    pid = "1573652999476621312" # Tuya Door Alarm from user
    asyncio.run(scan_specific_pid(pid))
