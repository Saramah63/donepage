import type { DraftContent } from "@/app/lib/draft-content";

type InstantDraftInput = {
  offer: string;
  audience: string;
  outcome: string;
  problem: string;
  trust: string;
  cta: string;
  tone: string;
  answers: Record<string, unknown>;
  plan: "launch" | "growth";
  ctaLink?: string;
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

type DraftTone = "premium" | "friendly" | "direct" | "bold";

function sentence(value: string, fallback: string) {
  const text = clean(value || fallback);
  if (!text) return fallback;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function title(value: string, fallback: string) {
  const text = clean(value || fallback);
  if (!text) return fallback;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function clip(value: string, max: number) {
  const text = clean(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function ctaLabel(input: string) {
  const normalized = clean(input).toLowerCase();
  if (normalized.includes("book")) return "Book a Call";
  if (normalized.includes("message")) return "Send a Message";
  if (normalized.includes("buy")) return "Buy Now";
  if (normalized.includes("apply")) return "Apply Now";
  return title(normalized, "Get Started");
}

function normalizeTone(input: string): DraftTone {
  const value = clean(input).toLowerCase();
  if (value === "friendly") return "friendly";
  if (value === "direct") return "direct";
  if (value === "bold") return "bold";
  return "premium";
}

function makeHeadline(problem: string, outcome: string, offer: string, audience: string) {
  if (problem && outcome) {
    return clip(`Turn ${clean(problem).toLowerCase()} into ${clean(outcome).toLowerCase()}`, 80);
  }
  if (offer && audience) {
    return clip(`${title(offer, "Professional solutions")} for ${clean(audience).toLowerCase()}`, 80);
  }
  return "Professional solutions for growing businesses";
}

function makeSubheadline(offer: string, audience: string, outcome: string) {
  if (offer && audience && outcome) {
    return clip(`A focused ${clean(offer)} for ${clean(audience)} who want real results.`, 200);
  }
  if (offer && audience) {
    return clip(`A focused ${clean(offer)} for ${clean(audience)} who want real results.`, 200);
  }
  return "A focused offer for the right people who want real results.";
}

function toneMicrocopy(tone: DraftTone) {
  if (tone === "friendly") return "Clear structure. Stronger message. Made to feel easy to act on.";
  if (tone === "direct") return "Clear structure. Stronger message. Built to move people to action.";
  if (tone === "bold") return "Clear structure. Stronger message. Built to create momentum fast.";
  return "Clear structure. Stronger message. Built to move people to action.";
}

function toneSolutionCloser(tone: DraftTone) {
  if (tone === "friendly") return "No confusion. No extra noise. Just a clear next step.";
  if (tone === "direct") return "No unnecessary complexity. Just what works.";
  if (tone === "bold") return "No wasted motion. Just a sharper path forward.";
  return "No unnecessary complexity. Just what works.";
}

function toneTrustCloser(tone: DraftTone) {
  if (tone === "friendly") return "The goal is simple: a page that feels clear, trustworthy, and easy to say yes to.";
  if (tone === "direct") return "The goal is simple: a page that supports real decisions, not just impressions.";
  if (tone === "bold") return "The goal is simple: a page that earns trust quickly and moves the right people to act.";
  return "The goal is simple: a page that supports real decisions, not just impressions.";
}

function toneContactLead(tone: DraftTone) {
  if (tone === "friendly") return "Choose the option that feels easiest for you.";
  if (tone === "direct") return "Choose the clearest path to move forward.";
  if (tone === "bold") return "Choose the fastest way to keep moving.";
  return "Choose the option that works best for you.";
}

function makeProblemSection(problem: string, audience: string) {
  const audienceText = clean(audience || "businesses").toLowerCase();
  if (problem) {
    return sentence(
      `Right now, many ${audienceText} struggle with ${problem.toLowerCase()}.`,
      "Right now, many businesses struggle with unclear positioning."
    );
  }
  return "Right now, many businesses struggle with unclear positioning.";
}

function makeSolutionSection(offer: string, tone: DraftTone) {
  if (offer) {
    return sentence(
      `A simpler, more focused approach. This ${offer} is designed to remove noise and create clarity - with a structure that makes the message easier to understand and act on. ${toneSolutionCloser(
        tone
      )}`,
      "A simpler, more focused approach that removes noise, creates clarity, and makes the next step easier to act on."
    );
  }
  return sentence(
    `A simpler, more focused approach that removes noise and creates clarity - with a structure that makes the message easier to understand and act on. ${toneSolutionCloser(
      tone
    )}`,
    "A simpler, more focused approach that removes noise, creates clarity, and makes the next step easier to act on."
  );
}

function makeOutcomeSection(outcome: string) {
  return "What changes after this: your message becomes clearer, your offer feels stronger, and people know exactly what to do next.";
}

function makeAboutSection(trust: string, tone: DraftTone) {
  const intro =
    "A clear page builds trust faster. This landing page is structured to make your offer easy to understand, easy to trust, and easy to act on. Every section is there for a reason - to clarify your message, strengthen your offer, and guide the right people forward.";
  if (trust) {
    return sentence(`${intro} ${trust} The goal is simple: a page that feels focused, credible, and ready to convert.`, intro);
  }
  return sentence(`${intro} The goal is simple: a page that feels focused, credible, and ready to convert.`, intro);
}

function faqItems(plan: "launch" | "growth") {
  return [
    {
      question: "How fast can this be ready?",
      answer:
        plan === "growth"
          ? "Your draft is ready instantly. The refined version is delivered within 48 hours."
          : "Your draft is ready instantly. The refined version is delivered within 72 hours.",
    },
    {
      question: "What happens after this?",
      answer: "We refine the message, improve the structure, and prepare your page to perform better.",
    },
    {
      question: "Can this be adjusted later?",
      answer: "Yes. This is just the starting point.",
    },
  ];
}

export function buildInstantDraft(input: InstantDraftInput): DraftContent {
  const offer = clean(input.offer);
  const audience = clean(input.audience);
  const outcome = clean(input.outcome);
  const problem = clean(input.problem);
  const trust = clean(input.trust);
  const cta = ctaLabel(input.cta);
  const ctaLink = clean(input.ctaLink || "");
  const tone = normalizeTone(input.tone);

  const headline = makeHeadline(problem, outcome, offer, audience);
  const subheadline = makeSubheadline(offer, audience, outcome);

  return {
    answers: input.answers as any,
      hero: {
        headline,
        subheadline,
        ctaText: cta,
        ctaLink,
      },
    benefits: [
      {
        title: "Problem",
        description: makeProblemSection(problem, audience),
      },
      {
        title: "Solution",
        description: makeSolutionSection(offer, tone),
      },
      {
        title: "Outcome",
        description: makeOutcomeSection(outcome),
      },
    ],
    trust: {
      title: "About",
      body: makeAboutSection(trust, tone),
    },
    cta: {
      title: "Start now - and turn this into something real.",
      buttonText: cta,
      buttonLink: ctaLink,
    },
    contact: {
      email: String((input.answers as any)?.contactEmail || "").trim(),
      phone: String((input.answers as any)?.contactPhone || "").trim(),
      whatsapp: String((input.answers as any)?.whatsApp || "").trim(),
      bookingLink: String((input.answers as any)?.bookingLink || "").trim(),
    },
    faq: faqItems(input.plan),
    overrides: {},
  };
}
