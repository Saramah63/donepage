import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact | Donepage",
  description: "Contact Donepage for launch packages, hosting, or custom proposal requests.",
};

export default function ContactPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">Loading...</main>}>
      <ContactClient />
    </Suspense>
  );
}
