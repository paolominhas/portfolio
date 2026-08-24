"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { process, webProjects, type WebProject } from "@/data/web-data";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";
import MagneticButton from "@/components/web/MagneticButton";
import TerminalScrollShowcase from "@/components/web/TerminalScrollShowcase";
import { EucoPreview, DioramaPreview } from "@/components/web/HighlightPreviews";
import WebsiteRequestForm from "@/components/web/WebsiteRequestForm";

/**
 * WEB HOME
 *
 * Editorial-brutalist rebuild: the page runs Navy -> Paper -> Navy(full-
 * bleed showcase) -> Lilac -> Paper -> Navy, so full-bleed color blocks
 * do the section-divider work.
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
 * Kept, in order: hero -> TerminalScrollShowcase -> Past highlights
 * (now two real, interactive mini-site recreations instead of link-out
 * cards) -> how the process runs -> a single closing CTA that opens the
 * website-request modal.
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
  const euco = webProjects.find((p) => p.slug === "euco");
  const diorama = webProjects.find((p) => p.slug === "diorama-consulting");

  if (!euco || !diorama) {
    throw new Error("Expected 'euco' and 'diorama-consulting' entries in webProjects");
  }

  return (
    <div>
      {/* ================= HERO — Navy ================= */}
      <section className="relative overflow-hidden bg-navy bg-grain pt-40 pb-28 md:pt-48 md:pb-36 px-6 md:px-10">
        {/* Decorative lilac glow, purely atmospheric */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 w-[36rem] h-[36rem] rounded-full bg-lilac/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 w-[24rem] h-[24rem] rounded-full bg-yellow/10 blur-[100px]"
        />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
          <div>
            <ScrollReveal on="load" y={12}>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-navy bg-yellow px-3 py-1.5 rounded-full mb-8">
                Available for new projects
              </span>
            </ScrollReveal>

            <HeroText
              as="h1"
              text="Websites built like software, not like templates."
              highlightWords={["software", "templates"]}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.98] mb-8"
            />

            <ScrollReveal on="load" delay={0.5} y={14}>
              <p className="text-lg text-white/60 max-w-xl leading-relaxed mb-10">
                I design and build full-stack web projects — from marketing
                sites to content-managed platforms — with the same rigour
                I&apos;d bring to a research codebase: typed,
                version-controlled, and built to be maintained.
              </p>
            </ScrollReveal>

            <ScrollReveal on="load" delay={0.6} y={14}>
              <div className="flex flex-wrap gap-4">
                <MagneticButton href="/portfolio" variant="primary">
                  View selected work
                </MagneticButton>
                <MagneticButton
                  href="https://paolo.org.uk/contact"
                  variant="secondary-light"
                  icon={false}
                >
                  Get in touch
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>

          {/* Signature element: recoloured "editor window" */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            whileHover={{ rotate: 0, y: -4 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
            className="rounded-2xl bg-navy-deep/80 backdrop-blur-sm border border-lilac/30 shadow-[0_30px_80px_rgba(10,11,94,0.5)] overflow-hidden"
          >
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-lilac/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
              <span className="ml-3 font-mono text-xs text-white/40">
                paolo.ts
              </span>
            </div>
            <pre className="p-6 font-mono text-[13px] leading-relaxed text-white/70 overflow-x-auto">
              <code>
                <span className="text-lilac">const</span>{" "}
                <span className="text-yellow">developer</span> = {"{"}
                {"\n"}  name:{" "}
                <span className="text-yellow">&quot;Paolo Minhas&quot;</span>,{"\n"}{" "}
                stack: [
                <span className="text-yellow">&quot;Next.js&quot;</span>,{" "}
                <span className="text-yellow">&quot;TypeScript&quot;</span>,{"\n"}
                {"          "}
                <span className="text-yellow">&quot;Docker&quot;</span>],{"\n"}{" "}
                basedIn:{" "}
                <span className="text-yellow">&quot;Edinburgh, UK&quot;</span>,{"\n"}{" "}
                also: [
                <span className="text-yellow">&quot;physicist&quot;</span>,{" "}
                <span className="text-yellow">&quot;musician&quot;</span>],{"\n"}
                {"}"};
              </code>
            </pre>
          </motion.div>
        </div>
      </section>

      {/* ================= LIVE BUILD — full-bleed pinned track ================= */}
      <section className="bg-paper px-6 md:px-10 pt-20 pb-14 md:pt-28 md:pb-20">
        <ScrollReveal className="max-w-6xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-3">
            01 — Watch it build
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-4 max-w-xl">
            Four builds, one continuous scroll.
          </h2>
          <p className="text-navy/60 max-w-xl">
            An editor drives everything on the right — theming, i18n, a
            3D-tilted layout, and a live payment-gateway swap. Keep
            scrolling; nothing here snaps, it all just tracks your
            scrollbar.
          </p>
        </ScrollReveal>
      </section>
      <TerminalScrollShowcase />

      {/* ================= PAST HIGHLIGHTS — Lilac band ================= */}
      <section className="bg-lilac-light py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-12">
            <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-3">
              02 — Past highlights
            </p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy max-w-xl">
              Two builds worth a closer look.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal delay={0}>
              <HighlightCard project={euco}>
                <EucoPreview />
              </HighlightCard>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <HighlightCard project={diorama}>
                <DioramaPreview />
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
          <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-3">
            03 — How it runs
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-14 max-w-xl">
            Four stages, start to finish.
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {process.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 0.08}>
              <span className="block font-black text-4xl text-yellow mb-4">
                0{i + 1}
              </span>
              <h3 className="text-base font-bold text-navy mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-navy/65 leading-relaxed">
                {step.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================= CTA — Navy ================= */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-6xl mx-auto rounded-3xl bg-navy bg-grain px-8 py-16 md:py-20 text-center overflow-hidden relative">
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
