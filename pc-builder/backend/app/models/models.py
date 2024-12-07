from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.config import Base
from .auth import User  # Import the User model

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)
    components = relationship("Component", back_populates="category")

class Component(Base):
    __tablename__ = "components"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    current_price = Column(Float)
    url = Column(String)
    image_url = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    
    category = relationship("Category", back_populates="components")
    prices = relationship("Price", back_populates="component")
    analytics = relationship("Analytics", back_populates="component")

class Price(Base):
    __tablename__ = "prices"
    
    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id"))
    price = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    component = relationship("Component", back_populates="prices")

class Analytics(Base):
    __tablename__ = "analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(Integer, ForeignKey("components.id"))
    user_id = Column(Integer, ForeignKey("users.id"))  # Reference to auth.User
    view_count = Column(Integer, default=0)
    last_viewed = Column(DateTime(timezone=True), server_default=func.now())
    is_favorite = Column(Boolean, default=False)
    
    component = relationship("Component", back_populates="analytics")
    user = relationship("User", back_populates="analytics")  # Add this relationship

# Update User model to include analytics relationship
User.analytics = relationship("Analytics", back_populates="user")