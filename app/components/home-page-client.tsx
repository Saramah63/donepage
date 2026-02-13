// app/components/home-page-client.tsx
"use client";

import * as React from "react";
import { Sparkles, CheckCircle, ArrowRight, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ChatWidget } from "@/app/components/chat-widget";

const COPY = {
  en: {
    topTag: "Landing page generator",
    badgeTop: "Auto-generated",
    badgeTitle: "Landing Page Engine",
    livePreview: "Live preview updates as you type",
    headlineA: "Your landing page,",
    headlineB: "done",
    subheadline:
      "Answer a few questions and Donepage generates a polished, SEO-ready landing page you can publish instantly.",
    ctaPrimary: "Generate my page",
    ctaSecondary: "How it works",
    pills: [
      "Figma-level design feel",
      "SEO-ready structure",
      "Export & publish options",
      "Fast to launch",
    ],
    howTitle: "How it works",
    howCards: [
      { title: "Answer questions", desc: "A short guided form collects the essentials." },
      { title: "Get a full page", desc: "A complete, conversion-focused landing page is generated." },
      { title: "Publish instantly", desc: "Publish to /slug (KV-backed) and share the link." },
    ],
    contactTitle: "Contact Donepage",
    contactBody:
      "Have questions about pricing, custom domains, or the generator? Reach us any time.",
    emailUs: "Email Us",
    seeHow: "See how it works",
    footer: "© 2026 Donepage. Built for speed, clarity, and conversion.",
    languageLabel: "Language",
  },
  fa: {
    topTag: "سازنده لندینگ پیج",
    badgeTop: "خودکار",
    badgeTitle: "موتور ساخت لندینگ",
    livePreview: "پیش‌نمایش زنده هم‌زمان با تایپ",
    headlineA: "لندینگ پیج شما،",
    headlineB: "آماده",
    subheadline:
      "به چند سؤال پاسخ دهید تا Donepage یک لندینگ حرفه‌ای و آماده سئو بسازد.",
    ctaPrimary: "ساخت صفحه من",
    ctaSecondary: "چطور کار می‌کند",
    pills: [
      "حس طراحی سطح فیگما",
      "ساختار آماده سئو",
      "امکان خروجی و انتشار",
      "راه‌اندازی سریع",
    ],
    howTitle: "چطور کار می‌کند",
    howCards: [
      { title: "پاسخ به سوالات", desc: "فرم کوتاه، اطلاعات اصلی را جمع می‌کند." },
      { title: "دریافت صفحه کامل", desc: "یک لندینگ کامل و متمرکز بر تبدیل ساخته می‌شود." },
      { title: "انتشار سریع", desc: "انتشار روی /slug و اشتراک لینک." },
    ],
    contactTitle: "ارتباط با Donepage",
    contactBody:
      "سوالی درباره قیمت، دامنه اختصاصی یا ابزار دارید؟ هر زمان در دسترسیم.",
    emailUs: "ایمیل بزنید",
    seeHow: "مشاهده روند",
    footer: "© ۲۰۲۶ Donepage. سریع، شفاف و متمرکز بر تبدیل.",
    languageLabel: "زبان",
  },
  ar: {
    topTag: "منشئ صفحة هبوط",
    badgeTop: "تلقائي",
    badgeTitle: "محرك إنشاء الصفحات",
    livePreview: "معاينة مباشرة أثناء الكتابة",
    headlineA: "صفحتك المقصودة،",
    headlineB: "جاهزة",
    subheadline:
      "أجب عن بعض الأسئلة وسينشئ Donepage صفحة جاهزة للسيو والنشر فورًا.",
    ctaPrimary: "أنشئ صفحتي",
    ctaSecondary: "كيف يعمل",
    pills: [
      "تصميم بمستوى فيغما",
      "هيكل جاهز للسيو",
      "تصدير ونشر",
      "إطلاق سريع",
    ],
    howTitle: "كيف يعمل",
    howCards: [
      { title: "أجب عن الأسئلة", desc: "نموذج موجز يجمع الأساسيات." },
      { title: "احصل على صفحة كاملة", desc: "صفحة كاملة مركزة على التحويل." },
      { title: "انشر فورًا", desc: "انشر على /slug وشارك الرابط." },
    ],
    contactTitle: "تواصل مع Donepage",
    contactBody:
      "لديك أسئلة حول الأسعار أو النطاقات المخصصة؟ نحن هنا لمساعدتك.",
    emailUs: "راسلنا",
    seeHow: "شاهد كيف يعمل",
    footer: "© 2026 Donepage. سرعة ووضوح وتحويل أعلى.",
    languageLabel: "اللغة",
  },
  fi: {
    topTag: "Laskeutumissivun generaattori",
    badgeTop: "Automaattinen",
    badgeTitle: "Landing Page Engine",
    livePreview: "Esikatselu päivittyy reaaliajassa",
    headlineA: "Laskeutumissivusi,",
    headlineB: "valmis",
    subheadline:
      "Vastaa muutamaan kysymykseen ja Donepage luo valmiin, SEO‑optimoidun sivun.",
    ctaPrimary: "Luo sivu",
    ctaSecondary: "Miten se toimii",
    pills: [
      "Figma‑tasoinen design",
      "SEO‑valmis rakenne",
      "Vienti ja julkaisu",
      "Nopea julkaisu",
    ],
    howTitle: "Miten se toimii",
    howCards: [
      { title: "Vastaa kysymyksiin", desc: "Lyhyt lomake kerää oleellisen." },
      { title: "Saat valmiin sivun", desc: "Konversiokeskeinen laskeutumissivu luodaan." },
      { title: "Julkaise heti", desc: "Julkaise /slug‑osoitteeseen ja jaa." },
    ],
    contactTitle: "Ota yhteyttä",
    contactBody:
      "Kysymyksiä hinnoittelusta tai domaineista? Olemme täällä.",
    emailUs: "Lähetä viesti",
    seeHow: "Katso miten",
    footer: "© 2026 Donepage. Nopea, selkeä ja konvertoiva.",
    languageLabel: "Kieli",
  },
};

const LANGS = [
  { value: "en", label: "English" },
  { value: "fa", label: "فارسی" },
  { value: "ar", label: "العربية" },
  { value: "fi", label: "Suomi" },
];

export default function HomePageClient() {
  const [lang, setLang] = React.useState<keyof typeof COPY>("en");
  const isRTL = lang === "fa" || lang === "ar";
  const t = COPY[lang];

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("dp_lang");
    if (stored && COPY[stored as keyof typeof COPY]) {
      setLang(stored as keyof typeof COPY);
      return;
    }
    const search = new URLSearchParams(window.location.search);
    const q = search.get("lang");
    if (q && COPY[q as keyof typeof COPY]) {
      setLang(q as keyof typeof COPY);
      window.localStorage.setItem("dp_lang", q);
    }
  }, []);

  const setLanguage = (value: keyof typeof COPY) => {
    setLang(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dp_lang", value);
      window.dispatchEvent(new CustomEvent("dp:lang", { detail: value }));
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mesh-hero" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="noise-film" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45),rgba(255,255,255,0.85))]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col px-4 pb-24 pt-16 sm:pt-24">
        {/* Top pill */}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div className="text-sm font-semibold text-gray-900">Donepage</div>
          <span className="text-xs text-gray-500">{t.topTag}</span>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm">
            <span className="text-gray-500">{t.languageLabel}:</span>
            <div className="flex items-center gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLanguage(l.value as keyof typeof COPY)}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold transition",
                    lang === l.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  ].join(" ")}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-white/80 px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm">
              <Zap className="h-4 w-4" />
              {t.badgeTop}
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {t.headlineA} <span className="luxury-gradient-text">{t.headlineB}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-600">{t.subheadline}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={`/generator?lang=${lang}`}>
                  {t.ctaPrimary}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how">{t.ctaSecondary}</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {t.pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <Card className="float-slow border border-gray-200 bg-white/85 shadow-2xl shadow-blue-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>{t.badgeTitle}</span>
                <span className="text-xs text-gray-500">{t.livePreview}</span>
              </div>
              <div className="mt-6 space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <div className="h-2 w-32 rounded-full bg-gray-200" />
                    <div className="mt-3 h-2 w-full rounded-full bg-gray-200" />
                    <div className="mt-2 h-2 w-2/3 rounded-full bg-gray-200" />
                  </div>
                ))}
                <div className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 to-cyan-50 px-4 py-4">
                  <div className="flex items-center gap-3 text-sm font-semibold text-blue-700">
                    <Globe className="h-4 w-4" />
                    {t.badgeTitle}
                  </div>
                  <div className="mt-2 text-xs text-blue-600">{t.livePreview}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div id="how" className="mt-24">
          <h2 className="text-3xl font-semibold text-gray-900">{t.howTitle}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {t.howCards.map((card, idx) => (
              <Card key={card.title} className="border border-gray-200 bg-white/90 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">
                    {idx + 1}
                  </div>
                  <div className="mt-4 text-lg font-semibold text-gray-900">{card.title}</div>
                  <p className="mt-2 text-sm text-gray-600">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-24 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{t.contactTitle}</h3>
              <p className="mt-3 max-w-2xl text-sm text-gray-600">{t.contactBody}</p>
            </div>
            <Button size="lg" asChild>
              <Link href="mailto:hello@donepage.co">{t.emailUs}</Link>
            </Button>
          </div>
        </div>

        <footer className="mt-16 text-center text-xs text-gray-500">{t.footer}</footer>
      </div>

      <ChatWidget />
    </div>
  );
}
