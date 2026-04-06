import json
import sqlite3
import os

LOCAL_DB_PATH = "backend/0buck_test.db"
JSON_DATA_PATH = "data/1688/complete_assets_v3_9_1.json"

AMAZON_PRICES = {
    "Jointcorp 1657B Sleep Monitoring Belt": 179.99,
    "V-Series Health Smart Watch (HR/BP)": 89.00,
    "Interactive Smart Pet Ball (AI Motion)": 28.58,
    "Vstarcam Mini 1080P Smart Video Doorbell": 19.99,
    "Matter Smart Plug (Energy)": 19.99,
    "Digital Measuring Tape (OLED Display)": 39.99,
    "8-in-1 Electric Spin Scrubber (Telescopic)": 34.98,
    "Kasa Smart Plug Mini (KP115)": 19.99,
    "Full Spectrum Smart Grow Light": 29.99,
    "Austar 8-Ch Programmable Hearing Aid": 139.99,
    "RSH-CB01 Smart Curtain Robot": 59.99
}

def inject():
    if not os.path.exists(JSON_DATA_PATH):
        print(f"Error: {JSON_DATA_PATH} not found")
        return

    with open(JSON_DATA_PATH, 'r') as f:
        products_data = json.load(f)

    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()

    # Clear existing candidates to avoid confusion
    cursor.execute("DELETE FROM candidate_products")
    
    for p_data in products_data:
        name = p_data['name']
        comp_price = AMAZON_PRICES.get(name, 49.99)
        sale_price = round(comp_price * 0.6, 2)
        cost_cny = p_data['variants'][0]['price_cny']
        
        # Desire Engine Copywriting (Simplified for test)
        hook = f"Is the high price of {name} holding you back? Stop paying for middleman markups."
        logic = f"We source directly from {p_data['supplier']}, the same factory behind premium brands. No branding tax, just pure quality."
        closing = f"Get it now for ${sale_price} and join our 20-phase rebate ritual to get 100% cashback."

        # Map fields to CandidateProduct schema
        cursor.execute("""
            INSERT INTO candidate_products (
                product_id_1688, status, discovery_source, discovery_evidence,
                title_zh, description_zh, images, variants_raw,
                cost_cny, comp_price_usd, estimated_sale_price, profit_ratio,
                title_en_preview, description_en_preview,
                desire_hook, desire_logic, desire_closing, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        """, (
            str(p_data['id']), 'new', 'Core Selection', json.dumps({'v': '3.9.0'}),
            p_data['name'], p_data['description'], json.dumps(p_data['gallery_images']), json.dumps(p_data['variants']),
            cost_cny, comp_price, sale_price, round(sale_price / (cost_cny / 7.23), 2) if cost_cny > 0 else 0,
            p_data['title'], p_data['description'],
            hook, logic, closing
        ))

    conn.commit()
    conn.close()
    print(f"Successfully injected {len(products_data)} core candidates into the backend pool.")

if __name__ == "__main__":
    inject()
