
import asyncio
import os
import sys

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.notion import NotionService

async def approve_product(product_name_substring):
    notion = NotionService()
    try:
        results = await notion.search(product_name_substring, filter_type="page")
        for page in results.get("results", []):
            properties = page.get("properties", {})
            title_prop = properties.get("C: 商品名") or properties.get("商品名")
            if title_prop:
                title = title_prop["title"][0]["text"]["content"]
                print(f"Found page: {title} (ID: {page['id']})")
                
                # Update status to '审核通过'
                update_props = {
                    "B: 审核状态": {"select": {"name": "审核通过"}},
                    "审核状态": {"select": {"name": "审核通过"}} # Handle both mappings
                }
                
                # Try to find which property name exists
                final_props = {}
                for k, v in update_props.items():
                    if k in properties:
                        final_props[k] = v
                
                if not final_props:
                    # Fallback to the one we hope exists
                    final_props = {"B: 审核状态": {"select": {"name": "审核通过"}}}
                
                print(f"Updating page {page['id']} with {final_props}")
                await notion.update_page_properties(page['id'], final_props)
                print("Successfully updated status to '审核通过'.")
                return
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        asyncio.run(approve_product(sys.argv[1]))
    else:
        print("Please provide a product name substring.")
