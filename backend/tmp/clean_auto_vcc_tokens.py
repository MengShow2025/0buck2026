import re
from pathlib import Path

FILES = [
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/ProductDetailDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/CheckoutDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/ContactsDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/SquareDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/CreateGroupDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/ChatRoomDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/NotificationDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/AuthDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/PointsHistoryDrawer.tsx",
    "/Users/long/Desktop/0buck/frontend/src/components/VCC/Drawer/PointsExchangeDrawer.tsx",
]

PATTERN = re.compile(r"t\('auto\.vcc\.[0-9a-f]+'\)")

for file_path in FILES:
    p = Path(file_path)
    if not p.exists():
        continue
    source = p.read_text(encoding="utf-8", errors="ignore")
    cleaned = PATTERN.sub("", source)
    if cleaned != source:
        p.write_text(cleaned, encoding="utf-8")
        print("cleaned", p.name)
