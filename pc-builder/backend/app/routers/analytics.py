from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..services.services import AnalyticsService
from ..schemas.schemas import Analytics, AnalyticsCreate

router = APIRouter(prefix="/analytics", tags=["analytics"])
analytics_service = AnalyticsService()

@router.get("/", response_model=List[Analytics])
async def get_analytics(
    event_type: Optional[str] = None,
    user_id: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    """
    Get analytics data with optional filtering (admin only).
    """
    # TODO: Add admin authentication
    if event_type:
        return analytics_service.get_events_by_type(db, event_type)
    elif user_id:
        return analytics_service.get_user_events(db, user_id)
    return analytics_service.get_all(db, skip, limit)

@router.post("/events", response_model=Analytics)
async def log_event(event: AnalyticsCreate, db: Session = Depends(get_db)):
    """
    Log a new analytics event.
    """
    return analytics_service.create(db, event)

@router.get("/events/by-type/{event_type}", response_model=List[Analytics])
async def get_events_by_type(
    event_type: str,
    db: Session = Depends(get_db)
):
    """
    Get all events of a specific type (admin only).
    """
    # TODO: Add admin authentication
    return analytics_service.get_events_by_type(db, event_type)

@router.get("/events/by-user/{user_id}", response_model=List[Analytics])
async def get_user_events(
    user_id: str,
    db: Session = Depends(get_db)
):
    """
    Get all events for a specific user (admin only).
    """
    # TODO: Add admin authentication
    return analytics_service.get_user_events(db, user_id) 