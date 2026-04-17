from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv('.env')

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN inventory_detail JSONB DEFAULT '{}';"))
        print("Added products.inventory_detail")
    except Exception as e:
        print(e)
        
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN sales_volume INTEGER DEFAULT 0;"))
        print("Added products.sales_volume")
    except Exception as e:
        print(e)
        
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN sell_price FLOAT;"))
        print("Added products.sell_price")
    except Exception as e:
        print(e)

print("Done.")
