import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import Script from "next/script";
import { Manrope, Playfair_Display } from "next/font/google";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Donepage — Your landing page, done",
  description:
    "Get a high-converting landing page without design or copywriting. Answer a few questions and Donepage builds it for you.",
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
        className={[
          "min-h-screen bg-background text-foreground antialiased",
          bodyFont.variable,
          displayFont.variable,
        ].join(" ")}
      >
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ? (
          <Script id="crisp-chat" strategy="afterInteractive">
            {`
              window.$crisp = window.$crisp || [];
              window.CRISP_WEBSITE_ID = "${process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}";
              (function () {
                var d = document;
                var s = d.createElement("script");
                s.src = "https://client.crisp.chat/l.js";
                s.async = 1;
                d.getElementsByTagName("head")[0].appendChild(s);
              })();
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
