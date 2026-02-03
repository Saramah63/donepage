// app/components/landing-page-preview.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Users,
  Zap,
  Target,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Edit,
  Globe,
  CreditCard,
  Heart,
  Briefcase,
} from "lucide-react";

import type { QuestionnaireAnswers } from "./questionnaire";
import { PublishModal } from "./publish-modal";
import { PricingModal } from "./pricing-modal";
import { exportLandingHTML } from "@/app/lib/export-html";

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

  const content = React.useMemo(() => generateContent(answers), [answers]);

  const handleExport = async () => {
    const root = document.getElementById("landing-root") as HTMLElement | null;
    if (!root) return;

    try {
      const pr = await fetch("/api/plan", { cache: "no-store" });
      const data = await pr.json();
      const plan = data?.plan as string | undefined;

      const can = plan === "business" || plan === "pro";
      if (!can) {
        toast.error("Upgrade plan to export HTML");
        setPricingModalOpen(true);
        return;
      }

      const html = exportLandingHTML(answers, root);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "landing-page.html";
      a.click();

      URL.revokeObjectURL(url);
      toast.success("Exported successfully");
    } catch (e: any) {
      toast.error(e?.message ?? "Export failed");
      setPricingModalOpen(true);
    }
  };

  const bookingHref = answers.bookingLink?.trim() || "";
  const emailHref = answers.contactEmail?.trim()
    ? `mailto:${answers.contactEmail.trim()}`
    : "";
  const waHref = answers.contactPhone?.trim()
    ? `https://wa.me/${answers.contactPhone.trim().replace(/\s+/g, "")}`
    : "";

  return (
    <div id="landing-root" className="min-h-screen bg-white">
      {/* Fixed Action Bar (Figma-like) */}
      {mode === "preview" ? (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="border-b border-gray-200 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">
                    Your Landing Page is Ready!
                  </div>
                  <div className="text-xs text-gray-500">
                    Polished, SEO-ready, and conversion-focused
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="border-gray-300 bg-white hover:bg-gray-50"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Answers
                </Button>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  onClick={handleExport}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export HTML
                </Button>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => setPublishModalOpen(true)}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Publish Online
                </Button>

                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                  onClick={() => setPricingModalOpen(true)}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Set Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Content */}
      <div className={mode === "preview" ? "pt-16" : ""}>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 px-4 py-24">
          <div
            className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.65))]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl text-center">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Now Available
              </span>
            </div>

            <div className="mt-6 text-sm font-medium text-gray-700">
              {answers.primaryOffer?.trim() ? (
                <>
                  <span className="font-semibold text-gray-900">
                    {answers.primaryOffer.trim()}
                  </span>
                  <span className="text-gray-400"> · </span>
                  <span>
                    By{" "}
                    <span className="font-semibold text-gray-900">
                      {content.businessName}
                    </span>
                    {answers.city?.trim() ? (
                      <>
                        <span className="text-gray-400"> · </span>
                        <span className="text-gray-700">
                          {answers.city.trim()}
                        </span>
                      </>
                    ) : null}
                  </span>
                </>
              ) : (
                <>
                  By{" "}
                  <span className="font-semibold text-gray-900">
                    {content.businessName}
                  </span>
                  {answers.city?.trim() ? (
                    <>
                      <span className="text-gray-400"> · </span>
                      <span className="text-gray-700">
                        {answers.city.trim()}
                      </span>
                    </>
                  ) : null}
                </>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              {content.hero.headline}
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl md:text-2xl">
              {content.hero.subheadline}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-lg text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl hover:shadow-blue-500/30"
              >
                {content.hero.primaryCTA}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>

              {content.hero.secondaryCTA ? (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 bg-white px-8 py-6 text-lg text-gray-900 hover:bg-gray-50"
                >
                  {content.hero.secondaryCTA}
                </Button>
              ) : null}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {content.hero.trustBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-gray-700 shadow-sm backdrop-blur-sm"
                >
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value */}
        <section className="bg-white px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {content.value.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                {content.value.description}
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {content.value.benefits.map((b, idx) => (
                <Card
                  key={idx}
                  className="group border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="pt-8">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-[1.03]">
                      {b.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {b.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-gray-600">
                      {b.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {content.services.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                {content.services.subtitle}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {content.services.offerings.map((s, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 transition-all group-hover:shadow-xl group-hover:shadow-blue-500/30">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {s.name}
                      </h3>
                      <p className="mt-2 leading-relaxed text-gray-600">
                        {s.description}
                      </p>
                      <ul className="mt-5 space-y-2">
                        {s.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        {answers.includeAbout === "yes" && content.about ? (
          <section className="bg-white px-4 py-24">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 md:grid-cols-2 md:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
                    <Heart className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      About
                    </span>
                  </div>

                  <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                    {content.about.title}
                  </h2>

                  <p className="mt-6 text-lg leading-relaxed text-gray-600">
                    {answers.aboutText?.trim()
                      ? answers.aboutText.trim()
                      : content.about.story}
                  </p>

                  <div className="mt-10 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Our Mission
                        </div>
                        <div className="mt-1 text-gray-600">
                          {content.about.mission}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          Our Team
                        </div>
                        <div className="mt-1 text-gray-600">
                          {content.about.team}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-100 via-cyan-50 to-yellow-50 shadow-lg">
                    <div className="text-center">
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-yellow-500 shadow-xl">
                        <Briefcase className="h-12 w-12 text-white" />
                      </div>
                      <div className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                        {content.about.experience}
                      </div>
                      <div className="mt-2 font-medium text-gray-600">
                        Years of Excellence
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl" />
                  <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Trust */}
        <section className="bg-white px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {content.trust.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                {content.trust.subtitle}
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {content.trust.stats.map((s, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50/30 p-8 text-center"
                >
                  <div className="mb-4 flex justify-center">{s.icon}</div>
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                    {s.value}
                  </div>
                  <div className="mt-2 font-medium text-gray-600">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {answers.testimonialText?.trim() ? (
              <Card className="mx-auto mt-10 max-w-3xl border-gray-200 bg-white shadow-lg">
                <CardContent className="pt-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg leading-relaxed text-gray-700">
                        “{answers.testimonialText.trim()}”
                      </div>
                      {answers.testimonialName?.trim() ? (
                        <div className="mt-3 text-sm font-semibold text-gray-900">
                          — {answers.testimonialName.trim()}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {content.trust.guarantee ? (
              <Card className="mx-auto mt-12 max-w-3xl border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
                <CardContent className="pt-8">
                  <div className="flex items-start gap-6">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {content.trust.guarantee.title}
                      </h3>
                      <p className="mt-3 leading-relaxed text-gray-700">
                        {content.trust.guarantee.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>

        {/* Portfolio */}
        <section className="bg-gradient-to-b from-gray-50 to-white px-4 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                {content.portfolio.title}
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                {content.portfolio.subtitle}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.portfolio.items.map((p, idx) => (
                <Card
                  key={idx}
                  className="group overflow-hidden border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-50">
                    <div
                      className="absolute inset-0 opacity-70"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 1px 1px, rgb(209 213 219 / 0.35) 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                      }}
                      aria-hidden="true"
                    />
                    <div className="relative z-10 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                      {p.icon}
                    </div>
                  </div>

                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {p.description}
                    </p>

                    {p.metric ? (
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="font-medium text-green-700">
                            {p.metric}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 px-4 py-24 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {content.cta.headline}
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-blue-100 sm:text-xl md:text-2xl">
              {content.cta.subheadline}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3">
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-100 underline underline-offset-4 hover:text-white"
              >
                Submit this page to Google
              </a>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                size="lg"
                className="group bg-white px-8 py-6 text-lg text-blue-700 shadow-xl transition-all hover:bg-gray-50 hover:shadow-2xl"
              >
                {content.cta.buttonText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>

            <p className="mt-6 text-sm text-blue-200">{content.cta.subtext}</p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white px-4 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg text-gray-600 sm:text-xl">
                Ready to get started? Choose the best way to connect.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {/* Booking */}
              <Card className="group border-gray-200 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="pt-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20 transition-all group-hover:shadow-xl group-hover:shadow-blue-500/30">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    Book a Call
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Schedule a consultation to discuss your needs
                  </p>

                  {bookingHref ? (
                    <Button
                    asChild
                    className="mt-5 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              >
                    <a href={answers.bookingLink || "#"} target="_blank" rel="noreferrer">
                      Schedule Now
                    </a>
                    </Button>

                  ) : (
                    <Button
                      disabled
                      className="mt-5 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white opacity-60"
                    >
                      Booking link not set
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="group border-gray-200 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="pt-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-100 to-cyan-100 transition-all group-hover:border-blue-300">
                    <Mail className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    Send an Email
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Prefer email? Drop a message anytime
                  </p>

                  {emailHref ? (
                    <Button
                    asChild
                    variant="outline"
                    className="mt-5 w-full border-gray-300 bg-white hover:bg-gray-50"
                  >
                    <a href={answers.contactEmail ? `mailto:${answers.contactEmail}` : "#"}>Email Us</a>
                  </Button>

                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="mt-5 w-full border-gray-300 bg-white opacity-60"
                    >
                      Email not set
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* WhatsApp */}
              <Card className="group border-gray-200 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="pt-8">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-100 to-cyan-100 transition-all group-hover:border-blue-300">
                    <MessageSquare className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    WhatsApp
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Message directly for quick answers
                  </p>

                  {waHref ? (
                    <Button
  asChild
  variant="outline"
  className="mt-5 w-full border-gray-300 bg-white hover:bg-gray-50"
>
  <a
    href={answers.whatsApp ? `https://wa.me/${answers.whatsApp.replace(/\D/g, "")}` : "#"}
    target="_blank"
    rel="noreferrer"
  >
    Start Chat
  </a>
</Button>

                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="mt-5 w-full border-gray-300 bg-white opacity-60"
                    >
                      WhatsApp not set
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lead Form */}
            <Card className="mx-auto mt-10 max-w-3xl border-gray-200 bg-white shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-gray-900">
                    Send a message
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Leave your details and we’ll get back to you.
                  </div>
                </div>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Message captured (wire to backend next).");
                  }}
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      name="name"
                      placeholder="Name"
                      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>

                  <textarea
                    name="message"
                    placeholder="Message (optional)"
                    className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/30"
                  />

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {emailHref ? (
                      <Button
                        type="button"
                        asChild
                        variant="outline"
                        className="w-full border-gray-300 bg-white hover:bg-gray-50"
                      >
                        <a href={emailHref}>Send via Email</a>
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled
                        variant="outline"
                        className="w-full border-gray-300 bg-white opacity-60"
                      >
                        Email not set
                      </Button>
                    )}

                    {waHref ? (
                      <Button
                        type="button"
                        asChild
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                      >
                        <a href={waHref} target="_blank" rel="noreferrer">
                          Send via WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                      >
                        Submit
                      </Button>
                    )}
                  </div>

                  <div className="text-center text-xs text-gray-500">
                    By submitting, you agree to be contacted about your request.
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-900 px-4 py-12 text-white">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-gray-400">
              © 2026 {content.businessName}. Built with Donepage.
            </p>
          </div>
        </footer>
      </div>

      <PublishModal
  open={isPublishModalOpen}
  onClose={() => setPublishModalOpen(false)}
  answers={answers}
/>
      <PricingModal
        open={isPricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
      />
    </div>
  );
}

/* -----------------------------
   Content generation (no design change — only wiring & correctness)
------------------------------ */

function generateContent(answers: QuestionnaireAnswers) {
  const serviceLabels: Record<string, string> = {
    consulting: "Business Consulting",
    coaching: "Coaching & Training",
    design: "Design Services",
    development: "Web/Software Development",
    marketing: "Marketing & Advertising",
    creative: "Creative Services",
    legal: "Legal Services",
    accounting: "Accounting & Finance",
  };

  const businessName =
    answers.businessName?.trim() ||
    serviceLabels[answers.serviceType] ||
    "Professional Services";

  const hero = {
    headline: generateHeadline(answers),
    subheadline: generateSubheadline(answers),
    primaryCTA: generatePrimaryCTA(answers),
    secondaryCTA: "Learn More",
    trustBadges: generateTrustBadges(answers),
  };

  const value = {
    title: "Why Choose Us?",
    description: generateValueDescription(answers),
    benefits: generateBenefits(answers),
  };

  const services = {
    title: `Our ${serviceLabels[answers.serviceType] ?? "Professional"} Solutions`,
    subtitle: "Comprehensive services tailored to your unique needs",
    offerings: generateServiceOfferings(answers),
  };

  const about =
    answers.includeAbout === "yes"
      ? {
          title: "Who We Are",
          story:
            "We are dedicated to delivering outcomes that matter — with a clean process and high standards.",
          mission:
            "Deliver exceptional service that helps clients hit their goals faster with confidence.",
          team:
            "A focused, experienced team committed to quality, clarity, and results.",
          experience: "10+",
        }
      : null;

  const trust = {
    title: "Trusted by Clients Like You",
    subtitle: "Clear process. Strong outcomes. Repeatable results.",
    stats: generateStats(answers),
    guarantee: generateGuarantee(answers),
  };

  const portfolio = {
    title: generatePortfolioTitle(answers),
    subtitle: "A snapshot of outcomes delivered for clients",
    items: generatePortfolioItems(answers),
  };

  const cta = {
    headline: generateCTAHeadline(answers),
    subheadline: generateCTASubheadline(answers),
    buttonText: generatePrimaryCTA(answers),
    subtext: generateCTASubtext(answers),
  };

  return {
    businessName,
    hero,
    value,
    services,
    about,
    trust,
    portfolio,
    cta,
  };
}

function generateHeadline(answers: QuestionnaireAnswers): string {
  const offer = answers.primaryOffer?.trim();
  if (offer) return offer;

  const { serviceType, keyDifferentiator, targetAudience } = answers;

  const audienceText: Record<string, string> = {
    individuals: "Get Results",
    freelancers: "Grow Your Business",
    "small-business": "Transform Your Business",
    "medium-business": "Scale Your Operations",
    enterprise: "Drive Enterprise Success",
  };

  const diffText: Record<string, string> = {
    speed: "Fast, Reliable",
    quality: "Premium Quality",
    expertise: "Expert",
    personal: "Personalized",
    results: "Results-Driven",
  };

  const serviceText =
    serviceType === "consulting"
      ? "Consulting"
      : serviceType === "coaching"
      ? "Coaching"
      : serviceType === "design"
      ? "Design"
      : serviceType === "development"
      ? "Development"
      : serviceType === "marketing"
      ? "Marketing"
      : serviceType === "creative"
      ? "Creative Services"
      : serviceType === "legal"
      ? "Legal Services"
      : "Financial Services";

  return `${diffText[keyDifferentiator]} ${serviceText} to ${audienceText[targetAudience]}`;
}

function generateSubheadline(answers: QuestionnaireAnswers): string {
  const expText: Record<string, string> = {
    new: "Fresh, modern solutions backed by the latest industry practices",
    intermediate: "Proven expertise with a track record of real results",
    expert: "Deep industry knowledge refined over years of experience",
    veteran: "Decades of expertise delivering consistent excellence",
  };

  const base = expText[answers.experienceLevel];
  const city = answers.city?.trim();
  return city ? `${base} · Serving ${city}` : base;
}

function generatePrimaryCTA(answers: QuestionnaireAnswers): string {
  switch (answers.primaryGoal) {
    case "leads":
      return "Get Your Free Consultation";
    case "calls":
      return "Book Your Discovery Call";
    case "packages":
      return "View Service Packages";
    case "credibility":
      return "Learn More About Us";
    default:
      return "Get Started Today";
  }
}

function generateTrustBadges(answers: QuestionnaireAnswers): string[] {
  const badges: string[] = [];

  if (answers.trustFactor === "guarantee") badges.push("100% Satisfaction Guaranteed");
  else if (answers.trustFactor === "certifications") badges.push("Certified Professionals");
  else badges.push("Trusted by Clients");

  if (answers.pricingApproach === "budget") badges.push("Affordable Pricing");
  else if (answers.pricingApproach === "premium") badges.push("Premium Service");

  badges.push("Fast Response Time");
  return badges;
}

function generateValueDescription(answers: QuestionnaireAnswers): string {
  if (answers.businessStage === "starting") {
    return "A clean, modern approach that helps you win your first clients faster.";
  }
  if (answers.businessStage === "established") {
    return "A proven process that helps established businesses grow with confidence.";
  }
  return "Enterprise-grade thinking with fast execution and clear outcomes.";
}

function generateBenefits(
  answers: QuestionnaireAnswers
): Array<{
  icon: JSX.Element;
  title: string;
  description: string;
}> {
  const benefits: Array<{ icon: JSX.Element; title: string; description: string }> = [];

  if (answers.keyDifferentiator === "speed") {
    benefits.push({
      icon: <Clock className="h-6 w-6 text-white" />,
      title: "Lightning-Fast Delivery",
      description: "Get results quickly without sacrificing quality.",
    });
  } else if (answers.keyDifferentiator === "quality") {
    benefits.push({
      icon: <Star className="h-6 w-6 text-white" />,
      title: "Exceptional Quality",
      description: "Meticulous attention to detail in every deliverable.",
    });
  } else if (answers.keyDifferentiator === "expertise") {
    benefits.push({
      icon: <Award className="h-6 w-6 text-white" />,
      title: "Specialized Expertise",
      description: "Deep domain knowledge you can rely on.",
    });
  } else if (answers.keyDifferentiator === "personal") {
    benefits.push({
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Personalized Approach",
      description: "Tailored strategy and execution for your exact goals.",
    });
  } else {
    benefits.push({
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      title: "Proven Results",
      description: "Outcome-focused work designed to move key metrics.",
    });
  }

  benefits.push({
    icon: <Target className="h-6 w-6 text-white" />,
    title: "Strategic Solutions",
    description: "Clear next steps, aligned with your main business goal.",
  });

  if (answers.trustFactor === "guarantee") {
    benefits.push({
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Risk-Free Guarantee",
      description: "If it’s not right, we fix it — your satisfaction matters.",
    });
  } else if (answers.trustFactor === "certifications") {
    benefits.push({
      icon: <Award className="h-6 w-6 text-white" />,
      title: "Certified Experts",
      description: "Professional standards and credentials you can trust.",
    });
  } else {
    benefits.push({
      icon: <Zap className="h-6 w-6 text-white" />,
      title: "Seamless Process",
      description: "Smooth workflows that keep you informed and confident.",
    });
  }

  return benefits;
}

function generateServiceOfferings(
  answers: QuestionnaireAnswers
): Array<{
  icon: JSX.Element;
  name: string;
  description: string;
  features: string[];
}> {
  const offerings: Record<
    string,
    Array<{ icon: JSX.Element; name: string; description: string; features: string[] }>
  > = {
    consulting: [
      {
        icon: <Target className="h-5 w-5" />,
        name: "Business Strategy",
        description: "Strategic planning to drive growth and efficiency",
        features: ["Market analysis", "Growth strategy", "Operational optimization", "KPIs & metrics"],
      },
      {
        icon: <TrendingUp className="h-5 w-5" />,
        name: "Process Improvement",
        description: "Streamline operations and maximize productivity",
        features: ["Workflow optimization", "Systems implementation", "Change management", "Ongoing monitoring"],
      },
    ],
    coaching: [
      {
        icon: <Users className="h-5 w-5" />,
        name: "One-on-One Coaching",
        description: "Personalized sessions tailored to your goals",
        features: ["Goal setting", "Accountability", "Action plans", "Email support"],
      },
      {
        icon: <Zap className="h-5 w-5" />,
        name: "Group Programs",
        description: "Collaborative learning with a structured system",
        features: ["Group sessions", "Networking", "Resources", "Community support"],
      },
    ],
    design: [
      {
        icon: <Sparkles className="h-5 w-5" />,
        name: "Brand Identity",
        description: "Create a memorable brand that stands out",
        features: ["Logo & guidelines", "Typography & colors", "Positioning", "Collateral design"],
      },
      {
        icon: <Target className="h-5 w-5" />,
        name: "Digital Design",
        description: "Modern, user-focused digital experiences",
        features: ["Web & app design", "UX optimization", "Responsive layouts", "Testing & iteration"],
      },
    ],
    development: [
      {
        icon: <Zap className="h-5 w-5" />,
        name: "Website Development",
        description: "High-performance websites built for growth",
        features: ["Mobile-first", "SEO structure", "CMS-ready", "Analytics"],
      },
      {
        icon: <Target className="h-5 w-5" />,
        name: "Web Applications",
        description: "Scalable software for complex needs",
        features: ["Custom features", "Database integration", "APIs", "Maintenance"],
      },
    ],
    marketing: [
      {
        icon: <TrendingUp className="h-5 w-5" />,
        name: "Digital Marketing",
        description: "Drive traffic and conversions with smart campaigns",
        features: ["SEO", "PPC", "Social media", "Email campaigns"],
      },
      {
        icon: <Target className="h-5 w-5" />,
        name: "Content Strategy",
        description: "Content that connects and converts",
        features: ["Content plan", "Copywriting", "Visual content", "Performance tracking"],
      },
    ],
    creative: [
      {
        icon: <Sparkles className="h-5 w-5" />,
        name: "Photography",
        description: "Professional photography for your brand",
        features: ["Product photos", "Portraits", "Events", "Retouching"],
      },
      {
        icon: <Zap className="h-5 w-5" />,
        name: "Video Production",
        description: "Compelling video that tells your story",
        features: ["Brand videos", "Social clips", "Corporate", "Editing"],
      },
    ],
    legal: [
      {
        icon: <Shield className="h-5 w-5" />,
        name: "Legal Consulting",
        description: "Expert guidance for business decisions",
        features: ["Contract review", "Compliance", "Risk assessment", "Ongoing support"],
      },
      {
        icon: <Award className="h-5 w-5" />,
        name: "Document Services",
        description: "Professional legal documentation",
        features: ["Agreements", "Terms", "Privacy policies", "Employment docs"],
      },
    ],
    accounting: [
      {
        icon: <TrendingUp className="h-5 w-5" />,
        name: "Bookkeeping",
        description: "Accurate records you can trust",
        features: ["Reconciliation", "Reporting", "Expense tracking", "Payroll"],
      },
      {
        icon: <Target className="h-5 w-5" />,
        name: "Tax Services",
        description: "Maximize deductions and stay compliant",
        features: ["Tax filing", "Tax planning", "Audit support", "Year-round advice"],
      },
    ],
  };

  return offerings[answers.serviceType] || offerings.consulting;
}

function generateStats(
  answers: QuestionnaireAnswers
): Array<{ icon: JSX.Element; value: string; label: string }> {
  const stats: Array<{ icon: JSX.Element; value: string; label: string }> = [];

  const years = answers.yearsExp || (answers.experienceLevel === "veteran" ? "10+" : answers.experienceLevel === "expert" ? "7+" : "3+");
  const clients = answers.clientsCount || "100+";
  const rating = answers.ratingValue || "5.0";

  stats.push({
    icon: <Award className="h-12 w-12 text-indigo-600" />,
    value: years,
    label: "Years of Experience",
  });

  stats.push({
    icon: <Users className="h-12 w-12 text-indigo-600" />,
    value: "100+",
    label: "Happy Clients",
  });

  if (answers.trustFactor === "results") {
    stats.push({
      icon: <TrendingUp className="h-12 w-12 text-indigo-600" />,
      value: "95%",
      label: "Client Success Rate",
    });
  } else {
    stats.push({
      icon: <Star className="h-12 w-12 text-indigo-600" />,
      value: "5.0",
      label: "Average Rating",
    });
  }

  return stats;
}

function generateGuarantee(
  answers: QuestionnaireAnswers
): { title: string; description: string } | null {
  if (answers.trustFactor !== "guarantee") return null;
  return {
    title: "Our Satisfaction Guarantee",
    description:
      "We stand behind our work. If you’re not completely happy, we’ll work with you until you are — or provide a full refund.",
  };
}

function generatePortfolioTitle(answers: QuestionnaireAnswers): string {
  if (answers.trustFactor === "portfolio") return "Our Recent Work";
  if (answers.trustFactor === "results") return "Client Success Stories";
  return "Featured Projects";
}

function generatePortfolioItems(
  answers: QuestionnaireAnswers
): Array<{ icon: JSX.Element; title: string; description: string; metric?: string }> {
  const items: Record<
    string,
    Array<{ icon: JSX.Element; title: string; description: string; metric?: string }>
  > = {
    consulting: [
      {
        icon: <TrendingUp className="h-16 w-16" />,
        title: "Manufacturing Optimization",
        description: "Streamlined operations for a mid-size manufacturer",
        metric: "35% efficiency increase",
      },
      {
        icon: <Target className="h-16 w-16" />,
        title: "Growth Strategy",
        description: "Strategic planning for tech startup expansion",
        metric: "3x revenue growth",
      },
      {
        icon: <Users className="h-16 w-16" />,
        title: "Change Management",
        description: "Successful organizational transformation",
        metric: "90% adoption rate",
      },
    ],
    coaching: [
      {
        icon: <Star className="h-16 w-16" />,
        title: "Executive Leadership",
        description: "Coached VP to C-level promotion",
        metric: "Promoted in 8 months",
      },
      {
        icon: <TrendingUp className="h-16 w-16" />,
        title: "Career Transition",
        description: "Guided professional to dream role",
        metric: "40% salary increase",
      },
      {
        icon: <Users className="h-16 w-16" />,
        title: "Team Performance",
        description: "Improved team dynamics and productivity",
        metric: "60% performance boost",
      },
    ],
    design: [
      {
        icon: <Sparkles className="h-16 w-16" />,
        title: "Brand Refresh",
        description: "Complete rebrand for a growing SaaS company",
        metric: "200% brand recognition",
      },
      {
        icon: <Target className="h-16 w-16" />,
        title: "E-commerce Design",
        description: "User-focused online store redesign",
        metric: "45% conversion increase",
      },
      {
        icon: <Zap className="h-16 w-16" />,
        title: "Mobile App UI",
        description: "Intuitive interface for a fintech app",
        metric: "4.8 star rating",
      },
    ],
    development: [
      {
        icon: <Zap className="h-16 w-16" />,
        title: "Custom Web Platform",
        description: "Built scalable SaaS platform",
        metric: "10k+ active users",
      },
      {
        icon: <Target className="h-16 w-16" />,
        title: "E-commerce Site",
        description: "High-performance online store",
        metric: "50% faster load time",
      },
      {
        icon: <TrendingUp className="h-16 w-16" />,
        title: "Business Application",
        description: "Custom CRM for enterprise client",
        metric: "70% time savings",
      },
    ],
    marketing: [
      {
        icon: <TrendingUp className="h-16 w-16" />,
        title: "SEO Campaign",
        description: "Ranked #1 for competitive keywords",
        metric: "300% organic traffic",
      },
      {
        icon: <Target className="h-16 w-16" />,
        title: "PPC Management",
        description: "Optimized ad spend for B2B client",
        metric: "5x ROAS",
      },
      {
        icon: <Users className="h-16 w-16" />,
        title: "Social Growth",
        description: "Built engaged community from scratch",
        metric: "50k followers in 6mo",
      },
    ],
    creative: [
      {
        icon: <Sparkles className="h-16 w-16" />,
        title: "Product Photography",
        description: "Stunning product shots for e-commerce brand",
        metric: "65% higher CTR",
      },
      {
        icon: <Star className="h-16 w-16" />,
        title: "Brand Video",
        description: "Compelling brand story video",
        metric: "1M+ views",
      },
      {
        icon: <Target className="h-16 w-16" />,
        title: "Corporate Event",
        description: "Full coverage of annual conference",
        metric: "500+ edited photos",
      },
    ],
    legal: [
      {
        icon: <Shield className="h-16 w-16" />,
        title: "Contract Negotiation",
        description: "Protected client interests in major deal",
        metric: "$2M in value secured",
      },
      {
        icon: <Award className="h-16 w-16" />,
        title: "Compliance Audit",
        description: "Ensured full regulatory compliance",
        metric: "Zero violations",
      },
      {
        icon: <CheckCircle className="h-16 w-16" />,
        title: "Dispute Resolution",
        description: "Successfully resolved business conflict",
        metric: "Settled in 30 days",
      },
    ],
    accounting: [
      {
        icon: <TrendingUp className="h-16 w-16" />,
        title: "Tax Strategy",
        description: "Optimized tax position for growing business",
        metric: "$50k in savings",
      },
      {
        icon: <Target className="h-16 w-16" />,
        title: "Financial Cleanup",
        description: "Organized years of backlogged records",
        metric: "Audit-ready in 2 weeks",
      },
      {
        icon: <CheckCircle className="h-16 w-16" />,
        title: "CFO Services",
        description: "Part-time CFO for startup",
        metric: "Secured $2M funding",
      },
    ],
  };

  return items[answers.serviceType] || items.consulting;
}

function generateCTAHeadline(answers: QuestionnaireAnswers): string {
  switch (answers.primaryGoal) {
    case "leads":
      return "Ready to Get Started?";
    case "calls":
      return "Let’s Talk About Your Goals";
    case "packages":
      return "Choose Your Perfect Package";
    case "credibility":
      return "Join Our Growing Client Base";
    default:
      return "Start Your Journey Today";
  }
}

function generateCTASubheadline(answers: QuestionnaireAnswers): string {
  if (answers.keyDifferentiator === "speed")
    return "Get results fast — book your consultation and move forward today.";
  if (answers.keyDifferentiator === "quality")
    return "Experience premium quality — let’s align on what success looks like.";
  if (answers.keyDifferentiator === "expertise")
    return "Tap into specialized expertise — schedule your consultation.";
  if (answers.keyDifferentiator === "personal")
    return "Get personalized attention — every step tailored to your goals.";
  return "Join successful clients who trust us to deliver outcomes.";
}

function generateCTASubtext(answers: QuestionnaireAnswers): string {
  if (answers.primaryGoal === "calls")
    return "No obligation • Quick response • Clear next steps";
  if (answers.pricingApproach === "custom")
    return "Free quote • Transparent pricing • No hidden fees";
  return "Quick setup • Fast delivery • Get started today";
}
