import Link from "next/link";
import Stripe from "stripe";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { ThemeToggle } from "@/app/components/theme-toggle";

type Plan = "launch" | "growth" | "hosting" | "";

type PageProps = {
  searchParams?: { session_id?: string };
};

function toPlanLabel(plan: string) {
  if (!plan) return "";
  return plan[0].toUpperCase() + plan.slice(1);
}

async function fetchSession(sessionId: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  const stripe = new Stripe(secret);
  return await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["customer_details"],
  });
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = (searchParams?.session_id || "").trim();
  const session = sessionId ? await fetchSession(sessionId) : null;
  const plan = (session?.metadata?.plan || "") as Plan;
  const email = session?.customer_details?.email || session?.customer_email || "";
  const startHref = plan ? `/start?plan=${encodeURIComponent(plan)}` : "/start";

  return (
    <main className="donepage-surface-theme relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 dark:border-gray-700 dark:bg-slate-900/75">
          <Link href="/" className="text-sm font-semibold text-gray-900 dark:text-gray-100">Donepage</Link>
          <ThemeToggle />
        </div>
        <Card className="border-gray-200 bg-white/90 shadow-xl shadow-blue-900/5 dark:border-gray-700 dark:bg-slate-900/85">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              Payment received
            </h1>
            <p className="mt-3 text-gray-700 dark:text-gray-200">
              {plan
                ? `Thanks for choosing the ${toPlanLabel(plan)} plan. We’re ready for your brief.`
                : "Thanks for your payment. We’re ready for your brief."}
            </p>
            {email ? (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Receipt sent to {email}
              </p>
            ) : null}
            <Button asChild className="mt-6 h-11 bg-blue-600 !text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400">
              <Link href={startHref}>Start Questionnaire</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
