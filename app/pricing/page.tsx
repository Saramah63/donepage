"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { PublicSiteHeader } from "@/app/components/public-site-header";

type Plan = "launch" | "growth" | "hosting";

const packages: Array<{
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  href: string;
  plan: Plan;
  popular?: boolean;
}> = [
  {
    name: "Launch",
    price: "EUR99",
    subtitle: "For validating your offer",
    features: ["AI draft (instant)", "Human polish (1 revision)", "Delivery within 72 hours"],
    cta: "Start Launch — €99",
    href: process.env.NEXT_PUBLIC_STRIPE_LINK_LAUNCH || "/start?plan=launch",
    plan: "launch",
  },
  {
    name: "Growth",
    price: "EUR249",
    subtitle: "For serious client acquisition",
    features: [
      "AI draft (instant)",
      "Priority polish (3 revisions)",
      "Delivery within 48 hours",
      "Domain connection",
      "Basic SEO",
    ],
    cta: "Upgrade to Growth — €249",
    href: process.env.NEXT_PUBLIC_STRIPE_LINK_GROWTH || "/start?plan=growth",
    plan: "growth",
    popular: true,
  },
  {
    name: "Hosting & Support",
    price: "EUR19/month",
    subtitle: "Post-launch support",
    features: ["Hosting (Vercel)", "SSL & uptime", "Minor updates", "Email support"],
    cta: "Add Hosting — €19/mo",
    href: process.env.NEXT_PUBLIC_STRIPE_LINK_HOSTING || "/hosting",
    plan: "hosting",
  },
];

function firePurchaseIntent(plan: Plan) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dp_purchase_intent", { detail: { plan } }));
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--bg))] px-4 py-12 text-[rgb(var(--text))] sm:px-6 sm:py-16">
      <PublicSiteHeader />
      <div className="mx-auto max-w-[1100px]">
        <div className="h-12 sm:h-16" />

        <div className="mx-auto max-w-3xl text-center">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-[#c7b276]">
            Pricing
          </p>
          <h1 className="mt-4 font-display text-5xl tracking-tight text-white">Simple plans. Clear outcomes.</h1>
          <p className="mt-5 font-body text-lg leading-8 text-[rgb(var(--muted))]">
            Pick the speed and support level that matches how seriously you want to acquire clients.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={`relative border ${
                pkg.popular ? "border-[#c7b276]/35 bg-[linear-gradient(180deg,rgba(216,194,122,0.12),rgba(255,255,255,0.04))]" : "border-white/8 bg-white/[0.03]"
              } shadow-none`}
            >
              <CardContent className="p-7">
                <div className="flex min-h-[30px] items-start justify-between gap-3">
                  <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c7b276]">
                    {pkg.subtitle}
                  </p>
                  {pkg.popular ? (
                    <span className="shrink-0 rounded-full border border-[#c7b276]/35 bg-[#c7b276]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f4e5af]">
                      Most Popular
                    </span>
                  ) : null}
                </div>
                <h2 className="font-display text-3xl text-white">{pkg.name}</h2>
                <p className="mt-3 font-body text-2xl font-semibold text-white">{pkg.price}</p>

                <ul className="mt-6 space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 font-body text-sm leading-6 text-[#e7e7e7]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[#3ab79e]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-8 h-12 w-full rounded-full bg-[rgb(var(--accent))] text-base font-semibold text-white transition duration-300 hover:bg-[#159077]"
                >
                  <a href={pkg.href} onClick={() => firePurchaseIntent(pkg.plan)}>
                    {pkg.cta}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center font-body text-sm text-[rgb(var(--muted))]">
          Need more than one page?{" "}
          <Link href="/custom-projects" className="text-white underline underline-offset-4">
            Request Custom Proposal
          </Link>
        </div>
      </div>
    </main>
  );
}
