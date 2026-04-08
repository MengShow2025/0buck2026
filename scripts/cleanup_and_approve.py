import asyncio
import os
import sys
import psycopg2
import shopify
from dotenv import load_dotenv

load_dotenv()

# Neon DB Connection
DB_URL = os.getenv("DATABASE_URL")

# Shopify Credentials
SHOP_URL = f"{os.getenv('SHOPIFY_SHOP_NAME')}.myshopify.com"
ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

def cleanup_and_approve():
    # 1. Update DB Candidates to 'approved'
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()
        
        print("🛠️ Updating pending candidates to 'approved'...")
        cur.execute("UPDATE candidate_products SET status = 'approved' WHERE status != 'approved'")
        conn.commit()
        print(f"✅ Updated {cur.rowcount} candidates.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ DB Update Failed: {e}")

    # 2. Delete Sample/Test Products from Shopify
    try:
        session = shopify.Session(SHOP_URL, "2024-01", ACCESS_TOKEN)
        shopify.ShopifyResource.activate_session(session)
        
        print(f"🧹 Cleaning up Shopify products ({SHOP_URL})...")
        products = shopify.Product.find()
        deleted_count = 0
        for p in products:
            title = p.title.lower()
            if "sample" in title or "test" in title:
                print(f"🗑️ Deleting: {p.title}")
                p.destroy()
                deleted_count += 1
        
        print(f"✅ Deleted {deleted_count} old/test products.")
        shopify.ShopifyResource.clear_session()
    except Exception as e:
        print(f"❌ Shopify Cleanup Failed: {e}")

if __name__ == "__main__":
    cleanup_and_approve()
