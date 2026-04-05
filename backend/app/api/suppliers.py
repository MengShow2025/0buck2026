from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.db.session import get_db
from app.models.product import Supplier, Product

router = APIRouter()

@router.get("/", response_model=List[Dict[str, Any]])
async def get_suppliers(limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    """
    Fetch suppliers from the database for the Prime/Discovery view.
    Includes featured products for each supplier.
    """
    try:
        suppliers = db.query(Supplier).offset(offset).limit(limit).all()
        result = []
        for s in suppliers:
            # Fetch top 3 products for this supplier
            featured_products = db.query(Product).filter(
                Product.supplier_id == s.id,
                Product.is_active == True
            ).limit(3).all()
            
            p_list = []
            for p in featured_products:
                image_url = ""
                if p.images and isinstance(p.images, list) and len(p.images) > 0:
                    image_url = p.images[0]
                
                p_list.append({
                    "id": str(p.id),
                    "name": p.title_en or p.title_zh or "Unknown Product",
                    "title": p.title_en or p.title_zh or "Unknown Product",
                    "price": p.sale_price or 0.0,
                    "image": image_url
                })
            
            result.append({
                "id": str(s.id),
                "name": s.name or f"Supplier {s.id}",
                "logo": f"https://api.dicebear.com/7.x/shapes/svg?seed={s.name or s.id}",
                "years": 3, # Mock
                "businessType": "Manufacturer" if s.is_strength_merchant else "Trading Company",
                "nodeLevel": 5 if s.is_strength_merchant else 4,
                "productionRate": "95.5%", 
                "leadTime": "48h" if s.ships_within_48h else "3-5 Days",
                "location": f"{s.location_province or ''} {s.location_city or ''}".strip() or "Guangdong, China",
                "locationCode": "CN",
                "isVerified": s.is_strength_merchant,
                "products": p_list, # For PrimeView
                "featuredProducts": p_list, # For MerchantCard
                "rating": s.rating or 4.5,
                "ratingCount": 120,
                "reorderRate": "25%",
                "onTimeDeliveryRate": "98%",
                "matches": "2/2",
                "factoryStats": [
                    {"label": "Production", "value": "High"},
                    {"label": "Quality", "value": "A+"}
                ],
                "mainCategoryTags": ["Smart Home", "Electronics"]
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{supplier_id}", response_model=Dict[str, Any])
async def get_supplier_detail(supplier_id: int, db: Session = Depends(get_db)):
    """
    Fetch full detail for a single supplier.
    """
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
        
    # Fetch all products for this supplier
    products = db.query(Product).filter(
        Product.supplier_id == supplier.id,
        Product.is_active == True
    ).all()
    
    p_list = []
    for p in products:
        image_url = ""
        if p.images and isinstance(p.images, list) and len(p.images) > 0:
            image_url = p.images[0]
            
        p_list.append({
            "id": str(p.id),
            "name": p.title_en or p.title_zh or "Unknown Product",
            "title": p.title_en or p.title_zh or "Unknown Product",
            "price": p.sale_price or 0.0,
            "image": image_url,
            "description": p.description_en or p.description_zh or ""
        })
        
    return {
        "id": str(supplier.id),
        "name": supplier.name,
        "logo": f"https://api.dicebear.com/7.x/shapes/svg?seed={supplier.name}",
        "location": f"{supplier.location_province} {supplier.location_city}",
        "locationCode": "CN",
        "isVerified": supplier.is_strength_merchant,
        "rating": supplier.rating or 4.5,
        "ratingCount": 120,
        "years": 3,
        "businessType": "Manufacturer" if supplier.is_strength_merchant else "Trading Company",
        "reorderRate": "25%",
        "onTimeDeliveryRate": "98%",
        "matches": "2/2",
        "factoryStats": [
            {"label": "Production", "value": "High"},
            {"label": "Quality", "value": "A+"}
        ],
        "mainCategoryTags": ["Smart Home", "Electronics"],
        "products": p_list,
        "featuredProducts": p_list,
        "custom_capability": supplier.custom_capability
    }
