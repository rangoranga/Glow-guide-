from pydantic import BaseModel
from typing import Optional


class RecommendationResponse(BaseModel):
    id: int
    product_id: int
    match_score: float
    reason: Optional[str] = None

    class Config:
        from_attributes = True
