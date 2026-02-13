import HomePageClient from "@/app/components/home-page-client";

export const metadata = {
  title: "Donepage — Your landing page, done",
  description:
    "Answer a few questions and Donepage builds a polished, SEO-ready landing page you can publish instantly.",
  robots: { index: true, follow: true },
};

export default function HomePage() {
  return <HomePageClient />;
}
