"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";

type Plan = "launch" | "growth" | "hosting";

function firePurchaseIntent(plan: Plan) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dp_purchase_intent", { detail: { plan } }));
}

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = React.useState<Plan | null>(null);

  const startCheckout = async (plan: Plan) => {
    try {
      setLoadingPlan(plan);
      firePurchaseIntent(plan);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      if (!data?.url) throw new Error("Missing checkout URL");
      window.location.href = data.url;
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed");
      setLoadingPlan(null);
    }
  };

  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/75">
          <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Donepage</Link>
          <ThemeToggle />
        </div>
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Pricing
          </h1>
          <p className="mt-3 text-gray-700 dark:text-gray-200">
            Choose a package to launch quickly with Donepage.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-lift border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Launch
                </h2>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">€99</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li>1 landing page</li>
                <li>1 revision</li>
                <li>Delivered in 5 business days</li>
              </ul>
              <Button
                className="mt-6 h-11 w-full bg-blue-600 !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                onClick={() => startCheckout("launch")}
                disabled={loadingPlan === "launch"}
              >
                {loadingPlan === "launch" ? "Redirecting..." : "Start Launch"}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-lift border-blue-200 bg-white/95 shadow-xl shadow-blue-500/10 dark:border-blue-700 dark:bg-slate-900/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Growth
                </h2>
                <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-gray-100">€249</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li>1 landing page</li>
                <li>3 revisions</li>
                <li>Domain connection</li>
                <li>Basic SEO</li>
                <li>Priority delivery</li>
              </ul>
              <Button
                className="mt-6 h-11 w-full bg-blue-600 !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                onClick={() => startCheckout("growth")}
                disabled={loadingPlan === "growth"}
              >
                {loadingPlan === "growth" ? "Redirecting..." : "Start Growth"}
              </Button>
            </CardContent>
          </Card>

          <Card className="card-lift border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Hosting &amp; Support
                </h2>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">€19/mo</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li>Hosting on Vercel</li>
                <li>SSL &amp; uptime</li>
                <li>Minor updates</li>
                <li>Email support</li>
              </ul>
              <Button
                variant="outline"
                className="mt-6 h-11 w-full"
                onClick={() => startCheckout("hosting")}
                disabled={loadingPlan === "hosting"}
              >
                {loadingPlan === "hosting" ? "Redirecting..." : "Request Hosting"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 text-center text-sm text-gray-600 dark:text-gray-300">
          Need something custom? <Link href="/contact?reason=custom" className="font-semibold underline">Request a proposal</Link>.
        </div>
      </div>
    </main>
  );
}
