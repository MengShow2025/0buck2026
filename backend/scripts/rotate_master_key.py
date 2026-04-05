import sys
import os
import logging

# Add backend dir to path to import app
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from app.models.butler import UserButlerProfile
from app.core.security import decrypt_api_key, encrypt_api_key

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def rotate(old_key: str, new_key: str):
    """
    Rotates the MASTER_SECRET_KEY by re-encrypting all user BYOK API keys.
    """
    db = SessionLocal()
    try:
        profiles = db.query(UserButlerProfile).filter(UserButlerProfile.ai_api_key.isnot(None)).all()
        logger.info(f"Found {len(profiles)} UserButlerProfiles with AI API Keys.")
        
        old_key_bytes = old_key.encode().ljust(32, b'\0')[:32]
        new_key_bytes = new_key.encode().ljust(32, b'\0')[:32]
        
        count = 0
        failed = 0
        for p in profiles:
            # Decrypt with old key
            raw_key = decrypt_api_key(p.ai_api_key, custom_key=old_key_bytes)
            if not raw_key:
                logger.warning(f"  [!] Failed to decrypt key for user {p.user_id}. Check if OLD_KEY matches the one used to encrypt it.")
                failed += 1
                continue
            
            # Re-encrypt with new key
            new_encrypted = encrypt_api_key(raw_key, custom_key=new_key_bytes)
            p.ai_api_key = new_encrypted
            count += 1
            logger.info(f"  [+] Rotated key for user {p.user_id}")
            
        db.commit()
        logger.info(f"Migration Complete: {count} keys rotated, {failed} failures.")
    except Exception as e:
        db.rollback()
        logger.error(f"Fatal error during rotation: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python rotate_master_key.py <OLD_KEY> <NEW_KEY>")
        print("Example: python rotate_master_key.py 0buck_default_master_key_for_api_keys_32 NEW_SUPER_SECRET_KEY_2026")
        sys.exit(1)
    
    old_k = sys.argv[1]
    new_k = sys.argv[2]
    
    confirm = input(f"Confirm rotation from '{old_k}' to '{new_k}'? (y/N): ")
    if confirm.lower() == 'y':
        rotate(old_k, new_k)
    else:
        print("Rotation cancelled.")
