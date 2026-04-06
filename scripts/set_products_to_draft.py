import requests
import json
import os

SHOP_NAME = os.getenv("SHOPIFY_SHOP_NAME", "pxjkad-zt")
SHOP_URL = f"{SHOP_NAME}.myshopify.com"
ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN")

if not ACCESS_TOKEN:
    print("❌ Error: SHOPIFY_ACCESS_TOKEN environment variable not set.")
    exit(1)


API_VERSION = "2024-01"

def set_products_to_draft():
    # 1. Get all active products
    url = f"https://{SHOP_URL}/admin/api/{API_VERSION}/products.json?status=active"
    headers = {
        "X-Shopify-Access-Token": ACCESS_TOKEN,
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch products: {response.text}")
        return

    products = response.json().get("products", [])
    if not products:
        print("No active products found.")
        return

    print(f"Found {len(products)} active products. Setting to draft...")

    # 2. Update each product to draft
    for product in products:
        product_id = product["id"]
        update_url = f"https://{SHOP_URL}/admin/api/{API_VERSION}/products.id.json".replace("id", str(product_id))
        payload = {
            "product": {
                "id": product_id,
                "status": "draft"
            }
        }
        
        update_res = requests.put(update_url, headers=headers, json=payload)
        if update_res.status_code == 200:
            print(f"Successfully set Product ID {product_id} ({product['title']}) to DRAFT.")
        else:
            print(f"Failed to update Product ID {product_id}: {update_res.text}")

if __name__ == "__main__":
    set_products_to_draft()
