from typing import List, Optional

from pydantic import BaseModel


class QuizSubmit(BaseModel):
    email: Optional[str] = None
    is_guest: bool = True

    skin_type: str
    skin_tone: str
    fitzpatrick_scale: Optional[int] = 3

    concerns: List[str]

    sensitivity_level: Optional[str] = "medium"
    current_routine: Optional[str] = None
    allergies: Optional[str] = None
    budget_range: Optional[str] = "medium"

    prefers_natural: Optional[bool] = False
    prefers_fragrance_free: Optional[bool] = False


class QuizResponse(BaseModel):
    user_id: int
    skin_profile_id: int
    message: str
    recommendations_count: int
