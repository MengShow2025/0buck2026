
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
from backend.app.services.supply_chain import SupplyChainService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def batch_enrich_candidates():
    db = SessionLocal()
    supply_chain_service = SupplyChainService(db)
    
    try:
        # Fetch 'new' candidates that need enrichment
        candidates = db.query(CandidateProduct).filter(
            CandidateProduct.status == "new",
            (CandidateProduct.desire_hook == None) | (CandidateProduct.desire_hook == "") | (CandidateProduct.desire_hook == "Pain point hook...")
        ).all()
        
        logger.info(f"🚀 Found {len(candidates)} candidates for Desire Engine enrichment.")
        
        for i, candidate in enumerate(candidates):
            logger.info(f"[{i+1}/{len(candidates)}] Enriching Candidate: {candidate.title_zh[:30]}...")
            
            # Format candidate as details for translation logic
            raw_data = supply_chain_service._format_candidate_as_details(candidate)
            
            # Run AI enrichment
            enriched = await supply_chain_service.translate_and_enrich(raw_data, strategy="IDS_FOLLOWING")
            
            # Update candidate
            candidate.title_en_preview = enriched.get("title_en")
            candidate.description_en_preview = enriched.get("description_en")
            candidate.desire_hook = enriched.get("desire_hook")
            candidate.desire_logic = enriched.get("desire_logic")
            candidate.desire_closing = enriched.get("desire_closing")
            
            db.commit()
            logger.info(f"✅ Enriched: {candidate.title_en_preview[:30]}...")
            
    except Exception as e:
        logger.error(f"❌ Batch enrichment failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(batch_enrich_candidates())
