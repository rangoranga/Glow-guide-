from typing import Optional

from pydantic import BaseModel


class SkinProfileCreate(BaseModel):
    skin_type: str  # oily, dry, combination, normal, sensitive
    skin_tone: str  # fair, wheatish, medium, dusky, deep
    fitzpatrick_scale: Optional[int] = 3
    concerns: str  # comma-separated
    sensitivity_level: Optional[str] = "medium"
    current_routine: Optional[str] = None
    allergies: Optional[str] = None
    budget_range: Optional[str] = "medium"
    prefers_natural: Optional[bool] = False
    prefers_fragrance_free: Optional[bool] = False


class SkinProfileResponse(BaseModel):
    id: int
    user_id: int
    skin_type: str
    skin_tone: str
    fitzpatrick_scale: int
    concerns: str
    sensitivity_level: str
    budget_range: str
    prefers_natural: bool
    prefers_fragrance_free: bool

    class Config:
        from_attributes = True
