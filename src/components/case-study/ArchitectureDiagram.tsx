"use client";

import { useEffect, useMemo, useState } from "react";
import { archEdges, archNodes, type ArchNode } from "@/data/euco-ticketing-case-study";

const W = 150;
const H = 64;

const KIND_STYLE: Record<ArchNode["kind"], { fill: string; stroke: string }> = {
  people: { fill: "#27272a", stroke: "#a1a1aa" },
  front: { fill: "#1e1b4b", stroke: "#818cf8" },
  core: { fill: "#312e81", stroke: "#a5b4fc" },
  store: { fill: "#022c22", stroke: "#34d399" },
  external: { fill: "#3b0764", stroke: "#c084fc" },
};

// The order in which edges light up for "Trace a purchase".
const TRACE: [string, string][] = [
  ["main", "tickets"],
  ["tickets", "api"],
  ["directus", "api"],
  ["api", "db"],
  ["api", "stripe"],
  ["stripe", "api"],
  ["api", "resend"],
];

const centre = (n: ArchNode) => ({ x: n.x + W / 2, y: n.y + H / 2 });

/** Where a line from this node's centre towards (tx,ty) leaves its rectangle. */
function edgePoint(n: ArchNode, tx: number, ty: number) {
  const c = centre(n);
  const dx = tx - c.x;
  const dy = ty - c.y;
  const sx = dx === 0 ? Infinity : W / 2 / Math.abs(dx);
  const sy = dy === 0 ? Infinity : H / 2 / Math.abs(dy);
  const s = Math.min(sx, sy);
  return { x: c.x + dx * s, y: c.y + dy * s };
}

export default function ArchitectureDiagram() {
  const [selected, setSelected] = useState<string>("api");
  const [traceIdx, setTraceIdx] = useState<number | null>(null);

  useEffect(() => {
    if (traceIdx === null) return;
    if (traceIdx >= TRACE.length) {
      const t = setTimeout(() => setTraceIdx(null), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTraceIdx(traceIdx + 1), 900);
    return () => clearTimeout(t);
  }, [traceIdx]);

  const byId = useMemo(() => Object.fromEntries(archNodes.map((n) => [n.id, n])), []);
  const node = byId[selected];
  const traceNow = traceIdx !== null && traceIdx < TRACE.length ? TRACE[traceIdx] : null;

  const edges = archEdges.map((e, i) => {
    const a = byId[e.from];
    const b = byId[e.to];
    const reverse = archEdges.some((o) => o.from === e.to && o.to === e.from);
    const ca = centre(a);
    const cb = centre(b);
    const len = Math.hypot(cb.x - ca.x, cb.y - ca.y) || 1;
    const off = reverse ? 9 : 0;
    const ox = (-(cb.y - ca.y) / len) * off;
    const oy = ((cb.x - ca.x) / len) * off;
    const p1 = edgePoint(a, cb.x + ox, cb.y + oy);
    const p2 = edgePoint(b, ca.x + ox, ca.y + oy);
    const connected = e.from === selected || e.to === selected;
    const tracing = !!traceNow && traceNow[0] === e.from && traceNow[1] === e.to;
    const t = e.t ?? 0.5;
    return { ...e, i, t, p1: { x: p1.x + ox, y: p1.y + oy }, p2: { x: p2.x + ox, y: p2.y + oy }, connected, tracing };
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setTraceIdx(0)}
          disabled={traceIdx !== null}
          className="text-sm px-4 py-2 rounded-lg border border-white/15 bg-zinc-900 text-zinc-200 hover:border-indigo-400/60 disabled:opacity-60 transition-colors"
        >
          {traceIdx === null ? "▶ Trace a ticket purchase" : "Tracing…"}
        </button>
        <span className="text-xs text-zinc-500">
          {traceNow ? `${byId[traceNow[0]].label} → ${byId[traceNow[1]].label}: ${archEdges.find((e) => e.from === traceNow[0] && e.to === traceNow[1])?.label}` : "Or select any box."}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-zinc-900/40">
        <svg viewBox="0 0 1010 420" className="min-w-[760px] w-full h-auto" role="group" aria-label="EUCO ticketing architecture diagram">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="currentColor" />
            </marker>
          </defs>
          {edges.map((e) => {
            const hot = e.tracing || e.connected;
            const colour = e.tracing ? "#fbbf24" : e.connected ? "#818cf8" : "#52525b";
            return (
              <g key={e.i} style={{ color: colour }} opacity={traceNow && !e.tracing ? 0.25 : hot ? 1 : 0.55}>
                <line x1={e.p1.x} y1={e.p1.y} x2={e.p2.x} y2={e.p2.y} stroke={colour} strokeWidth={e.tracing ? 3 : hot ? 2 : 1.25} markerEnd="url(#arr)" />
                {(e.connected || e.tracing) && (
                  <text x={e.p1.x + (e.p2.x - e.p1.x) * e.t} y={e.p1.y + (e.p2.y - e.p1.y) * e.t - 6} textAnchor="middle" fontSize="12" fill={colour} className="font-mono" stroke="#09090b" strokeWidth="4" paintOrder="stroke">
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}
          {archNodes.map((n) => {
            const st = KIND_STYLE[n.kind];
            const active = n.id === selected;
            const tracing = !!traceNow && (traceNow[0] === n.id || traceNow[1] === n.id);
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={`${n.label}: ${n.owns}`}
                onClick={() => setSelected(n.id)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setSelected(n.id);
                  }
                }}
                className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-white"
              >
                <rect x={n.x} y={n.y} width={W} height={H} rx={12} fill={st.fill} stroke={tracing ? "#fbbf24" : active ? "#ffffff" : st.stroke} strokeWidth={active || tracing ? 2.5 : 1.25} />
                <text x={n.x + W / 2} y={n.y + 28} textAnchor="middle" fontSize="14" fontWeight="600" fill="#fafafa">{n.label}</text>
                <text x={n.x + W / 2} y={n.y + 47} textAnchor="middle" fontSize="11" fill="#a1a1aa">{n.sub}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-6" aria-live="polite">
        <h3 className="text-xl font-semibold text-white mb-1">{node.label}</h3>
        <p className="text-sm font-mono text-indigo-300 mb-3">Owns: {node.owns}</p>
        <p className="text-zinc-400 leading-relaxed">{node.detail}</p>
      </div>
    </div>
  );
}
