from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    email: Optional[str] = None
    guest_id: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: Optional[str] = None
    guest_id: Optional[str] = None
    created_at: datetime
    last_active: datetime
    current_streak: int
    longest_streak: int

    class Config:
        from_attributes = True
