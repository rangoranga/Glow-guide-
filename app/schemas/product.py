from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: int
    name: str
    brand: str
    category: str
    price: Optional[float] = None
    currency: str = "INR"
    skin_types: str
    skin_tones: Optional[str] = None
    concerns: str
    key_ingredients: str
    description: str
    how_to_use: Optional[str] = None
    size: Optional[str] = None
    is_natural: bool
    is_fragrance_free: bool
    is_cruelty_free: bool
    is_vegan: bool
    dermatologist_tested: bool
    clinically_proven: bool
    research_notes: Optional[str] = None
    available_in_india: bool
    purchase_links: Optional[Dict[str, Any]] = None
    avg_rating: float
    review_count: int

    class Config:
        from_attributes = True


class ProductFilter(BaseModel):
    skin_type: Optional[str] = None
    skin_tone: Optional[str] = None
    concerns: Optional[List[str]] = None
    category: Optional[str] = None
    budget_range: Optional[str] = None
    prefers_natural: Optional[bool] = None
    prefers_fragrance_free: Optional[bool] = None


class RecommendedProductResponse(ProductResponse):
    match_score: float
    reason: Optional[str] = None
