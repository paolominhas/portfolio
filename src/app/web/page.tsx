"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { process, webProjects, type WebProject } from "@/data/web-data";
import BlueprintHero from "@/components/instrument/BlueprintHero";
import ScrollReveal from "@/components/web/ScrollReveal";
import HowWeWorkShowcase from "@/components/web/HowWeWorkShowcase";
import TerminalScrollShowcase from "@/components/web/TerminalScrollShowcase";
import SitePreview from "@/components/web/HighlightPreviews";
import WebsiteRequestForm from "@/components/web/WebsiteRequestForm";

/**
 * WEB HOME
 *
 * Editorial-brutalist rebuild: the page runs Navy -> Paper -> Paper ->
 * Navy(full-bleed showcase) -> Lilac -> Paper -> Navy, so full-bleed
 * color blocks do most of the section-divider work.
 *
 * This pass leans the page out rather than adding to it. Cut versus the
 * previous build:
 *   - The standalone "services" bento grid and the tech-stack pill wall
 *     — both told, not showed, and the hero copy already covers
 *     positioning at a glance.
 *   - `ProcessShowcase`, the older pinned 350vh "watch it build" section
 *     — `TerminalScrollShowcase` is the same pitch done better, so
 *     running both back-to-back was redundant scroll-jacking. The
 *     component itself is untouched and still lives in
 *     src/components/web/ProcessShowcase.tsx if it's wanted elsewhere.
 *
 * Kept, in order: hero -> HowWeWorkShowcase (the four value pillars,
 * rewritten from a single run-on paragraph) -> TerminalScrollShowcase
 * -> Past highlights (real client screenshots, cycled on click, rather
 * than the previous simulated mini-site recreations) -> how the process
 * runs (each stage now expands to show what it actually involves —
 * design tooling, payment integrations) -> a single closing CTA that
 * opens the website-request modal.
 */

function HighlightCard({
  project,
  children,
}: {
  project: WebProject;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      {children}
      <div>
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-navy">{project.title}</h3>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-navy/40 transition-colors hover:text-navy"
            aria-label={`Visit ${project.title} (opens in a new tab)`}
          >
            <ArrowUpRight size={18} />
          </a>
        </div>
        <p className="mb-2 text-sm leading-relaxed text-navy/70">{project.description}</p>
        <p className="mb-3 text-xs text-navy/45">{project.outcome}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-navy/10 bg-white/60 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-navy/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WebHomePage() {
  const euco = webProjects.find((p) => p.slug === "euco-website");
  const diorama = webProjects.find((p) => p.slug === "diorama-consulting");

  if (!euco || !diorama) {
    throw new Error("Expected 'euco-website' and 'diorama-consulting' entries in webProjects");
  }

  // Which "How it runs" stages are expanded to show their detail chips.
  // Multiple can be open at once — deliberately not a single-open
  // accordion, since comparing two stages side by side (e.g. Design vs
  // Build) is a reasonable thing to want on a 4-column desktop layout.
  const [openSteps, setOpenSteps] = useState<Record<number, boolean>>({});
  function toggleStep(i: number) {
    setOpenSteps((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  return (
    <div>
      {/* ================= HERO: blueprint (components/instrument/BlueprintHero) ================= */}
      <BlueprintHero />

      {/* ================= HOW WE WORK — Paper ================= */}
      <HowWeWorkShowcase />

      {/* ================= LIVE BUILD — full-bleed pinned track ================= */}
      <section className="bg-paper px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
        <ScrollReveal className="max-w-6xl mx-auto">
          <p className="in-label mb-3">Watch it build</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-4 max-w-xl">
            Four builds, one continuous scroll.
          </h2>
          <p className="text-navy/60 max-w-xl">
            Changing your site is as easy as clicking a box to change a colour or typing out a new title. Behind the scenes software works to change words in the source code, as you can see happen to this site live here.
          </p>
        </ScrollReveal>
      </section>
      <TerminalScrollShowcase />

      {/* ================= PAST HIGHLIGHTS — Lilac band ================= */}
      <section className="bg-lilac-light py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-12">
            <p className="in-label mb-3">Past highlights</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy max-w-xl">
              Two builds worth a closer look.
            </h2>
            <p className="mt-3 text-sm text-navy/50 max-w-md">
              Real screenshots — click through either one for a couple more views.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal delay={0}>
              <HighlightCard project={euco}>
                <SitePreview project={euco} />
              </HighlightCard>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <HighlightCard project={diorama}>
                <SitePreview project={diorama} />
              </HighlightCard>
            </ScrollReveal>
          </div>

          <div className="mt-10 flex justify-center md:justify-end">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 rounded-full border-2 border-navy px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              View all work <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT RUNS — Paper ================= */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto py-20 md:py-28">
        <ScrollReveal>
          <p className="in-label mb-3">How it runs</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-3 max-w-xl">
            Four stages, start to finish.
          </h2>
          <p className="text-navy/60 max-w-xl mb-14">
            Tap a stage for what it actually involves — including the
            design tooling behind &ldquo;Design&rdquo; and the payment
            integrations behind &ldquo;Build&rdquo;.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {process.map((step, i) => {
            const isOpen = !!openSteps[i];
            return (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <button
                  type="button"
                  onClick={() => toggleStep(i)}
                  aria-expanded={isOpen}
                  disabled={!step.details}
                  className="group block w-full text-left"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="block font-black text-4xl text-yellow">
                      0{i + 1}
                    </span>
                    {step.details && (
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-navy/50 transition-all duration-300 group-hover:border-navy/40 group-hover:text-navy ${
                          isOpen ? "rotate-45 border-navy/40 text-navy" : "border-navy/15"
                        }`}
                      >
                        <Plus size={14} />
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-navy/65 leading-relaxed">
                    {step.description}
                  </p>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && step.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="mt-4 flex flex-col gap-2 border-l-2 border-yellow/40 pl-4">
                        {step.details.map((detail) => (
                          <li
                            key={detail}
                            className="font-mono text-[11px] uppercase tracking-wide text-navy/60"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ================= CTA — Navy ================= */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-6xl mx-auto in-dark rounded-3xl bg-navy bg-grain px-8 py-16 md:py-20 text-center overflow-hidden relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-lilac/15 blur-[110px]"
          />
          <ScrollReveal className="relative">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Have a project in <span className="text-yellow">mind?</span>
            </h2>
            <p className="text-white/50 mb-10 max-w-md mx-auto">
              Tell me a bit about what you need and I&apos;ll reply within a
              couple of days with next steps.
            </p>
            <div className="flex justify-center">
              <WebsiteRequestForm />
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
