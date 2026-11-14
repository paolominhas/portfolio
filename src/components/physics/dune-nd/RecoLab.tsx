"use client";

import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import LinePlot from "./plot";
import { btn, Callout, COL, Seg, Slider, Widget } from "./ui";
import { STACK, stackValid } from "@/data/dune-nd";
import { E_B, LAB_DEFAULTS, makeSampler, matrix, runLab, slice, type LabOpts } from "@/lib/physics/ndReco";

const VALID = stackValid("LF");
const masked = (a: readonly number[]) => a.map((v, i) => (VALID[i] ? v : 0));
const QE_SPEC = masked(STACK.LF.QE);
const MEC_SPEC = masked(STACK.LF.MEC);
const sum = (a: readonly number[]) => a.reduce((x, y) => x + y, 0);
const MEC_SHARE = sum(MEC_SPEC) / (sum(QE_SPEC) + sum(MEC_SPEC)); // digitised: MEC / (CCQE + MEC), NDLAr FHC, readable bins only

const IDEAL: LabOpts = { ...LAB_DEFAULTS, pF: 0, resMu: 0, resP: 0, resTh: 0, mecFrac: 0, fsiProb: 0 };

function Heat({ m, nb, max, pick }: { m: Float64Array; nb: number; max: number; pick: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const wrap = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(420);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth || 420));
    ro.observe(el);
    setW(el.clientWidth || 420);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = Math.max(200, w);
    c.width = size * dpr;
    c.height = size * dpr;
    const g = c.getContext("2d");
    if (!g) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, size, size);
    const ml = 36, mb = 30, mt = 8, mr = 8;
    const iw = size - ml - mr, ih = size - mb - mt;
    g.fillStyle = "#06090f";
    g.fillRect(ml, mt, iw, ih);
    let mx = 0;
    for (let i = 0; i < m.length; i++) mx = Math.max(mx, m[i]);
    const cw = iw / nb, ch = ih / nb;
    for (let j = 0; j < nb; j++)
      for (let i = 0; i < nb; i++) {
        const v = m[j * nb + i];
        if (!v) continue;
        const t = Math.sqrt(v / mx);
        const r = Math.round(255 * Math.min(1, 0.15 + 1.6 * t));
        const gg = Math.round(255 * Math.max(0, Math.min(1, 1.6 * t - 0.35)));
        const bb = Math.round(255 * Math.max(0, Math.min(1, 2.6 * t - 1.6)) + 30 * (1 - t));
        g.fillStyle = `rgb(${r},${gg},${bb})`;
        g.fillRect(ml + i * cw, mt + ih - (j + 1) * ch, cw + 0.5, ch + 0.5);
      }
    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.setLineDash([5, 4]);
    g.beginPath();
    g.moveTo(ml, mt + ih);
    g.lineTo(ml + iw, mt);
    g.stroke();
    g.setLineDash([]);
    g.strokeStyle = "rgba(255,255,255,0.25)";
    g.strokeRect(ml, mt, iw, ih);
    g.fillStyle = "rgba(255,255,255,0.55)";
    g.font = "11px sans-serif";
    g.textAlign = "center";
    for (let t = 0; t <= max; t += 1) {
      const x = ml + (t / max) * iw;
      g.fillText(String(t), x, mt + ih + 14);
      g.textAlign = "right";
      g.fillText(String(t), ml - 5, mt + ih - (t / max) * ih + 4);
      g.textAlign = "center";
    }
    g.fillStyle = "rgba(255,255,255,0.65)";
    g.font = "12px sans-serif";
    g.fillText("true energy (GeV)", ml + iw / 2, size - 3);
    g.save();
    g.translate(11, mt + ih / 2);
    g.rotate(-Math.PI / 2);
    g.fillText(`${pick} (GeV)`, 0, 0);
    g.restore();
  }, [m, nb, max, w, pick]);
  return (
    <div ref={wrap} className="w-full min-w-0">
      <canvas ref={ref} style={{ width: "100%", aspectRatio: "1 / 1" }} role="img" aria-label="Reconstructed against true neutrino energy for the simulated toy events" />
    </div>
  );
}

export default function RecoLab() {
  const [o, setO] = useState<LabOpts>({ ...LAB_DEFAULTS, mecFrac: 0, fsiProb: 0 });
  const [N, setN] = useState(20000);
  const [pick, setPick] = useState<"qe" | "cons">("qe");
  const [lo, setLo] = useState(1.5);
  const set = <K extends keyof LabOpts>(k: K) => (v: number) => setO((p) => ({ ...p, [k]: v }));
  const od = useDeferredValue(o);
  const Nd = useDeferredValue(N);

  const sampler = useMemo(() => makeSampler(QE_SPEC, MEC_SPEC), []);
  const ev = useMemo(() => runLab(Nd, od, sampler), [Nd, od, sampler]);
  const mat = useMemo(() => matrix(ev, pick, 60, 6), [ev, pick]);
  const hi = lo + 1;
  const st = useMemo(() => slice(ev, pick, lo, hi), [ev, pick, lo, hi]);
  const other = useMemo(() => slice(ev, pick === "qe" ? "cons" : "qe", lo, hi), [ev, pick, lo, hi]);

  const spec = useMemo(() => {
    const nb = 48, w = 0.125;
    const t = new Array(nb + 1).fill(0), r = new Array(nb + 1).fill(0), c = new Array(nb + 1).fill(0);
    for (const e of ev) {
      const a = Math.floor(e.Et / w), b = Math.floor(e.qe / w), d = Math.floor(e.cons / w);
      if (a < nb) t[a]++;
      if (b < nb) r[b]++;
      if (d < nb) c[d]++;
    }
    const x = Array.from({ length: nb + 1 }, (_, i) => i * w);
    return { x, t, r, c };
  }, [ev]);
  const ymax = Math.max(...spec.t, ...spec.r, ...spec.c) * 1.1;

  const preset = (p: "ideal" | "nucleus" | "detector" | "mec" | "fsi" | "eb" | "all") => {
    if (p === "ideal") setO(IDEAL);
    if (p === "nucleus") setO({ ...IDEAL, pF: 0.24 });
    if (p === "detector") setO({ ...IDEAL, pF: 0.24, resMu: 0.05, resP: 0.1, resTh: 0.01 });
    if (p === "mec") setO({ ...LAB_DEFAULTS, mecFrac: MEC_SHARE });
    if (p === "fsi") setO({ ...LAB_DEFAULTS, fsiProb: 0.4 });
    if (p === "eb") setO({ ...LAB_DEFAULTS, EbAssumed: 0.0 });
    if (p === "all") setO({ ...LAB_DEFAULTS, mecFrac: MEC_SHARE, fsiProb: 0.4 });
  };
  const pct = (v: number) => `${((v - 1) * 100).toFixed(1)}%`;
  const label = pick === "qe" ? "QE formula (muon only)" : "energy conservation (muon + proton)";

  return (
    <Widget eyebrow="Interactive · toy model on the project’s own formulas" title="Why reconstructed energy goes wrong">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        The two reconstruction formulas below are the ones in <span className="font-mono text-white/75">RecoMethods.C</span> and <span className="font-mono text-white/75">SmearMatrix.C</span>, with the same hard-coded constants. The events are mine, not GENIE’s: a quasi-elastic scatter off a Fermi-gas nucleon, with true energies drawn from the CCQE and MEC layers digitised from my stacked plot. Switch each real-world effect on, one at a time, and watch what it does.
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        <button className={btn} onClick={() => preset("ideal")}>1 · Ideal: nothing switched on</button>
        <button className={btn} onClick={() => preset("nucleus")}>2 · + a moving nucleon</button>
        <button className={btn} onClick={() => preset("detector")}>3 · + detector resolution</button>
        <button className={btn} onClick={() => preset("mec")}>+ 2p2h events</button>
        <button className={btn} onClick={() => preset("fsi")}>+ a hidden neutron</button>
        <button className={btn} onClick={() => preset("eb")}>Wrong binding energy</button>
        <button className={btn} onClick={() => preset("all")}>Everything</button>
      </div>
      <div className="grid lg:grid-cols-[19rem_1fr] gap-8">
        <div className="space-y-5">
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-white/40">The nucleus</p>
            <Slider label="Fermi momentum" value={o.pF} min={0} max={0.35} step={0.01} onChange={set("pF")} format={(v) => (v === 0 ? "0 (at rest)" : `${(v * 1000).toFixed(0)} MeV/c`)} hint="The formulas assume the struck neutron is at rest." />
            <Slider label="True removal energy" value={o.EbTrue} min={0} max={0.06} step={0.002} onChange={set("EbTrue")} format={(v) => `${(v * 1000).toFixed(0)} MeV`} />
            <Slider label="Assumed in the formulas" value={o.EbAssumed} min={0} max={0.06} step={0.002} onChange={set("EbAssumed")} format={(v) => `${(v * 1000).toFixed(0)} MeV`} hint={`The macros fix this at ${E_B * 1000} MeV.`} />
          </div>
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-white/40">The detector (assumed, not the ND’s)</p>
            <Slider label="Muon energy resolution" value={o.resMu} min={0} max={0.2} step={0.005} onChange={set("resMu")} format={(v) => `${(v * 100).toFixed(1)}%`} />
            <Slider label="Proton energy resolution" value={o.resP} min={0} max={0.3} step={0.005} onChange={set("resP")} format={(v) => `${(v * 100).toFixed(1)}%`} />
            <Slider label="Muon angle resolution" value={o.resTh * 1000} min={0} max={50} step={1} onChange={(v) => set("resTh")(v / 1000)} format={(v) => `${v.toFixed(0)} mrad`} />
          </div>
          <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-wider text-white/40">Physics the detector cannot see</p>
            <Slider label="2p2h (MEC) share" value={o.mecFrac} min={0} max={0.5} step={0.01} onChange={set("mecFrac")} format={(v) => `${(v * 100).toFixed(0)}%`} hint={`Digitised NDLAr plot: ${(MEC_SHARE * 100).toFixed(0)}% of CCQE + MEC.`} />
            <Slider label="2p2h energy shift" value={o.mecShift} min={0} max={0.4} step={0.01} onChange={set("mecShift")} format={(v) => `${(v * 1000).toFixed(0)} MeV`} hint="How much lower a 2p2h event looks. My assumption." />
            <Slider label="Chance a neutron carries energy off" value={o.fsiProb} min={0} max={1} step={0.05} onChange={set("fsiProb")} format={(v) => `${(v * 100).toFixed(0)}%`} />
            <Slider label="Mean energy it takes" value={o.fsiMean} min={0.02} max={0.4} step={0.01} onChange={set("fsiMean")} format={(v) => `${(v * 1000).toFixed(0)} MeV`} />
          </div>
          <Slider label="Simulated events" value={N} min={4000} max={40000} step={2000} onChange={setN} format={(v) => v.toLocaleString("en-GB")} />
        </div>

        <div className="min-w-0 space-y-6">
          <Seg label="Reconstruct with" value={pick} onChange={setPick} options={[["qe", "QE formula"], ["cons", "Energy conservation"]]} />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="min-w-0">
              <p className="text-sm text-white/70 mb-2">Smearing matrix · <span className="text-white/90">{label}</span></p>
              <Heat m={mat.m} nb={mat.nb} max={mat.max} pick={pick === "qe" ? "reco, QE formula" : "reco, conservation"} />
              <p className="text-[11px] text-white/35 mt-1">Dashed line: reconstructed = true. Brightness is the square root of the count.</p>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/70 mb-2">The spectra, as in Figure 18</p>
              <LinePlot
                ariaLabel="True and reconstructed neutrino energy spectra for the toy events"
                series={[
                  { x: spec.x, y: spec.t, color: COL.white, step: true, width: 2, label: "true" },
                  { x: spec.x, y: spec.r, color: COL.sky, step: true, dash: "5 3", width: 1.6, label: "QE formula" },
                  { x: spec.x, y: spec.c, color: COL.ember, step: true, dash: "2 3", width: 1.6, label: "conservation" },
                ]}
                xDomain={[0, 6]}
                yDomain={[0, ymax]}
                xLabel="energy (GeV)"
                yLabel="events"
                height={250}
                interactive={false}
              />
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-end mb-3">
              <Slider label="Look at events with true energy from…" value={lo} min={0.5} max={4} step={0.5} onChange={setLo} format={(v) => `${v.toFixed(1)} to ${(v + 1).toFixed(1)} GeV`} />
              <p className="text-xs text-white/40">{st ? `${st.n.toLocaleString("en-GB")} events` : "too few events"}</p>
            </div>
            {st && other ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <Mini label="median reco / true" v={st.median.toFixed(3)} sub={pct(st.median)} />
                <Mini label="spread (16–84%)" v={`${st.lo.toFixed(2)}–${st.hi.toFixed(2)}`} sub="of the true value" />
                <Mini label="reconstructed < 80%" v={`${(st.below80 * 100).toFixed(1)}%`} sub="of events" />
                <Mini label={pick === "qe" ? "conservation median" : "QE-formula median"} v={other.median.toFixed(3)} sub={pct(other.median)} />
              </div>
            ) : (
              <p className="text-sm text-white/45">Not enough events in this window.</p>
            )}
          </div>
        </div>
      </div>
      <Callout tone="warn" title="What this is and is not">
        <p>
          It is a way to see which mechanisms bend a reconstructed spectrum, and in which direction. It is not the near-detector simulation: there is no final-state-interaction model, no pion or resonance physics, no detector acceptance, and the resolutions are made up. The 2p2h treatment is crude (a 2p2h event is generated as a quasi-elastic one a little lower in energy). Treat the sizes as illustrations and the directions as the lesson.
        </p>
      </Callout>
    </Widget>
  );
}

function Mini({ label, v, sub }: { label: string; v: string; sub: string }) {
  return (
    <div className="rounded-lg border border-white/10 px-2 py-3">
      <p className="font-bodoni text-xl text-white">{v}</p>
      <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">{label}</p>
      <p className="text-[11px] font-mono text-[var(--accent)]/80">{sub}</p>
    </div>
  );
}
