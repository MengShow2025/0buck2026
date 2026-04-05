from typing import Any, Dict, List, Optional, Tuple
import requests

from app.core.config import settings


class ShopifyRefundError(Exception):
    def __init__(self, message: str, status_code: Optional[int] = None, details: Optional[Any] = None):
        super().__init__(message)
        self.status_code = status_code
        self.details = details


def _admin_base_url(api_version: str) -> str:
    shop = settings.SHOPIFY_SHOP_NAME
    return f"https://{shop}.myshopify.com/admin/api/{api_version}"


def _headers() -> Dict[str, str]:
    return {
        "X-Shopify-Access-Token": settings.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def _request(method: str, url: str, json: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    resp = requests.request(method, url, headers=_headers(), json=json, timeout=30)
    try:
        data = resp.json() if resp.content else {}
    except Exception:
        data = {"raw": resp.text}
    if resp.status_code >= 400:
        raise ShopifyRefundError("Shopify admin API error", status_code=resp.status_code, details=data)
    return data


def _pick_success_sale_transaction(transactions: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    for t in transactions:
        if t.get("kind") == "sale" and t.get("status") == "success":
            return t
    for t in transactions:
        if t.get("kind") == "sale":
            return t
    return None


def _find_existing_group_free_refund(refunds: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    for r in refunds:
        note = (r.get("note") or "").lower()
        if "0buck_group_free" in note or "group_free" in note:
            return r
    return None


def refund_order_full(
    order_id: int,
    api_version: str = "2024-01",
    note: str = "0buck_group_free",
    restock_type: str = "no_restock",
) -> Tuple[bool, Dict[str, Any]]:
    if not settings.SHOPIFY_SHOP_NAME or not settings.SHOPIFY_ACCESS_TOKEN:
        raise ShopifyRefundError("SHOPIFY_SHOP_NAME/SHOPIFY_ACCESS_TOKEN not configured")

    base = _admin_base_url(api_version)

    refunds_data = _request("GET", f"{base}/orders/{order_id}/refunds.json")
    refunds = refunds_data.get("refunds", []) if isinstance(refunds_data, dict) else []
    existing = _find_existing_group_free_refund(refunds)
    if existing:
        return True, {"idempotent": True, "refund": existing}

    order_data = _request("GET", f"{base}/orders/{order_id}.json")
    order = order_data.get("order") if isinstance(order_data, dict) else None
    if not order:
        raise ShopifyRefundError("Order not found in Shopify response", details=order_data)

    currency = order.get("currency")
    total_price = order.get("current_total_price") or order.get("total_price") or "0"
    line_items = order.get("line_items") or []

    tx_data = _request("GET", f"{base}/orders/{order_id}/transactions.json")
    transactions = tx_data.get("transactions", []) if isinstance(tx_data, dict) else []
    sale_tx = _pick_success_sale_transaction(transactions)
    if not sale_tx:
        raise ShopifyRefundError("No sale transaction found for refund", details={"transactions": transactions})

    refund_line_items: List[Dict[str, Any]] = []
    for li in line_items:
        li_id = li.get("id")
        qty = li.get("quantity")
        if li_id and qty:
            refund_line_items.append(
                {
                    "line_item_id": li_id,
                    "quantity": qty,
                    "restock_type": restock_type,
                }
            )

    calculate_payload = {
        "refund": {
            "currency": currency,
            "note": note,
            "shipping": {"full_refund": True},
            "refund_line_items": refund_line_items,
            "transactions": [
                {
                    "parent_id": sale_tx.get("id"),
                    "amount": str(total_price),
                    "kind": "refund",
                }
            ],
        }
    }

    calc = _request("POST", f"{base}/orders/{order_id}/refunds/calculate.json", json=calculate_payload)
    calculated_refund = calc.get("refund") if isinstance(calc, dict) else None
    if not calculated_refund:
        raise ShopifyRefundError("Refund calculate returned unexpected response", details=calc)

    create_payload = {"refund": calculated_refund}
    created = _request("POST", f"{base}/orders/{order_id}/refunds.json", json=create_payload)
    created_refund = created.get("refund") if isinstance(created, dict) else None
    if not created_refund:
        raise ShopifyRefundError("Refund create returned unexpected response", details=created)

    return True, {"idempotent": False, "refund": created_refund}

