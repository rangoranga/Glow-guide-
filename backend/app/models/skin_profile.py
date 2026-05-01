from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from ..database import Base


class SkinProfile(Base):
    __tablename__ = "skin_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Skin type
    skin_type = Column(String)  # oily, dry, combination, normal, sensitive
    skin_tone = Column(String)  # fair, wheatish, medium, dusky, deep
    fitzpatrick_scale = Column(Integer, default=3)  # 1-6 scale

    # Skin concerns (comma-separated or JSON)
    concerns = Column(Text)  # acne, pigmentation, tan, dark_spots, dullness, fine_lines, open_pores

    # Additional info
    sensitivity_level = Column(String)  # low, medium, high
    current_routine = Column(Text, nullable=True)
    allergies = Column(Text, nullable=True)
    budget_range = Column(String)  # low, medium, high

    # Preferences
    prefers_natural = Column(Boolean, default=False)
    prefers_fragrance_free = Column(Boolean, default=False)

    # Relationship
    user = relationship("User", back_populates="skin_profile")
