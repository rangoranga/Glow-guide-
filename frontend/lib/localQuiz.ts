import type { Product } from "@/components/ProductCard/ProductCard";

export interface LocalQuizProfile {
  id: string;
  skinType: string;
  skinTone: string;
  concerns: string[];
  sensitivityLevel: string;
  budgetRange: string;
  prefersNatural: boolean;
  prefersFragranceFree: boolean;
  createdAt: string;
}

export interface LocalRecommendationProduct extends Product {
  match_score: number;
  reason?: string;
}

const LOCAL_QUIZ_KEY = "bareiq_local_quizzes";

export function saveLocalQuiz(profile: Omit<LocalQuizProfile, "id" | "createdAt">) {
  const quiz: LocalQuizProfile = {
    ...profile,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const quizzes = getLocalQuizzes();
  window.localStorage.setItem(LOCAL_QUIZ_KEY, JSON.stringify([quiz, ...quizzes]));
  return quiz;
}

export function getLocalQuiz(id: string) {
  return getLocalQuizzes().find((quiz) => quiz.id === id) || null;
}

export function buildLocalRecommendations(products: Product[], profile: LocalQuizProfile): LocalRecommendationProduct[] {
  return products
    .map((product) => {
      const productSkinTypes = normalize(product.skin_types);
      const productConcerns = normalize(product.concerns);
      const userConcerns = new Set(profile.concerns);
      let score = 15;
      const reasons: string[] = [];

      if (productSkinTypes.has(profile.skinType) || productSkinTypes.has("all")) {
        score += 30;
        reasons.push(`Suitable for ${profile.skinType} skin`);
      }

      const matchedConcerns = Array.from(userConcerns).filter((concern) => productConcerns.has(concern));
      if (matchedConcerns.length > 0) {
        score += Math.min(35, matchedConcerns.length * 14);
        reasons.push(`Targets ${matchedConcerns.slice(0, 2).join(", ")}`);
      }

      if (profile.prefersNatural && product.is_natural) {
        score += 7;
        reasons.push("Natural option");
      }

      if (profile.prefersFragranceFree && product.is_fragrance_free) {
        score += 8;
        reasons.push("Fragrance-free");
      }

      if (budgetMatches(product.price, profile.budgetRange)) {
        score += 8;
        reasons.push("Fits your budget");
      }

      if (product.avg_rating > 0) {
        score += Math.min(10, product.avg_rating * 2);
      }

      return {
        ...product,
        match_score: Math.min(Math.round(score), 100),
        reason: reasons.slice(0, 3).join("; ") || "Balanced match for your profile",
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10);
}

function getLocalQuizzes(): LocalQuizProfile[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(LOCAL_QUIZ_KEY);
  return stored ? (JSON.parse(stored) as LocalQuizProfile[]) : [];
}

function normalize(value: string) {
  const terms = new Set(value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean));
  if (terms.has("pores")) terms.add("open_pores");
  if (terms.has("open_pores")) terms.add("pores");
  if (terms.has("aging")) terms.add("fine_lines");
  if (terms.has("fine_lines")) terms.add("aging");
  if (terms.has("pigmentation")) terms.add("dark_spots");
  if (terms.has("dark_spots")) terms.add("pigmentation");
  return terms;
}

function budgetMatches(price: number, budgetRange: string) {
  if (budgetRange === "low") return price <= 500;
  if (budgetRange === "medium") return price <= 1000;
  return true;
}
