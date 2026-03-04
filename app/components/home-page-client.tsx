"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { ThemeToggle } from "@/app/components/theme-toggle";

const packages = [
  {
    name: "Launch",
    price: "€99",
    features: ["1 landing page", "1 revision", "Delivered in 5 business days"],
    cta: "Start Launch",
    href: "/api/checkout?plan=launch",
    popular: false,
  },
  {
    name: "Growth",
    price: "€249",
    features: ["1 landing page", "3 revisions", "Domain connection", "Basic SEO", "Priority delivery"],
    cta: "Start Growth",
    href: "/api/checkout?plan=growth",
    popular: true,
  },
  {
    name: "Hosting & Support",
    price: "€19/month",
    features: ["Hosting on Vercel", "SSL & uptime", "Minor updates", "Email support"],
    cta: "Request Hosting",
    href: "/contact?reason=hosting",
    popular: false,
  },
];

const faq = [
  {
    q: "Do I need hosting?",
    a: "Only if you want us to run and maintain your site for you. You can also host it yourself.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. Domain connection is included in Growth, and available as an add-on for other setups.",
  },
  { q: "How long does it take?", a: "Launch is delivered in 5 business days. Growth is prioritized for faster turnaround." },
  {
    q: "What’s included in revisions?",
    a: "Revisions include copy, section layout adjustments, and CTA refinements based on your brief.",
  },
  {
    q: "Can I request changes later?",
    a: "Yes. You can request updates any time, and ongoing requests are easiest with hosting support.",
  },
  {
    q: "What if I need more pages?",
    a: "Use the custom proposal route for multi-page work, integrations, or broader custom builds.",
  },
];

export default function HomePageClient() {
  return (
    <div id="top" className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 text-gray-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-gray-100">
      <div className="mesh-hero" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="noise-film" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-slate-900/85">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <header className="flex h-16 items-center justify-between">
            <a href="#top" className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Donepage
            </a>
            <nav className="flex items-center gap-2 sm:gap-3">
              <a
                href="#how"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-slate-800"
              >
                How it works
              </a>
              <a
                href="#pricing"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-slate-800"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-slate-800"
              >
                Contact
              </a>
              <ThemeToggle className="ml-1" />
            </nav>
          </header>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
        <section className="reveal-up mt-4 rounded-3xl border border-gray-200 bg-white/90 px-6 py-10 shadow-xl shadow-blue-900/5 backdrop-blur sm:mt-6 sm:px-10 sm:py-14 dark:border-gray-700 dark:bg-slate-900/85">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="luxury-gradient-text">Launch your landing page in days — not weeks.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-700 dark:text-gray-200">
            Answer a few questions. Get a conversion-ready page. No templates. No complexity.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-12 bg-blue-600 px-7 text-base !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
              <Link href="/start" target="_blank" rel="noopener noreferrer" className="font-medium !text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-gray-300 bg-white/90 px-7 text-base !text-slate-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-900 dark:!text-white dark:hover:bg-slate-800">
              <a href="#pricing">See Pricing</a>
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Why landing pages fail</h2>
          <ul className="mt-5 space-y-3 text-gray-800 dark:text-gray-100">
            {["No clear message", "No structured offer", "No fast execution"].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white/90 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/85"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-cyan-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="how" className="mt-16 scroll-mt-32">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Answer simple questions", "We structure & build your page", "You launch and collect leads"].map((step, index) => (
              <Card key={step} className="card-lift reveal-up border-gray-200 bg-white/90 dark:border-gray-700 dark:bg-slate-900/85">
                <CardContent className="p-5">
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-blue-500">
                    {index + 1}
                  </div>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-16 scroll-mt-32">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Pricing</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={[
                  "card-lift reveal-up relative border-gray-200 bg-white/95 dark:border-gray-700 dark:bg-slate-900/90",
                  pkg.popular ? "border-blue-600 shadow-md shadow-blue-900/10 dark:border-cyan-400" : "",
                ].join(" ")}
              >
                <CardContent className="p-6">
                  {pkg.popular ? (
                    <span className="absolute right-6 top-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white dark:bg-cyan-500 dark:text-slate-950">
                      Most popular
                    </span>
                  ) : null}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{pkg.name}</h3>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">{pkg.price}</p>
                  <ul className="mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-cyan-300" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6 h-11 w-full bg-blue-600 text-base !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
                    <Link href={pkg.href} target="_blank" rel="noopener noreferrer" className="font-medium !text-white">{pkg.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-gray-200 bg-white/90 p-6 sm:p-8 dark:border-gray-700 dark:bg-slate-900/85">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Custom Projects</h2>
          <p className="mt-3 max-w-2xl text-gray-700 dark:text-gray-200">
            Need something more advanced? Multi-page sites, integrations, or custom builds.
          </p>
          <Button asChild className="mt-6 h-11 bg-blue-600 px-6 text-base !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
            <Link href="/contact?reason=custom" className="font-medium !text-white">Request a Custom Proposal</Link>
          </Button>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">FAQ</h2>
          <div className="mt-6 grid gap-4">
            {faq.map((item) => (
              <Card key={item.q} className="card-lift reveal-up border-gray-200 bg-white/90 dark:border-gray-700 dark:bg-slate-900/85">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{item.q}</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{item.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact" className="mt-16 scroll-mt-32 rounded-2xl border border-gray-200 bg-white/90 p-6 sm:p-8 dark:border-gray-700 dark:bg-slate-900/85">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Contact</h2>
          <p className="mt-3 max-w-2xl text-gray-700 dark:text-gray-200">
            Need help choosing a package or have a specific question? Start here and continue to the full form only if needed.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 bg-blue-600 px-6 text-base !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
              <Link href="/contact" className="font-medium !text-white">Open Contact Form</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 border-gray-300 bg-white/90 px-6 text-base !text-slate-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-slate-900 dark:!text-white dark:hover:bg-slate-800">
              <Link href="mailto:hello@donepage.co" className="font-medium !text-slate-900 dark:!text-white">Email hello@donepage.co</Link>
            </Button>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-blue-700 bg-blue-700 p-8 text-white shadow-xl shadow-blue-900/20 dark:border-cyan-500 dark:bg-cyan-500 dark:text-slate-950">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to launch?</h2>
          <Button asChild variant="outline" className="mt-5 h-12 border-white bg-white px-7 text-base !text-slate-900 hover:bg-slate-100 dark:border-slate-200 dark:bg-slate-950 dark:!text-white dark:hover:bg-slate-900">
            <Link href="/start" target="_blank" rel="noopener noreferrer" className="font-medium !text-slate-900 dark:!text-white">Get Started</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
