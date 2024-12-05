from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from .base import BaseModel

class Category(BaseModel):
    __tablename__ = "categories"

    name = Column(String, index=True, unique=True, nullable=False)
    description = Column(String)
    
    # Relationships
    components = relationship("Component", back_populates="category")

class Component(BaseModel):
    __tablename__ = "components"

    name = Column(String, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    specifications = Column(JSON)  # Store specs as JSON for flexibility
    price = Column(Float, nullable=False)
    manufacturer = Column(String, nullable=False)
    
    # Relationships
    category = relationship("Category", back_populates="components")
    price_history = relationship("Price", back_populates="component")

class Price(BaseModel):
    __tablename__ = "prices"

    component_id = Column(Integer, ForeignKey("components.id"), nullable=False)
    price = Column(Float, nullable=False)
    date_retrieved = Column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    component = relationship("Component", back_populates="price_history")

class Analytics(BaseModel):
    __tablename__ = "analytics"

    event_type = Column(String, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    additional_info = Column(JSON)  # Store additional event data as JSON
    
    # Relationships
    user = relationship("User", back_populates="analytics")