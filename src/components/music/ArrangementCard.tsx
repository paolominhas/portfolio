"use client";

import Link from "next/link";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Download, Music2, Clock } from "lucide-react";
import type { Arrangement } from "@/data/arrangements";
import { CircledNumber } from "./CircledNumber";
import DownloadLink from "./DownloadLink";

/**
 * ARRANGEMENT CARD
 * ─────────────────────────────────────────────────────────────────
 * One "record" in the crate. Two independent animation systems live
 * on the same element without fighting each other, because they
 * target different transform/style properties:
 *
 *   1. SCROLL-DRIVEN (rotateY, scale, opacity, x) — passed in via the
 *      `style` prop as live MotionValues derived from the shared
 *      crate-section scroll progress. This is what produces the
 *      "flip forward out of the crate" motion as the section scrolls.
 *
 *   2. HOVER-DRIVEN (y, plus the child CTA's opacity/y) — a
 *      completely separate `variants` + `whileHover` animation for
 *      the lift-and-reveal interaction. Framer Motion composes both
 *      onto the same computed transform without conflict, as long as
 *      (as here) they don't target the same property.
 *
 * The flip itself needs `perspective` set on the DIRECT parent of this
 * component's root element (the stage `<div>` in music/page.tsx) —
 * perspective only affects an element's children, never the element
 * it's declared on, so it can't live here. `transform-style: preserve-3d`
 * isn't needed either, since the card's own content is flat 2D.
 *
 * Card content is a real <Link> to the detail page, so titles stay
 * crawlable/indexable independent of the scroll choreography.
 */

interface ArrangementCardProps {
  arrangement: Arrangement;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -16 },
};

const ctaVariants = {
  rest: { opacity: 0, y: 14 },
  hover: { opacity: 1, y: 0 },
};

export default function ArrangementCard({
  arrangement,
  index,
  total,
  progress,
}: ArrangementCardProps) {
  const segment = 1 / total;
  const segStart = index * segment;
  const segEnd = segStart + segment;

  // Buffer the entrance/exit by half a segment on each side so a card
  // is already mostly "settled" for the full middle portion of its
  // own segment, with a smooth flip either side of it. Framer Motion
  // clamps values outside this range to the first/last output, so a
  // card that isn't the active/neighbouring one just holds steady at
  // its dim, edge-on resting state rather than extrapolating further.
  const inputRange = [
    Math.max(segStart - segment * 0.5, 0),
    segStart + segment * 0.15,
    segEnd - segment * 0.15,
    Math.min(segEnd + segment * 0.5, 1),
  ];

  // Flip axis: edge-on (like a record standing in the crate) -> flat,
  // facing the viewer -> edge-on the other way, as if flipped past.
  const rotateY = useTransform(progress, inputRange, [64, 0, 0, -64]);
  const scale = useTransform(progress, inputRange, [0.74, 1, 1, 0.74]);
  const opacity = useTransform(progress, inputRange, [0.3, 1, 1, 0.3]);
  const x = useTransform(progress, inputRange, [64, 0, 0, -64]);

  return (
    <motion.div
      style={{ rotateY, scale, opacity, x }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative w-full max-w-sm aspect-[4/5] bg-cream border-4 border-black shadow-brutal-lg p-6 md:p-7 flex flex-col">
        {/* Top row: track number + format tag */}
        <div className="flex items-start justify-between mb-6">
          <CircledNumber n={index + 1} active size="md" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-black/50 border border-black/30 px-2 py-1">
            {arrangement.arrangedFor}
          </span>
        </div>

        {/* Title block */}
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-black/50 mb-2">
            {arrangement.originalComposer}
          </p>
          <Link
            href={`/arrangements/${arrangement.slug}`}
            className="font-display text-3xl md:text-4xl font-bold leading-[1.05] text-black hover:text-magenta transition-colors"
          >
            {arrangement.title}
          </Link>
          <p className="text-sm text-black/60 leading-relaxed mt-4 line-clamp-3">
            {arrangement.excerpt}
          </p>
        </div>

        {/* Bottom meta row */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t-2 border-black/10">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-black/50">
            <Clock size={12} /> {arrangement.durationMinutes} min
          </span>
          <div className="flex flex-wrap gap-1.5 justify-end">
            {arrangement.instrumentation.slice(0, 2).map((inst) => (
              <span
                key={inst}
                className="text-[10px] font-mono uppercase tracking-wide text-black/50 bg-black/5 px-2 py-1"
              >
                {inst}
              </span>
            ))}
          </div>
        </div>

        {/* Hover-revealed Download CTAs — hot pink, per spec. Two
            slots (score + recording), each active or inert depending
            on whether this arrangement has a real file yet. Positioned
            with `bottom-0` (a layout offset) rather than a translate
            utility, so it doesn't fight with the `y` Framer Motion
            already animates via `variants` on this same element. */}
        <motion.div
          variants={ctaVariants}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="absolute inset-x-0 bottom-0 flex"
        >
          <DownloadLink
            href={arrangement.scoreUrl}
            label="Score"
            icon={<Download size={14} strokeWidth={2.5} />}
            size="compact"
          />
          <div className="border-l-2 border-black flex flex-1">
            <DownloadLink
              href={arrangement.audioUrl}
              label="Audio"
              icon={<Music2 size={14} strokeWidth={2.5} />}
              size="compact"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
