"use client";

import React, { useMemo, useState } from "react";
import LinePlot from "./plot";
import { COL, Slider, Widget } from "./ui";
import { NUMBERS } from "@/data/globes";
import { twoFlavour } from "@/lib/physics/neutrinoOsc";

/** Two-flavour phase explorer: where along the beamline is the oscillation, for a given Δm² and energy? */
export default function Beamline() {
  const [lg, setLg] = useState(0.4); // log10 Δm²
  const [E, setE] = useState(2.5);
  const [lg2, setLg2] = useState(-1); // log10 sin²2θ
  const dm = Math.pow(10, lg);
  const s22 = Math.pow(10, lg2);
  const { L_ND, L_FD } = { L_ND: NUMBERS.baselineND, L_FD: NUMBERS.baselineFD };

  const curve = useMemo(() => {
    const x: number[] = [];
    const y: number[] = [];
    const n = 3000;
    let prev = 0.1;
    for (let i = 0; i <= n; i++) {
      const L = Math.pow(10, -1 + (4.0 * i) / n); // 0.1 km .. 1000 km
      x.push(L);
      // where the oscillation is too fast to draw (phase moves > 1 rad per step) show its average, sin²2θ / 2
      const dphi = 1.267 * dm * (L - prev) / E;
      y.push(Math.abs(dphi) > 1.0 ? s22 / 2 : twoFlavour(s22, dm, L, E));
      prev = L;
    }
    return { x, y };
  }, [dm, E, s22]);

  const phase = (L: number) => 1.267 * dm * L / E;
  const Pnd = twoFlavour(s22, dm, L_ND, E);
  const Pfd = twoFlavour(s22, dm, L_FD, E);
  const firstMax = (Math.PI / 2) * E / (1.267 * dm); // km
  const dmAtND = (Math.PI / 2) * E / (1.267 * L_ND);
  const dmAtFD = (Math.PI / 2) * E / (1.267 * L_FD);

  return (
    <Widget eyebrow="Interactive · two-flavour formula" title="Where is the oscillation by the time the beam gets there?">
      <p className="text-white/60 text-base mb-5 max-w-[44rem]">
        The two-flavour formula <span className="font-mono text-white/80">P = sin²2θ · sin²(1.267 Δm² L / E)</span> (L in km, E in GeV, Δm² in eV²) is the cleanest way to see why DUNE has two detectors. Move the mass splitting: a splitting like the atmospheric one has barely started to oscillate 574 m from the source but peaks 1285 km away; a splitting of a few eV² does the opposite.
      </p>
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <Slider label="Mass splitting Δm²" value={lg} min={-4} max={2} step={0.02} onChange={setLg} format={(v) => `${Math.pow(10, v).toPrecision(2)} eV²`} hint="Atmospheric ≈ 2.5×10⁻³ · a sterile neutrino ≈ 1 or more" />
        <Slider label="Neutrino energy E" value={E} min={0.5} max={10} step={0.1} onChange={setE} format={(v) => `${v.toFixed(1)} GeV`} hint="The beam flux peaks at about 2–3 GeV" />
        <Slider label="Mixing sin²2θ" value={lg2} min={-3} max={0} step={0.05} onChange={setLg2} format={(v) => Math.pow(10, v).toPrecision(2)} />
      </div>
      <LinePlot
        ariaLabel="Two-flavour oscillation probability against distance from the source, with the near and far detectors marked"
        series={[{ x: curve.x, y: curve.y, color: COL.ember, width: 1.6 }]}
        legend={false}
        vlines={[
          { x: L_ND, label: "near 0.574 km", color: COL.kelp },
          { x: L_FD, label: "far 1284.9 km", color: COL.sky },
        ]}
        xDomain={[0.1, 1000]}
        yDomain={[0, Math.max(0.05, s22 * 1.05)]}
        xLog
        xLabel="distance from the source L (km)"
        yLabel="oscillation probability"
        formatX={(v) => (v >= 1 ? String(v) : String(v))}
        height={290}
      />
      <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
        <div className="rounded-xl border border-[#2F9E7C]/40 bg-[#2F9E7C]/[0.06] p-4">
          <p className="text-xs font-mono tracking-normal text-[#5FD0A8] mb-1">Near detector</p>
          <p className="text-white/70">phase {phase(L_ND).toFixed(2)} rad · P {phase(L_ND) > 30 ? "averages to" : "="} <span className="text-white">{(phase(L_ND) > 30 ? s22 / 2 : Pnd).toExponential(2)}</span></p>
          <p className="text-white/40 text-xs mt-1">Splitting at first maximum here: {dmAtND >= 0.01 ? dmAtND.toFixed(2) : dmAtND.toExponential(1)} eV²</p>
        </div>
        <div className="rounded-xl border border-[#7FB7FF]/40 bg-[#7FB7FF]/[0.06] p-4">
          <p className="text-xs font-mono tracking-normal text-[#7FB7FF] mb-1">Far detector</p>
          <p className="text-white/70">phase {phase(L_FD).toFixed(1)} rad · P {phase(L_FD) > 30 ? "averages to" : "="} <span className="text-white">{(phase(L_FD) > 30 ? s22 / 2 : Pfd).toExponential(2)}</span></p>
          <p className="text-white/40 text-xs mt-1">Splitting at first maximum here: {dmAtFD.toExponential(1)} eV²</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-mono tracking-normal text-white/45 mb-1">This splitting</p>
          <p className="text-white/70">first maximum at <span className="text-white">{firstMax >= 1 ? firstMax.toFixed(1) : (firstMax * 1000).toFixed(0) + " m"}{firstMax >= 1 ? " km" : ""}</span></p>
          <p className="text-white/40 text-xs mt-1">Where the oscillation is too fast to draw, the curve shows its average, sin²2θ/2: the real beam, with its spread of energies, averages the wiggles in the same way.</p>
        </div>
      </div>
    </Widget>
  );
}
