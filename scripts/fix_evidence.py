import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    try:
        conn.execute(text('ALTER TABLE candidate_products ADD COLUMN evidence JSONB DEFAULT \'{}\''))
        conn.commit()
        print('✅ Column evidence added')
    except Exception as e:
        print(f"evidence error: {e}")
