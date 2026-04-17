import os
import re
import sys


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


def main() -> int:
    from app.core.feature_flags_registry import FEATURE_FLAGS

    used: set[str] = set()
    pattern = re.compile(r"enabled\(\s*[\"'](ff\.[^\"']+)[\"']")

    root = os.path.join(os.path.dirname(__file__), "..", "app")
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            if not fn.endswith(".py"):
                continue
            path = os.path.join(dirpath, fn)
            with open(path, "r", encoding="utf-8") as f:
                src = f.read()
            for m in pattern.finditer(src):
                used.add(m.group(1))

    missing = sorted([k for k in used if k not in FEATURE_FLAGS])
    if missing:
        print("missing flags in registry:")
        for k in missing:
            print(f"- {k}")
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

