"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";

export type QuestionnaireAnswers = {
  clientName?: string;
  businessName?: string;
  contactEmail?: string;
  primaryOffer?: string;
  targetAudience?: string;
  outcomeStatement?: string;
  problemStatement?: string;
  trustFactor?: string;
  desiredAction?: "book_call" | "send_message" | "buy" | "apply";
  tone?: "premium" | "friendly" | "direct" | "bold";

  language?: string;
  city?: string;
  country?: string;
  countryOther?: string;
  languageOther?: string;
  aboutText?: string;
  ratingValue?: string;
  clientsCount?: string;
  yearsExp?: string;
  contactPhone?: string;
  bookingLink?: string;
  whatsApp?: string;
  testimonialText?: string;
  testimonialName?: string;
  serviceType?:
    | "consulting"
    | "coaching"
    | "design"
    | "development"
    | "marketing"
    | "creative"
    | "legal"
    | "accounting"
    | "other";
  serviceTypeOther?: string;
  targetAudienceType?:
    | "individuals"
    | "freelancers"
    | "small-business"
    | "medium-business"
    | "enterprise";
  businessStage?: "starting" | "established" | "scaling";
  primaryGoal?: "leads" | "calls" | "packages" | "credibility";
  primaryGoals?: Array<"leads" | "calls" | "packages" | "credibility">;
  experienceLevel?: "new" | "intermediate" | "expert" | "veteran";
  pricingApproach?: "budget" | "competitive" | "premium" | "custom";
  keyDifferentiator?: "speed" | "quality" | "expertise" | "personal" | "results";
  trustFactors?: Array<"certifications" | "experience" | "results" | "guarantee" | "portfolio">;
  trustFactorNotesJson?: string;
  includeAbout?: "yes" | "no";
  customServices?: string;
  proofLine?: string;
  niche?: string;
  processStep1?: string;
  processStep2?: string;
  processStep3?: string;
  aboutImageUrl?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  portfolioItemsRaw?: string;
  portfolioItemsJson?: string;
};

type Props = {
  initialAnswers?: Partial<QuestionnaireAnswers>;
  onChange?: (answers: QuestionnaireAnswers) => void;
  onGenerate?: (answers: QuestionnaireAnswers) => void | Promise<void>;
  onComplete?: (answers: QuestionnaireAnswers) => void;
  submitting?: boolean;
};

type Question = {
  key: keyof QuestionnaireAnswers;
  title: string;
  hint: string;
  placeholder?: string;
  kind?: "textarea" | "radio";
  options?: Array<{ value: string; label: string }>;
};

const STORAGE_KEY = "donepage-questionnaire-v2";

const questions: Question[] = [
  {
    key: "primaryOffer",
    title: "What do you offer?",
    hint: "Describe your main service in one clear sentence.",
    placeholder: "Example: I help coaches turn their offer into a page that gets qualified leads.",
    kind: "textarea",
  },
  {
    key: "targetAudience",
    title: "Who is this for?",
    hint: "Be specific.",
    placeholder: "Example: coaches starting their business",
    kind: "textarea",
  },
  {
    key: "outcomeStatement",
    title: "What result do your clients get?",
    hint: "What changes after working with you?",
    placeholder: "Example: They get a clearer offer and more booked discovery calls.",
    kind: "textarea",
  },
  {
    key: "problemStatement",
    title: "What problem are they struggling with?",
    hint: "What frustrates them right now?",
    placeholder: "Example: Their message is unclear and visitors leave without taking action.",
    kind: "textarea",
  },
  {
    key: "trustFactor",
    title: "Why should someone trust you?",
    hint: "Experience, results, or unique approach",
    placeholder: "Example: A clear method, proven results, or years of experience in this niche.",
    kind: "textarea",
  },
  {
    key: "desiredAction",
    title: "What should people do?",
    hint: "",
    kind: "radio",
    options: [
      { value: "book_call", label: "Book a call" },
      { value: "send_message", label: "Send a message" },
      { value: "buy", label: "Buy" },
      { value: "apply", label: "Apply" },
    ],
  },
  {
    key: "tone",
    title: "Choose your tone",
    hint: "",
    kind: "radio",
    options: [
      { value: "premium", label: "Premium" },
      { value: "friendly", label: "Friendly" },
      { value: "direct", label: "Direct" },
      { value: "bold", label: "Bold" },
    ],
  },
];

function textValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function Questionnaire({
  initialAnswers,
  onChange,
  onGenerate,
  onComplete,
  submitting = false,
}: Props) {
  const [answers, setAnswers] = React.useState<QuestionnaireAnswers>(() => ({
    language: "English",
    ...initialAnswers,
  }));
  const [step, setStep] = React.useState(0);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as QuestionnaireAnswers;
      setAnswers((prev) => ({ ...parsed, ...prev }));
    } catch {}
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {}
    onChange?.(answers);
  }, [answers, onChange]);

  const current = questions[step];
  const isLast = step === questions.length - 1;

  function update(patch: Partial<QuestionnaireAnswers>) {
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  function validateCurrent() {
    if (!current) return true;
    const value = answers[current.key];
    if (current.kind === "radio") return Boolean(value);
    return textValue(value).trim().length > 0;
  }

  async function handleNext() {
    if (!validateCurrent()) return;
    if (isLast) {
      await onGenerate?.(answers);
      onComplete?.(answers);
      return;
    }
    setStep((prev) => Math.min(prev + 1, questions.length - 1));
  }

  function revealClass(base: string) {
    return `${base} ${hydrated ? "is-visible" : ""}`.trim();
  }

  if (submitting) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-[760px] text-white">
          <section
            className={revealClass(
              "reveal-up rounded-[32px] border border-[#222222] bg-[#0F0F0F] px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-12"
            )}
          >
            <h1
              className="text-4xl tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Creating your page...
            </h1>
            <div className="mx-auto mt-8 h-1.5 max-w-md overflow-hidden rounded-full bg-white/8">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-white" />
            </div>
            <div className="mt-8 space-y-3 text-base leading-7 text-[#CFCFCF]">
              <p>Structuring your content</p>
              <p>Refining your message</p>
              <p>Generating your layout</p>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[760px] text-white">
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-sm text-[#9f9f9f]">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <section
          className={revealClass(
            "reveal-up rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-8"
          )}
        >
          <h2
            className="text-3xl tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            {current.title}
          </h2>
          {current.hint ? (
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/68">{current.hint}</p>
          ) : null}

          {current.kind === "radio" ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {current.options?.map((option) => {
                const selected = answers[current.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update({ [current.key]: option.value } as Partial<QuestionnaireAnswers>)}
                    className={`rounded-[20px] border px-5 py-5 text-left transition duration-300 ${
                      selected
                        ? "border-white bg-white text-black shadow-[0_0_26px_rgba(255,255,255,0.12)]"
                        : "border-white/10 bg-[#111111] text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-base font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={textValue(answers[current.key])}
              onChange={(event) =>
                update({ [current.key]: event.target.value } as Partial<QuestionnaireAnswers>)
              }
              placeholder={current.placeholder}
              className="mt-6 min-h-[180px] w-full rounded-[22px] border border-white/10 bg-[#111111] px-5 py-4 text-base leading-7 text-white outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-in-out placeholder:text-white/35 focus:border-white/25 focus:bg-[#141414] focus:ring-0"
            />
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
              disabled={step === 0}
              className="h-11 rounded-full border-white/12 bg-transparent px-6 text-white hover:bg-white/[0.05]"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="h-11 rounded-full bg-white px-6 font-semibold text-black shadow-[0_0_28px_rgba(255,255,255,0.14)] hover:bg-white"
            >
              {isLast ? "Generate My Page" : "Next →"}
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
