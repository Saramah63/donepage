"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-28 border-t border-white/8 bg-[#0A0A0A]">
      <div className="mx-auto max-w-[860px] px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-20">
        <section>
          <h3
            className="text-2xl tracking-tight text-white"
            style={{ fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif' }}
          >
            Donepage
          </h3>
          <p className="mt-4 text-base leading-7 text-[#E7E7E7]">Your landing page, done.</p>
          <a
            href="mailto:hello@donepage.co"
            className="mt-5 inline-block text-sm leading-7 text-[#AFAFAF] transition-colors duration-200 hover:text-white"
          >
            hello@donepage.co
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-[#8F8F8F]">
            <Link href="/privacy-policy" className="transition-colors duration-200 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="transition-colors duration-200 hover:text-white">
              Terms of Service
            </Link>
          </div>
          <p className="mt-6 text-sm text-[#727272]">© 2026 Donepage</p>
        </section>
      </div>
    </footer>
  );
}
