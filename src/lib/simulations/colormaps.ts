import type { ColormapName } from "./types";

/**
 * COLORMAPS
 *
 * Builds a 256-entry RGB lookup table for each supported colormap, so
 * SimulationPlayer can map a single byte (0-255) straight to a pixel
 * colour without recomputing anything per-frame. Chosen to visually
 * match the matplotlib colormaps these simulations are usually
 * rendered with locally, so the web version looks like the same
 * figure rather than a re-skinned one:
 *
 *   grayscale → matplotlib "gray"     (continuous fields, e.g. Poisson potential)
 *   binary    → matplotlib "binary"-ish, hard black/white (Game of Life)
 *   viridis   → matplotlib "viridis"  (general-purpose perceptual)
 *   coolwarm  → matplotlib "coolwarm" / "RdBu" (diverging — Ising spins, Cahn-Hilliard)
 */

type RGB = [number, number, number];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/** Build a 256-entry LUT from a set of (position 0-1, color) control points. */
function buildLUT(stops: [number, RGB][]): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    // Find the two stops bracketing t
    let lo = stops[0];
    let hi = stops[stops.length - 1];
    for (let s = 0; s < stops.length - 1; s++) {
      if (t >= stops[s][0] && t <= stops[s + 1][0]) {
        lo = stops[s];
        hi = stops[s + 1];
        break;
      }
    }
    const span = hi[0] - lo[0];
    const localT = span === 0 ? 0 : (t - lo[0]) / span;
    const [r, g, b] = lerpColor(lo[1], hi[1], localT);
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }
  return lut;
}

// A handful of key viridis control points (sampled from matplotlib's viridis).
const VIRIDIS_STOPS: [number, RGB][] = [
  [0.0, [68, 1, 84]],
  [0.13, [72, 40, 120]],
  [0.25, [62, 74, 137]],
  [0.38, [49, 104, 142]],
  [0.5, [38, 130, 142]],
  [0.63, [31, 158, 137]],
  [0.75, [53, 183, 121]],
  [0.88, [110, 206, 88]],
  [1.0, [253, 231, 37]],
];

// matplotlib "coolwarm": blue at 0, near-white in the middle, red at 1.
const COOLWARM_STOPS: [number, RGB][] = [
  [0.0, [59, 76, 192]],
  [0.25, [123, 158, 249]],
  [0.5, [240, 236, 235]],
  [0.75, [242, 132, 100]],
  [1.0, [180, 4, 38]],
];

const GRAYSCALE_STOPS: [number, RGB][] = [
  [0.0, [0, 0, 0]],
  [1.0, [255, 255, 255]],
];

const lutCache = new Map<ColormapName, Uint8ClampedArray>();

export function getColormapLUT(name: ColormapName): Uint8ClampedArray {
  const cached = lutCache.get(name);
  if (cached) return cached;

  let lut: Uint8ClampedArray;
  switch (name) {
    case "viridis":
      lut = buildLUT(VIRIDIS_STOPS);
      break;
    case "coolwarm":
      lut = buildLUT(COOLWARM_STOPS);
      break;
    case "binary":
      // Hard threshold rather than a gradient — crisp cells for
      // 0/1 grids like Game of Life, instead of a blurred gray edge.
      lut = new Uint8ClampedArray(256 * 3);
      for (let i = 0; i < 256; i++) {
        const v = i < 128 ? 0 : 255; // low → black, high → white
        lut[i * 3] = v;
        lut[i * 3 + 1] = v;
        lut[i * 3 + 2] = v;
      }
      break;
    case "grayscale":
    default:
      lut = buildLUT(GRAYSCALE_STOPS);
      break;
  }

  lutCache.set(name, lut);
  return lut;
}
