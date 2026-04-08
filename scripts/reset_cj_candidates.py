import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    conn.execute(text("UPDATE candidate_products SET status = 'approved' WHERE source_platform = 'CJ'"))
    conn.commit()
    print('✅ Reset CJ candidates to approved in DB.')
