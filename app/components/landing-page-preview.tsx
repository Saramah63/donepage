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
  CreditCard,
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

              <Button size="sm" onClick={() => setPricingModalOpen(true)}>
                <CreditCard className="mr-2 h-4 w-4" /> Pricing
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={mode === "preview" ? "pt-16" : ""}>
        {/* HERO */}
        <section className="px-4 py-24 text-center bg-gradient-to-br from-gray-50 to-cyan-50">
          <h1 className="text-5xl font-bold">{hero.headline}</h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
            {hero.subheadline}
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg">
              {hero.primaryCTA}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* ABOUT */}
        {answers.includeAbout === "yes" && content.about && (
          <section className="px-4 py-24 bg-white">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-4xl font-bold">{content.about.title}</h2>
              <p className="mt-6 text-lg text-gray-600">
                {answers.aboutText?.trim() || content.about.story}
              </p>
              {answers.aboutImageUrl?.trim() ? (
                <div className="mt-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={answers.aboutImageUrl.trim()}
                    alt={`${content.about.title} image`}
                    className="mx-auto h-auto max-h-[420px] w-full max-w-2xl rounded-2xl object-cover shadow-sm"
                    loading="lazy"
                  />
                </div>
              ) : null}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section className="px-4 py-24 bg-gray-50">
          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
            {/* BOOKING */}
            <ContactCard
              icon={<Calendar />}
              title="Book a Call"
              href={bookingHref}
              label="Schedule"
            />

            {/* EMAIL */}
            <ContactCard
              icon={<Mail />}
              title="Email"
              href={emailHref}
              label="Send Email"
            />

            {/* WHATSAPP */}
            <ContactCard
              icon={<MessageSquare />}
              title="WhatsApp"
              href={waHref}
              label="Chat"
            />
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
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  label: string;
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
          <Button disabled className="mt-4 w-full opacity-60">
            Not set
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
