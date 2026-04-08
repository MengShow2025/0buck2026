from sqlalchemy import create_engine, text
import sys
import os

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.core.config import settings

def delete_target():
    db_uri = 'postgresql://neondb_owner:npg_0XasvoqHEz4Y@ep-still-voice-amdeu23b-pooler.c-5.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require'
    engine = create_engine(db_uri)
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM candidate_products WHERE product_id_1688 = '1573652999476621312'"))
        conn.commit()
        print("Deleted.")

if __name__ == "__main__":
    delete_target()
