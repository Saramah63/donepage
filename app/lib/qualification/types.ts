export type BusinessContext = {
  industry:
    | "coach_consultant"
    | "agency_services"
    | "saas_b2b"
    | "local_services"
    | "ecommerce_brand"
    | "real_estate"
    | "education_courses"
    | "wellness_fitness"
    | "legal_immigration_general"
    | "b2b_services_manufacturing"
    | "generic";
  language?: string;
  audience?: string;
  offerType?: string;
  avgDealSize?: string;
};

export type Answers = Record<string, string | number | boolean | string[]>;

export type QualificationResult = {
  fitScore: number;
  leadType: "cold" | "warm" | "hot";
  buyingStage: "exploring" | "comparing" | "ready";
  budgetBand: "low" | "mid" | "high" | "unknown";
  urgency: "low" | "mid" | "high";
  nextAction: "book" | "apply" | "email" | "download" | "reject";
  recommendedPackage: "starter" | "business" | "pro" | "none";
  rationaleShort: string;
  keySignals: string[];
  redFlags: string[];
  answers: Answers;
  context: BusinessContext;
};

export type QuestionOption = {
  value: string;
  label: string;
  points: number;
  signal?: string;
  redFlag?: boolean;
};

export type QualificationQuestion = {
  id: string;
  label: string;
  type: "single";
  options: QuestionOption[];
};

export type QualificationTemplate = {
  id: BusinessContext["industry"];
  title: string;
  questions: QualificationQuestion[];
};

