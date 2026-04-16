import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.ledger import PromoShareLink
from app.models.product import Product, Supplier


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64url_decode(text: str) -> bytes:
    padding = "=" * ((4 - len(text) % 4) % 4)
    return base64.urlsafe_b64decode((text + padding).encode("utf-8"))


def _sign_payload(payload_part: str) -> str:
    secret = settings.SECRET_KEY.encode("utf-8")
    sig = hmac.new(secret, payload_part.encode("utf-8"), hashlib.sha256).digest()
    return _b64url(sig)


def issue_share_token(payload: Dict[str, Any]) -> str:
    payload_part = _b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    return f"{payload_part}.{_sign_payload(payload_part)}"


def verify_share_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload_part, sig_part = token.split(".", 1)
        if not hmac.compare_digest(sig_part, _sign_payload(payload_part)):
            return None
        payload = json.loads(_b64url_decode(payload_part).decode("utf-8"))
        if int(payload.get("exp", 0)) < int(datetime.utcnow().timestamp()):
            return None
        return payload
    except Exception:
        return None


def create_share_link(
    db: Session,
    sharer_user_id: int,
    share_category: str,
    card_type: str,
    target_type: str,
    target_id: Optional[str],
    platform: Optional[str],
    entry_type: Optional[str],
    policy_version: str = "v1",
    source_code: Optional[str] = None,
    ttl_hours: int = 24 * 30,
) -> PromoShareLink:
    exp = datetime.utcnow() + timedelta(hours=ttl_hours)
    token_payload = {
        "u": int(sharer_user_id),
        "c": share_category,
        "ct": card_type,
        "tt": target_type,
        "tid": str(target_id or ""),
        "pv": policy_version,
        "exp": int(exp.timestamp()),
    }
    token = issue_share_token(token_payload)
    row = PromoShareLink(
        share_token=token,
        sharer_user_id=sharer_user_id,
        share_category=share_category,
        card_type=card_type,
        target_type=target_type,
        target_id=str(target_id) if target_id is not None else None,
        platform=platform,
        entry_type=entry_type,
        policy_version=policy_version,
        source_code=source_code,
        expires_at=exp,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


def resolve_share_link(db: Session, share_token: str) -> Optional[PromoShareLink]:
    payload = verify_share_token(share_token)
    if not payload:
        return None
    row = db.query(PromoShareLink).filter_by(share_token=share_token, status="active").first()
    if not row:
        return None
    if row.expires_at and row.expires_at < datetime.utcnow():
        return None
    return row


def build_card_payload(
    db: Session,
    card_type: str,
    target_type: str,
    target_id: Optional[str],
    universal_link: str,
) -> Dict[str, Any]:
    if card_type == "product" and target_type == "product" and target_id:
        product = db.query(Product).filter(Product.id == int(target_id)).first()
        if not product:
            raise ValueError("product_not_found")
        title = product.title_zh or product.title_en or f"Product #{product.id}"
        image = ((product.images or [None])[0]) if isinstance(product.images, list) else None
        return {
            "title": title,
            "subtitle": "精选商品推荐",
            "image": image,
            "cta_text": "查看商品",
            "link": universal_link,
        }

    if card_type == "merchant" and target_type == "merchant" and target_id:
        supplier = db.query(Supplier).filter(Supplier.id == int(target_id)).first()
        if not supplier:
            raise ValueError("merchant_not_found")
        return {
            "title": supplier.name or f"Merchant #{supplier.id}",
            "subtitle": "商家推荐卡",
            "image": None,
            "cta_text": "查看商家",
            "link": universal_link,
        }

    # invite card fallback
    return {
        "title": "0Buck 专属邀请",
        "subtitle": "注册即解锁平台权益与奖励路径",
        "image": None,
        "cta_text": "立即注册",
        "link": universal_link,
    }


def build_template_variants(card: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Same semantic content, multiple style variants.
    """
    title = card.get("title", "")
    subtitle = card.get("subtitle", "")
    cta = card.get("cta_text", "立即查看")
    link = card.get("link", "")
    return [
        {
            "template_id": "style_minimal",
            "name": "简洁风",
            "title": title,
            "subtitle": subtitle,
            "cta_text": cta,
            "link": link,
        },
        {
            "template_id": "style_bold",
            "name": "强调风",
            "title": f"🔥 {title}",
            "subtitle": subtitle,
            "cta_text": cta,
            "link": link,
        },
        {
            "template_id": "style_social",
            "name": "社群风",
            "title": title,
            "subtitle": f"{subtitle}｜一起参与更划算",
            "cta_text": cta,
            "link": link,
        },
    ]


def render_template_message(template: Dict[str, Any]) -> str:
    return f"{template.get('title','')}\n{template.get('subtitle','')}\n{template.get('cta_text','')}: {template.get('link','')}"
