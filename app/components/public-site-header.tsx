"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "How it Works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Custom Projects", href: "/custom-projects" },
  { label: "Contact", href: "/#contact" },
];

export function PublicSiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[300] border-b border-white/10 bg-[rgba(10,10,10,0.96)] shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-20 max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.22em] text-white/92 transition-opacity duration-200 hover:opacity-100"
        >
          Donepage
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm text-white/68 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="hidden h-11 rounded-full border border-white/70 bg-white px-6 text-sm font-semibold text-[#0A0A0A] shadow-[0_0_24px_rgba(255,255,255,0.16)] transition duration-300 hover:scale-[1.02] hover:bg-white/95 hover:text-[#0A0A0A] md:inline-flex"
          >
            <Link href="/start" style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}>
              Start My Page
            </Link>
          </Button>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition duration-200 hover:bg-white/[0.06] md:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="h-px w-4 bg-white" />
              <span className="h-px w-4 bg-white" />
              <span className="h-px w-4 bg-white" />
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/8 px-4 pb-5 pt-4 md:hidden">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-3">
            <Button
              asChild
              className="h-11 rounded-full border border-white/70 bg-white text-sm font-semibold text-[#0A0A0A] shadow-[0_0_24px_rgba(255,255,255,0.16)] transition duration-300 hover:scale-[1.02] hover:bg-white/95 hover:text-[#0A0A0A]"
            >
              <Link
                href="/start"
                onClick={closeMenu}
                style={{ color: "#0A0A0A", backgroundColor: "#FFFFFF" }}
              >
                Start My Page
              </Link>
            </Button>

            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/82 transition-colors duration-200 hover:bg-white/[0.05] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
