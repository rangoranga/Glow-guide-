"use client";

import { motion } from "framer-motion";

const concerns = [
  { id: "acne", emoji: "🔴", label: "Acne & Breakouts" },
  { id: "pigmentation", emoji: "🟤", label: "Pigmentation" },
  { id: "tan", emoji: "☀️", label: "Tan Removal" },
  { id: "dark_spots", emoji: "⚫", label: "Dark Spots" },
  { id: "dullness", emoji: "😴", label: "Dullness" },
  { id: "fine_lines", emoji: "📏", label: "Fine Lines" },
  { id: "open_pores", emoji: "🕳️", label: "Open Pores" },
  { id: "oiliness", emoji: "💧", label: "Excess Oil" },
  { id: "dryness", emoji: "🏜️", label: "Dryness" },
];

interface Props {
  values: string[];
  onChange: (values: string[]) => void;
}

export function ConcernsSelector({ values, onChange }: Props) {
  const toggleConcern = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  return (
    <div>
      <p className="text-gray-400 mb-6">Select all that apply</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {concerns.map((concern, index) => {
          const isSelected = values.includes(concern.id);
          return (
            <motion.button
              key={concern.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleConcern(concern.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-secondary-500 bg-secondary-500/20"
                  : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
              }`}
            >
              <span className="text-3xl block mb-2">{concern.emoji}</span>
              <span className="text-sm font-medium">{concern.label}</span>
            </motion.button>
          );
        })}
      </div>
      {values.length > 0 && (
        <p className="text-center text-gray-400 mt-6">
          {values.length} concern{values.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
