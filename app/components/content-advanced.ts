// app/components/content-advanced.ts
import type { QuestionnaireAnswers } from "./questionnaire";
import { generateContent as generateBaseContent, defaultPricing } from "./content";

type PlanKey = "starter" | "business" | "pro";
type BaseContent = ReturnType<typeof generateBaseContent>;
type ContactLink = { href?: string; disabledText?: string };
type AdvancedContent = BaseContent & {
  contact: BaseContent["contact"] & {
    call: BaseContent["contact"]["call"] & ContactLink;
    email: BaseContent["contact"]["email"] & ContactLink;
    chat: BaseContent["contact"]["chat"] & ContactLink;
  };
  steps: ReturnType<typeof buildSteps>;
};

function safeTrim(v?: string) {
  return (v ?? "").trim();
}

function normalizeUrl(url?: string) {
  const v = safeTrim(url);
  if (!v) return "";
  // allow mailto/tel too
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

function normalizePhoneDigits(v?: string) {
  return safeTrim(v).replace(/[^\d+]/g, "");
}

function buildWhatsAppHref(answers: QuestionnaireAnswers) {
  // Prefer answers.whatsApp, fallback to contactPhone
  const raw = safeTrim(answers.whatsApp) || safeTrim(answers.contactPhone);
  const digits = normalizePhoneDigits(raw);
  if (!digits) return "";
  // wa.me expects country code, user responsibility
  return `https://wa.me/${digits.replace(/^\+/, "")}`;
}

function buildEmailHref(answers: QuestionnaireAnswers) {
  const email = safeTrim(answers.contactEmail);
  if (!email) return "";
  return `mailto:${email}`;
}

function buildBookingHref(answers: QuestionnaireAnswers) {
  return normalizeUrl(answers.bookingLink);
}

function painPoint(answers: QuestionnaireAnswers) {
  if (answers.primaryGoal === "credibility") {
    return "Most prospects don’t doubt your skills — they doubt clarity. We remove ambiguity and build trust fast.";
  }
  if (answers.businessStage === "starting") {
    return "If your offer feels unclear, prospects hesitate. We clarify your message and turn attention into action.";
  }
  if (answers.businessStage === "established") {
    return "If growth has stalled, it’s usually positioning + funnel friction. We fix both — with a clean execution plan.";
  }
  return "When acquisition is manual, scale slows down. We systemize demand and reduce decision friction.";
}

function proofLine(answers: QuestionnaireAnswers) {
  const exp =
    answers.experienceLevel === "veteran"
      ? "10+ years"
      : answers.experienceLevel === "expert"
      ? "7+ years"
      : answers.experienceLevel === "intermediate"
      ? "3+ years"
      : "Modern approach";
  const trust =
    answers.trustFactor === "results"
      ? "measurable outcomes"
      : answers.trustFactor === "portfolio"
      ? "verifiable work"
      : answers.trustFactor === "certifications"
      ? "credible standards"
      : answers.trustFactor === "guarantee"
      ? "risk-reduction"
      : "reliable delivery";
  return `${exp} • Built on ${trust} • Fast response time`;
}

function ctaRefinement(answers: QuestionnaireAnswers) {
  // smarter CTA variant without changing layout
  if (answers.primaryGoal === "calls") {
    return {
      headline: "Let’s Align on the Fastest Path to Results",
      subheadline:
        answers.experienceLevel === "new"
          ? "Short call, clear plan, zero pressure. We’ll map your next steps and remove guesswork."
          : "Short call, clear plan, high signal. We’ll identify leverage points and confirm the best next move.",
    };
  }
  if (answers.primaryGoal === "packages") {
    return {
      headline: "Choose a Package That Matches Your Goal",
      subheadline:
        answers.pricingApproach === "custom"
          ? "Tell us what you need — we’ll scope it cleanly and price it transparently."
          : "Pick the plan, move forward fast, and keep execution predictable.",
    };
  }
  if (answers.primaryGoal === "leads") {
    return {
      headline: "Get a Clear Plan — Before You Spend More Time or Money",
      subheadline:
        "We’ll review your situation and give you the best next step. If it’s not a fit, we’ll tell you upfront.",
    };
  }
  return {
    headline: "Build Trust. Remove Friction. Convert Better.",
    subheadline: "Clean message, clear proof, and a CTA that moves the right people.",
  };
}

function buildSteps(answers: QuestionnaireAnswers) {
  // numbered steps for “How it works” section — content only
  const goal =
    answers.primaryGoal === "calls"
      ? "book calls"
      : answers.primaryGoal === "packages"
      ? "sell packages"
      : answers.primaryGoal === "credibility"
      ? "build trust"
      : "capture leads";

  return {
    title: "How It Works",
    subtitle: "A simple, predictable process — designed to ship fast and convert cleanly.",
    steps: [
      {
        no: 1,
        title: "Share the essentials",
        desc: "Answer the questions (offer, audience, positioning). We use it to generate a high-converting structure.",
      },
      {
        no: 2,
        title: "Review and personalize",
        desc:
          'Edit your “About”, links (email/WhatsApp/booking), and credibility signals. Keep it minimal or go deep.',
      },
      {
        no: 3,
        title: `Publish and ${goal}`,
        desc:
          "Publish with your preferred slug. Your page goes live and stays SEO-ready, mobile-first, and shareable.",
      },
    ],
  };
}

function applyAnswerOverrides(base: ReturnType<typeof generateBaseContent>, answers: QuestionnaireAnswers) {
  // About override already handled in your UI using answers.aboutText,
  // but we also make base.about.story consistent for export/publish.
  if (base.about && safeTrim(answers.aboutText)) {
    base.about.story = safeTrim(answers.aboutText);
  }
  // Business name override if provided
  if (safeTrim(answers.businessName)) {
    base.meta.businessName = safeTrim(answers.businessName);
  }
  return base;
}

function parsePortfolioRaw(raw?: string) {
  const lines = (raw ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = lines
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      const [title, description, metric] = parts;
      if (!title || !description || !metric) return null;
      return { title, description, metric };
    })
    .filter(Boolean) as { title: string; description: string; metric: string }[];

  return items;
}

function parsePortfolioJson(raw?: string) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p) => ({
        title: String(p.title ?? "").trim(),
        description: String(p.description ?? "").trim(),
        metric: String(p.metric ?? "").trim(),
        imageUrl: p.imageUrl ? String(p.imageUrl).trim() : undefined,
      }))
      .filter((p) => p.title && p.description && p.metric);
  } catch {
    return [];
  }
}

/**
 * Advanced content generator:
 * - keeps the same shape as generateBaseContent (content.ts)
 * - injects smarter copy and adds steps + contact hrefs (wiring only)
 */
export function generateContentAdvanced(answers: QuestionnaireAnswers) {
  const base = applyAnswerOverrides(generateBaseContent(answers), answers);

  // Upgrade hero/subheadline with pain point + proof line (still short)
  base.meta.subheadline = `${painPoint(answers)} ${proofLine(answers)}`;

  // CTA refinement (same fields, no UI change)
  const refined = ctaRefinement(answers);
  base.cta.headline = refined.headline;
  base.cta.subheadline = refined.subheadline;

  // Contact: wire actual editable destinations (fallbacks are empty)
  const bookingHref = buildBookingHref(answers);
  const emailHref = buildEmailHref(answers);
  const waHref = buildWhatsAppHref(answers);

  base.contact = {
    ...base.contact,
    call: {
      ...base.contact.call,
      href: bookingHref,
      disabledText: "Booking link not set",
    },
    email: {
      ...base.contact.email,
      href: emailHref,
      disabledText: "Email not set",
    },
    chat: {
      ...base.contact.chat,
      href: waHref,
      disabledText: "WhatsApp not set",
    },
  } as any;

  // Pricing: keep your default (no UI change)
  base.pricing = base.pricing ?? defaultPricing();

  // Portfolio overrides (optional)
  const customPortfolioJson = parsePortfolioJson(answers.portfolioItemsJson);
  const customPortfolioRaw = parsePortfolioRaw(answers.portfolioItemsRaw);
  const customPortfolio = customPortfolioJson.length > 0 ? customPortfolioJson : customPortfolioRaw;
  if (customPortfolio.length > 0) {
    base.portfolio.items = customPortfolio as any;
  }

  // Steps (optional section; add now so you can render later without changing generator again)
  const steps = buildSteps(answers);

  const result: AdvancedContent = {
    ...base,
    steps,
  };

  return result;
}
