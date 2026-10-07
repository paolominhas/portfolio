/**
 * OPTION PRICING ENGINE
 * ─────────────────────────────────────────────────────────────────
 * TypeScript port of the Python `optionlab` library behind
 * /research/option-pricing. Same maths, same conventions, so the
 * interactive tool on that page and the Python results table can be
 * compared number for number:
 *
 *   - Black–Scholes closed form for European calls and puts
 *   - Monte Carlo under geometric Brownian motion (with antithetic
 *     variates and a standard error)
 *   - Greeks by bump-and-reprice, with or without common random numbers
 *
 * Units match the Python library: vega is per 1.00 of volatility,
 * theta per year, rho per 1.00 of rate. The UI converts these to
 * per-vol-point / per-day / per-1% for display.
 *
 * Everything here is a pure function of its inputs (the random number
 * generator is seeded), so a given seed always gives the same paths.
 * That matters for the page: server render and client render agree, and
 * "re-roll" just means "use a different seed".
 */

export type OptionKind = "call" | "put";

export interface OptionParams {
  /** spot price */
  s0: number;
  /** strike */
  k: number;
  /** continuously compounded risk-free rate per year, e.g. 0.05 */
  r: number;
  /** volatility per sqrt-year, e.g. 0.2 */
  sigma: number;
  /** time to expiry in years */
  t: number;
  /** continuous dividend yield per year */
  q: number;
}

/** The reference case used throughout the Python results table. */
export const REFERENCE_CASE: OptionParams = {
  s0: 100,
  k: 100,
  r: 0.05,
  sigma: 0.2,
  t: 1,
  q: 0,
};

export interface Greeks {
  delta: number;
  gamma: number;
  /** per 1.00 of volatility */
  vega: number;
  /** per year */
  theta: number;
  /** per 1.00 of rate */
  rho: number;
}

/* ──────────────────────────── normal distribution ──────────────────────────── */

const SQRT_2PI = Math.sqrt(2 * Math.PI);

export function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / SQRT_2PI;
}

/**
 * Standard normal CDF (Hart's algorithm in the form given by West,
 * "Better approximations to cumulative normal functions", 2005). Absolute
 * error is below 1e-15 everywhere and relative error below 1e-12 for
 * |x| <= 4, checked against scipy.stats.norm.cdf in scripts/check-options.ts.
 * Far in the tails (|x| > 6) the relative error is ~1e-8, where the value
 * itself is below 1e-9, so it has no effect on prices.
 */
export function normCdf(x: number): number {
  const xabs = Math.abs(x);
  let c: number;
  if (xabs > 37) {
    c = 0;
  } else {
    const e = Math.exp((-xabs * xabs) / 2);
    if (xabs < 7.07106781186547) {
      let b = 3.52624965998911e-2 * xabs + 0.700383064443688;
      b = b * xabs + 6.37396220353165;
      b = b * xabs + 33.912866078383;
      b = b * xabs + 112.079291497871;
      b = b * xabs + 221.213596169931;
      b = b * xabs + 220.206867912376;
      c = e * b;
      b = 8.83883476483184e-2 * xabs + 1.75566716318264;
      b = b * xabs + 16.064177579207;
      b = b * xabs + 86.7807322029461;
      b = b * xabs + 296.564248779674;
      b = b * xabs + 637.333633378831;
      b = b * xabs + 793.826512519948;
      b = b * xabs + 440.413735824752;
      c = c / b;
    } else {
      let b = xabs + 0.65;
      b = xabs + 4 / b;
      b = xabs + 3 / b;
      b = xabs + 2 / b;
      b = xabs + 1 / b;
      c = e / b / 2.506628274631;
    }
  }
  return x > 0 ? 1 - c : c;
}

/* ──────────────────────────── Black–Scholes ──────────────────────────── */

function d1d2(p: OptionParams): [number, number] {
  const volSqrtT = p.sigma * Math.sqrt(p.t);
  const d1 =
    (Math.log(p.s0 / p.k) + (p.r - p.q + 0.5 * p.sigma * p.sigma) * p.t) /
    volSqrtT;
  return [d1, d1 - volSqrtT];
}

export function payoff(s: number, k: number, kind: OptionKind): number {
  return kind === "call" ? Math.max(s - k, 0) : Math.max(k - s, 0);
}

export function bsPrice(p: OptionParams, kind: OptionKind): number {
  const [d1, d2] = d1d2(p);
  const discS = p.s0 * Math.exp(-p.q * p.t);
  const discK = p.k * Math.exp(-p.r * p.t);
  return kind === "call"
    ? discS * normCdf(d1) - discK * normCdf(d2)
    : discK * normCdf(-d2) - discS * normCdf(-d1);
}

export function bsGreeks(p: OptionParams, kind: OptionKind): Greeks {
  const [d1, d2] = d1d2(p);
  const sqrtT = Math.sqrt(p.t);
  const eq = Math.exp(-p.q * p.t);
  const er = Math.exp(-p.r * p.t);
  const pdf = normPdf(d1);

  const gamma = (eq * pdf) / (p.s0 * p.sigma * sqrtT);
  const vega = p.s0 * eq * pdf * sqrtT;
  const decay = (-p.s0 * eq * pdf * p.sigma) / (2 * sqrtT);

  if (kind === "call") {
    return {
      delta: eq * normCdf(d1),
      gamma,
      vega,
      theta: decay - p.r * p.k * er * normCdf(d2) + p.q * p.s0 * eq * normCdf(d1),
      rho: p.k * p.t * er * normCdf(d2),
    };
  }
  return {
    delta: -eq * normCdf(-d1),
    gamma,
    vega,
    theta: decay + p.r * p.k * er * normCdf(-d2) - p.q * p.s0 * eq * normCdf(-d1),
    rho: -p.k * p.t * er * normCdf(-d2),
  };
}

/** Risk-neutral probability that the option finishes in the money. */
export function probInTheMoney(p: OptionParams, kind: OptionKind): number {
  const [, d2] = d1d2(p);
  return kind === "call" ? normCdf(d2) : normCdf(-d2);
}

/** Risk-neutral (lognormal) density of the terminal price S_T at x. */
export function terminalDensity(p: OptionParams, x: number): number {
  if (x <= 0) return 0;
  const m = Math.log(p.s0) + (p.r - p.q - 0.5 * p.sigma * p.sigma) * p.t;
  const s = p.sigma * Math.sqrt(p.t);
  const z = (Math.log(x) - m) / s;
  return Math.exp(-0.5 * z * z) / (x * s * SQRT_2PI);
}

/* ──────────────────────────── random numbers ──────────────────────────── */

/** Small, fast, seedable uniform generator on [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** n standard-normal draws (Box–Muller), reproducible from the seed. */
export function standardNormals(n: number, seed: number): Float64Array {
  const rand = mulberry32(seed);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i += 2) {
    const u1 = 1 - rand(); // in (0, 1], so log() is finite
    const u2 = rand();
    const r = Math.sqrt(-2 * Math.log(u1));
    const theta = 2 * Math.PI * u2;
    out[i] = r * Math.cos(theta);
    if (i + 1 < n) out[i + 1] = r * Math.sin(theta);
  }
  return out;
}

/* ──────────────────────────── Monte Carlo ──────────────────────────── */

export interface McResult {
  price: number;
  stdErr: number;
  nPaths: number;
}

/**
 * Monte Carlo price from supplied standard-normal draws `z`.
 *
 * With `antithetic`, each draw Z is paired with −Z and the pair is
 * averaged; the pair averages are the independent samples, so the
 * standard error uses z.length samples while nPaths reports 2·z.length.
 * Supplying `z` (instead of a seed) is what lets the Greeks reuse the
 * same random numbers across bumped prices.
 */
export function mcPrice(
  p: OptionParams,
  kind: OptionKind,
  z: Float64Array,
  antithetic = false,
): McResult {
  const drift = (p.r - p.q - 0.5 * p.sigma * p.sigma) * p.t;
  const volSqrtT = p.sigma * Math.sqrt(p.t);
  const disc = Math.exp(-p.r * p.t);
  const m = z.length;

  let sum = 0;
  let sumSq = 0;
  for (let i = 0; i < m; i++) {
    const e = volSqrtT * z[i];
    let pay = payoff(p.s0 * Math.exp(drift + e), p.k, kind);
    if (antithetic) pay = 0.5 * (pay + payoff(p.s0 * Math.exp(drift - e), p.k, kind));
    const x = disc * pay;
    sum += x;
    sumSq += x * x;
  }
  const mean = sum / m;
  const variance = Math.max((sumSq - m * mean * mean) / (m - 1), 0);
  return {
    price: mean,
    stdErr: Math.sqrt(variance / m),
    nPaths: antithetic ? 2 * m : m,
  };
}

export interface RunningPoint {
  n: number;
  price: number;
  stdErr: number;
}

/**
 * The Monte Carlo estimate as it builds up along one stream of draws,
 * recorded at each checkpoint (a count of z-samples consumed). This is
 * the "running average settling onto the answer" picture.
 */
export function runningEstimate(
  p: OptionParams,
  kind: OptionKind,
  z: Float64Array,
  antithetic: boolean,
  checkpoints: number[],
): RunningPoint[] {
  const drift = (p.r - p.q - 0.5 * p.sigma * p.sigma) * p.t;
  const volSqrtT = p.sigma * Math.sqrt(p.t);
  const disc = Math.exp(-p.r * p.t);
  const out: RunningPoint[] = [];

  let sum = 0;
  let sumSq = 0;
  let next = 0;
  for (let i = 0; i < z.length && next < checkpoints.length; i++) {
    const e = volSqrtT * z[i];
    let pay = payoff(p.s0 * Math.exp(drift + e), p.k, kind);
    if (antithetic) pay = 0.5 * (pay + payoff(p.s0 * Math.exp(drift - e), p.k, kind));
    const x = disc * pay;
    sum += x;
    sumSq += x * x;
    const m = i + 1;
    if (m === checkpoints[next]) {
      const mean = sum / m;
      const variance = m > 1 ? Math.max((sumSq - m * mean * mean) / (m - 1), 0) : 0;
      out.push({
        n: antithetic ? 2 * m : m,
        price: mean,
        stdErr: Math.sqrt(variance / m),
      });
      next++;
    }
  }
  return out;
}

/** Terminal prices S_T for each draw. */
export function terminalPrices(p: OptionParams, z: Float64Array): Float64Array {
  const drift = (p.r - p.q - 0.5 * p.sigma * p.sigma) * p.t;
  const volSqrtT = p.sigma * Math.sqrt(p.t);
  const out = new Float64Array(z.length);
  for (let i = 0; i < z.length; i++) out[i] = p.s0 * Math.exp(drift + volSqrtT * z[i]);
  return out;
}

/**
 * `nPaths` full GBM paths on `steps` equal time steps (exact stepping, so
 * the step count only affects how smooth the picture looks). Row-major:
 * path i occupies [i·(steps+1), (i+1)·(steps+1)).
 */
export function simulatePaths(
  p: OptionParams,
  nPaths: number,
  steps: number,
  seed: number,
): Float64Array {
  const dt = p.t / steps;
  const drift = (p.r - p.q - 0.5 * p.sigma * p.sigma) * dt;
  const vol = p.sigma * Math.sqrt(dt);
  const z = standardNormals(nPaths * steps, seed);
  const out = new Float64Array(nPaths * (steps + 1));
  for (let i = 0; i < nPaths; i++) {
    let s = p.s0;
    const base = i * (steps + 1);
    out[base] = s;
    for (let j = 0; j < steps; j++) {
      s *= Math.exp(drift + vol * z[i * steps + j]);
      out[base + j + 1] = s;
    }
  }
  return out;
}

/* ──────────────────────────── finite-difference Greeks ──────────────────────────── */

export interface FdOptions {
  nPaths: number;
  seed: number;
  /** relative bump to spot, e.g. 0.01 = 1% */
  spotBump: number;
  /** absolute bump to volatility, e.g. 0.01 = one vol point */
  volBump: number;
  antithetic: boolean;
  /** reuse the same random numbers for every bumped price */
  crn: boolean;
}

export interface FdGreeks {
  delta: number;
  gamma: number;
  /** per 1.00 of volatility */
  vega: number;
}

/**
 * Delta, gamma and vega by central finite differences on the Monte Carlo
 * price. With `crn: false` every bumped price draws fresh random numbers,
 * and the Monte Carlo noise swamps the small price change being measured.
 */
export function fdGreeks(p: OptionParams, kind: OptionKind, o: FdOptions): FdGreeks {
  const m = o.antithetic ? Math.floor(o.nPaths / 2) : o.nPaths;
  const common = standardNormals(m, o.seed);
  let call = 0;
  const price = (q: OptionParams): number => {
    const z = o.crn ? common : standardNormals(m, o.seed + 7919 * (++call));
    return mcPrice(q, kind, z, o.antithetic).price;
  };

  const h = o.spotBump * p.s0;
  const base = price(p);
  const up = price({ ...p, s0: p.s0 + h });
  const dn = price({ ...p, s0: p.s0 - h });
  const vUp = price({ ...p, sigma: p.sigma + o.volBump });
  const vDn = price({ ...p, sigma: p.sigma - o.volBump });

  return {
    delta: (up - dn) / (2 * h),
    gamma: (up - 2 * base + dn) / (h * h),
    vega: (vUp - vDn) / (2 * o.volBump),
  };
}
