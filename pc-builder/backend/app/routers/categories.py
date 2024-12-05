from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from ..database.config import get_db
from ..services.services import CategoryService
from ..schemas.schemas import Category, CategoryCreate

router = APIRouter(prefix="/categories", tags=["categories"])
category_service = CategoryService()

@router.get("/", response_model=List[Category])
async def list_categories(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    """
    List all categories.
    """
    return category_service.get_all(db, skip, limit)

@router.get("/{category_id}", response_model=Category)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    """
    Get a specific category by ID.
    """
    category = category_service.get(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.post("/", response_model=Category)
async def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    """
    Create a new category (admin only).
    """
    # TODO: Add admin authentication
    existing_category = category_service.get_by_name(db, category.name)
    if existing_category:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    return category_service.create(db, category)

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: int,
    category: CategoryCreate,
    db: Session = Depends(get_db)
):
    """
    Update a category (admin only).
    """
    # TODO: Add admin authentication
    existing_category = category_service.get_by_name(db, category.name)
    if existing_category and existing_category.id != category_id:
        raise HTTPException(status_code=400, detail="Category with this name already exists")
    
    updated_category = category_service.update(db, category_id, category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated_category

@router.delete("/{category_id}")
async def delete_category(category_id: int, db: Session = Depends(get_db)):
    """
    Delete a category (admin only).
    """
    # TODO: Add admin authentication
    if not category_service.delete(db, category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"} 