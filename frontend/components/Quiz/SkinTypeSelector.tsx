"use client";

import { motion } from "framer-motion";

const skinTypes = [
  {
    id: "oily",
    emoji: "💧",
    title: "Oily",
    description: "Gets shiny quickly, especially in the T-zone",
  },
  {
    id: "dry",
    emoji: "🏜️",
    title: "Dry",
    description: "Feels tight, may have flaky patches",
  },
  {
    id: "combination",
    emoji: "⚖️",
    title: "Combination",
    description: "Oily T-zone, dry/normal elsewhere",
  },
  {
    id: "normal",
    emoji: "✨",
    title: "Normal",
    description: "Balanced, not too oily or dry",
  },
  {
    id: "sensitive",
    emoji: "🌸",
    title: "Sensitive",
    description: "Easily irritated, reacts to products",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SkinTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-4">
      {skinTypes.map((type, index) => (
        <motion.button
          key={type.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onChange(type.id)}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            value === type.id
              ? "border-primary-500 bg-primary-500/20"
              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{type.emoji}</span>
            <div>
              <h3 className="font-bold text-lg">{type.title}</h3>
              <p className="text-gray-400 text-sm">{type.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
