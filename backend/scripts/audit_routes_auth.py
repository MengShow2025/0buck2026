import os
import sys
from dataclasses import dataclass
from typing import List


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


@dataclass
class RouteRow:
    methods: str
    path: str
    endpoint: str
    deps: str
    risk: str


def main() -> int:
    from fastapi.routing import APIRoute

    from app.main import app

    rows: List[RouteRow] = []
    for r in app.router.routes:
        if not isinstance(r, APIRoute):
            continue
        methods = ",".join(sorted([m for m in r.methods or [] if m not in {"HEAD", "OPTIONS"}]))
        endpoint = f"{getattr(r.endpoint, '__module__', '?')}:{getattr(r.endpoint, '__name__', '?')}"
        deps = ",".join([getattr(d.call, "__name__", "?") for d in r.dependant.dependencies])

        risk = "low"
        p = r.path
        if p.startswith("/api/") or p.startswith("/v1/"):
            if any(x in p for x in ("/admin", "/rewards", "/users", "/butler", "/agent", "/products")):
                risk = "med"
            if any(x in p for x in ("/admin", "/rewards", "/auth")):
                risk = "high"

        rows.append(RouteRow(methods=methods, path=p, endpoint=endpoint, deps=deps, risk=risk))

    rows.sort(key=lambda x: (x.risk, x.path, x.methods))

    out_path = os.path.join(os.path.dirname(__file__), "..", "..", "docs", "superpowers", "reports", "route-auth-audit.md")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("# Route Auth Audit\n\n")
        f.write("| Risk | Methods | Path | Endpoint | Dependencies |\n")
        f.write("|---|---|---|---|---|\n")
        for row in rows:
            f.write(f"| {row.risk} | {row.methods} | {row.path} | {row.endpoint} | {row.deps} |\n")

    print(out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
