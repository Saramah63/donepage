import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";
import StartClient from "./start-client";

export const metadata = {
  title: "Start | Donepage",
  description: "Start your Donepage brief.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Plan = "launch" | "growth" | "hosting" | "";

export default async function StartPage({
  searchParams,
}: {
  searchParams?: Promise<{ plan?: string; open?: string }> | { plan?: string; open?: string };
}) {
  const sp = (await Promise.resolve(searchParams)) ?? {};
  const plan = (sp?.plan || "").toLowerCase() as Plan;
  const openQuestionnaire = (sp?.open || "") === "1";

  if (openQuestionnaire) {
    return (
      <Suspense
        fallback={
          <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">Loading...</main>
        }
      >
        <StartClient />
      </Suspense>
    );
  }

  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/75">
          <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Donepage</Link>
          <ThemeToggle />
        </div>
        <Card className="border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
          <CardContent className="p-8">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Start Questionnaire
            </h1>
            <p className="mt-3 text-gray-700 dark:text-gray-200">
              {plan
                ? `Plan selected: ${plan.charAt(0).toUpperCase()}${plan.slice(1)}.`
                : "Choose your plan and start the brief to generate your landing page."}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Step 1</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Questionnaire</div>
                <p className="mt-2 text-sm">Answer a few focused questions.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Step 2</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Instant AI Draft</div>
                <p className="mt-2 text-sm">Get a draft immediately after submit.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Step 3</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Human polish</div>
                <p className="mt-2 text-sm">Launch: 5 business days. Growth: 2 business days.</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white/80 p-4 text-sm text-gray-700 dark:border-gray-700 dark:bg-slate-900/70 dark:text-gray-200">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Step 4</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Revisions + Publish</div>
                <p className="mt-2 text-sm">Request revisions and approve publish.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-11 bg-blue-600 !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
                <a href={`/start?open=1&plan=${encodeURIComponent(plan || "launch")}`}>Start Questionnaire</a>
              </Button>
              <Button asChild variant="outline" className="h-11">
                <Link href="/pricing">Back to Pricing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
