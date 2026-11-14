/**
 * COVER ART for the research / article / project cards.
 *
 * Generated SVG in the site's palette, one per project, so every card has an
 * image that matches the dark theme without stock photos or screenshots of
 * plots on white backgrounds. Where there is real science to draw, the art
 * uses it:
 *
 *   globes   real P(νμ→νe) curves from the same engine as the GLoBES page
 *            (L = 1300 km, ρ = 2.848 g/cm³, δCP = −90°, 0°, +90°)
 *   dune-nd  the digitised NDLAr CC0π stack (data copied to coverData.ts)
 *   grover   the exact Grover amplitudes after two iterations on 16 items
 *   life     a real Game of Life run from a Gosper glider gun
 *
 * and is an illustration, not data, for the rest:
 *
 *   tpc      a drift chamber with tracks; the clusters are placed along
 *            curves by hand, and the two stopping tracks get bigger clusters
 *            toward their ends (the dE/dx rise) as the idea, not as a measurement
 *   ppss     a falling background with a small peak and a signal window
 *   field    generic seeded pattern, used when nothing else fits
 *
 * No randomness at render time (everything is seeded), so server and client
 * output match. Animation is plain CSS, triggered by a `group` ancestor being
 * hovered (cards) or by `loop` (the spotlight). It is switched off for
 * prefers-reduced-motion.
 */

import { makeEngine, stdParams } from "@/lib/physics/neutrinoOsc";
import { ND_STACK } from "./coverData";

export type CoverKind = "tpc" | "grover" | "ppss" | "globes" | "dune-nd" | "life" | "field";

const EMBER = "#FF6B3D";
const KELP = "#2F9E7C";
const GOLD = "#E8B84A";
const BLUE = "#6EA8FF";

const LABELS: Record<CoverKind, string> = {
  tpc: "Illustration of a time projection chamber with particle tracks and readout pads",
  grover: "Bar chart of Grover search amplitudes after two iterations, with the marked item amplified",
  ppss: "Illustration of an invariant-mass histogram with a small peak above a falling background",
  globes: "Oscillation probability curves for three values of the CP phase, computed for DUNE",
  "dune-nd": "Stacked histogram of simulated near-detector events by interaction type",
  life: "Game of Life cells with gliders streaming away from a glider gun",
  field: "Abstract pattern of concentric arcs",
};

/* ------------------------------------------------------------------ helpers */

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
const f = (x: number) => x.toFixed(1);
type Pt = [number, number];
const quad = (p0: Pt, c: Pt, p1: Pt, t: number): Pt => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]];
};

/** Keyframes + rules, scoped by the `ca-` prefix. Rendered inside every cover; duplicates are harmless. */
const CSS = `
@keyframes ca-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ca-rise{from{transform:scaleY(.12)}to{transform:scaleY(1)}}
@keyframes ca-fade{from{opacity:0}to{opacity:1}}
@keyframes ca-draw-loop{0%{stroke-dashoffset:1}28%,92%{stroke-dashoffset:0}100%{stroke-dashoffset:0;opacity:.0}}
@keyframes ca-rise-loop{0%{transform:scaleY(.12)}30%,92%{transform:scaleY(1)}100%{transform:scaleY(.12)}}
@keyframes ca-fade-loop{0%{opacity:0}30%,92%{opacity:1}100%{opacity:0}}
.ca-draw{stroke-dasharray:1;stroke-dashoffset:0}
.ca-rise{transform-box:fill-box;transform-origin:50% 100%}
.group:hover .ca-draw{animation:ca-draw 1.3s ease-out both;animation-delay:var(--d,0s)}
.group:hover .ca-rise{animation:ca-rise .9s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--d,0s)}
.group:hover .ca-fade{animation:ca-fade .8s ease-out both;animation-delay:var(--d,0s)}
.ca-loop .ca-draw{animation:ca-draw-loop 7s ease-out infinite;animation-delay:var(--d,0s)}
.ca-loop .ca-rise{animation:ca-rise-loop 7s cubic-bezier(.2,.8,.2,1) infinite;animation-delay:var(--d,0s)}
.ca-loop .ca-fade{animation:ca-fade-loop 7s ease-out infinite;animation-delay:var(--d,0s)}
@media (prefers-reduced-motion:reduce){.group:hover .ca-draw,.group:hover .ca-rise,.group:hover .ca-fade,.ca-loop .ca-draw,.ca-loop .ca-rise,.ca-loop .ca-fade{animation:none}}
`;

/* ------------------------------------------------------------------ the arts */

function Tpc() {
  const V: Pt = [118, 200];
  const tracks: { c: Pt; e: Pt; stop: boolean; n: number }[] = [
    { c: [300, 186], e: [512, 158], stop: false, n: 22 },
    { c: [285, 226], e: [512, 262], stop: false, n: 22 },
    { c: [215, 148], e: [338, 104], stop: true, n: 15 },
    { c: [230, 262], e: [372, 306], stop: true, n: 17 },
    { c: [260, 200], e: [470, 204], stop: false, n: 18 },
  ];
  const dots: { x: number; y: number; r: number; d: number }[] = [];
  const paths: { d: string; i: number }[] = [];
  tracks.forEach((tr, i) => {
    paths.push({ d: `M${f(V[0])} ${f(V[1])} Q${f(tr.c[0])} ${f(tr.c[1])} ${f(tr.e[0])} ${f(tr.e[1])}`, i });
    for (let k = 1; k <= tr.n; k++) {
      const t = k / (tr.n + 0.5);
      const [x, y] = quad(V, tr.c, tr.e, t);
      const r = tr.stop ? 1.8 + 3.8 * t * t * t : 2.3;
      dots.push({ x, y, r, d: 0.15 + t * 1.0 });
    }
  });
  // Pads: charge collected by each pad = sum of cluster sizes projected on it.
  const nPad = 15, y0 = 70, y1 = 330, pitch = (y1 - y0) / nPad;
  const charge = new Array(nPad).fill(0);
  dots.forEach((d) => {
    const j = Math.min(nPad - 1, Math.max(0, Math.floor((d.y - y0) / pitch)));
    charge[j] += d.r * d.r;
  });
  const cmax = Math.max(...charge);
  return (
    <>
      <rect x="64" y="60" width="454" height="280" rx="6" fill="none" stroke="rgba(255,255,255,.24)" strokeWidth="1.5" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1="64" x2="518" y1={f(60 + (i + 1) * 28)} y2={f(60 + (i + 1) * 28)} stroke="rgba(255,255,255,.05)" />
      ))}
      <line x1="64" y1="60" x2="64" y2="340" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
      <line x1="30" y1="200" x2="112" y2="200" stroke="rgba(255,255,255,.25)" strokeDasharray="4 5" />
      {charge.map((c, j) => (
        <rect
          key={j}
          className="ca-fade"
          style={{ ["--d" as string]: `${0.2 + j * 0.05}s` }}
          x="524"
          y={f(y0 + j * pitch + 1.2)}
          width={f(6 + 52 * (c / cmax))}
          height={f(pitch - 2.4)}
          rx="2"
          fill={EMBER}
          opacity={0.25 + 0.65 * (c / cmax)}
        />
      ))}
      {paths.map((p) => (
        <path
          key={p.i}
          className="ca-draw"
          pathLength={1}
          style={{ ["--d" as string]: `${p.i * 0.08}s` }}
          d={p.d}
          fill="none"
          stroke="rgba(255,255,255,.34)"
          strokeWidth="1.8"
        />
      ))}
      {dots.map((d, i) => (
        <circle key={i} className="ca-fade" style={{ ["--d" as string]: `${d.d}s` }} cx={f(d.x)} cy={f(d.y)} r={f(d.r)} fill={i % 3 === 0 ? GOLD : EMBER} opacity=".9" />
      ))}
      <circle cx={f(V[0])} cy={f(V[1])} r="4" fill="#fff" />
    </>
  );
}

function Grover() {
  const N = 16, k = 2;
  const th = Math.asin(1 / Math.sqrt(N));
  const a = Math.sin((2 * k + 1) * th);
  const b = Math.cos((2 * k + 1) * th) / Math.sqrt(N - 1);
  const marked = 11;
  const base = 330, h = 250, x0 = 70, w = 28, gap = 6.5;
  const scale = h / 1;
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} opacity=".28">
          <line x1="30" x2="610" y1={60 + i * 50} y2={60 + i * 50} stroke="rgba(255,255,255,.5)" strokeWidth=".8" />
          <rect x={120 + i * 80} y={60 + i * 50 - 11} width="22" height="22" rx="3" fill="#0A0E1A" stroke="rgba(255,255,255,.55)" />
        </g>
      ))}
      <line x1="40" x2="600" y1={f(base)} y2={f(base)} stroke="rgba(255,255,255,.3)" />
      <line x1="40" x2="600" y1={f(base - (1 / Math.sqrt(N)) * scale)} y2={f(base - (1 / Math.sqrt(N)) * scale)} stroke="rgba(255,255,255,.35)" strokeDasharray="5 6" />
      {Array.from({ length: N }, (_, i) => {
        const v = i === marked ? a : b;
        const x = x0 + i * (w + gap);
        const hh = v * scale;
        return (
          <rect
            key={i}
            className="ca-rise"
            style={{ ["--d" as string]: i === marked ? "0.35s" : `${i * 0.025}s` }}
            x={f(x)}
            y={f(base - hh)}
            width={w}
            height={f(hh)}
            rx="3"
            fill={i === marked ? EMBER : KELP}
            opacity={i === marked ? 1 : 0.8}
          />
        );
      })}
    </>
  );
}

function Ppss() {
  const nb = 56, x0 = 50, x1 = 596, base = 332, top = 70;
  const w = (x1 - x0) / nb;
  const rnd = mulberry32(7);
  const bins = Array.from({ length: nb }, (_, i) => {
    const x = i / nb;
    const bg = 0.88 * Math.exp(-3.1 * x) + 0.04;
    const sig = 0.17 * Math.exp(-0.5 * ((x - 0.6) / 0.035) ** 2);
    return { bg, tot: bg + sig + (rnd() - 0.5) * 0.035 };
  });
  const sx0 = x0 + 0.6 * (x1 - x0) - 36, sx1 = x0 + 0.6 * (x1 - x0) + 36;
  const fit = bins.map((_, i) => {
    const x = (i + 0.5) / nb;
    const y = 0.88 * Math.exp(-3.1 * x) + 0.04 + 0.17 * Math.exp(-0.5 * ((x - 0.6) / 0.035) ** 2);
    return `${i ? "L" : "M"}${f(x0 + (i + 0.5) * w)} ${f(base - (y * (base - top)) / 0.95)}`;
  }).join(" ");
  return (
    <>
      <rect x={f(sx0)} y="60" width={f(sx1 - sx0)} height="272" fill="rgba(47,158,124,.10)" stroke="rgba(47,158,124,.5)" strokeDasharray="4 5" />
      <line x1={x0} x2={x1} y1={base} y2={base} stroke="rgba(255,255,255,.3)" />
      {bins.map((b, i) => {
        const hh = Math.max(1.5, (b.tot * (base - top)) / 0.95);
        const inSig = x0 + (i + 0.5) * w > sx0 && x0 + (i + 0.5) * w < sx1;
        return (
          <rect
            key={i}
            className="ca-rise"
            style={{ ["--d" as string]: `${i * 0.012}s` }}
            x={f(x0 + i * w + 1)}
            y={f(base - hh)}
            width={f(w - 2)}
            height={f(hh)}
            fill={inSig ? KELP : "rgba(255,255,255,.28)"}
          />
        );
      })}
      <path d={fit} className="ca-draw" pathLength={1} fill="none" stroke={EMBER} strokeWidth="2.4" strokeLinejoin="round" />
    </>
  );
}

let GLOBES_CACHE: { c: string; d: string }[] | null = null;
function globesCurves() {
  if (GLOBES_CACHE) return GLOBES_CACHE;
  const x0 = 56, x1 = 604, yb = 336, yt = 56, ymax = 0.115;
  const Emin = 0.5, Emax = 6;
  const out: { c: string; d: string }[] = [];
  for (const [dcp, col] of [[-90, EMBER], [0, "rgba(255,255,255,.55)"], [90, BLUE]] as [number, string][]) {
    const eng = makeEngine(stdParams(dcp, "NO"));
    let d = "";
    for (let i = 0; i <= 140; i++) {
      const E = Emin + ((Emax - Emin) * i) / 140;
      const P = eng.probs(E, 1300, 2.848, false)[1 * 3 + 0];
      const X = x0 + ((E - Emin) / (Emax - Emin)) * (x1 - x0);
      const Y = yb - (Math.min(P, ymax) / ymax) * (yb - yt);
      d += `${i ? "L" : "M"}${f(X)} ${f(Y)} `;
    }
    out.push({ c: col, d });
  }
  GLOBES_CACHE = out;
  return out;
}
function Globes() {
  const cs = globesCurves();
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="56" x2="604" y1={f(56 + i * 70)} y2={f(56 + i * 70)} stroke="rgba(255,255,255,.06)" />
      ))}
      <line x1="56" x2="604" y1="336" y2="336" stroke="rgba(255,255,255,.3)" />
      <line x1="56" x2="56" y1="52" y2="336" stroke="rgba(255,255,255,.3)" />
      {cs.map((c, i) => (
        <path key={i} className="ca-draw" pathLength={1} style={{ ["--d" as string]: `${i * 0.18}s` }} d={c.d} fill="none" stroke={c.c} strokeWidth={i === 0 ? 3 : 2.2} strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </>
  );
}

function DuneNd() {
  const n = ND_STACK.n, x0 = 48, x1 = 600, base = 338, top = 56;
  const w = (x1 - x0) / 56; // leave room on the right, as the real plot has
  const maxTot = Math.max(...Array.from({ length: n }, (_, i) => ND_STACK.QE[i] + ND_STACK.RES[i] + ND_STACK.DIS[i] + ND_STACK.MEC[i]));
  const sc = (base - top) / maxTot;
  const layers: ["QE" | "RES" | "DIS" | "MEC", string][] = [["QE", GOLD], ["RES", KELP], ["DIS", EMBER], ["MEC", BLUE]];
  return (
    <>
      <line x1={x0} x2={x1} y1={base} y2={base} stroke="rgba(255,255,255,.3)" />
      {Array.from({ length: n }, (_, i) => {
        let y = base;
        return (
          <g key={i} className="ca-rise" style={{ ["--d" as string]: `${i * 0.014}s` }}>
            {layers.map(([k, col]) => {
              const hh = ND_STACK[k][i] * sc;
              y -= hh;
              return hh > 0.4 ? <rect key={k} x={f(x0 + i * w + 0.6)} y={f(y)} width={f(w - 1.2)} height={f(hh)} fill={col} opacity=".92" /> : null;
            })}
          </g>
        );
      })}
    </>
  );
}

let LIFE_CACHE: [number, number][] | null = null;
function lifeCells() {
  if (LIFE_CACHE) return LIFE_CACHE;
  const W = 96, H = 60;
  const gun: [number, number][] = [
    [0, 4], [0, 5], [1, 4], [1, 5],
    [10, 4], [10, 5], [10, 6], [11, 3], [11, 7], [12, 2], [12, 8], [13, 2], [13, 8], [14, 5], [15, 3], [15, 7], [16, 4], [16, 5], [16, 6], [17, 5],
    [20, 2], [20, 3], [20, 4], [21, 2], [21, 3], [21, 4], [22, 1], [22, 5], [24, 0], [24, 1], [24, 5], [24, 6],
    [34, 2], [34, 3], [35, 2], [35, 3],
  ];
  let g = Array.from({ length: H }, () => new Uint8Array(W));
  gun.forEach(([x, y]) => (g[y + 3][x + 4] = 1));
  for (let t = 0; t < 150; t++) {
    const n = Array.from({ length: H }, () => new Uint8Array(W));
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let c = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) if (dx || dy) c += g[(y + dy + H) % H][(x + dx + W) % W];
        n[y][x] = c === 3 || (g[y][x] && c === 2) ? 1 : 0;
      }
    g = n;
  }
  const cells: [number, number][] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x]) cells.push([x, y]);
  LIFE_CACHE = cells;
  return cells;
}
function Life() {
  const cells = lifeCells();
  const s = 400 / 60;
  return (
    <>
      {cells.map(([x, y], i) => (
        <rect key={i} className="ca-fade" style={{ ["--d" as string]: `${(x + y) * 0.006}s` }} x={f(x * s + 8)} y={f(y * s)} width={f(s - 1.4)} height={f(s - 1.4)} rx="1.5" fill={x < 44 ? EMBER : "#fff"} opacity={x < 44 ? 0.95 : 0.8} />
      ))}
    </>
  );
}

function Field({ seed }: { seed: string }) {
  const r = mulberry32(hash(seed));
  const arcs = Array.from({ length: 9 }, (_, i) => ({ cx: 120 + r() * 400, cy: 80 + r() * 240, rad: 50 + i * 26 + r() * 20, col: i % 3 === 0 ? EMBER : i % 3 === 1 ? KELP : BLUE }));
  return (
    <>
      {arcs.map((a, i) => (
        <circle key={i} className="ca-fade" style={{ ["--d" as string]: `${i * 0.08}s` }} cx={f(a.cx)} cy={f(a.cy)} r={f(a.rad)} fill="none" stroke={a.col} strokeOpacity=".35" strokeWidth="1.4" />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ public */

export default function CoverArt({ kind, seed = "", loop = false, className = "" }: { kind: CoverKind; seed?: string; loop?: boolean; className?: string }) {
  const art =
    kind === "tpc" ? <Tpc /> : kind === "grover" ? <Grover /> : kind === "ppss" ? <Ppss /> : kind === "globes" ? <Globes /> : kind === "dune-nd" ? <DuneNd /> : kind === "life" ? <Life /> : <Field seed={seed || "x"} />;
  const gid = `cg-${kind}`;
  return (
    <svg
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={LABELS[kind]}
      className={`${loop ? "ca-loop " : ""}${className}`}
    >
      <defs>
        <radialGradient id={gid} cx="30%" cy="20%" r="95%">
          <stop offset="0" stopColor="#18223f" />
          <stop offset="0.6" stopColor="#0d1428" />
          <stop offset="1" stopColor="#080b16" />
        </radialGradient>
      </defs>
      <style>{CSS}</style>
      <rect width="640" height="400" fill={`url(#${gid})`} />
      {art}
    </svg>
  );
}

/** True when a slug has its own cover (not the generic fallback). */
export const hasCover = (slug: string) => coverForSlug(slug) !== "field";

/** Which cover a research / project slug uses. */
export function coverForSlug(slug: string): CoverKind {
  switch (slug) {
    case "mphys": return "tpc";
    case "grover": return "grover";
    case "ppss": return "ppss";
    case "globes": return "globes";
    case "dune-nd": return "dune-nd";
    case "game-of-life-gliders": return "life";
    default: return "field";
  }
}
