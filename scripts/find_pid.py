import asyncio
import logging
import sys
import os
import json
from decimal import Decimal

# Ensure project root is in sys.path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(project_root, "backend"))

from app.services.cj_service import CJDropshippingService

async def find_correct_pid():
    cj_service = CJDropshippingService()
    results = await cj_service.search_products("Tuya Wifi Smart Door Magnetic Anti-theft Alarm App Push", size=5)
    if results:
        for r in results:
            print(f"Name: {r.get('productNameEn')}, PID: {r.get('pid')}, ID: {r.get('id')}")
    else:
        print("No results found.")

if __name__ == "__main__":
    asyncio.run(find_correct_pid())
