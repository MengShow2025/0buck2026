import asyncio
import os
import sys
import json

# Add local backend to path (FORCE HIGHEST PRIORITY)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(project_root, "backend"))

from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker
from app.services.refinery_gateway import RefineryGateway

# 强制指向您的正式数据库 (基于您能连通的逻辑)
DATABASE_URL = "postgresql+pg8000://neondb_owner:npg_MoQh4OvD1HKy@ep-lingering-smoke-amtrqzuh-pooler.c-5.us-east-1.aws.neon.tech/neondb"

async def enrich_and_polish():
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # 1. 找到这 20 个处于待审状态、且没有润色的商品
        candidates = session.execute(text("SELECT id FROM candidate_products WHERE status = 'pending'")).all()
        print(f"✨ Starting AI Refinery for {len(candidates)} products...")

        refinery = RefineryGateway(session)
        
        for c in candidates:
            print(f"✍️ Polishing Candidate ID: {c.id}...")
            # 调用真实的提炼逻辑生成“灵魂文案”
            # 注意：此方法会更新数据库中的 desire_hook, desire_logic, truth_body 等字段
            success = await refinery.refine_candidate(c.id)
            if success:
                print(f"✅ ID {c.id} polished successfully.")
            else:
                print(f"⚠️ ID {c.id} polish failed.")
                
        session.commit()
        print("🎉 All 20 products have been polished with v8.5 Soul Narrative.")

    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    asyncio.run(enrich_and_polish())
