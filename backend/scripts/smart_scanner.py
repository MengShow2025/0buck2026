import asyncio
import logging
import os
import sys

# Add the parent directory to sys.path to allow importing from 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.services.smart_business import SmartBusinessService
from app.services.supply_chain import SupplyChainService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_scanner():
    """
    v4.6: Global Smart Business & Sourcing Orchestrator.
    Runs every 6 hours.
    
    1. Smart Business: Price Radar, Churn, Abandoned Drafts.
    2. Sourcing (Artisan-Master): IDS Sniffing & Spying -> Candidate Pool.
    3. Asset Enrichment: AI Translation, 1:1 Mirroring & Social Evidence.
    """
    logger.info("🚀 Starting 6-hour Global Orchestrator (v4.6)...")
    db = SessionLocal()
    try:
        # 1. Trigger all Smart Business logic (Price Radar, Churn, etc.)
        business_service = SmartBusinessService(db)
        await business_service.scan_all()
        
        # Note: business_service.scan_all() already triggers 
        # sourcing_candidates inside, so we don't need to double-call here.
        
        logger.info("✅ Global Orchestrator completed successfully.")
    except Exception as e:
        logger.error(f"❌ Error during Global Orchestrator: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    # If using an async loop from another process, we use asyncio.run
    asyncio.run(run_scanner())
