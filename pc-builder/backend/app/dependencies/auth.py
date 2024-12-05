from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database.config import get_db
from ..services.auth import AuthService
from ..models.auth import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token_data = AuthService.decode_token(token)
        user = AuthService.get_user(db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user
    except Exception:
        raise credentials_exception

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def check_permissions(required_permissions: List[str]):
    async def permission_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> None:
        user_permissions = AuthService.get_user_permissions(current_user)
        
        # Superusers have all permissions
        if "admin" in user_permissions:
            return
            
        for permission in required_permissions:
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {permission} required"
                )
    
    return permission_checker

# Commonly used permission checks
get_current_admin_user = check_permissions(["admin"])
get_current_editor_user = check_permissions(["edit_components"]) 