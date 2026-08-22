"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * SCROLL REVEAL
 *
 * A single reusable fade-up + scale-in wrapper used across every /web
 * page for portfolio cards, section headers, and list rows. Spring
 * physics rather than linear easing, matching the hero.
 *
 * Two modes:
 *   - `on="scroll"` (default): animates via `whileInView`, fires once
 *     as each element crosses into the viewport — used for anything
 *     below the fold.
 *   - `on="load"`: animates immediately via `animate`, for above-the-
 *     fold content (hero sub-elements, article headers) where waiting
 *     for a scroll trigger would mean it never plays.
 */

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, typically `index * 0.08`. */
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
  /** Starting scale (1 = no scale-in). */
  scale?: number;
  on?: "scroll" | "load";
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 24,
  scale = 1,
  on = "scroll",
}: ScrollRevealProps) {
  const initial = { opacity: 0, y, scale };
  const target = { opacity: 1, y: 0, scale: 1 };

  const shared = {
    initial,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
      delay,
    },
    className,
  };

  if (on === "load") {
    return (
      <motion.div {...shared} animate={target}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      {...shared}
      whileInView={target}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
