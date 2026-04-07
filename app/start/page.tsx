import { Suspense } from "react";
import StartClient from "./start-client";

export const metadata = {
  title: "Start | Donepage",
  description: "Start your Donepage brief.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StartPage({
  searchParams,
}: {
  searchParams?: Promise<{ plan?: string; open?: string }> | { plan?: string; open?: string };
}) {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:py-16" />}
    >
      <StartClient />
    </Suspense>
  );
}
