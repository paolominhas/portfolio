import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { caseStudy as cs } from "@/data/euco-ticketing-case-study";
import { getLiveStats } from "@/lib/case-study/live-stats";
import CaseStudyFrame from "@/components/case-study/CaseStudyFrame";
import Section from "@/components/case-study/Section";
import StatTiles from "@/components/case-study/StatTiles";
import ArchitectureDiagram from "@/components/case-study/ArchitectureDiagram";
import LifecycleStepper from "@/components/case-study/LifecycleStepper";
import QrSignatureLab from "@/components/case-study/QrSignatureLab";
import DoorSimulator from "@/components/case-study/DoorSimulator";
import FeeCalculator from "@/components/case-study/FeeCalculator";
import DecisionCards from "@/components/case-study/DecisionCards";
import HeroText from "@/components/web/HeroText";
import ScrollReveal from "@/components/web/ScrollReveal";
import WebsiteRequestForm from "@/components/web/WebsiteRequestForm";

// The live totals (if EUCO_API_URL is set) are re-read at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "EUCO Tickets: a case study",
  description:
    "How I built tickets.eu-co.co.uk, a standalone ticketing site for a student orchestra: Stripe payments, HMAC-signed QR tickets and an offline-capable door app. Try forging a ticket, or get someone in twice.",
  alternates: { canonical: "https://web.paolo.org.uk/portfolio/euco-tickets" },
  openGraph: {
    title: "EUCO Tickets: a case study",
    description: cs.tagline,
    url: "https://web.paolo.org.uk/portfolio/euco-tickets",
    type: "article",
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

export default async function EucoTicketsCaseStudy() {
  const live = await getLiveStats();
  const stats = cs.stats.map((s) => (live && s.liveKey ? { ...s, value: live[s.liveKey], live: true } : s));

  return (
    <CaseStudyFrame>
      <header>
        <p className="text-xs font-mono uppercase tracking-widest text-yellow mb-4">{cs.eyebrow}</p>
        <HeroText as="h1" text="EUCO Tickets." highlightWords={["Tickets."]} className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6" />
        <ScrollReveal on="load" delay={0.35}>
          <p className="text-xl text-white/80 max-w-3xl leading-relaxed mb-4">{cs.tagline}</p>
          <p className="text-sm text-white/55 max-w-3xl leading-relaxed mb-8 border-l-2 border-yellow/60 pl-4">{cs.scope}</p>
        </ScrollReveal>
        <dl className="grid sm:grid-cols-3 gap-4 mb-8 text-sm">
          {cs.meta.filter((m) => m.value).map((m) => (
            <div key={m.label}>
              <dt className="text-xs uppercase tracking-widest text-white/55 mb-1">{m.label}</dt>
              <dd className="text-white/80">{m.value}</dd>
            </div>
          ))}
        </dl>
        {cs.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {cs.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-full border-2 border-white/30 text-white hover:border-yellow hover:text-yellow transition-colors">
                {l.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        )}
        <StatTiles stats={stats} liveUpdatedAt={live?.updated_at} />
      </header>

      <nav aria-label="On this page" className="sticky top-16 z-20 -mx-6 md:-mx-10 px-6 md:px-10 py-3 mt-10 bg-navy/90 backdrop-blur border-y border-white/10 overflow-x-auto">
        <ul className="flex gap-5 text-sm whitespace-nowrap">
          {NAV.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} className="text-white/70 hover:text-yellow transition-colors">{label}</a></li>
          ))}
        </ul>
      </nav>

      <Section id="problem" eyebrow={cs.problem.eyebrow} title={cs.problem.title} intro={cs.problem.intro}>
        {cs.problem.personal && <p className="text-white/80 max-w-3xl mb-8 leading-relaxed">{cs.problem.personal}</p>}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/15 bg-navy-deep/50 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-rose-300 mb-4">Before</h3>
            <ul className="space-y-3 text-white/70 text-sm leading-relaxed list-disc pl-5">{cs.problem.before.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-yellow/40 bg-yellow/5 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-300 mb-4">After</h3>
            <ul className="space-y-3 text-white/85 text-sm leading-relaxed list-disc pl-5">{cs.problem.after.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section id="system" eyebrow={cs.system.eyebrow} title={cs.system.title} intro={cs.system.intro}><ArchitectureDiagram /></Section>
      <Section id="lifecycle" eyebrow={cs.lifecycle.eyebrow} title={cs.lifecycle.title} intro={cs.lifecycle.intro}><LifecycleStepper /></Section>
      <Section id="forge" eyebrow={cs.qrLab.eyebrow} title={cs.qrLab.title} intro={cs.qrLab.intro}><QrSignatureLab /></Section>
      <Section id="door" eyebrow={cs.door.eyebrow} title={cs.door.title} intro={cs.door.intro}><DoorSimulator /></Section>
      <Section id="pricing" eyebrow={cs.pricing.eyebrow} title={cs.pricing.title} intro={cs.pricing.intro}><FeeCalculator /></Section>
      <Section id="decisions" eyebrow={cs.decisions.eyebrow} title={cs.decisions.title}><DecisionCards /></Section>

      <Section id="lessons" eyebrow={cs.lessons.eyebrow} title={cs.lessons.title}>
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          <div className="rounded-2xl border border-white/15 bg-navy-deep/50 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-emerald-300 mb-4">I&apos;d do again</h3>
            <ul className="space-y-3 text-white/80 text-sm leading-relaxed list-disc pl-5">{cs.lessons.again.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-white/15 bg-navy-deep/50 p-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-amber-300 mb-4">I&apos;d change or add</h3>
            <ul className="space-y-3 text-white/80 text-sm leading-relaxed list-disc pl-5">{cs.lessons.change.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-12">
          {cs.stack.map((t) => <span key={t} className="text-[11px] font-mono uppercase tracking-wide text-white/70 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full">{t}</span>)}
        </div>
        <div className="rounded-3xl bg-navy-deep/60 border border-lilac/30 px-8 py-14 text-center">
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">Need something like this <span className="text-yellow">built?</span></h3>
          <p className="text-white/60 mb-8 max-w-md mx-auto">Tell me a bit about what you need and I&apos;ll reply within a couple of days.</p>
          <div className="flex justify-center"><WebsiteRequestForm /></div>
        </div>
      </Section>
    </CaseStudyFrame>
  );
}
