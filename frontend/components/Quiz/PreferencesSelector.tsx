"use client";

import { motion } from "framer-motion";

interface Preferences {
  sensitivityLevel: string;
  budgetRange: string;
  prefersNatural: boolean;
  prefersFragranceFree: boolean;
}

interface Props {
  preferences: Preferences;
  onChange: (updates: Partial<Preferences>) => void;
}

export function PreferencesSelector({ preferences, onChange }: Props) {
  return (
    <div className="space-y-8">
      {/* Sensitivity Level */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sensitivity Level</h3>
        <div className="grid grid-cols-3 gap-4">
          {["low", "medium", "high"].map((level) => (
            <button
              key={level}
              onClick={() => onChange({ sensitivityLevel: level })}
              className={`p-4 rounded-xl border-2 capitalize transition-all ${
                preferences.sensitivityLevel === level
                  ? "border-accent-500 bg-accent-500/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Budget Range (₹)</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onChange({ budgetRange: "low" })}
            className={`p-4 rounded-xl border-2 transition-all ${
              preferences.budgetRange === "low"
                ? "border-accent-500 bg-accent-500/20"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <span className="block font-bold">Under 500</span>
            <span className="text-sm text-gray-400">Budget-friendly</span>
          </button>
          <button
            onClick={() => onChange({ budgetRange: "medium" })}
            className={`p-4 rounded-xl border-2 transition-all ${
              preferences.budgetRange === "medium"
                ? "border-accent-500 bg-accent-500/20"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <span className="block font-bold">500-1000</span>
            <span className="text-sm text-gray-400">Mid-range</span>
          </button>
          <button
            onClick={() => onChange({ budgetRange: "high" })}
            className={`p-4 rounded-xl border-2 transition-all ${
              preferences.budgetRange === "high"
                ? "border-accent-500 bg-accent-500/20"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <span className="block font-bold">1000+</span>
            <span className="text-sm text-gray-400">Premium</span>
          </button>
        </div>
      </div>

      {/* Preferences Toggles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Preferences</h3>
        <div className="space-y-4">
          <motion.button
            onClick={() => onChange({ prefersNatural: !preferences.prefersNatural })}
            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
              preferences.prefersNatural
                ? "border-primary-500 bg-primary-500/20"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <div className="text-left">
                <p className="font-medium">Natural/Organic Products</p>
                <p className="text-sm text-gray-400">Plant-based, clean ingredients</p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full ${
                preferences.prefersNatural ? "bg-primary-500" : "bg-gray-700"
              }`}
            />
          </motion.button>

          <motion.button
            onClick={() =>
              onChange({ prefersFragranceFree: !preferences.prefersFragranceFree })
            }
            className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
              preferences.prefersFragranceFree
                ? "border-primary-500 bg-primary-500/20"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚫</span>
              <div className="text-left">
                <p className="font-medium">Fragrance-Free</p>
                <p className="text-sm text-gray-400">No added scents</p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full ${
                preferences.prefersFragranceFree ? "bg-primary-500" : "bg-gray-700"
              }`}
            />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
