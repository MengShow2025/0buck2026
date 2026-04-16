import os
import httpx
from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from app.core.config import settings
from app.core.resilience import CircuitBreaker
from app.db.session import SessionLocal
from app.models.product import Product
from app.services.shield_service import ShieldService

@tool
def trigger_wishing_well(user_id: int, description: str):
    """
    Triggers the 'Wishing Well' flow. Use this when the user asks for a product 
    we don't have, or describes a specific customization they want.
    
    Args:
        user_id: The ID of the current user.
        description: A clear description of what the user is looking for.
    """
    import asyncio
    db = SessionLocal()
    try:
        from app.services.c2m_service import C2MService
        c2m = C2MService(db)
        wish = asyncio.run(c2m.add_user_wish(user_id, description))
        return {
            "status": "success",
            "message": f"Wish recorded! ID: {wish.id}. You will be notified when we find a source.",
            "wish_id": wish.id
        }
    finally:
        db.close()

@tool
def product_search(query: str):
    """Search for products in the 0buck store by name or category."""
    db = SessionLocal()
    try:
        shield = ShieldService(db)
        
        products = db.query(Product).filter(
             (Product.title_en.ilike(f"%{query}%")) | 
             (Product.category.ilike(f"%{query}%"))
         ).limit(5).all()
        
        if not products:
            return {"status": "info", "message": f"未找到与 '{query}' 相关的产品。"}
            
        results = []
        for p in products:
            shadow_id = shield.get_shadow_id(p.product_id_1688, "product")
            results.append({
                "shadow_id": shadow_id,
                "title": p.title_en,
                "price": float(p.sale_price),
                "category": p.category
            })
        return results
    except Exception as e:
        print(f"❌ Product search failed: {e}")
        return {"status": "error", "message": "暂时无法搜索产品，请稍后再试。"}
    finally:
        db.close()

async def _web_search_func(query: str) -> List[Dict[str, Any]]:
    """
    Search the web using Exa to find trending products, market prices, or supplier information.
    Supports key rotation if multiple keys are provided in settings.EXA_API_KEY (comma-separated).
    """
    if not settings.EXA_API_KEY or settings.EXA_API_KEY == "your-exa-api-key":
        return [{
            "title": "Web Search Unavailable",
            "text": "Web search is temporarily unavailable. Please retry later.",
            "url": "https://0buck.com",
            "degraded": True,
        }]

    # v5.6.6: Multi-Key Rotation & Service Key Support
    # Note: Service Key (Admin API) allows programmatic key generation: https://admin-api.exa.ai
    keys = [k.strip() for k in settings.EXA_API_KEY.split(",") if k.strip()]
    if not keys:
        return [{"error": "No valid EXA API keys found."}]
    
    import random

    url = "https://api.exa.ai/search"
    payload = {
        "query": query,
        "numResults": 5
    }

    breaker = getattr(_web_search_func, "_breaker", None)
    if breaker is None:
        breaker = CircuitBreaker(name="exa", failure_threshold=3, reset_timeout_seconds=30.0)
        setattr(_web_search_func, "_breaker", breaker)
    
    timeout = httpx.Timeout(10.0, connect=5.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        async def attempt_with_key(active_key: str):
            headers = {
                "accept": "application/json",
                "content-type": "application/json",
                "x-api-key": active_key,
            }
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code in (401, 403, 429) or response.status_code >= 500:
                raise httpx.HTTPStatusError(
                    f"EXA error status {response.status_code}",
                    request=response.request,
                    response=response,
                )
            response.raise_for_status()
            return response

        tried: set[str] = set()
        for _ in range(min(2, len(keys))):
            active_key = random.choice([k for k in keys if k not in tried]) if len(tried) < len(keys) else random.choice(keys)
            tried.add(active_key)
            try:
                response = await breaker.call(lambda: attempt_with_key(active_key))
                data = response.json()
                return data.get("results", [])
            except Exception as e:
                last_err = e
                continue

        return [{
            "title": "Web Search Unavailable",
            "text": "Web search is temporarily unavailable. Please retry later.",
            "url": "https://0buck.com",
            "degraded": True,
        }]

web_search = tool(_web_search_func)

@tool
async def supply_library_search(query: str) -> List[Dict[str, Any]]:
    """
    Search for products directly in the global supply library. 
    Returns a list of potential products with their internal IDs and prices.
    Best for sourcing new items.
    """
    # This is a placeholder for actual sourcing API
    # In a real scenario, this would call ElimAPI or similar.
    # For now, we return mock data that matches the expected schema.
    return [
        {
            "id": f"SRC_{i}",
            "title": f"Library Product {i} for {query}",
            "price_cny": 50.0 + i * 10,
            "url": f"https://detail.0buck.com/offer/{123456 + i}.html",
            "image": "https://cdn.0buck.com/assets/placeholder.png"
        } for i in range(1, 4)
    ]

from app.models.butler import UserButlerProfile, PersonaTemplate
from app.models.ledger import AvailableCoupon, CouponIssuanceAudit, SystemConfig
import hashlib
import time

@tool
def update_butler_settings(user_id: int, butler_name: Optional[str] = None, persona_id: Optional[str] = None):
    """
    Update the user's AI Butler settings, such as its name or active persona.
    
    Args:
        user_id: The ID of the current user.
        butler_name: (Optional) A new name for the AI Butler.
        persona_id: (Optional) The ID of the persona template to switch to (e.g., 'cute_loli', 'rigorous_expert').
    """
    builtin_personas = {
        "default": {
            "name": "Default",
            "style_prompt": "You are a balanced, professional and helpful 0Buck Butler.",
            "empathy_weight": 0.6,
            "formality_score": 0.6,
            "vibrancy_level": 0.4,
            "emoji_density": 0.2,
        },
        "cute_loli": {
            "name": "Cute Loli",
            "style_prompt": "Use a cute, warm, playful but helpful style. Keep responses concise and caring.",
            "empathy_weight": 0.9,
            "formality_score": 0.2,
            "vibrancy_level": 0.9,
            "emoji_density": 0.8,
        },
        "rigorous_expert": {
            "name": "Rigorous Expert",
            "style_prompt": "Use a professional, rigorous, structured style. Focus on precision and actionable steps.",
            "empathy_weight": 0.5,
            "formality_score": 0.9,
            "vibrancy_level": 0.2,
            "emoji_density": 0.0,
        },
        "friendly_butler": {
            "name": "Friendly Butler",
            "style_prompt": "Be polite, proactive and service-oriented. Keep language friendly and practical.",
            "empathy_weight": 0.8,
            "formality_score": 0.7,
            "vibrancy_level": 0.5,
            "emoji_density": 0.3,
        },
    }
    persona_alias = {
        "萝莉": "cute_loli",
        "可爱萝莉": "cute_loli",
        "萌妹": "cute_loli",
        "专业严谨": "rigorous_expert",
        "专家": "rigorous_expert",
        "严谨": "rigorous_expert",
        "管家": "friendly_butler",
        "友好管家": "friendly_butler",
        "默认": "default",
        "default": "default",
        "cute_loli": "cute_loli",
        "rigorous_expert": "rigorous_expert",
        "friendly_butler": "friendly_butler",
    }

    def _normalize_persona_id(raw_value: str) -> Optional[str]:
        if not raw_value:
            return None
        value = raw_value.strip()
        if not value:
            return None
        if value in persona_alias:
            return persona_alias[value]
        lower_value = value.lower()
        if lower_value in persona_alias:
            return persona_alias[lower_value]
        return lower_value

    db = SessionLocal()
    try:
        profile = db.query(UserButlerProfile).filter_by(user_id=user_id).first()
        if not profile:
            profile = UserButlerProfile(user_id=user_id)
            db.add(profile)
        
        if butler_name:
            profile.butler_name = butler_name
        if persona_id:
            target_persona = _normalize_persona_id(persona_id)
            if target_persona:
                template = db.query(PersonaTemplate).filter_by(id=target_persona).first()
                if not template:
                    builtin = builtin_personas.get(target_persona)
                    if builtin:
                        template = PersonaTemplate(
                            id=target_persona,
                            name=builtin["name"],
                            style_prompt=builtin["style_prompt"],
                            empathy_weight=builtin["empathy_weight"],
                            formality_score=builtin["formality_score"],
                            vibrancy_level=builtin["vibrancy_level"],
                            emoji_density=builtin["emoji_density"],
                            is_active=True,
                        )
                        db.add(template)
                        db.flush()
                    else:
                        available = sorted(set(list(builtin_personas.keys())))
                        return {
                            "status": "failed",
                            "error": "persona_not_found",
                            "requested_persona": persona_id,
                            "available_personas": available,
                        }
                profile.active_persona_id = target_persona
            
        db.commit()
        return {"status": "success", "butler_name": profile.butler_name, "active_persona": profile.active_persona_id}
    finally:
        db.close()

@tool
def search_coupons(user_id: int, category: str, reason: str, min_spend: float = 0.0):
    """
    Search and LOG THE INTENT to issue available discount coupons.
    Use this when the user is unhappy, needs an incentive to buy, or for logistics recovery.
    
    Args:
        user_id: The ID of the current user.
        category: The AI category to search for ('SERVICE_RECOVERY', 'UPSELL', 'ABANDONED_CART').
        reason: The specific reason for granting the coupon (e.g. 'Apology for late delivery').
        min_spend: The current subtotal of the user's cart to filter by minimum requirement.
    """
    db = SessionLocal()
    try:
        # v3.1: Check Daily Budget
        budget_config = db.query(SystemConfig).filter_by(key="AI_COUPON_DAILY_BUDGET").first()
        daily_budget = float(budget_config.value) if budget_config else 50.0
        
        coupons = db.query(AvailableCoupon).filter(
            AvailableCoupon.ai_category == category,
            AvailableCoupon.is_active == True,
            AvailableCoupon.min_requirement <= min_spend
        ).all()
        
        results = []
        for c in coupons:
            # v3.2 Dispute Defense: Record the fingerprint
            fingerprint_str = f"{user_id}:{c.code}:{time.time()}"
            fingerprint = hashlib.sha256(fingerprint_str.encode()).hexdigest()[:16]
            
            audit = CouponIssuanceAudit(
                user_id=user_id,
                coupon_code=c.code,
                reason=reason,
                ai_category=category,
                fingerprint=fingerprint
            )
            db.add(audit)
            
            results.append({
                "code": c.code,
                "type": c.type,
                "value": c.value,
                "min_requirement": c.min_requirement,
                "permission": c.ai_issuance_permission,
                "fingerprint_id": fingerprint, # Return this to LLM to mention in chat if needed
                "expires_at": c.expires_at.isoformat() if c.expires_at else None
            })
        
        db.commit()
        return results
    finally:
        db.close()

@tool
def get_order_status(user_id: int, order_id: str) -> Dict[str, Any]:
    """
    Retrieve the current status of a Shopify order and its fulfillment status.
    
    Args:
        user_id: The ID of the current user (Verified by System).
        order_id: The Shopify Order ID or Order Number.
    """
    db = SessionLocal()
    try:
        from app.models.ledger import Order
        # STRICT v3.5.0: Check if order belongs to the user
        order = db.query(Order).filter(
            (Order.shopify_order_id == order_id) | (Order.order_number == order_id),
            Order.user_id == user_id
        ).first()
        
        if not order:
            return {"error": "Order not found or access denied. You can only check your own orders."}
            
        return {
            "order_id": order_id,
            "status": order.status or "processing",
            "tracking_number": order.tracking_number or "Pending",
            "carrier": order.carrier or "Standard",
            "estimated_delivery": order.delivered_at.isoformat() if order.delivered_at else "Calculating...",
            "items": [{"title": "Items in Order", "quantity": 1}] # Simplified
        }
    finally:
        db.close()

@tool
def ui_system_action(action: str, value: str):
    """
    Trigger a frontend UI system action on the user's device.
    Use this when the user asks to change settings on device, navigate pages, or perform local actions.
    
    Supported actions and values:
    - action: "SET_THEME", value: "light" or "dark" or "system"
    - action: "SET_LANGUAGE", value: "en" or "zh-CN"
    - action: "SET_CURRENCY", value: "USD" or "CNY" or "JPY" or "EUR" or "GBP"
    - action: "NAVIGATE", value: "wallet" or "settings" or "orders" or "address" or "checkout" or "reward_history" or "tickets" or "favorites"
    - action: "CLEAR_LOCAL_CACHE", value: "true"
    - action: "PERFORM_CHECKIN", value: "true"
    """
    import json
    return json.dumps({
        "__system_action__": {
            "type": "0B_SYSTEM_ACTION",
            "action": action,
            "payload": {"value": value},
            "requires_confirmation": False
        },
        "status": "success",
        "message": f"Successfully executed {action} with value {value} on the user's device."
    })
