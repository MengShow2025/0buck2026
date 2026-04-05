from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any, Optional
import random

from app.db.session import get_db
from app.models.ledger import SquareActivity, Order, UserExt
from app.models.product import Product

router = APIRouter()

@router.get("/activities", response_model=List[Dict[str, Any]])
async def get_square_activities(limit: int = 20, db: Session = Depends(get_db)):
    """
    Fetch social activities for the Square/Lounge view.
    """
    try:
        activities = db.query(SquareActivity).order_by(SquareActivity.created_at.desc()).limit(limit).all()
        
        if not activities:
            # Generate some mock activities if DB is empty to keep the UI alive
            return [
                {
                    "id": "m1",
                    "user": "Sarah_Design",
                    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                    "content": "Just received my custom mechanical keyboard from the last Wishing Well! The quality is amazing. #0Buck #C2M",
                    "images": ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&fit=crop"],
                    "likes": 24,
                    "comments": 5,
                    "timestamp": "2h ago",
                    "type": "moment"
                },
                {
                    "id": "m2",
                    "user": "Tech_Julian",
                    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
                    "content": "Exploring the new Vortex Matrix. Found some hidden gems today.",
                    "images": [],
                    "likes": 12,
                    "comments": 2,
                    "timestamp": "5h ago",
                    "type": "moment"
                }
            ]
            
        result = []
        for act in activities:
            # Try to get user info if available
            user_name = "Anonymous"
            avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={act.user_id or act.id}"
            
            if act.user_id:
                user = db.query(UserExt).filter(UserExt.customer_id == act.user_id).first()
                if user:
                    user_name = user.referral_code or f"User_{user.customer_id}"
            
            result.append({
                "id": str(act.id),
                "user": user_name,
                "avatar": avatar,
                "content": act.content,
                "images": act.metadata_json.get("images", []),
                "likes": act.likes or 0,
                "comments": 0, # Need to join with Comments table
                "timestamp": act.created_at.isoformat(),
                "type": act.type
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
