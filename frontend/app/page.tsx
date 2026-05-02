"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-900">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-600/20 to-accent-600/20 blur-3xl" />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Logo/Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-6"
          >
            ✨
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text">GlowGuide</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Your skincare BFF that actually gets you 💅
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Personalized product recommendations for Indian skin.
            Built with safety-first skincare guidance, curated for Gen Z.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quiz">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glow-button px-10 py-4 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-full text-lg font-bold text-white shadow-lg shadow-primary-500/30"
              >
                Find Your Glow →
              </motion.button>
            </Link>
            <Link
              href="/glowcheck"
              className="rounded-full border border-accent-400/50 px-8 py-4 text-lg font-bold text-accent-100 hover:border-accent-300 hover:text-white"
            >
              Try GlowCheck
            </Link>
            <Link
              href="/community"
              className="rounded-full border border-gray-700 px-8 py-4 text-lg font-bold text-gray-200 hover:border-primary-300 hover:text-white"
            >
              Community
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-8 mt-32"
        >
          <FeatureCard
            emoji="🎯"
            title="Personalized for You"
            description="Takes your skin type, tone, and concerns to find products that actually work"
          />
          <FeatureCard
            emoji="🇮🇳"
            title="Indian Market Only"
            description="Products you can actually buy in India. No international shipping headaches"
          />
          <FeatureCard
            emoji="🧴"
            title="Safety-first checks"
            description="GlowCheck helps you pause, simplify, or seek urgent care when symptoms look concerning"
          />
        </motion.div>

        {/* Skin Tone Representation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 text-center"
        >
          <p className="text-gray-400 mb-6">Made for ALL Indian skin tones</p>
          <div className="flex justify-center gap-4 text-4xl">
            <span className="float" style={{ animationDelay: "0s" }}>🤎</span>
            <span className="float" style={{ animationDelay: "0.2s" }}>🤎</span>
            <span className="float" style={{ animationDelay: "0.4s" }}>🤎</span>
            <span className="float" style={{ animationDelay: "0.6s" }}>🤎</span>
            <span className="float" style={{ animationDelay: "0.8s" }}>🤎</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 mt-32 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Made with 💜 for Indian skincare lovers</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass p-8 rounded-2xl border border-gray-800"
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
