import logging
import httpx
from typing import Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class MabangService:
    """
    v5.3: Mabang ERP Integration for 1688 Sourcing & Fulfillment.
    Used for 'Forwarder Mode' where we buy from 1688 via Mabang.
    """
    def __init__(self, token: str = None, app_key: str = None):
        self.token = token or settings.MABANG_TOKEN
        self.app_key = app_key or settings.MABANG_APP_KEY
        self.base_url = settings.MABANG_API_URL or "https://open.mabangerp.com"
        self.version = "v1"

    async def _post(self, action: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generic POST helper for Mabang API."""
        payload = {
            "token": self.token,
            "appKey": self.app_key,
            "action": action,
            "version": self.version,
            "data": data
        }
        
        async with httpx.AsyncClient() as client:
            try:
                # Mabang often expects JSON payload in the body
                response = await client.post(self.base_url, json=payload, timeout=30.0)
                print(f"DEBUG MABANG: Status: {response.status_code} | Text: {response.text[:200]}")
                response.raise_for_status()
                result = response.json()
                if result.get("code") != "000":
                    logger.warning(f"⚠️ Mabang API {action} returned error: {result.get('message')}")
                return result
            except Exception as e:
                logger.error(f"❌ Mabang API {action} failed: {e}")
                return {"code": "999", "message": str(e)}

    async def get_1688_product_detail(self, url_1688: str) -> Dict[str, Any]:
        """Fetch 1688 product info via Mabang's 1688 Sourcing interface."""
        return await self._post("get-1688-product-list", {"url": url_1688})

    async def create_1688_purchase_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a 1688 purchase order in Mabang."""
        return await self._post("add-1688-order", order_data)

    async def get_inventory_sku(self, sku: str) -> Dict[str, Any]:
        """Check inventory status for a specific SKU in Mabang."""
        return await self._post("get-Order-Info", {"sku": sku})
