from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv('.env')

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN inventory_detail JSONB DEFAULT '{}';"))
        conn.commit()
        print("Added products.inventory_detail")
    except Exception as e:
        conn.rollback()
        print(e)
        
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN sales_volume INTEGER DEFAULT 0;"))
        conn.commit()
        print("Added products.sales_volume")
    except Exception as e:
        conn.rollback()
        print(e)
        
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN sell_price FLOAT;"))
        conn.commit()
        print("Added products.sell_price")
    except Exception as e:
        conn.rollback()
        print(e)

print("Done.")
