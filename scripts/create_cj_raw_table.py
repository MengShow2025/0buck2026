import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    try:
        # Create cj_raw_products table to store original CJ data
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS cj_raw_products (
                id SERIAL PRIMARY KEY,
                cj_pid VARCHAR(255) UNIQUE,
                raw_json JSONB,
                title_en TEXT,
                source_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.commit()
        print('✅ Table cj_raw_products created.')
    except Exception as e:
        print(f"Error creating table: {e}")
