from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import datetime
import pyotp
from decimal import Decimal

from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.ledger import UserExt, Wallet
from app.models.compliance import IdentityVerification
from app.models.membership import MembershipTierRule
from app.schemas.user import (
    UserProfileResponse, UserProfileUpdate, KYCSubmitRequest, 
    KYCStatusResponse, UserTierStatus, TierRuleResponse
)

router = APIRouter()

@router.get("/me", response_model=UserProfileResponse)
def read_user_me(
    current_user: UserExt = Depends(get_current_user)
) -> Any:
    """
    v5.7.0: Get current user profile.
    """
    return current_user

@router.get("/kyc/status", response_model=KYCStatusResponse)
def get_kyc_status(
    db: Session = Depends(get_db),
    current_user: UserExt = Depends(get_current_user)
) -> Any:
    """
    v4.6.7: Get KYC status for the current user.
    """
    kyc = db.query(IdentityVerification).filter(
        IdentityVerification.user_id == current_user.customer_id
    ).first()
    
    if not kyc:
        return {
            "kyc_level": 0,
            "status": "unverified",
            "rejection_reason": None,
            "verified_at": None
        }
    
    return kyc

@router.post("/kyc/submit", response_model=KYCStatusResponse)
def submit_kyc(
    kyc_in: KYCSubmitRequest,
    db: Session = Depends(get_db),
    current_user: UserExt = Depends(get_current_user)
) -> Any:
    """
    v4.6.7: Submit KYC application.
    """
    kyc = db.query(IdentityVerification).filter(
        IdentityVerification.user_id == current_user.customer_id
    ).first()
    
    if kyc and kyc.status == "verified":
        raise HTTPException(status_code=400, detail="KYC already verified")
    
    if not kyc:
        kyc = IdentityVerification(user_id=current_user.customer_id)
        db.add(kyc)
    
    kyc.full_name = kyc_in.full_name
    kyc.id_type = kyc_in.id_type
    kyc.id_number_masked = f"{kyc_in.id_number[:4]}****{kyc_in.id_number[-4:]}"
    kyc.id_front_url = kyc_in.id_front_url
    kyc.id_back_url = kyc_in.id_back_url
    kyc.status = "pending"
    kyc.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(kyc)
    return kyc

@router.get("/tier/status", response_model=UserTierStatus)
def get_tier_status(
    db: Session = Depends(get_db),
    current_user: UserExt = Depends(get_current_user)
) -> Any:
    """
    v4.0: Get user's current membership tier status and progress.
    """
    # 1. Get current stats (Mocking spend/fans for now as they're not in DB yet)
    # In reality, these would be aggregated from orders and referral_relationships
    current_spend = Decimal("120.50") 
    current_fans = 5
    
    current_rule = db.query(MembershipTierRule).filter(
        MembershipTierRule.tier_name == current_user.user_tier
    ).first()
    
    # 2. Find next tier
    tiers = db.query(MembershipTierRule).order_by(MembershipTierRule.min_spend_usd.asc()).all()
    next_rule = None
    for r in tiers:
        if r.min_spend_usd > (current_rule.min_spend_usd if current_rule else 0):
            next_rule = r
            break
            
    # 3. Calculate gaps
    spend_to_next = None
    fans_to_next = None
    if next_rule:
        spend_to_next = max(Decimal(0), next_rule.min_spend_usd - current_spend)
        fans_to_next = max(0, next_rule.min_active_fans - current_fans)
        
    return {
        "current_tier": current_user.user_tier,
        "current_spend": current_spend,
        "current_fans": current_fans,
        "next_tier": next_rule.tier_name if next_rule else None,
        "spend_to_next": spend_to_next,
        "fans_to_next": fans_to_next,
        "referral_rate": current_user.dist_rate or (current_rule.referral_rate if current_rule else 0.02),
        "fan_rate": current_user.fan_rate or (current_rule.fan_rate if current_rule else 0.01)
    }

@router.get("/tier/rules", response_model=List[TierRuleResponse])
def get_tier_rules(
    db: Session = Depends(get_db)
) -> Any:
    """
    v4.0: Get all membership tier rules for transparency.
    """
    return db.query(MembershipTierRule).order_by(MembershipTierRule.id.asc()).all()

@router.post("/backup-email/bind")
def bind_backup_email(
    email: str = Body(..., embed=True),
    otp: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user: UserExt = Depends(get_current_user)
) -> Any:
    """
    v5.5: Bind a backup email for account recovery and verification.
    The backup email cannot be any user's primary system account.
    """
    # 1. Check if the email is already used as a primary email
    exists = db.query(UserExt).filter(UserExt.email == email).first()
    if exists:
        raise HTTPException(status_code=400, detail="This email is already a system primary account")
    
    # 2. Verify OTP via Google 2FA (no bypass)
    if not current_user.is_two_factor_enabled or not current_user.two_factor_secret:
        raise HTTPException(status_code=400, detail="2FA required to bind backup email")
    totp = pyotp.TOTP(current_user.two_factor_secret)
    if not totp.verify(otp):
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    # 3. Update backup email
    current_user.backup_email = email
    current_user.updated_at = datetime.utcnow()
    
    db.commit()
    return {"status": "success", "backup_email": email}
