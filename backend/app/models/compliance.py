from sqlalchemy import Column, Integer, String, BigInteger, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.sql import func
from .product import Base

class RestrictedZone(Base):
    """
    v3.1 Geo-fencing (地理围栏): Full blocks or category-level restrictions.
    AI Butler uses 'butler_explanation' for polite rejection.
    """
    __tablename__ = "restricted_zones"

    iso_code = Column(String(2), primary_key=True) # e.g., 'RU', 'KP'
    restriction_level = Column(String(20), default="FULL_BLOCK") # FULL_BLOCK, PARTIAL_CATEGORY
    restricted_categories = Column(JSON, nullable=True) # ['ELECTRONICS']
    
    reason = Column(Text, nullable=True) # Admin internal notes
    butler_explanation = Column(JSON, nullable=True) # {"en": "...", "zh": "..."}
    
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class IdentityVerification(Base):
    """
    v4.6.7 Tiered KYC System (分级认证).
    L1: Email+Phone, L2: ID+Face, L3: Address Proof.
    """
    __tablename__ = "identity_verifications"

    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), primary_key=True)
    
    # Tier Status
    kyc_level = Column(Integer, default=0) # 0, 1, 2, 3
    status = Column(String(20), default="unverified") # unverified, pending, verified, rejected
    
    # Verification Data (Encrypted or hashed)
    full_name = Column(String(255), nullable=True)
    id_type = Column(String(50), nullable=True) # Passport, National ID
    id_number_masked = Column(String(50), nullable=True)
    
    # Proof Assets (References to secure storage)
    id_front_url = Column(String(500), nullable=True)
    id_back_url = Column(String(500), nullable=True)
    face_match_score = Column(Integer, nullable=True)
    
    # Audit Trail
    reviewer_id = Column(BigInteger, nullable=True)
    rejection_reason = Column(String, nullable=True)
    
    verified_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
