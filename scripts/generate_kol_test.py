from backend.app.db.session import SessionLocal
from backend.app.models.rewards import UserExt, Wallet
from decimal import Decimal
import os

def create_test_kol():
    db = SessionLocal()
    try:
        # Create or update KOL Boss
        kol_id = 111222333444 # Dummy ID for KOL Boss
        referral_code = "kol_boss_test"
        
        kol = db.query(UserExt).filter(UserExt.referral_code == referral_code).first()
        if not kol:
            kol = UserExt(
                customer_id=kol_id,
                referral_code=referral_code,
                user_type="kol",
                kol_status="approved",
                kol_one_time_rate=Decimal("15.00"),
                kol_long_term_rate=Decimal("3.00")
            )
            db.add(kol)
            db.commit()
            db.refresh(kol)
            print(f"KOL Created: {referral_code}")
        else:
            print(f"KOL already exists: {referral_code}")
            
        # Ensure Wallet exists
        wallet = db.query(Wallet).filter(Wallet.user_id == kol_id).first()
        if not wallet:
            wallet = Wallet(user_id=kol_id, balance_available=Decimal("0.00"), balance_locked=Decimal("0.00"))
            db.add(wallet)
            db.commit()
            print(f"Wallet Created for KOL: {kol_id}")

        # Generate Link
        base_url = "https://36e1-38-175-103-191.ngrok-free.app"
        test_link = f"{base_url}/?ref={referral_code}&utm_source=internal&utm_medium=test&utm_campaign=kol_test"
        print("\n" + "="*50)
        print("KOL TEST LINK GENERATED:")
        print(test_link)
        print("="*50)
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    sys.path.append(os.getcwd())
    create_test_kol()
