/**
 * Neutrino oscillation probabilities in the 3 and 3+1 models, in vacuum or constant-density matter.
 *
 * This follows the convention of the SNU library (J. Kopp) that the GLoBES project used, so that the
 * numbers can be compared directly with the GLoBES output files in the repository:
 *
 *   U = R(i1 j1, δ_k1) · R(i2 j2, δ_k2) ⋯        rotation order and phase order as in Appendix B of the report
 *   H = (1/E) · U · diag(0, Δm²21, Δm²31, Δm²41)/2 · U†  +  V_matter
 *   V_matter = diag(V_e − V_n, −V_n, −V_n, 0),  V_e = ρ · 7.5×10⁻¹⁴ eV · Y_e,  V_n = ρ · 7.5×10⁻¹⁴ eV · (1 − Y_e)/2
 *   S = exp(−i H L)       P(ν_α → ν_β) = |S_βα|²       antineutrinos: H → H*
 *
 * with Y_e = 0.5 (what snu.c uses), E in eV and L in eV⁻¹ (1 km = 5.0677307×10⁹ eV⁻¹).
 *
 * The matrix exponential is done by scaling and squaring, which is exact enough here and needs no
 * eigen-solver. It was checked against numpy's eigh-based version and against the GLoBES output
 * file probabitity_out3_cp0.dat (100 energies: median difference 8×10⁻⁷, worst 3×10⁻⁴ at 0.115 GeV where the
 * oscillation is fastest); see data/globes.ts → VALIDATION.
 */

export const KM_TO_EV = 5.0677307e9;
export const V_FACTOR = 7.5e-14;
export const Y_E = 0.5;

export interface StdParams {
  t12: number; // radians
  t13: number;
  t23: number;
  dcp: number; // radians
  d21: number; // eV²
  d31: number; // eV² (negative = inverted ordering)
}

export interface Sterile {
  d41: number; // eV²
  t14: number;
  t24: number;
  t34: number;
  d1: number; // sterile phases (radians)
  d2: number;
}

export const NUFIT = {
  s2t12: 0.307,
  s2t13: 0.02195,
  s2t23: 0.561,
  d21: 7.49e-5,
  d31no: 2.534e-3,
  d31io: -2.51e-3,
};

export function stdParams(dcpDeg: number, ordering: "NO" | "IO" = "NO"): StdParams {
  return {
    t12: Math.asin(Math.sqrt(NUFIT.s2t12)),
    t13: Math.asin(Math.sqrt(NUFIT.s2t13)),
    t23: Math.asin(Math.sqrt(NUFIT.s2t23)),
    dcp: (dcpDeg * Math.PI) / 180,
    d21: NUFIT.d21,
    d31: ordering === "NO" ? NUFIT.d31no : NUFIT.d31io,
  };
}

/* ---------- tiny complex matrices: Float64Array of length 2*n*n, row-major [re, im] ---------- */

type CM = Float64Array;
const cm = (n: number) => new Float64Array(2 * n * n);
const eye = (n: number): CM => {
  const m = cm(n);
  for (let i = 0; i < n; i++) m[2 * (i * n + i)] = 1;
  return m;
};

function mul(a: CM, b: CM, n: number, out: CM = cm(n)): CM {
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let re = 0;
      let im = 0;
      for (let k = 0; k < n; k++) {
        const ar = a[2 * (i * n + k)];
        const ai = a[2 * (i * n + k) + 1];
        const br = b[2 * (k * n + j)];
        const bi = b[2 * (k * n + j) + 1];
        re += ar * br - ai * bi;
        im += ar * bi + ai * br;
      }
      out[2 * (i * n + j)] = re;
      out[2 * (i * n + j) + 1] = im;
    }
  }
  return out;
}

/** The mixing matrix for a given rotation order, exactly as snu.c multiplies it together. */
export function mixingMatrix(
  n: number,
  rot: [number, number][],
  ph: number[],
  th: Record<string, number>,
  de: number[]
): CM {
  let U = eye(n);
  for (let r = 0; r < rot.length; r++) {
    const [u1, v1] = rot[r];
    const u = u1 - 1;
    const v = v1 - 1;
    const ang = th[`${u1}${v1}`] ?? 0;
    const c = Math.cos(ang);
    let sr = Math.sin(ang);
    let si = 0;
    if (ph[r] >= 0) {
      const d = de[ph[r]] ?? 0;
      // s * exp(-i d)
      const cr = Math.cos(d);
      const ci = -Math.sin(d);
      const nr = sr * cr - si * ci;
      const ni = sr * ci + si * cr;
      sr = nr;
      si = ni;
    }
    const R = eye(n);
    R[2 * (u * n + u)] = c;
    R[2 * (v * n + v)] = c;
    R[2 * (u * n + v)] = sr;
    R[2 * (u * n + v) + 1] = si;
    R[2 * (v * n + u)] = -sr;
    R[2 * (v * n + u) + 1] = si; // -conj(s) = (-sr, +si)
    U = mul(U, R, n);
  }
  return U;
}

export const ROT3: [number, number][] = [[2, 3], [1, 3], [1, 2]];
export const PH3 = [-1, 0, -1];
export const ROT4: [number, number][] = [[3, 4], [2, 4], [1, 4], [2, 3], [1, 3], [1, 2]];
export const PH4 = [-1, 2, 1, -1, 0, -1];

export function buildU(p: StdParams, s?: Sterile | null): { U: CM; dm: number[]; n: number } {
  const th: Record<string, number> = { "12": p.t12, "13": p.t13, "23": p.t23 };
  if (!s) return { U: mixingMatrix(3, ROT3, PH3, th, [p.dcp]), dm: [0, p.d21, p.d31], n: 3 };
  th["14"] = s.t14;
  th["24"] = s.t24;
  th["34"] = s.t34;
  return { U: mixingMatrix(4, ROT4, PH4, th, [p.dcp, s.d1, s.d2]), dm: [0, p.d21, p.d31, s.d41], n: 4 };
}

/** exp(-i H L) for a Hermitian H, by scaling and squaring. `A` is overwritten with -i H L. */
function expm(A: CM, n: number): CM {
  let norm = 0;
  for (let i = 0; i < n; i++) {
    let row = 0;
    for (let j = 0; j < n; j++) row += Math.hypot(A[2 * (i * n + j)], A[2 * (i * n + j) + 1]);
    norm = Math.max(norm, row);
  }
  let s = 0;
  while (norm > 0.25) {
    norm /= 2;
    s++;
  }
  const f = 1 / 2 ** s;
  for (let k = 0; k < A.length; k++) A[k] *= f;
  // Taylor series
  let term = eye(n);
  const sum = eye(n);
  for (let k = 1; k <= 14; k++) {
    const next = mul(term, A, n);
    for (let q = 0; q < next.length; q++) next[q] /= k;
    term = next;
    for (let q = 0; q < sum.length; q++) sum[q] += term[q];
  }
  let S = sum;
  for (let k = 0; k < s; k++) S = mul(S, S, n);
  return S;
}

export interface ProbInput {
  E: number; // GeV
  L: number; // km
  rho: number; // g/cm³ (0 = vacuum)
  p: StdParams;
  sterile?: Sterile | null;
  anti?: boolean;
}

/** Prepare once per parameter set, then evaluate at many energies. */
export function makeEngine(p: StdParams, sterile?: Sterile | null) {
  const { U, dm, n } = buildU(p, sterile);
  // H0 = U diag(dm/2) U†  (units eV², to be divided by E in eV)
  const D = cm(n);
  for (let i = 0; i < n; i++) D[2 * (i * n + i)] = 0.5 * dm[i];
  const Ud = cm(n);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      Ud[2 * (i * n + j)] = U[2 * (j * n + i)];
      Ud[2 * (i * n + j) + 1] = -U[2 * (j * n + i) + 1];
    }
  const H0 = mul(mul(U, D, n), Ud, n);

  /** Returns P[alpha*n + beta] = P(ν_alpha → ν_beta). */
  function probs(E: number, L: number, rho: number, anti = false): Float64Array {
    const Ee = E * 1e9;
    const Ve = rho * V_FACTOR * Y_E;
    const Vn = (rho * V_FACTOR * (1 - Y_E)) / 2;
    const A = cm(n);
    const Lev = L * KM_TO_EV;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        let hr = H0[2 * (i * n + j)] / Ee;
        let hi = H0[2 * (i * n + j) + 1] / Ee;
        if (i === j) {
          // matter potential: opposite sign for antineutrinos (snu.c uses cp_sign * rho * ...)
          const sgn = anti ? -1 : 1;
          if (i === 0) hr += sgn * (Ve - Vn);
          else if (i < 3) hr -= sgn * Vn;
        }
        if (anti) hi = -hi;
        // -i * H * L  =  (hi*L) + i(-hr*L)
        A[2 * (i * n + j)] = hi * Lev;
        A[2 * (i * n + j) + 1] = -hr * Lev;
      }
    const S = expm(A, n);
    const P = new Float64Array(n * n);
    for (let a = 0; a < n; a++)
      for (let b = 0; b < n; b++) {
        const re = S[2 * (b * n + a)];
        const im = S[2 * (b * n + a) + 1];
        P[a * n + b] = re * re + im * im;
      }
    return P;
  }
  return { n, probs, U };
}

export const FLAV = { e: 0, mu: 1, tau: 2, s: 3 } as const;

/** Two-flavour vacuum formula, P = sin²2θ sin²(1.267 Δm² L/E), L in km, E in GeV. */
export function twoFlavour(sin2_2theta: number, dm2: number, Lkm: number, EGeV: number) {
  const x = 1.267 * dm2 * Lkm / EGeV;
  return sin2_2theta * Math.sin(x) ** 2;
}
