from pathlib import Path
import csv
import re


JS_PATH = Path("/Users/long/Desktop/0buck/frontend/dist/assets/index-BdgNlbCo.js")
CSV_PATH = Path("/Users/long/Desktop/0buck/0Buck_i18n_Translation_Table.csv")
ANCHORS = [216157, 278479]


def extract_object(js: str, idx: int) -> str:
    start = -1
    for j in range(idx, 0, -1):
        if js[j] == "{":
            frag = js[j : j + 260]
            if '"about"' in frag or '"address.add_title"' in frag or '"ai.quick_reply.check_in"' in frag:
                start = j
                break
    if start == -1:
        start = js.rfind("{", 0, idx)

    depth = 0
    in_str = None
    esc = False
    end = -1
    for k in range(start, len(js)):
        ch = js[k]
        if in_str is not None:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == in_str:
                in_str = None
            continue
        if ch in ('"', "'", "`"):
            in_str = ch
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                end = k
                break

    return js[start : end + 1]


def parse_object(text: str) -> dict:
    data = {}
    pattern = re.compile(r"\"([^\"\\]+)\"\s*:\s*(?:`((?:\\`|[^`])*)`|\"((?:\\\"|[^\"])*)\"|'((?:\\'|[^'])*)')")
    for m in pattern.finditer(text):
        key = m.group(1)
        value = next(g for g in m.groups()[1:] if g is not None)
        value = value.replace("\\n", "\n").replace('\\"', '"').replace("\\'", "'").replace("\\`", "`")
        data[key] = value
    return data


def contains_zh(s: str) -> bool:
    return any("\u4e00" <= ch <= "\u9fff" for ch in s)


def main():
    js = JS_PATH.read_text(encoding="utf-8", errors="ignore")
    objs = [extract_object(js, idx) for idx in ANCHORS]
    dicts = [parse_object(obj) for obj in objs]

    eng = None
    zh = None
    for d in dicts:
        sample = d.get("cashback.pending_notice_title", "")
        if contains_zh(sample):
            zh = d
        else:
            eng = d

    if eng is None or zh is None:
        raise RuntimeError("Failed to identify EN/ZH locale objects from bundle")

    keys = sorted(set(eng.keys()) | set(zh.keys()))
    with CSV_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Key", "Category", "Original_ZH", "Original_EN", "Current_ZH", "Current_EN"])
        for key in keys:
            z = zh.get(key, "")
            e = eng.get(key, "")
            category = key.split(".")[0] if "." in key else "common"
            writer.writerow([key, category, z, e, z, e])

    print(f"eng_keys={len(eng)} zh_keys={len(zh)} total={len(keys)}")
    print(f"wrote={CSV_PATH}")


if __name__ == "__main__":
    main()
