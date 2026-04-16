from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any, Optional
import random

from app.db.session import get_db
from app.models.ledger import Order, UserExt
from app.models.product import Product
from app.core.config import settings

router = APIRouter()


@router.get("/version")
async def get_version():
    return {
        "environment": settings.ENVIRONMENT,
        "app_version": settings.APP_VERSION,
        "git_sha": settings.GIT_SHA,
    }

@router.get("/ticker", response_model=List[Dict[str, Any]])
async def get_ticker_data(limit: int = 10, db: Session = Depends(get_db)):
    """
    Fetch global stats for the Square ticker (recent orders/high-profit products).
    """
    try:
        # Fetch top 10 products for the ticker
        products = db.query(Product).filter(Product.is_active == True).limit(limit).all()
        
        if not products:
            # Fallback mock ticker
            return [
                { "name": "Quantum Watch", "price": "$189.00", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDx6xtrrjrkm9Nop69Vs3Q6Xiutv2YJO_Cb5UVFQMKhOy4w2IrCGRJ7WamXVErYW8dG7kDIFzJhUc78Gy6Zt7WTuCSXQpAz9xWIrXnqiBXufHpxW0m_5uCbbA9Ip6VGAR_pONOWPktCQ0SRLBIiWVOPD8YJxERY82_AlNJL2njuFQA_LJMXHylx_2Lh9wfG0OHPAcLOR5wgO_KzzXwgFn2q8rU7ztrM0gA-B8rO6cgLd43i6DDjkEdhXu5KSbu5U9x83kZ1QRo_ftC8" },
                { "name": "Strider X1", "price": "$240.50", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBZd-zWj8P_BkiDJIAniQV7NPRalSv4C0ahEJKo4OqzQ29rkTvin9YxAmLF_gt1GSFqH_DNTlhnmrvScuBf7hJAOsp-pWhDGA8P9rNppyJ2ofRFUhOClTp3_Ap2RtcPTXUMqWnHOb3rn9jHGC-WgmfeK2LyTQlYahubEm_PcByHR_KhmtMiSlACV-6UUlEY06pp2_LrSBPJ9EOFxhMLoIsRc-ZplKP8quAYHRaqaqtCHBhwJT_n_n0HNfdyGWplZKYMnHIuR772my5K" },
                { "name": "Sonic Core", "price": "$320.00", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBGDUQwEcu-U1eA5kGhX5wAXWcRIOiTYRhYKwGgw_90XbqzYBvbSQv5ChDUVlflk1g9TMKT8nXC9u5oM5kwHI3r8_KPAZkCEd7KzeoB3McZhvcSB9wT3ynDmnKMstUwu1zpCWuqvCrpRVq7wytjaNS1B8xKvvMVP1wWovhyOiBO5QwgiNp0r_vqKwgddgmB_35vvYwJRWlUiJAODcZaFJN4FoGzBRCYtafPLsjpDy9lYSclK3pY1HRTgYCwZG-FyRf4i5xotu0ZIbuJ" }
            ]
            
        result = []
        for p in products:
            image_url = ""
            if p.images and isinstance(p.images, list) and len(p.images) > 0:
                image_url = p.images[0]
                
            result.append({
                "id": str(p.id),
                "name": p.title_en or p.title_zh or "Unknown Product",
                "price": f"${p.sale_price or 0.0:.2f}",
                "image": image_url
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats")
async def get_global_stats(db: Session = Depends(get_db)):
    """
    Fetch global platform stats.
    """
    try:
        total_orders = db.query(Order).count()
        total_users = db.query(UserExt).count()
        # Mock some dynamic metrics for UI
        return {
            "total_orders": total_orders + 1240, # Base mock + real
            "total_users": total_users + 850,
            "market_pulse": {
                "sunglasses": random.randint(70, 95),
                "seeding": random.randint(80, 100)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
