from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Component Schemas
class ComponentBase(BaseModel):
    name: str
    category_id: int
    specifications: Dict = Field(default_factory=dict)
    price: float
    manufacturer: str

class ComponentCreate(ComponentBase):
    pass

class Component(ComponentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ComponentWithCategory(Component):
    category: Category

# Price Schemas
class PriceBase(BaseModel):
    component_id: int
    price: float
    date_retrieved: datetime

class PriceCreate(PriceBase):
    pass

class Price(PriceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics Schemas
class AnalyticsBase(BaseModel):
    event_type: str
    user_id: Optional[str] = None
    timestamp: datetime
    additional_info: Dict = Field(default_factory=dict)

class AnalyticsCreate(AnalyticsBase):
    pass

class Analytics(AnalyticsBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 