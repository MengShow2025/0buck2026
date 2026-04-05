from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, date
from decimal import Decimal
from typing import Dict, Any, Optional
import uuid

from app.models.rewards import PointTransaction, AIUsageQuota, Points, PointSource
from app.models.ledger import UserExt, CheckinPlan
from app.services.config_service import ConfigService

# Constants for Points Engine
DAILY_POINT_CAP = 150
RENEWAL_CARD_COST = 3000  # Updated to 3000 as per Master Plan v2.0

def get_reward_rates(db: Session) -> Dict[str, Decimal]:
    """
    v3.4.5 Dynamic Reward Rates from SystemConfig.
    Falls back to hardcoded defaults if not configured in DB.
    """
    config = ConfigService(db)
    return {
        "silver_rate": Decimal(str(config.get("silver_rate", 0.015))),
        "gold_rate": Decimal(str(config.get("gold_rate", 0.02))),
        "platinum_rate": Decimal(str(config.get("platinum_rate", 0.03))),
        "kol_dist_default": Decimal(str(config.get("kol_dist_default", 0.15))),
        "kol_fan_default": Decimal(str(config.get("kol_fan_default", 0.05))),
        "fan_silver_rate": Decimal(str(config.get("fan_silver_rate", 0.01))),
        "fan_gold_rate": Decimal(str(config.get("fan_gold_rate", 0.0125))),
        "fan_platinum_rate": Decimal(str(config.get("fan_platinum_rate", 0.015))),
    }

def calculate_order_reward(db: Session, order_data: Dict[str, Any], referrer_id: Optional[int] = None) -> Decimal:
    """
    v3.4.4 Final Distribution Logic (Official Priorities):
    1. Direct Referral (分销奖) - 8%-20% for KOL (negotiated), 1.5%-3% for Users (Tiered)
       - Triggered by ANY product/merchant share link.
    2. Fan Reward (粉丝奖) - 3%-8% for KOL (negotiated), 1.0%-1.5% for Users (Tiered, 2Y lock)
       - Triggered by orders from bound fans (excluding orders from others' referral links).
    3. Group Buy (拼团免单) - 1 Initiator + 3 Invitees = 4 Orders.
    4. Cashback (购物返现) - 500-day/20-phase 100% pool
    
    Priority Rule: Distribution Dividend > Fan Reward. 
    If a Direct Referral exists for this specific order, Fan Reward is SUPPRESSED.
    Calculation Base: Strictly EXCLUDING shipping and taxes (reward_base).
    """
    rates = get_reward_rates(db)
    # Use reward_base if provided (it excludes shipping/taxes), else fallback to total_price
    reward_base = Decimal(str(order_data.get("reward_base") or order_data.get("total_price", 0)))
    customer_id = order_data.get("customer_id")
    
    # 1. Direct Referral (Highest Priority) - Triggered by single-use share link
    if referrer_id:
        referrer = db.query(UserExt).filter(UserExt.customer_id == referrer_id).first()
        if referrer:
            if referrer.user_type == "kol":
                # KOL: Use custom dist_rate (negotiated) if set, else default 15%
                rate = referrer.dist_rate if referrer.dist_rate is not None else rates["kol_dist_default"]
                return reward_base * rate
            else:
                # User: Tiered (1.5% Silver, 2.0% Gold, 3.0% Platinum)
                # If a specific dist_rate is set for a power user, use it
                if referrer.dist_rate is not None:
                    return reward_base * referrer.dist_rate
                
                if referrer.user_tier == "platinum": return reward_base * rates["platinum_rate"]
                elif referrer.user_tier == "gold": return reward_base * rates["gold_rate"]
                else: return reward_base * rates["silver_rate"]
            
    # 2. Fan Reward (Suppressed if Direct Referral exists) - Triggered by 2-year LTV bond
    user = db.query(UserExt).filter(UserExt.customer_id == customer_id).first()
    if user and user.inviter_id:
        inviter = db.query(UserExt).filter(UserExt.customer_id == user.inviter_id).first()
        if inviter:
            # Check 2-year lock (730 days)
            days_since_reg = (datetime.now() - user.created_at).days
            if days_since_reg <= 730:
                if inviter.user_type == "kol":
                    # KOL Fan: Use custom fan_rate (negotiated) if set, else default 5%
                    rate = inviter.fan_rate if inviter.fan_rate is not None else rates["kol_fan_default"]
                    return reward_base * rate
                else:
                    # User Fan: Tiered (1.0% Silver, 1.25% Gold, 1.5% Platinum)
                    if inviter.fan_rate is not None:
                        return reward_base * inviter.fan_rate
                        
                    if inviter.user_tier == "platinum": return reward_base * rates["fan_platinum_rate"]
                    elif inviter.user_tier == "gold": return reward_base * rates["fan_gold_rate"]
                    else: return reward_base * rates["fan_silver_rate"]

    return Decimal('0.0')

    return Decimal('0.0')

def earn_points(db: Session, user_id: int, source: PointSource, amount: int) -> bool:
    """
    Earn points with a daily cap of 150 Pts for non-transactional tasks.
    Transactional source (PURCHASE) is exempt from the daily cap.
    """
    # Non-transactional sources are subject to the daily cap
    is_transactional = (source == PointSource.PURCHASE)
    
    if not is_transactional:
        today = date.today()
        # Aggregate today's non-transactional point earnings
        today_earned = db.query(func.sum(PointTransaction.amount)).filter(
            PointTransaction.user_id == user_id,
            PointTransaction.source != PointSource.PURCHASE,
            PointTransaction.amount > 0,
            func.date(PointTransaction.created_at) == today
        ).scalar() or 0
        
        if today_earned >= DAILY_POINT_CAP:
            return False # Cap already reached
            
        # Adjust amount to stay within cap if necessary
        if today_earned + amount > DAILY_POINT_CAP:
            amount = DAILY_POINT_CAP - today_earned

    if amount <= 0:
        return False

    # Thread-safe balance update using row-level locking
    points_record = db.query(Points).filter(Points.user_id == user_id).with_for_update().first()
    if not points_record:
        points_record = Points(user_id=user_id, balance=0, total_earned=0)
        db.add(points_record)
    
    points_record.balance += amount
    points_record.total_earned += amount
    
    # Log the point transaction
    txn = PointTransaction(
        user_id=user_id,
        amount=amount,
        source=source
    )
    db.add(txn)
    db.commit()
    return True

def calculate_final_price(cost_cny: float, exchange_rate: float, multiplier: float) -> dict:
    """
    Final Development Plan Pricing Logic:
    STRICT: Uses Decimal for all currency calculations.
    """
    cost_cny_dec = Decimal(str(cost_cny))
    rate_dec = Decimal(str(exchange_rate))
    mult_dec = Decimal(str(multiplier))
    buffer_dec = Decimal("1.005")
    
    cost_usd = (cost_cny_dec * buffer_dec) / rate_dec
    final_price = cost_usd * buffer_dec * mult_dec
    
    return {
        "source_cost_usd": float(cost_usd.quantize(Decimal("0.01"))),
        "final_price": float(final_price.quantize(Decimal("0.01")))
    }

class FinanceEngine:
    def __init__(self, db: Session):
        self.db = db

    def calculate_order_reward(self, order_data: Dict[str, Any], referrer_id: Optional[int] = None, kol_negotiated_rate: Optional[float] = None) -> Decimal:
        return calculate_order_reward(self.db, order_data, referrer_id=referrer_id)

    def earn_points(self, user_id: int, source: PointSource, amount: int) -> bool:
        return earn_points(self.db, user_id, source, amount)

    def redeem_renewal_card(self, user_id: int, order_id: str, phase_id: int) -> (bool, str):
        from app.services.rewards import RewardsService
        rewards = RewardsService(self.db)
        from app.models.ledger import CheckinPlan
        # Try finding by order_id (casted to int)
        try:
            order_id_int = int(order_id)
            plan = self.db.query(CheckinPlan).filter_by(order_id=order_id_int, user_id=user_id).first()
        except:
            plan = None
            
        if not plan:
            return False, "Check-in plan not found for this order."
            
        res = rewards.redeem_renewal_card(user_id, str(plan.id))
        if res["status"] == "success":
            return True, res["message"]
        else:
            return False, res["message"]
