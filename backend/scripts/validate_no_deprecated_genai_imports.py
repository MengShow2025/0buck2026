import os


FORBIDDEN = [
    "import google.generativeai",
    "google.generativeai",
]


def main() -> int:
    root = os.path.join(os.path.dirname(__file__), "..", "app")
    bad = []
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            if not fn.endswith(".py"):
                continue
            path = os.path.join(dirpath, fn)
            with open(path, "r", encoding="utf-8") as f:
                src = f.read()
            if any(s in src for s in FORBIDDEN):
                rel = os.path.relpath(path, os.path.join(os.path.dirname(__file__), ".."))
                bad.append(rel)

    if bad:
        print("deprecated genai import found:")
        for p in bad:
            print(f"- {p}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

