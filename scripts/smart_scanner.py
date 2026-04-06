import asyncio
import logging
import sys
import os

# Ensure project root is in sys.path to resolve imports like 'app.core.config'
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.db.session import SessionLocal
from app.services.smart_business import SmartBusinessService

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger(__name__)

async def run_scan():
    db = SessionLocal()
    try:
        service = SmartBusinessService(db)
        await service.scan_all()
    except Exception as e:
        logger.error(f"Error during smart scan: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(run_scan())
