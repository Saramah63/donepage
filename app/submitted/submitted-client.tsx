"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

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

  const previewUrl = projectId && token ? `/preview/${projectId}?token=${encodeURIComponent(token)}` : "";
  const portalUrl = token ? `/portal?token=${encodeURIComponent(token)}` : "/portal";

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!projectId) return;
    window.dispatchEvent(
      new CustomEvent("dp_questionnaire_submitted", { detail: { plan, projectId } })
    );
  }, [plan, projectId]);

  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Card className="border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
          <CardContent className="p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Instant AI Draft is ready
            </h1>
            <p className="mt-3 text-gray-700 dark:text-gray-200">
              Your answers created an instant draft. Your human‑polished version is scheduled next.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Track 1</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Instant AI Draft</div>
                <p className="mt-2 text-sm">Completed now.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Track 2</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Human polish</div>
                <p className="mt-2 text-sm">
                  Expected by {formatDate(eta) || "soon"} ({plan === "growth" ? "2" : "5"} business days).
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {previewUrl ? (
                <Button asChild className="h-11 bg-blue-600 !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
                  <Link href={previewUrl}>Open Instant Draft</Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" className="h-11">
                <Link href={portalUrl}>Go to my portal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
