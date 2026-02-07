import { Sparkles, CheckCircle, ArrowRight, Zap, Globe, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ChatWidget } from "@/app/components/chat-widget";

export const metadata = {
  title: "Donepage — Your landing page, done",
  description:
    "Answer a few questions and Donepage builds a polished, SEO-ready landing page you can publish instantly.",
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40">
      <div className="mesh-hero" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="noise-film" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(180deg,rgba(255,255,255,0.85),rgba(255,255,255,0.45),rgba(255,255,255,0.85))]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col px-4 pb-24 pt-16 sm:pt-24">
        {/* Top pill */}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 shadow-sm backdrop-blur-md">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </span>
          <div className="text-sm font-semibold text-gray-900">Donepage</div>
          <span className="text-xs text-gray-500">Landing page generator</span>
        </div>

        {/* Hero */}
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <div className="mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border border-blue-200/60 bg-white/70 px-5 py-3 shadow-sm backdrop-blur-md gold-shimmer parallax-slow gold-shadow">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 blur-[10px] opacity-60" />
              <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white pulse-gold engine-glow">
                <svg viewBox="0 0 64 64" className="h-11 w-11 text-blue-600" fill="none">
                  <defs>
                    <linearGradient id="engineGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="50%" stopColor="#d6b44a" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  <circle cx="32" cy="32" r="20" stroke="url(#engineGradient)" strokeWidth="2.5" className="engine-spin ring-shift" />
                  <circle cx="32" cy="32" r="9" stroke="currentColor" strokeWidth="1.6" className="orbit-reverse ring-shift-alt" />

                  {/* Two orbiting nodes */}
                  <g className="engine-spin">
                    <circle cx="32" cy="10" r="3.6" fill="currentColor" />
                  </g>
                  <g className="orbit-reverse">
                    <circle cx="20" cy="32" r="3.3" fill="currentColor" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-blue-700">Auto-generated</div>
              <div className="text-sm font-semibold text-gray-900">Landing Page Engine</div>
            </div>
          </div>

          <div className="mx-auto mb-6 flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white/80 px-4 py-2 text-xs font-semibold text-gray-700 shadow-lg shadow-blue-500/10 parallax-slow">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live preview updates as you type
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl parallax-slow">
            Your landing page,{" "}
            <span className="luxury-gradient-text">done</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl parallax-slow">
            Answer a few questions and Donepage generates a polished, SEO-ready landing page
            you can publish instantly.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6 text-lg text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:to-cyan-700"
            >
              <Link href="/generator">
                Generate my page
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gray-300 bg-white px-8 py-6 text-lg text-gray-900 hover:bg-gray-50"
            >
              <a href="#how-it-works">How it works</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {[
              "Figma-level design feel",
              "SEO-ready structure",
              "Export & publish options",
              "Fast to launch",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-gray-700 shadow-sm backdrop-blur-sm"
              >
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mx-auto mt-14 w-full max-w-5xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Zap className="h-6 w-6 text-white" />,
                title: "Answer questions",
                desc: "A short guided form collects the essentials.",
              },
              {
                icon: <Download className="h-6 w-6 text-white" />,
                title: "Get a full page",
                desc: "A complete, conversion-focused landing page is generated.",
              },
              {
                icon: <Globe className="h-6 w-6 text-white" />,
                title: "Publish instantly",
                desc: "Publish to /slug (KV-backed) and share the link.",
              },
            ].map((b) => (
              <Card
                key={b.title}
                className="border border-gray-200 bg-white/85 shadow-xl shadow-blue-500/5 backdrop-blur-xl"
              >
                <CardContent className="pt-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
                    {b.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{b.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mx-auto mt-16 w-full max-w-5xl">
          <Card className="border border-gray-200 bg-white/85 shadow-xl shadow-blue-500/5 backdrop-blur-xl">
            <CardContent className="py-10">
              <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Contact Donepage</h2>
                  <p className="mt-3 text-gray-600">
                    Have questions about pricing, custom domains, or the generator?
                    Reach us any time.
                  </p>
                  <div className="mt-4 text-sm text-gray-700">
                    Email: <span className="font-semibold">hello@donepage.co</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button asChild size="lg">
                    <a href="mailto:hello@donepage.co">Email Us</a>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    asChild
                  >
                    <a href="#how-it-works">See how it works</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          © 2026 Donepage. Built for speed, clarity, and conversion.
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
