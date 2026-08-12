from sqlalchemy import Column, Integer, String, Float, Text, Boolean, JSON
from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    category = Column(String)

    price = Column(Float)
    currency = Column(String, default="INR")

    skin_types = Column(Text)
    skin_tones = Column(Text, nullable=True)

    concerns = Column(Text)

    key_ingredients = Column(Text)
    full_ingredients = Column(Text, nullable=True)
    active_ingredients = Column(Text, nullable=True)

    description = Column(Text)
    how_to_use = Column(Text, nullable=True)
    size = Column(String, nullable=True)

    is_natural = Column(Boolean, default=False)
    is_fragrance_free = Column(Boolean, default=False)
    is_cruelty_free = Column(Boolean, default=False)
    is_vegan = Column(Boolean, default=False)

    dermatologist_tested = Column(Boolean, default=False)
    clinically_proven = Column(Boolean, default=False)
    research_notes = Column(Text, nullable=True)

    available_in_india = Column(Boolean, default=True)
    purchase_links = Column(JSON, nullable=True)

    avg_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
