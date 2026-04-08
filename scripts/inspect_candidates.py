import sys
import os
import json
from sqlalchemy import create_engine, text

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.core.config import settings

def inspect_candidates():
    db_uri = 'postgresql://neondb_owner:npg_0XasvoqHEz4Y@ep-still-voice-amdeu23b-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    engine = create_engine(db_uri)
    with engine.connect() as conn:
        try:
            result = conn.execute(text("SELECT title_en_preview, amazon_price, market_comparison_url, status, audit_notes FROM candidate_products WHERE product_id_1688 = '1573652999476621312'"))
            print("Inspecting Target Product:")
            for row in result:
                print(f"- Title: {row[0]}")
                print(f"  Price: {row[1]}")
                print(f"  URL: {row[2]}")
                print(f"  Status: {row[3]}")
                print(f"  Notes: {row[4]}")
                print("-" * 20)
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    inspect_candidates()
