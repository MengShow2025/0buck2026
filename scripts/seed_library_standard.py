import os
import json
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv('DATABASE_URL'))

# High-Confidence Drafts for Library Demonstration (14-Point Standard)
DEMO_DRAFTS = [
    {
        "pid": "1573652999476621312",
        "title": "Tuya Smart WiFi Door & Window Security Sensor",
        "landed_cost": 15.84,
        "amazon_price": 29.99,
        "amazon_list": 39.99,
        "amazon_url": "https://www.amazon.com/dp/B0CP44H5XG",
        "weight": 0.08,
        "size": {"length": 10, "width": 5, "height": 3},
        "vendor": {"name": "Shenzhen Tuya Intelligence", "rating": 4.8},
        "description": "Professional smart security sensor with real-time app notifications."
    },
    {
        "pid": "1682345678",
        "title": "AuraLift™ 7-Color LED Facial Therapy Mask",
        "landed_cost": 45.20,
        "amazon_price": 129.99,
        "amazon_list": 159.99,
        "amazon_url": "https://www.amazon.com/dp/B08HJX9NSR",
        "weight": 1.25,
        "size": {"length": 30, "width": 25, "height": 15},
        "vendor": {"name": "Artisan Beauty Tech", "rating": 4.9},
        "description": "Medical-grade light therapy for professional skincare results."
    }
]

def seed_library():
    with engine.connect() as conn:
        for d in DEMO_DRAFTS:
            target_price = round(d['amazon_price'] * 0.6, 2)
            roi = round(target_price / d['landed_cost'], 2)
            
            query = text("""
                INSERT INTO candidate_products (
                    product_id_1688, title_zh, title_en_preview, cost_cny, amazon_price, 
                    amazon_compare_at_price, market_comparison_url, estimated_sale_price, 
                    profit_ratio, images, discovery_source, status, source_platform, 
                    source_url, logistics_data, structural_data, raw_vendor_info
                ) VALUES (
                    :pid, :title, :title, :cost_cny, :amz_p, :amz_list, :amz_url, :target, 
                    :roi, '[]', 'MASTER_INGEST_V5.9.3', 'draft', 'CJ', 
                    :source_url, :logis, :struct, :vendor
                ) ON CONFLICT (product_id_1688) DO UPDATE SET status = 'draft'
            """)
            
            conn.execute(query, {
                "pid": d['pid'], "title": d['title'], "cost_cny": d['landed_cost'] * 7.1,
                "amz_p": d['amazon_price'], "amz_list": d['amazon_list'], "amz_url": d['amazon_url'],
                "target": target_price, "roi": roi,
                "source_url": f"https://app.cjdropshipping.com/product-detail.html?id={d['pid']}",
                "logis": json.dumps({"shipping": {"product_weight": d['weight'], "weight_unit": "kg", "packing_size": d['size']}}),
                "struct": json.dumps({"description_html": f"<p>{d['description']}</p>"}),
                "vendor": json.dumps(d['vendor'])
            })
        conn.commit()
        print(f"✅ Seeded {len(DEMO_DRAFTS)} Standardized Drafts into Library.")

if __name__ == "__main__":
    seed_library()
