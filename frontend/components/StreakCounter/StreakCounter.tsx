"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function StreakCounter() {
  const [streak, setStreak] = useState(0);
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);

  useEffect(() => {
    // Load streak from localStorage
    const savedStreak = localStorage.getItem("glowguide-streak");
    const savedCheckin = localStorage.getItem("glowguide-last-checkin");

    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
    setLastCheckin(savedCheckin);
  }, []);

  const handleCheckIn = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (lastCheckin === today) {
      return; // Already checked in today
    }

    const newStreak = lastCheckin === yesterday ? streak + 1 : 1;
    setStreak(newStreak);
    setLastCheckin(today);

    localStorage.setItem("glowguide-streak", newStreak.toString());
    localStorage.setItem("glowguide-last-checkin", today);
  };

  const isToday = lastCheckin === new Date().toDateString();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="inline-flex items-center gap-4 glass px-6 py-3 rounded-full border border-gray-800 mt-6"
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="font-bold text-xl">{streak}</span>
        <span className="text-gray-400 text-sm">day streak</span>
      </div>

      <button
        onClick={handleCheckIn}
        disabled={isToday}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          isToday
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:shadow-primary-500/30"
        }`}
      >
        {isToday ? "✓ Checked in" : "Check in today"}
      </button>
    </motion.div>
  );
}
