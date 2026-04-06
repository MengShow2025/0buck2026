import sys
import os
import json
import sqlalchemy
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# --- Configuration (From backend/.env) ---
# Neon PostgreSQL URL
NEON_DB_URL = "postgresql://neondb_owner:npg_0XasvoqHEz4Y@ep-still-voice-amdeu23b-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
JSON_DATA_PATH = "data/1688/reset_rebuild_2_products.json"

def sync_to_neon():
    print("🚀 Syncing to NEON PostgreSQL Database...")
    try:
        # 1. Connect to Neon
        engine = create_engine(NEON_DB_URL)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        # 2. Check if table exists and clear it
        print("🧹 Clearing 'products' table in Neon...")
        db.execute(text("DELETE FROM products"))
        db.commit()
        
        # 3. Load Data
        with open(JSON_DATA_PATH, 'r') as f:
            data = json.load(f)
            
        # 4. Insert Products
        # Using column names from local DB check
        for product in data['products']:
            print(f"📦 Inserting {product['name']} into Neon...")
            db.execute(text("""
                INSERT INTO products (
                    product_id_1688, 
                    title_en, 
                    source_cost_usd, 
                    sale_price, 
                    compare_at_price,
                    is_active,
                    is_reward_eligible
                ) VALUES (:p1688, :title, :cost, :sale, :compare, :active, :reward)
            """), {
                "p1688": product['id'],
                "title": product['name'],
                "cost": product['source_1688']['final_sourcing_cost_usd'],
                "sale": product['market_analysis']['suggested_sale_price'],
                "compare": product['market_analysis']['amazon_price'],
                "active": True,
                "reward": True
            })
        
        db.commit()
        db.close()
        print("✨ Neon DB Sync Completed Successfully.")
        
    except Exception as e:
        print(f"❌ Error syncing to Neon: {str(e)}")

if __name__ == "__main__":
    sync_to_neon()
