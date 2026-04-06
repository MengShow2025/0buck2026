import json
import sqlite3

LOCAL_DB_PATH = "backend/0buck_test.db"

TEST_CANDIDATES = [
    {
        "name": "Magnetic Levitating Moon Lamp | 3D Printed Floating Night Light",
        "product_id_1688": "720987345612",
        "cost_cny": 158.00,
        "comp_price_usd": 129.99,
        "discovery_source": "IDS_SPY",
        "supplier_name": "Magic Light Technology Co., Ltd.",
        "images": ["https://sc01.alicdn.com/kf/H7829283928392839.jpg", "https://sc01.alicdn.com/kf/A5d89e78f9167460fb41dbc315304d8b5t.png"],
        "hook": "Why buy a regular lamp when you can own the moon? Defy gravity and elevate your nights.",
        "logic": "The $300 version from premium retailers comes from the same workshop. We stripped the branding to give you the magic at 60% of the price.",
        "closing": "Join the 500-day check-in ritual to claim your rebate."
    },
    {
        "name": "Minimalist Electric Gooseneck Kettle | Wood Handle Precision Pour-Over",
        "product_id_1688": "840389952710",
        "cost_cny": 185.00,
        "comp_price_usd": 159.99,
        "discovery_source": "IDS_FOLLOWING",
        "supplier_name": "Artisan Brewware Factory",
        "images": ["https://sc01.alicdn.com/kf/A5d89e78f9167460fb41dbc315304d8b5t.png", "https://sc01.alicdn.com/kf/Ac6b857f333ec471e878533da918f3ed6B.png"],
        "hook": "Your morning ritual deserves precision. Don't settle for uneven brews.",
        "logic": "Sourced from the factory behind world-renowned barista brands. Same heating core, same precision, better price.",
        "closing": "Start your journey with us today."
    },
    {
        "name": "RGB Nixie Tube Clock | Retro Cyberpunk Desktop Glow",
        "product_id_1688": "610234567890",
        "cost_cny": 245.00,
        "comp_price_usd": 219.99,
        "discovery_source": "C2M_WISH",
        "supplier_name": "Neon Dreams Electronic Tech",
        "images": ["https://sc01.alicdn.com/kf/Ac6b857f333ec471e878533da918f3ed6B.png", "https://sc01.alicdn.com/kf/H7829283928392839.jpg"],
        "hook": "Capture the essence of time in a retro-future glow. The ultimate desk centerpiece.",
        "logic": "This artisan piece bypasses luxury importers. Pure components, pure craftsmanship, pure cyberpunk.",
        "closing": "Claim your piece of the future."
    }
]

def inject():
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()

    for cand in TEST_CANDIDATES:
        sale_price = round(cand["comp_price_usd"] * 0.6, 2)
        cost_usd_buffered = (cand["cost_cny"] * 1.04) * 0.14
        
        cursor.execute("""
            INSERT INTO candidate_products (
                product_id_1688, status, discovery_source, discovery_evidence,
                title_zh, description_zh, images, cost_cny, comp_price_usd, estimated_sale_price,
                profit_ratio, supplier_id_1688, supplier_info, title_en_preview, description_en_preview,
                desire_hook, desire_logic, desire_closing, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, (
            cand["product_id_1688"], 'new', cand["discovery_source"], json.dumps({"test": True}),
            cand["name"], cand["name"], json.dumps(cand["images"]), cand["cost_cny"], 
            cand["comp_price_usd"], sale_price, round(sale_price / cost_usd_buffered, 2),
            cand["product_id_1688"], json.dumps({"name": cand["supplier_name"]}),
            cand["name"], cand["name"], cand["hook"], cand["logic"], cand["closing"]
        ))

    conn.commit()
    conn.close()
    print(f"Successfully injected {len(TEST_CANDIDATES)} additional test candidates.")

if __name__ == "__main__":
    inject()
