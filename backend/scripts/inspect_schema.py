from sqlalchemy import text
from app.db.session import engine

with engine.connect() as conn:
    res = conn.execute(text("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name='point_transactions'"))
    for row in res.fetchall():
        print(f"Column: {row[0]}, Type: {row[1]}, UDT: {row[2]}")
