import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";

export const metadata: Metadata = {
  title: "Hosting & Support | Donepage",
  description: "Managed hosting and support add-on for Donepage websites.",
};

export default function HostingPage() {
  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-14">
      <div className="mesh-hero" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/75">
        <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Donepage</Link>
        <ThemeToggle />
      </div>
      <Card className="card-lift reveal-up border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Hosting & Support</h1>
          <p className="mt-3 max-w-2xl text-gray-700 dark:text-gray-200">
            Keep your site live, secure, and supported with a simple monthly add-on.
          </p>

          <div className="mt-7 rounded-xl border border-gray-200 bg-white/80 p-5 dark:border-gray-700 dark:bg-slate-900/70">
            <p className="text-sm text-gray-700 dark:text-gray-200">Pricing</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">€19/month</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white/70 p-5 dark:border-gray-700 dark:bg-slate-900/60">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What’s included</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li>Hosting on Vercel</li>
                <li>SSL certificate and uptime management</li>
                <li>Minor content updates</li>
                <li>Email support</li>
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white/70 p-5 dark:border-gray-700 dark:bg-slate-900/60">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">What’s not included</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                <li>New multi-page features or major redesigns</li>
                <li>Custom app development or deep integrations</li>
                <li>Third-party software subscription costs</li>
              </ul>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-700 dark:text-gray-200">
            Email is handled via Google Workspace, Microsoft 365, or Zoho. DNS setup can be done as a one-time add-on.
          </p>

          <Button asChild className="mt-7 h-12 bg-blue-600 px-7 text-base !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
            <Link href="/contact?reason=hosting" className="!text-white">Request Hosting Setup</Link>
          </Button>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}
