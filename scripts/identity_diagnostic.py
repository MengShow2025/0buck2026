import os
import sys
from sqlalchemy import text

# Add project root to path
project_root = "/Volumes/SAMSUNG 970/AccioWork/coder/0buck"
backend_path = os.path.join(project_root, "backend")
if backend_path not in sys.path:
    sys.path.append(backend_path)

from app.db.session import SessionLocal

def diagnostic():
    print("🚀 Running System-wide Identity Diagnostic...")
    db = SessionLocal()
    try:
        print("\n[1] --- Users in users_ext ---")
        users = db.execute(text("SELECT customer_id, email, first_name FROM users_ext")).fetchall()
        for u in users:
            print(f"  - User: ID={u[0]}, Email={u[1]}, Name={u[2]}")
            
        print("\n[2] --- Butler Profiles ---")
        profiles = db.execute(text("SELECT user_id, butler_name, user_nickname FROM user_butler_profiles")).fetchall()
        for p in profiles:
            print(f"  - Profile: UID={p[0]}, Butler={p[1]}, Nickname={p[2]}")
            
        print("\n[3] --- IM Bindings (The critical table) ---")
        bindings = db.execute(text("SELECT * FROM user_im_bindings")).fetchall()
        if not bindings:
            print("  ⚠️ WARNING: user_im_bindings table is EMPTY. No users are linked to IM.")
        for b in bindings:
            print(f"  - Binding: {b}")
            
        # [4] RESET USER 1 NICKNAME TO AVOID CONFUSION
        print("\n[4] --- Resetting User 1 Nickname to 'Guest' ---")
        db.execute(text("UPDATE user_butler_profiles SET user_nickname = '访客(Guest)' WHERE user_id = 1"))
        db.commit()
        print("  ✅ User 1 reset. If the AI calls you 'dudu' now, it means binding is WORKING. If it calls you 'Guest', it is NOT.")

    except Exception as e:
        print(f"❌ Diagnostic Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    diagnostic()
