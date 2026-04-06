import asyncio
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add project root to path
project_root = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck"
backend_path = os.path.join(project_root, "backend")
if backend_path not in sys.path:
    sys.path.append(backend_path)

# Explicitly load .env from backend/
load_dotenv(os.path.join(backend_path, ".env"))

# Use DATABASE_URL from environment or fallback to the known Neon URL
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    DATABASE_URL = "postgresql://neondb_owner:npg_0XasvoqHEz4Y@ep-still-voice-amdeu23b-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

from app.db.session import SessionLocal
from app.services.supply_chain import SupplyChainService
from app.models.product import Base

async def reset_neon_and_ingest():
    engine = create_engine(DATABASE_URL)
    print(f"🧨 Resetting Neon DB: {DATABASE_URL.split('@')[-1]}")
    
    # 1. Drop all tables
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped.")
    
    # 2. Recreate all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Tables recreated.")
    
    # 3. Ingest candidates
    db = sessionmaker(bind=engine)()
    sc_service = SupplyChainService(db)
    
    candidates = [
        {
            "name": "Magnetic Levitating Moon Lamp | 3D Printed Floating Night Light",
            "id_1688": "642893120559",
            "cost_cny": 55.0,
            "comp_price": 189.99,
            "category": "Artisan Tech & Gadgets",
            "description_zh": "利用磁悬浮技术让月球灯悬浮并在空中旋转，3D打印纹理逼真。支持暖黄、冷白两色切换。",
            "images": ["https://img.alicdn.com/imgextra/i4/2206623631102/O1CN01J9lU8X1W9I7R8Q5fH_!!2206623631102.jpg"],
            "discovery_evidence": {"trend_score": 98, "tiktok_views": "2.4M", "source": "IDS_FOLLOWING"},
            "supplier_id_1688": "sup_levitation_master",
            "supplier_info": {"name": "东莞市悬浮电子科技有限公司", "rating": 4.9, "is_strength": True}
        },
        {
            "name": "Minimalist Electric Gooseneck Kettle | Wood Handle Precision Pour-Over",
            "id_1688": "721094831204",
            "cost_cny": 85.0,
            "comp_price": 249.00,
            "category": "Artisan Smart Living",
            "description_zh": "哑光黑涂层配合实木手柄，精准控温，长颈壶嘴确保手冲咖啡水流极其稳定。极简主义设计。",
            "images": ["https://img.alicdn.com/imgextra/i2/2208154823419/O1CN01XqA7zJ1uE0sXqQ8Y7_!!2208154823419.jpg"],
            "discovery_evidence": {"trend_score": 92, "ig_engagement": "High", "source": "IDS_SPY"},
            "supplier_id_1688": "sup_precision_brew",
            "supplier_info": {"name": "佛山市匠心电器有限公司", "rating": 4.8, "is_strength": True}
        },
        {
            "name": "RGB Nixie Tube Clock | Retro Cyberpunk Desktop Glow",
            "id_1688": "685930214857",
            "cost_cny": 155.0,
            "comp_price": 450.00,
            "category": "Artisan Tech & Gadgets",
            "description_zh": "现代RGB LED模拟复古辉光管，胡桃木底座，支持手机APP调节颜色和显示模式。赛博朋克风格桌面摆件。",
            "images": ["https://img.alicdn.com/imgextra/i3/2210485930214/O1CN01Z7y5S11W9I7R8Q5fH_!!2210485930214.jpg"],
            "discovery_evidence": {"trend_score": 95, "reddit_upvotes": "5.2k", "source": "C2M_WISH"},
            "supplier_id_1688": "sup_glow_labs",
            "supplier_info": {"name": "深圳市辉光实验室科技有限公司", "rating": 5.0, "is_strength": True}
        }
    ]
    
    for cand in candidates:
        try:
            cand["strategy_tag"] = cand["discovery_evidence"]["source"]
            await sc_service.ingest_to_candidate_pool(cand)
            print(f"  ✅ Ingested: {cand['name']}")
        except Exception as e:
            print(f"  ❌ Failed {cand['name']}: {e}")
            
    db.close()

if __name__ == "__main__":
    asyncio.run(reset_neon_and_ingest())
