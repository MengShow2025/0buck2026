import asyncio
import os
import sys
import requests
from datetime import datetime
from decimal import Decimal

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.services.config_service import ConfigService

async def sync_exchange_rates():
    """
    v3.4.8: Automated Exchange Rate Sync with 0.5% Buffer.
    Runs daily to update system-wide pricing baseline.
    """
    db = SessionLocal()
    config = ConfigService(db)
    
    try:
        print(f"[{datetime.now()}] Starting Exchange Rate Sync...")
        
        # 1. Fetch from Public API (ExchangeRate-API or similar)
        # Using a reliable open source or standard API
        api_url = "https://open.er-api.com/v6/latest/USD"
        response = requests.get(api_url)
        data = response.json()
        
        if data.get("result") == "success":
            rates = data.get("rates", {})
            cny_rate = rates.get("CNY")
            
            if cny_rate:
                # 2. Apply 0.5% Buffer (Safety Hedge)
                # If 1 USD = 7.2 CNY, we use 7.2 / 1.005 to be conservative on costs
                # OR if calculating price: Cost CNY * 1.005 / Rate
                buffered_rate = float(Decimal(str(cny_rate)))
                
                # 3. Update SystemConfig
                config.set("EXCHANGE_RATE_USD_CNY", buffered_rate, description="Daily synced CNY rate (Raw)")
                config.set("EXCHANGE_RATE_BUFFER", 0.005, description="Hedge buffer for currency fluctuations")
                config.set("LAST_EXCHANGE_SYNC", datetime.now().isoformat())
                
                print(f"Success: Updated USD/CNY rate to {buffered_rate}")
            else:
                print("Error: CNY rate not found in API response.")
        else:
            print(f"Error: API request failed: {data.get('error-type')}")
            
    except Exception as e:
        print(f"Error in Exchange Rate Sync: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(sync_exchange_rates())
