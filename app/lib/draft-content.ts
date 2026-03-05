import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export type DraftFaqItem = { question: string; answer: string };
export type DraftBenefit = { title: string; description: string };

export type DraftHero = {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
};

export type DraftCta = {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
};

export type DraftContact = {
  email?: string;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  instagram?: string;
  bookingLink?: string;
};

export type DraftOverrides = {
  heroHeadline?: string;
  heroSubheadline?: string;
  heroPrimaryCTA?: string;
  heroPrimaryUrl?: string;
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
  contactTelegram?: string;
  contactInstagram?: string;
  contactBookingLink?: string;
  benefits?: DraftBenefit[];
  faq?: DraftFaqItem[];
};

export type DraftContent = {
  answers: QuestionnaireAnswers;
  hero?: DraftHero;
  benefits?: DraftBenefit[];
  cta?: DraftCta;
  contact?: DraftContact;
  faq?: DraftFaqItem[];
  overrides?: DraftOverrides;
};

export function draftToOverrides(
  draft: DraftContent | null | undefined,
  legacyOverrides?: DraftOverrides | null
): DraftOverrides {
  const out: DraftOverrides = { ...(legacyOverrides || {}) };
  if (!draft) return out;

  if (draft.hero?.headline) out.heroHeadline = draft.hero.headline;
  if (draft.hero?.subheadline) out.heroSubheadline = draft.hero.subheadline;
  if (draft.hero?.ctaText) out.heroPrimaryCTA = draft.hero.ctaText;
  if (draft.hero?.ctaLink) out.heroPrimaryUrl = draft.hero.ctaLink;

  if (draft.cta?.title) out.ctaHeadline = draft.cta.title;
  if (draft.cta?.buttonText) out.ctaButtonText = draft.cta.buttonText;
  if (draft.cta?.buttonLink) out.ctaButtonUrl = draft.cta.buttonLink;

  if (draft.contact?.email) out.contactEmail = draft.contact.email;
  if (draft.contact?.phone) out.contactPhone = draft.contact.phone;
  if (draft.contact?.whatsapp) out.contactWhatsApp = draft.contact.whatsapp;
  if (draft.contact?.telegram) out.contactTelegram = draft.contact.telegram;
  if (draft.contact?.instagram) out.contactInstagram = draft.contact.instagram;
  if (draft.contact?.bookingLink) out.contactBookingLink = draft.contact.bookingLink;

  if (draft.benefits && draft.benefits.length > 0) out.benefits = draft.benefits;
  if (draft.faq && draft.faq.length > 0) out.faq = draft.faq;

  return out;
}
