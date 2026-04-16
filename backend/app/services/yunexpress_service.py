import logging
import hashlib
import hmac
import json
import time
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.http_client import ResilientAsyncClient

logger = logging.getLogger(__name__)

class YunExpressService:
    def __init__(self):
        self.api_url = settings.YUNEXPRESS_API_URL
        self.app_id = settings.YUNEXPRESS_APPID
        self.api_key = settings.YUNEXPRESS_API_KEY
        self.customer_code = settings.YUNEXPRESS_CUSTOMER_CODE
        self.source_key = settings.YUNEXPRESS_SOURCE_KEY or self.customer_code # Fallback guess
        self._access_token = None
        self._token_expires_at = 0
        self._http = ResilientAsyncClient(name="yunexpress", retries=1, timeout_seconds=15.0, connect_timeout_seconds=5.0)

    async def get_access_token(self) -> Optional[str]:
        if self._access_token and time.time() < self._token_expires_at - 60:
            return self._access_token

        url = f"{self.api_url}/openapi/oauth2/token"
        
        # Test Case 1: JSON Body (As suggested by browser agent)
        payloads = [
            {
                "grantType": "client_credentials",
                "appId": self.app_id,
                "appSecret": self.api_key,
                "sourceKey": self.source_key
            },
            {
                "grant_type": "client_credentials",
                "appid": self.app_id,
                "appsecret": self.api_key,
                "sourcekey": self.source_key
            }
        ]
        
        for payload in payloads:
            try:
                response = await self._http.request("POST", url, json=payload)
                data = response.json()
                if "accessToken" in data:
                    self._access_token = data["accessToken"]
                    self._token_expires_at = time.time() + data.get("expiresIn", 7200)
                    return self._access_token
            except Exception:
                continue

        for payload in payloads:
            try:
                response = await self._http.request("POST", url, data=payload)
                data = response.json()
                if "accessToken" in data:
                    self._access_token = data["accessToken"]
                    self._token_expires_at = time.time() + data.get("expiresIn", 7200)
                    return self._access_token
            except Exception:
                continue
                
        return None

    def _generate_sign(self, method: str, uri: str, date_ms: str, body: str = "") -> str:
        """
        Generate HmacSHA256 signature.
        Format: body={}&date={ms}&method={M}&uri={u}
        Sorted alphabetically.
        """
        params = {
            "body": body,
            "date": date_ms,
            "method": method.upper(),
            "uri": uri
        }
        # Sort by keys alphabetically
        sorted_keys = sorted(params.keys())
        sign_str = "&".join([f"{k}={params[k]}" for k in sorted_keys])
        
        # HMAC SHA256 using api_key (appSecret)
        signature = hmac.new(
            self.api_key.encode('utf-8'),
            sign_str.encode('utf-8'),
            hashlib.sha256
        ).hexdigest().upper()
        
        return signature

    async def _get_headers(self, method: str, uri: str, body_dict: Any = None) -> Dict[str, str]:
        token = await self.get_access_token()
        date_ms = str(int(time.time() * 1000))
        body_str = json.dumps(body_dict) if body_dict is not None else "{}"
        
        sign = self._generate_sign(method, uri, date_ms, body_str)
        
        return {
            "token": token or "",
            "date": date_ms,
            "sign": sign,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    async def get_shipping_quote(self, country_code: str, weight: float, length: float = 1, width: float = 1, height: float = 1) -> List[Dict[str, Any]]:
        """
        Get shipping freight estimates.
        Endpoint: POST /v1/price-trial/get_V2
        """
        uri = "/v1/price-trial/get_V2"
        url = f"{self.api_url}{uri}"
        payload = {
            "country_code": country_code,
            "weight": weight,
            "weight_unit": "KG",
            "package_type": "C", 
            "pieces": 1,
            "length": length,
            "width": width,
            "height": height,
            "size_unit": "CM",
            "origin": "YT-SZ" # Shenzhen
        }
        
        headers = await self._get_headers("POST", uri, payload)
        
        try:
            response = await self._http.request("POST", url, headers=headers, json=payload)
            data = response.json()
            return data.get("data", [])
        except Exception:
            logger.error("YunExpress GetFreight Error")
            return []

    async def create_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a single ticket order.
        Endpoint: POST /v1/order/package/create
        """
        uri = "/v1/order/package/create"
        url = f"{self.api_url}{uri}"
        
        headers = await self._get_headers("POST", uri, order_data)
        
        try:
            response = await self._http.request("POST", url, headers=headers, json=order_data)
            return response.json()
        except Exception:
            logger.error("YunExpress AddOrder Error")
            return {"success": False, "message": "yunexpress_unavailable"}
