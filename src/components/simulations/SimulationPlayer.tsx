"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import type { SimulationManifest, SimulationFrames } from "@/lib/simulations/types";
import { getColormapLUT } from "@/lib/simulations/colormaps";

/**
 * SIMULATION PLAYER
 *
 * Renders a pre-computed 2D grid animation (exported from a Python/
 * matplotlib simulation via scripts/simulations/export_frames.py) as
 * an interactive canvas with play/pause and a scrubber — the piece
 * of the architecture that lets an article embed a simulation
 * without re-implementing the physics in JavaScript.
 *
 * USAGE (inside an article body):
 *   <SimulationPlayer simulationId="game-of-life-gliders" />
 *
 * This fetches, in order:
 *   /simulations/<id>/manifest.json
 *   /simulations/<id>/<manifest.framesFile>
 * both served from /public/simulations/<id>/ — see the README in
 * src/lib/simulations/ for how those files get there.
 */

interface SimulationPlayerProps {
  simulationId: string;
  caption?: string;
  accent?: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; manifest: SimulationManifest; frames: Uint8Array[] };

function decodeFrame(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export default function SimulationPlayer({
  simulationId,
  caption,
  accent = "#e84834",
}: SimulationPlayerProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  // Load manifest + frame data once per simulationId
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    setFrameIndex(0);

    const base = `/simulations/${simulationId}`;

    (async () => {
      try {
        const manifestRes = await fetch(`${base}/manifest.json`);
        if (!manifestRes.ok) throw new Error(`manifest.json (${manifestRes.status})`);
        const manifest: SimulationManifest = await manifestRes.json();

        const framesRes = await fetch(`${base}/${manifest.framesFile}`);
        if (!framesRes.ok) throw new Error(`${manifest.framesFile} (${framesRes.status})`);
        const framesData: SimulationFrames = await framesRes.json();

        const frames = framesData.frames.map(decodeFrame);
        if (!cancelled) setState({ status: "ready", manifest, frames });
      } catch (err) {
        if (!cancelled) {
          setState({
            status: "error",
            message:
              err instanceof Error
                ? err.message
                : "Could not load simulation data",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [simulationId]);

  // Draw the current frame whenever it changes
  useEffect(() => {
    if (state.status !== "ready") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = state.manifest;
    const frame = state.frames[frameIndex];
    if (!frame) return;

    const lut = getColormapLUT(state.manifest.colormap);
    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < width * height; i++) {
      const v = frame[i] ?? 0;
      imageData.data[i * 4] = lut[v * 3];
      imageData.data[i * 4 + 1] = lut[v * 3 + 1];
      imageData.data[i * 4 + 2] = lut[v * 3 + 2];
      imageData.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }, [state, frameIndex]);

  // Playback loop, throttled to manifest.fps
  useEffect(() => {
    if (state.status !== "ready" || !playing) return;
    const fpsInterval = 1000 / Math.max(state.manifest.fps, 1);

    const tick = (time: number) => {
      if (time - lastTickRef.current >= fpsInterval) {
        lastTickRef.current = time;
        setFrameIndex((i) => (i + 1) % state.manifest.frameCount);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state, playing]);

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaying(false);
    setFrameIndex(Number(e.target.value));
  }, []);

  if (state.status === "loading") {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 aspect-square max-w-md mx-auto animate-pulse flex items-center justify-center">
        <span className="text-zinc-600 text-sm font-mono">Loading simulation…</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 text-center">
        <p className="text-zinc-500 text-sm">
          Couldn't load <code className="font-mono">{simulationId}</code>:{" "}
          {state.message}
        </p>
        <p className="text-zinc-600 text-xs mt-2">
          Check that <code className="font-mono">public/simulations/{simulationId}/</code> exists
          and has been exported (see the simulations README).
        </p>
      </div>
    );
  }

  const { manifest, frames } = state;

  return (
    <figure className="not-prose my-10">
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4 md:p-6">
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={manifest.width}
            height={manifest.height}
            className="w-full max-w-md rounded-lg border border-white/5"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-300"
            style={{ color: accent }}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setFrameIndex(0);
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400"
            aria-label="Restart"
          >
            <RotateCcw size={14} />
          </button>
          <input
            type="range"
            min={0}
            max={Math.max(manifest.frameCount - 1, 0)}
            value={frameIndex}
            onChange={handleScrub}
            className="flex-1 accent-current"
            style={{ color: accent }}
            aria-label="Frame scrubber"
          />
          <span className="font-mono text-xs text-zinc-500 w-16 text-right shrink-0">
            {frameIndex + 1}/{frames.length}
          </span>
        </div>
      </div>
      {caption && (
        <figcaption className="text-sm text-zinc-500 text-center mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
