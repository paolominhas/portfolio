"use client";

import { motion } from "framer-motion";
import { Target, Wand2, Leaf, Search, type LucideIcon } from "lucide-react";
import { workPillars, type WorkPillar } from "@/data/web-data";
import ScrollReveal from "@/components/web/ScrollReveal";
import HeroText from "@/components/web/HeroText";

/**
 * HOW WE WORK SHOWCASE
 * ─────────────────────────────────────────────────────────────────
 * Four value pillars, rewritten from a single run-on paragraph into
 * distinct, ordered ideas (see `workPillars` in web-data.ts for the
 * copy itself). Sits directly under the hero, before any project
 * examples — the pitch is "here's why", then "here's proof".
 *
 * Deliberately icon-badged rather than numbered: /web already uses
 * bold yellow numerals for the *sequential* 4-stage process further
 * down the page ("How it runs"). Reusing that pattern here would
 * read as a second, competing process rather than four independent
 * principles, so this uses icon tiles instead to stay visually
 * distinct from that section.
 *
 * The "Start with the goal" card additionally renders a staggered
 * row of real example search terms — concrete rather than abstract,
 * and doubles as the section's one bit of extra motion beyond the
 * shared ScrollReveal entrance every card gets.
 */

const icons: Record<WorkPillar["icon"], LucideIcon> = {
  target: Target,
  wand: Wand2,
  leaf: Leaf,
  search: Search,
};

const chipContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const chip = {
  hidden: { opacity: 0, y: 8, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
};

export default function HowWeWorkShowcase() {
  return (
    <section className="bg-paper px-6 md:px-10 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-14 md:mb-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-3">
            01 — How we work
          </p>
          <HeroText
            as="h2"
            text="A website should earn its keep."
            highlightWords={["earn"]}
            className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-4"
          />
          <p className="text-navy/60 leading-relaxed max-w-xl">
            It has never been easier to put up a site through a builder or a
            subscription service. The difference is what happens next — here's
            what actually goes into making one stand out.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {workPillars.map((pillar, i) => {
            const Icon = icons[pillar.icon];
            return (
              <ScrollReveal key={pillar.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border-2 border-navy/10 bg-white/60 p-6 md:p-7">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow">
                    <Icon size={20} strokeWidth={2.25} className="text-navy" />
                  </div>
                  <h3 className="mb-2.5 text-lg font-bold text-navy">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-navy/65">
                    {pillar.description}
                  </p>

                  {pillar.searchTerms && (
                    <motion.div
                      variants={chipContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                      className="mt-5 flex flex-wrap gap-2"
                    >
                      {pillar.searchTerms.map((term) => (
                        <motion.span
                          key={term}
                          variants={chip}
                          className="rounded-full border border-navy/15 bg-paper px-2.5 py-1 font-mono text-[11px] text-navy/70"
                        >
                          &ldquo;{term}&rdquo;
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
