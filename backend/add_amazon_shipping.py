from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv
load_dotenv('.env')

engine = create_engine(os.getenv('DATABASE_URL'))
with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE candidate_products ADD COLUMN amazon_shipping_cost FLOAT DEFAULT 0.0;"))
        print("Added candidate_products.amazon_shipping_cost")
    except Exception as e:
        print(e)
        
    try:
        conn.execute(text("ALTER TABLE products ADD COLUMN amazon_shipping_cost FLOAT DEFAULT 0.0;"))
        print("Added products.amazon_shipping_cost")
    except Exception as e:
        print(e)
