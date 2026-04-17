from sqlalchemy import text
from app.db.session import engine

with engine.connect() as conn:
    res = conn.execute(text("SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE pg_type.typname = 'pointsource'"))
    print(f"Allowed values for 'pointsource': {[row[0] for row in res.fetchall()]}")
