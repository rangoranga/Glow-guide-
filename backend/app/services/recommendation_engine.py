from typing import List, Optional, Tuple
from ..models.product import Product
from ..models.skin_profile import SkinProfile


class RecommendationEngine:
    """
    Recommends products based on skin profile matching.
    Uses a scoring algorithm that weighs different factors.
    """

    # Weights for scoring
    WEIGHTS = {
        "skin_type": 30,
        "concerns": 40,
        "skin_tone": 10,
        "preferences": 10,
        "rating": 10,
    }

    CONCERN_ALIASES = {
        "open_pores": {"open_pores", "pores"},
        "pores": {"open_pores", "pores"},
        "fine_lines": {"fine_lines", "aging"},
        "aging": {"fine_lines", "aging"},
        "dark_spots": {"dark_spots", "pigmentation"},
    }

    @staticmethod
    def _normalize_terms(value: str) -> set[str]:
        terms = {item.strip().lower() for item in (value or "").split(",") if item.strip()}
        expanded = set(terms)
        for term in terms:
            expanded.update(RecommendationEngine.CONCERN_ALIASES.get(term, {term}))
        return expanded

    @staticmethod
    def _price_matches_budget(price: Optional[float], budget_range: Optional[str]) -> bool:
        if price is None or not budget_range:
            return True
        if budget_range == "low":
            return price <= 500
        if budget_range == "medium":
            return price <= 1000
        return True

    @staticmethod
    def calculate_score(
        product: Product, skin_profile: SkinProfile
    ) -> Tuple[float, str]:
        """
        Calculate match score for a product based on skin profile.
        Returns (score, reason)
        """
        score = 0.0
        reasons = []

        # Skin type match (30 points)
        product_skin_types = RecommendationEngine._normalize_terms(product.skin_types or "")
        if skin_profile.skin_type.lower() in product_skin_types or "all" in product_skin_types:
            score += RecommendationEngine.WEIGHTS["skin_type"]
            reasons.append(f"Suitable for {skin_profile.skin_type} skin")

        # Concerns match (40 points)
        product_concerns = RecommendationEngine._normalize_terms(product.concerns or "")
        user_concerns = RecommendationEngine._normalize_terms(skin_profile.concerns or "")

        matched_concerns = set(user_concerns) & set(product_concerns)
        if matched_concerns:
            concern_score = min(
                RecommendationEngine.WEIGHTS["concerns"],
                len(matched_concerns) / max(len(user_concerns), 1)
                * RecommendationEngine.WEIGHTS["concerns"],
            )
            score += concern_score
            reasons.append(f"Targets {', '.join(sorted(matched_concerns))}")

        # Skin tone match (10 points) - for products like sunscreen that may leave white cast
        if product.skin_tones:
            product_tones = [t.strip().lower() for t in product.skin_tones.split(",")]
            if skin_profile.skin_tone.lower() in product_tones or "all" in product_tones:
                score += RecommendationEngine.WEIGHTS["skin_tone"]
        else:
            # No skin tone restriction = works for all
            score += RecommendationEngine.WEIGHTS["skin_tone"]

        # Preferences match (10 points)
        if skin_profile.prefers_natural and product.is_natural:
            score += 5
            reasons.append("Natural/organic product")
        if skin_profile.prefers_fragrance_free and product.is_fragrance_free:
            score += 5
            reasons.append("Fragrance-free")
        if not skin_profile.prefers_natural and not skin_profile.prefers_fragrance_free:
            score += 10  # Full points if no preferences

        if RecommendationEngine._price_matches_budget(product.price, skin_profile.budget_range):
            score += 5
            reasons.append("Fits your budget")

        # Rating bonus (10 points)
        if product.avg_rating > 0:
            rating_score = (product.avg_rating / 5.0) * RecommendationEngine.WEIGHTS["rating"]
            score += rating_score
        elif product.dermatologist_tested or product.clinically_proven:
            score += 5
            if product.dermatologist_tested:
                reasons.append("Dermatologist tested")
            if product.clinically_proven:
                reasons.append("Clinically proven")

        # Build reason string
        reason = "; ".join(reasons[:3])  # Top 3 reasons

        return min(score, 100.0), reason or "Balanced match for your profile"

    @classmethod
    def get_recommendations(
        cls, products: List[Product], skin_profile: SkinProfile, limit: int = 10
    ) -> List[Tuple[Product, float, str]]:
        """
        Get top product recommendations sorted by match score.
        Returns list of (product, score, reason) tuples
        """
        scored_products = []

        for product in products:
            score, reason = cls.calculate_score(product, skin_profile)
            scored_products.append((product, score, reason))

        # Sort by score descending
        scored_products.sort(key=lambda x: x[1], reverse=True)

        return scored_products[:limit]
