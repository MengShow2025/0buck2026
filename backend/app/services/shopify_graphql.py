from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

import httpx

from app.core.http_client import ResilientAsyncClient


@dataclass
class ShopifyGraphQLClient:
    shop_url: str
    access_token: str
    api_version: str
    transport: Optional[httpx.AsyncBaseTransport] = None

    async def execute(self, query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
        url = f"https://{self.shop_url}/admin/api/{self.api_version}/graphql.json"
        headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json",
        }

        client = ResilientAsyncClient(
            name="shopify_graphql",
            retries=1,
            timeout_seconds=15.0,
            connect_timeout_seconds=5.0,
            transport=self.transport,
        )
        response = await client.request(
            "POST",
            url,
            headers=headers,
            json={"query": query, "variables": variables},
            retry_on_status=(429,),
        )
        return response.json()

