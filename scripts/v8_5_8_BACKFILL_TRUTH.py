import pg8000
import json

# Database config
DATABASE_URL = "postgresql://neondb_owner:npg_MoQh4OvD1HKy@ep-lingering-smoke-amtrqzuh-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"

def backfill_pilot_truth():
    print("🚀 [Truth Engine] Backfilling Pilot Truth Assets (IDs 1-3)...")
    
    # Connection details
    conn = pg8000.connect(
        user="neondb_owner",
        password="npg_MoQh4OvD1HKy",
        host="ep-lingering-smoke-amtrqzuh-pooler.c-5.us-east-1.aws.neon.tech",
        port=5432,
        database="neondb",
        ssl_context=True
    )
    cursor = conn.cursor()
    
    # 1. Power Station
    p1 = {
        "id": 1,
        "title_en": "Professional Portable Power Station 500Wh | Artisan-Direct Quality",
        "cost_usd": 149.00,
        "freight_fee": 35.00,
        "amazon_price": 499.00,
        "desire_hook": "Stop paying for the 'Jackery' Orange Logo. Smash the $350 Social Tax.",
        "desire_logic": "This is the identical factory-line unit. Same cells, same PCB, same casing. We strip the branding and give you the physical reality.",
        "truth_body": "Verified 518Wh High-Density Lithium Cells. Pure Sine Wave 500W Inverter. 1:1 Physical Audit Passed."
    }
    
    # 2. Air Pump
    p2 = {
        "id": 2,
        "title_en": "Turbo Cordless Tire Inflator | US-Warehouse Priority",
        "cost_usd": 18.00,
        "freight_fee": 12.00,
        "amazon_price": 59.99,
        "desire_hook": "Tired of plastic gears that melt in 2 months? Get the Industrial Metal In-line Inflator.",
        "desire_logic": "Most brands use 12V plastic diaphragms. This Artisan model features a dual-cylinder metal piston normally reserved for commercial tools.",
        "truth_body": "150 PSI Max Pressure. 7500mAh Verified Battery. Dual-Cylinder Metal Piston Drive."
    }
    
    # 3. OBD Scanner
    p3 = {
        "id": 3,
        "title_en": "ELM327 Professional OBD2 Scanner | Truth-First Diagnostic",
        "cost_usd": 5.60,
        "freight_fee": 5.00,
        "amazon_price": 29.90,
        "desire_hook": "Your mechanic charges $100 for a 5-second scan. Take back your data with this physical truth.",
        "desire_logic": "Brands put a fancy case around this exact ELM327 chip and charge 5x. We give you the chip, the code, and the savings.",
        "truth_body": "Original PIC18F25K80 Chip. Full Protocol Support (CAN-BUS, J1850). Zero Brand Tax."
    }
    
    for p in [p1, p2, p3]:
        sql = """
        UPDATE candidate_products 
        SET title_en = %s, cost_usd = %s, freight_fee = %s, amazon_price = %s, 
            desire_hook = %s, desire_logic = %s, truth_body = %s,
            status = 'pending'
        WHERE id = %s
        """
        cursor.execute(sql, (
            p["title_en"], p["cost_usd"], p["freight_fee"], p["amazon_price"],
            p["desire_hook"], p["desire_logic"], p["truth_body"],
            p["id"]
        ))
        print(f"✅ Product ID {p['id']} updated with Truth Narrative.")
        
    conn.commit()
    cursor.close()
    conn.close()
    print("🎉 Pilot Truth Backfill Complete.")

if __name__ == "__main__":
    backfill_pilot_truth()
