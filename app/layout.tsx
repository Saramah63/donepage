import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Script from "next/script";
import MotionProvider from "./components/motion-provider";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.donepage.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Donepage — Your landing page, done",
  description:
    "Get a high-converting landing page without design or copywriting. Answer a few questions and Donepage builds it for you.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Donepage — Your landing page, done",
    description:
      "Answer a few questions and Donepage builds a polished, SEO-ready landing page you can publish instantly.",
    siteName: "Donepage",
  },
  twitter: {
    card: "summary_large_image",
    title: "Donepage — Your landing page, done",
    description:
      "Answer a few questions and Donepage builds a polished, SEO-ready landing page you can publish instantly.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased"
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var saved = localStorage.getItem("dp_theme");
                var preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                var theme = saved || (preferDark ? "dark" : "light");
                var root = document.documentElement;
                if (theme === "dark") root.classList.add("dark");
                else root.classList.remove("dark");
              } catch (e) {}
            })();
          `}
        </Script>
        <Providers>
          <div className="motion-safe-ready">
            <MotionProvider />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
