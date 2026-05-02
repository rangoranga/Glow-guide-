"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { gatedPath } from "@/lib/session";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_34rem)]" />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
            Personalized skincare intelligence
          </p>

          <h1 className="mb-6 text-6xl font-black tracking-tight text-white md:text-8xl">
            GlowGuide
          </h1>

          <p className="mb-4 text-xl text-white/80 md:text-2xl">
            Minimal routines. Smarter product checks. Calmer skin decisions.
          </p>

          <p className="mx-auto mb-12 max-w-2xl text-lg text-white/55">
            Personalized product recommendations for Indian skin.
            Built with safety-first skincare guidance, curated for Gen Z.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={gatedPath("/quiz")}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white px-10 py-4 text-lg font-bold text-black transition hover:bg-white/90"
              >
                Find Your Glow →
              </motion.button>
            </Link>
            <Link
              href={gatedPath("/glowcheck")}
              className="rounded-full border border-white/25 px-8 py-4 text-lg font-bold text-white/80 transition hover:border-white hover:text-white"
            >
              Try GlowCheck
            </Link>
            <Link
              href={gatedPath("/community")}
              className="rounded-full border border-white/15 px-8 py-4 text-lg font-bold text-white/70 transition hover:border-white hover:text-white"
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
          className="mt-32 grid gap-5 md:grid-cols-3"
        >
          <FeatureCard
            number="01"
            title="Personalized for You"
            description="Takes your skin type, tone, and concerns to find products that actually work"
          />
          <FeatureCard
            number="02"
            title="Indian Market Only"
            description="Products you can actually buy in India. No international shipping headaches"
          />
          <FeatureCard
            number="03"
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
          <p className="mb-6 text-sm uppercase tracking-[0.28em] text-white/45">
            Made for all Indian skin tones
          </p>
          <div className="mx-auto flex max-w-sm justify-center gap-3">
            {["#f2d0b7", "#d7a57e", "#b57a52", "#875331", "#4d2b1a"].map((tone) => (
              <span
                key={tone}
                className="h-12 w-12 rounded-full border border-white/20"
                style={{ backgroundColor: tone }}
              />
            ))}
          </div>
        </motion.div>

        {/* Founder */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mx-auto mt-32 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Founder
          </p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Built by Srirankavarsine Bhupathe
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            GlowGuide is shaped around a simple idea: skincare advice should feel personal, understandable, and safer to act on.
          </p>
          <a
            href="https://www.linkedin.com/in/srirankavarsinebhupathe/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full border border-white/25 px-6 py-3 font-bold text-white/80 transition hover:border-white hover:text-white"
          >
            Connect on LinkedIn
          </a>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/40">
          <p>Made for Indian skincare lovers</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="rounded-2xl border border-white/10 bg-white/[0.035] p-8"
    >
      <p className="mb-8 text-sm font-semibold text-white/35">{number}</p>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-6 text-white/55">{description}</p>
    </motion.div>
  );
}
