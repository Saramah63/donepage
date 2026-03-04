import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export type DraftFaqItem = { question: string; answer: string };
export type DraftBenefit = { title: string; description: string };

export type DraftOverrides = {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroPrimaryCTA?: string;
  heroSecondaryCTA?: string;
  ctaHeadline?: string;
  ctaSubheadline?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactBookingLink?: string;
  benefits?: DraftBenefit[];
  faq?: DraftFaqItem[];
};

export type DraftContent = {
  answers: QuestionnaireAnswers;
  overrides?: DraftOverrides;
};
