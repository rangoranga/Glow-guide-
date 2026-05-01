from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.product import Product
from ..schemas.product import ProductResponse

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = Query(None),
    skin_type: Optional[str] = Query(None),
    concern: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Get products with optional filtering.
    """
    query = db.query(Product).filter(Product.available_in_india == True)

    if category:
        query = query.filter(Product.category == category)

    if skin_type:
        query = query.filter(Product.skin_types.contains(skin_type))

    if concern:
        query = query.filter(Product.concerns.contains(concern))

    return query.all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Get a single product by ID.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Product not found")
    return product
