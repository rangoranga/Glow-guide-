from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.recommendation import Recommendation
from ..models.product import Product
from ..schemas.product import ProductResponse, RecommendedProductResponse

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("/{user_id}", response_model=List[RecommendedProductResponse])
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """
    Get personalized product recommendations for a user.
    Returns products sorted by match score.
    """
    # Get recommendations for user
    recs = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == user_id)
        .order_by(Recommendation.match_score.desc())
        .all()
    )

    if not recs:
        return []

    # Get associated products
    product_ids = [rec.product_id for rec in recs]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()

    # Create a mapping for ordering
    product_map = {p.id: p for p in products}

    # Return products in recommendation order with the saved score and reason.
    ordered_products = []
    for rec in recs:
        if rec.product_id in product_map:
            product = product_map[rec.product_id]
            product_payload = ProductResponse.model_validate(product).model_dump()
            product_payload["match_score"] = rec.match_score
            product_payload["reason"] = rec.reason
            ordered_products.append(product_payload)

    return ordered_products
