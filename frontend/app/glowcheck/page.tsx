"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import {
  CHANGED_FACTORS,
  GlowCheckAnalysis,
  GlowCheckInput,
  GlowProduct,
  MIXED_ACTIVES,
  SEVERITIES,
  SKIN_AREAS,
  SYMPTOMS,
  TIMELINES,
  addPost,
  analyzeGlowCheck,
  createIdentity,
  getIdentity,
} from "@/lib/glowcheck";

const initialForm: GlowCheckInput = {
  productName: "",
  question: "",
  timeline: "2-3 days",
  skinArea: [],
  symptoms: [],
  severity: "Mild",
  changedFactors: [],
  mixedActives: [],
  photoVisibility: "private",
  intent: "Ask AI",
  story: "",
  skinType: "",
};

export default function GlowCheckPage() {
  const [identity, setIdentity] = useState(getIdentity());
  const [alias, setAlias] = useState("");
  const [products, setProducts] = useState<GlowProduct[]>([]);
  const [form, setForm] = useState<GlowCheckInput>(initialForm);
  const [analysis, setAnalysis] = useState<GlowCheckAnalysis | null>(null);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    setIdentity(getIdentity());
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    if (product) {
      setForm((current) => ({ ...current, productName: product }));
    }
    apiFetch<GlowProduct[]>("/api/products").then(setProducts).catch(() => setProducts([]));
  }, []);

  const matchingProducts = useMemo(() => {
    const query = form.productName.toLowerCase();
    if (!query) return products.slice(0, 8);
    return products
      .filter((product) => `${product.brand} ${product.name}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [form.productName, products]);

  const chooseProduct = (product: GlowProduct) => {
    setForm((current) => ({
      ...current,
      productId: product.id,
      productName: `${product.brand} ${product.name}`,
    }));
  };

  const toggleValue = (field: "skinArea" | "symptoms" | "changedFactors" | "mixedActives", value: string) => {
    setForm((current) => {
      const values = current[field];
      return {
        ...current,
        [field]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value],
      };
    });
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, photoDataUrl: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identity) return;
    const nextAnalysis = analyzeGlowCheck(form);
    setAnalysis(nextAnalysis);
    setPosted(false);

    if (form.intent !== "Ask AI") {
      addPost(form, identity, nextAnalysis);
      setPosted(true);
    }
  };

  return (
    <main className="min-h-screen bg-dark-900 px-4 py-8">
      <div className="fixed inset-0 bg-gradient-to-br from-primary-600/20 via-secondary-600/10 to-accent-600/20 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-2xl font-black gradient-text">
            GlowGuide
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link className="rounded-full border border-gray-700 px-4 py-2 text-gray-200" href="/results">
              Results
            </Link>
            <Link className="rounded-full bg-white px-4 py-2 font-semibold text-dark-900" href="/community">
              Community
            </Link>
          </nav>
        </header>

        <section className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-2 text-sm font-semibold text-accent-300">GlowCheck</p>
            <h1 className="text-4xl font-black md:text-6xl">Check a product reaction safely.</h1>
            <p className="mt-4 max-w-2xl text-gray-300">
              Ask about acne, purging, irritation, active ingredient mixing, or whether it may be safer to pause a product.
              GlowCheck gives rule-based guidance, not medical diagnosis.
            </p>
          </div>
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm text-red-100">
            <p className="font-bold">Urgent safety note</p>
            <p className="mt-2">
              If you have facial swelling, trouble breathing, severe pain, or a fast-spreading rash, seek urgent medical care.
            </p>
          </div>
        </section>

        {!identity && (
          <section className="mb-8 rounded-2xl border border-gray-800 bg-white/[0.05] p-5">
            <h2 className="mb-3 text-xl font-bold">Continue anonymously</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={alias}
                onChange={(event) => setAlias(event.target.value)}
                placeholder="Display alias, optional"
                className="min-h-12 flex-1 rounded-xl border border-gray-700 bg-dark-800 px-4 text-white outline-none focus:border-primary-400"
              />
              <button
                onClick={() => setIdentity(createIdentity(alias))}
                className="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-3 font-bold"
              >
                Continue anonymously
              </button>
            </div>
          </section>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <Card title="Product and question">
              <label className="text-sm text-gray-300">Product used</label>
              <input
                value={form.productName}
                onChange={(event) => setForm({ ...form, productName: event.target.value, productId: undefined })}
                placeholder="Search or type brand + product"
                className="mt-2 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 outline-none focus:border-primary-400"
                required
              />
              {matchingProducts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {matchingProducts.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => chooseProduct(product)}
                      className="rounded-full border border-gray-700 px-3 py-1.5 text-xs text-gray-300 hover:border-primary-400 hover:text-white"
                    >
                      {product.brand} {product.name}
                    </button>
                  ))}
                </div>
              )}

              <label className="mt-5 block text-sm text-gray-300">Question</label>
              <textarea
                value={form.question}
                onChange={(event) => setForm({ ...form, question: event.target.value })}
                placeholder="Is this causing acne? Should I stop it? Can I use it with vitamin C?"
                className="mt-2 min-h-28 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 outline-none focus:border-primary-400"
                required
              />
            </Card>

            <Card title="Reaction details">
              <Segmented label="Time used" values={TIMELINES} value={form.timeline} onChange={(timeline) => setForm({ ...form, timeline })} />
              <Segmented
                label="Skin type, optional"
                values={["Oily", "Dry", "Combination", "Normal", "Sensitive"]}
                value={form.skinType || ""}
                onChange={(skinType) => setForm({ ...form, skinType })}
              />
              <ChoiceGrid label="Skin area" values={SKIN_AREAS} selected={form.skinArea} onToggle={(value) => toggleValue("skinArea", value)} />
              <ChoiceGrid label="Symptoms" values={SYMPTOMS} selected={form.symptoms} onToggle={(value) => toggleValue("symptoms", value)} />
              <Segmented label="Severity" values={SEVERITIES} value={form.severity} onChange={(severity) => setForm({ ...form, severity })} danger />
            </Card>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="space-y-5">
            <Card title="What else changed?">
              <ChoiceGrid values={CHANGED_FACTORS} selected={form.changedFactors} onToggle={(value) => toggleValue("changedFactors", value)} />
              <ChoiceGrid label="Mixed actives" values={MIXED_ACTIVES} selected={form.mixedActives} onToggle={(value) => toggleValue("mixedActives", value)} />
            </Card>

            <Card title="Photo and sharing">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 text-sm text-gray-300"
              />
              {form.photoDataUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-gray-800">
                  <img src={form.photoDataUrl} alt="Uploaded reaction" className="max-h-64 w-full object-cover" />
                </div>
              )}
              <Segmented
                label="Photo visibility"
                values={["public", "private"]}
                value={form.photoVisibility}
                onChange={(photoVisibility) => setForm({ ...form, photoVisibility: photoVisibility as "public" | "private" })}
              />
              <Segmented
                label="What do you want to do?"
                values={["Ask AI", "Post experience", "Both"]}
                value={form.intent}
                onChange={(intent) => setForm({ ...form, intent: intent as GlowCheckInput["intent"] })}
              />
              {form.intent !== "Ask AI" && (
                <textarea
                  value={form.story}
                  onChange={(event) => setForm({ ...form, story: event.target.value })}
                  placeholder="Tell the community what happened."
                  className="min-h-28 w-full rounded-xl border border-gray-700 bg-dark-800 px-4 py-3 outline-none focus:border-primary-400"
                />
              )}
              <button
                disabled={!identity}
                className="w-full rounded-xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 px-6 py-4 font-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Run GlowCheck
              </button>
            </Card>

            {analysis && (
              <AnalysisCard analysis={analysis} posted={posted} />
            )}
          </motion.section>
        </form>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-800 bg-white/[0.05] p-5">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Segmented({
  label,
  values,
  value,
  onChange,
  danger,
}: {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
  danger?: boolean;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm text-gray-300">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {values.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold transition ${
              value === item
                ? danger
                  ? "border-red-300 bg-red-500/20 text-red-100"
                  : "border-primary-300 bg-primary-500/20 text-white"
                : "border-gray-700 bg-dark-800 text-gray-300 hover:border-gray-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChoiceGrid({
  label,
  values,
  selected,
  onToggle,
}: {
  label?: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="mb-5">
      {label && <p className="mb-2 text-sm text-gray-300">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onToggle(item)}
            className={`rounded-full border px-3 py-2 text-sm transition ${
              selected.includes(item)
                ? "border-accent-300 bg-accent-500/20 text-white"
                : "border-gray-700 bg-dark-800 text-gray-300 hover:border-gray-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function AnalysisCard({ analysis, posted }: { analysis: GlowCheckAnalysis; posted: boolean }) {
  return (
    <section className="rounded-2xl border border-accent-400/40 bg-accent-500/10 p-5">
      <p className="text-sm font-semibold text-accent-200">GlowCheck result</p>
      <h2 className="mt-2 text-2xl font-black">{analysis.recommendation}</h2>
      <p className="mt-3 text-gray-200">{analysis.explanation}</p>
      {analysis.mixedActiveWarnings.length > 0 && (
        <div className="mt-4 rounded-xl border border-yellow-300/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          {analysis.mixedActiveWarnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      )}
      <div className="mt-4 space-y-2 text-sm text-gray-200">
        {analysis.saferSteps.map((step) => (
          <p key={step}>{step}</p>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400">
        This is rule-based safety guidance, not medical diagnosis. Sources reflected include AAD skin-care and patch-testing guidance and NHS urgent allergy warning symptoms.
      </p>
      {posted && (
        <Link href="/community" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-dark-900">
          View your post
        </Link>
      )}
    </section>
  );
}
