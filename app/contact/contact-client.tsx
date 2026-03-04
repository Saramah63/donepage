"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";

type Reason = "donepage" | "hosting" | "custom_proposal" | "other";

const queryToReason = (value: string | null): Reason => {
  if (value === "custom") return "custom_proposal";
  if (value === "hosting") return "hosting";
  if (value === "donepage") return "donepage";
  return "other";
};

export default function ContactClient() {
  const params = useSearchParams();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [reason, setReason] = React.useState<Reason>(queryToReason(params.get("reason")));
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    setReason(queryToReason(params.get("reason")));
  }, [params]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        reason,
        message: message.trim(),
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "send_failed");

      toast.success("Message sent.");
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
      setReason("donepage");
    } catch (error: any) {
      toast.error(error?.message || "Could not send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-14">
      <div className="mesh-hero" aria-hidden="true" />
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/75">
        <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Donepage</Link>
        <ThemeToggle />
      </div>
      <Card className="card-lift reveal-up border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
        <CardContent className="p-6 sm:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">Contact</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-200">Tell us what you need and we’ll reply shortly.</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as Reason)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
              >
                <option value="donepage">Donepage</option>
                <option value="hosting">Hosting</option>
                <option value="custom_proposal">Custom proposal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">Name *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">Email *</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">Company (optional)</label>
              <input value={company} onChange={(e) => setCompany(e.target.value)} className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">Message *</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-28 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-slate-900 dark:text-gray-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20" />
            </div>

            <Button type="submit" className="h-12 w-full bg-blue-600 text-base !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400" disabled={submitting}>
              {submitting ? "Sending..." : "Send message"}
            </Button>
          </form>

          <p className="mt-5 text-sm text-gray-700 dark:text-gray-200">
            Want to get started faster? <Link href="/start" target="_blank" rel="noopener noreferrer" className="font-medium underline text-blue-700 dark:text-cyan-300">Complete the brief</Link>.
          </p>
        </CardContent>
      </Card>
      </div>
    </main>
  );
}
