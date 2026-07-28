/**
 * SIMULATION DATA TYPES
 *
 * These types describe the on-disk format written by
 * `scripts/simulations/export_frames.py` and read by
 * `SimulationPlayer.tsx`. See `src/lib/simulations/README.md` for the
 * full pipeline this fits into.
 *
 * FORMAT SUMMARY — for a simulation with id "<id>", the exporter
 * writes two files to `public/simulations/<id>/`:
 *
 *   manifest.json   → SimulationManifest (below)
 *   frames.json      → SimulationFrames  (below)
 *
 * Each frame is a base64-encoded string of raw bytes: one uint8 per
 * grid cell (row-major, top-to-bottom, left-to-right), representing
 * the cell's value normalised into the 0–255 range using the
 * manifest's `valueRange`. The player decodes each frame back into a
 * Uint8Array and maps it through a colormap LUT to paint a canvas.
 *
 * This keeps a single 2D grid frame at width×height bytes — a
 * 64×64 grid is 4KB/frame, so even a few hundred frames stays small
 * enough to ship as a static JSON file. For much larger grids or
 * frame counts, see the "scaling up" note in the README (typed
 * arrays + gzip, or splitting into a binary .bin file, get you
 * another 5-10x before you'd need anything fancier).
 */

export type ColormapName = "grayscale" | "binary" | "viridis" | "coolwarm";

export interface SimulationManifest {
  /** Matches the folder name under public/simulations/ */
  id: string;
  title: string;
  description?: string;
  width: number;
  height: number;
  frameCount: number;
  /** Playback speed for the live player, in frames per second. */
  fps: number;
  colormap: ColormapName;
  /**
   * The real (pre-normalisation) min/max of the underlying data —
   * e.g. [-1, 1] for Ising spins, [0, 1] for a Cahn-Hilliard
   * concentration field. Used only for axis/legend labels; the pixel
   * data itself is always pre-normalised to 0-255 by the exporter.
   */
  valueRange: [number, number];
  /** Filename (relative to the manifest) holding the frame data. */
  framesFile: string;
  /** Optional: relevant simulation parameters to display as metadata (e.g. { "L": 50, "T": 2.3 }). */
  parameters?: Record<string, string | number>;
}

export interface SimulationFrames {
  /** One base64 string per frame; each decodes to width*height bytes. */
  frames: string[];
}
