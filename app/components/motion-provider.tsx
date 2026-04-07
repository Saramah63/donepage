"use client";

import * as React from "react";

export default function MotionProvider() {
  React.useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let timeoutId: number | null = null;
    let mutationObserver: MutationObserver | null = null;

    const seen = new WeakSet<Element>();

    const observeNodes = () => {
      if (!observer) return;

      const revealNodes = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal-up, .stagger-reveal")
      );

      for (const node of revealNodes) {
        if (seen.has(node)) continue;
        seen.add(node);
        observer.observe(node);
      }
    };

    timeoutId = window.setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      observeNodes();

      mutationObserver = new MutationObserver(() => {
        observeNodes();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }, 120);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      mutationObserver?.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}
