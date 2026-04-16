import base64
import hashlib
import hmac
import json
import time
from typing import Any, Dict, Optional


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64url_decode(text: str) -> bytes:
    padding = "=" * ((4 - len(text) % 4) % 4)
    return base64.urlsafe_b64decode((text + padding).encode("utf-8"))


def generate_bind_token(user_id: int, platform: str, secret: str, ttl_seconds: int = 600) -> str:
    payload = {
        "user_id": int(user_id),
        "platform": platform,
        "exp": int(time.time()) + int(ttl_seconds),
    }
    payload_part = _b64url(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    sig = hmac.new(secret.encode("utf-8"), payload_part.encode("utf-8"), hashlib.sha256).digest()
    return f"{payload_part}.{_b64url(sig)}"


def verify_bind_token(token: str, expected_platform: str, secret: str) -> Optional[Dict[str, Any]]:
    try:
        payload_part, sig_part = token.split(".", 1)
        expected_sig = hmac.new(secret.encode("utf-8"), payload_part.encode("utf-8"), hashlib.sha256).digest()
        if not hmac.compare_digest(_b64url_decode(sig_part), expected_sig):
            return None
        payload = json.loads(_b64url_decode(payload_part).decode("utf-8"))
        if payload.get("platform") != expected_platform:
            return None
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        return payload
    except Exception:
        return None

