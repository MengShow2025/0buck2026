import asyncio
import os
import sys
from datetime import datetime
from decimal import Decimal

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db.session import SessionLocal
from app.models.ledger import Wallet, WalletTransaction
from sqlalchemy import func

async def reconcile_wallets():
    """
    v3.5.0: Daily Financial Reconciliation Script (Double-Entry Audit).
    Validates that Wallet Balance == Initial + sum(Transactions).
    """
    db = SessionLocal()
    try:
        print(f"[{datetime.now()}] Starting Financial Reconciliation...")
        wallets = db.query(Wallet).all()
        
        mismatched_count = 0
        for wallet in wallets:
            # Calculate sum of all transactions for this user
            tx_sum = db.query(func.sum(WalletTransaction.amount)).filter(
                WalletTransaction.user_id == wallet.user_id,
                WalletTransaction.status == 'completed'
            ).scalar() or Decimal('0.0')
            
            # Check for discrepancy
            # Note: Initial balance is assumed to be 0 for new wallets in v3.5
            current_balance = wallet.balance_available + wallet.balance_locked
            discrepancy = current_balance - tx_sum
            
            if abs(discrepancy) > Decimal('0.001'):
                print(f"🚨 ALERT: Discrepancy found for User {wallet.user_id}!")
                print(f"   Wallet Balance: {current_balance}")
                print(f"   Transaction Sum: {tx_sum}")
                print(f"   Diff: {discrepancy}")
                
                # Auto-Locking Logic
                # wallet.status = 'locked' 
                mismatched_count += 1
        
        if mismatched_count == 0:
            print("✅ Reconciliation Success: All wallet balances match transaction logs.")
        else:
            print(f"❌ Reconciliation Finished: {mismatched_count} anomalies detected.")
            
    except Exception as e:
        print(f"Error during reconciliation: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(reconcile_wallets())
