"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services, process, techStack, webProjects } from "@/data/web-data";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";
import MagneticButton from "@/components/web/MagneticButton";
import AnimatedBentoGrid, { type BentoItem } from "@/components/web/AnimatedBentoGrid";
import ProcessShowcase from "@/components/web/ProcessShowcase";

/**
 * WEB HOME
 *
 * Editorial-brutalist rebuild: the page runs Navy -> Paper -> Lilac ->
 * Paper -> Navy, so full-bleed color blocks do the work section
 * dividers used to do. Structure is unchanged from the previous build
 * (positioning statement, services, two case studies, process, tech
 * strip, CTA) — this is a visual and motion pass, not a content one.
 */

const featuredProjects = webProjects.filter((p) => !p.placeholder).slice(0, 2);

const serviceItems: BentoItem[] = services.map((service, i) => ({
  eyebrow: `0${i + 1}`,
  title: service.title,
  description: service.description,
  tags: service.tags,
  span: i === 0 ? "lg" : "sm",
}));

export default function WebHomePage() {
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


      <ProcessShowcase/>


      {/* ================= SERVICES — Paper ================= */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto py-20 md:py-28">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-3">
            01 — What I do
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy mb-12 max-w-xl">
            Three ways I can help.
          </h2>
        </ScrollReveal>
        <AnimatedBentoGrid items={serviceItems} />
      </section>

      {/* ================= SELECTED WORK — Lilac band ================= */}
      <section className="bg-lilac-light py-20 md:py-28 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-3">
                02 — Selected work
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-navy">
                A couple of favourites.
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-white hover:bg-navy px-4 py-2 rounded-full border-2 border-navy transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.1} scale={0.97}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl bg-paper border-2 border-transparent hover:border-yellow p-7 md:p-8 transition-colors duration-300 h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-navy group-hover:text-navy transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      size={18}
                      className="text-navy/30 group-hover:text-navy transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-1"
                    />
                  </div>
                  <p className="text-sm text-navy/70 leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <p className="text-xs text-navy/45 mb-5">{project.outcome}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono uppercase tracking-wide text-navy/60 bg-lilac-light border border-navy/10 group-hover:bg-yellow/20 group-hover:border-yellow/40 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-8 md:hidden">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-semibold text-navy border-2 border-navy px-4 py-2 rounded-full"
            >
              View all work <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PROCESS — Paper ================= */}
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

      {/* ================= TECH STACK — Paper ================= */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto pb-20 md:pb-28">
        <ScrollReveal>
          <p className="font-mono text-xs uppercase tracking-widest text-navy/50 mb-6">
            Tools I reach for
          </p>
        </ScrollReveal>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tool, i) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              className="px-4 py-2 rounded-full border-2 border-lilac/50 bg-lilac-light/40 text-sm text-navy font-mono hover:bg-yellow hover:border-yellow transition-colors duration-300 cursor-default"
            >
              {tool}
            </motion.span>
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
              I take on a small number of projects at a time — get in touch
              and I&apos;ll reply within a couple of days.
            </p>
            <div className="flex justify-center">
              <MagneticButton href="https://paolo.org.uk/contact" variant="primary">
                Start a conversation
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
