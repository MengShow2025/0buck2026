from __future__ import annotations

from pathlib import Path
import json
import re


def contains_cjk(s: str) -> bool:
    return re.search(r"[\u4e00-\u9fff]", s) is not None


def parse_table_line(line: str):
    line = line.rstrip("\n").rstrip("\r")
    if not line or line.startswith("Key,"):
        return None

    first = line.find(",")
    if first == -1:
        return None
    second = line.find(",", first + 1)
    if second == -1:
        return None
    third = line.find(",", second + 1)
    if third == -1:
        return None

    key = line[:first].strip()
    category = line[first + 1 : second].strip()
    original_zh = line[second + 1 : third].strip()
    remainder = line[third + 1 :]

    if not key:
        return None

    comma_positions = [i for i, ch in enumerate(remainder) if ch == ","]
    boundary = None
    for idx, pos in enumerate(comma_positions):
        next_pos = comma_positions[idx + 1] if idx + 1 < len(comma_positions) else None
        seg_end = next_pos if next_pos is not None else len(remainder)
        seg = remainder[pos + 1 : seg_end]
        if contains_cjk(seg) or seg.strip() == "":
            boundary = (pos, seg_end)
            break

    if boundary is None:
        if remainder.count(",") >= 2:
            original_en, current_zh, current_en = remainder.rsplit(",", 2)
        else:
            original_en, current_zh, current_en = remainder, "", ""
    else:
        i, j = boundary
        original_en = remainder[:i]
        current_zh = remainder[i + 1 : j]
        current_en = remainder[j + 1 :]

    return {
        "key": key,
        "category": category,
        "original_zh": original_zh.strip(),
        "original_en": original_en.strip(),
        "current_zh": current_zh.strip(),
        "current_en": current_en.strip(),
    }


def sync(*, csv_path: Path, out_dir: Path) -> tuple[int, int]:
    zh_dict: dict[str, str] = {}
    en_dict: dict[str, str] = {}

    with open(csv_path, "r", encoding="utf-8") as f:
        for line in f:
            row = parse_table_line(line)
            if not row:
                continue

            key = row["key"]
            zh_val = row["current_zh"] or row["original_zh"]
            en_val = row["current_en"] or row["original_en"]

            if zh_val:
                zh_dict[key] = zh_val
            if en_val:
                en_dict[key] = en_val

    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "en.json").write_text(
        json.dumps(en_dict, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    (out_dir / "zh.json").write_text(
        json.dumps(zh_dict, ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )

    return (len(zh_dict), len(en_dict))


def main() -> None:
    repo_root = Path(__file__).resolve().parents[2]
    csv_path = repo_root / "0Buck_i18n_Translation_Table.csv"
    out_dir = repo_root / "frontend" / "src" / "i18n" / "locales"

    zh_count, en_count = sync(csv_path=csv_path, out_dir=out_dir)
    print(f"Rebuilt locales JSON from CSV: zh={zh_count} en={en_count}")


if __name__ == "__main__":
    main()

