"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import type { DraftContent } from "@/app/lib/draft-content";
import { DraftPreviewSurface } from "@/app/components/draft-preview-surface";

type ProjectResponse = {
  project?: {
    id: string;
    draftContent?: DraftContent | null;
  } | null;
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-").map((v) => Number(v));
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Helsinki",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function SubmittedClient() {
  const params = useSearchParams();
  const plan = (params.get("plan") || "launch").toLowerCase();
  const projectId = (params.get("projectId") || "").trim();
  const token = (params.get("token") || "").trim();
  const eta = (params.get("eta") || "").trim();
  const launchLink =
    projectId && token
      ? `/api/checkout?plan=launch&projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token)}`
      : process.env.NEXT_PUBLIC_STRIPE_LINK_LAUNCH || "/#pricing";
  const growthLink =
    projectId && token
      ? `/api/checkout?plan=growth&projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token)}`
      : process.env.NEXT_PUBLIC_STRIPE_LINK_GROWTH || "/#pricing";

  const [draft, setDraft] = React.useState<DraftContent | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  const fullDraftUrl =
    projectId && token ? `/draft/${projectId}?token=${encodeURIComponent(token)}` : "";

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || !projectId) return;
    window.dispatchEvent(
      new CustomEvent("dp_questionnaire_submitted", { detail: { plan, projectId } })
    );
  }, [plan, projectId]);

  React.useEffect(() => {
    if (!projectId || !token) return;
    let cancelled = false;

    async function saveLead() {
      try {
        await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, token }),
        });
      } catch {
        if (!cancelled) {
          // Silent fail: lead capture should not block the result page.
        }
      }
    }

    saveLead();
    return () => {
      cancelled = true;
    };
  }, [projectId, token]);

  React.useEffect(() => {
    if (!token || !projectId) return;
    let cancelled = false;

    async function loadProject() {
      try {
        const res = await fetch(
          `/api/project?projectId=${encodeURIComponent(projectId)}&token=${encodeURIComponent(token)}`,
          { cache: "no-store" }
        );
        const data = (await res.json().catch(() => null)) as ProjectResponse | null;
        if (!res.ok || cancelled) return;
        setDraft(data?.project?.draftContent || null);
      } catch {
        if (!cancelled) setDraft(null);
      }
    }

    loadProject();
    return () => {
      cancelled = true;
    };
  }, [projectId, token]);

  function revealClass(base: string) {
    return `${base} ${hydrated ? "is-visible" : ""}`.trim();
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-[1180px]">
        <div className={revealClass("reveal-up mx-auto max-w-3xl text-center")}>
          <h1
            className="text-4xl tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Your page is ready
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
            This is a first version based on your input - already structured to convert.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            <div
              className={revealClass(
                "reveal-up overflow-hidden rounded-[34px] border border-white/8 bg-[#111111] shadow-[0_24px_90px_rgba(0,0,0,0.36)]"
              )}
              style={{ animationDelay: "60ms" }}
            >
              <DraftPreviewSurface draft={draft} />
            </div>
          </section>

          <aside
            className={revealClass("reveal-up lg:pt-2")}
            style={{ animationDelay: "140ms" }}
          >
            <div className="lg:sticky lg:top-24 lg:transition-transform lg:duration-300 lg:hover:-translate-y-1">
              <div className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-7 shadow-[0_24px_90px_rgba(0,0,0,0.36)]">
                <h2
                  className="text-3xl tracking-tight text-white"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
                >
                  This is your page - almost ready.
                </h2>

                <p className="mt-5 text-base leading-8 text-[#CFCFCF]">
                  Right now, it&apos;s a strong draft.
                </p>
                <p className="mt-3 text-base leading-8 text-[#CFCFCF]">
                  With expert refinement, it becomes a page that actually gets clients.
                </p>

                <div className="mt-6 space-y-3 text-sm leading-7 text-[#E1E1E1]">
                  <p>• Your message becomes clear and compelling</p>
                  <p>• Your offer feels stronger and more valuable</p>
                  <p>• Your page is structured to convert - not just look good</p>
                </div>

                <div className="mt-7 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm leading-7 text-[#DCDCDC]">
                    A high-converting landing page normally costs hundreds or thousands.
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#DCDCDC]">
                    This is a faster, focused version - without the complexity.
                  </p>
                </div>

                <div className="mt-8">
                  <p className="text-sm font-medium leading-7 text-white">Choose how you want to launch:</p>
                </div>

                <div className="mt-4 flex flex-col gap-4">
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-4">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 w-full rounded-full border-white/12 bg-transparent text-base text-white hover:bg-white/[0.05]"
                    >
                      <a href={launchLink}>Get My Page — €99</a>
                    </Button>
                    <p className="mt-3 text-center text-sm leading-7 text-[#CFCFCF]">
                      Best for validating your offer
                    </p>
                    <p className="text-center text-xs leading-6 text-white/55">
                      You&apos;re already close - this completes it.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#BFA76A]/22 bg-[#BFA76A]/8 p-4">
                    <p className="text-center text-sm font-medium leading-7 text-[#F1E7C8]">
                      Most people choose Growth to get results faster.
                    </p>
                    <Button
                      asChild
                      className="mt-3 h-12 w-full rounded-full bg-[#127A66] text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.24)] hover:bg-[#15907A]"
                    >
                      <a href={growthLink}>Get My Page Faster — €249</a>
                    </Button>
                    <p className="mt-3 text-center text-sm leading-7 text-[#F1E7C8]">
                      Best for getting real clients faster
                    </p>
                    <p className="text-center text-xs leading-6 text-[#F1E7C8]/80">
                      No risk. You&apos;ll get a clear, usable page.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E9D7A3]">
                    Why Growth works better
                  </div>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#DCDCDC]">
                    <p>• Faster delivery (48h)</p>
                    <p>• More refinement</p>
                    <p>• Better clarity - better results</p>
                    <p>• Domain + SEO included</p>
                  </div>
                </div>

                <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm leading-7 text-[#DCDCDC]">
                    Delivered in 72 hours. No templates. Human refinement included.
                  </p>
                </div>

                <div className="mt-4 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm leading-7 text-[#DCDCDC]">
                    We only take a limited number of pages per week to keep quality high.
                  </p>
                </div>

                <div className="mt-4 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm leading-7 text-[#DCDCDC]">
                    Most people stop at this stage.
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[#DCDCDC]">
                    That&apos;s why their page never performs.
                  </p>
                </div>

                <div className="mt-4 rounded-[24px] border border-white/8 bg-white/[0.02] p-5">
                  <p className="text-sm leading-7 text-[#DCDCDC]">
                    This is a draft. The final version is built for real clients.
                  </p>
                </div>

                <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.02] p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#BFA76A]">
                    Delivery window
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#D7D7D7]">
                    Expected by {formatDate(eta) || "soon"} ({plan === "growth" ? "48 hours" : "72 hours"}).
                  </p>
                </div>

                {fullDraftUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 h-11 w-full rounded-full border-white/12 bg-transparent text-white hover:bg-white/[0.05]"
                  >
                    <Link href={fullDraftUrl}>Preview My Page</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
