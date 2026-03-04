import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

type BriefBody = {
  businessName: string;
  websiteGoal: string;
  targetAudience: string;
  mainOffer: string;
  problemSolved: string;
  desiredCTA: string;
  customerEmail: string;
  brandColors?: string;
  domain?: string;
};

function mapGoal(goal: string): QuestionnaireAnswers["primaryGoal"] {
  const v = goal.toLowerCase();
  if (v.includes("booking") || v.includes("call")) return "calls";
  if (v.includes("sales") || v.includes("buy")) return "packages";
  if (v.includes("cred")) return "credibility";
  return "leads";
}

export function briefToQuestionnaireAnswers(input: BriefBody): QuestionnaireAnswers {
  return {
    language: "English",
    businessName: input.businessName,
    country: "USA",
    serviceType: "consulting",
    targetAudience: "small-business",
    businessStage: "starting",
    primaryGoal: mapGoal(input.websiteGoal),
    experienceLevel: "intermediate",
    pricingApproach: "competitive",
    keyDifferentiator: "results",
    trustFactor: "results",
    includeAbout: "yes",
    customServices: input.mainOffer,
    primaryOffer: input.mainOffer,
    problemStatement: input.problemSolved,
    outcomeStatement: `Get ${input.websiteGoal} with a clearer, conversion-focused page.`,
    proofLine: "Donepage draft generated and reviewed before final publish.",
    niche: input.targetAudience,
    processStep1: "Submit your brief",
    processStep2: "We generate and QA your draft",
    processStep3: "Approve and go live",
    contactEmail: input.customerEmail,
    bookingLink: input.desiredCTA.toLowerCase().includes("book") ? input.desiredCTA : "",
    ctaPrimaryLabel: input.desiredCTA,
    ctaSecondaryLabel: "Contact us",
    aboutText: `We help ${input.targetAudience} with ${input.mainOffer}.`,
    aboutImageUrl: "",
    portfolioItemsRaw: "",
    portfolioItemsJson: "",
    // keep optional context in a compact way for QA visibility in generated content data model
    trustFactorNotesJson: JSON.stringify({
      briefBrandColors: input.brandColors || "",
      briefDomain: input.domain || "",
    }),
  };
}
