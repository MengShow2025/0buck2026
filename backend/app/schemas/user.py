from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None

class UserProfileResponse(BaseModel):
    customer_id: int
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]
    user_type: str
    referral_code: Optional[str]
    user_tier: str
    is_two_factor_enabled: bool
    is_active: bool
    
class KYCSubmitRequest(BaseModel):
    full_name: str
    id_type: str # 'Passport', 'ID_CARD'
    id_number: str
    id_front_url: Optional[str] = None
    id_back_url: Optional[str] = None

class KYCStatusResponse(BaseModel):
    kyc_level: int
    status: str # 'unverified', 'pending', 'verified', 'rejected'
    rejection_reason: Optional[str] = None
    verified_at: Optional[datetime] = None

class TierRuleResponse(BaseModel):
    tier_name: str
    min_spend_usd: Decimal
    min_active_fans: int
    referral_rate: Decimal
    fan_rate: Decimal
    perks_config: Optional[Dict[str, Any]] = None

class UserTierStatus(BaseModel):
    current_tier: str
    current_spend: Decimal
    current_fans: int
    next_tier: Optional[str] = None
    spend_to_next: Optional[Decimal] = None
    fans_to_next: Optional[int] = None
    referral_rate: Decimal
    fan_rate: Decimal
