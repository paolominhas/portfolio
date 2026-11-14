"use client";

import { useEffect, useRef } from "react";

/**
 * CHANNEL DECK: the routes out of the main site, drawn as three live channels.
 *
 * Each row is one large link. Its trace has the character of where it leads:
 *
 *   Physics  an oscillation whose wavelength stretches with x, the shape of a
 *            neutrino oscillation probability against energy
 *   Web      a clocked square wave, a stream of bits
 *   Music    a fundamental with its second and third harmonics
 *
 * The traces drift slowly; the one under the pointer (or keyboard focus) runs
 * faster and larger. One requestAnimationFrame loop drives all three and stops
 * when the deck is off screen. Reduced motion draws them once.
 */

export interface Channel {
  key: "physics" | "web" | "music";
  name: string;
  description: string;
  href: string;
  color: string;
}

const W = 600, H = 64;

function shape(key: Channel["key"], x: number, ph: number): number {
  // x in 0..1, returns -1..1
  if (key === "physics") return Math.cos(9 / (x + 0.16) + ph * 2) * (0.35 + 0.65 * x);
  if (key === "web") {
    const bits = [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1];
    const u = x * 11 + ph * 0.9;
    const i = ((Math.floor(u) % bits.length) + bits.length) % bits.length;
    return bits[i] ? 0.8 : -0.8;
  }
  const u = x * 15 + ph * 2.2;
  return (Math.sin(u) + 0.5 * Math.sin(2 * u + ph) + 0.33 * Math.sin(3 * u - ph * 0.7)) / 1.5;
}

function pathFor(key: Channel["key"], ph: number, amp: number) {
  let d = "";
  const n = key === "web" ? 300 : 150;
  let prev = 0;
  for (let i = 0; i <= n; i++) {
    const x = i / n;
    const v = shape(key, x, ph);
    const X = (x * W).toFixed(1);
    const Y = (H / 2 - v * amp).toFixed(1);
    if (i === 0) d += `M${X} ${Y}`;
    else if (key === "web" && v !== prev) d += `L${X} ${(H / 2 - prev * amp).toFixed(1)}L${X} ${Y}`;
    else d += `L${X} ${Y}`;
    prev = v;
  }
  return d;
}

export default function ChannelDeck({ channels }: { channels: Channel[] }) {
  const root = useRef<HTMLDivElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const hot = useRef<number>(-1);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phase = channels.map(() => 0);
    const amp = channels.map(() => 14);
    let raf = 0, last = performance.now(), visible = true;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      channels.forEach((c, i) => {
        const on = hot.current === i;
        phase[i] += dt * (on ? 1.5 : 0.22);
        amp[i] += ((on ? 26 : 14) - amp[i]) * Math.min(1, dt * 8);
        paths.current[i]?.setAttribute("d", pathFor(c.key, phase[i], amp[i]));
      });
      if (visible && !still) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !still) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(el);
    frame(performance.now());
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [channels]);

  return (
    <div ref={root} className="border-t border-[var(--line)]">
      {channels.map((c, i) => (
        <a
          key={c.key}
          href={c.href}
          onPointerEnter={() => (hot.current = i)}
          onPointerLeave={() => (hot.current = -1)}
          onFocus={() => (hot.current = i)}
          onBlur={() => (hot.current = -1)}
          style={{ ["--ch" as string]: c.color }}
          className="group relative grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-b border-[var(--line)] py-5 transition-colors hover:bg-[color-mix(in_srgb,var(--plate)_70%,transparent)] focus-visible:bg-[color-mix(in_srgb,var(--plate)_70%,transparent)] md:grid-cols-[minmax(11rem,0.9fr)_minmax(0,2.2fr)_minmax(0,1.5fr)_auto] md:px-4 md:py-6"
        >
          <span className="flex items-baseline gap-3">
            <span className="in-label w-8 transition-colors group-hover:text-[var(--ch)]">CH{i + 1}</span>
            <span className="in-display text-[length:var(--step-3)] transition-colors group-hover:text-[var(--ch)] md:text-[length:var(--step-4)]">{c.name}</span>
          </span>
          <svg
            aria-hidden
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="order-last col-span-2 h-12 w-full md:order-none md:col-span-1 md:h-16"
          >
            <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="var(--line)" strokeDasharray="2 6" />
            <path
              ref={(el) => {
                paths.current[i] = el;
              }}
              d={pathFor(c.key, 0, 14)}
              fill="none"
              stroke="var(--ch)"
              strokeWidth="1.6"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="col-span-2 max-w-[38ch] text-[0.95rem] leading-snug text-[var(--ink-2)] md:col-span-1">{c.description}</span>
          <svg
            aria-hidden
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="col-start-2 row-start-1 text-[var(--ink-2)] transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[var(--ch)] md:col-start-auto md:row-start-auto"
          >
            <path d="M5 17 17 5M8 5h9v9" />
          </svg>
        </a>
      ))}
    </div>
  );
}
