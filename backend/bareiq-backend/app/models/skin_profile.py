from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from ..database import Base


class SkinProfile(Base):
    __tablename__ = "skin_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    skin_type = Column(String)
    skin_tone = Column(String)
    fitzpatrick_scale = Column(Integer, default=3)

    concerns = Column(Text)

    sensitivity_level = Column(String)
    current_routine = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    budget_range = Column(String)

    prefers_natural = Column(Boolean, default=False)
    prefers_fragrance_free = Column(Boolean, default=False)

    user = relationship("User", back_populates="skin_profile")
