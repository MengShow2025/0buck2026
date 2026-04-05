from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ProductItem(BaseModel):
    id: Any
    title: str
    price: float
    image: Optional[str] = None
    original_price: Optional[float] = None
    category_type: Optional[str] = None # 'TRAFFIC', 'PROFIT'
    strategy_tag: Optional[str] = None

class DiscoveryResponse(BaseModel):
    products: List[ProductItem]
    butler_greeting: str
    highlight_index: int = 0
    persona_id: str = "default"
