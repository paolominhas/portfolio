"use client";

import { motion } from "framer-motion";

/**
 * HERO TEXT
 *
 * Oversized headline with a staggered per-word reveal driven by spring
 * physics (not linear easing) — each word springs up and settles with
 * a slight overshoot, staggered by index so the line reads as a single
 * fluid motion rather than a fade. Used for every H1 on /web.
 *
 * `highlightWords` does a case-insensitive match against each word
 * (punctuation-stripped) and renders matches in bright yellow; every
 * other word renders in the current text color, so this drops into
 * both navy-on-paper and yellow-on-navy headings.
 */

interface HeroTextProps {
  text: string;
  highlightWords?: string[];
  as?: "h1" | "h2";
  className?: string;
  /** Stagger start offset — useful when this isn't the first element to animate in. */
  delayStart?: number;
}

const container = (delayStart: number) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: delayStart,
    },
  },
});

const word = {
  hidden: { opacity: 0, y: 28, rotate: -1.5 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

export default function HeroText({
  text,
  highlightWords = [],
  as = "h1",
  className = "",
  delayStart = 0,
}: HeroTextProps) {
  const words = text.split(" ");
  const highlightSet = new Set(
    highlightWords.map((w) => w.toLowerCase().replace(/[^\w]/g, "")),
  );

  const spans = words.map((w, i) => {
    const stripped = w.toLowerCase().replace(/[^\w]/g, "");
    const isHighlight = highlightSet.has(stripped);
    return (
      <motion.span
        key={`${w}-${i}`}
        variants={word}
        className={`inline-block will-change-transform ${
          isHighlight ? "text-yellow" : ""
        }`}
      >
        {w}
        {i < words.length - 1 ? "\u00A0" : ""}
      </motion.span>
    );
  });

  const sharedProps = {
    variants: container(delayStart),
    initial: "hidden" as const,
    animate: "show" as const,
    className,
    "aria-label": text,
  };

  if (as === "h2") {
    return <motion.h2 {...sharedProps}>{spans}</motion.h2>;
  }

  return <motion.h1 {...sharedProps}>{spans}</motion.h1>;
}
