"use client";

import { useDeferredValue, useState } from "react";
import {
  REFERENCE_CASE,
  bsPrice,
  type OptionKind,
  type OptionParams,
} from "@/lib/physics/options";
import BumpingPanel from "./BumpingPanel";
import GreeksPanel from "./GreeksPanel";
import MonteCarloPanel from "./MonteCarloPanel";
import ValuePanel from "./ValuePanel";
import { Card, Segmented, Slider, Sym, TabPanel, Tabs, fmt } from "./ui";

type TabId = "value" | "greeks" | "mc" | "bump";

const TABS: { id: TabId; label: string }[] = [
  { id: "value", label: "Value & payoff" },
  { id: "greeks", label: "Greeks" },
  { id: "mc", label: "Monte Carlo" },
  { id: "bump", label: "Greeks by bumping" },
];

const PRESETS: { id: string; label: string; p: OptionParams }[] = [
  { id: "ref", label: "Reference case", p: REFERENCE_CASE },
  {
    id: "above",
    label: "Spot above strike",
    p: { ...REFERENCE_CASE, s0: 120 },
  },
  { id: "below", label: "Spot below strike", p: { ...REFERENCE_CASE, s0: 80 } },
  { id: "vol", label: "High volatility", p: { ...REFERENCE_CASE, sigma: 0.6 } },
  { id: "near", label: "Near expiry", p: { ...REFERENCE_CASE, t: 0.1 } },
  { id: "div", label: "Dividend payer", p: { ...REFERENCE_CASE, q: 0.04 } },
];

const sameParams = (a: OptionParams, b: OptionParams) =>
  a.s0 === b.s0 &&
  a.k === b.k &&
  a.r === b.r &&
  a.sigma === b.sigma &&
  a.t === b.t &&
  a.q === b.q;

const PREFIX = "op";

export default function Playground() {
  const [kind, setKind] = useState<OptionKind>("call");
  const [params, setParams] = useState<OptionParams>(REFERENCE_CASE);
  const [tab, setTab] = useState<TabId>("value");

  // Panels read the deferred copy so dragging a slider stays smooth while the heavier
  // Monte Carlo panels catch up.
  const live = useDeferredValue(params);
  const set = (patch: Partial<OptionParams>) =>
    setParams((prev) => ({ ...prev, ...patch }));

  const isReference = sameParams(params, REFERENCE_CASE);
  const price = bsPrice(live, kind);

  return (
    <div>
      {/* Small screens: keep the price in view while the sliders are being dragged. */}
      <div
        aria-hidden
        className="sticky top-20 z-20 mb-4 flex items-baseline justify-between rounded-xl border border-white/10 bg-abyss/90 px-4 py-2 backdrop-blur lg:hidden"
      >
        <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">
          Black–Scholes {kind} price
        </span>
        <span className="font-mono text-lg tabular-nums text-[var(--accent)]">
          {fmt(price, 4)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* ───── controls ───── */}
        <aside
          aria-label="Option inputs"
          className="space-y-5 self-start rounded-2xl border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-24"
        >
          <Segmented
            ariaLabel="Option type"
            value={kind}
            onChange={setKind}
            options={[
              { id: "call", label: "Call" },
              { id: "put", label: "Put" },
            ]}
          />

          <div>
            <div className="mb-2 text-xs font-mono uppercase tracking-wider text-white/50">
              Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((pr) => {
                const active = sameParams(params, pr.p);
                return (
                  <button
                    key={pr.id}
                    type="button"
                    onClick={() => setParams(pr.p)}
                    aria-pressed={active}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      active
                        ? "border-[var(--accent-border)] bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "border-white/10 text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {pr.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Slider
            label={
              <>
                Spot price <Sym>S</Sym>
              </>
            }
            value={params.s0}
            min={40}
            max={160}
            step={1}
            onChange={(v) => set({ s0: v })}
            display={fmt(params.s0, 0)}
          />
          <Slider
            label={
              <>
                Strike <Sym>K</Sym>
              </>
            }
            value={params.k}
            min={40}
            max={160}
            step={1}
            onChange={(v) => set({ k: v })}
            display={fmt(params.k, 0)}
          />
          <Slider
            label={
              <>
                Volatility <Sym>σ</Sym>
              </>
            }
            value={params.sigma}
            min={0.05}
            max={1}
            step={0.01}
            onChange={(v) => set({ sigma: v })}
            display={`${fmt(params.sigma * 100, 0)}%`}
            hint="Annualised."
          />
          <Slider
            label={
              <>
                Time to expiry <Sym>T</Sym>
              </>
            }
            value={params.t}
            min={0.05}
            max={3}
            step={0.05}
            onChange={(v) => set({ t: v })}
            display={`${fmt(params.t, 2)} years`}
          />
          <Slider
            label={
              <>
                Interest rate <Sym>r</Sym>
              </>
            }
            value={params.r}
            min={-0.02}
            max={0.15}
            step={0.0025}
            onChange={(v) => set({ r: v })}
            display={`${fmt(params.r * 100, 2)}%`}
          />
          <Slider
            label={
              <>
                Dividend yield <Sym>q</Sym>
              </>
            }
            value={params.q}
            min={0}
            max={0.08}
            step={0.0025}
            onChange={(v) => set({ q: v })}
            display={`${fmt(params.q * 100, 2)}%`}
          />
        </aside>

        {/* ───── outputs ───── */}
        <div className="min-w-0">
          <Card className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-white/40">
                Black–Scholes price of the {kind}
              </div>
              <div className="mt-1 font-mono text-3xl tabular-nums text-[var(--accent)]">
                {fmt(price, 4)}
              </div>
            </div>
            <p className="max-w-md text-xs leading-snug text-white/40">
              {isReference
                ? "These are the inputs behind the Python results table further down (S = K = 100, r = 5%, σ = 20%, T = 1 year). The closed-form numbers here should match it, and the Monte Carlo ones should agree within their standard errors."
                : "Change the inputs on the left and every panel below updates. The Reference case preset returns to the inputs used in the Python results table."}
            </p>
          </Card>

          <Tabs
            tabs={TABS}
            value={tab}
            onChange={setTab}
            idPrefix={PREFIX}
            ariaLabel="Playground views"
          />

          <TabPanel idPrefix={PREFIX} id={tab}>
            {tab === "value" && <ValuePanel p={live} kind={kind} />}
            {tab === "greeks" && <GreeksPanel p={live} kind={kind} />}
            {tab === "mc" && <MonteCarloPanel p={live} kind={kind} />}
            {tab === "bump" && <BumpingPanel p={live} kind={kind} />}
          </TabPanel>
        </div>
      </div>
    </div>
  );
}
