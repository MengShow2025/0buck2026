import asyncio
import os
import sys

# Add backend path to sys.path
sys.path.append(os.getcwd())

from backend.app.services.notion import NotionService

async def main():
    token = os.getenv("NOTION_TOKEN")
    if not token:
        print("❌ Error: NOTION_TOKEN environment variable not set.")
        return
    parent_page_id = "3352ab9f-0c63-81a0-ab99-d8ca1240f98f"
    
    notion = NotionService(token=token)
    print(f"🚀 Initializing NEW 0Buck v2.0 Ops Hub (Standard Schema) on page: {parent_page_id}")
    
    try:
        databases = await notion.initialize_ops_hub(parent_page_id)
        print("✅ Databases initialized successfully with the NEW schema!")
        for key, db_id in databases.items():
            print(f"  - {key}: {db_id}")
            
        selection_db_id = databases.get("product_selection")
        
        # Add a sample product to verify the new columns
        p = {
            "审核状态": "草稿",
            "商品名": "Nexus NFC Touch Point (Black & Gold)",
            "选品理由 (中文)": "高频触达单品，黑金视觉极致契合，Amazon 爆款同款。",
            "商品分类": "智能家居",
            "1688 商品链接": "https://detail.1688.com/offer/715423854129.html",
            "亚马逊/eBay 链接": "https://www.amazon.com/nfc-tag/dp/B00FS4AF0S",
            "亚马逊/eBay 零售价": 29.00,
            "1688 价格 (拿货价+国际段运费)": 5.00,
            "划线价 (亚马逊/eBay 售价 * 95%)": 27.55,
            "建议售价 (亚马逊/eBay 售价 * 60%)": 17.40,
            "利润比 (建议价/拿货价)": 3.48,
            "shopify 编号": ""
        }
        
        properties = {
            "审核状态": {"select": {"name": p["审核状态"]}},
            "商品名": {"title": [{"text": {"content": p["商品名"]}}]},
            "选品理由 (中文)": {"rich_text": [{"text": {"content": p["选品理由 (中文)"]}}]},
            "商品分类": {"select": {"name": p["商品分类"]}},
            "1688 商品链接": {"url": p["1688 商品链接"]},
            "亚马逊/eBay 链接": {"url": p["亚马逊/eBay 链接"]},
            "亚马逊/eBay 零售价": {"number": p["亚马逊/eBay 零售价"]},
            "1688 价格 (拿货价+国际段运费)": {"number": p["1688 价格 (拿货价+国际段运费)"]},
            "划线价 (亚马逊/eBay 售价 * 95%)": {"number": p["划线价 (亚马逊/eBay 售价 * 95%)"]},
            "建议售价 (亚马逊/eBay 售价 * 60%)": {"number": p["建议售价 (亚马逊/eBay 售价 * 60%)"]},
            "利润比 (建议价/拿货价)": {"number": p["利润比 (建议价/拿货价)"]},
            "shopify 编号": {"rich_text": [{"text": {"content": p["shopify 编号"]}}]}
        }
        
        import httpx
        headers = {
            "Authorization": f"Bearer {token}",
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
        }
        async with httpx.AsyncClient() as client:
            res = await client.post(
                "https://api.notion.com/v1/pages",
                headers=headers,
                json={"parent": {"database_id": selection_db_id}, "properties": properties}
            )
            if res.status_code == 200:
                print(f"✅ Verified: Sample product '{p['商品名']}' added.")
            else:
                print(f"❌ Verification failed: {res.text}")
                
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
