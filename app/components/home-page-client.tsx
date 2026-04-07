"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { PublicSiteHeader } from "@/app/components/public-site-header";
import { SiteFooter } from "@/app/components/site-footer";

const pricingCards = [
  {
    name: "Launch",
    price: "€99",
    label: "For validating your offer",
    features: [
      "AI draft (instant)",
      "Human polish (1 revision)",
      "Delivered within 72 hours",
    ],
    cta: "Start Launch — €99",
    href: process.env.NEXT_PUBLIC_STRIPE_LINK_LAUNCH || "/pricing",
    plan: "launch" as const,
    featured: false,
  },
  {
    name: "Growth",
    price: "€249",
    label: "For getting real clients",
    features: [
      "AI draft (instant)",
      "Priority polish (3 revisions)",
      "Delivered within 48 hours",
      "Domain connection",
      "Basic SEO",
    ],
    cta: "Upgrade to Growth — €249",
    href: process.env.NEXT_PUBLIC_STRIPE_LINK_GROWTH || "/pricing",
    plan: "growth" as const,
    featured: true,
  },
  {
    name: "Hosting",
    price: "€19/mo",
    label: "",
    features: [
      "Hosting (Vercel)",
      "SSL & uptime",
      "Minor updates",
      "Email support",
    ],
    cta: "Add Hosting — €19/mo",
    href: process.env.NEXT_PUBLIC_STRIPE_LINK_HOSTING || "/hosting",
    plan: "hosting" as const,
    featured: false,
  },
];

const failurePoints = [
  "Unclear positioning — people don’t understand your value",
  "Weak offer — no reason to take action",
  "Overcomplicated structure — visitors drop off",
];

const steps = [
  {
    title: "Structured intake",
    text: "We extract your offer, audience, and positioning.",
  },
  {
    title: "AI draft + expert refinement",
    text: "We generate and refine a conversion-focused page.",
  },
  {
    title: "Launch-ready page",
    text: "Fast, clean, and designed to capture leads.",
  },
];

const testimonial = {
  eyebrow: "Trusted by real businesses",
  quote:
    "We’re extremely happy with the website delivered by Donepage. The result exceeded our expectations and truly reflects our company’s identity.",
  body:
    "The bilingual Finnish and English setup is a major advantage — making the site accessible and user-friendly.",
  closing:
    "Highly recommended for their quality, reliability, and excellent service.",
  author: "Project Manager, Nordmaster Group",
};

function firePurchaseIntent(plan: "launch" | "growth" | "hosting") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("dp_purchase_intent", { detail: { plan } }));
}

export default function HomePageClient() {
  return (
    <div
      id="top"
      className="min-h-screen bg-[#0A0A0A] text-white"
      style={{ fontFamily: '"Avenir Next", "Avenir", "Segoe UI", sans-serif' }}
    >
      <PublicSiteHeader />

      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <section className="reveal-up relative overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] px-6 py-18 text-center shadow-[0_24px_120px_rgba(0,0,0,0.45)] sm:px-10 md:px-16 md:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,189,106,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(18,122,102,0.14),transparent_28%)]" />
          <div className="relative mx-auto max-w-4xl">
            <h1
              className="text-5xl leading-[1.02] tracking-tight text-white sm:text-6xl md:text-7xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              <span className="luxury-gradient-text">
                Get a landing page that actually brings you clients
              </span>
              <span> — in 72 hours.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#CFCFCF] sm:text-xl">
              No templates. No guesswork.
              <br className="hidden sm:block" />
              Just a clear, high-converting page built around your offer.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-full bg-[#127A66] px-8 text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.28)] transition duration-300 hover:scale-[1.02] hover:bg-[#15907A] hover:opacity-100"
              >
                <Link href="/start" target="_blank" rel="noopener noreferrer">
                  Start My Page
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-full border-white/12 bg-transparent px-8 text-base text-white transition duration-300 hover:scale-[1.02] hover:bg-white/[0.05] hover:opacity-100"
              >
                <a href="#pricing">See Pricing</a>
              </Button>
            </div>
          </div>
        </section>

        <section className="reveal-up py-16 text-center">
          <p className="mx-auto max-w-3xl text-sm leading-7 tracking-[0.02em] text-[#CFCFCF] sm:text-base">
            Built for coaches, consultants, and service businesses who want results — not just design.
          </p>
        </section>

        <section id="why" className="reveal-up scroll-mt-28 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFA76A]">
              Why it fails
            </p>
            <h2
              className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Why most landing pages don&apos;t convert
            </h2>
          </div>

          <div className="stagger-reveal mt-10 grid gap-4 md:grid-cols-3">
            {failurePoints.map((item) => (
              <div
                key={item}
                className="rounded-[26px] border border-white/8 bg-white/[0.03] px-6 py-7 transition duration-300 hover:scale-[1.01] hover:bg-white/[0.05]"
              >
                <p className="text-lg leading-8 text-[#F5F5F5]">• {item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how" className="reveal-up scroll-mt-28 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="text-4xl tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              How it works
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#CFCFCF]">
              A clean system from brief to launch
            </p>
          </div>

          <div className="stagger-reveal mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[26px] border border-white/8 bg-white/[0.03] px-7 py-8 transition duration-300 hover:scale-[1.01] hover:bg-white/[0.05]"
              >
                <div className="text-sm uppercase tracking-[0.22em] text-[#BFA76A]">
                  0{index + 1}
                </div>
                <h3
                  className="mt-5 text-2xl leading-tight text-white"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
                >
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#CFCFCF]">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal-up py-10 sm:py-12">
          <div className="mx-auto max-w-[700px] rounded-[30px] border border-white/8 bg-[#111111] px-8 py-11 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFA76A]">
              {testimonial.eyebrow}
            </p>
            <blockquote className="mt-5 text-lg italic leading-8 text-[#F3F3F3] sm:text-xl">
              “{testimonial.quote}”
            </blockquote>
            <p className="mt-4 text-base italic leading-7 text-[#CFCFCF]">
              {testimonial.body}
            </p>
            <p className="mt-4 text-base italic leading-7 text-[#E6E6E6]">
              {testimonial.closing}
            </p>
            <p className="mt-6 text-sm font-semibold tracking-[0.04em] text-white">
              — {testimonial.author}
            </p>
          </div>
        </section>

        <section id="pricing" className="reveal-up scroll-mt-28 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFA76A]">
              Pricing
            </p>
            <h2
              className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Premium delivery without agency drag
            </h2>
          </div>

          <div className="stagger-reveal mt-10 grid gap-5 lg:grid-cols-3">
            {pricingCards.map((card) => (
              <div
                key={card.name}
                className={`relative rounded-[28px] border px-7 py-8 transition duration-300 hover:scale-[1.015] ${
                  card.featured
                    ? "border-[#BFA76A]/35 bg-[linear-gradient(180deg,rgba(191,167,106,0.13),rgba(255,255,255,0.04))] shadow-[0_24px_60px_rgba(191,167,106,0.08)]"
                    : "border-white/8 bg-white/[0.03]"
                }`}
              >
                <div className="flex min-h-[30px] items-start justify-end gap-3">
                  {card.featured ? (
                    <div className="shrink-0 rounded-full border border-[#BFA76A]/30 bg-[#BFA76A]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E9D7A3]">
                      Most Popular
                    </div>
                  ) : null}
                </div>
                <h3
                  className="mt-5 text-3xl text-white"
                  style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
                >
                  {card.name} — {card.price}
                </h3>
                {card.label ? <p className="mt-3 text-base leading-7 text-[#CFCFCF]">{card.label}</p> : null}

                <ul className="mt-7 space-y-3">
                  {card.features.map((feature) => (
                    <li key={feature} className="text-sm leading-7 text-[#D9D9D9]">
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="mt-8 h-12 w-full rounded-full bg-[#127A66] text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.24)] transition duration-300 hover:scale-[1.02] hover:bg-[#15907A]"
                >
                  <a href={card.href} onClick={() => firePurchaseIntent(card.plan)}>
                    {card.cta}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal-up py-20">
          <div className="rounded-[30px] border border-white/8 bg-white/[0.03] px-8 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#BFA76A]">
              Custom projects
            </p>
            <h2
              className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Need something more advanced?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
              We build multi-page websites, custom systems, and tailored setups for businesses that need more than a single landing page.
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-8 h-12 rounded-full border-white/12 bg-transparent px-8 text-base text-white transition duration-300 hover:scale-[1.02] hover:bg-white/[0.05]"
            >
              <Link href="/custom-projects">Request Custom Proposal</Link>
            </Button>
          </div>
        </section>

        <section className="reveal-up pb-12 pt-20">
          <div className="rounded-[32px] border border-[#BFA76A]/18 bg-[linear-gradient(180deg,rgba(191,167,106,0.08),rgba(255,255,255,0.025))] px-8 py-14 text-center shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
            <h2
              className="text-4xl tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Stop overthinking your website.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
              Get a page that actually works — and start getting clients.
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-full bg-[#127A66] px-8 text-base font-semibold text-white shadow-[0_0_28px_rgba(18,122,102,0.24)] transition duration-300 hover:scale-[1.02] hover:bg-[#15907A]"
            >
              <Link href="/start" target="_blank" rel="noopener noreferrer">
                Start My Page
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
