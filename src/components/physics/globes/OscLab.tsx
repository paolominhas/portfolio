"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { btn, Check, COL, Seg, Slider, Widget } from "./ui";
import { NUMBERS } from "@/data/globes";
import { makeEngine, NUFIT, stdParams, type Sterile } from "@/lib/physics/neutrinoOsc";

type Chan = "mue" | "mumu" | "mutau" | "mus" | "ee";
const CH: Record<Chan, { from: number; to: number; name: string }> = {
  mue: { from: 1, to: 0, name: "νμ → νe (appearance)" },
  mumu: { from: 1, to: 1, name: "νμ → νμ (disappearance)" },
  mutau: { from: 1, to: 2, name: "νμ → ντ" },
  mus: { from: 1, to: 3, name: "νμ → νs (into the sterile state)" },
  ee: { from: 0, to: 0, name: "νe → νe" },
};

const pow10 = (v: number) => Math.pow(10, v);

/** The in-browser 3 and 3+1 oscillation engine (same Hamiltonian as the SNU library the project used). */
export default function OscLab() {
  const [site, setSite] = useState<"FD" | "ND">("FD");
  const [chan, setChan] = useState<Chan>("mue");
  const [anti, setAnti] = useState(false);
  const [matter, setMatter] = useState(true);
  const [ord, setOrd] = useState<"NO" | "IO">("NO");
  const [dcp, setDcp] = useState(285);
  const [s2t23, setS2t23] = useState(NUFIT.s2t23);
  const [logE, setLogE] = useState(false);
  const [ster, setSter] = useState(false);
  const [lDm, setLDm] = useState(0);
  const [l14, setL14] = useState(-4);
  const [l24, setL24] = useState(-1.3);
  const [l34, setL34] = useState(-4);
  const [d1, setD1] = useState(0);
  const [d2, setD2] = useState(0);

  const L = site === "FD" ? NUMBERS.baselineFD : NUMBERS.baselineND;
  const rho = matter ? NUMBERS.density : 0;
  const c = CH[chan];
  const needS = c.to === 3;
  const useSter = ster || needS;

  const std = useMemo(() => {
    const p = stdParams(dcp, ord);
    p.t23 = Math.asin(Math.sqrt(s2t23));
    return p;
  }, [dcp, ord, s2t23]);
  const st: Sterile | null = useMemo(
    () =>
      useSter
        ? {
            d41: pow10(lDm),
            t14: Math.asin(Math.sqrt(pow10(l14))),
            t24: Math.asin(Math.sqrt(pow10(l24))),
            t34: Math.asin(Math.sqrt(pow10(l34))),
            d1: (d1 * Math.PI) / 180,
            d2: (d2 * Math.PI) / 180,
          }
        : null,
    [useSter, lDm, l14, l24, l34, d1, d2]
  );

  const { E, y, y0 } = useMemo(() => {
    const lo = logE ? 0.1 : 0.5;
    const hi = logE ? 20 : 6;
    const N = 700;
    const eng = makeEngine(std, st);
    const eng0 = makeEngine(std, null);
    const Es: number[] = [];
    const ys: number[] = [];
    const y0s: number[] = [];
    for (let i = 0; i <= N; i++) {
      const e = logE ? lo * Math.pow(hi / lo, i / N) : lo + ((hi - lo) * i) / N;
      Es.push(e);
      const P = eng.probs(e, L, rho, anti);
      ys.push(P[c.from * eng.n + c.to]);
      if (st && c.to < 3) {
        const P0 = eng0.probs(e, L, rho, anti);
        y0s.push(P0[c.from * eng0.n + c.to]);
      }
    }
    return { E: Es, y: ys, y0: y0s };
  }, [std, st, L, rho, anti, c.from, c.to, logE]);

  const isDis = c.from === c.to;
  const yMax = isDis ? 1.0 : Math.max(0.02, Math.min(1, Math.max(...y, ...(y0.length ? y0 : [0])) * 1.12));
  const nm = anti ? "ν̄" : "ν";
  const label = c.name.replaceAll("ν", nm);

  const preset = (p: "std" | "nd" | "mimic") => {
    if (p === "std") {
      setSter(false);
      setSite("FD");
      setChan("mue");
      setAnti(false);
      setMatter(true);
    } else if (p === "nd") {
      setSter(true);
      setSite("ND");
      setChan("mumu");
      setLDm(0.5);
      setL24(-1);
      setLogE(true);
      setAnti(false);
    } else {
      setSter(true);
      setSite("FD");
      setChan("mumu");
      setLDm(Math.log10(2.5e-3));
      setL24(-1);
      setLogE(false);
      setAnti(false);
    }
  };

  return (
    <Widget eyebrow="Interactive · live engine" title="Oscillation probabilities, three flavours or four">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        This runs the same calculation GLoBES asked the SNU library for: build the mixing matrix from rotations, form the Hamiltonian with the matter potential, and exponentiate it. Choose the detector, the channel and the parameters, then switch on a sterile neutrino and watch what it does to each channel.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        <button className={btn} onClick={() => preset("std")}>Standard: νμ → νe at the far detector</button>
        <button className={btn} onClick={() => preset("nd")}>Sterile at the near detector</button>
        <button className={btn} onClick={() => preset("mimic")}>Sterile near the atmospheric splitting</button>
      </div>
      <div className="grid lg:grid-cols-[1fr_1.35fr] gap-8">
        <div className="space-y-5">
          <Seg label="Detector" value={site} onChange={setSite} options={[["FD", "Far · 1284.9 km"], ["ND", "Near · 0.574 km"]]} />
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40 mb-1.5">Channel</p>
            <select
              value={chan}
              onChange={(e) => setChan(e.target.value as Chan)}
              className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-white/85"
              aria-label="Oscillation channel"
            >
              {(Object.keys(CH) as Chan[]).map((k) => (
                <option key={k} value={k}>
                  {CH[k].name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Check label="Antineutrinos" checked={anti} onChange={setAnti} />
            <Check label={`Matter (${NUMBERS.density} g/cm³)`} checked={matter} onChange={setMatter} />
            <Check label="Log energy axis" checked={logE} onChange={setLogE} />
          </div>
          <Seg label="Mass ordering" value={ord} onChange={setOrd} options={[["NO", "Normal"], ["IO", "Inverted"]]} />
          <Slider label="δCP" value={dcp} min={0} max={360} step={5} onChange={setDcp} format={(v) => `${v}°`} />
          <Slider label="sin²θ₂₃" value={s2t23} min={0.4} max={0.6} step={0.005} onChange={setS2t23} format={(v) => v.toFixed(3)} hint="NuFit 6.0: 0.561" />

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
            <Check label="Add a sterile neutrino (3+1)" checked={useSter} onChange={(v) => setSter(v)} />
            {useSter && (
              <>
                <Slider label="Δm²₄₁" value={lDm} min={-3.5} max={2} step={0.05} onChange={setLDm} format={(v) => `${pow10(v) >= 0.01 ? pow10(v).toPrecision(2) : pow10(v).toExponential(1)} eV²`} />
                <Slider label="sin²θ₂₄" value={l24} min={-4} max={-0.1} step={0.05} onChange={setL24} format={(v) => pow10(v).toExponential(1)} />
                <Slider label="sin²θ₁₄" value={l14} min={-4} max={-0.1} step={0.05} onChange={setL14} format={(v) => pow10(v).toExponential(1)} />
                <Slider label="sin²θ₃₄" value={l34} min={-4} max={-0.1} step={0.05} onChange={setL34} format={(v) => pow10(v).toExponential(1)} />
                <div className="grid grid-cols-2 gap-4">
                  <Slider label="phase δ₁" value={d1} min={0} max={360} step={15} onChange={setD1} format={(v) => `${v}°`} />
                  <Slider label="phase δ₂" value={d2} min={0} max={360} step={15} onChange={setD2} format={(v) => `${v}°`} />
                </div>
                <p className="text-[11px] text-white/35">The project switched on only Δm²₄₁ and θ₂₄ (all other sterile parameters zero).</p>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-white/70 mb-2">
            <strong className="text-white">{label}</strong> · {site === "FD" ? "far detector" : "near detector"} · {ord === "NO" ? "normal" : "inverted"} ordering · δCP = {dcp}°
            {useSter ? ` · Δm²₄₁ = ${pow10(lDm) >= 0.01 ? pow10(lDm).toPrecision(2) : pow10(lDm).toExponential(1)} eV²` : ""}
          </p>
          <LinePlot
            ariaLabel={`${label} oscillation probability against neutrino energy`}
            series={[
              ...(y0.length ? [{ x: E, y: y0, color: COL.grey, dash: "5 4", label: "3-flavour", width: 1.3 }] : []),
              { x: E, y, color: COL.ember, label: useSter ? "3+1" : "3-flavour", width: 1.6 },
            ]}
            xDomain={[E[0], E[E.length - 1]]}
            yDomain={[0, yMax]}
            xLog={logE}
            xLabel="neutrino energy (GeV)"
            yLabel="probability"
            height={340}
          />
          {site === "ND" && !useSter && (
            <p className="text-xs text-white/45 mt-2">
              With no sterile neutrino, nothing has had time to oscillate over 574 m: νμ → νμ is 1 and every other channel is essentially 0. Switch on the sterile neutrino to see what the near detector is for.
            </p>
          )}
          {needS && <p className="text-xs text-white/45 mt-2">Disappearance into the sterile state needs the sterile neutrino, so it is switched on for this channel.</p>}
          {chan === "mue" && !anti && site === "FD" && (
            <p className="text-xs text-white/45 mt-2">
              Try δCP = 90° against 270° and normal against inverted ordering: these are the two knobs DUNE wants to turn. Tick “Antineutrinos” to see matter change the sign of its effect.
            </p>
          )}
        </div>
      </div>
    </Widget>
  );
}
