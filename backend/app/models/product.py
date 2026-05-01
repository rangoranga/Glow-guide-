from sqlalchemy import Column, Integer, String, Float, Text, Boolean, JSON
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    category = Column(String)  # cleanser, moisturizer, serum, sunscreen, active, mask, toner

    # Pricing
    price = Column(Float)
    currency = Column(String, default="INR")

    # Skin compatibility
    skin_types = Column(Text)  # comma-separated: oily,dry,combination,normal,sensitive
    skin_tones = Column(Text, nullable=True)  # all, fair, wheatish, medium, dusky, deep

    # Concerns addressed
    concerns = Column(Text)  # acne, pigmentation, tan, dryness, dullness, aging, pores

    # Ingredients
    key_ingredients = Column(Text)
    full_ingredients = Column(Text, nullable=True)
    active_ingredients = Column(Text, nullable=True)

    # Product details
    description = Column(Text)
    how_to_use = Column(Text, nullable=True)
    size = Column(String, nullable=True)  # 50ml, 100g, etc.

    # Flags
    is_natural = Column(Boolean, default=False)
    is_fragrance_free = Column(Boolean, default=False)
    is_cruelty_free = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)

    # Doctor/research backing
    dermatologist_tested = Column(Boolean, default=False)
    clinically_proven = Column(Boolean, default=False)
    research_notes = Column(Text, nullable=True)

    # Availability
    available_in_india = Column(Boolean, default=True)
    purchase_links = Column(JSON, nullable=True)  # {nykaa: url, amazon: url, etc.}

    # Ratings
    avg_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
