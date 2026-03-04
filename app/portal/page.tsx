import { Suspense } from "react";
import PortalClient from "./portal-client";

export const metadata = {
  title: "Client Portal | Donepage",
  description: "Manage your Donepage project.",
};

export default function PortalPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">Loading...</main>}>
      <PortalClient />
    </Suspense>
  );
}
