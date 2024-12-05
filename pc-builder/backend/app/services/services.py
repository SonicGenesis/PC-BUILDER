from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import datetime
from .base import BaseService
from ..models.models import Category, Component, Price, Analytics
from ..schemas.schemas import (
    CategoryCreate, Category as CategorySchema,
    ComponentCreate, Component as ComponentSchema,
    PriceCreate, Price as PriceSchema,
    AnalyticsCreate, Analytics as AnalyticsSchema
)

class CategoryService(BaseService[Category, CategoryCreate, CategoryCreate]):
    def __init__(self):
        super().__init__(Category)

    def get_by_name(self, db: Session, name: str) -> Optional[Category]:
        return db.query(self.model).filter(self.model.name == name).first()

class ComponentService(BaseService[Component, ComponentCreate, ComponentCreate]):
    def __init__(self):
        super().__init__(Component)

    def get_by_category(self, db: Session, category_id: int, skip: int = 0, limit: int = 100) -> List[Component]:
        return db.query(self.model).filter(
            self.model.category_id == category_id
        ).offset(skip).limit(limit).all()

    def get_by_price_range(self, db: Session, min_price: float, max_price: float) -> List[Component]:
        return db.query(self.model).filter(
            self.model.price >= min_price,
            self.model.price <= max_price
        ).all()

class PriceService(BaseService[Price, PriceCreate, PriceCreate]):
    def __init__(self):
        super().__init__(Price)

    def get_component_price_history(self, db: Session, component_id: int) -> List[Price]:
        return db.query(self.model).filter(
            self.model.component_id == component_id
        ).order_by(self.model.date_retrieved.desc()).all()

    def record_price(self, db: Session, component_id: int, price: float) -> Price:
        price_record = PriceCreate(
            component_id=component_id,
            price=price,
            date_retrieved=datetime.utcnow()
        )
        return self.create(db, price_record)

class AnalyticsService(BaseService[Analytics, AnalyticsCreate, AnalyticsCreate]):
    def __init__(self):
        super().__init__(Analytics)

    def log_event(self, db: Session, event_type: str, user_id: Optional[str] = None, additional_info: dict = None) -> Analytics:
        analytics_data = AnalyticsCreate(
            event_type=event_type,
            user_id=user_id,
            timestamp=datetime.utcnow(),
            additional_info=additional_info or {}
        )
        return self.create(db, analytics_data)

    def get_events_by_type(self, db: Session, event_type: str) -> List[Analytics]:
        return db.query(self.model).filter(
            self.model.event_type == event_type
        ).order_by(self.model.timestamp.desc()).all()

    def get_user_events(self, db: Session, user_id: str) -> List[Analytics]:
        return db.query(self.model).filter(
            self.model.user_id == user_id
        ).order_by(self.model.timestamp.desc()).all() 