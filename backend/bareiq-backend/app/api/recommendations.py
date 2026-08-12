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
    """Get personalized product recommendations for a user, best match first."""
    recs = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == user_id)
        .order_by(Recommendation.match_score.desc())
        .all()
    )
    if not recs:
        return []

    product_ids = [rec.product_id for rec in recs]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {p.id: p for p in products}

    ordered = []
    for rec in recs:
        product = product_map.get(rec.product_id)
        if not product:
            continue
        payload = ProductResponse.model_validate(product).model_dump()
        payload["match_score"] = rec.match_score
        payload["reason"] = rec.reason
        ordered.append(payload)

    return ordered
