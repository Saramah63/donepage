"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("dp_theme") as Theme | null;
      const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const next: Theme = saved || (preferDark ? "dark" : "light");
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    } catch {
      // no-op
    }
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("dp_theme", next);
    } catch {
      // no-op
    }
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 ${className}`}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

