import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    conn.execute(text("TRUNCATE candidate_products RESTART IDENTITY CASCADE"))
    conn.execute(text("TRUNCATE cj_raw_products RESTART IDENTITY CASCADE"))
    conn.commit()
    print('✅ DB Tables truncated.')
