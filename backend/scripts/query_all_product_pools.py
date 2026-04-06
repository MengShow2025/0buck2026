import asyncio
import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from backend.app.services.notion import NotionService

async def main():
    token = os.getenv("NOTION_TOKEN")
    if not token:
        print("❌ Error: NOTION_TOKEN environment variable not set.")
        return
    notion = NotionService(token=token)
    
    # Let's search for "0Buck: Product Selection" specifically
    results = await notion.search("0Buck: Product Selection", filter_type="database")
    
    if not results.get("results"):
        print("  ❌ No databases found with that title.")
        return
        
    print(f"  ✅ Found {len(results['results'])} databases with that title.")
    for db in results['results']:
        db_id = db['id']
        title = db.get("title", [{}])[0].get("plain_text", "Untitled")
        print(f"    - Querying database: {title} (ID: {db_id})")
        
        pages = await notion.get_database_contents(db_id)
        print(f"      ✅ Found {len(pages)} entries.")
        
        # Check first entry for 'Status' property
        if pages:
            props = pages[0].get("properties", {})
            print(f"      Properties: {list(props.keys())}")
            # print status of each page
            for page in pages:
                pname = page['properties'].get('Product Name', {}).get('title', [{}])[0].get('text', {}).get('content', 'N/A')
                pstatus = page['properties'].get('Status', {}).get('status', {}).get('name', 'N/A')
                if pstatus == 'N/A':
                    pstatus = page['properties'].get('Status', {}).get('select', {}).get('name', 'N/A')
                print(f"        - {pname}: {pstatus}")

if __name__ == "__main__":
    asyncio.run(main())
