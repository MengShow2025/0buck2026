import csv
import re
from pathlib import Path

ROOT = Path("/Users/long/Desktop/0buck")
FRONT = ROOT / "frontend/src/components/VCC"
CSV_PATH = ROOT / "0Buck_i18n_Translation_Table.csv"
OUT = ROOT / "backend/tmp/i18n_missing_zh.txt"

ZH_SEGMENT = re.compile(r"[\u4e00-\u9fff][\u4e00-\u9fffA-Za-z0-9_\\-（）()：:，。！？、·/\\s%+\\[\\]{}]*")


def main() -> None:
    extracted: list[tuple[str, str]] = []
    for p in FRONT.rglob("*"):
        if p.suffix not in {".ts", ".tsx"}:
            continue
        lines = p.read_text(encoding="utf-8", errors="ignore").splitlines()
        for line in lines:
            if not re.search(r"[\u4e00-\u9fff]", line):
                continue
            if line.strip().startswith("//"):
                continue
            for m in ZH_SEGMENT.finditer(line):
                s = m.group(0).strip()
                if s and len(s) >= 2:
                    extracted.append((str(p.relative_to(ROOT)), s))

    existing = set()
    with CSV_PATH.open("r", encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            existing.add((r.get("Original_ZH") or "").strip())
            existing.add((r.get("Current_ZH") or "").strip())

    missing: list[tuple[str, str]] = []
    seen = set()
    for file, s in extracted:
        if s in seen:
            continue
        seen.add(s)
        if s in existing:
            continue
        missing.append((file, s))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as f:
        for file, s in missing:
            f.write(f"{file}\t{s}\n")

    print(f"unique_missing={len(missing)}")
    print(f"written={OUT}")
    for file, s in missing[:120]:
        print(f"{file}\t{s}")


if __name__ == "__main__":
    main()
