from sqlalchemy import Column, Integer, String, Numeric, DateTime, Boolean, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from .product import Base

class RewardPhase(Base):
    __tablename__ = "reward_phases"
    
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("checkin_plans.id"), nullable=False)
    phase_num = Column(Integer, nullable=False)
    ratio = Column(Numeric(5, 4, asdecimal=True), nullable=False)
    days_required = Column(Integer, nullable=False)
    status = Column(String, default="pending") # pending, active, completed, forfeited
    amount = Column(Numeric(10, 2, asdecimal=True), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class C2WRefundBuffer(Base):
    """
    v4.0: Buffer for 'Overflow Price Drop' (C2W).
    Initial Payment - Final Price = Buffer (to be refunded to user wallet).
    """
    __tablename__ = "c2w_refund_buffers"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(BigInteger, nullable=False, index=True)
    product_id = Column(BigInteger, nullable=False)
    
    # Amount Calculations
    initial_payment = Column(Numeric(10, 2), nullable=False)
    final_price = Column(Numeric(10, 2), nullable=False)
    refund_amount = Column(Numeric(10, 2), nullable=False)
    
    # Status Flow
    status = Column(String(20), default="pending") # 'pending', 'refunded', 'cancelled'
    processed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class PlatformProfitPool(Base):
    __tablename__ = "platform_profit_pool"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Numeric(10, 2, asdecimal=True), nullable=False)
    source = Column(String, nullable=False) # 'forfeited_rebate', 'exchange_buffer', 'group_free_fee'
    reference_id = Column(String, nullable=True) # order_id or plan_id
    
    # v4.0: Real-time Cost Collision Coefficient
    margin_ratio = Column(Numeric(5, 4, asdecimal=True), nullable=True)
    is_red_alert = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

class RiskCollisionIndex(Base):
    """
    v4.0: Actuarial risk monitoring.
    Adjusts 'Full Back' weights based on actual forfeiture rates.
    """
    __tablename__ = "risk_collision_indices"
    
    id = Column(Integer, primary_key=True)
    category = Column(String(50), index=True) # 'BEAUTY', 'ELECTRONICS', etc.
    
    # Target vs Actual
    expected_forfeit_rate = Column(Numeric(5, 4)) # e.g. 0.3000 (30%)
    actual_forfeit_rate = Column(Numeric(5, 4))   # e.g. 0.2500 (25%)
    
    # Collision Coefficient (1.0 = Normal, <1.0 = Risk Increase)
    collision_coefficient = Column(Numeric(5, 4), default=1.0000)
    
    # Metadata
    sample_size = Column(Integer, default=0) # Number of plans tracked
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
