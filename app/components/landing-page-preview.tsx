// app/components/landing-page-preview.tsx
"use client";

import * as React from "react";
import { generateContentAdvanced } from "@/app/components/content-advanced";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Edit,
  Globe,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

import type { QuestionnaireAnswers } from "./questionnaire";
import { PublishModal } from "./publish-modal";
import { PricingModal } from "./pricing-modal";
import { exportLandingHTML } from "@/app/lib/export-html";
import { setPlan } from "@/app/lib/plan-store";

interface LandingPagePreviewProps {
  answers: QuestionnaireAnswers;
  onEdit: () => void;
  mode?: "preview" | "export";
}

export function LandingPagePreview({
  answers,
  onEdit,
  mode = "preview",
}: LandingPagePreviewProps) {
  const [isPublishModalOpen, setPublishModalOpen] = React.useState(false);
  const [isPricingModalOpen, setPricingModalOpen] = React.useState(false);

  /** 🔑 SINGLE SOURCE OF CONTENT */
  const content = React.useMemo(
    () => generateContentAdvanced(answers),
    [answers]
  );

  /** 🔑 SINGLE SOURCE OF LINKS (NO RE-COMPUTE) */
  const emailHref = content.contact?.email?.href || "";
  const bookingHref = content.contact?.call?.href || emailHref || "";
  const waHref = content.contact?.chat?.href || emailHref || "";
  const hero = content.meta;

  const isVideoUrl = (url: string) => /\.(mp4|webm|mov)(\?.*)?$/i.test(url);

  const handleExport = async () => {
    const root = document.getElementById("landing-root");
    if (!root) return;

    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      const plan = data?.plan;

      if (plan !== "business" && plan !== "pro") {
        toast.error("Upgrade plan to export HTML");
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
      toast.success("Exported successfully");
    } catch {
      toast.error("Export failed");
      setPricingModalOpen(true);
    }
  };

  return (
    <div id="landing-root" className="min-h-screen bg-white">
      {/* ACTION BAR */}
      {mode === "preview" && (
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">Landing Ready</div>
                <div className="text-xs text-gray-500">
                  SEO-ready · Conversion-focused
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>

              <Button size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>

              <Button size="sm" onClick={() => setPublishModalOpen(true)}>
                <Globe className="mr-2 h-4 w-4" /> Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={mode === "preview" ? "pt-16" : ""}>
        {/* HERO */}
        <section className="relative px-4 pb-24 pt-20 text-center bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
          <div className="mx-auto max-w-4xl">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-white/70 px-4 py-2 text-xs font-semibold text-blue-700">
              <Sparkles className="h-4 w-4" />
              {hero.businessName}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-600 sm:text-xl">
              {hero.subheadline}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">
                {hero.primaryCTA}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                {hero.secondaryCTA}
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {hero.trustBadges.map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm text-gray-700 shadow-sm"
                >
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE / BENEFITS */}
        <section className="px-4 py-20 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900">{content.value.title}</h2>
              <p className="mt-3 text-gray-600">{content.value.description}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.value.benefits.map((b) => (
                <Card
                  key={b.title}
                  className="border-gray-200 bg-white/90 shadow-lg shadow-blue-500/5"
                >
                  <CardContent className="pt-6">
                    <div className="text-lg font-semibold text-gray-900">{b.title}</div>
                    <p className="mt-2 text-sm text-gray-600">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="px-4 py-20 bg-gradient-to-br from-slate-50 to-cyan-50">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900">{content.services.title}</h2>
              <p className="mt-3 text-gray-600">{content.services.subtitle}</p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {content.services.offerings.map((offer) => (
                <Card
                  key={offer.name}
                  className="border-gray-200 bg-white/90 shadow-lg shadow-cyan-500/5"
                >
                  <CardContent className="pt-6">
                    <div className="text-xl font-semibold text-gray-900">{offer.name}</div>
                    <p className="mt-2 text-sm text-gray-600">{offer.description}</p>
                    <div className="mt-4 grid gap-2 text-sm text-gray-700">
                      {offer.features.map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 text-blue-600" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST / STATS */}
        <section className="px-4 py-20 bg-white">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900">{content.trust.title}</h2>
              <p className="mt-3 text-gray-600">{content.trust.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.trust.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
                >
                  <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                  <div className="mt-2 text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
            {content.trust.guarantee ? (
              <div className="mt-10 rounded-2xl border border-blue-200/60 bg-blue-50/60 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <ShieldCheck className="h-4 w-4" />
                  {content.trust.guarantee.title}
                </div>
                <p className="mt-2 text-sm text-blue-900/80">
                  {content.trust.guarantee.description}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* PORTFOLIO */}
        <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900">{content.portfolio.title}</h2>
              <p className="mt-3 text-gray-600">{content.portfolio.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {content.portfolio.items.map((item) => (
                <Card
                  key={item.title}
                  className="border-gray-200 bg-white/90 shadow-lg shadow-blue-500/5"
                >
                  <CardContent className="pt-6">
                    {"imageUrl" in item && (item as any).imageUrl ? (
                      <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                        {isVideoUrl((item as any).imageUrl) ? (
                          <video
                            src={(item as any).imageUrl}
                            className="h-40 w-full object-cover"
                            controls
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={(item as any).imageUrl}
                            className="h-40 w-full object-cover"
                            alt={item.title}
                          />
                        )}
                      </div>
                    ) : null}
                    <div className="text-lg font-semibold text-gray-900">{item.title}</div>
                    <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                    <div className="mt-4 inline-flex items-center rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.metric}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        {answers.includeAbout === "yes" && content.about && (
          <section className="px-4 py-20 bg-white">
            <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                  {content.about.badge}
                </div>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">{content.about.title}</h2>
                <p className="mt-4 text-gray-600">
                  {answers.aboutText?.trim() || content.about.story}
                </p>
                <div className="mt-6 grid gap-3 text-sm text-gray-700">
                  <div>Mission: {content.about.mission}</div>
                  <div>Team: {content.about.team}</div>
                  <div>Experience: {content.about.experience} years</div>
                </div>
              </div>

              {answers.aboutImageUrl?.trim() ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm">
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

        {/* CTA */}
        <section className="px-4 py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="mx-auto max-w-5xl rounded-3xl border border-blue-200/50 bg-white/70 px-6 py-10 text-center shadow-xl shadow-blue-500/10 backdrop-blur">
            <h2 className="text-3xl font-bold text-gray-900">{content.cta.headline}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">{content.cta.subheadline}</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg">
                {content.cta.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-3 text-xs text-gray-500">{content.cta.subtext}</div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="px-4 py-20 bg-gray-50">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-900">{content.contact.title}</h2>
              <p className="mt-3 text-gray-600">{content.contact.subtitle}</p>
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
          </div>
        </section>

        <footer className="bg-gray-900 py-10 text-center text-gray-400">
          © 2026 {hero.businessName} · Built with Donepage
        </footer>
      </div>

      <PublishModal
        open={isPublishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        answers={answers}
        onOpenPricing={() => setPricingModalOpen(true)}
      />

      <PricingModal
        open={isPricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
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
    <Card className="text-center">
      <CardContent className="pt-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>

        {href ? (
          <Button asChild className="mt-4 w-full">
            <a href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          </Button>
        ) : (
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
            {disabledText || "Not set"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
