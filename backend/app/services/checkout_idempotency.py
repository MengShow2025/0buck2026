import hashlib
import re


_TOKEN_PATTERN = re.compile(r"^[A-Za-z0-9_-]{16,128}$")


def normalize_checkout_submit_token(raw_token: str) -> str:
    token = str(raw_token or "").strip()
    if not _TOKEN_PATTERN.fullmatch(token):
        raise ValueError("invalid_checkout_submit_token")
    return token


def build_checkout_submit_event_id(user_id: int, submit_token: str) -> str:
    token_digest = hashlib.sha256(submit_token.encode("utf-8")).hexdigest()[:24]
    return f"checkout_submit:{int(user_id)}:{token_digest}"
