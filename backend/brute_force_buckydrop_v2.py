import asyncio
import hashlib
import time
import httpx
import json

APP_CODE = "b2eea7fbbf558a6f34af0b7b0063204b"
APP_SECRET = "690250bf5c22cf68dd64d6447a0dcb4e"
DOMAIN = "https://openapi.buckydrop.com"
TEST_URL = "https://detail.1688.com/offer/972874135990.html"

def generate_sign(raw_str):
    return hashlib.md5(raw_str.encode('utf-8')).hexdigest()

async def test_signatures():
    # 1. Get Auth Token first (We know how this works)
    timestamp_auth = int(time.time() * 1000)
    sign_auth = generate_sign(f"{APP_CODE}{timestamp_auth}{APP_SECRET}")
    
    async with httpx.AsyncClient() as client:
        auth_resp = await client.post(
            f"{DOMAIN}/api/public/v1/auth/token",
            json={"appCode": APP_CODE, "currentTime": timestamp_auth, "sign": sign_auth}
        )
        auth_data = auth_resp.json()
        if not auth_data.get('success'):
            print(f"Auth Failed: {auth_data}")
            return
        
        token = auth_data['data']['token']
        print(f"✅ Auth Success. Token: {token[:20]}...")

        # 2. Try various business signatures for product/detail
        timestamp_bus = int(time.time() * 1000)
        
        test_cases = [
            ("V1 Simple", generate_sign(f"{APP_CODE}{timestamp_bus}{APP_SECRET}")),
            ("V2 with Token", generate_sign(f"{APP_CODE}{timestamp_bus}{token}{APP_SECRET}")),
            ("V2 Secret Middle", generate_sign(f"{APP_CODE}{APP_SECRET}{timestamp_bus}")),
            ("V2 Secret First", generate_sign(f"{APP_SECRET}{APP_CODE}{timestamp_bus}")),
            ("V2 Uppercase Simple", generate_sign(f"{APP_CODE}{timestamp_bus}{APP_SECRET}").upper()),
            ("V2 with productLink", generate_sign(f"{APP_CODE}{timestamp_bus}{TEST_URL}{APP_SECRET}")),
            ("V2 with token & productLink", generate_sign(f"{APP_CODE}{timestamp_bus}{token}{TEST_URL}{APP_SECRET}")),
        ]

        url = f"{DOMAIN}/api/rest/v2/adapt/openapi/product/detail"
        
        for name, sign in test_cases:
            params = {
                "appCode": APP_CODE,
                "timestamp": timestamp_bus,
                "sign": sign
            }
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            payload = {"productLink": TEST_URL}
            
            try:
                resp = await client.post(url, headers=headers, params=params, json=payload, timeout=5.0)
                data = resp.json()
                if data.get('success') or data.get('code') == 200:
                    print(f"🔥 FOUND IT! Signature Case: '{name}' worked!")
                    # print(f"Data: {json.dumps(data, indent=2)}")
                    return
                else:
                    print(f"❌ Case '{name}' failed: {data.get('info')} (Code: {data.get('code')})")
            except Exception as e:
                print(f"⚠️ Case '{name}' error: {e}")

if __name__ == "__main__":
    asyncio.run(test_signatures())
