import os
import json
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from decimal import Decimal

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL'))

# Real Amazon Market Prices (Manual Vetting based on web search)
REAL_DATA = {
    "Electric Continuous High Voltage Toy": {"anchor": 25.00, "roi": 2.5}, 
    "Tuya Wifi Smart Door Magnetic Anti-theft Alarm App Push": {"anchor": 15.00, "roi": 1.8}, 
    "Natural crystal bracelet": {"anchor": 18.00, "roi": 2.2}, 
    "AirTag Secure Holder With Key Ring Original Stylish And Durable Key Ring Accessories Gift Keychain": {"anchor": 12.99, "roi": 1.6}, 
    "Winter Heated Jacket USB Electric Cotton Coat Zip-up Heater Thermal Clothing Heating Vest For Men": {"anchor": 69.99, "roi": 2.8},
}

def fix_data():
    with engine.connect() as conn:
        for title_en, data in REAL_DATA.items():
            anchor = data['anchor']
            target = round(anchor * 0.6, 2)
            
            update_query = text("""
                UPDATE candidate_products 
                SET amazon_price = :anchor, 
                    amazon_compare_at_price = :anchor,
                    estimated_sale_price = :target,
                    status = 'approved'
                WHERE title_zh = :title
            """)
            result = conn.execute(update_query, {
                "anchor": float(anchor),
                "target": float(target),
                "title": title_en
            })
            if result.rowcount > 0:
                print(f"✅ Updated {title_en[:30]}... Anchor: ${anchor}, Target: ${target}")
        
        conn.commit()

if __name__ == "__main__":
    fix_data()
