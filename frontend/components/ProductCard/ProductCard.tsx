"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { buildRetailSearchLinks } from "@/lib/barecheck";
import { gatedPath } from "@/lib/session";

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  skin_types: string;
  concerns: string;
  key_ingredients: string;
  description: string;
  how_to_use?: string;
  size?: string;
  avg_rating: number;
  review_count: number;
  dermatologist_tested: boolean;
  clinically_proven: boolean;
  is_natural: boolean;
  is_fragrance_free: boolean;
  is_cruelty_free?: boolean;
  is_vegan?: boolean;
  purchase_links?: Record<string, string>;
}

interface Props {
  product: Product;
  matchScore?: number;
  reason?: string;
  index: number;
}

export function ProductCard({ product, matchScore, reason, index }: Props) {
  const retailLinks = buildRetailSearchLinks(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass p-6 rounded-2xl border border-gray-800 hover:border-primary-500/50 transition-all group"
    >
      {/* Match Score Badge */}
      {matchScore && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-sm">
              {Math.round(matchScore)}%
            </div>
            <div>
              <p className="text-xs text-gray-400">Match Score</p>
              <p className="text-xs text-accent-400">{reason}</p>
            </div>
          </div>
          {product.dermatologist_tested && (
            <span className="text-xs px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full">
              👩‍⚕️ Dermatologist Tested
            </span>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className="mb-4">
        <p className="text-xs text-primary-400 font-medium mb-1">{product.brand}</p>
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
      </div>

      {/* Key Ingredients */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Key Ingredients</p>
        <p className="text-sm text-gray-300">{product.key_ingredients}</p>
      </div>

      {product.how_to_use && (
        <div className="mb-4 rounded-xl border border-gray-800 bg-dark-800/60 p-3">
          <p className="mb-1 text-xs text-gray-500">How to use</p>
          <p className="text-sm text-gray-300">{product.how_to_use}</p>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs px-3 py-1 bg-gray-800 rounded-full capitalize">
          {product.category}
        </span>
        {product.is_natural && (
          <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
            🌿 Natural
          </span>
        )}
        {product.clinically_proven && (
          <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
            🔬 Clinically Proven
          </span>
        )}
        {product.is_fragrance_free && (
          <span className="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
            Fragrance-free
          </span>
        )}
      </div>

      {/* Rating */}
      {product.avg_rating > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(product.avg_rating) ? "text-yellow-400" : "text-gray-600"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {product.avg_rating} ({product.review_count.toLocaleString()} reviews)
          </span>
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <Link
          href={gatedPath(`/barecheck?product=${encodeURIComponent(`${product.brand} ${product.name}`)}`)}
          className="rounded-full border border-accent-400/40 px-4 py-2 text-sm font-semibold text-accent-200 hover:border-accent-300 hover:text-white"
        >
          BareCheck
        </Link>
        <Link
          href={gatedPath(`/community?product=${encodeURIComponent(`${product.brand} ${product.name}`)}`)}
          className="rounded-full border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 hover:border-primary-300 hover:text-white"
        >
          Reactions
        </Link>
      </div>

      {/* Price and Buy Links */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div>
          <span className="text-2xl font-bold">₹{product.price}</span>
          <span className="text-sm text-gray-500 ml-1">{product.currency}</span>
        </div>
        <div className="flex gap-2">
          <a
            href={retailLinks.nykaa}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#e81ca2] text-white rounded-full text-sm font-medium hover:bg-[#c4178a] transition-colors"
          >
            Nykaa
          </a>
          <a
            href={retailLinks.amazon}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#00d4a3] text-black rounded-full text-sm font-medium hover:bg-[#00b894] transition-colors"
          >
            Amazon
          </a>
        </div>
      </div>
    </motion.div>
  );
}
