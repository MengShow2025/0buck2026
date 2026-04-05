from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, BigInteger, Float
from sqlalchemy.sql import func
from backend.app.models.product import Base

class UserWish(Base):
    """
    v3.3 Wishing Well (许愿池): User uploads images or descriptions for desired products.
    """
    __tablename__ = "user_wishes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey("users_ext.customer_id"), index=True)
    
    # Input
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    reference_url = Column(String(500), nullable=True)
    
    # Matching status
    status = Column(String(50), default="pending") # pending, matching, found, not_found, pre_order
    matched_product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    matching_notes = Column(Text, nullable=True)
    
    # Aggregation for C2M
    vote_count = Column(Integer, default=1) # Count users wishing for similar items
    voters = Column(JSON, default=list) # List of user IDs who voted
    expiry_at = Column(DateTime, nullable=True) # 48h limit for 'Founding Team Price'
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class DemandInsight(Base):
    """
    v3.3 Proactive Sourcing (主动询盘): AI-generated insights from LTM.
    Analyzes 'unmet needs' and 'pain points' from conversation facts.
    """
    __tablename__ = "demand_insights"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    # Insight Data
    category = Column(String(100), index=True) # e.g., 'Portable Power', 'Minimalist Lighting'
    unmet_need = Column(Text, nullable=False) # e.g., 'Users want purple color'
    is_pain_point = Column(Boolean, default=False) # v3.3.1: 'Current products too heavy'
    sentiment_score = Column(Float, default=0.0) # -1.0 to 1.0
    
    frequency = Column(Integer, default=1) # How many users expressed this
    sample_users = Column(JSON, nullable=True) # [user_id1, user_id2] for verification
    
    # Status
    status = Column(String(50), default="new") # new, sourcing, sourced, dismissed
    action_taken = Column(Text, nullable=True) # e.g., 'Contacted 1688 factory X'
    
    last_detected_at = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())

class OrderCustomization(Base):
    """
    v3.3 Micro-Customization (轻定制): Personalization details for an order item.
    """
    __tablename__ = "order_customizations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(BigInteger, ForeignKey("orders.shopify_order_id"), index=True)
    line_item_id = Column(BigInteger, index=True) # Shopify Line Item ID
    
    # Custom details
    custom_text = Column(String(200), nullable=True) # e.g., 'To Sarah'
    custom_image_url = Column(String(500), nullable=True)
    additional_notes = Column(Text, nullable=True)
    
    # Fulfillment
    fulfillment_status = Column(String(50), default="pending") # pending, confirmed_by_factory, fulfilled
    
    created_at = Column(DateTime, default=func.now())
