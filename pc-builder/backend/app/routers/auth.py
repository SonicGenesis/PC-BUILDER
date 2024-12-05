from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from ..database.config import get_db
from ..services.auth import AuthService, ACCESS_TOKEN_EXPIRE_MINUTES
from ..schemas.auth import (
    User, UserCreate, UserUpdate, Token, Role, RoleCreate,
    ChangePassword, LoginRequest
)
from ..dependencies.auth import (
    get_current_active_user,
    get_current_admin_user
)
from ..models.auth import User as UserModel

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = AuthService.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    permissions = AuthService.get_user_permissions(user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"sub": user.username, "permissions": permissions},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/register", response_model=User)
async def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user.
    """
    # Check if user already exists
    db_user = AuthService.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    db_user = AuthService.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    return AuthService.create_user(db=db, user=user)

@router.get("/me", response_model=User)
async def read_users_me(
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get current user information.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_user_me(
    user_update: UserUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update current user information.
    """
    # Check if email is taken
    if user_update.email:
        db_user = AuthService.get_user_by_email(db, email=user_update.email)
        if db_user and db_user.id != current_user.id:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # Update user fields
    for field, value in user_update.model_dump(exclude_unset=True).items():
        if field == "password" and value:
            setattr(current_user, "hashed_password", AuthService.get_password_hash(value))
        elif value is not None:
            setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password")
async def change_password(
    password_change: ChangePassword,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Change user password.
    """
    if not AuthService.verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect password"
        )
    
    current_user.hashed_password = AuthService.get_password_hash(password_change.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

# Admin endpoints
@router.get("/users", response_model=List[User])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: None = Depends(get_current_admin_user)
):
    """
    List all users (admin only).
    """
    users = db.query(UserModel).offset(skip).limit(limit).all()
    return users

@router.post("/users", response_model=User)
async def create_user(
    user: UserCreate,
    is_superuser: bool = False,
    db: Session = Depends(get_db),
    _: None = Depends(get_current_admin_user)
):
    """
    Create new user (admin only).
    """
    db_user = AuthService.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    return AuthService.create_user(db=db, user=user, is_superuser=is_superuser)

@router.post("/roles", response_model=Role)
async def create_role(
    role: RoleCreate,
    db: Session = Depends(get_db),
    _: None = Depends(get_current_admin_user)
):
    """
    Create new role (admin only).
    """
    return AuthService.create_role(
        db=db,
        name=role.name,
        description=role.description,
        permissions=role.permissions.split(",") if role.permissions else []
    )

@router.post("/users/{user_id}/roles/{role_id}")
async def assign_role(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(get_current_admin_user)
):
    """
    Assign role to user (admin only).
    """
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    AuthService.assign_role_to_user(db, user, role)
    return {"message": "Role assigned successfully"} 