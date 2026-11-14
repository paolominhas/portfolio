"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * EVENT DISPLAY: the physics home page's hero.
 *
 * A toy collider event display, end-on: tracker layers, two calorimeter rings
 * and muon chambers. Each event throws 6 to 14 charged tracks from the centre
 * with random direction, charge and transverse momentum. In a uniform magnetic
 * field a track is a circle of radius proportional to pT, so soft tracks curl
 * up inside the tracker and hard ones run nearly straight to the calorimeter,
 * where they leave a deposit that grows with pT. About one track in six is
 * treated as a muon and carries on to the outer chambers.
 *
 * It is an illustration of how such a display reads, NOT data and not a
 * simulation of any real detector; the caption under it says so.
 *
 * A new event fires on click, on Enter/Space, and every few seconds while the
 * display is on screen. Hovering a track reads out its pT and charge. With
 * prefers-reduced-motion there is one static event and no auto-firing.
 */

interface Track {
  phi: number;
  q: 1 | -1;
  pt: number;
  muon: boolean;
  /** points along the track in detector units (0..1 radius) */
  pts: [number, number][];
  /** angle where it reaches the calorimeter, or null if it curls up */
  hit: number | null;
}

const R_CAL = 0.46, R_ECAL = 0.58, R_HCAL0 = 0.6, R_HCAL = 0.73, R_MU = [0.84, 0.94];
const TRACKER = [0.1, 0.16, 0.22, 0.28, 0.34, 0.4];

function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeEvent(seed: number): Track[] {
  const r = rng(seed * 7919 + 13);
  const n = 6 + Math.floor(r() * 9);
  const out: Track[] = [];
  for (let i = 0; i < n; i++) {
    const phi = r() * Math.PI * 2;
    const q = r() < 0.5 ? 1 : -1;
    const pt = 0.5 + -Math.log(1 - r() * 0.98) * 3.2; // GeV, falling spectrum
    const muon = r() < 0.17 && pt > 3;
    const R = pt * 0.16; // radius of curvature in detector units
    const cx = -q * R * Math.sin(phi), cy = q * R * Math.cos(phi);
    const pts: [number, number][] = [];
    let hit: number | null = null;
    const limit = muon ? 0.97 : R_CAL;
    const ds = 0.008;
    const maxS = 2 * R < limit ? 2 * Math.PI * R * 1.15 : 3;
    for (let s = 0; s <= maxS; s += ds) {
      const a = s / R;
      // start at origin heading along phi, curving with sign q
      const x = cx + q * R * Math.sin(phi + q * a);
      const y = cy - q * R * Math.cos(phi + q * a);
      const rad = Math.hypot(x, y);
      if (hit === null && rad >= R_CAL) hit = Math.atan2(y, x);
      if (rad >= limit) break;
      pts.push([x, y]);
    }
    out.push({ phi, q, pt, muon, pts, hit });
  }
  return out;
}

export default function EventDisplay() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef({ tracks: [] as Track[], t0: 0, hover: -1, size: 0, seed: 1 });
  const [info, setInfo] = useState<{ n: number; tracks: number; sum: number } | null>(null);
  const [hover, setHover] = useState<Track | null>(null);
  const redraw = useRef<() => void>(() => {});

  const fire = useCallback(() => {
    const st = state.current;
    st.seed += 1;
    st.tracks = makeEvent(st.seed);
    st.t0 = performance.now();
    st.hover = -1;
    setHover(null);
    setInfo({ n: st.seed - 1, tracks: st.tracks.length, sum: st.tracks.reduce((a, t) => a + t.pt, 0) });
    redraw.current();
  }, []);

  useEffect(() => {
    const cv = canvas.current, box = wrap.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !box || !ctx) return;
    const css = getComputedStyle(box);
    const ink = css.getPropertyValue("--ink").trim() || "#f2f0ea";
    const ember = css.getPropertyValue("--signal").trim() || "#ff6b3d";
    const kelp = css.getPropertyValue("--signal-2").trim() || "#4fc49d";
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = state.current;
    let raf = 0, timer = 0, visible = false;

    const draw = () => {
      raf = 0;
      const S = st.size, c = S / 2, u = S / 2; // detector unit -> px
      const now = performance.now();
      const p = still ? 1 : Math.min(1, (now - st.t0) / 900);
      const glow = still ? 1 : Math.min(1, Math.max(0, (now - st.t0 - 500) / 500));
      ctx.clearRect(0, 0, S, S);

      const ring = (r: number, a: number, lw = 1) => {
        ctx.beginPath();
        ctx.arc(c, c, r * u, 0, Math.PI * 2);
        ctx.strokeStyle = ink;
        ctx.globalAlpha = a;
        ctx.lineWidth = lw;
        ctx.stroke();
      };
      TRACKER.forEach((r) => ring(r, 0.09));
      ring(0.035, 0.4);
      ring(R_CAL, 0.22);
      ring(R_ECAL, 0.22);
      ring(R_HCAL0, 0.16);
      ring(R_HCAL, 0.16);
      // calorimeter cell walls
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * R_CAL * u, c + Math.sin(a) * R_CAL * u);
        ctx.lineTo(c + Math.cos(a) * R_ECAL * u, c + Math.sin(a) * R_ECAL * u);
        ctx.stroke();
      }
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * R_HCAL0 * u, c + Math.sin(a) * R_HCAL0 * u);
        ctx.lineTo(c + Math.cos(a) * R_HCAL * u, c + Math.sin(a) * R_HCAL * u);
        ctx.stroke();
      }
      // muon chambers: eight flat segments per layer
      R_MU.forEach((r) => {
        for (let i = 0; i < 8; i++) {
          const a0 = ((i + 0.08) / 8) * Math.PI * 2, a1 = ((i + 0.92) / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(c + Math.cos(a0) * r * u, c + Math.sin(a0) * r * u);
          ctx.lineTo(c + Math.cos(a1) * r * u, c + Math.sin(a1) * r * u);
          ctx.globalAlpha = 0.2;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      });

      // deposits
      st.tracks.forEach((t, i) => {
        if (t.hit === null) return;
        const hot = st.hover === i;
        const cell = (Math.floor((t.hit / (Math.PI * 2)) * 48 + 48) % 48) + 0.5;
        const a = (cell / 48) * Math.PI * 2, half = (Math.PI / 48) * 0.82;
        const depth = Math.min(1, Math.log(1 + t.pt) / Math.log(22));
        const r0 = t.muon ? R_CAL : R_CAL, r1 = t.muon ? R_CAL + 0.03 : R_CAL + (R_HCAL - R_CAL) * depth;
        ctx.beginPath();
        ctx.arc(c, c, r0 * u, a - half, a + half);
        ctx.arc(c, c, (r0 + (r1 - r0) * glow) * u, a + half, a - half, true);
        ctx.closePath();
        ctx.fillStyle = t.muon ? kelp : ember;
        ctx.globalAlpha = (hot ? 1 : 0.8) * glow;
        ctx.fill();
        if (t.muon) {
          const last = t.pts[t.pts.length - 1];
          const am = Math.atan2(last[1], last[0]);
          R_MU.forEach((r) => {
            const seg = Math.floor(((am / (Math.PI * 2)) * 8 + 8) % 8);
            const a0 = ((seg + 0.08) / 8) * Math.PI * 2, a1 = ((seg + 0.92) / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(c + Math.cos(a0) * r * u, c + Math.sin(a0) * r * u);
            ctx.lineTo(c + Math.cos(a1) * r * u, c + Math.sin(a1) * r * u);
            ctx.strokeStyle = kelp;
            ctx.globalAlpha = glow;
            ctx.lineWidth = 3;
            ctx.stroke();
          });
        }
      });

      // tracks
      st.tracks.forEach((t, i) => {
        const hot = st.hover === i;
        const n = Math.max(2, Math.floor(t.pts.length * p));
        ctx.beginPath();
        for (let k = 0; k < n; k++) {
          const [x, y] = t.pts[k];
          if (k === 0) ctx.moveTo(c + x * u, c + y * u);
          else ctx.lineTo(c + x * u, c + y * u);
        }
        ctx.strokeStyle = t.muon ? kelp : hot ? ember : ink;
        ctx.globalAlpha = hot ? 1 : t.muon ? 0.95 : 0.75;
        ctx.lineWidth = hot ? 2.6 : 1.5;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = ember;
      ctx.beginPath();
      ctx.arc(c, c, 3, 0, Math.PI * 2);
      ctx.fill();

      if (!still && now - st.t0 < 1100) raf = requestAnimationFrame(draw);
    };
    redraw.current = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const size = () => {
      const s = Math.round(box.clientWidth);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.size = s;
      cv.width = s * dpr;
      cv.height = s * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw.current();
    };
    const ro = new ResizeObserver(size);
    ro.observe(box);
    size();
    fire();

    const schedule = () => {
      window.clearInterval(timer);
      if (visible && !still) timer = window.setInterval(() => !document.hidden && st.hover < 0 && fire(), 6500);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      schedule();
    });
    io.observe(box);

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const x = (e.clientX - r.left - st.size / 2) / (st.size / 2), y = (e.clientY - r.top - st.size / 2) / (st.size / 2);
      let best = -1, bd = 0.035 * 0.035;
      st.tracks.forEach((t, i) => {
        for (let k = 0; k < t.pts.length; k += 3) {
          const dx = t.pts[k][0] - x, dy = t.pts[k][1] - y, d = dx * dx + dy * dy;
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
      });
      if (best !== st.hover) {
        st.hover = best;
        setHover(best >= 0 ? st.tracks[best] : null);
        redraw.current();
      }
    };
    const onLeave = () => {
      if (st.hover !== -1) {
        st.hover = -1;
        setHover(null);
        redraw.current();
      }
    };
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.clearInterval(timer);
      if (raf) cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
    };
  }, [fire]);

  return (
    <figure className="m-0">
      <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[40rem]">
        <canvas
          ref={canvas}
          role="button"
          tabIndex={0}
          aria-label="Toy particle event display. Press Enter to fire a new event."
          onClick={fire}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fire();
            }
          }}
          className="absolute inset-0 h-full w-full cursor-crosshair rounded-full"
        />
      </div>
      <figcaption className="mx-auto mt-4 flex max-w-[40rem] flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="in-label min-h-[2.4em]" aria-live="off">
          {hover ? (
            <span className="text-[var(--ink)]">
              {hover.muon ? "Muon" : "Track"}: pT {hover.pt.toFixed(1)} GeV, charge {hover.q > 0 ? "+" : "−"}1{hover.hit === null ? ", curls up in the tracker" : ""}
            </span>
          ) : info ? (
            <>
              Event {String(info.n).padStart(4, "0")}: {info.tracks} tracks, ΣpT {info.sum.toFixed(1)} GeV
            </>
          ) : (
            <>Event display</>
          )}
          <br />
          Toy event: random tracks in a uniform field. Not data.
        </p>
        <button
          type="button"
          onClick={fire}
          className="flex h-10 items-center gap-2.5 rounded-[3px] border border-[var(--line)] px-4 text-sm text-[var(--ink)] transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
        >
          <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--signal)]" />
          Fire an event
        </button>
      </figcaption>
    </figure>
  );
}
