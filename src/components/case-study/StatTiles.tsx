"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/data/euco-ticketing-case-study";

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(to);
      return;
    }
    const controls = animate(0, to, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, reduce]);

  return <span ref={ref}>{n.toLocaleString("en-GB")}</span>;
}

export default function StatTiles({ stats, liveUpdatedAt }: { stats: (Stat & { live?: boolean })[]; liveUpdatedAt?: string }) {
  const shown = stats.filter((s) => s.value !== null);
  if (!shown.length) return null;
  const anyLive = shown.some((s) => s.live);
  let when = "";
  if (liveUpdatedAt) {
    const d = new Date(liveUpdatedAt);
    if (!Number.isNaN(d.getTime())) when = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" });
  }
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {shown.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
            <div className="text-3xl font-bold text-white tabular-nums">
              <CountUp to={s.value as number} />
              {s.suffix}
            </div>
            <div className="text-xs text-zinc-400 mt-1">{s.label}</div>
            {s.live && <div className="text-[10px] uppercase tracking-widest text-emerald-400 mt-2">live</div>}
          </div>
        ))}
      </div>
      {anyLive && when && <p className="text-xs text-zinc-500 mt-3">Live totals from the EUCO platform, refreshed hourly. Last read {when}. Totals only, no personal data.</p>}
    </div>
  );
}
