import base64
import hashlib
import json
from typing import Any, Dict, Optional

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


def _pkcs7_unpad(data: bytes) -> bytes:
    if not data:
        raise ValueError("empty data")
    pad_len = data[-1]
    if pad_len <= 0 or pad_len > 16:
        raise ValueError("invalid padding")
    return data[:-pad_len]


def decrypt_feishu_event(encrypted_b64: str, encrypt_key: str) -> Dict[str, Any]:
    """
    Decrypt Feishu encrypted webhook payload.
    Supports both direct-JSON plaintext and random+len+json+app_id format.
    """
    key = hashlib.sha256(encrypt_key.encode("utf-8")).digest()
    iv = key[:16]
    encrypted = base64.b64decode(encrypted_b64)
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    plain = _pkcs7_unpad(decryptor.update(encrypted) + decryptor.finalize())

    # 1) direct json payload
    try:
        return json.loads(plain.decode("utf-8"))
    except Exception:
        pass

    # 2) random(16) + msg_len(4) + msg + app_id
    if len(plain) >= 20:
        msg_len = int.from_bytes(plain[16:20], "big")
        msg = plain[20:20 + msg_len]
        return json.loads(msg.decode("utf-8"))

    raise ValueError("unable to decode decrypted feishu payload")


def maybe_decrypt_feishu_payload(payload: Any, encrypt_key: Optional[str]) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        return {}
    encrypted = payload.get("encrypt")
    if not encrypted or not encrypt_key:
        return payload
    return decrypt_feishu_event(str(encrypted), encrypt_key)
