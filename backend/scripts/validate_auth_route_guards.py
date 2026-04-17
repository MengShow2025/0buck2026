import os
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


def _deps(route) -> set[str]:
    return {getattr(d.call, "__name__", "?") for d in route.dependant.dependencies}


def main() -> int:
    from fastapi.routing import APIRoute

    from app.core.public_endpoints import is_public_path
    from app.main import app

    errors: list[str] = []
    for r in app.router.routes:
        if not isinstance(r, APIRoute):
            continue
        path = r.path
        if not path.startswith("/api/v1/auth/"):
            continue
        if is_public_path(path):
            continue

        deps = _deps(r)
        if "get_current_user" not in deps and "get_current_admin" not in deps:
            errors.append(f"auth route missing auth dependency: {path}")

    if errors:
        for e in errors:
            print(e)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

