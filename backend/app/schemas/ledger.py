from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class WalletStatus(BaseModel):
    balance_available: Decimal
    balance_locked: Decimal
    pts_balance: int
    currency: str

class WalletTransactionResponse(BaseModel):
    id: UUID
    amount: Decimal
    type: str
    status: str
    description: str
    created_at: datetime

class WithdrawalCreate(BaseModel):
    amount: Decimal
    method: str # 'PayPal', 'Bank', 'USDT'
    destination_address: str
    destination_metadata: Optional[Dict[str, Any]] = None

class OrderResponse(BaseModel):
    shopify_order_id: int
    total_price: Decimal
    status: str
    created_at: datetime

class RewardPhaseResponse(BaseModel):
    phase_num: int
    ratio: Decimal
    amount: Decimal
    days_required: int
    status: str

class CheckinPlanResponse(BaseModel):
    id: int
    product_name: str
    total_amount: Decimal
    remaining_amount: Decimal
    status: str # 'active', 'completed', 'forfeited'
    phases: List[RewardPhaseResponse]
    next_checkin_date: Optional[datetime] = None
