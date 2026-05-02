"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { consumePendingDestination, getGlowGuideUser, saveGlowGuideUser, savePendingDestination } from "@/lib/session";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark-900" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skinGoal, setSkinGoal] = useState("");

  useEffect(() => {
    const next = searchParams.get("next");
    if (next) savePendingDestination(next);
    if (getGlowGuideUser()) {
      router.replace(consumePendingDestination(next || "/quiz"));
    }
  }, [router, searchParams]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveGlowGuideUser({ name, email, skinGoal });
    router.push(consumePendingDestination("/quiz"));
  };

  return (
    <main className="min-h-screen bg-dark-900 px-4 py-10">
      <div className="fixed inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-600/10 to-accent-600/20 blur-3xl" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <section>
          <Link href="/" className="text-2xl font-black gradient-text">
            GlowGuide
          </Link>
          <h1 className="mt-8 text-4xl font-black md:text-6xl">One quick intro, then your skin tools open.</h1>
          <p className="mt-4 text-gray-300">
            For now this saves locally in your browser. Later we can use it for updates, email, saved reports, and follow alerts.
          </p>
        </section>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-800 bg-white/[0.06] p-6"
        >
          <h2 className="text-2xl font-bold">Create your GlowGuide profile</h2>
          <label className="mt-5 block text-sm text-gray-300">
            Name or display alias
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Sriranka or Anonymous Glow"
              className="mt-2 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary-400"
              required
            />
          </label>
          <label className="mt-4 block text-sm text-gray-300">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary-400"
              required
            />
          </label>
          <label className="mt-4 block text-sm text-gray-300">
            What should GlowGuide help with first?
            <textarea
              value={skinGoal}
              onChange={(event) => setSkinGoal(event.target.value)}
              placeholder="Acne, irritation, product reactions, routine building..."
              className="mt-2 min-h-28 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 text-white outline-none focus:border-primary-400"
              required
            />
          </label>
          <button className="mt-5 w-full rounded-xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 px-6 py-4 font-black">
            Continue
          </button>
          <p className="mt-4 text-xs text-gray-500">
            This is a lightweight v1 login gate. No password yet, and the profile stays on this device until backend auth is connected.
          </p>
        </motion.form>
      </div>
    </main>
  );
}
