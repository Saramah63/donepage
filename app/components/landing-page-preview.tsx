// app/components/landing-page-preview.tsx
"use client";

import * as React from "react";
import { generateContentAdvanced } from "@/app/components/content-advanced";
import { getLang, pickLang } from "@/app/components/content";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Mail,
  MessageSquare,
  Edit,
  Globe,
  CheckCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { QualificationTrigger } from "@/app/components/qualification-widget";
import type { BusinessContext } from "@/app/lib/qualification/types";

import type { QuestionnaireAnswers } from "./questionnaire";
import type { DraftOverrides } from "@/app/lib/draft-content";
import { PublishModal } from "./publish-modal";
import { PricingModal } from "./pricing-modal";
import { exportLandingHTML } from "@/app/lib/export-html";
import { setPlan } from "@/app/lib/plan-store";

interface LandingPagePreviewProps {
  answers: QuestionnaireAnswers;
  onEdit: () => void;
  mode?: "preview" | "export";
  slug?: string;
  autoOpenPublish?: boolean;
  publishHint?: "custom" | "subdomain" | null;
  templateId?: "A" | "B" | "C";
  overrides?: DraftOverrides;
  onInlineEdit?: (section: string, field: string, value: string, index?: number) => void;
}

function parsePackageLines(raw: string) {
  const lines = (raw || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const out = lines
    .map((line) => {
      const byPipe = line.split("|").map((p) => p.trim());
      const [nameA, descA, metricA] = byPipe;

      if (byPipe.length >= 2 && nameA) {
        return { name: nameA, description: descA || "", metric: metricA || "" };
      }

      const dashParts = line.split(" - ").map((p) => p.trim());
      if (dashParts.length >= 2) {
        const [nameB, descB] = dashParts;
        return { name: nameB || "", description: descB || "", metric: "" };
      }

      const colonParts = line.split(":").map((p) => p.trim());
      if (colonParts.length >= 2) {
        const [nameC, ...rest] = colonParts;
        return { name: nameC || "", description: rest.join(": ") || "", metric: "" };
      }

      return { name: line, description: "", metric: "" };
    })
    .filter((x) => x.name);

  return out;
}

function normalizeUrl(url?: string) {
  const v = (url || "").trim();
  if (!v) return "";
  if (v.startsWith("mailto:") || v.startsWith("tel:")) return v;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  return `https://${v}`;
}

function EditableField({
  as: Tag,
  value,
  className,
  placeholder,
  onSave,
  max,
  multiline,
}: {
  as: keyof JSX.IntrinsicElements;
  value: string;
  className?: string;
  placeholder?: string;
  onSave?: (value: string) => void;
  max: number;
  multiline?: boolean;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);

  React.useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  if (!onSave) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (!editing) {
    return (
      <Tag
        className={`${className} cursor-text`}
        onClick={() => setEditing(true)}
        data-placeholder={placeholder || ""}
      >
        {value || placeholder}
      </Tag>
    );
  }

  return (
    <div className="space-y-2">
      {multiline ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, max))}
          className={`${className} w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/30`}
          rows={3}
        />
      ) : (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, max))}
          className={`${className} w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/30`}
        />
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDraft(value);
            setEditing(false);
          }}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => {
            onSave(draft.trim());
            setEditing(false);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function normalizePackageBase(base: string) {
  return base
    .replace(/\bin\s+\d+\s+(different\s+)?packages?\b/gi, "")
    .replace(/\bpackages?\b$/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function expandTierSentence(raw: string) {
  const lines = (raw || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const out: Array<{ name: string; description: string; metric: string }> = [];
  for (const line of lines) {
    if (!line.includes(":")) continue;
    const [left, right] = line.split(":", 2);
    const base = normalizePackageBase(left.trim());
    const tiers = right
      .replace(/\band\b/gi, ",")
      .replace(/[\u2022;]/g, ",")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!base || tiers.length < 2) continue;
    for (const tier of tiers) {
      out.push({
        name: `${base} - ${tier}`,
        description: "Tailored delivery for your goals.",
        metric: "Included",
      });
    }
  }
  return out;
}

function buildDefaultTiers(offer?: string, pricingApproach?: string) {
  const base = offer?.trim() || "Service";
  const premiumMetric =
    pricingApproach === "premium"
      ? "Priority delivery"
      : pricingApproach === "custom"
      ? "Custom scope"
      : "Advanced support";
  return [
    {
      name: "Starter",
      description: `${base} essentials to get quick traction.`,
      metric: "Best for first results",
    },
    {
      name: "Growth",
      description: `${base} with deeper execution and optimization.`,
      metric: "Most popular",
    },
    {
      name: "Premium",
      description: `${base} with full strategic and hands-on support.`,
      metric: premiumMetric,
    },
  ];
}

function detectPackageCount(raw: string) {
  const text = (raw || "").toLowerCase();
  const m = text.match(/(\d+)\s*(different\s*)?packages?/);
  const count = m ? Number(m[1]) : 0;
  return Number.isFinite(count) && count > 0 ? count : 0;
}

function buildNamedTiers(count: number, offer?: string, pricingApproach?: string) {
  const names = ["Starter", "Growth", "Premium", "Elite", "Enterprise"];
  const defaults = buildDefaultTiers(offer, pricingApproach);
  const out: Array<{ name: string; description: string; metric: string }> = [];
  for (let i = 0; i < count; i += 1) {
    const base = defaults[Math.min(i, defaults.length - 1)];
    out.push({
      name: names[i] ?? `Package ${i + 1}`,
      description: base.description,
      metric: base.metric,
    });
  }
  return out;
}

export function LandingPagePreview({
  answers,
  onEdit,
  mode = "preview",
  slug = "landing",
  autoOpenPublish = false,
  publishHint = null,
  templateId = "A",
  overrides,
  onInlineEdit,
}: LandingPagePreviewProps) {
  const [isPublishModalOpen, setPublishModalOpen] = React.useState(false);
  const [isPricingModalOpen, setPricingModalOpen] = React.useState(false);
  const [mediaPreview, setMediaPreview] = React.useState<
    { src: string; title?: string; isVideo?: boolean } | null
  >(null);
  React.useEffect(() => {
    if (!mediaPreview) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMediaPreview(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [mediaPreview]);

  const autoOpenedRef = React.useRef(false);
  React.useEffect(() => {
    if (!autoOpenPublish) return;
    if (autoOpenedRef.current) return;
    autoOpenedRef.current = true;
    setPublishModalOpen(true);
  }, [autoOpenPublish]);

  const draftOverrides = overrides || {};

  /** 🔑 SINGLE SOURCE OF CONTENT */
  const content = React.useMemo(() => {
    const base = generateContentAdvanced(answers);
    if (draftOverrides.heroHeadline) base.meta.headline = draftOverrides.heroHeadline;
    if (draftOverrides.heroSubheadline) base.meta.subheadline = draftOverrides.heroSubheadline;
    if (draftOverrides.heroPrimaryCTA) base.meta.primaryCTA = draftOverrides.heroPrimaryCTA;
    if (draftOverrides.heroSecondaryCTA) base.meta.secondaryCTA = draftOverrides.heroSecondaryCTA;
    if (draftOverrides.ctaHeadline) base.cta.headline = draftOverrides.ctaHeadline;
    if (draftOverrides.ctaSubheadline) base.cta.subheadline = draftOverrides.ctaSubheadline;
    if (draftOverrides.ctaButtonText) base.cta.buttonText = draftOverrides.ctaButtonText;
    if (draftOverrides.contactTitle) base.contact.title = draftOverrides.contactTitle;
    if (draftOverrides.contactSubtitle) base.contact.subtitle = draftOverrides.contactSubtitle;
    if (draftOverrides.benefits && draftOverrides.benefits.length > 0) {
      base.value.benefits = draftOverrides.benefits.map((b, i) => ({
        title: b.title,
        description: b.description,
        tone: base.value.benefits?.[i]?.tone || "blue",
      }));
    }
    return base;
  }, [answers, draftOverrides]);

  /** 🔑 SINGLE SOURCE OF LINKS (NO RE-COMPUTE) */
  const emailHref = draftOverrides.contactEmail
    ? `mailto:${draftOverrides.contactEmail}`
    : content.contact?.email?.href || "";
  const bookingHref = draftOverrides.contactBookingLink
    ? normalizeUrl(draftOverrides.contactBookingLink)
    : content.contact?.call?.href || emailHref || "";
  const waHref = draftOverrides.contactWhatsApp
    ? normalizeUrl(draftOverrides.contactWhatsApp)
    : content.contact?.chat?.href || emailHref || "";
  const phoneHref = draftOverrides.contactPhone
    ? `tel:${draftOverrides.contactPhone}`
    : "";
  const telegramHref = draftOverrides.contactTelegram
    ? normalizeUrl(draftOverrides.contactTelegram)
    : "";
  const instagramHref = draftOverrides.contactInstagram
    ? normalizeUrl(draftOverrides.contactInstagram)
    : "";
  const goal = (answers.primaryGoal || "").toLowerCase();
  const heroPrimaryHref =
    draftOverrides.heroPrimaryUrl
      ? normalizeUrl(draftOverrides.heroPrimaryUrl)
      :
    goal === "packages"
      ? "#packages"
      : goal === "credibility"
      ? "#why-choose-us"
      : "#contact";
  const heroSecondaryHref =
    goal === "calls"
      ? "#portfolio"
      : goal === "credibility"
      ? "#why-choose-us"
      : "#services";
  const ctaPrimaryHref =
    draftOverrides.ctaButtonUrl
      ? normalizeUrl(draftOverrides.ctaButtonUrl)
      :
    goal === "packages"
      ? "#packages"
      : goal === "credibility"
      ? "#why-choose-us"
      : "#contact";
  const lang = getLang(answers);
  const hero = content.meta;
  const heroBusinessName =
    hero.businessName?.trim() ||
    answers.businessName?.trim() ||
    pickLang(lang, {
      en: "Your Business",
      fa: "کسب‌وکار شما",
      ar: "عملك",
      fi: "Yrityksesi",
    });
  const heroHeadline =
    hero.headline?.trim() ||
    pickLang(lang, {
      en: "High-converting landing page for your business",
      fa: "لندینگ حرفه‌ای و پرفروش برای کسب‌وکار شما",
      ar: "صفحة هبوط عالية التحويل لعملك",
      fi: "Korkean konversion laskeutumissivu yrityksellesi",
    });
  const heroSubheadline =
    hero.subheadline?.trim() ||
    pickLang(lang, {
      en: "Built to communicate value clearly and convert visitors into qualified leads.",
      fa: "برای انتقال شفاف ارزش و تبدیل بازدیدکننده به سرنخ باکیفیت ساخته شده است.",
      ar: "مصممة لشرح القيمة بوضوح وتحويل الزوار إلى عملاء محتملين مؤهلين.",
      fi: "Rakennettu viestimään arvo selkeästi ja muuttamaan kävijät liideiksi.",
    });
  const heroPrimaryCTA =
    hero.primaryCTA?.trim() ||
    pickLang(lang, {
      en: "Start Project",
      fa: "شروع پروژه",
      ar: "ابدأ المشروع",
      fi: "Aloita projekti",
    });
  const heroSecondaryCTA =
    hero.secondaryCTA?.trim() ||
    pickLang(lang, {
      en: "See Packages",
      fa: "مشاهده پکیج‌ها",
      ar: "عرض الباقات",
      fi: "Katso paketit",
    });
  const heroBadges = Array.isArray(hero.trustBadges) && hero.trustBadges.length > 0
    ? hero.trustBadges
    : [
        pickLang(lang, {
          en: "Conversion-focused",
          fa: "متمرکز بر تبدیل",
          ar: "مركز على التحويل",
          fi: "Konversiokeskeinen",
        }),
        pickLang(lang, {
          en: "SEO-ready",
          fa: "آماده سئو",
          ar: "جاهز للسيو",
          fi: "SEO-valmis",
        }),
        pickLang(lang, {
          en: "Fast launch",
          fa: "راه‌اندازی سریع",
          ar: "إطلاق سريع",
          fi: "Nopea julkaisu",
        }),
      ];
  const offerings = content.services.offerings as Array<{
    name: string;
    description: string;
    features: string[];
  }>;
  const packageItems = React.useMemo(() => {
    const raw = answers.customServices || "";
    const hasRaw = Boolean(raw.trim());
    const expanded = expandTierSentence(answers.customServices || "");
    const parsed = expanded.length > 0 ? expanded : parsePackageLines(raw);
    const explicitCount = detectPackageCount(raw);
    if (parsed.length >= 2) return parsed;
    if (hasRaw && parsed.length === 1) return parsed;
    const hasPackageGoal =
      answers.primaryGoal === "packages" ||
      (Array.isArray(answers.primaryGoals) && answers.primaryGoals.includes("packages"));
    if (hasRaw && explicitCount >= 2) {
      return buildNamedTiers(explicitCount, answers.primaryOffer, answers.pricingApproach);
    }
    if (hasPackageGoal) {
      if (explicitCount >= 2) {
        return buildNamedTiers(explicitCount, answers.primaryOffer, answers.pricingApproach);
      }
      return parsed.length === 1
        ? [parsed[0], ...buildDefaultTiers(answers.primaryOffer, answers.pricingApproach).slice(1)]
        : buildDefaultTiers(answers.primaryOffer, answers.pricingApproach);
    }
    return parsed;
  }, [answers.customServices, answers.primaryGoal, answers.primaryGoals, answers.primaryOffer, answers.pricingApproach]);
  const packageNameSet = React.useMemo(
    () => new Set(packageItems.map((p) => p.name.toLowerCase())),
    [packageItems]
  );
  const hasPackageGoal =
    answers.primaryGoal === "packages" ||
    (Array.isArray(answers.primaryGoals) && answers.primaryGoals.includes("packages"));
  const hasCustomPackages = packageItems.length > 0;
  const coreOfferings = React.useMemo(
    () =>
      hasPackageGoal || hasCustomPackages
        ? []
        : offerings.filter((o) => !packageNameSet.has(o.name.toLowerCase())),
    [offerings, packageNameSet, hasPackageGoal, hasCustomPackages]
  );
  const portfolioItems = content.portfolio.items as Array<{
    title: string;
    description: string;
    metric: string;
    imageUrl?: string;
  }>;
  const heroStats = content.trust.stats.slice(0, 3);
  const isTemplateA = templateId === "A";
  const isTemplateB = templateId === "B";
  const isTemplateC = templateId === "C";
  const sectionPadding = isTemplateC ? "py-12 md:py-16" : "py-16 md:py-24";

  const editable = Boolean(onInlineEdit);
  const edit = (section: string, field: string, value: string, index?: number) =>
    onInlineEdit?.(section, field, value, index);
  const faqItems = draftOverrides.faq ?? [];
  const packageCount = packageItems.length;
  const solutionCount = coreOfferings.length > 0 ? coreOfferings.length : offerings.length;

  const isVideoUrl = (url: string) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url);
  const qualificationContext = React.useMemo<BusinessContext>(() => {
    const map: Record<string, BusinessContext["industry"]> = {
      consulting: "coach_consultant",
      coaching: "coach_consultant",
      design: "agency_services",
      development: "agency_services",
      marketing: "agency_services",
      creative: "agency_services",
      legal: "legal_immigration_general",
      accounting: "b2b_services_manufacturing",
      other: "generic",
    };
    return {
      industry: map[answers.serviceType] ?? "generic",
      language: answers.language,
      audience: answers.targetAudience,
      offerType: answers.primaryOffer,
    };
  }, [answers]);

  const handleExport = async () => {
    const root = document.getElementById("landing-root");
    if (!root) return;

    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      const plan = data?.plan;

      if (plan !== "business" && plan !== "pro") {
        toast.error(
          pickLang(lang, {
            en: "Upgrade plan to export HTML",
            fa: "برای خروجی HTML پلن را ارتقا دهید",
            ar: "قم بترقية الخطة لتصدير HTML",
            fi: "Päivitä paketti HTML‑vientiin",
          })
        );
        setPricingModalOpen(true);
        return;
      }

      setPlan(plan);

      const html = exportLandingHTML(answers, root as HTMLElement);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "landing-page.html";
      a.click();

      URL.revokeObjectURL(url);
      toast.success(
        pickLang(lang, {
          en: "Exported successfully",
          fa: "با موفقیت خروجی گرفته شد",
          ar: "تم التصدير بنجاح",
          fi: "Vienti onnistui",
        })
      );
    } catch {
      toast.error(
        pickLang(lang, {
          en: "Export failed",
          fa: "خروجی‌گیری ناموفق بود",
          ar: "فشل التصدير",
          fi: "Vienti epäonnistui",
        })
      );
      setPricingModalOpen(true);
    }
  };

  const langRaw = (answers as any)?.language?.toLowerCase?.() ?? "";
  const isRTL = langRaw.includes("arabic") || langRaw.includes("persian") || langRaw.includes("farsi");

  return (
    <div
      id="landing-root"
      className="donepage-surface-theme min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {mediaPreview ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setMediaPreview(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-[rgb(var(--bg))] p-4 text-[rgb(var(--text))] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMediaPreview(null)}
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))] hover:bg-[rgb(var(--surface))]"
            >
              <X className="h-3.5 w-3.5" />
              {pickLang(lang, { en: "Close", fa: "بستن", ar: "إغلاق", fi: "Sulje" })}
            </button>
            <div className="mt-8 max-h-[70vh] overflow-auto">
              {mediaPreview.isVideo ? (
                <video
                  src={mediaPreview.src}
                  className="max-h-[62vh] w-full rounded-xl object-contain"
                  controls
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaPreview.src}
                  alt={mediaPreview.title ?? "Preview"}
                  className="max-h-[62vh] w-full rounded-xl object-contain"
                />
              )}
            </div>
            {mediaPreview.title ? (
              <div className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                {mediaPreview.title}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {/* ACTION BAR */}
      {mode === "preview" && (
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {pickLang(lang, {
                    en: "Landing Ready",
                    fa: "لندینگ آماده است",
                    ar: "الصفحة جاهزة",
                    fi: "Sivu valmis",
                  })}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {pickLang(lang, {
                    en: "SEO-ready · Conversion-focused",
                    fa: "آماده سئو · متمرکز بر تبدیل",
                    ar: "جاهزة للسيو · تركيز على التحويل",
                    fi: "SEO‑valmis · Konversiokeskeinen",
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                {pickLang(lang, { en: "Edit Answers", fa: "ویرایش پاسخ‌ها", ar: "تعديل الإجابات", fi: "Muokkaa vastauksia" })}
              </Button>
              <Button size="sm" onClick={() => setPublishModalOpen(true)}>
                <Globe className="mr-2 h-4 w-4" />
                {pickLang(lang, { en: "Publish", fa: "انتشار", ar: "نشر", fi: "Julkaise" })}
              </Button>
            </div>
          </div>
          {publishHint ? (
            <div className="mx-auto max-w-7xl px-4 pb-3">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-xs font-medium text-[rgb(var(--accent))]">
                {publishHint === "custom"
                  ? "Custom domain selected. Open Publish and enter your domain."
                  : "Donepage subdomain selected. Open Publish to use the suggested subdomain."}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className={mode === "preview" ? "pt-16" : ""}>
        {mode !== "preview" ? (
          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>
        ) : null}
        {/* HERO */}
        {/* Visual QA checklist:
            - Hero content centered and balanced
            - CTA visible in first viewport
            - Body text readable in daylight
            - No heavy dark gradients by default
            - Cards consistent (border + shadow-sm + rounded-2xl)
        */}
        <section
          id="hero"
          className={[
            "section-tone section-tone-hero relative flex items-center justify-center overflow-hidden px-4 bg-[rgb(var(--bg))]",
            mode === "preview" ? "min-h-[calc(100vh-4rem)]" : "min-h-screen",
            sectionPadding,
            isTemplateC ? "border-b border-[rgb(var(--border))]" : "",
          ].join(" ")}
        >
          <div className="mx-auto w-full max-w-7xl px-6">
            <div
              className={[
                "grid gap-12 items-center",
                isTemplateB ? "grid-cols-1 text-center" : "lg:grid-cols-2",
              ].join(" ")}
            >
              <div className={isTemplateB ? "mx-auto w-full max-w-2xl text-center" : "w-full max-w-xl text-center"}>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-2 text-xs font-semibold text-[rgb(var(--muted))]">
                  <Sparkles className="h-4 w-4 text-[rgb(var(--accent))]" />
                  {heroBusinessName}
                </div>

              <EditableField
                as="h1"
                value={heroHeadline}
                className="mx-auto max-w-xl text-5xl font-semibold leading-tight tracking-tight text-[rgb(var(--text))]"
                onSave={editable ? (v) => edit("hero", "headline", v) : undefined}
                placeholder="Headline"
                max={80}
              />

              <EditableField
                as="p"
                value={heroSubheadline}
                className="mx-auto mt-4 max-w-3xl text-lg text-[rgb(var(--muted))]"
                onSave={editable ? (v) => edit("hero", "subheadline", v) : undefined}
                placeholder="Subheadline"
                max={200}
                multiline
              />
              <p className="mt-3 text-sm font-medium text-[rgb(var(--muted))]">
                {pickLang(lang, {
                  en: "Designed for clarity, trust, and conversion from first visit.",
                  fa: "برای وضوح، اعتماد و تبدیل از اولین بازدید طراحی شده است.",
                  ar: "مصمم للوضوح والثقة والتحويل من الزيارة الأولى.",
                  fi: "Suunniteltu selkeyteen, luottamukseen ja konversioon ensivierailusta.",
                })}
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
                >
                  <a href={heroPrimaryHref}>
                    {heroPrimaryCTA}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href={heroSecondaryHref}>
                    {heroSecondaryCTA}
                  </a>
                </Button>
              </div>
              {editable ? (
                <div className="mt-3 grid gap-3 text-xs text-[rgb(var(--muted))]">
                  <EditableField
                    as="div"
                    value={heroPrimaryCTA}
                    className="text-xs font-medium text-[rgb(var(--text))]"
                    onSave={(v) => edit("hero", "ctaText", v)}
                    placeholder="CTA text"
                    max={40}
                  />
                  <EditableField
                    as="div"
                    value={draftOverrides.heroPrimaryUrl || ""}
                    className="text-xs text-[rgb(var(--muted))]"
                    onSave={(v) => edit("hero", "ctaLink", v)}
                    placeholder="https://your-link.com"
                    max={500}
                  />
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {heroBadges.map((badge, idx) => (
                  <div
                    key={`${badge}-${idx}`}
                    className="flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--muted))] shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-[rgb(var(--accent))]" />
                    {badge}
                  </div>
                ))}
              </div>
              {isTemplateC ? (
                <div className="mx-auto mt-6 h-2 w-24 rounded-full bg-[rgb(var(--accent))]" />
              ) : null}

              <div className="mx-auto mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-white px-3 py-3 shadow-sm">
                  <div className="text-lg font-semibold text-[rgb(var(--text))]">{solutionCount}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {pickLang(lang, { en: "Solutions", fa: "راهکار", ar: "حلول", fi: "Ratkaisut" })}
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-white px-3 py-3 shadow-sm">
                  <div className="text-lg font-semibold text-[rgb(var(--text))]">{packageCount}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {pickLang(lang, { en: "Packages", fa: "پکیج", ar: "باقات", fi: "Paketit" })}
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgb(var(--border))] bg-white px-3 py-3 shadow-sm">
                  <div className="text-lg font-semibold text-[rgb(var(--text))]">{portfolioItems.length}</div>
                  <div className="text-xs text-[rgb(var(--muted))]">
                    {pickLang(lang, { en: "Portfolio", fa: "نمونه‌کار", ar: "معرض الأعمال", fi: "Portfolio" })}
                  </div>
                </div>
              </div>
            </div>

            {isTemplateB ? null : (
              <Card className="reveal-up justify-self-center w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between text-sm font-semibold text-[rgb(var(--text))]">
                    {pickLang(lang, {
                      en: "Performance Snapshot",
                      fa: "نمای سریع",
                      ar: "لمحة سريعة",
                      fi: "Pikatilanne",
                    })}
                    <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      {pickLang(lang, { en: "Live", fa: "زنده", ar: "مباشر", fi: "Live" })}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                    {heroStats.map((s, idx) => {
                      const rate = 70 + idx * 10;
                      return (
                        <div
                          key={`${s.label}-${idx}`}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-[rgb(var(--text))]">{s.value}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[rgb(var(--accent))]">
                                {rate}%
                              </span>
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[rgb(var(--surface))]">
                                <div
                                  className="h-full rounded-full bg-[rgb(var(--accent))]"
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted))]">{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 rounded-xl border border-gray-200 bg-[rgb(var(--surface))] p-3 text-xs text-[rgb(var(--muted))]">
                    {pickLang(lang, {
                      en: "Structured for professional positioning, premium trust signals, and clean conversion flow.",
                      fa: "ساختاربندی‌شده برای جایگاه حرفه‌ای، سیگنال‌های اعتماد ممتاز و جریان تبدیل شفاف.",
                      ar: "مهيكل لتموضع احترافي وإشارات ثقة قوية وتدفق تحويل واضح.",
                      fi: "Rakennettu ammattimaiseen positiointiin, vahvoihin luottamussignaaleihin ja selkeään konversiovirtaan.",
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        </section>

        {isTemplateB ? (
          <section className={`px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <h3 className="text-2xl font-semibold text-[rgb(var(--text))]">Proof snapshot</h3>
                <p className="mt-2 text-[rgb(var(--muted))]">
                  {pickLang(lang, {
                    en: "A quick look at the signals that build credibility and conversion.",
                    fa: "نمایی سریع از سیگنال‌هایی که اعتماد و تبدیل ایجاد می‌کنند.",
                    ar: "نظرة سريعة على الإشارات التي تعزز الثقة والتحويل.",
                    fi: "Pikakatsaus signaaleihin, jotka rakentavat luottamusta ja konversiota.",
                  })}
                </p>
              </div>
              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between text-sm font-semibold text-[rgb(var(--text))]">
                    {pickLang(lang, {
                      en: "Performance Snapshot",
                      fa: "نمای سریع",
                      ar: "لمحة سريعة",
                      fi: "Pikatilanne",
                    })}
                    <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[rgb(var(--muted))]">
                      {pickLang(lang, { en: "Live", fa: "زنده", ar: "مباشر", fi: "Live" })}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {heroStats.map((s, idx) => {
                      const rate = 70 + idx * 10;
                      return (
                        <div
                          key={`${s.label}-${idx}`}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-[rgb(var(--text))]">{s.value}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-[rgb(var(--accent))]">
                                {rate}%
                              </span>
                              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[rgb(var(--surface))]">
                                <div
                                  className="h-full rounded-full bg-[rgb(var(--accent))]"
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-[rgb(var(--muted))]">{s.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        ) : null}

        {/* ABOUT */}
        {answers.includeAbout === "yes" && content.about && (
          <section className="section-tone section-tone-about px-4 py-20 bg-[rgb(var(--surface))]">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200">
                  {content.about.badge}
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">{content.about.title}</h2>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{content.about.story}</p>
                <div className="mt-6 grid gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <div>
                    {pickLang(lang, {
                      en: "Mission",
                      fa: "ماموریت",
                      ar: "المهمة",
                      fi: "Missio",
                    })}
                    : {content.about.mission}
                  </div>
                  <div>
                    {pickLang(lang, {
                      en: "Team",
                      fa: "تیم",
                      ar: "الفريق",
                      fi: "Tiimi",
                    })}
                    : {content.about.team}
                  </div>
                  <div>
                    {pickLang(lang, {
                      en: "Experience",
                      fa: "سابقه",
                      ar: "الخبرة",
                      fi: "Kokemus",
                    })}
                    : {content.about.experience}{" "}
                    {pickLang(lang, { en: "years", fa: "سال", ar: "سنة", fi: "vuotta" })}
                  </div>
                </div>
              </div>

              {answers.aboutImageUrl?.trim() ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm dark:border-gray-700 dark:bg-slate-800">
                  {isVideoUrl(answers.aboutImageUrl.trim()) ? (
                    <video
                      src={answers.aboutImageUrl.trim()}
                      className="h-auto w-full rounded-xl object-cover"
                      controls
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={answers.aboutImageUrl.trim()}
                      alt={`${content.about.title} image`}
                      className="h-auto w-full rounded-xl object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* VALUE / BENEFITS */}
        <section id="why-choose-us" className={`section-tone section-tone-value px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.01em] text-[rgb(var(--text))]">{content.value.title}</h2>
              <p className="mt-3 text-[rgb(var(--muted))]">{content.value.description}</p>
            </div>
            <div className={`mt-8 grid gap-6 ${isTemplateB ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {content.value.benefits.map((b, idx) => (
                <Card
                  key={`${b.title}-${idx}`}
                  className="reveal-up card-lift border-[rgb(var(--border))] bg-white rounded-2xl shadow-sm"
                >
                  <CardContent className="pt-6">
                    <EditableField
                      as="div"
                      value={b.title}
                      className="text-lg font-semibold text-[rgb(var(--text))]"
                      onSave={editable ? (v) => edit("benefits", "title", v, idx) : undefined}
                      placeholder="Benefit title"
                      max={60}
                    />
                    <EditableField
                      as="p"
                      value={b.description}
                      className="mt-2 text-sm text-[rgb(var(--muted))]"
                      onSave={editable ? (v) => edit("benefits", "description", v, idx) : undefined}
                      placeholder="Benefit description"
                      max={140}
                      multiline
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className={`section-tone section-tone-services px-4 ${sectionPadding} bg-[rgb(var(--bg))]`}>
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">{content.services.title}</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{content.services.subtitle}</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {coreOfferings.map((offer, idx) => (
                <Card
                  key={`${offer.name}-${idx}`}
                  className="reveal-up card-lift border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-sm"
                >
                  <CardContent className="pt-6">
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{offer.name}</div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{offer.description}</p>
                    <div className="mt-4 grid gap-2 text-sm text-gray-700 dark:text-gray-200">
                      {offer.features.map((f, fIdx) => (
                        <div key={`${f}-${fIdx}`} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-[rgb(var(--accent))]" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {packageItems.length > 0 ? (
              <div id="packages" className="mt-12">
                {coreOfferings.length > 0 ? (
                  <h3 className="text-2xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">
                    {pickLang(lang, {
                      en: "Service Packages",
                      fa: "پکیج‌های خدمات",
                      ar: "باقات الخدمات",
                      fi: "Palvelupaketit",
                    })}
                  </h3>
                ) : null}
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {pickLang(lang, {
                    en: "Packages extracted directly from your answers.",
                    fa: "پکیج‌ها مستقیماً از پاسخ‌های شما استخراج شده‌اند.",
                    ar: "تم استخراج الباقات مباشرة من إجاباتك.",
                    fi: "Paketit on haettu suoraan vastauksistasi.",
                  })}
                </p>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {packageItems.map((pkg, idx) => (
                    <Card
                      key={`${pkg.name}-${idx}`}
                    className="reveal-up card-lift border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-sm"
                    >
                      <CardContent className="pt-6">
                    <div className="text-xl font-semibold text-[rgb(var(--text))]">{pkg.name}</div>
                        {pkg.description ? (
                          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{pkg.description}</p>
                        ) : null}
                        {pkg.metric ? (
                        <div className="mt-4 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))]">
                            {pkg.metric}
                          </div>
                        ) : null}
                        <div className="mt-5">
                          <Button
                            asChild
                            size="sm"
                            className="bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] hover:opacity-90"
                          >
                            <a href="#contact">
                              {pickLang(lang, {
                                en: "Choose This Package",
                                fa: "انتخاب این پکیج",
                                ar: "اختر هذه الباقة",
                                fi: "Valitse tämä paketti",
                              })}
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {/* PROCESS */}
        {content.steps?.steps?.length ? (
          <section className={`section-tone section-tone-process px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
            <div className="mx-auto max-w-6xl">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">
                  {content.steps.title}
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {content.steps.subtitle}
                </p>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.steps.steps.map((item: any, idx: number) => (
                <Card
                  key={`${item.no}-${idx}`}
                  className="reveal-up card-lift border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-sm"
                >
                  <CardContent className="pt-6">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--accent))] text-sm font-bold text-white">
                        {item.no}
                      </div>
                      <div className="mt-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {item.title}
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* TRUST / STATS */}
        <section className={`section-tone section-tone-trust px-4 ${sectionPadding} bg-[rgb(var(--bg))]`}>
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">{content.trust.title}</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{content.trust.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.trust.stats.map((s, idx) => (
                <div
                  key={`${s.label}-${idx}`}
                  className="card-lift rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-6 text-center shadow-sm"
                >
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{s.value}</div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{s.label}</div>
                </div>
              ))}
            </div>
            {content.trust.guarantee ? (
              <div className="mt-10 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-[rgb(var(--text))]">
                  <ShieldCheck className="h-4 w-4" />
                  {content.trust.guarantee.title}
                </div>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                  {content.trust.guarantee.description}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* PORTFOLIO */}
        <section id="portfolio" className={`section-tone section-tone-portfolio px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">{content.portfolio.title}</h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">{content.portfolio.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {portfolioItems.map((item, idx) => (
                <Card
                  key={`${item.title}-${idx}`}
                  className="reveal-up card-lift border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-sm"
                >
                  <CardContent className="pt-6">
                    {"imageUrl" in item && (item as any).imageUrl ? (
                      <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-800">
                        <button
                          type="button"
                          className="block w-full cursor-zoom-in"
                          onClick={() =>
                            setMediaPreview({
                              src: (item as any).imageUrl,
                              title: item.title,
                              isVideo: isVideoUrl((item as any).imageUrl),
                            })
                          }
                        >
                          {isVideoUrl((item as any).imageUrl) ? (
                            <video
                              src={(item as any).imageUrl}
                              className="h-40 w-full object-cover"
                              muted
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={(item as any).imageUrl}
                              className="h-40 w-full object-cover"
                              alt={item.title}
                            />
                          )}
                        </button>
                      </div>
                    ) : null}
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                    <div className="mt-4 inline-flex items-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-1 text-xs font-semibold text-[rgb(var(--muted))]">
                      {item.metric}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {faqItems.length > 0 ? (
        <section className={`section-tone px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
            <div className="mx-auto max-w-5xl">
              <h2 className="text-3xl font-bold tracking-[-0.01em] text-gray-900 dark:text-gray-100">
                FAQ
              </h2>
              <div className="mt-8 space-y-4">
                {faqItems.map((item, idx) => (
                  <div
                    key={`${item.question}-${idx}`}
                  className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] p-5 shadow-sm"
                  >
                    <EditableField
                      as="div"
                      value={item.question}
                      className="text-base font-semibold text-[rgb(var(--text))]"
                      onSave={editable ? (v) => edit("faq", "question", v, idx) : undefined}
                      placeholder="Question"
                      max={120}
                    />
                    <EditableField
                      as="p"
                      value={item.answer}
                      className="mt-2 text-sm text-[rgb(var(--muted))]"
                      onSave={editable ? (v) => edit("faq", "answer", v, idx) : undefined}
                      placeholder="Answer"
                      max={300}
                      multiline
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <section className={`section-tone section-tone-cta px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
          <div className="mx-auto max-w-5xl rounded-2xl border border-[rgb(var(--border))] bg-white px-6 py-10 text-center shadow-sm">
            <EditableField
              as="h2"
              value={content.cta.headline}
              className="text-3xl font-bold tracking-[-0.01em] text-[rgb(var(--text))]"
              onSave={editable ? (v) => edit("cta", "title", v) : undefined}
              placeholder="CTA headline"
              max={100}
            />
            <p className="mx-auto mt-4 max-w-2xl text-[rgb(var(--muted))]">
              {content.cta.subheadline}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
              >
                <a href={ctaPrimaryHref}>
                  {content.cta.buttonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <QualificationTrigger slug={slug} context={qualificationContext} />
            </div>
            {editable ? (
              <div className="mt-4 grid gap-3 text-xs text-[rgb(var(--muted))]">
                <EditableField
                  as="div"
                  value={content.cta.buttonText}
                  className="text-xs font-medium text-[rgb(var(--text))]"
                  onSave={(v) => edit("cta", "buttonText", v)}
                  placeholder="Button text"
                  max={40}
                />
                <EditableField
                  as="div"
                  value={draftOverrides.ctaButtonUrl || ""}
                  className="text-xs text-[rgb(var(--muted))]"
                  onSave={(v) => edit("cta", "buttonLink", v)}
                  placeholder="https://your-link.com"
                  max={500}
                />
              </div>
            ) : null}
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-300">{content.cta.subtext}</div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className={`px-4 ${sectionPadding} bg-[rgb(var(--surface))]`}>
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.01em] text-[rgb(var(--text))]">
              {content.contact.title}
            </h2>
            <p className="mt-3 text-[rgb(var(--muted))]">{content.contact.subtitle}</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {/* BOOKING */}
              <ContactCard
                icon={<Calendar />}
                title={content.contact.call.title}
                href={bookingHref}
                label={content.contact.call.cta}
                disabledText={content.contact.call.disabledText}
              />

              {/* EMAIL */}
              <ContactCard
                icon={<Mail />}
                title={content.contact.email.title}
                href={emailHref}
                label={content.contact.email.cta}
                disabledText={content.contact.email.disabledText}
              />

              {/* WHATSAPP */}
              <ContactCard
                icon={<MessageSquare />}
                title={content.contact.chat.title}
                href={waHref}
                label={content.contact.chat.cta}
                disabledText={content.contact.chat.disabledText}
              />
            </div>
            {(draftOverrides.contactPhone ||
              draftOverrides.contactTelegram ||
              draftOverrides.contactInstagram) && (
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[rgb(var(--muted))]">
                {draftOverrides.contactPhone ? (
                  <a className="underline" href={phoneHref}>
                    {draftOverrides.contactPhone}
                  </a>
                ) : null}
                {draftOverrides.contactTelegram ? (
                  <a className="underline" href={telegramHref}>
                    Telegram
                  </a>
                ) : null}
                {draftOverrides.contactInstagram ? (
                  <a className="underline" href={instagramHref}>
                    Instagram
                  </a>
                ) : null}
              </div>
            )}
            {editable ? (
              <div className="mt-6 grid gap-3 text-xs text-[rgb(var(--muted))] md:grid-cols-2">
                <EditableField
                  as="div"
                  value={draftOverrides.contactEmail || ""}
                  className="text-xs"
                  onSave={(v) => edit("contact", "email", v)}
                  placeholder="Email"
                  max={120}
                />
                <EditableField
                  as="div"
                  value={draftOverrides.contactBookingLink || ""}
                  className="text-xs"
                  onSave={(v) => edit("contact", "bookingLink", v)}
                  placeholder="Booking link (https://...)"
                  max={200}
                />
                <EditableField
                  as="div"
                  value={draftOverrides.contactWhatsApp || ""}
                  className="text-xs"
                  onSave={(v) => edit("contact", "whatsapp", v)}
                  placeholder="WhatsApp (https://...)"
                  max={200}
                />
                <EditableField
                  as="div"
                  value={draftOverrides.contactPhone || ""}
                  className="text-xs"
                  onSave={(v) => edit("contact", "phone", v)}
                  placeholder="Phone"
                  max={40}
                />
                <EditableField
                  as="div"
                  value={draftOverrides.contactTelegram || ""}
                  className="text-xs"
                  onSave={(v) => edit("contact", "telegram", v)}
                  placeholder="Telegram (https://...)"
                  max={200}
                />
                <EditableField
                  as="div"
                  value={draftOverrides.contactInstagram || ""}
                  className="text-xs"
                  onSave={(v) => edit("contact", "instagram", v)}
                  placeholder="Instagram (https://...)"
                  max={200}
                />
              </div>
            ) : null}
          </div>
        </section>

        <footer className="bg-[rgb(var(--surface))] py-10 text-center text-[rgb(var(--muted))]">
          © 2026 {hero.businessName} · Built with Donepage
        </footer>
      </div>

      <PublishModal
        open={isPublishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        answers={answers}
        onOpenPricing={() => setPricingModalOpen(true)}
        defaultChoice={publishHint}
      />

      <PricingModal
        open={isPricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

/* ----------------------------- */

function ContactCard({
  icon,
  title,
  href,
  label,
  disabledText,
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  label: string;
  disabledText?: string;
}) {
  return (
    <Card className="text-center border-[rgb(var(--border))] bg-[rgb(var(--bg))] shadow-sm">
      <CardContent className="pt-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))]">
          {icon}
        </div>
        <h3 className="font-semibold dark:text-gray-100">{title}</h3>

        {href ? (
          <Button asChild className="mt-4 w-full bg-[rgb(var(--accent))] text-[rgb(var(--accent-foreground))] hover:opacity-90">
            <a href={href} target="_blank" rel="noreferrer" className="text-white dark:text-slate-950">
              {label}
            </a>
          </Button>
        ) : (
          <div className="mt-4 rounded-xl border border-gray-200 bg-[rgb(var(--surface))] px-3 py-2 text-xs text-[rgb(var(--muted))]">
            {disabledText || "Not set"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
