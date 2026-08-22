import type { Config } from "tailwindcss";

/**
 * TAILWIND CONFIG — /web EDITORIAL PALETTE
 *
 * This project runs Tailwind CSS v4, which is CSS-first: there's no
 * `tailwind.config.ts` by default, and `@tailwindcss/postcss` doesn't
 * auto-load one. It's wired in explicitly via `@config` at the top of
 * `src/app/globals.css`, which is what makes these tokens available as
 * utility classes (`bg-navy`, `text-yellow`, `bg-lilac-light`, etc.)
 * anywhere in the app.
 *
 * These live in the global config (not scoped to /web) because Tailwind
 * v4 only has one theme per build — but the classes are only ever used
 * inside `src/app/web/**`, so physics/music are untouched in practice.
 */

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#101585", // primary deep navy — hero bg, CTA band, headings
          deep: "#0A0B5E", // darker stop for gradients/overlays
        },
        yellow: {
          DEFAULT: "#FFDD44", // primary accent — CTAs, hover states, highlights
        },
        lilac: {
          DEFAULT: "#A78BFA", // secondary accent — borders, tags, active states
          light: "#EDE7FD", // soft tint — card fills, section backgrounds
        },
        paper: "#F7F5FC", // off-white with a faint lilac cast — base light bg
        // --- /music — acid-brutalist crate-digger palette ---
        lime: "#D6FF00", // primary background — electric neon lime/chartreuse
        magenta: "#FF007F", // accent — mesh gradient, hover states, Download CTA
        cream: "#FFFCEF", // warm off-white — record-sleeve card faces
      },
      fontFamily: {
        // Scoped to /music via the CSS variable next/font/google writes in
        // music/layout.tsx. Named "display" (not "serif") so it never
        // shadows the generic `font-serif` already used by the main
        // portfolio and the pre-redesign music pages.
        display: [
          "var(--font-playfair)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "serif",
        ],
      },
    },
  },
};

export default config;
