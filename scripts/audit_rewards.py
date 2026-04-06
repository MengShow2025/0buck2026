
import sys
import os
from datetime import datetime, date, timedelta
from decimal import Decimal

# Add project root to path
sys.path.append("/Volumes/SAMSUNG 970/AccioWork/coder/0buck/")
sys.path.append("/Volumes/SAMSUNG 970/AccioWork/coder/0buck/backend")

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.models.product import Base
from backend.app.services.rewards import RewardsService
from backend.app.models.ledger import CheckinPlan, UserExt, Wallet

# Use a temporary sqlite DB for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_rewards_audit.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def test_20_phase_logic():
    db = SessionLocal()
    service = RewardsService(db)
    
    customer_id = 12345
    order_id = 999
    reward_base = Decimal("100.00")
    
    print("--- 20-Phase Logic Test ---")
    
    # 1. Init plan
    plan = service.init_checkin_plan(customer_id, order_id, reward_base)
    print(f"Plan initialized: status={plan.status}, reward_base={plan.reward_base}")
    
    # 2. Start plan
    service.start_checkin_plan(customer_id, plan.id)
    print(f"Plan started: status={plan.status}")
    
    # Mock award_points to avoid SQLite Enum issues
    service.award_points = lambda user_id, amount, source: print(f"  Points Awarded: {amount} for {source}")
    
    # 3. Simulate P1 (5 days)...
    print("Simulating P1 (5 days)...")
    for i in range(1, 6):
        # Mock date to be consecutive
        service._get_local_today = lambda tz: date.today() + timedelta(days=i-1)
        res = service.process_checkin(customer_id, plan.id)
        print(f"  Day {i}: {res['status']}, Period={res['period']}, Day={res['day']}")
    
    db.refresh(plan)
    print(f"After P1: Period={plan.current_period}, Total Earned={plan.total_earned}")
    # P1 ratio is 4%, so reward should be 4.00
    assert plan.total_earned == Decimal("4.00")
    
    # 4. Simulate Missed Day in P2 (10 days)
    print("\nSimulating Missed Day in P2...")
    # Last checkin was Day 5 of P1, but period advanced to P2, Day 0.
    # We'll check in on Day 1 of P2
    service._get_local_today = lambda tz: date.today() + timedelta(days=5)
    res = service.process_checkin(customer_id, plan.id)
    print(f"  P2 Day 1: {res['status']}, Period={res['period']}, Day={res['day']}")
    
    # Miss a day (Day 2 of P2)
    service._get_local_today = lambda tz: date.today() + timedelta(days=7) # Skipped Day 6
    res = service.process_checkin(customer_id, plan.id)
    print(f"  P2 Day 3 (after missing Day 2): {res['status']}, Period={res['period']}, Day={res['day']}, Consecutive={res['consecutive']}")
    
    db.refresh(plan)
    print(f"After Missed Day: Period={plan.current_period}, Day={plan.consecutive_days}")
    # Should have jumped to P3, Day 1
    assert plan.current_period == 3
    assert plan.consecutive_days == 1
    
    print("\nTest Passed!")
    db.close()

def test_distribution_priorities():
    db = SessionLocal()
    service = RewardsService(db)
    service.award_points = lambda user_id, amount, source: None
    
    print("\n--- Distribution Priorities Test ---")
    
    # Setup KOL
    kol_id = 888
    kol = service.ensure_user_exists(kol_id)
    kol.user_type = 'kol'
    kol.referral_code = 'KOL_GOLD'
    kol.kol_one_time_rate = Decimal('0.15')
    db.commit()
    
    # Setup Invitee
    invitee_id = 777
    
    # Record referral
    service.record_referral(invitee_id, 'KOL_GOLD')
    
    # Process commission
    order_id = 1001
    reward_base = Decimal('200.00')
    service.process_referral_commissions(invitee_id, order_id, reward_base)
    
    wallet = db.query(Wallet).filter_by(user_id=kol_id).first()
    print(f"KOL Wallet Balance: {wallet.balance_available}")
    # 200 * 0.15 = 30.00
    assert wallet.balance_available == Decimal('30.00')
    
    print("Test Passed!")
    db.close()

if __name__ == "__main__":
    try:
        test_20_phase_logic()
        test_distribution_priorities()
    finally:
        if os.path.exists("./test_rewards_audit.db"):
            os.remove("./test_rewards_audit.db")
