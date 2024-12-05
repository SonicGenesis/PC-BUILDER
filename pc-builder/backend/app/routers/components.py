from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..services.services import ComponentService, PriceService
from ..schemas.schemas import Component, ComponentCreate, ComponentWithCategory, Price

router = APIRouter(prefix="/components", tags=["components"])
component_service = ComponentService()
price_service = PriceService()

@router.get("/", response_model=List[Component])
async def list_components(
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    """
    List all components with optional filtering by category and price range.
    """
    if category_id is not None:
        return component_service.get_by_category(db, category_id, skip, limit)
    elif min_price is not None and max_price is not None:
        return component_service.get_by_price_range(db, min_price, max_price)
    return component_service.get_all(db, skip, limit)

@router.get("/{component_id}", response_model=ComponentWithCategory)
async def get_component(component_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific component.
    """
    component = component_service.get(db, component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return component

@router.post("/", response_model=Component)
async def create_component(component: ComponentCreate, db: Session = Depends(get_db)):
    """
    Create a new component (admin only).
    """
    # TODO: Add admin authentication
    return component_service.create(db, component)

@router.put("/{component_id}", response_model=Component)
async def update_component(
    component_id: int,
    component: ComponentCreate,
    db: Session = Depends(get_db)
):
    """
    Update an existing component (admin only).
    """
    # TODO: Add admin authentication
    updated_component = component_service.update(db, component_id, component)
    if not updated_component:
        raise HTTPException(status_code=404, detail="Component not found")
    return updated_component

@router.delete("/{component_id}")
async def delete_component(component_id: int, db: Session = Depends(get_db)):
    """
    Delete a component (admin only).
    """
    # TODO: Add admin authentication
    if not component_service.delete(db, component_id):
        raise HTTPException(status_code=404, detail="Component not found")
    return {"message": "Component deleted successfully"}

@router.get("/{component_id}/price-history", response_model=List[Price])
async def get_component_price_history(component_id: int, db: Session = Depends(get_db)):
    """
    Get price history for a specific component.
    """
    component = component_service.get(db, component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return price_service.get_component_price_history(db, component_id) 