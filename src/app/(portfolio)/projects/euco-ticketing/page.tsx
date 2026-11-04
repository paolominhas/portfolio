import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { caseStudy as cs } from "@/data/euco-ticketing-case-study";
import { getLiveStats } from "@/lib/case-study/live-stats";
import Section from "@/components/case-study/Section";
import StatTiles from "@/components/case-study/StatTiles";
import ArchitectureDiagram from "@/components/case-study/ArchitectureDiagram";
import LifecycleStepper from "@/components/case-study/LifecycleStepper";
import QrSignatureLab from "@/components/case-study/QrSignatureLab";
import DoorSimulator from "@/components/case-study/DoorSimulator";
import FeeCalculator from "@/components/case-study/FeeCalculator";
import DecisionCards from "@/components/case-study/DecisionCards";

// The live totals (if EUCO_API_URL is set) are re-read at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "EUCO Tickets: a case study",
  description:
    "How I built ticketing for a student orchestra: Stripe payments, HMAC-signed QR tickets and an offline-capable door app. Try forging a ticket, or get someone in twice.",
  alternates: { canonical: "/projects/euco-ticketing" },
  openGraph: {
    title: "EUCO Tickets: a case study",
    description: cs.tagline,
    url: "/projects/euco-ticketing",
    type: "article",
    images: ["/images/root-project-thumbnail.jpg"],
  },
};

const NAV = [
  ["problem", "Problem"],
  ["system", "System"],
  ["lifecycle", "Life of a ticket"],
  ["forge", "Forge a ticket"],
  ["door", "The door"],
  ["pricing", "Pricing"],
  ["decisions", "Decisions"],
  ["lessons", "Lessons"],
] as const;

export default async function EucoTicketingCaseStudy() {
  const live = await getLiveStats();
  const stats = cs.stats.map((s) => (live && s.liveKey ? { ...s, value: live[s.liveKey], live: true } : s));

  return (
    <article className="pt-32 px-6 md:px-20 max-w-6xl mx-auto pb-24">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-10">
        <ArrowLeft size={14} /> All projects
      </Link>

      {/* Hero */}
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-4">{cs.eyebrow}</p>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">{cs.title}</h1>
        <p className="text-xl text-zinc-300 max-w-3xl leading-relaxed mb-8">{cs.tagline}</p>
        <dl className="grid sm:grid-cols-3 gap-4 mb-8 text-sm">
          {cs.meta.filter((m) => m.value).map((m) => (
            <div key={m.label}>
              <dt className="text-xs uppercase tracking-widest text-zinc-500 mb-1">{m.label}</dt>
              <dd className="text-zinc-300">{m.value}</dd>
            </div>
          ))}
        </dl>
        {cs.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {cs.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-lg border border-white/15 text-zinc-200 hover:border-indigo-400/60 hover:text-white transition-colors">
                {l.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        )}
        <StatTiles stats={stats} liveUpdatedAt={live?.updated_at} />
      </header>

      <nav aria-label="On this page" className="sticky top-16 z-20 -mx-6 md:-mx-20 px-6 md:px-20 py-3 mt-10 bg-zinc-950/80 backdrop-blur border-y border-white/5 overflow-x-auto">
        <ul className="flex gap-5 text-sm whitespace-nowrap">
          {NAV.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} className="text-zinc-400 hover:text-white transition-colors">{label}</a></li>
          ))}
        </ul>
      </nav>

      {/* 01 Problem */}
      <Section id="problem" eyebrow={cs.problem.eyebrow} title={cs.problem.title} intro={cs.problem.intro}>
        {cs.problem.personal && <p className="text-zinc-300 max-w-3xl mb-8 leading-relaxed">{cs.problem.personal}</p>}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-rose-400 mb-4">Before</h3>
            <ul className="space-y-3 text-zinc-400 text-sm leading-relaxed list-disc pl-5">{cs.problem.before.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-indigo-400/30 bg-indigo-500/5 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">After</h3>
            <ul className="space-y-3 text-zinc-300 text-sm leading-relaxed list-disc pl-5">{cs.problem.after.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section id="system" eyebrow={cs.system.eyebrow} title={cs.system.title} intro={cs.system.intro}>
        <ArchitectureDiagram />
      </Section>

      <Section id="lifecycle" eyebrow={cs.lifecycle.eyebrow} title={cs.lifecycle.title} intro={cs.lifecycle.intro}>
        <LifecycleStepper />
      </Section>

      <Section id="forge" eyebrow={cs.qrLab.eyebrow} title={cs.qrLab.title} intro={cs.qrLab.intro}>
        <QrSignatureLab />
      </Section>

      <Section id="door" eyebrow={cs.door.eyebrow} title={cs.door.title} intro={cs.door.intro}>
        <DoorSimulator />
      </Section>

      <Section id="pricing" eyebrow={cs.pricing.eyebrow} title={cs.pricing.title} intro={cs.pricing.intro}>
        <FeeCalculator />
      </Section>

      <Section id="decisions" eyebrow={cs.decisions.eyebrow} title={cs.decisions.title}>
        <DecisionCards />
      </Section>

      <Section id="lessons" eyebrow={cs.lessons.eyebrow} title={cs.lessons.title}>
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-4">I&apos;d do again</h3>
            <ul className="space-y-3 text-zinc-300 text-sm leading-relaxed list-disc pl-5">{cs.lessons.again.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">I&apos;d change or add</h3>
            <ul className="space-y-3 text-zinc-300 text-sm leading-relaxed list-disc pl-5">{cs.lessons.change.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-12">
          {cs.stack.map((t) => <span key={t} className="text-xs font-mono text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">{t}</span>)}
        </div>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Running a society that needs something like this?</h3>
          <p className="text-zinc-400 mb-5">I&apos;m happy to talk through what worked and what I&apos;d skip.</p>
          <Link href="/contact" className="inline-flex items-center gap-1 px-5 py-2.5 rounded-lg bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </Section>
    </article>
  );
}
