// app/components/questionnaire.tsx
"use client";

import * as React from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

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
    | "accounting";
  targetAudience:
    | "individuals"
    | "freelancers"
    | "small-business"
    | "medium-business"
    | "enterprise";
  businessStage: "starting" | "established" | "scaling";
  primaryGoal: "leads" | "calls" | "packages" | "credibility";
  experienceLevel: "new" | "intermediate" | "expert" | "veteran";
  pricingApproach: "budget" | "competitive" | "premium" | "custom";
  keyDifferentiator: "speed" | "quality" | "expertise" | "personal" | "results";
  trustFactor:
    | "certifications"
    | "experience"
    | "results"
    | "guarantee"
    | "portfolio";
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
    ],
  },
  {
    key: "customServices",
    title: "Any specific services to include?",
    subtitle: "Add services that don’t fit the categories above (one per line)",
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
    subtitle: "This helps us position your expertise appropriately",
    options: [
      { value: "starting", title: "Just Starting Out", desc: "New to the market, building your first clients" },
      { value: "established", title: "Established & Growing", desc: "Steady client base, looking to expand" },
      { value: "scaling", title: "Scaling & Systemizing", desc: "Strong reputation, ready to scale operations" },
    ],
  },
  {
    key: "primaryGoal",
    title: "What's your main goal with this landing page?",
    subtitle: "We'll optimize your page for this outcome",
    options: [
      { value: "leads", title: "Generate Qualified Leads", desc: "Collect contact info from interested prospects" },
      { value: "calls", title: "Book Discovery Calls", desc: "Get prospects to schedule a consultation" },
      { value: "packages", title: "Sell Service Packages", desc: "Directly sell or showcase your offerings" },
      { value: "credibility", title: "Build Credibility & Trust", desc: "Establish authority and showcase expertise" },
    ],
  },
  {
    key: "experienceLevel",
    title: "How much experience do you have?",
    subtitle: "We'll highlight your background appropriately",
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
    subtitle: "This affects how we communicate value",
    options: [
      { value: "budget", title: "Affordable & Accessible", desc: "Great value for budget-conscious clients" },
      { value: "competitive", title: "Competitive & Fair", desc: "Balanced pricing for quality service" },
      { value: "premium", title: "Premium & High-End", desc: "Top-tier service at premium rates" },
      { value: "custom", title: "Custom Quotes Only", desc: "Every project is uniquely priced" },
    ],
  },
  {
    key: "keyDifferentiator",
    title: "What makes you stand out?",
    subtitle: "Choose your strongest competitive advantage",
    options: [
      { value: "speed", title: "Fast Turnaround", desc: "Quick delivery without compromising quality" },
      { value: "quality", title: "Exceptional Quality", desc: "Meticulous attention to detail and excellence" },
      { value: "expertise", title: "Specialized Expertise", desc: "Deep knowledge in a specific niche" },
      { value: "personal", title: "Personalized Service", desc: "Tailored approach for each client" },
      { value: "results", title: "Proven Results", desc: "Track record of measurable success" },
    ],
  },
  {
    key: "trustFactor",
    title: "What builds trust with your clients?",
    subtitle: "Select your strongest credibility indicator",
    options: [
      { value: "certifications", title: "Certifications & Credentials", desc: "Professional certifications and licenses" },
      { value: "experience", title: "Years of Experience", desc: "Extensive time in the industry" },
      { value: "results", title: "Client Results & ROI", desc: "Proven outcomes and success stories" },
      { value: "guarantee", title: "Satisfaction Guarantee", desc: "Risk-free promise or money-back guarantee" },
      { value: "portfolio", title: "Portfolio & Past Work", desc: "Showcase of completed projects" },
    ],
  },
  {
    key: "includeAbout",
    title: `Do you want to add an "About" section?`,
    subtitle: "Tell your story and connect with potential clients",
    options: [
      { value: "yes", title: "Yes, Add About Section", desc: "Share your background and mission" },
      { value: "no", title: "No, Skip About Section", desc: "Keep the page focused on services only" },
    ],
  },
  {
    key: "aboutText",
    title: "Write a short About section (optional)",
    subtitle: "A few sentences about who you are and how you help",
    options: [],
  },
  {
    key: "aboutImageUrl",
    title: "Add an About image (optional)",
    subtitle: "Upload a photo/video or paste a direct URL. Leave empty to skip.",
    options: [],
  },
  {
    key: "contactEmail",
    title: "Contact email",
    subtitle: "Shown in the Contact section + used for mailto link",
    options: [],
  },
  {
    key: "whatsApp",
    title: "WhatsApp number (optional)",
    subtitle: "Use international format, e.g. +358401234567",
    options: [],
  },
  {
    key: "bookingLink",
    title: "Booking link (optional)",
    subtitle: "Calendly / TidyCal / Google Calendar booking URL",
    options: [],
  },
];

const ADVANCED_STEPS: Step[] = [
  {
    key: "problemStatement",
    title: "What problem do you solve?",
    subtitle: "One sentence. Be specific about the pain you remove.",
    options: [],
  },
  {
    key: "outcomeStatement",
    title: "What outcome do you deliver?",
    subtitle: "One sentence. Describe the end-result clients actually want.",
    options: [],
  },
  {
    key: "proofLine",
    title: "Add one credibility / proof line",
    subtitle: 'Example: "4.9/5 rating • 120+ clients • ICF-trained" (one line)',
    options: [],
  },
  {
    key: "niche",
    title: "Your niche / industry (optional)",
    subtitle: 'Example: "SaaS founders", "Real estate", "Wellness coaches"',
    options: [],
  },
  {
    key: "processStep1",
    title: "Your process — Step 1",
    subtitle: 'Example: "Audit + clarify goals"',
    options: [],
  },
  {
    key: "processStep2",
    title: "Your process — Step 2",
    subtitle: 'Example: "Build plan + execute"',
    options: [],
  },
  {
    key: "processStep3",
    title: "Your process — Step 3",
    subtitle: 'Example: "Deliver + optimize"',
    options: [],
  },
  {
    key: "portfolioItemsRaw",
    title: "Portfolio highlights (optional)",
    subtitle: "One per line: Title | Description | Metric (e.g. 40% growth)",
    options: [],
  },
  {
    key: "portfolioItemsJson",
    title: "Portfolio items (optional)",
    subtitle: "Add real projects, metrics, and optional images/videos.",
    options: [],
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

function pickUi<T>(lang: UiLang, map: Record<UiLang, T>): T {
  return map[lang] ?? map.en;
}

function ui(lang: UiLang, text: string) {
  const map: Record<UiLang, Record<string, string>> = {
    en: {},
    fa: {
      country: {
        Other: { title: "سایر", desc: "اگر کشور شما در لیست نیست" },
      },
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
      "Please upload an image or video file.": "لطفاً تصویر یا ویدیو آپلود کنید.",
      "File is too large. Please upload under 25MB.": "حجم فایل زیاد است. حداکثر ۲۵ مگابایت.",
      "Upload failed": "آپلود ناموفق بود",
      "Add up to 4 portfolio items. You can upload an image/video for each.":
        "حداکثر ۴ آیتم پورتفولیو اضافه کنید. برای هرکدام می‌توانید تصویر/ویدیو آپلود کنید.",
      "Upload Media": "آپلود مدیا",
      "Enter your country": "کشور خود را وارد کنید",
      "Enter your language": "زبان خود را وارد کنید",
    },
    ar: {
      country: {
        Other: { title: "أخرى", desc: "إذا لم يكن بلدك ضمن القائمة" },
      },
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
      "Please upload an image or video file.": "يرجى رفع صورة أو فيديو.",
      "File is too large. Please upload under 25MB.": "حجم الملف كبير. الحد 25MB.",
      "Upload failed": "فشل الرفع",
      "Add up to 4 portfolio items. You can upload an image/video for each.":
        "أضف حتى 4 عناصر أعمال. يمكنك رفع صورة/فيديو لكل عنصر.",
      "Upload Media": "رفع الوسائط",
      "Enter your country": "أدخل بلدك",
      "Enter your language": "أدخل لغتك",
    },
    fi: {
      country: {
        Other: { title: "Muu", desc: "Jos maasi ei ole listassa" },
      },
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
      "Please upload an image or video file.": "Lataa kuva tai video.",
      "File is too large. Please upload under 25MB.": "Tiedosto on liian suuri. Max 25MB.",
      "Upload failed": "Lataus epäonnistui",
      "Add up to 4 portfolio items. You can upload an image/video for each.":
        "Lisää enintään 4 portfolio‑kohdetta. Voit ladata kuvan/videon jokaiseen.",
      "Upload Media": "Lataa media",
      "Enter your country": "Syötä maasi",
      "Enter your language": "Syötä kielesi",
    },
  };
  return map[lang]?.[text] ?? text;
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
        title: pickLang(uiLang, { en: "Other", fa: "سایر", ar: "أخرى", fi: "Muu" }),
        desc: pickLang(uiLang, {
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
  const [advanced, setAdvanced] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [languageTouched, setLanguageTouched] = React.useState(false);
  const [portfolioItems, setPortfolioItems] = React.useState<
    { title: string; description: string; metric: string; imageUrl?: string }[]
  >([]);

  const STEPS = React.useMemo(() => {
    // Advanced = add steps, without touching base flow UX
    return advanced ? [...BASE_STEPS, ...ADVANCED_STEPS] : BASE_STEPS;
  }, [advanced]);

  const total = STEPS.length;

  const [stepIndex, setStepIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Partial<QuestionnaireAnswers>>(initialAnswers ?? {});

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

  // If user toggles Advanced OFF while on advanced steps, clamp index
  React.useEffect(() => {
    setStepIndex((s) => clamp(s, 0, total - 1));
  }, [total]);

  const uiLang = toUiLang(answers.language);
  const step = localizeStep(uiLang, STEPS[stepIndex]);
  const currentValue = answers[step.key] as string | undefined;

  const progress = Math.round(((stepIndex + 1) / total) * 100);
  const isInputStep = step.options.length === 0;

  const needsCountryOther = step.key === "country" && currentValue === "Other";
  const needsLanguageOther = step.key === "language" && currentValue === "Other";

  const canGoNext = isInputStep
    ? Boolean(
        (currentValue ?? "").toString().trim() ||
          step.key === "niche" ||
          step.key === "aboutImageUrl" ||
          step.key === "whatsApp" ||
          step.key === "bookingLink" ||
          step.key === "aboutText" ||
          step.key === "portfolioItemsRaw" ||
          step.key === "portfolioItemsJson" ||
          step.key === "customServices"
      )
    : Boolean(currentValue) &&
      (!needsCountryOther ||
        Boolean((answers.countryOther ?? "").toString().trim())) &&
      (!needsLanguageOther ||
        Boolean((answers.languageOther ?? "").toString().trim()));

  const update = (patch: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...patch }));
  };

  React.useEffect(() => {
    onChange?.(answers as QuestionnaireAnswers);
  }, [answers, onChange]);

  const setValue = (value: string) => {
    if (step.key === "language") setLanguageTouched(true);
    update({ [step.key]: value as any });
  };

  const goBack = () => {
    setStepIndex((s) => Math.max(0, s - 1));
  };

  const goNext = async () => {
    if (!canGoNext) return;

    if (stepIndex < total - 1) {
      setStepIndex((s) => Math.min(total - 1, s + 1));
      return;
    }

    const final = answers as QuestionnaireAnswers;
    onGenerate?.(final);
    onComplete?.(final);
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

  const headerQuestionCount = advanced ? "Answer quick questions to get your personalized landing page" : "Answer 9 quick questions to get your personalized landing page";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40"
      dir={uiLang === "fa" || uiLang === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45),rgba(255,255,255,0.85))]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col px-4 pb-14 pt-12 sm:pt-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            <span className="text-sm font-semibold text-gray-900">Landing Page Generator</span>
          </div>

          <h1 className="mt-5 text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {headerQuestionCount}
          </h1>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div className="font-medium">
              Question {stepIndex + 1} of {total}
            </div>
            <div className="font-semibold text-gray-700">{progress}%</div>
          </div>

          <div className="mt-3 h-2 w-full rounded-full bg-white/80 ring-1 ring-gray-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Card className="mx-auto mt-8 w-full max-w-3xl border border-gray-200 bg-white/85 shadow-xl shadow-blue-500/5 backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8">
            {/* ✅ Advanced Toggle (minimal, no redesign) */}
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/70 px-4 py-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900">{ui(uiLang, "Advanced mode")}</div>
                <div className="text-xs text-gray-600">
                  Turn on for better copy (problem, outcome, proof, process).
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAdvanced((v) => !v)}
                className={[
                  "relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border transition-colors",
                  advanced ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-gray-200",
                ].join(" ")}
                aria-pressed={advanced}
                aria-label="Toggle advanced mode"
              >
                <span
                  className={[
                    "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                    advanced ? "translate-x-6" : "translate-x-1",
                  ].join(" ")}
                />
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                {step.title}
              </div>
              <div className="text-sm text-gray-600 sm:text-base">{step.subtitle}</div>
            </div>

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
                    className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
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
                      className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
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
                    className="w-full min-h-[160px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : step.key === "customServices" ? (
                  <textarea
                    placeholder={pickUi(uiLang, {
                      en: `Service name | Optional short description\nExample: Conversion Audit | Full-funnel review and optimization plan`,
                      fa: `نام خدمت | توضیح کوتاه (اختیاری)\nمثال: ممیزی تبدیل | بررسی کامل قیف و برنامه بهینه‌سازی`,
                      ar: `اسم الخدمة | وصف قصير (اختياري)\nمثال: تدقيق التحويل | مراجعة القمع وخطة التحسين`,
                      fi: `Palvelun nimi | Lyhyt kuvaus (valinnainen)\nEsim: Konversioauditointi | Täysi suppilon arviointi`,
                    })}
                    value={(currentValue as string) ?? ""}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
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
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
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
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
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
                          className="mt-3 w-full min-h-[90px] rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
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
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {(step.key === "language"
                  ? getLanguageOptions(answers.country, answers.countryOther, uiLang)
                  : step.options
                ).map((opt) => {
                  const selected = currentValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue(opt.value)}
                      className={[
                        "group w-full rounded-2xl border p-4 text-left transition-all duration-200",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                        selected
                          ? "border-blue-300 bg-blue-50/70 shadow-sm"
                          : "border-gray-200 bg-white hover:-translate-y-[1px] hover:border-blue-200 hover:shadow-md",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={[
                            "mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-all",
                            selected
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 bg-white group-hover:border-blue-400",
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
                            <div className="text-base font-semibold text-gray-900">{opt.title}</div>
                            {selected ? (
                              <span className="inline-flex items-center rounded-full bg-blue-600/10 px-2 py-1 text-xs font-semibold text-blue-700">
                                {ui(uiLang, "Selected")}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-gray-600">{opt.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {step.key === "country" && currentValue === "Other" ? (
                  <input
                    placeholder={ui(uiLang, "Enter your country")}
                    value={(answers.countryOther as string) ?? ""}
                    onChange={(e) => update({ countryOther: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : null}

                {step.key === "language" && currentValue === "Other" ? (
                  <input
                    placeholder={ui(uiLang, "Enter your language")}
                    value={(answers.languageOther as string) ?? ""}
                    onChange={(e) => update({ languageOther: e.target.value })}
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                ) : null}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="h-11 rounded-xl border-gray-300 bg-white px-5 text-gray-900 hover:bg-gray-50 disabled:opacity-50"
              >
                {ui(uiLang, "Back")}
              </Button>

              <Button
                onClick={goNext}
                disabled={!canGoNext}
                className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50"
              >
                {stepIndex === total - 1 ? ui(uiLang, "Generate Page") : ui(uiLang, "Next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
