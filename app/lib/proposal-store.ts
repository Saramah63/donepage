// app/lib/proposal-store.ts
import type { QuestionnaireAnswers } from "@/app/components/questionnaire";
import {
  getPersistentKV as getKV,
  setPersistentKV as setKV,
} from "@/app/lib/persistent-kv";

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
  tierDetails?: Record<
    string,
    {
      scope: string[];
      deliverables: string[];
      timeline: string;
    }
  >;
  messagePreview: string;
  messageProposal: string;
  language?: string;
  updatedAt: number;
};

type ProposalLang = "en" | "fa" | "ar" | "fi";
type ProposalTemplateId =
  | "B2B"
  | "Consulting"
  | "Coaching"
  | "Agency"
  | "SaaS"
  | "E‑commerce"
  | "Legal";

const KEY_PREFIX = "proposal:";
const keyProposal = (slug: string) => `${KEY_PREFIX}${slug}`;

export function getProposalLang(answers: QuestionnaireAnswers) {
  const raw = (answers.language || "").toLowerCase();
  if (raw.includes("persian") || raw.includes("farsi")) return "fa";
  if (raw.includes("arabic")) return "ar";
  if (raw.includes("finnish") || raw.includes("suomi")) return "fi";
  return "en";
}

function pickLang<T>(lang: string, map: Record<ProposalLang, T>): T {
  return (map as any)[lang] ?? map.en;
}

function inferTemplate(answers: QuestionnaireAnswers): ProposalTemplateId {
  switch (answers.serviceType || "consulting") {
    case "coaching":
      return "Coaching";
    case "development":
      return "SaaS";
    case "design":
    case "marketing":
    case "creative":
      return "Agency";
    case "consulting":
      return "Consulting";
    case "legal":
    case "accounting":
      return "Legal";
    default:
      return answers.primaryGoal === "packages" ? "E‑commerce" : "B2B";
  }
}

function templateCopy(
  template: ProposalTemplateId,
  lang: ProposalLang,
  goal: string
) {
  const byTemplate: Record<
    ProposalTemplateId,
    {
      title: string;
      context: string;
      scope: string[];
      deliverables: string[];
      timeline: string;
      investmentOptions: string[];
      logos: string[];
    }
  > = {
    B2B: {
      title: pickLang(lang, {
        en: "B2B Landing Page Optimization Proposal",
        fa: "پیشنهاد بهینه‌سازی لندینگ B2B",
        ar: "مقترح تحسين صفحة هبوط B2B",
        fi: "B2B-laskeutumissivun optimointiehdotus",
      }),
      context: pickLang(lang, {
        en: `Based on your inputs and the generated draft, the primary goal is: ${goal}.`,
        fa: `براساس ورودی‌ها و پیش‌نویس ساخته‌شده، هدف اصلی این است: ${goal}.`,
        ar: `استنادًا إلى مدخلاتك والمسودة، الهدف الأساسي هو: ${goal}.`,
        fi: `Syötteidesi ja luonnoksen perusteella päätavoite on: ${goal}.`,
      }),
      scope: [
        pickLang(lang, { en: "Refine enterprise value proposition", fa: "شفاف‌سازی ارزش پیشنهادی سازمانی", ar: "تحسين عرض القيمة للمؤسسات", fi: "Tarkenna yritystason arvolupaus" }),
        pickLang(lang, { en: "Re-structure sections for decision-makers", fa: "بازچینی بخش‌ها برای تصمیم‌گیرندگان", ar: "إعادة هيكلة الأقسام لصناع القرار", fi: "Rakenna osiot päätöksentekijöille" }),
        pickLang(lang, { en: "Improve CTA and qualification flow", fa: "بهبود CTA و مسیر ارزیابی", ar: "تحسين CTA ومسار التأهيل", fi: "Paranna CTA- ja kvalifiointivirtaa" }),
        pickLang(lang, { en: "Add trust blocks for procurement confidence", fa: "افزودن بلوک اعتماد برای اطمینان خرید", ar: "إضافة كتل ثقة للشراء", fi: "Lisää luottamuselementit hankintaan" }),
      ],
      deliverables: [
        pickLang(lang, { en: "Conversion-focused final copy", fa: "متن نهایی متمرکز بر تبدیل", ar: "نسخة نهائية مركزة على التحويل", fi: "Konversiokeskeinen lopullinen copy" }),
        pickLang(lang, { en: "Decision-ready page structure", fa: "ساختار صفحه آماده تصمیم‌گیری", ar: "هيكل صفحة جاهز للقرار", fi: "Päätösvalmis sivurakenne" }),
        pickLang(lang, { en: "Mobile-first optimization", fa: "بهینه‌سازی موبایل‌محور", ar: "تحسين للجوال أولاً", fi: "Mobiili ensin -optimointi" }),
      ],
      timeline: pickLang(lang, { en: "10–14 business days", fa: "۱۰ تا ۱۴ روز کاری", ar: "10–14 يوم عمل", fi: "10–14 arkipäivää" }),
      investmentOptions: ["$3,000 (one‑time)", "$5,000 (one‑time)", "$7,000 (one‑time)"],
      logos: ["AURORA", "NOVA", "ATLAS", "LUMEN", "VANTA", "ORBIT"],
    },
    Consulting: {
      title: pickLang(lang, {
        en: "Consulting Landing Page Growth Proposal",
        fa: "پیشنهاد رشد لندینگ مشاوره",
        ar: "مقترح نمو صفحة هبوط استشارية",
        fi: "Konsultoinnin kasvuehdotus laskeutumissivulle",
      }),
      context: pickLang(lang, {
        en: `Goal: ${goal}. This proposal is built to increase qualified strategy conversations.`,
        fa: `هدف: ${goal}. این پروپوزال برای افزایش گفت‌وگوهای راهبردی باکیفیت طراحی شده است.`,
        ar: `الهدف: ${goal}. هذا المقترح لزيادة محادثات الاستراتيجية المؤهلة.`,
        fi: `Tavoite: ${goal}. Ehdotus kasvattaa laadukkaita strategiakeskusteluja.`,
      }),
      scope: [
        pickLang(lang, { en: "Position expertise with clear strategic narrative", fa: "جایگاه‌سازی تخصص با روایت راهبردی روشن", ar: "إبراز الخبرة بسرد استراتيجي واضح", fi: "Positioi osaaminen selkeällä strategisella narratiivilla" }),
        pickLang(lang, { en: "Service architecture and offer ladder", fa: "معماری خدمات و نردبان پیشنهاد", ar: "هيكلة الخدمات وسلم العروض", fi: "Palveluarkkitehtuuri ja tarjousporras" }),
        pickLang(lang, { en: "CTA flow for consultations and retainers", fa: "جریان CTA برای مشاوره و قرارداد بلندمدت", ar: "مسار CTA للاستشارات والعقود", fi: "CTA-virta konsultaatioihin ja retainer-malleihin" }),
      ],
      deliverables: [
        pickLang(lang, { en: "Premium consulting page copy", fa: "متن پریمیوم برای صفحه مشاوره", ar: "نص احترافي لصفحة الاستشارات", fi: "Premium-konsultointisivun copy" }),
        pickLang(lang, { en: "Authority and proof positioning", fa: "جایگذاری اعتبار و شواهد", ar: "تموضع المصداقية والإثباتات", fi: "Auktoriteetin ja näyttöjen positiointi" }),
        pickLang(lang, { en: "Lead qualification-ready CTA blocks", fa: "بلوک CTA آماده ارزیابی لید", ar: "كتل CTA جاهزة للتأهيل", fi: "Liidikvalifiointivalmiit CTA-osat" }),
      ],
      timeline: pickLang(lang, { en: "7–12 business days", fa: "۷ تا ۱۲ روز کاری", ar: "7–12 يوم عمل", fi: "7–12 arkipäivää" }),
      investmentOptions: ["$2,500 (one‑time)", "$4,000 (one‑time)", "$6,000 (one‑time)"],
      logos: ["NEXA", "PRISM", "BRIDGE", "PIVOT", "CORE", "ELEVATE"],
    },
    Coaching: {
      title: pickLang(lang, {
        en: "Coaching Funnel Landing Page Proposal",
        fa: "پیشنهاد لندینگ قیف فروش کوچینگ",
        ar: "مقترح صفحة هبوط لمسار الكوتشينغ",
        fi: "Coaching-funnelin laskeutumissivuehdotus",
      }),
      context: pickLang(lang, {
        en: `Goal: ${goal}. We focus on trust, story clarity, and paid-program conversion.`,
        fa: `هدف: ${goal}. تمرکز روی اعتماد، شفافیت داستان و تبدیل برنامه پولی است.`,
        ar: `الهدف: ${goal}. نركز على الثقة ووضوح القصة وتحويل البرامج المدفوعة.`,
        fi: `Tavoite: ${goal}. Keskitymme luottamukseen, tarinan selkeyteen ja maksulliseen konversioon.`,
      }),
      scope: [
        pickLang(lang, { en: "Clarify coaching transformation promise", fa: "شفاف‌سازی وعده تحول کوچینگ", ar: "توضيح وعد التحول في الكوتشينغ", fi: "Selkeytä coachingin muutoslupaus" }),
        pickLang(lang, { en: "Program positioning and package framing", fa: "جایگاه‌سازی برنامه و بسته‌بندی پکیج", ar: "تموضع البرنامج وبناء الباقات", fi: "Ohjelman positiointi ja pakettikehys" }),
        pickLang(lang, { en: "Conversion path to call or application", fa: "مسیر تبدیل به تماس یا اپلای", ar: "مسار التحويل لمكالمة أو طلب", fi: "Konversiopolku puheluun tai hakemukseen" }),
      ],
      deliverables: [
        pickLang(lang, { en: "Offer-driven hero and story sections", fa: "بخش‌های هیرو و داستان مبتنی بر پیشنهاد", ar: "أقسام بطل وقصة مبنية على العرض", fi: "Tarjousvetoinen hero- ja tarinaosio" }),
        pickLang(lang, { en: "Social proof and testimonial structure", fa: "ساختار اثبات اجتماعی و نظرات مشتریان", ar: "هيكل الإثبات الاجتماعي والشهادات", fi: "Sosiaalisen todisteen ja suositusten rakenne" }),
        pickLang(lang, { en: "High-intent CTA copy", fa: "متن CTA با نیت خرید بالا", ar: "نص CTA عالي النية", fi: "Korkean intentin CTA-copy" }),
      ],
      timeline: pickLang(lang, { en: "5–10 business days", fa: "۵ تا ۱۰ روز کاری", ar: "5–10 يوم عمل", fi: "5–10 arkipäivää" }),
      investmentOptions: ["$1,500 (one‑time)", "$3,000 (one‑time)", "$5,000 (one‑time)"],
      logos: ["MINDSET", "ASCEND", "CLARITY", "FOCUS", "ALIGN", "MOMENTUM"],
    },
    Agency: {
      title: pickLang(lang, {
        en: "Agency Client Acquisition Landing Proposal",
        fa: "پیشنهاد لندینگ جذب مشتری آژانس",
        ar: "مقترح صفحة هبوط لاكتساب عملاء الوكالة",
        fi: "Toimiston asiakashankinnan laskeutumissivuehdotus",
      }),
      context: pickLang(lang, {
        en: `Goal: ${goal}. This proposal is built to increase inbound qualified briefs.`,
        fa: `هدف: ${goal}. این پروپوزال برای افزایش بریف‌های ورودی باکیفیت طراحی شده است.`,
        ar: `الهدف: ${goal}. المقترح لزيادة طلبات الأعمال المؤهلة الواردة.`,
        fi: `Tavoite: ${goal}. Ehdotus kasvattaa laadukkaita inbound-briefauksia.`,
      }),
      scope: [
        pickLang(lang, { en: "Sharper niche + offer positioning", fa: "جایگاه‌سازی دقیق‌تر نیچ و آفر", ar: "تموضع أدق للتخصص والعرض", fi: "Terävämpi niche- ja tarjouspositiointi" }),
        pickLang(lang, { en: "Case-study driven conversion layout", fa: "چیدمان تبدیل مبتنی بر کیس‌استادی", ar: "تخطيط تحويل يعتمد على دراسات حالة", fi: "Case-study-vetoinen konversiolayout" }),
        pickLang(lang, { en: "Qualification-first inquiry flow", fa: "جریان درخواست با اولویت ارزیابی", ar: "مسار استفسار يبدأ بالتأهيل", fi: "Kvalifiointia priorisoiva yhteyspolku" }),
      ],
      deliverables: [
        pickLang(lang, { en: "Agency offer page copy", fa: "متن صفحه پیشنهاد آژانس", ar: "نص صفحة عرض الوكالة", fi: "Toimiston tarjoussivun copy" }),
        pickLang(lang, { en: "Portfolio narrative blocks", fa: "بلوک‌های روایت پورتفولیو", ar: "كتل سرد ملف الأعمال", fi: "Portfolion narratiiviset osat" }),
        pickLang(lang, { en: "Pricing/engagement framing", fa: "فریم قیمت‌گذاری/تعامل", ar: "إطار التسعير ونموذج التعاون", fi: "Hinnoittelu- ja yhteistyökehys" }),
      ],
      timeline: pickLang(lang, { en: "8–12 business days", fa: "۸ تا ۱۲ روز کاری", ar: "8–12 يوم عمل", fi: "8–12 arkipäivää" }),
      investmentOptions: ["$3,000 (one‑time)", "$5,000 (one‑time)", "$7,500 (one‑time)"],
      logos: ["PIXEL", "NORTH", "FRAME", "VECTOR", "ARC", "HARBOR"],
    },
    SaaS: {
      title: pickLang(lang, {
        en: "SaaS Conversion Landing Page Proposal",
        fa: "پیشنهاد لندینگ تبدیل SaaS",
        ar: "مقترح صفحة هبوط تحويل SaaS",
        fi: "SaaS-konversion laskeutumissivuehdotus",
      }),
      context: pickLang(lang, {
        en: `Goal: ${goal}. We optimize for demos, trials, and product-led conversion.`,
        fa: `هدف: ${goal}. بهینه‌سازی برای دمو، تریال و تبدیل محصول‌محور انجام می‌شود.`,
        ar: `الهدف: ${goal}. نُحسن للديمو والتجارب والتحويل المعتمد على المنتج.`,
        fi: `Tavoite: ${goal}. Optimoimme demot, trialit ja product-led-konversion.`,
      }),
      scope: [
        pickLang(lang, { en: "Clarify ICP + pain point framing", fa: "شفاف‌سازی ICP و بیان مسئله", ar: "توضيح ICP وصياغة المشكلة", fi: "Selkeytä ICP ja kipupisteen kehys" }),
        pickLang(lang, { en: "Feature-to-value storytelling", fa: "روایت از ویژگی تا ارزش", ar: "سرد من الميزة إلى القيمة", fi: "Ominaisuudesta arvoon -tarinankerronta" }),
        pickLang(lang, { en: "Demo/trial conversion optimization", fa: "بهینه‌سازی تبدیل دمو/تریال", ar: "تحسين تحويل الديمو/التجربة", fi: "Demo/trial-konversio-optimointi" }),
      ],
      deliverables: [
        pickLang(lang, { en: "SaaS homepage/LP conversion copy", fa: "متن تبدیل برای صفحه SaaS", ar: "نص تحويل لصفحة SaaS", fi: "SaaS-landingin konversiocopy" }),
        pickLang(lang, { en: "Objection-handling sections", fa: "بخش‌های پاسخ به اعتراضات", ar: "أقسام معالجة الاعتراضات", fi: "Vastaväitteitä käsittelevät osiot" }),
        pickLang(lang, { en: "Proof metrics and CTA hierarchy", fa: "متریک‌های اثبات و سلسله CTA", ar: "مقاييس الإثبات وهيكل CTA", fi: "Todistemittarit ja CTA-hierarkia" }),
      ],
      timeline: pickLang(lang, { en: "10–15 business days", fa: "۱۰ تا ۱۵ روز کاری", ar: "10–15 يوم عمل", fi: "10–15 arkipäivää" }),
      investmentOptions: ["$4,000 (one‑time)", "$6,000 (one‑time)", "$9,000 (one‑time)"],
      logos: ["CLOUDLY", "STACK", "NIMBUS", "PULSE", "BYTE", "FLOW"],
    },
    "E‑commerce": {
      title: pickLang(lang, {
        en: "Offer Package Sales Proposal",
        fa: "پیشنهاد فروش پکیج‌های خدمات",
        ar: "مقترح بيع باقات الخدمات",
        fi: "Palvelupakettien myyntiehdotus",
      }),
      context: pickLang(lang, {
        en: `Goal: ${goal}. We structure the page for package comparison and faster payment intent.`,
        fa: `هدف: ${goal}. صفحه برای مقایسه پکیج‌ها و افزایش قصد پرداخت ساختاربندی می‌شود.`,
        ar: `الهدف: ${goal}. نهيكل الصفحة لمقارنة الباقات وتسريع نية الدفع.`,
        fi: `Tavoite: ${goal}. Rakennamme sivun pakettivertailuun ja nopeampaan ostointenttiin.`,
      }),
      scope: [
        pickLang(lang, { en: "Package architecture and naming", fa: "معماری و نام‌گذاری پکیج‌ها", ar: "هيكلة الباقات وتسميتها", fi: "Pakettirakenne ja nimeäminen" }),
        pickLang(lang, { en: "Pricing anchors and featured tier design", fa: "انکر قیمت و طراحی پلن ویژه", ar: "مرتكزات التسعير وتصميم الباقة المميزة", fi: "Hinta-ankkurit ja featured-tason design" }),
        pickLang(lang, { en: "Checkout-ready CTA sequence", fa: "توالی CTA آماده پرداخت", ar: "تسلسل CTA جاهز للدفع", fi: "Checkout-valmis CTA-sekvenssi" }),
      ],
      deliverables: [
        pickLang(lang, { en: "Package comparison section", fa: "بخش مقایسه پکیج‌ها", ar: "قسم مقارنة الباقات", fi: "Pakettivertailuosio" }),
        pickLang(lang, { en: "Offer stack and urgency copy", fa: "استک پیشنهاد و متن فوریت", ar: "هيكل العرض ونص الاستعجال", fi: "Tarjouspino ja kiireellisyyden copy" }),
        pickLang(lang, { en: "Payment flow alignment", fa: "هم‌ترازی با جریان پرداخت", ar: "مواءمة مسار الدفع", fi: "Maksupolun yhteensovitus" }),
      ],
      timeline: pickLang(lang, { en: "6–10 business days", fa: "۶ تا ۱۰ روز کاری", ar: "6–10 يوم عمل", fi: "6–10 arkipäivää" }),
      investmentOptions: ["$2,000 (one‑time)", "$3,500 (one‑time)", "$5,000 (one‑time)"],
      logos: ["BLOOM", "NOVA", "GLOW", "LUXE", "SPARK", "PURE"],
    },
    Legal: {
      title: pickLang(lang, {
        en: "Professional Services Trust Proposal",
        fa: "پیشنهاد اعتمادسازی خدمات حرفه‌ای",
        ar: "مقترح بناء الثقة للخدمات المهنية",
        fi: "Ammatillisten palveluiden luottamusehdotus",
      }),
      context: pickLang(lang, {
        en: `Goal: ${goal}. We focus on credibility, compliance tone, and qualified inquiry flow.`,
        fa: `هدف: ${goal}. تمرکز بر اعتبار، لحن حرفه‌ای و جریان درخواست باکیفیت است.`,
        ar: `الهدف: ${goal}. نركز على المصداقية والنبرة المهنية ومسار الاستفسار المؤهل.`,
        fi: `Tavoite: ${goal}. Keskitymme uskottavuuteen, compliance-sävyyn ja laadukkaaseen yhteyspolkuun.`,
      }),
      scope: [
        pickLang(lang, { en: "Trust-first messaging architecture", fa: "معماری پیام اعتمادمحور", ar: "هيكل رسائل مبني على الثقة", fi: "Luottamuslähtöinen viestiarkkitehtuuri" }),
        pickLang(lang, { en: "Authority proof and credentials visibility", fa: "نمایش شواهد اعتبار و مدارک", ar: "إبراز الإثباتات والاعتمادات", fi: "Auktoriteettinäytöt ja pätevyyksien näkyvyys" }),
        pickLang(lang, { en: "Safe and clear inquiry conversion path", fa: "مسیر تبدیل درخواست امن و واضح", ar: "مسار تحويل آمن وواضح للاستفسار", fi: "Turvallinen ja selkeä yhteydenottopolku" }),
      ],
      deliverables: [
        pickLang(lang, { en: "Compliance-friendly copy", fa: "متن سازگار با الزامات حرفه‌ای", ar: "نص متوافق مع الامتثال", fi: "Compliance-ystävällinen copy" }),
        pickLang(lang, { en: "Trust badges and case framing", fa: "نشان‌های اعتماد و فریم نمونه‌ها", ar: "شارات الثقة وصياغة الحالات", fi: "Luottamusmerkit ja case-kehys" }),
        pickLang(lang, { en: "Premium lead intake CTA blocks", fa: "بلوک CTA برای جذب لید پریمیوم", ar: "كتل CTA لجذب عملاء مميزين", fi: "Premium-liidien CTA-osat" }),
      ],
      timeline: pickLang(lang, { en: "8–14 business days", fa: "۸ تا ۱۴ روز کاری", ar: "8–14 يوم عمل", fi: "8–14 arkipäivää" }),
      investmentOptions: ["$3,500 (one‑time)", "$5,500 (one‑time)", "$8,000 (one‑time)"],
      logos: ["LEXIS", "TRUST", "SHIELD", "NORTHLAW", "AXIS", "PRIME"],
    },
  };

  return byTemplate[template];
}

function buildTierDetails(
  investmentOptions: string[],
  scope: string[],
  deliverables: string[],
  timeline: string,
  lang: ProposalLang
) {
  const baseScope = scope.slice(0, 3);
  const baseDeliverables = deliverables.slice(0, 2);

  const addScopeGrowth = pickLang(lang, {
    en: "Conversion optimization pass for CTA and section flow",
    fa: "یک مرحله بهینه‌سازی تبدیل برای CTA و جریان بخش‌ها",
    ar: "مرحلة تحسين تحويل لزر الدعوة وتدفق الأقسام",
    fi: "Konversio-optimointikierros CTA:lle ja osioiden virralle",
  });
  const addScopePremium = pickLang(lang, {
    en: "Advanced objection handling and premium trust architecture",
    fa: "مدل پیشرفته پاسخ به اعتراضات و معماری اعتماد پریمیوم",
    ar: "معالجة متقدمة للاعتراضات وبنية ثقة متميزة",
    fi: "Edistynyt vastaväitekäsittely ja premium-luottamusarkkitehtuuri",
  });

  const addDeliverableGrowth = pickLang(lang, {
    en: "Tier-specific package framing and sales messaging",
    fa: "فریم پکیج مخصوص پلن و پیام فروش",
    ar: "صياغة باقات خاصة بالمستوى ورسائل مبيعات",
    fi: "Tasokohtainen pakettikehys ja myyntiviestit",
  });
  const addDeliverablePremium = pickLang(lang, {
    en: "Launch-ready optimization checklist + 30-day guidance",
    fa: "چک‌لیست بهینه‌سازی آماده لانچ + راهنمایی ۳۰ روزه",
    ar: "قائمة تحسين جاهزة للإطلاق + إرشاد 30 يومًا",
    fi: "Julkaisuvalmis optimointitarkistuslista + 30 päivän ohjaus",
  });

  const fasterTimeline = pickLang(lang, {
    en: "7–10 business days",
    fa: "۷ تا ۱۰ روز کاری",
    ar: "7–10 أيام عمل",
    fi: "7–10 arkipäivää",
  });
  const premiumTimeline = pickLang(lang, {
    en: "5–8 business days",
    fa: "۵ تا ۸ روز کاری",
    ar: "5–8 أيام عمل",
    fi: "5–8 arkipäivää",
  });

  const tiers = investmentOptions.slice(0, 3);
  const details: Record<string, { scope: string[]; deliverables: string[]; timeline: string }> = {};

  if (tiers[0]) {
    details[tiers[0]] = {
      scope: baseScope,
      deliverables: baseDeliverables,
      timeline,
    };
  }
  if (tiers[1]) {
    details[tiers[1]] = {
      scope: [...baseScope, addScopeGrowth],
      deliverables: [...baseDeliverables, addDeliverableGrowth],
      timeline: fasterTimeline,
    };
  }
  if (tiers[2]) {
    details[tiers[2]] = {
      scope: [...baseScope, addScopeGrowth, addScopePremium],
      deliverables: [...baseDeliverables, addDeliverableGrowth, addDeliverablePremium],
      timeline: premiumTimeline,
    };
  }

  return details;
}

export function defaultProposal(
  answers: QuestionnaireAnswers,
  previewLink: string,
  proposalLink: string,
  langOverride?: "en" | "fa" | "ar" | "fi"
): ProposalData {
  const lang = langOverride ?? (getProposalLang(answers) as ProposalLang);
  const template = inferTemplate(answers);
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

  const tpl = templateCopy(template, lang, goal);
  const title = tpl.title;
  const context = tpl.context;
  const scope = tpl.scope;
  const deliverables = tpl.deliverables;
  const timeline = tpl.timeline;
  const investmentOptions =
    lang === "en"
      ? tpl.investmentOptions
      : pickLang(lang, {
          en: tpl.investmentOptions,
          fa: tpl.investmentOptions.map((x) => x.replace("(one‑time)", "(یک‌باره)")),
          ar: tpl.investmentOptions.map((x) => x.replace("(one‑time)", "(مرة واحدة)")),
          fi: tpl.investmentOptions.map((x) => x.replace("(one‑time)", "(kertamaksu)")),
        });
  const investment = investmentOptions[2];
  const clientLogos = tpl.logos;
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
  const tierDetails = buildTierDetails(
    investmentOptions,
    scope,
    deliverables,
    timeline,
    lang
  );

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
    tierDetails,
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
