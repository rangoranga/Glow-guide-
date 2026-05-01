from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid

from ..database import get_db
from ..models.user import User
from ..models.skin_profile import SkinProfile
from ..schemas.quiz import QuizSubmit, QuizResponse
from ..services.recommendation_engine import RecommendationEngine
from ..models.product import Product
from ..models.recommendation import Recommendation

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


@router.post("/submit", response_model=QuizResponse)
def submit_quiz(quiz_data: QuizSubmit, db: Session = Depends(get_db)):
    """
    Submit quiz responses and get personalized product recommendations.
    """
    # Create or get user
    if quiz_data.is_guest or not quiz_data.email:
        guest_id = str(uuid.uuid4())
        user = User(guest_id=guest_id)
    else:
        # Check if user exists
        user = db.query(User).filter(User.email == quiz_data.email).first()
        if not user:
            user = User(email=quiz_data.email)
        else:
            # Update last active
            user.last_active = datetime.utcnow()

    db.add(user)
    db.commit()
    db.refresh(user)

    # Create or update skin profile. Email users may retake the quiz.
    skin_profile = db.query(SkinProfile).filter(SkinProfile.user_id == user.id).first()
    if not skin_profile:
        skin_profile = SkinProfile(user_id=user.id)
        db.add(skin_profile)

    skin_profile.skin_type = quiz_data.skin_type
    skin_profile.skin_tone = quiz_data.skin_tone
    skin_profile.fitzpatrick_scale = quiz_data.fitzpatrick_scale or 3
    skin_profile.concerns = ",".join(quiz_data.concerns)
    skin_profile.sensitivity_level = quiz_data.sensitivity_level
    skin_profile.budget_range = quiz_data.budget_range
    skin_profile.prefers_natural = quiz_data.prefers_natural
    skin_profile.prefers_fragrance_free = quiz_data.prefers_fragrance_free

    db.commit()
    db.refresh(skin_profile)

    # Get all products
    products = db.query(Product).filter(Product.available_in_india == True).all()

    # Get recommendations
    recommendations = RecommendationEngine.get_recommendations(
        products, skin_profile, limit=10
    )

    # Replace older recommendation rows so results always match the latest quiz.
    db.query(Recommendation).filter(Recommendation.user_id == user.id).delete()

    # Save recommendations
    saved_count = 0
    for product, score, reason in recommendations:
        rec = Recommendation(
            user_id=user.id,
            product_id=product.id,
            match_score=score,
            reason=reason,
        )
        db.add(rec)
        saved_count += 1

    db.commit()

    return QuizResponse(
        user_id=user.id,
        skin_profile_id=skin_profile.id,
        message="Your skin profile is ready! Here are your personalized recommendations.",
        recommendations_count=saved_count,
    )
