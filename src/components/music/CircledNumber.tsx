import type { ReactNode } from "react";

/**
 * MUSIC TYPOGRAPHY HELPERS
 *
 * Two small, repo-wide-safe presentational components used across the
 * /music redesign. Neither needs "use client" — pure markup/CSS, no
 * hooks, so they stay Server Components and can be dropped into either
 * server or client parents.
 */

/** A number in a hard-bordered circle — the "track listing" motif used
 * for list items, dates, and the crate index. */
export function CircledNumber({
  n,
  active = false,
  size = "md",
}: {
  n: number;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-14 h-14 text-base",
  }[size];

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 rounded-full border-2 border-black font-mono font-bold tracking-tight transition-colors duration-300 ${sizeClasses} ${
        active ? "bg-magenta text-white border-black" : "bg-transparent text-black"
      }`}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** A heavy black strikethrough over a word/phrase — the "editorial
 * correction mark" used in brutalist-fashion headlines. Uses an
 * arbitrary decoration-thickness utility rather than relying on the
 * (thin, unstyleable) browser default. */
export function Struck({ children }: { children: ReactNode }) {
  return (
    <span className="line-through decoration-black decoration-[6px] md:decoration-[8px] [text-decoration-skip-ink:none]">
      {children}
    </span>
  );
}
