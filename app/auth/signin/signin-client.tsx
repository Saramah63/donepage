"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";

type Provider = { id: string; name: string };

export default function SignInClient() {
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const list = data ? Object.values(data) : [];
        setProviders(list as Provider[]);
      })
      .catch(() => {
        if (!mounted) return;
        setProviders([]);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/40 to-cyan-50/40 px-4 py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-gray-900">Sign in to Donepage</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a sign‑in method below.
        </p>

        {loading ? (
          <div className="mt-6 text-sm text-gray-500">Loading providers…</div>
        ) : providers.length === 0 ? (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No sign‑in providers are configured. Add Google/GitHub or Email
            credentials in your environment variables to enable login.
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {providers.map((provider) => (
              <Button
                key={provider.id}
                className="w-full"
                onClick={() => signIn(provider.id, { callbackUrl: "/generator" })}
              >
                Continue with {provider.name}
              </Button>
            ))}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500">
          Need access? Contact support at hello@donepage.co
        </div>
      </div>
    </div>
  );
}
