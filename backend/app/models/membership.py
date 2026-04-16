from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Boolean, JSON, BigInteger
from sqlalchemy.orm import relationship
from datetime import datetime
from .product import Base

class MembershipTierRule(Base):
    """
    v4.0: Rule Engine for automated leveling.
    Front-end TierRulesDrawer.tsx will pull rules from here.
    """
    __tablename__ = "membership_tier_rules"
    
    id = Column(Integer, primary_key=True)
    tier_name = Column(String(50), unique=True, index=True) # 'bronze', 'silver', 'gold', 'platinum'
    
    # Thresholds
    min_spend_usd = Column(Numeric(12, 2), default=0.0)
    min_active_fans = Column(Integer, default=0)
    
    # Reward Ratios
    referral_rate = Column(Numeric(5, 4), nullable=False) # e.g. 0.0200 for 2%
    fan_rate = Column(Numeric(5, 4), nullable=False)      # e.g. 0.0100 for 1%
    
    # Extra Perks
    perks_config = Column(JSON, nullable=True) # { "withdrawal_fee_free_count": 1, "cashback_boost": 1.1 }
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class InfluencerContract(Base):
    """
    v4.0: Negotiated agreements for KOLs.
    Overrides tier defaults.
    """
    __tablename__ = "influencer_contracts"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), unique=True, index=True)
    
    # Negotiated Rates
    referral_rate = Column(Numeric(5, 4), nullable=False) # e.g. 0.0800 for 8%
    fan_rate = Column(Numeric(5, 4), nullable=False)      # e.g. 0.0400 for 4%
    
    # Contract Lifecycle
    status = Column(String(20), default="active") # 'active', 'suspended', 'expired'
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True) # NULL means permanent until manual update
    
    # Audit Trail
    admin_id = Column(BigInteger) # The admin who approved the negotiation
    notes = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class InfluencerApplication(Base):
    """
    v4.0: Application flow for the 'InfluencerApplyDrawer.tsx'
    """
    __tablename__ = "influencer_applications"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), index=True)
    
    # Application Context
    social_handle = Column(String(100))
    platform = Column(String(50)) # 'TikTok', 'Instagram', 'YouTube'
    follower_count = Column(String(50)) # User input string
    niche = Column(String(50)) # 'Beauty', 'Tech', etc.
    intro = Column(String, nullable=True)
    
    # Review Flow
    status = Column(String(20), default="pending") # 'pending', 'reviewing', 'approved', 'rejected'
    reviewer_notes = Column(String, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
