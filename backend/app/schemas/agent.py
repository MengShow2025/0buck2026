from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class BAPAction(BaseModel):
    """
    v3.4 VCC: Standard structure for Business Attachment Protocol.
    """
    type: str # '0B_SYSTEM_ACTION', '0B_PRODUCT_CARD', '0B_ORDER_STATUS'
    action: Optional[str] = None # e.g. 'SET_THEME', 'OPEN_DRAWER'
    payload: Dict[str, Any]
    requires_confirmation: bool = False

class ChatRequest(BaseModel):
    content: str
    session_id: Optional[str] = "default"
    image_url: Optional[str] = None
    locale: Optional[str] = "en"
    currency: Optional[str] = "USD"
    context: Optional[Dict[str, Any]] = None # Frontend state (current page, etc.)

class ChatResponse(BaseModel):
    id: str
    role: str = "assistant"
    content: str
    attachments: List[BAPAction] = []
    timestamp: datetime = Field(default_factory=datetime.now)

class SessionResponse(BaseModel):
    session_id: str
    user_id: str
    chat_token: Optional[str] = ""
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.now)

class SessionCreate(BaseModel):
    user_id: str

class ProductSearchRequest(BaseModel):
    query: Optional[str] = None
    image_url: Optional[str] = None
    filters: Optional[Dict[str, Any]] = None
    limit: int = 10
