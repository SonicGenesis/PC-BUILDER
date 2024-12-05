from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from ..database.config import get_db
from ..services.crawler import CrawlerService
from ..services.services import ComponentService, AnalyticsService

router = APIRouter(prefix="/crawler", tags=["crawler"])
crawler_service = CrawlerService()
component_service = ComponentService()
analytics_service = AnalyticsService()

@router.post("/crawl", response_model=List[Dict])
async def crawl_prices(
    background_tasks: BackgroundTasks,
    component_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Trigger price crawling for a specific component or all components.
    The crawling is done in the background.
    """
    if component_id:
        component = component_service.get(db, component_id)
        if not component:
            raise HTTPException(status_code=404, detail="Component not found")

    # Log the crawl request
    analytics_service.log_event(
        db=db,
        event_type="price_crawl_requested",
        additional_info={"component_id": component_id} if component_id else {}
    )

    # Start crawling in the background
    background_tasks.add_task(crawler_service.crawl_prices, db, component_id)
    
    return {
        "message": f"Price crawling started for {'component ' + str(component_id) if component_id else 'all components'}",
        "status": "processing"
    }

@router.get("/best-price/{component_id}")
async def get_best_price(component_id: int, db: Session = Depends(get_db)):
    """
    Get the best current price for a component across all supported sites.
    """
    component = component_service.get(db, component_id)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")

    # Log the best price request
    analytics_service.log_event(
        db=db,
        event_type="best_price_requested",
        additional_info={"component_id": component_id}
    )

    return await crawler_service.get_best_price(db, component_id)

@router.get("/supported-sites")
async def get_supported_sites():
    """
    Get a list of supported e-commerce sites for price crawling.
    """
    return {"sites": crawler_service.supported_sites} 