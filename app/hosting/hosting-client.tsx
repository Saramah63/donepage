"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { PublicSiteHeader } from "@/app/components/public-site-header";

export default function HostingClient() {
  const hostingLink = process.env.NEXT_PUBLIC_STRIPE_LINK_HOSTING?.trim() || "";

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-white sm:px-6 sm:py-20">
      <PublicSiteHeader />
      <div className="mx-auto max-w-[760px]">
        <div className="h-12 sm:h-16" />

        <section className="reveal-up text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#bfa76a]">
            Hosting &amp; Support
          </p>
          <h1
            className="mt-4 text-4xl tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Hosting &amp; Support
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#CFCFCF]">
            Keep your page live, secure, and easy to maintain - without handling the technical side yourself.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#CFCFCF]">
            For €19/month, we host and maintain your landing page so you can stay focused on your business.
          </p>
        </section>

        <section className="reveal-up mt-12 rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="stagger-reveal space-y-8">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <h2
                className="text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                What&apos;s included
              </h2>
              <div className="mt-4 space-y-3 text-base leading-7 text-[#CFCFCF]">
                <p>• Hosting on Vercel</p>
                <p>• SSL &amp; uptime monitoring</p>
                <p>• Minor updates</p>
                <p>• Email support</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <h2
                className="text-2xl tracking-tight text-white"
                style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
              >
                Who this is for
              </h2>
              <div className="mt-4 space-y-3 text-base leading-7 text-[#CFCFCF]">
                <p>This is for you if you want:</p>
                <p>• a simple, managed setup</p>
                <p>• no technical maintenance</p>
                <p>• a page that stays live and up to date</p>
              </div>
            </div>
          </div>
        </section>

        <section className="reveal-up mt-12 rounded-[32px] border border-[#222222] bg-[#0F0F0F] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-8">
          <h2
            className="text-2xl tracking-tight text-white"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Activate hosting
          </h2>

          <p className="mt-4 text-base leading-7 text-[#CFCFCF]">
            Start managed hosting in one step. We&apos;ll take care of the technical side after checkout.
          </p>

          <div className="stagger-reveal mt-6 space-y-5">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.02] p-5 sm:p-6">
              <p className="text-sm leading-7 text-[#CFCFCF]">
                Managed hosting includes setup, monitoring, and support so your page stays live without extra technical work on your side.
              </p>
            </div>
            <Button
              asChild
              className="mt-3 h-12 w-full rounded-full bg-[#127A66] text-base font-semibold text-white shadow-[0_0_32px_rgba(18,122,102,0.28)] hover:bg-[#15907A]"
            >
              <a href={hostingLink || "/contact?reason=hosting"}>Add Hosting — €19/mo</a>
            </Button>
          </div>

          <div className="mt-10 border-t border-white/8 pt-8 text-center">
            <p
              className="text-2xl tracking-tight text-white"
              style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
            >
              Prefer to start with the page first?
            </p>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#CFCFCF]">
              Generate your page now and add hosting later.
            </p>
            <Button
              asChild
              className="mt-6 h-12 rounded-full bg-[#127A66] px-8 text-base font-semibold text-white shadow-[0_0_32px_rgba(18,122,102,0.28)] hover:bg-[#15907A]"
            >
              <Link href="/start" target="_blank" rel="noopener noreferrer">
                Start My Page
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
