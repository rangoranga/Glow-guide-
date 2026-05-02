"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LoginGate } from "@/components/Auth/LoginGate";
import { apiFetch } from "@/lib/api";
import {
  CHANGED_FACTORS,
  BareCheckAnalysis,
  BareCheckInput,
  BareProduct,
  MIXED_ACTIVES,
  SEVERITIES,
  SKIN_AREAS,
  SYMPTOMS,
  TIMELINES,
  addPost,
  analyzeBareCheck,
  createIdentity,
  getIdentity,
} from "@/lib/barecheck";
import { gatedPath, getBareIQUser } from "@/lib/session";

const initialForm: BareCheckInput = {
  productName: "",
  productKind: "",
  productVariant: "",
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

const guidedSteps = ["Start", "Product", "Problem", "Where and when", "Symptoms", "Changes", "Photo", "Result"];

export default function BareCheckPage() {
  const [mode, setMode] = useState<"quiz" | "chat" | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [products, setProducts] = useState<BareProduct[]>([]);
  const [form, setForm] = useState<BareCheckInput>(initialForm);
  const [analysis, setAnalysis] = useState<BareCheckAnalysis | null>(null);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    if (product) setForm((current) => ({ ...current, productName: product }));
    apiFetch<BareProduct[]>("/api/products").then(setProducts).catch(() => setProducts([]));
  }, []);

  const matchingProducts = useMemo(() => {
    const query = form.productName.toLowerCase();
    if (!query) return products.slice(0, 6);
    return products
      .filter((product) => `${product.brand} ${product.name}`.toLowerCase().includes(query))
      .slice(0, 6);
  }, [form.productName, products]);

  const canContinue = useMemo(() => {
    if (currentStep === 0) return Boolean(mode);
    if (currentStep === 1) return Boolean(form.productName.trim() && form.productKind?.trim() && form.productVariant?.trim());
    if (currentStep === 2) return Boolean(form.question.trim());
    if (currentStep === 3) return form.skinArea.length > 0 && Boolean(form.timeline);
    if (currentStep === 4) return form.symptoms.length > 0 && Boolean(form.severity);
    return true;
  }, [currentStep, form, mode]);

  const stepTitle = mode === "chat" ? chatTitle(currentStep) : guidedSteps[currentStep];

  const next = () => {
    if (!canContinue) return;
    if (currentStep < guidedSteps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    runAnalysis();
  };

  const back = () => {
    setAnalysis(null);
    setPosted(false);
    setCurrentStep((step) => Math.max(0, step - 1));
  };

  const runAnalysis = () => {
    const nextAnalysis = analyzeBareCheck(form);
    const user = getBareIQUser();
    const identity = getIdentity() || createIdentity(user?.name);
    setAnalysis(nextAnalysis);
    setPosted(false);

    if (form.intent !== "Ask AI") {
      addPost(form, identity, nextAnalysis);
      setPosted(true);
    }
  };

  const chooseProduct = (product: BareProduct) => {
    setForm((current) => ({
      ...current,
      productId: product.id,
      productName: `${product.brand} ${product.name}`,
      productKind: product.category || current.productKind,
      productVariant: product.name,
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

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    next();
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <LoginGate />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_34rem)]" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-2xl font-black text-white">
            BareIQ
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm">
            <Link className="rounded-full border border-white/15 px-4 py-2 text-white/70 hover:border-white hover:text-white" href={gatedPath("/quiz")}>
              BareIQ Quiz
            </Link>
            <Link className="rounded-full bg-white px-4 py-2 font-semibold text-black" href={gatedPath("/community")}>
              Community
            </Link>
          </nav>
        </header>

        <section className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">BareCheck</p>
          <h1 className="text-4xl font-black md:text-6xl">Let’s check this one step at a time.</h1>
          <p className="mt-4 max-w-2xl text-white/60">
            No diagnosis, no panic. BareCheck asks the important details and gives safety-first guidance about whether a product may be irritating your skin.
          </p>
        </section>

        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs text-white/45">
            <span>{stepTitle}</span>
            <span>{Math.min(currentStep + 1, guidedSteps.length)} / {guidedSteps.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-white"
              animate={{ width: `${((currentStep + 1) / guidedSteps.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={submit}>
          <AnimatePresence mode="wait">
            <motion.section
              key={`${mode}-${currentStep}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              {renderStep()}
            </motion.section>
          </AnimatePresence>

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={back}
              className={`rounded-full px-6 py-3 font-semibold ${currentStep === 0 ? "pointer-events-none opacity-0" : "border border-white/15 text-white/75"}`}
            >
              Back
            </button>
            <button
              disabled={!canContinue}
              className="rounded-full bg-white px-8 py-3 font-black text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentStep === guidedSteps.length - 1 ? "Get guidance" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );

  function renderStep() {
    if (currentStep === 0) {
      return (
        <div>
          <h2 className="text-3xl font-black">How do you want to use BareCheck?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ModeCard
              active={mode === "quiz"}
              title="Take a guided quiz"
              body="Best if you want a calm, structured check with every important detail covered."
              onClick={() => setMode("quiz")}
            />
            <ModeCard
              active={mode === "chat"}
              title="Talk with the AI-style chatbot"
              body="Best if you want it to feel like a conversation while BareCheck still asks everything."
              onClick={() => setMode("chat")}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div>
          <StepHeading mode={mode} title="Which exact product are we checking?" chat="Tell me the brand, product type, and exact variant. Tiny details matter here." />
          <input
            value={form.productName}
            onChange={(event) => setForm({ ...form, productName: event.target.value, productId: undefined })}
            placeholder="Brand, example: Minimalist or Dot & Key"
            className="mt-5 w-full rounded-xl border border-white/15 bg-black px-4 py-4 outline-none focus:border-white"
          />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input
              value={form.productKind}
              onChange={(event) => setForm({ ...form, productKind: event.target.value })}
              placeholder="Product type: eye serum, moisturizer, sunscreen..."
              className="w-full rounded-xl border border-white/15 bg-black px-4 py-4 outline-none focus:border-white"
            />
            <input
              value={form.productVariant}
              onChange={(event) => setForm({ ...form, productVariant: event.target.value })}
              placeholder="Exact variant: blue gel, brightening, 10% niacinamide..."
              className="w-full rounded-xl border border-white/15 bg-black px-4 py-4 outline-none focus:border-white"
            />
          </div>
          <p className="mt-3 text-sm text-white/45">
            Example: Dot & Key moisturizer, blue pack, barrier repair gel. Or Minimalist eye serum, peptide formula.
          </p>
          {matchingProducts.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {matchingProducts.map((product) => (
                <button
                  type="button"
                  key={product.id}
                  onClick={() => chooseProduct(product)}
                  className="rounded-full border border-white/15 px-3 py-2 text-sm text-white/65 hover:border-white hover:text-white"
                >
                  {product.brand} {product.name}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div>
          <StepHeading mode={mode} title="What is the problem?" chat="What are you worried this product is doing to your skin?" />
          <textarea
            value={form.question}
            onChange={(event) => setForm({ ...form, question: event.target.value, story: event.target.value })}
            placeholder="Is this product causing acne? Is this purging or irritation? Should I stop it?"
            className="mt-5 min-h-36 w-full rounded-xl border border-white/15 bg-black px-4 py-4 outline-none focus:border-white"
          />
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div>
          <StepHeading mode={mode} title="Where is it happening, and when did it start?" chat="Show me the location and timeline so I can understand the pattern." />
          <Segmented label="How long have you been using it?" values={TIMELINES} value={form.timeline} onChange={(timeline) => setForm({ ...form, timeline })} />
          <ChoiceGrid label="Where is the problem happening?" values={SKIN_AREAS} selected={form.skinArea} onToggle={(value) => toggleValue("skinArea", value)} />
          <Segmented label="Skin type, optional" values={["Oily", "Dry", "Combination", "Normal", "Sensitive"]} value={form.skinType || ""} onChange={(skinType) => setForm({ ...form, skinType })} />
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div>
          <StepHeading mode={mode} title="What symptoms are you seeing?" chat="Pick every symptom that fits, then choose how intense it feels." />
          <ChoiceGrid label="Symptoms" values={SYMPTOMS} selected={form.symptoms} onToggle={(value) => toggleValue("symptoms", value)} />
          <Segmented label="Severity" values={SEVERITIES} value={form.severity} onChange={(severity) => setForm({ ...form, severity })} danger />
          <p className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            If you have facial swelling, trouble breathing, severe pain, or a fast-spreading rash, seek urgent medical care.
          </p>
        </div>
      );
    }

    if (currentStep === 5) {
      return (
        <div>
          <StepHeading mode={mode} title="What else changed recently?" chat="New products and active combinations can change the answer a lot." />
          <ChoiceGrid label="Recent changes" values={CHANGED_FACTORS} selected={form.changedFactors} onToggle={(value) => toggleValue("changedFactors", value)} />
          <ChoiceGrid label="Actives mixed with this product" values={MIXED_ACTIVES} selected={form.mixedActives} onToggle={(value) => toggleValue("mixedActives", value)} />
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <div>
          <StepHeading mode={mode} title="Photo and sharing" chat="Last thing: do you want only guidance, or should this also help the community?" />
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="w-full rounded-xl border border-white/15 bg-black px-4 py-3 text-sm text-white/60"
          />
          {form.photoDataUrl && <img src={form.photoDataUrl} alt="Uploaded reaction" className="mt-4 max-h-72 w-full rounded-xl border border-gray-800 object-cover" />}
          <Segmented label="Photo visibility" values={["public", "private"]} value={form.photoVisibility} onChange={(photoVisibility) => setForm({ ...form, photoVisibility: photoVisibility as "public" | "private" })} />
          <Segmented label="What should BareCheck do?" values={["Ask AI", "Post experience", "Both"]} value={form.intent} onChange={(intent) => setForm({ ...form, intent: intent as BareCheckInput["intent"] })} />
        </div>
      );
    }

    return (
      <div>
        <StepHeading mode={mode} title="Ready for your safety check?" chat="I have enough detail now. Tap the button and I’ll give you the safest next step." />
        {analysis ? (
          <AnalysisCard analysis={analysis} posted={posted} />
        ) : (
          <div className="rounded-xl border border-white/10 bg-black p-5 text-white/65">
            <p>Product: {form.productName}</p>
            <p className="mt-2">Type: {form.productKind || "Not specified"}</p>
            <p className="mt-2">Exact variant: {form.productVariant || "Not specified"}</p>
            <p className="mt-2">Question: {form.question}</p>
            <p className="mt-2">Symptoms: {form.symptoms.join(", ") || "Not selected"}</p>
          </div>
        )}
      </div>
    );
  }
}

function ModeCard({ active, title, body, onClick }: { active: boolean; title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${active ? "border-white bg-white text-black" : "border-white/10 bg-white/[0.03] hover:border-white/40"}`}
    >
      <h3 className="text-xl font-black">{title}</h3>
      <p className={`mt-2 text-sm ${active ? "text-black/65" : "text-white/55"}`}>{body}</p>
    </button>
  );
}

function StepHeading({ mode, title, chat }: { mode: "quiz" | "chat" | null; title: string; chat: string }) {
  return (
    <div>
      {mode === "chat" && <p className="mb-3 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3 text-white/75">{chat}</p>}
      <h2 className="text-3xl font-black">{title}</h2>
    </div>
  );
}

function Segmented({ label, values, value, onChange, danger }: { label: string; values: string[]; value: string; onChange: (value: string) => void; danger?: boolean }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm text-white/60">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {values.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-h-11 rounded-xl border px-3 text-sm font-semibold ${value === item ? danger ? "border-white bg-white text-black" : "border-white bg-white text-black" : "border-white/15 bg-black text-white/65"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChoiceGrid({ label, values, selected, onToggle }: { label: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-sm text-white/60">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => onToggle(item)}
            className={`rounded-full border px-3 py-2 text-sm ${selected.includes(item) ? "border-white bg-white text-black" : "border-white/15 bg-black text-white/65"}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function AnalysisCard({ analysis, posted }: { analysis: BareCheckAnalysis; posted: boolean }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <p className="text-sm font-semibold text-white/55">BareCheck result</p>
      <h2 className="mt-2 text-2xl font-black">{analysis.recommendation}</h2>
      <p className="mt-3 text-white/75">{analysis.explanation}</p>
      {analysis.mixedActiveWarnings.length > 0 && (
        <div className="mt-4 rounded-xl border border-white/15 bg-black p-4 text-sm text-white/70">
          {analysis.mixedActiveWarnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      )}
      <div className="mt-4 space-y-2 text-sm text-white/70">
        {analysis.saferSteps.map((step) => <p key={step}>{step}</p>)}
      </div>
      <p className="mt-4 text-xs text-white/45">This is rule-based safety guidance, not medical diagnosis.</p>
      {posted && <Link href={gatedPath("/community")} className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-black">View your post</Link>}
    </section>
  );
}

function chatTitle(step: number) {
  return ["Choose style", "Product", "Problem", "Location", "Symptoms", "Recent changes", "Sharing", "Answer"][step];
}
