// app/components/questionnaire.tsx
"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { ThemeToggle } from "@/app/components/theme-toggle";

export type QuestionnaireAnswers = {
  businessName?: string;
  city?: string;
  country?: string;
  countryOther?: string;
  language?: string;
  languageOther?: string;

  primaryOffer?: string;
  aboutText?: string;

  // trust quick stats
  ratingValue?: string; // e.g. "5.0"
  clientsCount?: string; // e.g. "100+"
  yearsExp?: string; // e.g. "10+"

  // contact
  contactEmail?: string;
  contactPhone?: string;
  bookingLink?: string;
  whatsApp?: string;

  // optional testimonial
  testimonialText?: string;
  testimonialName?: string;

  // core positioning
  serviceType:
    | "consulting"
    | "coaching"
    | "design"
    | "development"
    | "marketing"
    | "creative"
    | "legal"
    | "accounting"
    | "other";
  serviceTypeOther?: string;
  targetAudience:
    | "individuals"
    | "freelancers"
    | "small-business"
    | "medium-business"
    | "enterprise";
  businessStage: "starting" | "established" | "scaling";
  primaryGoal: "leads" | "calls" | "packages" | "credibility";
  primaryGoals?: Array<"leads" | "calls" | "packages" | "credibility">;
  experienceLevel: "new" | "intermediate" | "expert" | "veteran";
  pricingApproach: "budget" | "competitive" | "premium" | "custom";
  keyDifferentiator: "speed" | "quality" | "expertise" | "personal" | "results";
  trustFactor:
    | "certifications"
    | "experience"
    | "results"
    | "guarantee"
    | "portfolio";
  trustFactors?: Array<
    "certifications" | "experience" | "results" | "guarantee" | "portfolio"
  >;
  trustFactorNotesJson?: string;
  includeAbout: "yes" | "no";
  customServices?: string;

  // ✅ Advanced (optional)
  // High-leverage messaging
  problemStatement?: string; // 1 line: "What problem do you solve?"
  outcomeStatement?: string; // 1 line: "What outcome do you deliver?"
  proofLine?: string; // 1 line: "Proof / credibility snippet"
  niche?: string; // optional: industry / niche

  // Process (3-step)
  processStep1?: string;
  processStep2?: string;
  processStep3?: string;

  // About image
  aboutImageUrl?: string; // optional: user-provided image URL

  // Optional: CTA labels (if you want customizable button text later)
  ctaPrimaryLabel?: string; // e.g. "Book a Call"
  ctaSecondaryLabel?: string; // e.g. "Email Us"

  // Optional: portfolio overrides
  portfolioItemsRaw?: string; // deprecated fallback
  portfolioItemsJson?: string; // JSON stringified items with optional images
};

type Option = {
  value: string;
  title: string;
  desc: string;
};

type Step = {
  key: keyof QuestionnaireAnswers;
  title: string;
  subtitle: string;
  options: Option[];
};

type StepSection = {
  id: "brand" | "offer" | "conversion";
  label: Record<UiLang, string>;
  keys: Array<keyof QuestionnaireAnswers>;
};

const BASE_STEPS: Step[] = [
  {
    key: "language",
    title: "What language should your page be in?",
    subtitle: "Choose your preferred language (you can set a country next)",
    options: [],
  },
  {
    key: "businessName",
    title: "What is your business name?",
    subtitle: "This will appear on your landing page and in Google",
    options: [],
  },
  {
    key: "country",
    title: "Which country are you based in?",
    subtitle: "Used for localized trust + SEO context",
    options: [
      { value: "Finland", title: "Finland", desc: "Suomi" },
      { value: "Sweden", title: "Sweden", desc: "Sverige" },
      { value: "Norway", title: "Norway", desc: "Norge" },
      { value: "Denmark", title: "Denmark", desc: "Danmark" },
      { value: "Germany", title: "Germany", desc: "Deutschland" },
      { value: "Netherlands", title: "Netherlands", desc: "Nederland" },
      { value: "UK", title: "United Kingdom", desc: "UK" },
      { value: "USA", title: "United States", desc: "USA" },
      { value: "Canada", title: "Canada", desc: "CA" },
      { value: "Australia", title: "Australia", desc: "AU" },
      { value: "Other", title: "Other", desc: "Select this if not listed" },
    ],
  },
  {
    key: "serviceType",
    title: "What type of service do you provide?",
    subtitle: "Select the category that best matches your business",
    options: [
      { value: "consulting", title: "Business Consulting", desc: "Strategy, operations, or management advice" },
      { value: "coaching", title: "Coaching & Training", desc: "Life coaching, career coaching, or skills training" },
      { value: "design", title: "Design Services", desc: "Graphic design, branding, or UX/UI design" },
      { value: "development", title: "Web/Software Development", desc: "Websites, apps, or custom software" },
      { value: "marketing", title: "Marketing & Advertising", desc: "Digital marketing, SEO, or social media management" },
      { value: "creative", title: "Creative Services", desc: "Photography, videography, or content creation" },
      { value: "legal", title: "Legal Services", desc: "Legal consulting or specialized legal services" },
      { value: "accounting", title: "Accounting & Finance", desc: "Bookkeeping, tax prep, or financial planning" },
      { value: "other", title: "Other", desc: "Custom or niche services" },
    ],
  },
  {
    key: "customServices",
    title: "What exact services or packages do you want to sell?",
    subtitle: "Mandatory for package-focused pages. Add each service/package on a new line.",
    options: [],
  },
  {
    key: "targetAudience",
    title: "Who are your ideal clients?",
    subtitle: "Choose the audience you serve best",
    options: [
      { value: "individuals", title: "Individuals & Consumers", desc: "Personal clients with individual needs" },
      { value: "freelancers", title: "Freelancers & Solopreneurs", desc: "Self-employed professionals" },
      { value: "small-business", title: "Small Businesses", desc: "Local businesses and startups (1-50 employees)" },
      { value: "medium-business", title: "Growing Companies", desc: "Established businesses (50-250 employees)" },
      { value: "enterprise", title: "Enterprise & Corporations", desc: "Large organizations with complex needs" },
    ],
  },
  {
    key: "businessStage",
    title: "What stage is your business at?",
    subtitle: "This helps us position your expertise appropriately.",
    options: [
      { value: "starting", title: "Just Starting Out", desc: "New to the market, building your first clients" },
      { value: "established", title: "Established & Growing", desc: "Steady client base, looking to expand" },
      { value: "scaling", title: "Scaling & Systemizing", desc: "Strong reputation, ready to scale operations" },
    ],
  },
  {
    key: "primaryGoal",
    title: "What's your main goal with this landing page?",
    subtitle: "You can choose multiple goals. If you choose packages, service/package details become mandatory.",
    options: [
      { value: "leads", title: "Generate Qualified Leads", desc: "Collect contact info from interested prospects" },
      { value: "calls", title: "Book Discovery Calls", desc: "Get prospects to schedule a consultation" },
      { value: "packages", title: "Sell Service Packages", desc: "Directly sell or showcase your offerings" },
      { value: "credibility", title: "Build Credibility & Trust", desc: "Establish authority and showcase expertise" },
    ],
  },
  {
    key: "primaryOffer",
    title: "What is your primary offer?",
    subtitle: "Describe your main offer clearly (e.g. Done-for-you SEO, 1:1 coaching, legal advisory package).",
    options: [],
  },
  {
    key: "problemStatement",
    title: "What exact problem do you solve?",
    subtitle: "Mandatory. One clear sentence focused on the client pain.",
    options: [],
  },
  {
    key: "outcomeStatement",
    title: "What measurable outcome do clients get?",
    subtitle: "Mandatory. One result-focused sentence.",
    options: [],
  },
  {
    key: "trustFactor",
    title: "Why should clients choose you?",
    subtitle: "Select one or more trust factors and add proof text for each selected item.",
    options: [
      { value: "certifications", title: "Certifications & Credentials", desc: "Professional certifications and licenses" },
      { value: "experience", title: "Years of Experience", desc: "Extensive time in the industry" },
      { value: "results", title: "Client Results & ROI", desc: "Proven outcomes and success stories" },
      { value: "guarantee", title: "Satisfaction Guarantee", desc: "Risk-free promise or money-back guarantee" },
      { value: "portfolio", title: "Portfolio & Past Work", desc: "Showcase of completed projects" },
    ],
  },
  {
    key: "keyDifferentiator",
    title: "What makes you stand out most?",
    subtitle: "Choose your strongest competitive advantage.",
    options: [
      { value: "speed", title: "Fast Turnaround", desc: "Quick delivery without compromising quality" },
      { value: "quality", title: "Exceptional Quality", desc: "Meticulous attention to detail and excellence" },
      { value: "expertise", title: "Specialized Expertise", desc: "Deep knowledge in a specific niche" },
      { value: "personal", title: "Personalized Service", desc: "Tailored approach for each client" },
      { value: "results", title: "Proven Results", desc: "Track record of measurable success" },
    ],
  },
  {
    key: "proofLine",
    title: "Add your strongest proof line",
    subtitle: "Mandatory. Example: 4.9/5 rating • 120+ clients • 8 years experience",
    options: [],
  },
  {
    key: "experienceLevel",
    title: "How much experience do you have?",
    subtitle: "We'll position your authority level appropriately.",
    options: [
      { value: "new", title: "Less than 2 years", desc: "Fresh perspective and modern approaches" },
      { value: "intermediate", title: "2-5 years", desc: "Proven track record with real results" },
      { value: "expert", title: "5-10 years", desc: "Deep expertise and industry knowledge" },
      { value: "veteran", title: "10+ years", desc: "Industry veteran with extensive experience" },
    ],
  },
  {
    key: "pricingApproach",
    title: "How do you position your pricing?",
    subtitle: "This controls pricing language and sales framing.",
    options: [
      { value: "budget", title: "Affordable & Accessible", desc: "Great value for budget-conscious clients" },
      { value: "competitive", title: "Competitive & Fair", desc: "Balanced pricing for quality service" },
      { value: "premium", title: "Premium & High-End", desc: "Top-tier service at premium rates" },
      { value: "custom", title: "Custom Quotes Only", desc: "Every project is uniquely priced" },
    ],
  },
  {
    key: "niche",
    title: "What niche/industry do you focus on?",
    subtitle: "Optional but recommended for better conversion and SEO relevance.",
    options: [],
  },
  {
    key: "processStep1",
    title: "Process step 1",
    subtitle: "Mandatory. Keep it short and outcome-oriented.",
    options: [],
  },
  {
    key: "processStep2",
    title: "Process step 2",
    subtitle: "Mandatory. Show what happens after step 1.",
    options: [],
  },
  {
    key: "processStep3",
    title: "Process step 3",
    subtitle: "Mandatory. Show final delivery/result stage.",
    options: [],
  },
  {
    key: "contactEmail",
    title: "Contact email",
    subtitle: "Mandatory. Used in CTA and contact section.",
    options: [],
  },
  {
    key: "whatsApp",
    title: "WhatsApp number (optional)",
    subtitle: "Use international format, e.g. +358401234567.",
    options: [],
  },
  {
    key: "bookingLink",
    title: "Booking link (optional)",
    subtitle: "Calendly / TidyCal / Google Calendar URL.",
    options: [],
  },
  {
    key: "includeAbout",
    title: `Do you want to add an "About" section?`,
    subtitle: "Tell your story and connect with potential clients.",
    options: [
      { value: "yes", title: "Yes, Add About Section", desc: "Share your background and mission" },
      { value: "no", title: "No, Skip About Section", desc: "Keep the page focused on services only" },
    ],
  },
  {
    key: "aboutText",
    title: "Write a short About section (optional)",
    subtitle: "A few sentences about who you are and how you help.",
    options: [],
  },
  {
    key: "aboutImageUrl",
    title: "Add an About image (optional)",
    subtitle: "Upload a photo/video or paste a direct URL.",
    options: [],
  },
  {
    key: "portfolioItemsRaw",
    title: "Portfolio highlights (optional)",
    subtitle: "One per line: Title | Description | Metric (e.g. 40% growth).",
    options: [],
  },
  {
    key: "portfolioItemsJson",
    title: "Portfolio items (optional)",
    subtitle: "Add real projects, metrics, and optional images/videos.",
    options: [],
  },
];

const STEP_SECTIONS: StepSection[] = [
  {
    id: "brand",
    label: {
      en: "Brand Setup",
      fa: "تنظیم برند",
      ar: "إعداد العلامة",
      fi: "Brändiasetukset",
    },
    keys: ["language", "businessName", "country", "serviceType", "targetAudience", "businessStage", "niche"],
  },
  {
    id: "offer",
    label: {
      en: "Offer Strategy",
      fa: "استراتژی پیشنهاد",
      ar: "استراتيجية العرض",
      fi: "Tarjousstrategia",
    },
    keys: [
      "primaryGoal",
      "customServices",
      "primaryOffer",
      "problemStatement",
      "outcomeStatement",
      "keyDifferentiator",
      "pricingApproach",
      "experienceLevel",
      "proofLine",
      "trustFactor",
      "processStep1",
      "processStep2",
      "processStep3",
    ],
  },
  {
    id: "conversion",
    label: {
      en: "Conversion Assets",
      fa: "دارایی‌های تبدیل",
      ar: "أصول التحويل",
      fi: "Konversio-assetit",
    },
    keys: [
      "contactEmail",
      "whatsApp",
      "bookingLink",
      "includeAbout",
      "aboutText",
      "aboutImageUrl",
      "portfolioItemsRaw",
      "portfolioItemsJson",
    ],
  },
];

type Props = {
  initialAnswers?: Partial<QuestionnaireAnswers>;
  onChange?: (answers: QuestionnaireAnswers) => void;
  onGenerate?: (answers: QuestionnaireAnswers) => void;

  // backward compatibility
  onComplete?: (answers: QuestionnaireAnswers) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type UiLang = "en" | "fa" | "ar" | "fi";

function toUiLang(raw?: string): UiLang {
  const v = (raw ?? "").toLowerCase();
  if (v.includes("persian") || v.includes("farsi")) return "fa";
  if (v.includes("arabic")) return "ar";
  if (v.includes("finnish") || v.includes("suomi")) return "fi";
  return "en";
}

function normalizeLangCode(raw?: string): UiLang {
  return toUiLang(raw);
}

function pickUi<T>(lang: UiLang, map: Record<UiLang, T>): T {
  return map[lang] ?? map.en;
}

function ui(lang: UiLang, text: string) {
  const map: Record<UiLang, Record<string, string>> = {
    en: {},
    fa: {
      "Advanced mode": "حالت پیشرفته",
      "Ask anything — I’ll answer automatically.": "هر سوالی دارید بپرسید — خودکار پاسخ می‌دهم.",
      "Upload a photo or short video": "آپلود عکس یا ویدیوی کوتاه",
      "JPG/PNG/WebP or MP4/WebM. Max 25MB.": "JPG/PNG/WebP یا MP4/WebM. حداکثر ۲۵ مگابایت.",
      "Upload File": "آپلود فایل",
      "Uploading…": "در حال آپلود…",
      "Remove": "حذف",
      "Add item": "افزودن مورد",
      "Clear all": "پاک‌سازی همه",
      "No items yet. Click “Add item” to start.": "هنوز موردی نیست. برای شروع «افزودن مورد» را بزنید.",
      "Selected": "انتخاب شد",
      "Back": "بازگشت",
      "Next": "بعدی",
      "Generate Page": "ساخت صفحه",
      "Generating...": "در حال ساخت...",
      "Please upload an image or video file.": "لطفاً تصویر یا ویدیو آپلود کنید.",
      "File is too large. Please upload under 25MB.": "حجم فایل زیاد است. حداکثر ۲۵ مگابایت.",
      "Upload failed": "آپلود ناموفق بود",
      "Add up to 4 portfolio items. You can upload an image/video for each.":
        "حداکثر ۴ آیتم پورتفولیو اضافه کنید. برای هرکدام می‌توانید تصویر/ویدیو آپلود کنید.",
      "Upload Media": "آپلود مدیا",
      "Enter your country": "کشور خود را وارد کنید",
      "Enter your language": "زبان خود را وارد کنید",
      "Enter your service": "خدمت/سرویس خود را وارد کنید",
    },
    ar: {
      "Advanced mode": "وضع متقدم",
      "Upload a photo or short video": "ارفع صورة أو فيديو قصير",
      "JPG/PNG/WebP or MP4/WebM. Max 25MB.": "JPG/PNG/WebP أو MP4/WebM. الحد 25MB.",
      "Upload File": "رفع ملف",
      "Uploading…": "جارٍ الرفع…",
      "Remove": "حذف",
      "Add item": "إضافة عنصر",
      "Clear all": "مسح الكل",
      "No items yet. Click “Add item” to start.": "لا توجد عناصر بعد. اضغط «إضافة عنصر» للبدء.",
      "Selected": "تم الاختيار",
      "Back": "رجوع",
      "Next": "التالي",
      "Generate Page": "إنشاء الصفحة",
      "Generating...": "جارٍ الإنشاء...",
      "Please upload an image or video file.": "يرجى رفع صورة أو فيديو.",
      "File is too large. Please upload under 25MB.": "حجم الملف كبير. الحد 25MB.",
      "Upload failed": "فشل الرفع",
      "Add up to 4 portfolio items. You can upload an image/video for each.":
        "أضف حتى 4 عناصر أعمال. يمكنك رفع صورة/فيديو لكل عنصر.",
      "Upload Media": "رفع الوسائط",
      "Enter your country": "أدخل بلدك",
      "Enter your language": "أدخل لغتك",
      "Enter your service": "أدخل خدمتك",
    },
    fi: {
      "Advanced mode": "Edistynyt tila",
      "Upload a photo or short video": "Lataa kuva tai lyhyt video",
      "JPG/PNG/WebP or MP4/WebM. Max 25MB.": "JPG/PNG/WebP tai MP4/WebM. Max 25MB.",
      "Upload File": "Lataa tiedosto",
      "Uploading…": "Ladataan…",
      "Remove": "Poista",
      "Add item": "Lisää kohde",
      "Clear all": "Tyhjennä",
      "No items yet. Click “Add item” to start.": "Ei kohteita vielä. Aloita kohdasta ”Lisää kohde”.",
      "Selected": "Valittu",
      "Back": "Takaisin",
      "Next": "Seuraava",
      "Generate Page": "Luo sivu",
      "Generating...": "Luodaan...",
      "Please upload an image or video file.": "Lataa kuva tai video.",
      "File is too large. Please upload under 25MB.": "Tiedosto on liian suuri. Max 25MB.",
      "Upload failed": "Lataus epäonnistui",
      "Add up to 4 portfolio items. You can upload an image/video for each.":
        "Lisää enintään 4 portfolio‑kohdetta. Voit ladata kuvan/videon jokaiseen.",
      "Upload Media": "Lataa media",
      "Enter your country": "Syötä maasi",
      "Enter your language": "Syötä kielesi",
      "Enter your service": "Syötä palvelusi",
    },
  };
  return map[lang]?.[text] ?? text;
}

function parseJsonMap(value?: string): Record<string, string> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed)) {
      // Keep raw user text (including spaces) so textarea typing stays natural.
      out[k] = String(v ?? "");
    }
    return out;
  } catch {
    return {};
  }
}

const STEP_I18N: Record<UiLang, Partial<Record<keyof QuestionnaireAnswers, { title: string; subtitle: string }>>> = {
  en: {},
  fa: {
    language: {
      title: "زبان صفحه شما چیست؟",
      subtitle: "زبان دلخواه را انتخاب کنید (کشور را بعداً تعیین می‌کنید)",
    },
    businessName: { title: "نام کسب‌وکار شما چیست؟", subtitle: "در صفحه و گوگل نمایش داده می‌شود" },
    country: { title: "در کدام کشور هستید؟", subtitle: "برای اعتماد و سئوی محلی استفاده می‌شود" },
    serviceType: { title: "چه نوع خدمتی ارائه می‌دهید؟", subtitle: "دسته‌بندی مناسب را انتخاب کنید" },
    customServices: { title: "خدمات خاص دیگری دارید؟", subtitle: "خدماتی که در بالا نیست را اضافه کنید" },
    targetAudience: { title: "مخاطب ایده‌آل شما کیست؟", subtitle: "بهترین مخاطب خود را انتخاب کنید" },
    businessStage: { title: "کسب‌وکار شما در چه مرحله‌ای است؟", subtitle: "برای موقعیت‌یابی بهتر" },
    primaryGoal: { title: "هدف اصلی شما از این صفحه چیست؟", subtitle: "صفحه بر همین اساس بهینه می‌شود" },
    experienceLevel: { title: "چقدر تجربه دارید؟", subtitle: "سابقه شما برجسته می‌شود" },
    pricingApproach: { title: "قیمت‌گذاری شما چگونه است؟", subtitle: "برای نحوه ارزش‌گذاری" },
    keyDifferentiator: { title: "چه چیزی شما را متمایز می‌کند؟", subtitle: "مزیت رقابتی اصلی را انتخاب کنید" },
    trustFactor: { title: "چه چیزی اعتماد می‌سازد؟", subtitle: "مهم‌ترین عامل اعتماد" },
    includeAbout: { title: "بخش «درباره» داشته باشید؟", subtitle: "داستان خود را بیان کنید" },
    aboutText: { title: "یک متن کوتاه درباره شما (اختیاری)", subtitle: "چند جمله درباره شما و نحوه کمک‌تان" },
    aboutImageUrl: { title: "تصویر درباره (اختیاری)", subtitle: "آپلود عکس/ویدیو یا وارد کردن لینک" },
    contactEmail: { title: "ایمیل تماس", subtitle: "در بخش تماس نمایش داده می‌شود" },
    whatsApp: { title: "شماره واتساپ (اختیاری)", subtitle: "با کد کشور (مثلاً ‎+98...)" },
    bookingLink: { title: "لینک رزرو (اختیاری)", subtitle: "Calendly / TidyCal / Google Calendar" },
    problemStatement: { title: "چه مشکلی را حل می‌کنید؟", subtitle: "یک جمله مشخص" },
    outcomeStatement: { title: "چه نتیجه‌ای می‌سازید؟", subtitle: "نتیجه‌ای که مشتری می‌خواهد" },
    proofLine: { title: "یک خط اعتبار/اثبات", subtitle: "مثال: ۴.۹/۵ • ۱۲۰+ مشتری" },
    niche: { title: "حوزه/صنعت شما (اختیاری)", subtitle: "مثال: SaaS، املاک، سلامت" },
    processStep1: { title: "فرآیند شما — گام ۱", subtitle: "مثال: ارزیابی و هدف‌گذاری" },
    processStep2: { title: "فرآیند شما — گام ۲", subtitle: "مثال: برنامه‌ریزی و اجرا" },
    processStep3: { title: "فرآیند شما — گام ۳", subtitle: "مثال: تحویل و بهینه‌سازی" },
    portfolioItemsRaw: { title: "هایلایت‌های پورتفولیو (اختیاری)", subtitle: "هر خط: عنوان | توضیح | متریک" },
    portfolioItemsJson: { title: "آیتم‌های پورتفولیو (اختیاری)", subtitle: "پروژه واقعی + متریک + تصویر" },
  },
  ar: {
    language: { title: "ما لغة صفحتك؟", subtitle: "اختر اللغة المفضلة (البلد لاحقًا)" },
    businessName: { title: "ما اسم نشاطك؟", subtitle: "سيظهر في الصفحة وجوجل" },
    country: { title: "في أي بلد أنت؟", subtitle: "يُستخدم للسياق المحلي والثقة" },
    serviceType: { title: "ما نوع الخدمة التي تقدمها؟", subtitle: "اختر الفئة الأنسب" },
    customServices: { title: "هل لديك خدمات خاصة أخرى؟", subtitle: "أضف خدمات غير مذكورة" },
    targetAudience: { title: "من هم عملاؤك المثاليون؟", subtitle: "اختر جمهورك الأفضل" },
    businessStage: { title: "ما مرحلة عملك؟", subtitle: "يساعدنا في التموضع" },
    primaryGoal: { title: "ما هدفك الرئيسي؟", subtitle: "سنحسّن الصفحة لهذا الهدف" },
    experienceLevel: { title: "كم خبرتك؟", subtitle: "سنبرز خبرتك" },
    pricingApproach: { title: "كيف تسعّر خدماتك؟", subtitle: "يؤثر على طريقة عرض القيمة" },
    keyDifferentiator: { title: "ما الذي يميزك؟", subtitle: "اختر أهم ميزة" },
    trustFactor: { title: "ما الذي يبني الثقة؟", subtitle: "اختر أقوى عامل ثقة" },
    includeAbout: { title: "هل تريد قسم «من نحن»؟", subtitle: "أخبر قصتك" },
    aboutText: { title: "اكتب نبذة قصيرة (اختياري)", subtitle: "جمل قليلة عنك وعن القيمة التي تقدمها" },
    aboutImageUrl: { title: "أضف صورة «من نحن» (اختياري)", subtitle: "ارفع صورة/فيديو أو أضف رابطًا" },
    contactEmail: { title: "البريد الإلكتروني", subtitle: "يظهر في قسم التواصل" },
    whatsApp: { title: "رقم واتساب (اختياري)", subtitle: "مع رمز الدولة" },
    bookingLink: { title: "رابط الحجز (اختياري)", subtitle: "Calendly / TidyCal / Google Calendar" },
    problemStatement: { title: "ما المشكلة التي تحلها؟", subtitle: "جملة واحدة واضحة" },
    outcomeStatement: { title: "ما النتيجة التي تحققها؟", subtitle: "النتيجة التي يريدها العميل" },
    proofLine: { title: "سطر إثبات/مصداقية", subtitle: "مثال: 4.9/5 • +120 عميل" },
    niche: { title: "مجالك/صناعتك (اختياري)", subtitle: "مثال: SaaS، عقارات، صحة" },
    processStep1: { title: "خطوتك — 1", subtitle: "مثال: تدقيق وتحديد أهداف" },
    processStep2: { title: "خطوتك — 2", subtitle: "مثال: خطة وتنفيذ" },
    processStep3: { title: "خطوتك — 3", subtitle: "مثال: تسليم وتحسين" },
    portfolioItemsRaw: { title: "أبرز الأعمال (اختياري)", subtitle: "كل سطر: عنوان | وصف | رقم" },
    portfolioItemsJson: { title: "عناصر الأعمال (اختياري)", subtitle: "مشاريع حقيقية + أرقام + صور" },
  },
  fi: {
    language: { title: "Mikä on sivusi kieli?", subtitle: "Valitse kieli (maa myöhemmin)" },
    businessName: { title: "Yrityksesi nimi?", subtitle: "Näkyy sivulla ja Googlessa" },
    country: { title: "Missä maassa toimit?", subtitle: "Paikallinen luottamus ja SEO" },
    serviceType: { title: "Mitä palvelua tarjoat?", subtitle: "Valitse sopivin kategoria" },
    customServices: { title: "Erityiset palvelut?", subtitle: "Lisää palvelut, joita ei listassa ole" },
    targetAudience: { title: "Kenelle palvelet?", subtitle: "Valitse paras kohderyhmä" },
    businessStage: { title: "Missä vaiheessa yritys on?", subtitle: "Asettaa oikean positioinnin" },
    primaryGoal: { title: "Mikä on päätavoite?", subtitle: "Optimointi tehdään tämän mukaan" },
    experienceLevel: { title: "Kuinka paljon kokemusta?", subtitle: "Korostamme kokemusta oikein" },
    pricingApproach: { title: "Miten hinnoittelet?", subtitle: "Vaikuttaa arvon viestintään" },
    keyDifferentiator: { title: "Mikä erottaa sinut?", subtitle: "Valitse vahvin etu" },
    trustFactor: { title: "Mikä rakentaa luottamusta?", subtitle: "Valitse tärkein todiste" },
    includeAbout: { title: "Lisätäänkö ”Meistä”-osio?", subtitle: "Kerro tarinasi" },
    aboutText: { title: "Kirjoita lyhyt esittely (valinnainen)", subtitle: "Muutama lause sinusta" },
    aboutImageUrl: { title: "Lisää kuva (valinnainen)", subtitle: "Lataa kuva/video tai lisää URL" },
    contactEmail: { title: "Yhteyssähköposti", subtitle: "Näytetään yhteystiedoissa" },
    whatsApp: { title: "WhatsApp-numero (valinnainen)", subtitle: "Kansainvälinen muoto" },
    bookingLink: { title: "Varauslinkki (valinnainen)", subtitle: "Calendly / TidyCal / Google Calendar" },
    problemStatement: { title: "Minkä ongelman ratkaiset?", subtitle: "Yksi selkeä lause" },
    outcomeStatement: { title: "Minkä lopputuloksen tuotat?", subtitle: "Asiakkaan toivoma lopputulos" },
    proofLine: { title: "Lisää todiste/luotettavuus", subtitle: "Esim: 4.9/5 • 120+ asiakasta" },
    niche: { title: "Toimiala (valinnainen)", subtitle: "Esim: SaaS, kiinteistöt, hyvinvointi" },
    processStep1: { title: "Prosessi — vaihe 1", subtitle: "Esim: auditointi ja tavoitteet" },
    processStep2: { title: "Prosessi — vaihe 2", subtitle: "Esim: suunnitelma ja toteutus" },
    processStep3: { title: "Prosessi — vaihe 3", subtitle: "Esim: toimitus ja optimointi" },
    portfolioItemsRaw: { title: "Portfolio‑kohdat (valinnainen)", subtitle: "Rivi: Otsikko | Kuvaus | Mittari" },
    portfolioItemsJson: { title: "Portfolio‑kohdat (valinnainen)", subtitle: "Projektit + mittarit + media" },
  },
};

const OPTION_I18N: Record<UiLang, Partial<Record<keyof QuestionnaireAnswers, Record<string, { title: string; desc: string }>>>> =
  {
    en: {},
    fa: {
      serviceType: {
        consulting: { title: "مشاوره کسب‌وکار", desc: "استراتژی، عملیات یا مدیریت" },
        coaching: { title: "کوچینگ و آموزش", desc: "کوچینگ زندگی/شغلی یا مهارتی" },
        design: { title: "خدمات طراحی", desc: "برندینگ، گرافیک یا UI/UX" },
        development: { title: "توسعه وب/نرم‌افزار", desc: "وبسایت، اپ یا نرم‌افزار سفارشی" },
        marketing: { title: "بازاریابی و تبلیغات", desc: "دیجیتال مارکتینگ، سئو، شبکه اجتماعی" },
        creative: { title: "خدمات خلاق", desc: "عکاسی، ویدیو، تولید محتوا" },
        legal: { title: "خدمات حقوقی", desc: "مشاوره یا خدمات حقوقی تخصصی" },
        accounting: { title: "حسابداری و مالی", desc: "دفتر‌داری، مالیات، برنامه مالی" },
        other: { title: "سایر", desc: "خدمات اختصاصی" },
      },
      targetAudience: {
        individuals: { title: "افراد و مصرف‌کنندگان", desc: "مشتریان شخصی" },
        freelancers: { title: "فریلنسرها و سولـوپرنرها", desc: "حرفه‌ای‌های مستقل" },
        "small-business": { title: "کسب‌وکارهای کوچک", desc: "۱ تا ۵۰ نفر" },
        "medium-business": { title: "کسب‌وکارهای متوسط", desc: "۵۰ تا ۲۵۰ نفر" },
        enterprise: { title: "سازمان‌های بزرگ", desc: "نیازهای پیچیده سازمانی" },
      },
      businessStage: {
        starting: { title: "تازه شروع کرده‌ام", desc: "در حال ساخت اولین مشتری‌ها" },
        established: { title: "تثبیت شده و در حال رشد", desc: "پایه مشتری ثابت" },
        scaling: { title: "در حال مقیاس‌دادن", desc: "آماده سیستم‌سازی و رشد" },
      },
      primaryGoal: {
        leads: { title: "جذب سرنخ باکیفیت", desc: "جمع‌آوری اطلاعات تماس" },
        calls: { title: "رزرو تماس", desc: "گرفتن مشاوره/کال" },
        packages: { title: "فروش پکیج خدمات", desc: "نمایش و فروش خدمات" },
        credibility: { title: "افزایش اعتبار", desc: "ساخت اعتماد و اقتدار" },
      },
      experienceLevel: {
        new: { title: "کمتر از ۲ سال", desc: "رویکردهای مدرن" },
        intermediate: { title: "۲ تا ۵ سال", desc: "نتایج واقعی و اثبات‌شده" },
        expert: { title: "۵ تا ۱۰ سال", desc: "تخصص عمیق" },
        veteran: { title: "۱۰+ سال", desc: "سابقه بسیار بالا" },
      },
      pricingApproach: {
        budget: { title: "اقتصادی", desc: "ارزش بالا برای قیمت مناسب" },
        competitive: { title: "رقابتی", desc: "متعادل و منصفانه" },
        premium: { title: "پریمیوم", desc: "سطح بالا با قیمت ممتاز" },
        custom: { title: "فقط قیمت سفارشی", desc: "هر پروژه قیمت جداگانه" },
      },
      keyDifferentiator: {
        speed: { title: "سرعت بالا", desc: "تحویل سریع بدون افت کیفیت" },
        quality: { title: "کیفیت عالی", desc: "دقت بالا و استاندارد ممتاز" },
        expertise: { title: "تخصص متمرکز", desc: "دانش عمیق در حوزه خاص" },
        personal: { title: "شخصی‌سازی", desc: "رویکرد متناسب با هر مشتری" },
        results: { title: "نتیجه‌محور", desc: "سابقه موفقیت قابل اندازه‌گیری" },
      },
      trustFactor: {
        certifications: { title: "گواهی و مدارک", desc: "استانداردهای حرفه‌ای" },
        experience: { title: "سال‌های تجربه", desc: "سابقه طولانی در صنعت" },
        results: { title: "نتایج و ROI", desc: "خروجی‌های اثبات‌شده" },
        guarantee: { title: "گارانتی رضایت", desc: "تعهد یا بازگشت وجه" },
        portfolio: { title: "نمونه‌کارها", desc: "پروژه‌های انجام‌شده" },
      },
      includeAbout: {
        yes: { title: "بله، اضافه شود", desc: "داستان و ماموریت شما" },
        no: { title: "خیر، حذف شود", desc: "تمرکز روی خدمات" },
      },
    },
    ar: {
      serviceType: {
        consulting: { title: "استشارات أعمال", desc: "استراتيجية أو تشغيل" },
        coaching: { title: "إرشاد وتدريب", desc: "إرشاد مهني أو مهاري" },
        design: { title: "خدمات تصميم", desc: "براند أو UI/UX" },
        development: { title: "تطوير ويب/برمجيات", desc: "مواقع وتطبيقات مخصصة" },
        marketing: { title: "تسويق وإعلان", desc: "تسويق رقمي أو سوشيال" },
        creative: { title: "خدمات إبداعية", desc: "تصوير وفيديو ومحتوى" },
        legal: { title: "خدمات قانونية", desc: "استشارات قانونية متخصصة" },
        accounting: { title: "محاسبة ومالية", desc: "دفاتر وضرائب" },
        other: { title: "أخرى", desc: "خدمات مخصصة" },
      },
      targetAudience: {
        individuals: { title: "أفراد ومستهلكون", desc: "عملاء أفراد" },
        freelancers: { title: "مستقلون", desc: "محترفون مستقلون" },
        "small-business": { title: "شركات صغيرة", desc: "1-50 موظف" },
        "medium-business": { title: "شركات متوسطة", desc: "50-250 موظف" },
        enterprise: { title: "مؤسسات كبيرة", desc: "احتياجات معقدة" },
      },
      businessStage: {
        starting: { title: "بداية", desc: "بناء أول العملاء" },
        established: { title: "راسخة وتنمو", desc: "قاعدة عملاء ثابتة" },
        scaling: { title: "توسّع", desc: "جاهز للتمدد" },
      },
      primaryGoal: {
        leads: { title: "توليد عملاء محتملين", desc: "جمع معلومات الاتصال" },
        calls: { title: "حجز مكالمات", desc: "جدولة استشارات" },
        packages: { title: "بيع باقات", desc: "عرض وبيع الخدمات" },
        credibility: { title: "بناء المصداقية", desc: "تعزيز الثقة" },
      },
      experienceLevel: {
        new: { title: "أقل من سنتين", desc: "نهج حديث" },
        intermediate: { title: "2-5 سنوات", desc: "سجل مثبت" },
        expert: { title: "5-10 سنوات", desc: "خبرة عميقة" },
        veteran: { title: "10+ سنوات", desc: "خبرة واسعة" },
      },
      pricingApproach: {
        budget: { title: "اقتصادي", desc: "قيمة مقابل سعر" },
        competitive: { title: "تنافسي", desc: "تسعير متوازن" },
        premium: { title: "فاخر", desc: "خدمة راقية" },
        custom: { title: "تسعير مخصص", desc: "حسب المشروع" },
      },
      keyDifferentiator: {
        speed: { title: "سرعة", desc: "تسليم سريع" },
        quality: { title: "جودة عالية", desc: "تفاصيل دقيقة" },
        expertise: { title: "خبرة متخصصة", desc: "معرفة عميقة" },
        personal: { title: "خدمة مخصصة", desc: "نهج شخصي" },
        results: { title: "نتائج مثبتة", desc: "أثر ملموس" },
      },
      trustFactor: {
        certifications: { title: "شهادات", desc: "اعتمادات مهنية" },
        experience: { title: "سنوات خبرة", desc: "وقت طويل في المجال" },
        results: { title: "نتائج العملاء", desc: "قصص نجاح" },
        guarantee: { title: "ضمان رضا", desc: "وعد خالٍ من المخاطر" },
        portfolio: { title: "معرض أعمال", desc: "مشاريع منجزة" },
      },
      includeAbout: {
        yes: { title: "نعم، أضف", desc: "شارك القصة" },
        no: { title: "لا، تخطَ", desc: "التركيز على الخدمات" },
      },
    },
    fi: {
      serviceType: {
        consulting: { title: "Konsultointi", desc: "Strategia tai operointi" },
        coaching: { title: "Valmennus", desc: "Ura tai taidot" },
        design: { title: "Suunnittelu", desc: "Brändi tai UI/UX" },
        development: { title: "Kehitys", desc: "Verkko ja sovellukset" },
        marketing: { title: "Markkinointi", desc: "SEO ja some" },
        creative: { title: "Luovat palvelut", desc: "Kuva, video, sisältö" },
        legal: { title: "Lakipalvelut", desc: "Lakineuvonta" },
        accounting: { title: "Talous", desc: "Kirjanpito ja verot" },
        other: { title: "Muu", desc: "Räätälöidyt palvelut" },
      },
      targetAudience: {
        individuals: { title: "Yksityishenkilöt", desc: "Henkilöasiakkaat" },
        freelancers: { title: "Freelancerit", desc: "Itsenäiset ammattilaiset" },
        "small-business": { title: "Pienyritykset", desc: "1–50 työntekijää" },
        "medium-business": { title: "Keskisuuret", desc: "50–250 työntekijää" },
        enterprise: { title: "Suuret yritykset", desc: "Monimutkaiset tarpeet" },
      },
      businessStage: {
        starting: { title: "Aloitus", desc: "Ensimmäiset asiakkaat" },
        established: { title: "Vakiintunut", desc: "Kasvussa oleva yritys" },
        scaling: { title: "Skaalaus", desc: "Valmis kasvattamaan" },
      },
      primaryGoal: {
        leads: { title: "Liidit", desc: "Kerää yhteystiedot" },
        calls: { title: "Varaa puhelut", desc: "Konsultaatioita" },
        packages: { title: "Myy paketit", desc: "Palvelupaketit esiin" },
        credibility: { title: "Uskottavuus", desc: "Rakenna luottamus" },
      },
      experienceLevel: {
        new: { title: "Alle 2 vuotta", desc: "Moderni ote" },
        intermediate: { title: "2–5 vuotta", desc: "Todistetut tulokset" },
        expert: { title: "5–10 vuotta", desc: "Syvä osaaminen" },
        veteran: { title: "10+ vuotta", desc: "Laaja kokemus" },
      },
      pricingApproach: {
        budget: { title: "Edullinen", desc: "Hyvä hinta‑laatu" },
        competitive: { title: "Kilpailukykyinen", desc: "Tasapainoinen hinnoittelu" },
        premium: { title: "Premium", desc: "Huipputaso" },
        custom: { title: "Räätälöity", desc: "Projektikohtainen" },
      },
      keyDifferentiator: {
        speed: { title: "Nopea", desc: "Nopea toimitus" },
        quality: { title: "Laadukas", desc: "Tarkka viimeistely" },
        expertise: { title: "Asiantuntijuus", desc: "Syvä osaaminen" },
        personal: { title: "Henkilökohtainen", desc: "Räätälöity palvelu" },
        results: { title: "Tulokset", desc: "Mitattava vaikutus" },
      },
      trustFactor: {
        certifications: { title: "Sertifikaatit", desc: "Ammatilliset pätevyydet" },
        experience: { title: "Kokemus", desc: "Pitkä historia alalla" },
        results: { title: "Tulokset", desc: "Onnistumiset ja ROI" },
        guarantee: { title: "Tyytyväisyystakuu", desc: "Riskitön lupaus" },
        portfolio: { title: "Portfolio", desc: "Valmiit projektit" },
      },
      includeAbout: {
        yes: { title: "Kyllä", desc: "Kerro tarinasi" },
        no: { title: "Ei", desc: "Vain palvelut" },
      },
    },
  };

function localizeStep(lang: UiLang, step: Step) {
  const i18n = STEP_I18N[lang]?.[step.key];
  const title = i18n?.title ?? step.title;
  const subtitle = i18n?.subtitle ?? step.subtitle;
  const optMap = OPTION_I18N[lang]?.[step.key];
  const options =
    step.options?.map((opt) => {
      const o = optMap?.[opt.value];
      return o ? { ...opt, title: o.title, desc: o.desc } : opt;
    }) ?? [];
  return { ...step, title, subtitle, options };
}
function normalizeCountry(country?: string, countryOther?: string) {
  if (country === "Other") return (countryOther ?? "").trim();
  return (country ?? "").trim();
}

function getLanguageOptions(country?: string, countryOther?: string, uiLang: UiLang = "en"): Option[] {
  const base: Option[] = [
    { value: "English", title: "English", desc: "Global default" },
    { value: "Arabic", title: "Arabic", desc: "العربية" },
    { value: "Persian", title: "Persian (Farsi)", desc: "فارسی" },
    { value: "Finnish", title: "Finnish", desc: "Suomi" },
    { value: "Swedish", title: "Swedish", desc: "Svenska" },
    { value: "German", title: "German", desc: "Deutsch" },
    { value: "French", title: "French", desc: "Français" },
    { value: "Spanish", title: "Spanish", desc: "Español" },
    {
      value: "Other",
      title: pickUi(uiLang, {
        en: "Other",
        fa: "سایر",
        ar: "أخرى",
        fi: "Muu",
      }),
      desc: pickUi(uiLang, {
        en: "Add your own language",
        fa: "زبان دلخواه را وارد کنید",
        ar: "أدخل لغتك",
        fi: "Lisää oma kieli",
      }),
    },
  ];

  const normalized = normalizeCountry(country, countryOther).toLowerCase();
  if (!normalized) return base;

  if (normalized.includes("finland")) {
    return [
      { value: "Finnish", title: "Finnish", desc: "Suomi" },
      { value: "Swedish", title: "Swedish", desc: "Svenska" },
      { value: "English", title: "English", desc: "Global default" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("sweden")) {
    return [
      { value: "Swedish", title: "Swedish", desc: "Svenska" },
      { value: "English", title: "English", desc: "Global default" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("norway") || normalized.includes("denmark")) {
    return [
      { value: "English", title: "English", desc: "Global default" },
      { value: "Swedish", title: "Swedish", desc: "Svenska" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("germany")) {
    return [
      { value: "German", title: "German", desc: "Deutsch" },
      { value: "English", title: "English", desc: "Global default" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("netherlands")) {
    return [
      { value: "English", title: "English", desc: "Global default" },
      { value: "German", title: "German", desc: "Deutsch" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("uk") || normalized.includes("united") || normalized.includes("usa") || normalized.includes("canada") || normalized.includes("australia")) {
    return [
      { value: "English", title: "English", desc: "Global default" },
      { value: "French", title: "French", desc: "Français" },
      { value: "Spanish", title: "Spanish", desc: "Español" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("iran")) {
    return [
      { value: "Persian", title: "Persian (Farsi)", desc: "فارسی" },
      { value: "Arabic", title: "Arabic", desc: "العربية" },
      { value: "English", title: "English", desc: "Global default" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }
  if (normalized.includes("uae") || normalized.includes("saudi") || normalized.includes("qatar") || normalized.includes("kuwait") || normalized.includes("oman") || normalized.includes("bahrain") || normalized.includes("arab")) {
    return [
      { value: "Arabic", title: "Arabic", desc: "العربية" },
      { value: "English", title: "English", desc: "Global default" },
      {
        value: "Other",
        title: pickUi(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickUi(uiLang, {
          en: "Add your own language",
          fa: "زبان دلخواه را وارد کنید",
          ar: "أدخل لغتك",
          fi: "Lisää oma kieli",
        }),
      },
    ];
  }

  return base;
}

function getDefaultLanguage(country?: string, countryOther?: string) {
  const options = getLanguageOptions(country, countryOther, "en");
  const first = options.find((o) => o.value !== "Other");
  return first?.value ?? "English";
}

export function Questionnaire({ initialAnswers, onChange, onGenerate, onComplete }: Props) {
  const DRAFT_KEY = "dp:questionnaire:draft:v1";
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [languageTouched, setLanguageTouched] = React.useState(false);
  const [portfolioItems, setPortfolioItems] = React.useState<
    { title: string; description: string; metric: string; imageUrl?: string }[]
  >([]);

  const STEPS = BASE_STEPS;

  const total = STEPS.length;

  const [stepIndex, setStepIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Partial<QuestionnaireAnswers>>(initialAnswers ?? {});

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialAnswers) return;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<QuestionnaireAnswers> | null;
      if (!parsed || typeof parsed !== "object" || Object.keys(parsed).length === 0) return;
      setAnswers(parsed);
    } catch {
      // ignore corrupted draft cache
    }
  }, [initialAnswers, DRAFT_KEY]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (Object.keys(answers ?? {}).length === 0) return;
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch {
      // ignore draft save errors
    }
  }, [answers, DRAFT_KEY]);

  React.useEffect(() => {
    if (!initialAnswers) return;
    setAnswers((prev) => {
      const prevKeys = Object.keys(prev ?? {});
      if (prevKeys.length === 0) return { ...initialAnswers };
      if (!prev.language && initialAnswers.language) {
        return { ...prev, language: initialAnswers.language };
      }
      return prev;
    });
    if (!languageTouched && initialAnswers.language) {
      setLanguageTouched(true);
    }
  }, [initialAnswers, languageTouched]);

  // Auto-select language based on country when user has not chosen a language
  React.useEffect(() => {
    const hasCountry = Boolean(answers.country);
    if (!hasCountry) return;
    if (languageTouched) return;

    const options = getLanguageOptions(answers.country, answers.countryOther, "en");
    const isValid = options.some((o) => o.value === answers.language);

    if (!answers.language || !isValid) {
      setAnswers((prev) => ({
        ...prev,
        language: getDefaultLanguage(prev.country, prev.countryOther),
      }));
    }
  }, [answers.country, answers.countryOther, answers.language, languageTouched]);

  React.useEffect(() => {
    setStepIndex((s) => clamp(s, 0, total - 1));
  }, [total]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stepIndex]);

  const uiLang = toUiLang(answers.language);
  const step = localizeStep(uiLang, STEPS[stepIndex]);
  const currentValue = answers[step.key] as string | undefined;
  const selectedPrimaryGoals =
    Array.isArray(answers.primaryGoals) && answers.primaryGoals.length > 0
      ? answers.primaryGoals
      : answers.primaryGoal
      ? [answers.primaryGoal]
      : [];
  const selectedTrustFactors =
    Array.isArray(answers.trustFactors) && answers.trustFactors.length > 0
      ? answers.trustFactors
      : answers.trustFactor
      ? [answers.trustFactor]
      : [];
  const trustFactorNotes = parseJsonMap(answers.trustFactorNotesJson);

  const progress = Math.round(((stepIndex + 1) / total) * 100);
  const isInputStep = step.options.length === 0;
  const currentSection = STEP_SECTIONS.find((section) => section.keys.includes(step.key)) ?? STEP_SECTIONS[0];
  const sectionStartIndexMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    STEP_SECTIONS.forEach((section) => {
      const firstIdx = STEPS.findIndex((s) => section.keys.includes(s.key));
      map[section.id] = firstIdx >= 0 ? firstIdx : 0;
    });
    return map;
  }, []);
  const sectionProgress = Math.round(
    ((stepIndex + 1) / total) * 100
  );

  const needsCountryOther = step.key === "country" && currentValue === "Other";
  const needsLanguageOther = step.key === "language" && currentValue === "Other";
  const needsServiceOther = step.key === "serviceType" && currentValue === "other";
  const requiresPackageDetails = selectedPrimaryGoals.includes("packages");
  const hasTrustNotesForAllSelected =
    selectedTrustFactors.length > 0 &&
    selectedTrustFactors.every((factor) =>
      Boolean((trustFactorNotes[factor] ?? "").toString().trim())
    );
  const optionalInputKeys: Array<keyof QuestionnaireAnswers> = [
    "niche",
    "aboutText",
    "aboutImageUrl",
    "whatsApp",
    "bookingLink",
    "portfolioItemsRaw",
    "portfolioItemsJson",
  ];

  const canGoNext = isInputStep
    ? optionalInputKeys.includes(step.key)
      ? true
      : step.key === "customServices"
      ? requiresPackageDetails
        ? Boolean((answers.customServices ?? "").toString().trim())
        : true
      : Boolean((currentValue ?? "").toString().trim())
    : (step.key === "primaryGoal"
        ? selectedPrimaryGoals.length > 0
        : step.key === "trustFactor"
        ? hasTrustNotesForAllSelected
        : Boolean(currentValue)) &&
      (!needsCountryOther ||
        Boolean((answers.countryOther ?? "").toString().trim())) &&
      (!needsLanguageOther ||
        Boolean((answers.languageOther ?? "").toString().trim())) &&
      (!needsServiceOther ||
        Boolean((answers.serviceTypeOther ?? "").toString().trim()));

  const update = (patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  };

  React.useEffect(() => {
    onChange?.(answers as QuestionnaireAnswers);
  }, [answers, onChange]);

  const setValue = (value: string) => {
    if (step.key === "primaryGoal") {
      const prev = selectedPrimaryGoals as string[];
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      update({
        primaryGoals: next as QuestionnaireAnswers["primaryGoals"],
        primaryGoal: (next[0] as QuestionnaireAnswers["primaryGoal"]) ?? undefined,
      });
      return;
    }

    if (step.key === "trustFactor") {
      const prev = selectedTrustFactors as string[];
      const next = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];
      const nextNotes = { ...trustFactorNotes };
      Object.keys(nextNotes).forEach((k) => {
        if (!next.includes(k)) delete nextNotes[k];
      });
      update({
        trustFactors: next as QuestionnaireAnswers["trustFactors"],
        trustFactor: (next[0] as QuestionnaireAnswers["trustFactor"]) ?? undefined,
        trustFactorNotesJson: JSON.stringify(nextNotes),
      });
      return;
    }

    if (step.key === "language") setLanguageTouched(true);
    if (step.key === "language" && typeof window !== "undefined") {
      const code = normalizeLangCode(value);
      window.localStorage.setItem("dp_lang", code);
      window.dispatchEvent(new CustomEvent("dp:lang", { detail: code }));
    }
    update({ [step.key]: value as any });
  };

  const goBack = () => {
    setStepIndex((s) => Math.max(0, s - 1));
  };

  const jumpToSection = (sectionId: StepSection["id"]) => {
    const idx = sectionStartIndexMap[sectionId] ?? 0;
    setStepIndex(Math.max(0, Math.min(total - 1, idx)));
  };

  const jumpToStep = (idx: number) => {
    setStepIndex(Math.max(0, Math.min(total - 1, idx)));
  };

  const goNext = async () => {
    if (!canGoNext || isSubmitting) return;

    if (stepIndex < total - 1) {
      setStepIndex((s) => Math.min(total - 1, s + 1));
      return;
    }

    const final = answers as QuestionnaireAnswers;
    setIsSubmitting(true);
    try {
      await Promise.resolve(onGenerate?.(final));
      await Promise.resolve(onComplete?.(final));
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(DRAFT_KEY);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadMedia = async (file: File) => {
    if (!file) return;
    setUploadError(null);

    const allowed = file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!allowed) {
      setUploadError(ui(toUiLang(answers.language), "Please upload an image or video file."));
      return;
    }

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(ui(toUiLang(answers.language), "File is too large. Please upload under 25MB."));
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data?.error ?? ui(toUiLang(answers.language), "Upload failed")
        );

      return data.url as string;
    } catch (e: any) {
      setUploadError(
        e?.message ?? ui(toUiLang(answers.language), "Upload failed")
      );
      return null;
    } finally {
      setUploading(false);
    }
  };

  const syncPortfolioJson = (
    next: { title: string; description: string; metric: string; imageUrl?: string }[]
  ) => {
    setPortfolioItems(next);
    try {
      const clean = next.filter((i) => i.title || i.description || i.metric || i.imageUrl);
      setValue(JSON.stringify(clean));
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    if (step.key !== "portfolioItemsJson") return;
    const raw = (answers.portfolioItemsJson as string) || "";
    if (!raw) {
      if (portfolioItems.length === 0) return;
      setPortfolioItems([]);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setPortfolioItems(
          parsed.map((p) => ({
            title: String(p.title ?? ""),
            description: String(p.description ?? ""),
            metric: String(p.metric ?? ""),
            imageUrl: p.imageUrl ? String(p.imageUrl) : undefined,
          }))
        );
      }
    } catch {
      // ignore parse errors
    }
  }, [step.key, answers.portfolioItemsJson]);

  const headerQuestionCountText = pickUi(uiLang, {
    en: "Answer a few quick questions to get your personalized landing page",
    fa: "به چند سؤال سریع پاسخ دهید تا لندینگ شخصی شما ساخته شود",
    ar: "أجب عن بعض الأسئلة السريعة للحصول على صفحة مخصصة",
    fi: "Vastaa muutamaan nopeaan kysymykseen saadaksesi henkilökohtaisen sivun",
  });
  const questionLabel = pickUi(uiLang, {
    en: `Question ${stepIndex + 1} of ${total}`,
    fa: `سؤال ${stepIndex + 1} از ${total}`,
    ar: `السؤال ${stepIndex + 1} من ${total}`,
    fi: `Kysymys ${stepIndex + 1} / ${total}`,
  });
  const landingTag = pickUi(uiLang, {
    en: "Landing Page Generator",
    fa: "سازنده لندینگ پیج",
    ar: "منشئ صفحة هبوط",
    fi: "Laskeutumissivun generaattori",
  });
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 text-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-gray-100"
      dir={uiLang === "fa" || uiLang === "ar" ? "rtl" : "ltr"}
    >
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-xl dark:border-gray-700 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Donepage
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45),rgba(255,255,255,0.85))]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col px-4 pb-14 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-slate-900/70">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{landingTag}</span>
          </div>

          <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            {headerQuestionCountText}
          </h1>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="font-semibold text-gray-800 dark:text-gray-200">
              {questionLabel}
            </div>
            <div className="font-bold text-gray-900 dark:text-gray-100">{progress}%</div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {STEP_SECTIONS.map((section) => {
              const active = section.id === currentSection.id;
              const label = section.label[uiLang] ?? section.label.en;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jumpToSection(section.id)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs font-semibold transition",
                    active
                      ? "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                      : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-700 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:text-blue-200",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
            <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">
              {sectionProgress}%
            </span>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
              {pickUi(uiLang, {
                en: "Jump to question",
                fa: "پرش به سؤال",
                ar: "الانتقال إلى سؤال",
                fi: "Siirry kysymykseen",
              })}
            </label>
            <select
              value={stepIndex}
              onChange={(e) => jumpToStep(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-900 dark:text-gray-100"
            >
              {STEPS.map((s, idx) => {
                const localized = localizeStep(uiLang, s);
                return (
                  <option key={`${String(s.key)}-${idx}`} value={idx}>
                    {pickUi(uiLang, {
                      en: `Q${idx + 1}: ${localized.title}`,
                      fa: `س${idx + 1}: ${localized.title}`,
                      ar: `س${idx + 1}: ${localized.title}`,
                      fi: `K${idx + 1}: ${localized.title}`,
                    })}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-white/80 ring-1 ring-gray-200 dark:bg-slate-800 dark:ring-gray-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="mx-auto mt-8 w-full max-w-3xl border border-gray-200 bg-white/85 shadow-xl shadow-blue-500/5 backdrop-blur-xl dark:border-gray-700 dark:bg-slate-900/85">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-2">
              <div className="text-xl font-bold tracking-tight text-gray-950 dark:text-gray-100 sm:text-2xl">
                {step.title}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 sm:text-base">{step.subtitle}</div>
            </div>

            {!canGoNext ? (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {ui(uiLang, "Complete this step to continue.")}
              </div>
            ) : null}

            {/* INPUT STEP */}
            {isInputStep ? (
              <div className="mt-6 space-y-3">
                {step.key === "aboutText" ? (
                  <textarea
                    placeholder={pickUi(uiLang, {
                      en: "Write a short About section...",
                      fa: "یک متن کوتاه درباره خود بنویسید...",
                      ar: "اكتب نبذة قصيرة عنك...",
                      fi: "Kirjoita lyhyt esittely...",
                    })}
                    value={(answers.aboutText as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                ) : step.key === "aboutImageUrl" ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-4">
                      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {ui(uiLang, "Upload a photo or short video")}
                          </div>
                          <div className="text-xs text-gray-600">
                            {ui(uiLang, "JPG/PNG/WebP or MP4/WebM. Max 25MB.")}
                          </div>
                        </div>
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                uploadMedia(f).then((url) => {
                                  if (url) setValue(url);
                                });
                              }
                              e.currentTarget.value = "";
                            }}
                          />
                          {uploading ? ui(uiLang, "Uploading…") : ui(uiLang, "Upload File")}
                        </label>
                      </div>

                      {uploadError ? (
                        <div className="mt-3 text-xs text-red-600">{uploadError}</div>
                      ) : null}

                      {currentValue ? (
                        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                          {/\.(mp4|webm|mov)(\?.*)?$/i.test(String(currentValue)) ? (
                            <video
                              src={String(currentValue)}
                              className="h-40 w-full object-cover"
                              controls
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={String(currentValue)}
                              alt="Uploaded preview"
                              className="h-40 w-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                          <div className="flex items-center justify-between gap-2 border-t border-gray-200 px-3 py-2 text-xs text-gray-600">
                            <span className="truncate">{String(currentValue)}</span>
                            <button
                              type="button"
                              onClick={() => setValue("")}
                              className="text-red-600 hover:underline"
                            >
                              {ui(uiLang, "Remove")}
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <input
                      placeholder={pickUi(uiLang, {
                        en: "Or paste a direct URL (optional)",
                        fa: "یا یک لینک مستقیم وارد کنید (اختیاری)",
                        ar: "أو الصق رابطًا مباشرًا (اختياري)",
                        fi: "Tai liitä suora URL (valinnainen)",
                      })}
                      value={(currentValue as string) ?? ""}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                    />
                  </div>
                ) : step.key === "portfolioItemsRaw" ? (
                  <textarea
                    placeholder={pickUi(uiLang, {
                      en: `Brand Refresh | Repositioned SaaS branding | 200% recognition increase\nE-commerce UX | Conversion-focused redesign | 45% conversion increase\nMobile App UI | Fintech interface redesign | 4.8 star rating`,
                      fa: `بازطراحی برند | بازموضع‌سازی برند SaaS | ۲۰۰٪ افزایش شناخت\nتجربه فروشگاهی | بازطراحی با تمرکز بر تبدیل | ۴۵٪ افزایش تبدیل\nUI اپ موبایل | بازطراحی رابط فین‌تک | امتیاز ۴.۸`,
                      ar: `تجديد العلامة | إعادة تموضع علامة SaaS | زيادة التعرف 200%\nتجربة متجر | إعادة تصميم للتحويل | زيادة 45%\nواجهة جوال | إعادة تصميم فنتك | تقييم 4.8`,
                      fi: `Brändin uudistus | SaaS‑brändin uudelleenpositiointi | 200% tunnettuus\nVerkkokaupan UX | Konversiokeskeinen uudistus | 45% kasvu\nMobiili‑UI | Fintech‑uudistus | 4,8 tähden arvio`,
                    })}
                    value={(currentValue as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full min-h-[160px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                ) : step.key === "customServices" ? (
                  <div className="space-y-2">
                    <textarea
                      placeholder={pickUi(uiLang, {
                        en: `Service/package name | Short description\nExample: Conversion Audit | Full-funnel review and optimization plan`,
                        fa: `نام خدمت/پکیج | توضیح کوتاه\nمثال: ممیزی تبدیل | بررسی کامل قیف و برنامه بهینه‌سازی`,
                        ar: `اسم الخدمة/الباقة | وصف قصير\nمثال: تدقيق التحويل | مراجعة القمع وخطة التحسين`,
                        fi: `Palvelu-/pakettinimi | Lyhyt kuvaus\nEsim: Konversioauditointi | Täysi suppilon arviointi`,
                      })}
                      value={(currentValue as string) ?? ""}
                      onChange={(e) => setValue(e.target.value)}
                    className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                    />
                    {requiresPackageDetails && !String(currentValue ?? "").trim() ? (
                      <div className="text-xs font-medium text-amber-700">
                        {ui(
                          uiLang,
                          "Required: add at least one package/service line because you selected 'Sell Service Packages'."
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : step.key === "portfolioItemsJson" ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600">
                      {ui(
                        uiLang,
                        "Add up to 4 portfolio items. You can upload an image/video for each."
                      )}
                    </div>

                    {portfolioItems.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-600">
                        {ui(uiLang, "No items yet. Click “Add item” to start.")}
                      </div>
                    ) : null}

                    {portfolioItems.map((item, idx) => (
                        <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          <input
                            placeholder={pickUi(uiLang, {
                              en: "Title",
                              fa: "عنوان",
                              ar: "العنوان",
                              fi: "Otsikko",
                            })}
                            value={item.title}
                            onChange={(e) => {
                              const next = [...portfolioItems];
                              next[idx] = { ...next[idx], title: e.target.value };
                              syncPortfolioJson(next);
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                          />
                          <input
                            placeholder={pickUi(uiLang, {
                              en: "Metric (e.g. 45% conversion increase)",
                              fa: "متریک (مثلاً ۴۵٪ افزایش تبدیل)",
                              ar: "المقياس (مثال: زيادة التحويل 45%)",
                              fi: "Mittari (esim. 45% konversio)",
                            })}
                            value={item.metric}
                            onChange={(e) => {
                              const next = [...portfolioItems];
                              next[idx] = { ...next[idx], metric: e.target.value };
                              syncPortfolioJson(next);
                            }}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                          />
                          <div className="flex items-center gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50">
                              <input
                                type="file"
                                accept="image/*,video/*"
                                className="sr-only"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) {
                                    uploadMedia(f).then((url) => {
                                      if (!url) return;
                                      const next = [...portfolioItems];
                                      next[idx] = { ...next[idx], imageUrl: url };
                                      syncPortfolioJson(next);
                                    });
                                  }
                                  e.currentTarget.value = "";
                                }}
                              />
                              {uploading ? ui(uiLang, "Uploading…") : ui(uiLang, "Upload Media")}
                            </label>
                            {item.imageUrl ? (
                              <button
                                type="button"
                                className="text-xs text-red-600 hover:underline"
                                onClick={() => {
                                  const next = [...portfolioItems];
                                  next[idx] = { ...next[idx], imageUrl: "" };
                                  syncPortfolioJson(next);
                                }}
                              >
                                {ui(uiLang, "Remove")}
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <textarea
                          placeholder={pickUi(uiLang, {
                            en: "Description",
                            fa: "توضیح",
                            ar: "الوصف",
                            fi: "Kuvaus",
                          })}
                          value={item.description}
                          onChange={(e) => {
                            const next = [...portfolioItems];
                            next[idx] = { ...next[idx], description: e.target.value };
                            syncPortfolioJson(next);
                          }}
                          className="mt-3 w-full min-h-[90px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                        />

                        {item.imageUrl ? (
                          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            {/\.(mp4|webm|mov)(\?.*)?$/i.test(item.imageUrl) ? (
                              <video src={item.imageUrl} className="h-40 w-full object-cover" controls />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.imageUrl} className="h-40 w-full object-cover" alt="Portfolio media" />
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (portfolioItems.length >= 4) return;
                          const next = [
                            ...portfolioItems,
                            { title: "", description: "", metric: "", imageUrl: "" },
                          ];
                          syncPortfolioJson(next);
                        }}
                      >
                        {ui(uiLang, "Add item")}
                      </Button>
                      {portfolioItems.length > 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => syncPortfolioJson([])}
                        >
                          {ui(uiLang, "Clear all")}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <input
                    placeholder={
                      step.key === "businessName"
                        ? pickUi(uiLang, {
                            en: "Business name",
                            fa: "نام کسب‌وکار",
                            ar: "اسم النشاط",
                            fi: "Yrityksen nimi",
                          })
                        : step.key === "city"
                          ? pickUi(uiLang, {
                              en: "City (optional)",
                              fa: "شهر (اختیاری)",
                              ar: "المدينة (اختياري)",
                              fi: "Kaupunki (valinnainen)",
                            })
                          : step.key === "primaryOffer"
                            ? pickUi(uiLang, {
                                en: "Primary offer (e.g. 1:1 Coaching for Women)",
                                fa: "خدمت اصلی (مثلاً کوچینگ ۱:۱ بانوان)",
                                ar: "العرض الأساسي (مثال: إرشاد فردي للنساء)",
                                fi: "Pääpalvelu (esim. 1:1‑valmennus)",
                              })
                            : step.key === "contactEmail"
                              ? pickUi(uiLang, {
                                  en: "Contact email",
                                  fa: "ایمیل تماس",
                                  ar: "البريد الإلكتروني",
                                  fi: "Yhteyssähköposti",
                                })
                              : step.key === "contactPhone"
                                ? pickUi(uiLang, {
                                    en: "Phone (optional)",
                                    fa: "تلفن (اختیاری)",
                                    ar: "الهاتف (اختياري)",
                                    fi: "Puhelin (valinnainen)",
                                  })
                                : step.key === "bookingLink"
                                  ? pickUi(uiLang, {
                                      en: "Booking link (Calendly / TidyCal / Google Calendar URL)",
                                      fa: "لینک رزرو (Calendly / TidyCal / Google Calendar)",
                                      ar: "رابط الحجز (Calendly / TidyCal / Google Calendar)",
                                      fi: "Varauslinkki (Calendly / TidyCal / Google Calendar)",
                                    })
                                  : step.key === "whatsApp"
                                    ? pickUi(uiLang, {
                                        en: "WhatsApp number (e.g. +358401234567)",
                                        fa: "شماره واتساپ (مثلاً ‎+98...)",
                                        ar: "رقم واتساب (مثال: ‎+98...)",
                                        fi: "WhatsApp‑numero (esim. +358...)",
                                      })
                                    : step.key === "problemStatement"
                                      ? pickUi(uiLang, {
                                          en: "Problem you solve (one sentence)",
                                          fa: "مشکلی که حل می‌کنید (یک جمله)",
                                          ar: "المشكلة التي تحلها (جملة واحدة)",
                                          fi: "Ongelma jonka ratkaiset (yksi lause)",
                                        })
                                      : step.key === "outcomeStatement"
                                        ? pickUi(uiLang, {
                                            en: "Outcome you deliver (one sentence)",
                                            fa: "نتیجه‌ای که می‌سازید (یک جمله)",
                                            ar: "النتيجة التي تحققها (جملة واحدة)",
                                            fi: "Lopputulos jonka tuotat (yksi lause)",
                                          })
                                        : step.key === "proofLine"
                                          ? pickUi(uiLang, {
                                              en: "Proof line (one line)",
                                              fa: "یک خط اثبات (یک خط)",
                                              ar: "سطر إثبات (سطر واحد)",
                                              fi: "Todiste (yksi rivi)",
                                            })
                                          : step.key === "niche"
                                            ? pickUi(uiLang, {
                                                en: "Niche / industry (optional)",
                                                fa: "نیچ/صنعت (اختیاری)",
                                                ar: "المجال/الصناعة (اختياري)",
                                                fi: "Niche/toimiala (valinnainen)",
                                              })
                                            : step.key === "processStep1"
                                              ? pickUi(uiLang, {
                                                  en: "Step 1",
                                                  fa: "گام ۱",
                                                  ar: "الخطوة 1",
                                                  fi: "Vaihe 1",
                                                })
                                              : step.key === "processStep2"
                                                ? pickUi(uiLang, {
                                                    en: "Step 2",
                                                    fa: "گام ۲",
                                                    ar: "الخطوة 2",
                                                    fi: "Vaihe 2",
                                                  })
                                                : step.key === "processStep3"
                                                  ? pickUi(uiLang, {
                                                      en: "Step 3",
                                                      fa: "گام ۳",
                                                      ar: "الخطوة 3",
                                                      fi: "Vaihe 3",
                                                    })
                                                  : ""
                    }
                    value={(currentValue as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {(step.key === "language"
                  ? getLanguageOptions(answers.country, answers.countryOther, uiLang)
                  : step.options
                ).map((opt) => {
                  const selected =
                    step.key === "primaryGoal"
                      ? selectedPrimaryGoals.includes(
                          opt.value as QuestionnaireAnswers["primaryGoal"]
                        )
                      : step.key === "trustFactor"
                      ? selectedTrustFactors.includes(
                          opt.value as QuestionnaireAnswers["trustFactor"]
                        )
                      : currentValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue(opt.value)}
                      className={[
                        "group w-full rounded-2xl border p-4 text-left transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                        selected
                          ? "border-blue-300 bg-blue-50/70 shadow-sm dark:border-blue-600 dark:bg-blue-900/30"
                          : "border-gray-200 bg-white hover:-translate-y-[1px] hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-slate-900 dark:hover:border-blue-600 dark:hover:bg-slate-800",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all",
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 bg-white group-hover:border-blue-400 dark:border-gray-600 dark:bg-slate-800 dark:group-hover:border-blue-500",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          <span
                            className={[
                              "h-2.5 w-2.5 rounded-full transition-all",
                              selected ? "bg-white" : "bg-transparent",
                            ].join(" ")}
                          />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">{opt.title}</div>
                            {selected ? (
                              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700">
                                {ui(uiLang, "Selected")}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{opt.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {step.key === "trustFactor" && selectedTrustFactors.length > 0 ? (
                  <div className="mt-2 space-y-3 rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {ui(uiLang, "Add details for selected trust items (required)")}
                    </div>
                    {selectedTrustFactors.map((factor) => {
                      const label =
                        step.options.find((o) => o.value === factor)?.title ?? factor;
                      return (
                        <div key={factor} className="space-y-2">
                          <label className="text-xs font-semibold text-gray-700">
                            {label}
                          </label>
                          <textarea
                            value={trustFactorNotes[factor] ?? ""}
                            onChange={(e) => {
                              const next = { ...trustFactorNotes, [factor]: e.target.value };
                              update({ trustFactorNotesJson: JSON.stringify(next) });
                            }}
                            onKeyDown={(e) => {
                              // Keep typing behavior natural inside this field.
                              e.stopPropagation();
                            }}
                            placeholder={ui(
                              uiLang,
                              "Write proof/details for this item (certificate, years, result, etc.)"
                            )}
                      className="w-full min-h-[80px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                          />
                        </div>
                      );
                    })}
                    {!hasTrustNotesForAllSelected ? (
                      <div className="text-xs font-medium text-amber-700">
                        {ui(uiLang, "Please add proof text for each selected item to continue.")}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {step.key === "country" && currentValue === "Other" ? (
                  <input
                    placeholder={ui(uiLang, "Enter your country")}
                    value={(answers.countryOther as string) ?? ""}
                    onChange={(e) => update({ countryOther: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                ) : null}

                {step.key === "language" && currentValue === "Other" ? (
                  <input
                    placeholder={ui(uiLang, "Enter your language")}
                    value={(answers.languageOther as string) ?? ""}
                    onChange={(e) => update({ languageOther: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                ) : null}

                {step.key === "serviceType" && currentValue === "other" ? (
                  <input
                    placeholder={ui(uiLang, "Enter your service")}
                    value={(answers.serviceTypeOther as string) ?? ""}
                    onChange={(e) => update({ serviceTypeOther: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-100"
                  />
                ) : null}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={stepIndex === 0 || isSubmitting}
                className="h-11 rounded-xl border-gray-300 bg-white px-5 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
              >
                {ui(uiLang, "Back")}
              </Button>

              <Button
                onClick={goNext}
                disabled={!canGoNext || isSubmitting}
                className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50"
              >
                {isSubmitting
                  ? ui(uiLang, "Generating...")
                  : stepIndex === total - 1
                  ? ui(uiLang, "Generate Page")
                  : ui(uiLang, "Next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
