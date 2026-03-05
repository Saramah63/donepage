import type { DraftBenefit, DraftContent, DraftFaqItem } from "@/app/lib/draft-content";

export type DraftSection = "hero" | "benefits" | "cta" | "contact" | "faq";
export type SmartPublishStatus = "pass" | "warning" | "blocking";
export type SmartPublishIssue = {
  type: "headline" | "cta" | "benefits" | "contact" | "faq" | "general";
  message: string;
  suggestion?: string;
};

export function sanitizeText(value: unknown, max = 240) {
  if (typeof value !== "string") return "";
  const stripped = value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return stripped.slice(0, max);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidUrlOrMailtoTel(value: string) {
  if (!value) return false;
  if (value.startsWith("mailto:") || value.startsWith("tel:")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidHttpsUrl(value: string) {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function sanitizeBenefit(item: any): DraftBenefit {
  return {
    title: sanitizeText(item?.title, 60),
    description: sanitizeText(item?.description, 140),
  };
}

export function sanitizeFaq(item: any): DraftFaqItem {
  return {
    question: sanitizeText(item?.question, 120),
    answer: sanitizeText(item?.answer, 300),
  };
}

export function validateDraftForPublish(draft: DraftContent | null | undefined) {
  const errors: string[] = [];
  const heroHeadline = draft?.hero?.headline?.trim() || "";
  const heroCtaLink = draft?.hero?.ctaLink?.trim() || "";
  const ctaButtonLink = draft?.cta?.buttonLink?.trim() || "";
  const primaryCtaLink = heroCtaLink || ctaButtonLink;
  const benefits = draft?.benefits || [];
  const contactEmail = draft?.contact?.email?.trim() || "";
  const contactLink =
    draft?.contact?.bookingLink?.trim() ||
    draft?.contact?.whatsapp?.trim() ||
    draft?.contact?.telegram?.trim() ||
    draft?.contact?.instagram?.trim() ||
    "";

  if (!heroHeadline) errors.push("Headline is required.");
  if (!primaryCtaLink || !isValidUrlOrMailtoTel(primaryCtaLink)) {
    errors.push("CTA link must be a valid URL, mailto, or tel link.");
  }
  if (!benefits || benefits.length < 3) {
    errors.push("At least 3 benefits are required.");
  }
  if (!contactEmail && !contactLink) {
    errors.push("Add a contact email or at least one contact link.");
  }

  return { ok: errors.length === 0, errors };
}

function hasPlaceholder(text: string) {
  const t = (text || "").toLowerCase();
  return (
    t.includes("lorem") ||
    t.includes("placeholder") ||
    t.includes("your headline") ||
    t.includes("headline") ||
    t.includes("subheadline")
  );
}

function hasRepeatedChars(value: string) {
  return /([a-zA-Z])\1{3,}/.test(value);
}

export function smartPublishCheck(draft: DraftContent | null | undefined): {
  status: SmartPublishStatus;
  issues: SmartPublishIssue[];
} {
  const issues: SmartPublishIssue[] = [];

  const headline = (draft?.hero?.headline || "").trim();
  if (!headline) {
    issues.push({
      type: "headline",
      message: "Headline is missing.",
      suggestion: "Professional solutions for small businesses",
    });
  } else {
    if (headline.length < 20) {
      issues.push({
        type: "headline",
        message: "Headline is very short.",
        suggestion: "Professional solutions for small businesses",
      });
    } else if (headline.length > 80) {
      issues.push({
        type: "headline",
        message: "Headline is too long.",
        suggestion: headline.slice(0, 80),
      });
    }
    if (hasRepeatedChars(headline)) {
      issues.push({
        type: "headline",
        message: "Headline has repeated characters.",
        suggestion: "Remove repeated letters to improve clarity.",
      });
    }
    if (hasPlaceholder(headline)) {
      issues.push({
        type: "headline",
        message: "Headline contains placeholder text.",
        suggestion: "Use a clear promise about your offer.",
      });
    }
  }

  const ctaText = (draft?.hero?.ctaText || draft?.cta?.buttonText || "").trim();
  const ctaLink = (draft?.hero?.ctaLink || draft?.cta?.buttonLink || "").trim();
  if (!ctaText) {
    issues.push({ type: "cta", message: "CTA text is missing." });
  } else if (ctaText.length > 40) {
    issues.push({
      type: "cta",
      message: "CTA text is too long.",
      suggestion: ctaText.slice(0, 40),
    });
  }
  if (!ctaLink || !isValidUrlOrMailtoTel(ctaLink)) {
    issues.push({
      type: "cta",
      message: "CTA link must be a valid URL, mailto, or tel link.",
    });
  }

  const benefits = draft?.benefits || [];
  if (benefits.length < 3 || benefits.length > 6) {
    issues.push({
      type: "benefits",
      message: "Benefits must be between 3 and 6 items.",
    });
  }
  benefits.forEach((b) => {
    if ((b.description || "").length > 140) {
      issues.push({
        type: "benefits",
        message: "A benefit description is too long (max 140 chars).",
      });
    }
  });

  const contactEmail = (draft?.contact?.email || "").trim();
  const contactPhone = (draft?.contact?.phone || "").trim();
  const bookingLink = (draft?.contact?.bookingLink || "").trim();
  if (!contactEmail && !contactPhone && !bookingLink) {
    issues.push({
      type: "contact",
      message: "Add at least one contact option (email, phone, or booking link).",
    });
  }

  const faq = draft?.faq || [];
  if (faq.length > 0 && faq.length < 2) {
    issues.push({
      type: "faq",
      message: "FAQ needs at least 2 items if included.",
    });
  }

  const blocking = issues.some((i) =>
    ["headline", "cta", "benefits", "contact"].includes(i.type)
  );
  const status: SmartPublishStatus = blocking
    ? "blocking"
    : issues.length > 0
    ? "warning"
    : "pass";

  return { status, issues };
}
