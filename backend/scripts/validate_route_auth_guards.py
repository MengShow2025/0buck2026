import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


def _deps(route) -> set[str]:
    try:
        return {getattr(d.call, "__name__", "?") for d in route.dependant.dependencies}
    except Exception:
        return set()


def main() -> int:
    from fastapi.routing import APIRoute

    from app.main import app

    errors: list[str] = []

    for r in app.router.routes:
        if not isinstance(r, APIRoute):
            continue
        path = r.path
        deps = _deps(r)

        if path.startswith("/api/v1/admin/"):
            if "get_current_admin" not in deps:
                errors.append(f"admin route missing get_current_admin: {path}")

        if path.startswith("/api/v1/customer/sync/"):
            if "get_current_user" not in deps:
                errors.append(f"customer sync missing get_current_user: {path}")

        if path.startswith("/api/v1/agent/session") or path.startswith("/api/v1/agent/stream"):
            if "get_current_user" not in deps:
                errors.append(f"agent route missing get_current_user: {path}")

    if errors:
        for e in errors:
            print(e)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
