from datetime import datetime, timedelta
from typing import Optional, List
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..models.auth import User, Role
from ..schemas.auth import UserCreate, UserInDB, TokenData
import json

# Security configuration
SECRET_KEY = "your-secret-key-here"  # Change this in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> TokenData:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            permissions = payload.get("permissions", [])
            return TokenData(username=username, permissions=permissions)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    @staticmethod
    def get_user(db: Session, username: str) -> Optional[UserInDB]:
        user = db.query(User).filter(User.username == username).first()
        if user:
            return UserInDB.model_validate(user)
        return None

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def create_user(db: Session, user: UserCreate, is_superuser: bool = False) -> User:
        hashed_password = AuthService.get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            hashed_password=hashed_password,
            is_superuser=is_superuser
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        user = AuthService.get_user(db, username)
        if not user:
            return None
        if not AuthService.verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def get_user_permissions(user: User) -> List[str]:
        permissions = []
        for role in user.roles:
            try:
                role_permissions = json.loads(role.permissions or "[]")
                permissions.extend(role_permissions)
            except json.JSONDecodeError:
                continue
        if user.is_superuser:
            permissions.append("admin")
        return list(set(permissions))  # Remove duplicates

    @staticmethod
    def create_role(db: Session, name: str, description: str, permissions: List[str]) -> Role:
        db_role = Role(
            name=name,
            description=description,
            permissions=json.dumps(permissions)
        )
        db.add(db_role)
        db.commit()
        db.refresh(db_role)
        return db_role

    @staticmethod
    def assign_role_to_user(db: Session, user: User, role: Role) -> None:
        user.roles.append(role)
        db.commit()
        db.refresh(user)

    @staticmethod
    def remove_role_from_user(db: Session, user: User, role: Role) -> None:
        user.roles.remove(role)
        db.commit()
        db.refresh(user) 