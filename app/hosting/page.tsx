import type { Metadata } from "next";
import { Suspense } from "react";
import HostingClient from "./hosting-client";

export const metadata: Metadata = {
  title: "Hosting & Support | Donepage",
  description: "Managed hosting and support for Donepage landing pages.",
};

export default function HostingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0A0A0A]" />}>
      <HostingClient />
    </Suspense>
  );
}
