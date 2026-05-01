"use client";

import { motion } from "framer-motion";

const skinTones = [
  {
    id: "fair",
    color: "bg-[#f5d7c4]",
    title: "Fair",
    description: "Light skin that burns easily",
  },
  {
    id: "wheatish",
    color: "bg-[#e8c4a0]",
    title: "Wheatish",
    description: "Light-medium with golden undertones",
  },
  {
    id: "medium",
    color: "bg-[#d4a574]",
    title: "Medium",
    description: "Medium skin, tans easily",
  },
  {
    id: "dusky",
    color: "bg-[#a67c52]",
    title: "Dusky",
    description: "Medium-dark with warm undertones",
  },
  {
    id: "deep",
    color: "bg-[#5c4033]",
    title: "Deep",
    description: "Dark skin, rarely burns",
  },
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SkinToneSelector({ value, onChange }: Props) {
  return (
    <div className="grid gap-4">
      {skinTones.map((tone, index) => (
        <motion.button
          key={tone.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onChange(tone.id)}
          className={`p-6 rounded-xl border-2 transition-all ${
            value === tone.id
              ? "border-primary-500 bg-primary-500/20"
              : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full ${tone.color} border-2 border-white/20 shadow-lg`}
            />
            <div className="text-left">
              <h3 className="font-bold text-lg">{tone.title}</h3>
              <p className="text-gray-400 text-sm">{tone.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
