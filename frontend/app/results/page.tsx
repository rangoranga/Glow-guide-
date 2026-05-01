"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { StreakCounter } from "@/components/StreakCounter/StreakCounter";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  skin_types: string;
  concerns: string;
  key_ingredients: string;
  description: string;
  avg_rating: number;
  review_count: number;
  dermatologist_tested: boolean;
  clinically_proven: boolean;
  is_natural: boolean;
  is_fragrance_free: boolean;
  is_cruelty_free: boolean;
  is_vegan: boolean;
  how_to_use?: string;
  size?: string;
  currency: string;
  match_score: number;
  reason?: string;
  purchase_links?: Record<string, string>;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    setError("");
    if (userId) {
      apiFetch<Product[]>(`/api/recommendations/${userId}`)
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Could not load your recommendations yet. Please wait a moment and refresh. The free backend may be waking up.");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];
  const routine = buildRoutine(products);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">✨</div>
          <p className="text-gray-400">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 gradient-text">Your Glow Kit</h1>
          <p className="text-gray-400 text-lg">
            {products.length > 0
              ? `${products.length} products picked for your profile`
              : "Your recommendations will appear here after the quiz"}
          </p>
          <StreakCounter />
        </motion.div>

        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-red-100">
            {error}
          </div>
        )}

        {!userId && (
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <Link
              href="/quiz"
              className="inline-flex rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-8 py-3 font-bold text-white"
            >
              Take the quiz
            </Link>
          </div>
        )}

        {products.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 rounded-2xl border border-gray-800 bg-white/[0.04] p-6"
          >
            <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-medium text-accent-400">Suggested starter routine</p>
                <h2 className="text-2xl font-bold">AM and PM essentials</h2>
              </div>
              <p className="max-w-xl text-sm text-gray-400">
                Start with one new product at a time and patch test actives before daily use.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <RoutineColumn title="Morning" products={routine.morning} />
              <RoutineColumn title="Night" products={routine.night} />
            </div>
          </motion.section>
        )}

        {/* Category Filter */}
        {products.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  filter === cat
                    ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                    : "glass text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              matchScore={product.match_score}
              reason={product.reason}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400">No products found in this category</p>
          </div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 glass p-8 rounded-2xl border border-gray-800"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            💡 Pro Tips for Your Skin
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TipCard
              emoji="☀️"
              title="Sunscreen is non-negotiable"
              description="Apply SPF 50 every morning, even indoors. Your future self will thank you!"
            />
            <TipCard
              emoji="💧"
              title="Layer your products"
              description="Thinnest to thickest: serum → moisturizer → sunscreen (AM) or face oil (PM)"
            />
            <TipCard
              emoji="🌙"
              title="Consistency > Perfection"
              description="A simple routine done daily beats a 10-step routine done occasionally"
            />
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function buildRoutine(products: Product[]) {
  const byCategory = (category: string) => products.find((product) => product.category === category);
  const cleanser = byCategory("cleanser");
  const serum = byCategory("serum") || byCategory("active");
  const moisturizer = byCategory("moisturizer");
  const sunscreen = byCategory("sunscreen");

  return {
    morning: [cleanser, serum, moisturizer, sunscreen].filter(Boolean) as Product[],
    night: [cleanser, serum, moisturizer].filter(Boolean) as Product[],
  };
}

function RoutineColumn({ title, products }: { title: string; products: Product[] }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-dark-800/60 p-4">
      <h3 className="mb-4 font-bold text-white">{title}</h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={`${title}-${product.id}`} className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500/20 text-sm font-bold text-primary-300">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{product.name}</p>
              <p className="text-xs capitalize text-gray-400">{product.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TipCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <span className="text-4xl block mb-3">{emoji}</span>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-6xl animate-pulse">✨</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
