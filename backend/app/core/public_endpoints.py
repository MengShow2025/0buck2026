from __future__ import annotations


PUBLIC_API_PREFIXES = [
    "/api/v1/auth/login",
    "/api/v1/auth/logout",
    "/api/v1/auth/callback/",
    "/api/v1/auth/check-2fa",
    "/api/v1/auth/2fa/verify-login",
    "/api/v1/auth/2fa/setup",
    "/api/v1/health",
    "/api/v1/system/",
]


PUBLIC_ROOT_PATHS = [
    "/healthz",
    "/metrics",
]


def is_public_path(path: str) -> bool:
    if path in PUBLIC_ROOT_PATHS:
        return True
    return any(path.startswith(p) for p in PUBLIC_API_PREFIXES)

