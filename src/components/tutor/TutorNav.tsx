"use client";

import { useEffect, useState } from "react";

/**
 * TUTOR NAV
 * ─────────────────────────────────────────────────────────────────
 * A single-page site doesn't need a route-based nav — just anchor
 * links down the same page, plus a booking CTA that's visible from
 * the first scroll. Picks up a solid cream background once you've
 * scrolled past the hero, so it stays legible over every section
 * colour below it without needing per-section nav theming.
 */

const links = [
  { label: "Subjects", href: "#subjects" },
  { label: "Approach", href: "#approach" },
  { label: "FAQ", href: "#faq" },
];

export default function TutorNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-[var(--tutor-paper)]/90 backdrop-blur-md shadow-[0_1px_0_rgba(18,60,62,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight text-[var(--tutor-ink)]">
            Paolo Minhas
          </span>
          <span className="rounded-full bg-[var(--tutor-amber)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--tutor-ink)]">
            Tutor
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--tutor-ink)]/70 transition-colors hover:text-[var(--tutor-ink)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="rounded-full bg-[var(--tutor-ink)] px-4 py-2 text-sm font-semibold text-[var(--tutor-paper)] transition-colors hover:bg-[var(--tutor-ink-deep)]"
        >
          Book a free call
        </a>
      </nav>
    </header>
  );
}
