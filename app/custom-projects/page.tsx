import type { Metadata } from "next";
import { Suspense } from "react";
import CustomClient from "../custom/custom-client";

export const metadata: Metadata = {
  title: "Custom Projects | Donepage",
  description: "Premium intake page for custom Donepage projects and proposals.",
};

export default function CustomProjectsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0A0A0A]" />}>
      <CustomClient />
    </Suspense>
  );
}
