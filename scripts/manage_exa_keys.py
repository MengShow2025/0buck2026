import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

ADMIN_KEY = os.getenv("EXA_ADMIN_KEY")
BASE_URL = "https://admin-api.exa.ai/team-management/api-keys"

def list_keys():
    """List all Exa API keys associated with the team."""
    headers = {
        "x-api-key": ADMIN_KEY,
        "Content-Type": "application/json"
    }
    response = requests.get(BASE_URL, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ Failed to list keys: {response.status_code} - {response.text}")
        return None

def create_search_key(name="Auto-Generated-Key", rate_limit=5):
    """Programmatically create a new search key."""
    headers = {
        "x-api-key": ADMIN_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "name": name,
        "rateLimit": rate_limit
    }
    response = requests.post(BASE_URL, json=payload, headers=headers)
    if response.status_code == 201:
        print(f"✅ Created new key: {name}")
        return response.json()
    else:
        print(f"❌ Failed to create key: {response.text}")
        return None

if __name__ == "__main__":
    print("🚀 0Buck Exa Infrastructure Control (Admin Mode)")
    keys = list_keys()
    if keys:
        print("\n--- Current Active API Keys ---")
        # Structure varies, assuming a list of keys
        print(json.dumps(keys, indent=2))
