import type { QualificationTemplate } from "@/app/lib/qualification/types";

const budgetQuestion = {
  id: "budget",
  label: "What budget range are you comfortable with?",
  type: "single" as const,
  options: [
    { value: "low", label: "Under $1k", points: 5 },
    { value: "mid", label: "$1k - $5k", points: 16, signal: "budget-mid" },
    { value: "high", label: "$5k+", points: 24, signal: "budget-high" },
    { value: "unknown", label: "Not sure yet", points: 8 },
  ],
};

const urgencyQuestion = {
  id: "urgency",
  label: "How urgent is this project?",
  type: "single" as const,
  options: [
    { value: "low", label: "No rush", points: 4 },
    { value: "mid", label: "Within 1-2 months", points: 14, signal: "urgency-mid" },
    { value: "high", label: "Within 2 weeks", points: 20, signal: "urgency-high" },
  ],
};

const stageQuestion = {
  id: "buyingStage",
  label: "Where are you in your decision process?",
  type: "single" as const,
  options: [
    { value: "exploring", label: "Exploring options", points: 8 },
    { value: "comparing", label: "Comparing providers", points: 15, signal: "comparing" },
    { value: "ready", label: "Ready to start", points: 24, signal: "ready" },
  ],
};

const authorityQuestion = {
  id: "authority",
  label: "Who decides on this project?",
  type: "single" as const,
  options: [
    { value: "self", label: "I decide", points: 18, signal: "decision-maker" },
    { value: "team", label: "I influence, team approves", points: 12 },
    { value: "other", label: "Someone else decides", points: 2, redFlag: true },
  ],
};

const timelineQuestion = {
  id: "timeline",
  label: "When do you want the first version live?",
  type: "single" as const,
  options: [
    { value: "soon", label: "1-2 weeks", points: 18, signal: "launch-soon" },
    { value: "month", label: "This month", points: 14 },
    { value: "later", label: "Later", points: 6 },
  ],
};

function customQuestion(
  id: string,
  label: string,
  options: Array<{ value: string; label: string; points: number; signal?: string; redFlag?: boolean }>
) {
  return {
    id,
    label,
    type: "single" as const,
    options,
  };
}

export const QUALIFICATION_TEMPLATES: QualificationTemplate[] = [
  {
    id: "coach_consultant",
    title: "Coach / Consultant Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      authorityQuestion,
      customQuestion("offerClarity", "How clear is your offer right now?", [
        { value: "clear", label: "Very clear", points: 16, signal: "offer-clear" },
        { value: "partial", label: "Partially clear", points: 9 },
        { value: "unclear", label: "Not clear yet", points: 2, redFlag: true },
      ]),
    ],
  },
  {
    id: "agency_services",
    title: "Agency Services Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      timelineQuestion,
      authorityQuestion,
      customQuestion("assetReadiness", "Do you have brand assets and content ready?", [
        { value: "ready", label: "Yes", points: 14, signal: "assets-ready" },
        { value: "partial", label: "Partially", points: 7 },
        { value: "none", label: "No", points: 2, redFlag: true },
      ]),
    ],
  },
  {
    id: "saas_b2b",
    title: "B2B SaaS Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      customQuestion("traffic", "Current monthly landing traffic?", [
        { value: "high", label: "10k+", points: 18, signal: "traffic-strong" },
        { value: "mid", label: "1k-10k", points: 12 },
        { value: "low", label: "Under 1k", points: 6 },
      ]),
      customQuestion("intent", "Primary objective?", [
        { value: "pipeline", label: "Qualified demos", points: 18, signal: "pipeline-focus" },
        { value: "signup", label: "Free trial signups", points: 14 },
        { value: "awareness", label: "Awareness only", points: 5 },
      ]),
    ],
  },
  {
    id: "local_services",
    title: "Local Services Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      customQuestion("coverage", "How large is your service area?", [
        { value: "city", label: "City-wide", points: 14 },
        { value: "region", label: "Multiple cities/region", points: 17, signal: "region-scale" },
        { value: "small", label: "Small local area", points: 8 },
      ]),
      authorityQuestion,
    ],
  },
  {
    id: "ecommerce_brand",
    title: "Ecommerce Brand Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      customQuestion("revenue", "Current monthly revenue?", [
        { value: "high", label: "$50k+", points: 20, signal: "revenue-strong" },
        { value: "mid", label: "$10k-$50k", points: 14 },
        { value: "low", label: "Under $10k", points: 8 },
      ]),
      urgencyQuestion,
      timelineQuestion,
    ],
  },
  {
    id: "real_estate",
    title: "Real Estate Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      customQuestion("listingVolume", "Monthly active listings/projects?", [
        { value: "high", label: "20+", points: 18, signal: "volume-high" },
        { value: "mid", label: "5-20", points: 12 },
        { value: "low", label: "Under 5", points: 7 },
      ]),
      authorityQuestion,
    ],
  },
  {
    id: "education_courses",
    title: "Education / Course Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      customQuestion("audienceSize", "Do you already have an audience?", [
        { value: "large", label: "10k+", points: 18, signal: "audience-large" },
        { value: "small", label: "1k-10k", points: 12 },
        { value: "none", label: "No", points: 3, redFlag: true },
      ]),
      urgencyQuestion,
      timelineQuestion,
    ],
  },
  {
    id: "wellness_fitness",
    title: "Wellness / Fitness Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      customQuestion("programMaturity", "How mature is your program offer?", [
        { value: "mature", label: "Mature and validated", points: 16, signal: "offer-validated" },
        { value: "early", label: "Early but running", points: 10 },
        { value: "idea", label: "Still idea stage", points: 3, redFlag: true },
      ]),
      authorityQuestion,
    ],
  },
  {
    id: "legal_immigration_general",
    title: "Legal / Immigration Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      customQuestion("caseType", "How specific is your case/service intent?", [
        { value: "specific", label: "Very specific", points: 16, signal: "intent-specific" },
        { value: "somewhat", label: "Somewhat clear", points: 9 },
        { value: "unclear", label: "Unclear", points: 2, redFlag: true },
      ]),
      authorityQuestion,
    ],
  },
  {
    id: "b2b_services_manufacturing",
    title: "B2B Services / Manufacturing Fit Check",
    questions: [
      stageQuestion,
      budgetQuestion,
      customQuestion("salesCycle", "Typical sales cycle length?", [
        { value: "short", label: "Under 30 days", points: 16, signal: "cycle-short" },
        { value: "mid", label: "1-3 months", points: 12 },
        { value: "long", label: "3+ months", points: 8 },
      ]),
      urgencyQuestion,
      authorityQuestion,
    ],
  },
  {
    id: "generic",
    title: "Business Qualification",
    questions: [
      stageQuestion,
      budgetQuestion,
      urgencyQuestion,
      authorityQuestion,
      timelineQuestion,
    ],
  },
];

export function getTemplateByIndustry(industry?: string) {
  const match = QUALIFICATION_TEMPLATES.find((t) => t.id === industry);
  return match ?? QUALIFICATION_TEMPLATES.find((t) => t.id === "generic")!;
}

