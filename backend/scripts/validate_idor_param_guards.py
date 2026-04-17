import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


PARAM_NAMES = {"user_id", "customer_id"}


def _deps(route) -> set[str]:
    return {getattr(d.call, "__name__", "?") for d in route.dependant.dependencies}


def _is_public(path: str) -> bool:
    from app.core.public_endpoints import is_public_path

    return is_public_path(path)


def _has_id_param(path: str) -> bool:
    return any(f"{{{n}}}" in path for n in PARAM_NAMES)


def main() -> int:
    from fastapi.routing import APIRoute

    from app.main import app

    errors: list[str] = []
    for r in app.router.routes:
        if not isinstance(r, APIRoute):
            continue
        path = r.path
        if not path.startswith("/api/v1/"):
            continue
        if not _has_id_param(path):
            continue
        if _is_public(path):
            continue

        deps = _deps(r)
        if "get_current_user" not in deps and "get_current_admin" not in deps:
            errors.append(f"missing auth dependency for id-param route: {path}")

    if errors:
        for e in errors:
            print(e)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
