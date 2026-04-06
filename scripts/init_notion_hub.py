import asyncio
import os
import sys

# Add backend path to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend.app.services.notion import NotionService

async def main():
    token = os.getenv("NOTION_TOKEN")
    if not token:
        print("❌ Error: NOTION_TOKEN environment variable not set.")
        return
    parent_page_id = "3352ab9f-0c63-81a0-ab99-d8ca1240f98f"
    
    notion = NotionService(token=token)
    print(f"Initializing 0Buck Ops Hub on page: {parent_page_id}")
    
    try:
        databases = await notion.initialize_ops_hub(parent_page_id)
        print("✅ Databases initialized successfully!")
        for name, db_id in databases.items():
            print(f"  - {name}: {db_id}")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Error initializing databases: {e}")

if __name__ == "__main__":
    asyncio.run(main())
