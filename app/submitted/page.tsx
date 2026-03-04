import { Suspense } from "react";
import SubmittedClient from "./submitted-client";

export const metadata = {
  title: "Submitted | Donepage",
  description: "Your Donepage draft is ready.",
};

export default function SubmittedPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">Loading...</main>}>
      <SubmittedClient />
    </Suspense>
  );
}
