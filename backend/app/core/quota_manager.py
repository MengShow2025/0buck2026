from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models import AIUsageQuota

from app.models.butler import UserButlerProfile

# Limits as per requirements
DAILY_LIMIT = 1.0   # $1
MONTHLY_LIMIT = 10.0 # $10

def check_and_update_quota(user_id: int, estimated_cost: float, db: Optional[Session] = None) -> bool:
    """
    Checks if a user has enough quota for an AI call.
    BYOK Support: If user has their own API key, bypass platform quota.
    """
    should_close = False
    if db is None:
        db = SessionLocal()
        should_close = True
        
    try:
        # BYOK Check: Bypass quota if user has their own key configured
        profile = db.query(UserButlerProfile).filter(UserButlerProfile.user_id == user_id).first()
        if profile and profile.ai_api_key:
            return True # Unlimited use with private key
            
        quota = db.query(AIUsageQuota).filter(AIUsageQuota.user_id == user_id).first()
        
        now = datetime.now()
        
        if not quota:
            # Create a new quota record if it doesn't exist
            quota = AIUsageQuota(
                user_id=user_id,
                daily_cost_usd=0.0,
                monthly_cost_usd=0.0,
                last_reset_at=now
            )
            db.add(quota)
            db.flush()
        
        # Reset daily cost if it's a new day
        if quota.last_reset_at.date() < now.date():
            quota.daily_cost_usd = 0.0
            # Reset monthly cost if it's a new month
            if quota.last_reset_at.month != now.month or quota.last_reset_at.year != now.year:
                quota.monthly_cost_usd = 0.0
            quota.last_reset_at = now
            db.flush()

        # Check if the estimated cost exceeds daily or monthly limits
        if (quota.daily_cost_usd + estimated_cost > DAILY_LIMIT) or \
           (quota.monthly_cost_usd + estimated_cost > MONTHLY_LIMIT):
            return False
        
        # Deduct/Update usage
        quota.daily_cost_usd += estimated_cost
        quota.monthly_cost_usd += estimated_cost
        db.commit()
        return True
    except Exception as e:
        # Log error
        print(f"Error in check_and_update_quota for user {user_id}: {e}")
        # Fail-safe: deny call if quota check fails
        return False 
    finally:
        if should_close:
            db.close()
