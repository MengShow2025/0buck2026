import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    # Upgrade candidate_products for industrial-grade draft standard
    try:
        conn.execute(text("ALTER TABLE candidate_products ADD COLUMN market_comparison_url TEXT"))
        print('✅ Added market_comparison_url column.')
    except Exception as e:
        print(f"market_comparison_url exists or error: {e}")

    try:
        conn.execute(text("ALTER TABLE candidate_products ADD COLUMN raw_vendor_info JSONB DEFAULT '{}'"))
        print('✅ Added raw_vendor_info column.')
    except Exception as e:
        print(f"raw_vendor_info exists or error: {e}")

    conn.commit()
    print('✅ DB Draft Standard Upgrade complete.')
