import sys
import os


def main() -> int:
    if os.getenv("ENFORCE_PY311", "false").lower() != "true":
        return 0
    if sys.version_info[:2] != (3, 11):
        print(f"expected python 3.11.x, got {sys.version.split()[0]}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
