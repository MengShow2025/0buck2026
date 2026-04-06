
import os
import sys
import shopify
import json
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.core.config import settings

def fetch_images():
    load_dotenv()
    
    shop_url = f"{settings.SHOPIFY_SHOP_NAME}.myshopify.com"
    access_token = settings.SHOPIFY_ACCESS_TOKEN
    api_version = "2024-01"
    
    session = shopify.Session(shop_url, api_version, access_token)
    shopify.ShopifyResource.activate_session(session)
    
    # We want to fetch all products to be safe
    print(f"Fetching products from Shopify: {shop_url}")
    products = shopify.Product.find()
    
    results = {}
    for p in products:
        # Check if it has 1688 ID in metafields or tags
        # But for now, let's just use the title or handle
        images = [img.src for img in p.images]
        results[p.id] = {
            "title": p.title,
            "images": images,
            "handle": p.handle
        }
        print(f"Found Shopify Product: {p.title} (ID: {p.id}) - {len(images)} images")
        
    with open("shopify_products.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Saved Shopify products to shopify_products.json")

if __name__ == "__main__":
    fetch_images()
