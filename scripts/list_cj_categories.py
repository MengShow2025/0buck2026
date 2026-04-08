import asyncio
import os
import sys
import json
import httpx

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_root = os.path.join(project_root, 'backend')
if backend_root not in sys.path:
    sys.path.append(backend_root)

from app.services.cj_service import CJDropshippingService

async def list_cj_categories():
    cj_service = CJDropshippingService()
    url = f"{cj_service.BASE_URL}/product/getCategory"
    headers = await cj_service._get_headers()
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, headers=headers)
            data = resp.json()
            if data.get("success"):
                categories = data.get("data", [])
                if not categories:
                    print(f"Empty category list returned: {data}")
                    return
                # Print the first one for debugging
                if categories:
                    print(f"DEBUG Sample: {categories[0]}")
                for cat in categories:
                    cid = cat.get('categoryFirstId') or cat.get('categoryId') or cat.get('id')
                    name = cat.get('categoryFirstName') or cat.get('categoryName') or cat.get('name')
                    print(f"ID: {cid} | Name: {name}")
            else:
                print(f"Error fetching categories: {data}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(list_cj_categories())
