"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * HIGHLIGHT PREVIEWS
 * ─────────────────────────────────────────────────────────────────
 * Small, genuinely interactive recreations of two real client sites
 * (EUCO, Diorama Consulting) for the "Past highlights" section —
 * deliberately *not* screenshots. Each is a tiny multi-tab mini-site
 * inside a fake browser chrome: clicking a tab actually swaps the
 * content pane (AnimatePresence crossfade), so it reads as a small
 * working thing rather than a static image.
 *
 * These are bespoke, hand-built impressions of each project's real
 * identity (palette, tone, core flows) rather than pixel-accurate
 * clones — there's no shared "MiniSitePreview(props)" abstraction on
 * purpose, since genericising two one-off brand recreations just
 * pushes their differences into a pile of color props. Two small,
 * separately-styled components is the more honest shape here.
 */

// ---------------------------------------------------------------------------
// EUCO — Edinburgh University Chamber Orchestra
// Deep burgundy / cream / gold — a classical concert-programme feel.
// ---------------------------------------------------------------------------

type EucoTab = "home" | "concerts" | "tickets";

export function EucoPreview() {
  const [tab, setTab] = useState<EucoTab>("home");

  const tabs: { id: EucoTab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "concerts", label: "Concerts" },
    { id: "tickets", label: "Tickets" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-navy/10 bg-white shadow-[0_20px_60px_rgba(16,21,133,0.12)]">
      <div className="flex items-center gap-2 bg-[#4A1420] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-white/10 px-3 py-1 text-center font-mono text-[10px] text-white/50">
          eu-co.co.uk
        </span>
      </div>

      <div className="flex gap-1 bg-[#4A1420] px-3 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`rounded-t-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              tab === t.id ? "bg-white text-[#6B1E2B]" : "text-white/50 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-b from-[#6B1E2B] to-[#4A1420] px-6 py-9 text-center"
            >
              <p className="mb-2 font-serif text-[10px] uppercase tracking-[0.3em] text-[#E8C97A]">
                Est. 1968
              </p>
              <h4 className="mb-2 font-serif text-xl font-bold text-[#FAF3E7]">
                Edinburgh University
                <br />
                Chamber Orchestra
              </h4>
              <p className="mb-5 text-xs text-[#FAF3E7]/60">Autumn season now on sale</p>
              <span className="inline-block rounded-full bg-[#E8C97A] px-4 py-1.5 text-[11px] font-semibold text-[#4A1420]">
                View concerts
              </span>
            </motion.div>
          )}

          {tab === "concerts" && (
            <motion.div
              key="concerts"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 px-5 py-6"
            >
              {[
                { date: "14 Nov", title: "Brahms & Sibelius", venue: "Reid Concert Hall" },
                { date: "6 Dec", title: "Winter Gala", venue: "St Cecilia's Hall" },
              ].map((c) => (
                <div
                  key={c.title}
                  className="flex items-center justify-between rounded-lg border border-[#6B1E2B]/15 px-3 py-2.5"
                >
                  <div>
                    <p className="text-xs font-bold text-[#4A1420]">{c.title}</p>
                    <p className="text-[10px] text-[#4A1420]/50">{c.venue}</p>
                  </div>
                  <span className="rounded-full bg-[#F5E6D3] px-2 py-1 font-mono text-[10px] text-[#6B1E2B]">
                    {c.date}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {tab === "tickets" && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="px-5 py-6"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#4A1420]/50">
                Brahms &amp; Sibelius
              </p>
              <div className="space-y-2">
                {[
                  { tier: "Standard", price: "£12" },
                  { tier: "Student", price: "£6" },
                  { tier: "Season pass", price: "£40" },
                ].map((t) => (
                  <div
                    key={t.tier}
                    className="flex items-center justify-between rounded-lg bg-[#F5E6D3] px-3 py-2 text-xs"
                  >
                    <span className="text-[#4A1420]">{t.tier}</span>
                    <span className="font-mono font-bold text-[#6B1E2B]">{t.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-full bg-[#6B1E2B] py-2.5 text-center text-xs font-bold text-[#FAF3E7]">
                Book now
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Diorama Consulting — AI advisory
// Slate / white / cyan — cool, tech-forward, consulting-firm register.
// ---------------------------------------------------------------------------

type DioramaTab = "home" | "services" | "cases";

export function DioramaPreview() {
  const [tab, setTab] = useState<DioramaTab>("home");

  const tabs: { id: DioramaTab; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "cases", label: "Case studies" },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-navy/10 bg-white shadow-[0_20px_60px_rgba(16,21,133,0.12)]">
      <div className="flex items-center gap-2 bg-[#0F172A] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 flex-1 truncate rounded-full bg-white/10 px-3 py-1 text-center font-mono text-[10px] text-white/50">
          dioramaconsulting.co.uk
        </span>
      </div>

      <div className="flex gap-1 bg-[#0F172A] px-3 pt-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-pressed={tab === t.id}
            className={`rounded-t-md px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              tab === t.id ? "bg-white text-[#0F172A]" : "text-white/50 hover:text-white/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0F172A] px-6 py-9"
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#22D3EE]">
                AI Advisory
              </p>
              <h4 className="mb-3 text-lg font-black leading-snug text-white">
                Strategy that survives contact with your stack.
              </h4>
              <p className="mb-5 text-xs text-white/45">Diorama Consulting</p>
              <span className="inline-block rounded-md bg-[#22D3EE] px-4 py-1.5 text-[11px] font-semibold text-[#0F172A]">
                Book a call
              </span>
            </motion.div>
          )}

          {tab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-2.5 px-5 py-6"
            >
              {["AI strategy & readiness", "Implementation & tooling", "Team training"].map(
                (s) => (
                  <div
                    key={s}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2.5 text-xs text-slate-700"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" />
                    {s}
                  </div>
                ),
              )}
            </motion.div>
          )}

          {tab === "cases" && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 px-5 py-6"
            >
              {[
                { name: "Fintech ops", result: "−38% manual review time" },
                { name: "Retail support", result: "3× ticket throughput" },
              ].map((cs) => (
                <div key={cs.name} className="rounded-lg border border-slate-200 px-3 py-2.5">
                  <p className="text-xs font-bold text-slate-800">{cs.name}</p>
                  <p className="text-[10px] text-slate-500">{cs.result}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
