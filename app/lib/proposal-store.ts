// app/lib/proposal-store.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";

export type ProposalData = {
  title: string;
  context: string;
  scope: string[];
  deliverables: string[];
  timeline: string;
  investment: string;
  investmentOptions: string[];
  paymentLinks: Record<string, string>;
  template: string;
  clientLogos: string[];
  guarantee: string;
  ctaLabel: string;
  paymentLink: string;
  messagePreview: string;
  messageProposal: string;
  language?: string;
  updatedAt: number;
};

const KEY_PREFIX = "proposal:";
const keyProposal = (slug: string) => `${KEY_PREFIX}${slug}`;

/** Local dev fallback if KV env is missing */
declare global {
  // eslint-disable-next-line no-var
  var __donepageProposalStore: Map<string, any> | undefined;
}

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function memStore() {
  if (!global.__donepageProposalStore) global.__donepageProposalStore = new Map();
  return global.__donepageProposalStore;
}

type KvModule = typeof import("@vercel/kv");
let kvClient: KvModule["kv"] | null = null;
let warnedNoKV = false;

async function getKvClient() {
  if (!hasKV()) {
    if (!warnedNoKV) {
      console.warn(
        "KV is not configured. Falling back to in-memory store. Set KV_REST_API_URL and KV_REST_API_TOKEN."
      );
      warnedNoKV = true;
    }
    return null;
  }
  if (!kvClient) {
    const mod = await import("@vercel/kv");
    kvClient = mod.kv;
  }
  return kvClient;
}

async function getKV<T>(key: string): Promise<T | null> {
  const client = await getKvClient();
  if (client) return (await client.get<T>(key)) ?? null;
  const store = memStore();
  return (store.get(key) as T) ?? null;
}

async function setKV<T>(key: string, value: T) {
  const client = await getKvClient();
  if (client) {
    await (client.set as any)(key, value);
    return;
  }
  const store = memStore();
  store.set(key, value);
}

function safeTrim(v?: string) {
  return (v ?? "").trim();
}

export function getProposalLang(answers: QuestionnaireAnswers) {
  const raw = (answers.language || "").toLowerCase();
  if (raw.includes("persian") || raw.includes("farsi")) return "fa";
  if (raw.includes("arabic")) return "ar";
  if (raw.includes("finnish") || raw.includes("suomi")) return "fi";
  return "en";
}

function pickLang<T>(lang: string, map: Record<"en" | "fa" | "ar" | "fi", T>): T {
  return (map as any)[lang] ?? map.en;
}

export function defaultProposal(
  answers: QuestionnaireAnswers,
  previewLink: string,
  proposalLink: string,
  langOverride?: "en" | "fa" | "ar" | "fi"
): ProposalData {
  const lang = langOverride ?? (getProposalLang(answers) as "en" | "fa" | "ar" | "fi");
  const goal =
    answers.primaryGoal === "calls"
      ? pickLang(lang, {
          en: "book qualified calls",
          fa: "رزرو تماس‌های باکیفیت",
          ar: "حجز مكالمات مؤهلة",
          fi: "varata laadukkaita puheluita",
        })
      : answers.primaryGoal === "packages"
      ? pickLang(lang, {
          en: "sell service packages",
          fa: "فروش پکیج خدمات",
          ar: "بيع باقات الخدمات",
          fi: "myydä palvelupaketteja",
        })
      : answers.primaryGoal === "credibility"
      ? pickLang(lang, {
          en: "build credibility",
          fa: "ساخت اعتبار",
          ar: "بناء المصداقية",
          fi: "rakentaa uskottavuutta",
        })
      : pickLang(lang, {
          en: "generate qualified leads",
          fa: "جذب سرنخ‌های باکیفیت",
          ar: "توليد عملاء محتملين مؤهلين",
          fi: "tuottaa laadukkaita liidejä",
        });

  const title = pickLang(lang, {
    en: "B2B Landing Page Optimization Proposal",
    fa: "پیشنهاد بهینه‌سازی لندینگ B2B",
    ar: "مقترح تحسين صفحة هبوط B2B",
    fi: "B2B-laskeutumissivun optimointiehdotus",
  });

  const context = pickLang(lang, {
    en: `Based on your inputs and the generated draft, the primary goal of this landing page is: → ${goal}.`,
    fa: `براساس ورودی‌ها و پیش‌نویس ساخته‌شده، هدف اصلی این لندینگ این است: → ${goal}.`,
    ar: `استنادًا إلى مدخلاتك والمسودة، الهدف الأساسي هو: → ${goal}.`,
    fi: `Syötteidesi ja luonnoksen perusteella päätavoite on: → ${goal}.`,
  });

  const scope = pickLang(lang, {
    en: [
      "Refine the value proposition",
      "Optimize page structure for clarity",
      "Improve CTA and conversion flow",
      "Prepare a launch‑ready landing page",
    ],
    fa: [
      "شفاف‌سازی ارزش پیشنهادی",
      "بهینه‌سازی ساختار صفحه برای وضوح",
      "بهبود CTA و جریان تبدیل",
      "آماده‌سازی صفحه برای انتشار",
    ],
    ar: [
      "تحسين عرض القيمة",
      "تحسين بنية الصفحة للوضوح",
      "تحسين CTA ومسار التحويل",
      "إعداد صفحة جاهزة للنشر",
    ],
    fi: [
      "Selkeytä arvolupaus",
      "Optimoi sivurakenne selkeyden vuoksi",
      "Paranna CTA:ta ja konversiovirtaa",
      "Valmistele julkaisuvalmis sivu",
    ],
  });

  const deliverables = pickLang(lang, {
    en: [
      "Final landing page copy (conversion‑focused)",
      "Optimized layout & section order",
      "Mobile‑optimized version",
    ],
    fa: [
      "متن نهایی لندینگ (متمرکز بر تبدیل)",
      "چیدمان و ترتیب بخش‌های بهینه",
      "نسخه موبایل بهینه",
    ],
    ar: [
      "نص نهائي للصفحة (مركز على التحويل)",
      "تخطيط مُحسّن وترتيب الأقسام",
      "نسخة محسنة للجوال",
    ],
    fi: [
      "Lopullinen sivuteksti (konversiokeskeinen)",
      "Optimoitu layout ja osiojärjestys",
      "Mobiilioptimoitu versio",
    ],
  });

  const timeline = pickLang(lang, {
    en: "10–14 business days",
    fa: "۱۰ تا ۱۴ روز کاری",
    ar: "10–14 يوم عمل",
    fi: "10–14 arkipäivää",
  });

  const investmentOptions = pickLang(lang, {
    en: ["$3,000 (one‑time)", "$5,000 (one‑time)", "$7,000 (one‑time)"],
    fa: ["$3,000 (یک‌باره)", "$5,000 (یک‌باره)", "$7,000 (یک‌باره)"],
    ar: ["$3,000 (مرة واحدة)", "$5,000 (مرة واحدة)", "$7,000 (مرة واحدة)"],
    fi: ["$3,000 (kertamaksu)", "$5,000 (kertamaksu)", "$7,000 (kertamaksu)"],
  });
  const investment = investmentOptions[2];
  const template = "B2B";
  const clientLogos = ["AURORA", "NOVA", "ATLAS", "LUMEN", "VANTA", "ORBIT"];
  const guarantee = pickLang(lang, {
    en: "If you’re not satisfied, we’ll revise the deliverables until it meets the agreed scope.",
    fa: "اگر رضایت نداشتید، بازبینی می‌کنیم تا مطابق توافق شود.",
    ar: "إن لم تكن راضيًا، سنراجع حتى يلبي النطاق المتفق عليه.",
    fi: "Jos et ole tyytyväinen, tarkennamme kunnes sovittu scope täyttyy.",
  });
  const ctaLabel = pickLang(lang, {
    en: "Accept & Start Project",
    fa: "تأیید و شروع پروژه",
    ar: "الموافقة وبدء المشروع",
    fi: "Hyväksy ja aloita",
  });
  const paymentLink = "";
  const paymentLinks: Record<string, string> = {};

  const messagePreview = pickLang(lang, {
    en: `I generated a landing page draft based on your inputs.\nYou can review it here:\n${previewLink}`,
    fa: `براساس ورودی‌ها، یک پیش‌نویس لندینگ ساخته شد.\nاینجا بررسی کنید:\n${previewLink}`,
    ar: `أنشأت مسودة صفحة بناءً على مدخلاتك.\nيمكنك مراجعتها هنا:\n${previewLink}`,
    fi: `Loin luonnoksen syötteidesi perusteella.\nVoit tarkistaa sen tästä:\n${previewLink}`,
  });

  const messageProposal = pickLang(lang, {
    en: `Thanks for reviewing the draft.\n\nBased on your inputs, I’ve outlined the optimization plan and next steps here:\n${proposalLink}\n\nEverything is async — no calls needed.`,
    fa: `ممنون از بررسی پیش‌نویس.\n\nبراساس ورودی‌ها، برنامه بهینه‌سازی و مراحل بعد اینجاست:\n${proposalLink}\n\nهمه‌چیز غیرهمزمان است — بدون تماس.`,
    ar: `شكرًا لمراجعة المسودة.\n\nبناءً على مدخلاتك، وضعت خطة التحسين والخطوات التالية هنا:\n${proposalLink}\n\nكل شيء غير متزامن — لا مكالمات.`,
    fi: `Kiitos luonnoksen tarkistamisesta.\n\nSyötteidesi perusteella suunnitelma ja seuraavat vaiheet ovat täällä:\n${proposalLink}\n\nKaikki on asynkronista — ei puheluita.`,
  });

  return {
    title,
    context,
    scope,
    deliverables,
    timeline,
    investment,
    investmentOptions,
    paymentLinks,
    template,
    clientLogos,
    guarantee,
    ctaLabel,
    paymentLink,
    messagePreview,
    messageProposal,
    language: lang,
    updatedAt: Date.now(),
  };
}

export async function getProposal(slug: string) {
  return await getKV<ProposalData>(keyProposal(slug));
}

export async function saveProposal(slug: string, proposal: ProposalData) {
  const next = { ...proposal, updatedAt: Date.now() };
  await setKV(keyProposal(slug), next);
  return next;
}
