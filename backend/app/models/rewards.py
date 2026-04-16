from sqlalchemy import Column, Integer, String, BigInteger, DateTime, ForeignKey, Enum, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .product import Base
import enum
import uuid

class PointSource(str, enum.Enum):
    REGISTRATION = "REGISTRATION"
    SIGN_IN = "SIGN_IN"
    PURCHASE = "PURCHASE"
    REFERRAL = "REFERRAL"
    TASK = "TASK"
    AD_WATCH = "AD_WATCH"
    SOCIAL_POST = "SOCIAL_POST"
    FEEDBACK = "FEEDBACK"
    REVIEW = "REVIEW"

class PointTransaction(Base):
    __tablename__ = "point_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), index=True)
    amount = Column(Integer, nullable=False)
    source = Column(Enum(PointSource, name="pointsource"), nullable=False)
    order_id = Column(BigInteger, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=func.now())

class AIUsageQuota(Base):
    __tablename__ = "ai_usage_quotas"
    
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), primary_key=True)
    daily_cost_usd = Column(Float, default=0.0)
    monthly_cost_usd = Column(Float, default=0.0)
    last_reset_at = Column(DateTime, default=func.now())

class Points(Base):
    __tablename__ = "points"
    
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), primary_key=True)
    balance = Column(Integer, default=0)
    total_earned = Column(Integer, default=0)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class RenewalCard(Base):
    """
    v3.0: Cards used to rescue a broken check-in streak.
    """
    __tablename__ = "renewal_cards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), index=True)
    plan_id = Column(String(100), index=True) # CheckinPlan ID
    
    status = Column(String(20), default="unused") # 'unused', 'used', 'expired'
    period_num = Column(Integer, nullable=True)
    
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
