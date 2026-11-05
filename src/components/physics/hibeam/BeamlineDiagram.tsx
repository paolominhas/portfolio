"use client";

import { useState } from "react";

/**
 * HIBEAM BEAMLINE DIAGRAM: a schematic you can poke.
 *
 * Distances follow the instrument paper (arXiv:2311.08326): the beamline runs
 * about 65 m from the moderator, and the magnetically controlled section
 * (about 50 m) starts about 15 m from the bunker wall exit. The x positions
 * below are proportional to those distances; the beam stop and detector are
 * drawn schematically (their exact positions are not given in the paper, so
 * they are placed illustratively and the figure says so).
 *
 * All the same information is also written out in the page text, so nothing
 * here is the only place a fact appears.
 */

const STAGES = [
  {
    id: "source",
    label: "Neutron source",
    range: "0 m",
    text: "Protons from the ESS accelerator hit a rotating tungsten target and knock neutrons out of it. A moderator slows them down, and a neutron extraction system sends a beam of them down the HIBEAM beamline.",
  },
  {
    id: "shield",
    label: "Magnetically controlled region",
    range: "about 15 m to 65 m",
    text: "About 50 m of vacuum pipe where the magnetic field is carefully controlled. For a neutron to antineutron search the field must be almost zero, because a magnetic field pulls the two apart in energy and suppresses the change. For a sterile neutron search the field is set to particular values instead.",
  },
  {
    id: "stop",
    label: "Beam stop (sterile search)",
    range: "position illustrative",
    text: "In regeneration mode a beam stop absorbs the neutron beam. A neutron that turned into an invisible sterile neutron would pass through the stop and could turn back into an ordinary neutron on the far side, where counters would register it.",
  },
  {
    id: "target",
    label: "Carbon target and detector",
    range: "end of beamline",
    text: "In the antineutron search a thin carbon foil sits at the end of the beamline, surrounded by an annihilation detector. An antineutron would annihilate in the foil and produce several pions flying outwards, which the detector tracks.",
  },
] as const;

export default function BeamlineDiagram() {
  const [active, setActive] = useState<(typeof STAGES)[number]["id"]>("shield");
  const cur = STAGES.find((s) => s.id === active)!;
  const on = (id: string) => (active === id ? 1 : 0.35);

  // x positions proportional to distance from the moderator (0 to 65 m) on a 720-wide track.
  const X = (m: number) => 40 + (m / 65) * 640;

  return (
    <figure className="my-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-7">
      <svg viewBox="0 0 720 190" role="img" aria-label="Schematic of the HIBEAM beamline from the neutron source to the detector" className="w-full h-auto">
        {/* pipe */}
        <rect x={X(0)} y={80} width={X(65) - X(0)} height={30} rx={4} fill="none" stroke="rgba(255,255,255,.25)" />
        {/* magnetic section */}
        <rect x={X(15)} y={80} width={X(65) - X(15)} height={30} rx={4} fill="rgba(255,107,61,.16)" stroke="#FF6B3D" strokeOpacity={on("shield")} onClick={() => setActive("shield")} style={{ cursor: "pointer" }} />
        {/* source */}
        <g onClick={() => setActive("source")} style={{ cursor: "pointer" }} opacity={on("source")}>
          <circle cx={X(0)} cy={95} r={22} fill="#2F9E7C" fillOpacity={0.4} stroke="#2F9E7C" />
          <text x={X(0)} y={99} textAnchor="middle" fontSize="11" fill="white">n</text>
        </g>
        {/* beam stop */}
        <g onClick={() => setActive("stop")} style={{ cursor: "pointer" }} opacity={on("stop")}>
          <rect x={X(40)} y={72} width={8} height={46} fill="rgba(255,255,255,.55)" />
        </g>
        {/* carbon target + detector */}
        <g onClick={() => setActive("target")} style={{ cursor: "pointer" }} opacity={on("target")}>
          <rect x={X(65) - 3} y={78} width={4} height={34} fill="#FF6B3D" />
          <circle cx={X(65) + 8} cy={95} r={30} fill="none" stroke="rgba(255,255,255,.4)" strokeDasharray="4 4" />
        </g>
        {/* scale */}
        {[0, 15, 65].map((m) => (
          <g key={m}>
            <line x1={X(m)} x2={X(m)} y1={140} y2={150} stroke="rgba(255,255,255,.4)" />
            <text x={X(m)} y={166} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,.55)">{m} m</text>
          </g>
        ))}
        <line x1={X(0)} x2={X(65)} y1={145} y2={145} stroke="rgba(255,255,255,.25)" />
      </svg>

      <div role="tablist" aria-label="Beamline stages" className="mt-4 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.id}
            role="tab"
            type="button"
            aria-selected={active === s.id}
            onClick={() => setActive(s.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-mono transition-colors ${
              active === s.id ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]" : "border-white/15 text-white/55 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-live="polite" className="mt-4 text-white/70 leading-relaxed">
        <p className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1">{cur.range}</p>
        <p>{cur.text}</p>
      </div>
      <figcaption className="mt-4 text-xs text-white/40">
        Schematic. Distances from the moderator follow the HIBEAM instrument paper; the beam stop and detector are placed illustratively.
      </figcaption>
    </figure>
  );
}
