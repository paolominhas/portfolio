"use client";

import { useEffect, useRef } from "react";
import {
  createGrid,
  sweep,
  totalEnergy,
  magnetisation,
  type Dynamics,
} from "@/lib/physics/ising";

/**
 * ISING CANVAS
 * ─────────────────────────────────────────────────────────────────
 * Owns the grid state and the requestAnimationFrame loop; the ising.ts
 * physics engine has no idea a DOM exists. Renders at native N×N
 * pixel resolution with `image-rendering: pixelated` and lets CSS
 * scale it up — same technique SimulationPlayer already uses for the
 * pre-rendered article clips, kept consistent here.
 *
 * Colour choice: rather than a generic diverging colormap, up/down
 * spins are painted directly in the site's `ember`/`kelp` accent
 * colours (see tailwind.config.ts) — so the simulation's own output
 * doubles as the page's visual identity instead of looking like a
 * borrowed matplotlib figure.
 *
 * Live parameters (temperature, J, h, dynamics, running, speed) are
 * mirrored into a ref on every render and read from inside the RAF
 * loop, rather than being effect dependencies — restarting the loop
 * on every slider tick would both be wasteful and would reset
 * `lastStatsFrame`'s timing. The loop itself is only created once per
 * mount (plus whenever N or resetKey changes, which re-seeds the grid
 * and legitimately should restart it).
 */

interface IsingCanvasProps {
  N?: number;
  temperature: number;
  J: number;
  h: number;
  dynamics: Dynamics;
  running: boolean;
  speed: number; // sweeps attempted per animation frame
  resetKey: number; // bump this to force a fresh random grid
  onStats?: (stats: { magnetisation: number; energy: number; sweeps: number }) => void;
}

const UP_COLOR: [number, number, number] = [255, 107, 61]; // ember
const DOWN_COLOR: [number, number, number] = [47, 158, 124]; // kelp

export default function IsingCanvas({
  N = 60,
  temperature,
  J,
  h,
  dynamics,
  running,
  speed,
  resetKey,
  onStats,
}: IsingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Int8Array | null>(null);
  const rafRef = useRef<number | null>(null);
  const sweepCountRef = useRef(0);
  const frameCounterRef = useRef(0);

  // Live params, read inside the loop without retriggering effects.
  const paramsRef = useRef({ temperature, J, h, dynamics, running, speed });
  paramsRef.current = { temperature, J, h, dynamics, running, speed };

  // (Re)seed the grid and (re)start the loop whenever N or resetKey changes.
  useEffect(() => {
    const grid = createGrid(N);
    gridRef.current = grid;
    sweepCountRef.current = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paint = () => {
      const g = gridRef.current;
      if (!g) return;
      const imageData = ctx.createImageData(N, N);
      for (let k = 0; k < N * N; k++) {
        const [r, gr, b] = g[k] === 1 ? UP_COLOR : DOWN_COLOR;
        imageData.data[k * 4] = r;
        imageData.data[k * 4 + 1] = gr;
        imageData.data[k * 4 + 2] = b;
        imageData.data[k * 4 + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    paint(); // draw the fresh grid immediately, even if paused

    const tick = () => {
      const p = paramsRef.current;
      const g = gridRef.current;
      if (g && p.running) {
        const beta = p.temperature > 0 ? 1 / p.temperature : Infinity;
        for (let s = 0; s < p.speed; s++) {
          sweep(g, N, p.dynamics, beta, p.J, p.h);
          sweepCountRef.current += 1;
        }
        paint();

        // Report stats ~10x/second rather than every frame, so the
        // parent's slider/readout re-renders don't fight the RAF loop.
        frameCounterRef.current += 1;
        if (onStats && frameCounterRef.current % 6 === 0) {
          onStats({
            magnetisation: magnetisation(g, N) / (N * N),
            energy: totalEnergy(g, N, p.J, p.h) / (N * N),
            sweeps: sweepCountRef.current,
          });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only N/resetKey should restart the loop
  }, [N, resetKey]);

  return (
    <canvas
      ref={canvasRef}
      width={N}
      height={N}
      className="w-full h-full rounded-lg"
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label="Live Ising model spin grid"
    />
  );
}
