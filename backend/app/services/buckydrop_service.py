import logging
import hashlib
import time
import httpx
from typing import Dict, Any, Optional, List
from app.core.config import settings

logger = logging.getLogger(__name__)

class BuckyDropService:
    """
    v5.3: BuckyDrop API Integration for 1688/Taobao Sourcing.
    Specialized in 'Crawl-and-Buy' for precise 1:1 inventory matching.
    """
    def __init__(self, app_code: str = None, app_secret: str = None, domain: str = None):
        # Default to production but allow overrides for testing
        self.app_code = app_code or settings.BUCKYDROP_APP_CODE
        self.app_secret = app_secret or settings.BUCKYDROP_APP_SECRET
        self.domain = domain or settings.BUCKYDROP_DOMAIN
        self.base_url = self.domain.rstrip('/')
        self._token = None
        self._token_expiry = 0

    def _generate_sign(self, current_time: Any, token: Optional[str] = None) -> str:
        """
        BuckyDrop Signature Logic.
        Auth: MD5(appCode + currentTime + appSecret)
        Business: MD5(appCode + timestamp + token + appSecret)
        """
        if token:
            raw_str = f"{self.app_code}{current_time}{token}{self.app_secret}"
        else:
            raw_str = f"{self.app_code}{current_time}{self.app_secret}"
            
        return hashlib.md5(raw_str.encode('utf-8')).hexdigest()

    async def get_access_token(self) -> Optional[str]:
        """Fetch or refresh the BuckyDrop auth token."""
        if self._token and time.time() < self._token_expiry:
            return self._token

        # BuckyDrop expects milliseconds for currentTime
        current_time_ms = int(time.time() * 1000)
        sign = self._generate_sign(current_time_ms)
        
        url = f"{self.base_url}/api/public/v1/auth/token"
        payload = {
            "appCode": self.app_code,
            "currentTime": current_time_ms,
            "sign": sign
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, timeout=10.0)
                data = response.json()
                print(f"DEBUG: BuckyDrop Auth Response: {data}")
                if data.get("code") == 0 or data.get("success") is True:
                    self._token = data.get("data", {}).get("token")
                    # Set expiry (default token lasts 24h, but we'll refresh every 1h for safety)
                    self._token_expiry = time.time() + 3600
                    logger.info("✅ BuckyDrop Token refreshed successfully.")
                    return self._token
                else:
                    logger.error(f"❌ BuckyDrop Auth Error: {data}")
                    return None
            except Exception as e:
                logger.error(f"❌ BuckyDrop Token Request Failed: {e}")
                return None

    def _generate_business_sign_v2(self, timestamp: int, token: str, body: Dict[str, Any]) -> str:
        """
        BuckyDrop Business Sign (V2): 
        MD5(appCode + timestamp + token + productLink + appSecret)
        """
        product_link = body.get("productLink", "")
        raw_str = f"{self.app_code}{timestamp}{token}{product_link}{self.app_secret}"
        sign = hashlib.md5(raw_str.encode('utf-8')).hexdigest()
        logger.debug(f"DEBUG: BuckyDrop Sign String: {raw_str} -> {sign}")
        return sign

    async def get_product_detail(self, product_link: str) -> Optional[Dict[str, Any]]:
        """Crawl product detail."""
        token = await self.get_access_token()
        if not token: return None

        timestamp_ms = int(time.time() * 1000)
        payload = {"productLink": product_link}
        
        # BuckyDrop OpenAPI V2 Detail expects: MD5(appCode + timestamp + token + appSecret)
        # CRITICAL: timestamp must be in SECONDS for business API, not milliseconds.
        timestamp_s = int(time.time())
        params = {
            "appCode": self.app_code,
            "timestamp": timestamp_s
        }
        
        # Correct Signature Logic: MD5(appCode + timestamp_s + token + appSecret)
        raw_str = f"{self.app_code}{timestamp_s}{token}{self.app_secret}"
        sign = hashlib.md5(raw_str.encode('utf-8')).hexdigest()
        params["sign"] = sign
        
        url = f"{self.base_url}/api/rest/v2/adapt/openapi/product/detail"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                # Use params for query string and json for body
                response = await client.post(url, headers=headers, params=params, json=payload, timeout=30.0)
                data = response.json()
                print(f"DEBUG: BuckyDrop Detail Response: {data}")
                if data.get("code") == 200 or data.get("success") is True or data.get("code") == 0:
                    return data.get("data")
                else:
                    logger.error(f"❌ BuckyDrop Detail Error: {data}")
                    return None
            except Exception as e:
                logger.error(f"❌ BuckyDrop Crawl Failed: {e}")
                return None

    async def create_shop_order(self, order_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Create an order in BuckyDrop for fulfillment.
        Required for automated purchasing after user payment.
        """
        token = await self.get_access_token()
        if not token: return None

        timestamp = int(time.time())
        sign = self._generate_sign(timestamp)
        
        url = f"{self.base_url}/api/rest/v2/adapt/adaptation/order/shop-order/create"
        params = {
            "appCode": self.app_code,
            "timestamp": timestamp,
            "sign": sign
        }
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, headers=headers, params=params, json=order_data, timeout=30.0)
                data = response.json()
                if data.get("code") == 200:
                    logger.info(f"✅ BuckyDrop Order Created: {data.get('data', {}).get('orderNo')}")
                    return data.get("data")
                else:
                    logger.error(f"❌ BuckyDrop Order Error: {data.get('message')}")
                    return None
            except Exception as e:
                logger.error(f"❌ BuckyDrop Order Placement Failed: {e}")
                return None
