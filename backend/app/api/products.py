from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from app.db.session import get_db
from app.services.personalized_matrix_service import PersonalizedMatrixService
from app.schemas.products import DiscoveryResponse

router = APIRouter()

@router.get("/discovery", response_model=DiscoveryResponse)
async def get_discovery_matrix(user_id: int, db: Session = Depends(get_db)):
    """
    v3.2 Vortex Predictive Discovery: Returns 2x5 matrix with personalized greeting.
    """
    try:
        service = PersonalizedMatrixService(db)
        result = await service.get_personalized_discovery(user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
