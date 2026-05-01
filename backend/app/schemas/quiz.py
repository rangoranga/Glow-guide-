from typing import Optional

from pydantic import BaseModel


class QuizSubmit(BaseModel):
    email: Optional[str] = None
    is_guest: bool = True

    # Skin analysis
    skin_type: str  # oily, dry, combination, normal, sensitive
    skin_tone: str  # fair, wheatish, medium, dusky, deep
    fitzpatrick_scale: Optional[int] = 3

    # Concerns (list)
    concerns: list[str]  # acne, pigmentation, tan, dark_spots, dullness, fine_lines, open_pores

    # Additional info
    sensitivity_level: Optional[str] = "medium"
    current_routine: Optional[str] = None
    allergies: Optional[str] = None
    budget_range: Optional[str] = "medium"

    # Preferences
    prefers_natural: Optional[bool] = False
    prefers_fragrance_free: Optional[bool] = False


class QuizResponse(BaseModel):
    user_id: int
    skin_profile_id: int
    message: str
    recommendations_count: int
