import HomePageClient from "@/app/components/home-page-client";

export const metadata = {
  title: "Donepage — Launch your landing page in days",
  description:
    "Answer a few questions and Donepage builds a conversion-ready landing page in days.",
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <HomePageClient />;
}
