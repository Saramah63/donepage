import type { DraftContent } from "@/app/lib/draft-content";
import type { ProjectRecord, RevisionRequest } from "@/app/lib/project-store";

const MAX = {
  headline: 80,
  subheadline: 200,
  cta: 40,
  benefit: 140,
  faqQ: 120,
  faqA: 300,
};

function clamp(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function extractQuoted(message: string) {
  const match = message.match(/"([^"]{3,})"/);
  return match ? match[1].trim() : "";
}

function extractAfterLabel(message: string, label: string) {
  const idx = message.toLowerCase().indexOf(label);
  if (idx < 0) return "";
  return message.slice(idx + label.length).trim();
}

function safeText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function buildHeadline(answers: Record<string, unknown>) {
  const offer = (answers.mainOffer || answers.offer || "").toString().trim();
  const audience = (answers.targetAudience || answers.audience || "").toString().trim();
  if (offer && audience) return `${offer} for ${audience}`;
  if (offer) return offer;
  return "Professional solutions for growing businesses";
}

function buildSubheadline(answers: Record<string, unknown>) {
  const goal = (answers.websiteGoal || "").toString().trim();
  if (goal) return `A clear, conversion-focused page tailored for ${goal}.`;
  return "A clear, conversion-focused page built to turn visitors into leads.";
}

function buildCta(answers: Record<string, unknown>) {
  const desired = (answers.desiredCTA || "").toString().trim();
  if (!desired) return "Get started";
  if (desired.length <= MAX.cta) return desired;
  return clamp(desired, MAX.cta);
}

export type SuggestionDraft = {
  section: string;
  field: string;
  originalValue?: string | null;
  suggestedValue: string;
  reason: string;
};

export function generateRevisionSuggestion(input: {
  project: ProjectRecord;
  revision: RevisionRequest;
}): SuggestionDraft | null {
  const { project, revision } = input;
  const message = revision.message.trim();
  if (!message) return null;

  const draft = (project.draftContent || {}) as DraftContent;
  const answers = project.answers || {};
  const quoted = extractQuoted(message);
  const lower = message.toLowerCase();
  const section = (revision.section || "").toLowerCase();

  const sectionHint = section ||
    (lower.includes("hero") || lower.includes("headline") || lower.includes("title") ? "hero" :
    lower.includes("cta") || lower.includes("button") ? "cta" :
    lower.includes("benefit") ? "benefits" :
    lower.includes("faq") ? "faq" :
    lower.includes("contact") ? "contact" : "hero");

  if (sectionHint === "hero") {
    const suggested = quoted || extractAfterLabel(message, "headline:") || buildHeadline(answers);
    const original = draft.hero?.headline || "";
    return {
      section: "hero",
      field: "headline",
      originalValue: original,
      suggestedValue: clamp(safeText(suggested), MAX.headline),
      reason: `Client request: ${message}`,
    };
  }

  if (sectionHint === "cta") {
    const suggested = quoted || extractAfterLabel(message, "cta:") || buildCta(answers);
    const original = draft.hero?.ctaText || draft.cta?.buttonText || "";
    return {
      section: "hero",
      field: "ctaText",
      originalValue: original,
      suggestedValue: clamp(safeText(suggested), MAX.cta),
      reason: `Client request: ${message}`,
    };
  }

  if (sectionHint === "benefits") {
    const suggested = quoted || safeText(message);
    const original = draft.benefits?.[0]?.description || "";
    return {
      section: "benefits",
      field: "benefits[0].description",
      originalValue: original,
      suggestedValue: clamp(suggested || original || "Clarify the main benefit for visitors.", MAX.benefit),
      reason: `Client request: ${message}`,
    };
  }

  if (sectionHint === "faq") {
    const suggested = quoted || "What happens after I submit?";
    const original = draft.faq?.[0]?.question || "";
    return {
      section: "faq",
      field: "faq[0].question",
      originalValue: original,
      suggestedValue: clamp(suggested, MAX.faqQ),
      reason: `Client request: ${message}`,
    };
  }

  if (sectionHint === "contact") {
    const contactEmail =
      (draft.contact?.email || "") ||
      (answers.contactEmail || "").toString().trim();
    const original = draft.contact?.email || "";
    if (contactEmail) {
      return {
        section: "contact",
        field: "email",
        originalValue: original,
        suggestedValue: contactEmail,
        reason: `Client request: ${message}`,
      };
    }
    return {
      section: "contact",
      field: "email",
      originalValue: original,
      suggestedValue: "",
      reason: `Client request: ${message}`,
    };
  }

  const fallbackHeadline = buildHeadline(answers);
  return {
    section: "hero",
    field: "headline",
    originalValue: draft.hero?.headline || "",
    suggestedValue: clamp(fallbackHeadline, MAX.headline),
    reason: `Client request: ${message}`,
  };
}

type AiSuggestionPayload = {
  section: string;
  field: string;
  suggestedValue: string;
  reason?: string;
};

function normalizeSuggestion(
  payload: AiSuggestionPayload,
  fallback: SuggestionDraft
): SuggestionDraft {
  const section = payload.section;
  const field = payload.field;
  const suggested = safeText(payload.suggestedValue || "");
  if (!section || !field || !suggested) return fallback;

  if (section === "hero" && (field === "headline" || field === "subheadline" || field === "ctaText" || field === "ctaLink")) {
    return {
      ...fallback,
      section,
      field,
      suggestedValue: clamp(
        suggested,
        field === "headline" ? MAX.headline : field === "subheadline" ? MAX.subheadline : MAX.cta
      ),
      reason: payload.reason || fallback.reason,
    };
  }

  if (section === "cta" && (field === "title" || field === "buttonText" || field === "buttonLink")) {
    return {
      ...fallback,
      section,
      field,
      suggestedValue: clamp(
        suggested,
        field === "title" ? 100 : MAX.cta
      ),
      reason: payload.reason || fallback.reason,
    };
  }

  if (section === "contact" && ["email", "phone", "whatsapp", "telegram", "instagram", "bookingLink"].includes(field)) {
    return {
      ...fallback,
      section,
      field,
      suggestedValue: clamp(suggested, 160),
      reason: payload.reason || fallback.reason,
    };
  }

  if (section === "benefits") {
    const match = field.match(/benefits\[(\d+)\]\.(title|description)/);
    if (match) {
      return {
        ...fallback,
        section,
        field,
        suggestedValue: clamp(
          suggested,
          match[2] === "title" ? 60 : MAX.benefit
        ),
        reason: payload.reason || fallback.reason,
      };
    }
  }

  if (section === "faq") {
    const match = field.match(/faq\[(\d+)\]\.(question|answer)/);
    if (match) {
      return {
        ...fallback,
        section,
        field,
        suggestedValue: clamp(
          suggested,
          match[2] === "question" ? MAX.faqQ : MAX.faqA
        ),
        reason: payload.reason || fallback.reason,
      };
    }
  }

  return fallback;
}

export async function generateRevisionSuggestionAI(input: {
  project: ProjectRecord;
  revision: RevisionRequest;
}): Promise<SuggestionDraft | null> {
  const fallback = generateRevisionSuggestion(input);
  if (!fallback) return null;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallback;

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const draft = (input.project.draftContent || {}) as DraftContent;
  const answers = input.project.answers || {};

  const prompt = [
    "You are an assistant helping refine landing page copy.",
    "Return ONLY a JSON object.",
    "Do NOT invent contact info, pricing, testimonials, or claims.",
    "Only suggest edits to editable text fields.",
    "",
    "Editable sections and fields:",
    "- hero: headline, subheadline, ctaText, ctaLink",
    "- benefits: benefits[i].title, benefits[i].description",
    "- cta: title, buttonText, buttonLink",
    "- faq: faq[i].question, faq[i].answer",
    "- contact: email, phone, whatsapp, telegram, instagram, bookingLink (only if already present in content or answers)",
    "",
    "Constraints:",
    "- headline <= 80 chars",
    "- subheadline <= 200 chars",
    "- cta text <= 40 chars",
    "- benefit description <= 140 chars",
    "- faq question <= 120 chars",
    "- faq answer <= 300 chars",
    "Tone: professional, clear, concise.",
    "",
    "Client revision message:",
    input.revision.message.trim(),
    "",
    "Current content (JSON):",
    JSON.stringify(
      {
        hero: draft.hero,
        benefits: draft.benefits,
        cta: draft.cta,
        faq: draft.faq,
        contact: draft.contact,
        answersSummary: {
          businessName: (answers as any)?.businessName,
          mainOffer: (answers as any)?.mainOffer,
          targetAudience: (answers as any)?.targetAudience,
          desiredCTA: (answers as any)?.desiredCTA,
          contactEmail: (answers as any)?.contactEmail,
        },
      },
      null,
      2
    ),
    "",
    "Respond with JSON:",
    "{",
    '  "section": "hero|benefits|cta|faq|contact",',
    '  "field": "field name e.g. headline OR benefits[0].description",',
    '  "suggestedValue": "string",',
    '  "reason": "short reason"',
    "}",
  ].join("\n");

  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        text: { format: { type: "json_object" } },
        max_output_tokens: 400,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      return fallback;
    }
    const data = await res.json().catch(() => null);
    const raw = data?.output_text || data?.output?.[0]?.content?.[0]?.text || "";
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as AiSuggestionPayload;
    return normalizeSuggestion(parsed, fallback);
  } catch {
    return fallback;
  }
}
