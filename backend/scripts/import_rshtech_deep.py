
import sqlite3
import json
from datetime import datetime

def import_rshtech_data():
    db_path = "backend/0buck_test.db"
    json_path = "data/1688/supplier_rshtech_deep_extract.json"
    
    with open(json_path, "r") as f:
        data = json.load(f)
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Insert/Update Supplier
    supplier_id_1688 = "rshtech"
    company = data["company_identity"]
    scores = data["key_scores"]
    scale = data["factory_profile"]
    visuals = data["visual_assets"]
    dynamics = data["merchant_dynamics"]
    product_series = data["product_series"]
    
    cursor.execute("""
        INSERT OR REPLACE INTO suppliers (
            supplier_id_1688, name, logo_url, address, rating, 
            is_strength_merchant, scores, scale, vr_showroom_url, 
            visuals, dynamics, product_series, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        supplier_id_1688, 
        company["name"], 
        company.get("logo_url"), 
        company.get("address"), 
        4.0, # Mock rating
        "超级工厂" in company["ratings"].get("factory_rank", ""),
        json.dumps(scores),
        json.dumps(scale),
        visuals.get("vr_showroom_url"),
        json.dumps(visuals),
        json.dumps(dynamics),
        json.dumps(product_series),
        datetime.now().isoformat(),
        datetime.now().isoformat()
    ))
    
    supplier_id = cursor.lastrowid
    print(f"✅ Supplier {company['name']} imported with ID {supplier_id}")
    
    # 2. Insert Sample Products with Pricing Logic
    exchange_rate = 0.14
    
    for i, p in enumerate(data.get("product_listing_sample", [])):
        cost_cny = float(p["price"].replace("¥", ""))
        cost_usd = round(cost_cny * exchange_rate, 2)
        
        # Pricing Logic based on User Strategy:
        # Default to PROFIT (4x) for 0Buck core logic unless specified
        # Here we demonstrate the split
        if i % 2 == 0: # Half Profit, Half Traffic for demo
            multiplier = 4.0
            p_type = "PROFIT"
            is_cashback = True
        else:
            multiplier = 1.5
            p_type = "TRAFFIC"
            is_cashback = False
            
        sale_price = round(cost_usd * multiplier, 2)
        compare_at = round(sale_price * 1.5, 2)
        
        product_id_1688 = f"rsh_demo_{i}"
        
        cursor.execute("""
            INSERT OR REPLACE INTO products (
                product_id_1688, title_zh, source_cost_usd, sale_price, 
                compare_at_price, product_category_type, is_cashback_eligible, 
                supplier_id, strategy_tag, is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            product_id_1688,
            p["title"],
            cost_usd,
            sale_price,
            compare_at,
            p_type,
            is_cashback,
            supplier_id,
            "RSHTECH_DEEP",
            True,
            datetime.now().isoformat(),
            datetime.now().isoformat()
        ))
        
    conn.commit()
    conn.close()
    print(f"✅ Imported {len(data['product_listing_sample'])} sample products for rshtech.")

if __name__ == "__main__":
    import_rshtech_data()
