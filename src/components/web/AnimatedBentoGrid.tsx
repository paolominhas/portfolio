"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

/**
 * ANIMATED BENTO GRID
 *
 * Editorial-style asymmetric grid (used for "What I do" on the /web
 * home page, and reusable anywhere a set of cards needs the same
 * scroll-in + hover treatment). Each cell:
 *   - fades/scales in on scroll, staggered by index
 *   - lifts slightly on hover
 *   - shifts its accent bar from Lilac to Bright Yellow on hover,
 *     the signature micro-interaction called out in the brief
 *
 * `span: "lg"` makes a cell take 2 columns on md+ viewports, for the
 * bento asymmetry — pass it on the first or a standout item.
 */

export interface BentoItem {
  eyebrow?: string;
  title: string;
  description: string;
  tags?: string[];
  href?: string;
  span?: "sm" | "lg";
}

interface AnimatedBentoGridProps {
  items: BentoItem[];
  columns?: 2 | 3;
}

export default function AnimatedBentoGrid({
  items,
  columns = 3,
}: AnimatedBentoGridProps) {
  const gridCols =
    columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
      {items.map((item, i) => {
        const cardClassName =
          "relative flex h-full flex-col rounded-2xl bg-lilac-light/60 border-2 border-transparent p-7 md:p-8 transition-colors duration-300 group-hover:border-yellow group-hover:bg-paper overflow-hidden";

        const cardContent = (
          <>
            {/* Accent bar: lilac -> yellow on hover */}
            <span className="absolute left-0 top-0 h-1.5 w-full bg-lilac transition-colors duration-300 group-hover:bg-yellow" />

            <div className="flex items-start justify-between mb-6">
              {item.eyebrow && (
                <span className="font-mono text-xs tracking-widest text-navy/50">
                  {item.eyebrow}
                </span>
              )}
              {item.href && (
                <ArrowUpRight
                  size={18}
                  className="text-navy/30 transition-all duration-300 group-hover:text-navy group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              )}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-navy tracking-tight mb-3">
              {item.title}
            </h3>
            <p className="text-sm md:text-[15px] leading-relaxed text-navy/70 mb-6">
              {item.description}
            </p>

            {item.tags && (
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono uppercase tracking-wide text-navy/60 bg-white/70 border border-navy/10 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        );

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              type: "spring",
              stiffness: 140,
              damping: 20,
              delay: i * 0.08,
            }}
            whileHover={{ y: -6 }}
            className={`group relative ${
              item.span === "lg" ? "md:col-span-2" : ""
            }`}
          >
            {item.href ? (
              <Link href={item.href} className={cardClassName}>
                {cardContent}
              </Link>
            ) : (
              <div className={cardClassName}>{cardContent}</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
