"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { SkinTypeSelector } from "@/components/Quiz/SkinTypeSelector";
import { SkinToneSelector } from "@/components/Quiz/SkinToneSelector";
import { ConcernsSelector } from "@/components/Quiz/ConcernsSelector";
import { PreferencesSelector } from "@/components/Quiz/PreferencesSelector";

const steps = [
  { id: 1, title: "Skin Type", description: "What's your skin like?" },
  { id: 2, title: "Skin Tone", description: "Pick your shade" },
  { id: 3, title: "Concerns", description: "What are we fixing?" },
  { id: 4, title: "Preferences", description: "Your vibe" },
];

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    skinType: "",
    skinTone: "",
    concerns: [] as string[],
    sensitivityLevel: "medium",
    budgetRange: "medium",
    prefersNatural: false,
    prefersFragranceFree: false,
  });

  const canContinue =
    (currentStep === 1 && Boolean(formData.skinType)) ||
    (currentStep === 2 && Boolean(formData.skinTone)) ||
    (currentStep === 3 && formData.concerns.length > 0) ||
    currentStep === 4;

  const handleNext = () => {
    if (!canContinue || isSubmitting) {
      return;
    }
    setError("");
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const data = await apiFetch<{ user_id: number }>("/api/quiz/submit", {
        method: "POST",
        body: JSON.stringify({
          is_guest: true,
          skin_type: formData.skinType,
          skin_tone: formData.skinTone,
          concerns: formData.concerns,
          sensitivity_level: formData.sensitivityLevel,
          budget_range: formData.budgetRange,
          prefers_natural: formData.prefersNatural,
          prefers_fragrance_free: formData.prefersFragranceFree,
        }),
      });

      router.push(`/results?userId=${data.user_id}`);
    } catch (error) {
      setError("Could not save your quiz yet. Please make sure the backend is running on port 8000.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SkinTypeSelector
            value={formData.skinType}
            onChange={(value) => setFormData({ ...formData, skinType: value })}
          />
        );
      case 2:
        return (
          <SkinToneSelector
            value={formData.skinTone}
            onChange={(value) => setFormData({ ...formData, skinTone: value })}
          />
        );
      case 3:
        return (
          <ConcernsSelector
            values={formData.concerns}
            onChange={(values) => setFormData({ ...formData, concerns: values })}
          />
        );
      case 4:
        return (
          <PreferencesSelector
            preferences={formData}
            onChange={(updates) => setFormData({ ...formData, ...updates })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? "text-primary-400" : "text-gray-600"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step.id <= currentStep
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
                      : "bg-gray-800"
                  }`}
                >
                  {step.id < currentStep ? "✓" : step.id}
                </div>
                <span className="text-xs mt-2 hidden md:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass p-8 rounded-2xl border border-gray-800 mb-8">
              <h2 className="text-3xl font-bold mb-2 gradient-text">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-400 mb-6">{steps[currentStep - 1].description}</p>
              {renderStep()}
              {error && (
                <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-8 py-3 rounded-full font-medium transition-all ${
              currentStep === 1
                ? "opacity-0 pointer-events-none"
                : "glass text-white hover:bg-white/10"
            }`}
          >
            ← Back
          </button>
          <motion.button
            onClick={handleNext}
            disabled={!canContinue || isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-12 py-3 rounded-full font-bold text-white shadow-lg shadow-primary-500/30 transition-all ${
              canContinue && !isSubmitting
                ? "bg-gradient-to-r from-primary-500 to-secondary-500"
                : "cursor-not-allowed bg-gray-700 text-gray-400 shadow-none"
            }`}
          >
            {isSubmitting ? "Finding matches..." : currentStep === steps.length ? "Get Results ✨" : "Next →"}
          </motion.button>
        </div>
      </div>
    </main>
  );
}
