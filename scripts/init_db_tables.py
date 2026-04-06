import os
import sys

# Add project root to path
project_root = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck"
backend_path = os.path.join(project_root, "backend")
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.db.session import engine
from app.models.product import Base

def init_db():
    print("🛠️ Creating tables in database...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully.")

if __name__ == "__main__":
    init_db()
