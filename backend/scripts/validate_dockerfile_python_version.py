import os


def main() -> int:
    base = os.path.dirname(os.path.dirname(__file__))
    dockerfile = os.path.join(base, "Dockerfile")
    with open(dockerfile, "r", encoding="utf-8") as f:
        src = f.read()
    if "FROM python:3.11" not in src:
        print("Dockerfile must use python:3.11 base image")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

