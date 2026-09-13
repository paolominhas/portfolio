"use client";

import { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Flag,
  BookOpen,
  TrendingUp,
  Atom,
  Video,
  MapPin,
  GraduationCap,
  Plus,
  ChevronDown,
  MessageCircleHeart,
} from "lucide-react";
import { levels, howItWorks, faqs, testimonials, type Level } from "@/data/tutor-data";
import ScrollReveal from "@/components/tutor/ScrollReveal";
import TutorInquiryForm from "@/components/tutor/TutorInquiryForm";

/**
 * TUTOR HOME — the whole site.
 *
 * One long page by design (see the brief): hero → subjects/levels →
 * approach (credibility + how it works) → testimonials → FAQ →
 * booking form. Nav anchors jump within this same page rather than
 * routing anywhere.
 *
 * Two schema.org blocks are embedded below: a Service block (so
 * search engines can parse exactly what's offered, to whom, at what
 * levels) and a FAQPage block built directly from `faqs` in
 * tutor-data.ts — the second one is a genuine lever, not decoration:
 * Google can render FAQ entries as an expandable rich result directly
 * in search, which is real visibility a plain page can't get on its
 * own.
 */

const levelIcons: Record<string, typeof Flag> = {
  "11-plus": Flag,
  gcse: BookOpen,
  "a-level": TrendingUp,
  "advanced-higher": Atom,
};

const floatingSymbols = [
  { symbol: "π", top: "14%", left: "7%", size: "2.75rem", duration: 7, delay: 0 },
  { symbol: "∫", top: "70%", left: "5%", size: "2.25rem", duration: 9, delay: 1 },
  { symbol: "E=mc²", top: "18%", left: "84%", size: "1.35rem", duration: 8, delay: 0.5 },
  { symbol: "Σ", top: "74%", left: "88%", size: "2.5rem", duration: 6.5, delay: 1.5 },
  { symbol: "x²", top: "46%", left: "93%", size: "1.85rem", duration: 10, delay: 0.3 },
  { symbol: "F=ma", top: "88%", left: "22%", size: "1.1rem", duration: 7.5, delay: 2 },
];

function FloatingSymbols() {
  const reduceMotion = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {floatingSymbols.map((s, i) => (
        <motion.span
          key={i}
          className="absolute font-serif font-bold text-[var(--tutor-amber)]/25"
          style={{ top: s.top, left: s.left, fontSize: s.size }}
          animate={reduceMotion ? undefined : { y: [0, -16, 0], rotate: [0, 4, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {s.symbol}
        </motion.span>
      ))}
    </div>
  );
}

function LevelCard({ level, isOpen, onToggle }: { level: Level; isOpen: boolean; onToggle: () => void }) {
  const Icon = levelIcons[level.key] ?? BookOpen;
  return (
    <div className="rounded-2xl border-2 border-[var(--tutor-ink)]/10 bg-white p-6 md:p-7">
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="group block w-full text-left">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--tutor-amber)]/15 text-[var(--tutor-ink)]">
            <Icon size={20} strokeWidth={2.25} />
          </div>
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[var(--tutor-ink)]/50 transition-all duration-300 group-hover:border-[var(--tutor-ink)]/40 group-hover:text-[var(--tutor-ink)] ${
              isOpen ? "rotate-45 border-[var(--tutor-ink)]/40 text-[var(--tutor-ink)]" : "border-[var(--tutor-ink)]/15"
            }`}
          >
            <Plus size={14} />
          </span>
        </div>
        <h3 className="mb-1 text-lg font-bold text-[var(--tutor-ink)]">{level.name}</h3>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--tutor-ink)]/40">
          {level.region}
        </p>
        <p className="text-sm leading-relaxed text-[var(--tutor-ink)]/65">{level.blurb}</p>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <ul className="mt-4 flex flex-col gap-2 border-l-2 border-[var(--tutor-amber)]/50 pl-4">
              {level.details.map((detail) => (
                <li key={detail} className="text-xs font-medium uppercase tracking-wide text-[var(--tutor-ink)]/55">
                  {detail}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TutorHomePage() {
  const [openLevels, setOpenLevels] = useState<Record<string, boolean>>({});
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  function toggleLevel(key: string) {
    setOpenLevels((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Private tutoring",
    name: "Paolo Minhas — Maths & Physics Tutor",
    description:
      "One-to-one Maths and Physics tuition for GCSE, A Level, Advanced Higher and 11+ entrance exams, online across the UK or in person in Edinburgh.",
    provider: {
      "@type": "Person",
      name: "Paolo Minhas",
      url: "https://paolo.org.uk",
    },
    areaServed: "GB",
    url: "https://tutor.paolo.org.uk",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tutoring levels",
      itemListElement: levels.map((level) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Course",
          name: `${level.name} Maths & Physics tutoring`,
          description: level.blurb,
        },
      })),
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[var(--tutor-ink-deep)] bg-graph-paper px-6 py-28 md:px-10 md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[var(--tutor-ink-deep)]/85" />
        <FloatingSymbols />

        <div className="relative mx-auto max-w-3xl text-center">
          <ScrollReveal on="load">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--tutor-amber)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[var(--tutor-ink)]">
              Now taking on students for this year
            </span>
          </ScrollReveal>

          <ScrollReveal on="load" delay={0.1}>
            <h1 className="mb-6 text-4xl font-black leading-[1.05] tracking-tight text-[var(--tutor-paper)] md:text-6xl">
              Maths &amp; Physics tuition that actually clicks.
            </h1>
          </ScrollReveal>

          <ScrollReveal on="load" delay={0.2}>
            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-[var(--tutor-paper)]/70">
              GCSE, A Level, Advanced Higher, and 11+ preparation — taught by
              a physics researcher who remembers exactly where it stops
              making sense.
            </p>
          </ScrollReveal>

          <ScrollReveal on="load" delay={0.3}>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--tutor-amber)] px-6 py-3.5 text-sm font-bold text-[var(--tutor-ink)] transition-transform hover:scale-[1.03]"
              >
                Book a free intro call <ArrowRight size={16} />
              </a>
              <a
                href="#subjects"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--tutor-paper)]/30 px-6 py-3.5 text-sm font-semibold text-[var(--tutor-paper)] transition-colors hover:border-[var(--tutor-amber)] hover:text-[var(--tutor-amber)]"
              >
                See subjects
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal on="load" delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wide text-[var(--tutor-paper)]/50">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={14} /> Edinburgh physics researcher
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video size={14} /> Online, UK-wide
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> In person in Edinburgh
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= SUBJECTS / LEVELS ================= */}
      <section id="subjects" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-12 max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--tutor-amber)]">
              Subjects &amp; levels
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--tutor-ink)] md:text-4xl">
              Maths and Physics, at the level that matters right now.
            </h2>
            <p className="text-[var(--tutor-ink)]/60">
              Tap a card for exam boards and what sessions actually cover.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map((level, i) => (
              <ScrollReveal key={level.key} delay={i * 0.08}>
                <LevelCard
                  level={level}
                  isOpen={!!openLevels[level.key]}
                  onToggle={() => toggleLevel(level.key)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= APPROACH ================= */}
      <section id="approach" className="bg-[var(--tutor-ink)] px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="mb-14 max-w-xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--tutor-amber)]">
              Approach
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--tutor-paper)] md:text-4xl">
              Why me, and how it runs.
            </h2>
            <p className="leading-relaxed text-[var(--tutor-paper)]/65">
              I&apos;m a Master&apos;s physics student at the University of
              Edinburgh, currently researching on the HIBEAM experiment at
              the European Spallation Source. I tutor the way I wish I&apos;d
              been tutored — starting from whatever&apos;s actually
              confusing, not working through a textbook in strict order.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {howItWorks.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.08}>
                <span className="mb-4 block text-4xl font-black text-[var(--tutor-amber)]">
                  0{i + 1}
                </span>
                <h3 className="mb-2 text-base font-bold text-[var(--tutor-paper)]">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--tutor-paper)]/60">{step.description}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {testimonials.map((t) => (
                <ScrollReveal key={t.name} className="rounded-2xl border-2 border-[var(--tutor-ink)]/10 bg-white p-6 text-left">
                  <p className="mb-4 text-sm leading-relaxed text-[var(--tutor-ink)]/75">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tutor-ink)]/45">
                    {t.name} · {t.context}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tutor-amber)]/15 text-[var(--tutor-ink)]">
                <MessageCircleHeart size={22} />
              </div>
              <h2 className="mt-4 mb-2 text-xl font-bold text-[var(--tutor-ink)]">
                Just getting started here.
              </h2>
              <p className="mx-auto max-w-sm text-sm text-[var(--tutor-ink)]/60">
                No reviews to show off yet — book the free intro call and be
                one of the first.
              </p>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="bg-white px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal className="mb-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--tutor-amber)]">
              FAQ
            </p>
            <h2 className="text-3xl font-black tracking-tight text-[var(--tutor-ink)] md:text-4xl">
              Questions parents actually ask.
            </h2>
          </ScrollReveal>

          <div className="flex flex-col divide-y divide-[var(--tutor-ink)]/10 border-y border-[var(--tutor-ink)]/10">
            {faqs.map((faq, i) => {
              const isOpen = openFAQ === i;
              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-semibold text-[var(--tutor-ink)]">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-[var(--tutor-ink)]/50 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm leading-relaxed text-[var(--tutor-ink)]/65">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CONTACT / BOOKING ================= */}
      <section id="contact" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--tutor-amber)]">
              Get in touch
            </p>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-[var(--tutor-ink)] md:text-4xl">
              Start with a free intro call.
            </h2>
            <p className="text-[var(--tutor-ink)]/60">
              Twenty minutes, no obligation — tell me the level and subject
              and I&apos;ll reply within a couple of days.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <TutorInquiryForm />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
