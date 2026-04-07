
import asyncio
import logging
import os
import sys

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
sys.path.append(os.path.join(project_root, "backend"))

from backend.app.db.session import SessionLocal
from backend.app.models.product import CandidateProduct

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Manual mapping for testing (The results of our manual search)
TEST_MAPPING = {
    13: {
        "url": "https://www.alibaba.com/product-detail/High-Quality-Wooden-Handle-Coffee-Pot_1601418031704.html",
        "price": 19.0
    },
    15: {
        "url": "https://www.alibaba.com/product-detail/Glomarket-Tuya-Smart-Home-WiFi-Smart_1601639954237.html",
        "price": 28.0
    },
    16: {
        "url": "https://www.alibaba.com/product-detail/DENIXI-S12-New-Smartwatch-IP67-Waterproof_1601649762282.html",
        "price": 14.0
    }
}

async def manual_sniff():
    db = SessionLocal()
    try:
        for cid, data in TEST_MAPPING.items():
            candidate = db.query(CandidateProduct).filter_by(id=cid).first()
            if candidate:
                logger.info(f"🚀 Manually Sniffing Alibaba for Candidate {cid}: {candidate.title_zh[:30]}...")
                candidate.backup_source_url = data["url"]
                candidate.alibaba_comparison_price = data["price"]
                db.commit()
                logger.info(f"✅ Success: Linked to {data['url']}")
            else:
                logger.warning(f"⚠️ Candidate {cid} not found.")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(manual_sniff())
