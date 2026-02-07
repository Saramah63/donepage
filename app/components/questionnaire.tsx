// app/components/questionnaire.tsx
"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

export type QuestionnaireAnswers = {
  businessName?: string;
  city?: string;
  country?: string;

  primaryOffer?: string;
  aboutText?: string;

  // trust quick stats
  ratingValue?: string; // e.g. "5.0"
  clientsCount?: string; // e.g. "100+"
  yearsExp?: string; // e.g. "10+"

  // contact
  contactEmail?: string;
  contactPhone?: string;
  bookingLink?: string;
  whatsApp?: string;

  // optional testimonial
  testimonialText?: string;
  testimonialName?: string;

  // core positioning
  serviceType:
    | "consulting"
    | "coaching"
    | "design"
    | "development"
    | "marketing"
    | "creative"
    | "legal"
    | "accounting";
  targetAudience:
    | "individuals"
    | "freelancers"
    | "small-business"
    | "medium-business"
    | "enterprise";
  businessStage: "starting" | "established" | "scaling";
  primaryGoal: "leads" | "calls" | "packages" | "credibility";
  experienceLevel: "new" | "intermediate" | "expert" | "veteran";
  pricingApproach: "budget" | "competitive" | "premium" | "custom";
  keyDifferentiator: "speed" | "quality" | "expertise" | "personal" | "results";
  trustFactor:
    | "certifications"
    | "experience"
    | "results"
    | "guarantee"
    | "portfolio";
  includeAbout: "yes" | "no";

  // ✅ Advanced (optional)
  // High-leverage messaging
  problemStatement?: string; // 1 line: "What problem do you solve?"
  outcomeStatement?: string; // 1 line: "What outcome do you deliver?"
  proofLine?: string; // 1 line: "Proof / credibility snippet"
  niche?: string; // optional: industry / niche

  // Process (3-step)
  processStep1?: string;
  processStep2?: string;
  processStep3?: string;

  // About image
  aboutImageUrl?: string; // optional: user-provided image URL

  // Optional: CTA labels (if you want customizable button text later)
  ctaPrimaryLabel?: string; // e.g. "Book a Call"
  ctaSecondaryLabel?: string; // e.g. "Email Us"

  // Optional: portfolio overrides
  portfolioItemsRaw?: string; // deprecated fallback
  portfolioItemsJson?: string; // JSON stringified items with optional images
};

type Option = {
  value: string;
  title: string;
  desc: string;
};

type Step = {
  key: keyof QuestionnaireAnswers;
  title: string;
  subtitle: string;
  options: Option[];
};

const BASE_STEPS: Step[] = [
  {
    key: "businessName",
    title: "What is your business name?",
    subtitle: "This will appear on your landing page and in Google",
    options: [],
  },
  {
    key: "country",
    title: "Which country are you based in?",
    subtitle: "Used for localized trust + SEO context",
    options: [
      { value: "Finland", title: "Finland", desc: "Suomi" },
      { value: "Sweden", title: "Sweden", desc: "Sverige" },
      { value: "Norway", title: "Norway", desc: "Norge" },
      { value: "Denmark", title: "Denmark", desc: "Danmark" },
      { value: "Germany", title: "Germany", desc: "Deutschland" },
      { value: "Netherlands", title: "Netherlands", desc: "Nederland" },
      { value: "UK", title: "United Kingdom", desc: "UK" },
      { value: "USA", title: "United States", desc: "USA" },
      { value: "Canada", title: "Canada", desc: "CA" },
      { value: "Australia", title: "Australia", desc: "AU" },
      { value: "Other", title: "Other", desc: "Select this if not listed" },
    ],
  },
  {
    key: "serviceType",
    title: "What type of service do you provide?",
    subtitle: "Select the category that best matches your business",
    options: [
      { value: "consulting", title: "Business Consulting", desc: "Strategy, operations, or management advice" },
      { value: "coaching", title: "Coaching & Training", desc: "Life coaching, career coaching, or skills training" },
      { value: "design", title: "Design Services", desc: "Graphic design, branding, or UX/UI design" },
      { value: "development", title: "Web/Software Development", desc: "Websites, apps, or custom software" },
      { value: "marketing", title: "Marketing & Advertising", desc: "Digital marketing, SEO, or social media management" },
      { value: "creative", title: "Creative Services", desc: "Photography, videography, or content creation" },
      { value: "legal", title: "Legal Services", desc: "Legal consulting or specialized legal services" },
      { value: "accounting", title: "Accounting & Finance", desc: "Bookkeeping, tax prep, or financial planning" },
    ],
  },
  {
    key: "targetAudience",
    title: "Who are your ideal clients?",
    subtitle: "Choose the audience you serve best",
    options: [
      { value: "individuals", title: "Individuals & Consumers", desc: "Personal clients with individual needs" },
      { value: "freelancers", title: "Freelancers & Solopreneurs", desc: "Self-employed professionals" },
      { value: "small-business", title: "Small Businesses", desc: "Local businesses and startups (1-50 employees)" },
      { value: "medium-business", title: "Growing Companies", desc: "Established businesses (50-250 employees)" },
      { value: "enterprise", title: "Enterprise & Corporations", desc: "Large organizations with complex needs" },
    ],
  },
  {
    key: "businessStage",
    title: "What stage is your business at?",
    subtitle: "This helps us position your expertise appropriately",
    options: [
      { value: "starting", title: "Just Starting Out", desc: "New to the market, building your first clients" },
      { value: "established", title: "Established & Growing", desc: "Steady client base, looking to expand" },
      { value: "scaling", title: "Scaling & Systemizing", desc: "Strong reputation, ready to scale operations" },
    ],
  },
  {
    key: "primaryGoal",
    title: "What's your main goal with this landing page?",
    subtitle: "We'll optimize your page for this outcome",
    options: [
      { value: "leads", title: "Generate Qualified Leads", desc: "Collect contact info from interested prospects" },
      { value: "calls", title: "Book Discovery Calls", desc: "Get prospects to schedule a consultation" },
      { value: "packages", title: "Sell Service Packages", desc: "Directly sell or showcase your offerings" },
      { value: "credibility", title: "Build Credibility & Trust", desc: "Establish authority and showcase expertise" },
    ],
  },
  {
    key: "experienceLevel",
    title: "How much experience do you have?",
    subtitle: "We'll highlight your background appropriately",
    options: [
      { value: "new", title: "Less than 2 years", desc: "Fresh perspective and modern approaches" },
      { value: "intermediate", title: "2-5 years", desc: "Proven track record with real results" },
      { value: "expert", title: "5-10 years", desc: "Deep expertise and industry knowledge" },
      { value: "veteran", title: "10+ years", desc: "Industry veteran with extensive experience" },
    ],
  },
  {
    key: "pricingApproach",
    title: "How do you position your pricing?",
    subtitle: "This affects how we communicate value",
    options: [
      { value: "budget", title: "Affordable & Accessible", desc: "Great value for budget-conscious clients" },
      { value: "competitive", title: "Competitive & Fair", desc: "Balanced pricing for quality service" },
      { value: "premium", title: "Premium & High-End", desc: "Top-tier service at premium rates" },
      { value: "custom", title: "Custom Quotes Only", desc: "Every project is uniquely priced" },
    ],
  },
  {
    key: "keyDifferentiator",
    title: "What makes you stand out?",
    subtitle: "Choose your strongest competitive advantage",
    options: [
      { value: "speed", title: "Fast Turnaround", desc: "Quick delivery without compromising quality" },
      { value: "quality", title: "Exceptional Quality", desc: "Meticulous attention to detail and excellence" },
      { value: "expertise", title: "Specialized Expertise", desc: "Deep knowledge in a specific niche" },
      { value: "personal", title: "Personalized Service", desc: "Tailored approach for each client" },
      { value: "results", title: "Proven Results", desc: "Track record of measurable success" },
    ],
  },
  {
    key: "trustFactor",
    title: "What builds trust with your clients?",
    subtitle: "Select your strongest credibility indicator",
    options: [
      { value: "certifications", title: "Certifications & Credentials", desc: "Professional certifications and licenses" },
      { value: "experience", title: "Years of Experience", desc: "Extensive time in the industry" },
      { value: "results", title: "Client Results & ROI", desc: "Proven outcomes and success stories" },
      { value: "guarantee", title: "Satisfaction Guarantee", desc: "Risk-free promise or money-back guarantee" },
      { value: "portfolio", title: "Portfolio & Past Work", desc: "Showcase of completed projects" },
    ],
  },
  {
    key: "includeAbout",
    title: `Do you want to add an "About" section?`,
    subtitle: "Tell your story and connect with potential clients",
    options: [
      { value: "yes", title: "Yes, Add About Section", desc: "Share your background and mission" },
      { value: "no", title: "No, Skip About Section", desc: "Keep the page focused on services only" },
    ],
  },
  {
    key: "aboutText",
    title: "Write a short About section (optional)",
    subtitle: "A few sentences about who you are and how you help",
    options: [],
  },
  {
    key: "aboutImageUrl",
    title: "Add an About image (optional)",
    subtitle: "Upload a photo/video or paste a direct URL. Leave empty to skip.",
    options: [],
  },
  {
    key: "contactEmail",
    title: "Contact email",
    subtitle: "Shown in the Contact section + used for mailto link",
    options: [],
  },
  {
    key: "whatsApp",
    title: "WhatsApp number (optional)",
    subtitle: "Use international format, e.g. +358401234567",
    options: [],
  },
  {
    key: "bookingLink",
    title: "Booking link (optional)",
    subtitle: "Calendly / TidyCal / Google Calendar booking URL",
    options: [],
  },
];

const ADVANCED_STEPS: Step[] = [
  {
    key: "problemStatement",
    title: "What problem do you solve?",
    subtitle: "One sentence. Be specific about the pain you remove.",
    options: [],
  },
  {
    key: "outcomeStatement",
    title: "What outcome do you deliver?",
    subtitle: "One sentence. Describe the end-result clients actually want.",
    options: [],
  },
  {
    key: "proofLine",
    title: "Add one credibility / proof line",
    subtitle: 'Example: "4.9/5 rating • 120+ clients • ICF-trained" (one line)',
    options: [],
  },
  {
    key: "niche",
    title: "Your niche / industry (optional)",
    subtitle: 'Example: "SaaS founders", "Real estate", "Wellness coaches"',
    options: [],
  },
  {
    key: "processStep1",
    title: "Your process — Step 1",
    subtitle: 'Example: "Audit + clarify goals"',
    options: [],
  },
  {
    key: "processStep2",
    title: "Your process — Step 2",
    subtitle: 'Example: "Build plan + execute"',
    options: [],
  },
  {
    key: "processStep3",
    title: "Your process — Step 3",
    subtitle: 'Example: "Deliver + optimize"',
    options: [],
  },
  {
    key: "portfolioItemsRaw",
    title: "Portfolio highlights (optional)",
    subtitle: "One per line: Title | Description | Metric (e.g. 40% growth)",
    options: [],
  },
  {
    key: "portfolioItemsJson",
    title: "Portfolio items (optional)",
    subtitle: "Add real projects, metrics, and optional images/videos.",
    options: [],
  },
];

type Props = {
  initialAnswers?: Partial<QuestionnaireAnswers>;
  onChange?: (answers: QuestionnaireAnswers) => void;
  onGenerate?: (answers: QuestionnaireAnswers) => void;

  // backward compatibility
  onComplete?: (answers: QuestionnaireAnswers) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function Questionnaire({ initialAnswers, onChange, onGenerate, onComplete }: Props) {
  const [advanced, setAdvanced] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [portfolioItems, setPortfolioItems] = React.useState<
    { title: string; description: string; metric: string; imageUrl?: string }[]
  >([]);

  const STEPS = React.useMemo(() => {
    // Advanced = add steps, without touching base flow UX
    return advanced ? [...BASE_STEPS, ...ADVANCED_STEPS] : BASE_STEPS;
  }, [advanced]);

  const total = STEPS.length;

  const [stepIndex, setStepIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Partial<QuestionnaireAnswers>>(initialAnswers ?? {});

  // If user toggles Advanced OFF while on advanced steps, clamp index
  React.useEffect(() => {
    setStepIndex((s) => clamp(s, 0, total - 1));
  }, [total]);

  const step = STEPS[stepIndex];
  const currentValue = answers[step.key] as string | undefined;

  const progress = Math.round(((stepIndex + 1) / total) * 100);
  const isInputStep = step.options.length === 0;

  const canGoNext = isInputStep
    ? Boolean(
        (currentValue ?? "").toString().trim() ||
          step.key === "niche" ||
          step.key === "aboutImageUrl" ||
          step.key === "whatsApp" ||
          step.key === "bookingLink" ||
          step.key === "aboutText" ||
          step.key === "portfolioItemsRaw" ||
          step.key === "portfolioItemsJson"
      )
    : Boolean(currentValue);

  const update = (patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => {
      const next = { ...prev, ...patch };
      onChange?.(next as QuestionnaireAnswers);
      return next;
    });
  };

  const setValue = (value: string) => {
    update({ [step.key]: value as any });
  };

  const goBack = () => {
    setStepIndex((s) => Math.max(0, s - 1));
  };

  const goNext = async () => {
    if (!canGoNext) return;

    if (stepIndex < total - 1) {
      setStepIndex((s) => Math.min(total - 1, s + 1));
      return;
    }

    const final = answers as QuestionnaireAnswers;
    onGenerate?.(final);
    onComplete?.(final);
  };

  const uploadMedia = async (file: File) => {
    if (!file) return;
    setUploadError(null);

    const allowed = file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!allowed) {
      setUploadError("Please upload an image or video file.");
      return;
    }

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError("File is too large. Please upload under 25MB.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");

      return data.url as string;
    } catch (e: any) {
      setUploadError(e?.message ?? "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const syncPortfolioJson = (
    next: { title: string; description: string; metric: string; imageUrl?: string }[]
  ) => {
    setPortfolioItems(next);
    try {
      const clean = next.filter((i) => i.title || i.description || i.metric || i.imageUrl);
      setValue(JSON.stringify(clean));
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    if (step.key !== "portfolioItemsJson") return;
    const raw = (answers.portfolioItemsJson as string) || "";
    if (!raw) {
      if (portfolioItems.length === 0) return;
      setPortfolioItems([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setPortfolioItems(
          parsed.map((p) => ({
            title: String(p.title ?? ""),
            description: String(p.description ?? ""),
            metric: String(p.metric ?? ""),
            imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
          }))
        );
      }
    } catch {
      // ignore parse errors
    }
  }, [step.key, answers.portfolioItemsJson]);

  const headerQuestionCount = advanced ? "Answer quick questions to get your personalized landing page" : "Answer 9 quick questions to get your personalized landing page";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40">
      <div
        className="pointer-events-none absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45),rgba(255,255,255,0.85))]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col px-4 pb-14 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            <span className="text-sm font-semibold text-gray-900">Landing Page Generator</span>
          </div>

          <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {headerQuestionCount}
          </h1>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div className="font-medium">
              Question {stepIndex + 1} of {total}
            </div>
            <div className="font-semibold text-gray-700">{progress}%</div>
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-white/80 ring-1 ring-gray-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="mx-auto mt-8 w-full max-w-3xl border border-gray-200 bg-white/85 shadow-xl shadow-blue-500/5 backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8">
            {/* ✅ Advanced Toggle (minimal, no redesign) */}
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/70 px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">Advanced mode</div>
                <div className="text-xs text-gray-600">
                  Turn on for better copy (problem, outcome, proof, process).
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className={[
                  "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border transition-colors",
                  advanced ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-gray-200",
                ].join(" ")}
                aria-pressed={advanced}
                aria-label="Toggle advanced mode"
              >
                <span
                  className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                    advanced ? "translate-x-6" : "translate-x-1",
                  ].join(" ")}
                />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                {step.title}
              </div>
              <div className="text-sm text-gray-600 sm:text-base">{step.subtitle}</div>
            </div>

            {/* INPUT STEP */}
            {isInputStep ? (
              <div className="mt-6 space-y-3">
                {step.key === "aboutText" ? (
                  <textarea
                    placeholder="Write a short About section..."
                    value={(answers.aboutText as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : step.key === "aboutImageUrl" ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-4">
                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Upload a photo or short video
                          </div>
                          <div className="text-xs text-gray-600">
                            JPG/PNG/WebP or MP4/WebM. Max 25MB.
                          </div>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                uploadMedia(f).then((url) => {
                                  if (url) setValue(url);
                                });
                              }
                              e.currentTarget.value = "";
                            }}
                          />
                          {uploading ? "Uploading…" : "Upload File"}
                        </label>
                      </div>

                      {uploadError ? (
                        <div className="mt-3 text-xs text-red-600">{uploadError}</div>
                      ) : null}

                      {currentValue ? (
                        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                          {/\.(mp4|webm|mov)(\?.*)?$/i.test(String(currentValue)) ? (
                            <video
                              src={String(currentValue)}
                              className="h-40 w-full object-cover"
                              controls
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={String(currentValue)}
                              alt="Uploaded preview"
                              className="h-40 w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                          <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-3 py-2 text-xs text-gray-600">
                            <span className="truncate">{String(currentValue)}</span>
                            <button
                              type="button"
                              onClick={() => setValue("")}
                              className="text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <input
                      placeholder="Or paste a direct URL (optional)"
                      value={(currentValue as string) ?? ""}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                ) : step.key === "portfolioItemsRaw" ? (
                  <textarea
                    placeholder={`Brand Refresh | Repositioned SaaS branding | 200% recognition increase\nE-commerce UX | Conversion-focused redesign | 45% conversion increase\nMobile App UI | Fintech interface redesign | 4.8 star rating`}
                    value={(currentValue as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full min-h-[160px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : step.key === "portfolioItemsJson" ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                      Add up to 4 portfolio items. You can upload an image/video for each.
                    </div>

                    {portfolioItems.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600">
                        No items yet. Click “Add item” to start.
                      </div>
                    ) : null}

                    {portfolioItems.map((item, idx) => (
                      <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            placeholder="Title"
                            value={item.title}
                            onChange={(e) => {
                              const next = [...portfolioItems];
                              next[idx] = { ...next[idx], title: e.target.value };
                              syncPortfolioJson(next);
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                          />
                          <input
                            placeholder="Metric (e.g. 45% conversion increase)"
                            value={item.metric}
                            onChange={(e) => {
                              const next = [...portfolioItems];
                              next[idx] = { ...next[idx], metric: e.target.value };
                              syncPortfolioJson(next);
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                          />
                          <div className="flex items-center gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50">
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) {
                                    uploadMedia(f).then((url) => {
                                      if (!url) return;
                                      const next = [...portfolioItems];
                                      next[idx] = { ...next[idx], imageUrl: url };
                                      syncPortfolioJson(next);
                                    });
                                  }
                                  e.currentTarget.value = "";
                                }}
                              />
                              {uploading ? "Uploading…" : "Upload Media"}
                            </label>
                            {item.imageUrl ? (
                              <button
                                type="button"
                                className="text-xs text-red-600 hover:underline"
                                onClick={() => {
                                  const next = [...portfolioItems];
                                  next[idx] = { ...next[idx], imageUrl: "" };
                                  syncPortfolioJson(next);
                                }}
                              >
                                Remove
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <textarea
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => {
                            const next = [...portfolioItems];
                            next[idx] = { ...next[idx], description: e.target.value };
                            syncPortfolioJson(next);
                          }}
                          className="mt-3 w-full min-h-[90px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                        />

                        {item.imageUrl ? (
                          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            {/\.(mp4|webm|mov)(\?.*)?$/i.test(item.imageUrl) ? (
                              <video src={item.imageUrl} className="h-40 w-full object-cover" controls />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.imageUrl} className="h-40 w-full object-cover" alt="Portfolio media" />
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (portfolioItems.length >= 4) return;
                          const next = [
                            ...portfolioItems,
                            { title: "", description: "", metric: "", imageUrl: "" },
                          ];
                          syncPortfolioJson(next);
                        }}
                      >
                        Add item
                      </Button>
                      {portfolioItems.length > 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => syncPortfolioJson([])}
                        >
                          Clear all
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <input
                    placeholder={
                      step.key === "businessName"
                        ? "Business name"
                        : step.key === "city"
                          ? "City (optional)"
                          : step.key === "primaryOffer"
                            ? "Primary offer (e.g. 1:1 Coaching for Women)"
                            : step.key === "contactEmail"
                              ? "Contact email"
                              : step.key === "contactPhone"
                                ? "Phone (optional)"
                                : step.key === "bookingLink"
                                  ? "Booking link (Calendly / TidyCal / Google Calendar URL)"
                                  : step.key === "whatsApp"
                                    ? "WhatsApp number (e.g. +358401234567)"
                                    : step.key === "problemStatement"
                                      ? "Problem you solve (one sentence)"
                                      : step.key === "outcomeStatement"
                                        ? "Outcome you deliver (one sentence)"
                                        : step.key === "proofLine"
                                          ? "Proof line (one line)"
                                          : step.key === "niche"
                                            ? "Niche / industry (optional)"
                                            : step.key === "processStep1"
                                              ? "Step 1"
                                              : step.key === "processStep2"
                                                ? "Step 2"
                                                : step.key === "processStep3"
                                                  ? "Step 3"
                                                  : ""
                    }
                    value={(currentValue as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {step.options.map((opt) => {
                  const selected = currentValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue(opt.value)}
                      className={[
                        "group w-full rounded-2xl border p-4 text-left transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                        selected
                          ? "border-blue-300 bg-blue-50/70 shadow-sm"
                          : "border-gray-200 bg-white hover:-translate-y-[1px] hover:border-blue-200 hover:shadow-md",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all",
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 bg-white group-hover:border-blue-400",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          <span
                            className={[
                              "h-2.5 w-2.5 rounded-full transition-all",
                              selected ? "bg-white" : "bg-transparent",
                            ].join(" ")}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-base font-semibold text-gray-900">{opt.title}</div>
                            {selected ? (
                              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700">
                                Selected
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-gray-600">{opt.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="h-11 rounded-xl border-gray-300 bg-white px-5 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </Button>

              <Button
                onClick={goNext}
                disabled={!canGoNext}
                className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50"
              >
                {stepIndex === total - 1 ? "Generate Page" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
