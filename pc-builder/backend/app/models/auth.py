from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from ..database.config import Base
from .base import BaseModel

# Association table for user roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

class User(BaseModel):
    __tablename__ = "users"

    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)

    # Relationships
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    analytics = relationship("Analytics", back_populates="user", lazy="dynamic")

class Role(BaseModel):
    __tablename__ = "roles"

    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    permissions = Column(String)  # JSON string of permissions

    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="roles") 