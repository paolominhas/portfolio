"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Widget, Callout, btn, btnOn } from "./ui";
import { MAX_TREES, punziCurve, trainToy, type ToyModel } from "@/lib/physics/toyBdt";

/**
 * A live toy boosted-decision-tree. Invented data, not the LHCb sample.
 * It shows two things from the notes: (1) too many deep trees overtrain,
 * (2) a variable that gives the simulation away makes the Punzi plot spike near 1.
 */

const W = 640;
const H = 170;
const pad = { l: 40, r: 12, t: 12, b: 28 };

function Axis({ x0, x1, y0, y1, xl, yl }: { x0: number; x1: number; y0: number | string; y1: number | string; xl: string; yl: string }) {
  return (
    <g fontSize={10} fill="rgba(255,255,255,0.45)">
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="rgba(255,255,255,0.25)" />
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke="rgba(255,255,255,0.25)" />
      <text x={pad.l} y={H - 12}>{x0}</text>
      <text x={W - pad.r} y={H - 12} textAnchor="end">{x1}</text>
      <text x={(pad.l + W - pad.r) / 2} y={H - 2} textAnchor="middle">{xl}</text>
      <text x={pad.l - 4} y={H - pad.b} textAnchor="end">{y0}</text>
      <text x={pad.l - 4} y={pad.t + 8} textAnchor="end">{y1}</text>
      <text x={6} y={pad.t + 40} transform={`rotate(-90 6 ${pad.t + 40})`}>{yl}</text>
    </g>
  );
}

export default function BdtLab() {
  const [trees, setTrees] = useState(60);
  const [depth, setDepth] = useState(2);
  const [lr, setLr] = useState(0.1);
  const [leak, setLeak] = useState(false);
  const [nSigma, setNSigma] = useState(5);
  const [model, setModel] = useState<ToyModel | null>(null);
  const [busy, setBusy] = useState(true);
  const token = useRef(0);

  useEffect(() => {
    const my = ++token.current;
    setBusy(true);
    const t = setTimeout(() => {
      const m = trainToy({ leak, depth, lr });
      if (my === token.current) {
        setModel(m);
        setBusy(false);
      }
    }, 30);
    return () => clearTimeout(t);
  }, [leak, depth, lr]);

  const view = useMemo(() => {
    if (!model) return null;
    const prob = model.testProb(trees);
    const pun = punziCurve(prob, model.yTest, nSigma, 20000);
    // score histograms (test set)
    const bins = 25;
    const hs = new Array(bins).fill(0);
    const hb = new Array(bins).fill(0);
    for (let i = 0; i < prob.length; i++) {
      const b = Math.min(bins - 1, Math.floor(prob[i] * bins));
      (model.yTest[i] === 1 ? hs : hb)[b]++;
    }
    return { pun, hs, hb, bins };
  }, [model, trees, nSigma]);

  const preset = (t: number, d: number, l: number, k: boolean) => {
    setTrees(t);
    setDepth(d);
    setLr(l);
    setLeak(k);
  };

  const gx = (v: number, a: number, b: number) => pad.l + ((v - a) / (b - a)) * (W - pad.l - pad.r);
  const gy = (v: number, a: number, b: number) => H - pad.b - ((v - a) / (b - a)) * (H - pad.t - pad.b);

  return (
    <Widget title="Train a boosted decision tree yourself">
      <p className="text-sm text-white/55 mb-4">
        A small gradient-boosted tree model, running in your browser on invented data with seven variables (three weakly informative, four noise). It is a toy: it does not reproduce the LHCb numbers, but it behaves the way my real model did.
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        <button className={btn} onClick={() => preset(60, 2, 0.1, false)}>Sensible settings</button>
        <button className={btn} onClick={() => preset(200, 6, 0.3, false)}>Overtrained settings</button>
        <button className={btn} onClick={() => preset(100, 3, 0.1, true)}>Simulation gives itself away</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-4 text-sm text-white/70">
        <label className="flex items-center gap-3">
          <span className="w-28 shrink-0">Trees <strong className="text-white">{trees}</strong></span>
          <input type="range" min={1} max={MAX_TREES} value={trees} onChange={(e) => setTrees(+e.target.value)} className="accent-[#FF6B3D] w-full" aria-label="Number of trees" />
        </label>
        <label className="flex items-center gap-3">
          <span className="w-28 shrink-0">Depth <strong className="text-white">{depth}</strong></span>
          <input type="range" min={1} max={6} value={depth} onChange={(e) => setDepth(+e.target.value)} className="accent-[#FF6B3D] w-full" aria-label="Maximum tree depth" />
        </label>
        <label className="flex items-center gap-3">
          <span className="w-28 shrink-0">Learning rate <strong className="text-white">{lr}</strong></span>
          <input type="range" min={0.02} max={0.5} step={0.01} value={lr} onChange={(e) => setLr(+e.target.value)} className="accent-[#FF6B3D] w-full" aria-label="Learning rate" />
        </label>
        <label className="flex items-center gap-3">
          <span className="w-28 shrink-0">n<sub>σ</sub> in Punzi <strong className="text-white">{nSigma}</strong></span>
          <input type="range" min={1} max={7} step={1} value={nSigma} onChange={(e) => setNSigma(+e.target.value)} className="accent-[#FF6B3D] w-full" aria-label="Number of sigma in the Punzi figure of merit" />
        </label>
        <label className="flex items-center gap-3 sm:col-span-2 cursor-pointer">
          <input type="checkbox" checked={leak} onChange={(e) => setLeak(e.target.checked)} className="accent-[#FF6B3D] w-4 h-4" />
          <span>Make the simulated signal differ from data in one extra variable (the 23 Jul bug)</span>
        </label>
      </div>

      <div className={`transition-opacity ${busy ? "opacity-40" : ""}`} aria-busy={busy}>
        {!model || !view ? (
          <p className="text-white/50 py-10 text-center">Training the model…</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center">
              {[
                ["Train AUC", model.aucTrain[trees].toFixed(3)],
                ["Test AUC", model.aucTest[trees].toFixed(3)],
                ["Gap", (model.aucTrain[trees] - model.aucTest[trees]).toFixed(3)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-white/10 p-3">
                  <div className="text-xs uppercase tracking-wider text-white/40">{k}</div>
                  <div className="font-bodoni text-2xl text-white">{v}</div>
                </div>
              ))}
            </div>

            <p className="text-xs text-white/50 mb-1">AUC as trees are added (green: training events, orange: events the model never saw)</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-abyss border border-white/10" role="img" aria-label="Training and test AUC against number of trees">
              <Axis x0={0} x1={MAX_TREES} y0={0.5} y1={1} xl="trees" yl="AUC" />
              <polyline fill="none" stroke="#2F9E7C" strokeWidth={2} points={model.aucTrain.map((v, k) => `${gx(k, 0, MAX_TREES)},${gy(v, 0.5, 1)}`).join(" ")} />
              <polyline fill="none" stroke="#FF8A5C" strokeWidth={2} points={model.aucTest.map((v, k) => `${gx(k, 0, MAX_TREES)},${gy(v, 0.5, 1)}`).join(" ")} />
              <line x1={gx(trees, 0, MAX_TREES)} x2={gx(trees, 0, MAX_TREES)} y1={pad.t} y2={H - pad.b} stroke="#fff" strokeDasharray="3 4" opacity={0.6} />
            </svg>

            <div className="grid gap-4 md:grid-cols-2 mt-5">
              <div>
                <p className="text-xs text-white/50 mb-1">Model score on test events (blue: background, orange: signal)</p>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-abyss border border-white/10" role="img" aria-label="Score histogram for signal and background">
                  <Axis x0={0} x1={1} y0={0} y1="" xl="BDT score" yl="events" />
                  {view.hb.map((c, b) => {
                    const mx = Math.max(...view.hb, ...view.hs, 1);
                    const bw = (W - pad.l - pad.r) / view.bins;
                    const h1 = (c / mx) * (H - pad.t - pad.b);
                    const h2 = (view.hs[b] / mx) * (H - pad.t - pad.b);
                    return (
                      <g key={b}>
                        <rect x={pad.l + b * bw + 1} y={H - pad.b - h1} width={bw - 2} height={h1} fill="#5B8DEF" opacity={0.75} />
                        <rect x={pad.l + b * bw + 1} y={H - pad.b - h2} width={bw - 2} height={h2} fill="#FF6B3D" opacity={0.65} />
                      </g>
                    );
                  })}
                  <line x1={gx(view.pun.bestCut, 0, 1)} x2={gx(view.pun.bestCut, 0, 1)} y1={pad.t} y2={H - pad.b} stroke="#fff" strokeDasharray="3 4" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/50 mb-1">Punzi figure of merit against the cut</p>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto rounded-lg bg-abyss border border-white/10" role="img" aria-label="Punzi figure of merit against the BDT cut">
                  <Axis x0={0} x1={1} y0={0} y1="" xl="BDT cut" yl="Punzi FoM" />
                  <polyline
                    fill="none"
                    stroke="#2AB3A6"
                    strokeWidth={2}
                    points={view.pun.cuts.map((c, k) => `${gx(c, 0, 1)},${gy(view.pun.fom[k], 0, view.pun.best * 1.1)}`).join(" ")}
                  />
                  <line x1={gx(view.pun.bestCut, 0, 1)} x2={gx(view.pun.bestCut, 0, 1)} y1={pad.t} y2={H - pad.b} stroke="#fff" strokeDasharray="3 4" />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-white/70" aria-live="polite">
              Best cut here: <strong className="text-white">{view.pun.bestCut.toFixed(2)}</strong>{" "}
              {view.pun.bestCut > 0.9 ? (
                <span className="text-[var(--accent)]">— right at the edge. That is the spike the real analysis showed on 21–23 Jul.</span>
              ) : (
                <span className="text-white/50">(dashed line in both plots)</span>
              )}
            </p>
          </>
        )}
      </div>

      <Callout title="What to try">
        <p>
          Pick <em>Overtrained settings</em>: the training AUC goes to 1.000 while the test AUC stays near 0.77, because deep trees memorise the 700 training events. Then pick <em>Simulation gives itself away</em>: both AUCs jump to about 1 and the best cut moves to the very edge. A model that scores that well on a search for something rare is not clever, it has found a shortcut.
        </p>
        <p className="text-sm text-white/50">
          The Punzi values here use a pretend background of 20,000 events, and are not comparable to the real plots&rsquo; absolute numbers.
        </p>
      </Callout>
    </Widget>
  );
}
