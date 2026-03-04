import type { Metadata } from "next";
import { Suspense } from "react";
import StartClient from "./start-client";

export const metadata: Metadata = {
  title: "Start Brief | Donepage",
  description: "Share your brief and get your conversion-ready landing page started.",
};

export default function StartPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">Loading...</main>}>
      <StartClient />
    </Suspense>
  );
}
