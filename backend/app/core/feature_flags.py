from __future__ import annotations

import hashlib


def is_in_rollout(seed: str, subject: str, percent: int) -> bool:
    p = int(percent)
    if p <= 0:
        return False
    if p >= 100:
        return True

    key = f"{seed}:{subject}".encode("utf-8")
    digest = hashlib.sha256(key).digest()
    bucket = int.from_bytes(digest[:4], "big") % 100
    return bucket < p

