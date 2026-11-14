/**
 * Neutrino-energy reconstruction for quasi-elastic-like events: the two formulas used in the project's ROOT macros
 * (RecoMethods.C, SmearMatrix.C) plus a small toy event generator built on the same kinematics.
 *
 * What is exact here
 *   qeFormula()  – line-for-line the QEFormula() function in the macros (muon energy and angle only).
 *   consEnergy() – the "energy conservation" variable kConservedETrue / kConservedEReco (muon energy + proton kinetic energy).
 *   Constants    – the same four numbers the macros hard-code: m_p = 0.938, m_n = 0.939, m_mu = 0.106, E_b = 0.028 GeV.
 *
 * What is a toy (and is labelled as such on the page)
 *   genEvent()   – neutrino + bound neutron → muon + proton, two-body kinematics in the neutrino–nucleon centre of mass,
 *                  nucleon taken from a Fermi gas, angle weighted by a dipole axial form factor. It is NOT GENIE: it has no
 *                  nuclear model beyond a Fermi gas, no final-state interactions and no detector. It exists so the reader can
 *                  switch each real-world effect on and off and see what it does to a reconstructed spectrum.
 */

export const M_P = 0.938;
export const M_N = 0.939;
export const M_MU = 0.106;
export const E_B = 0.028;

export function qeFormula(Emu: number, cosmu: number, Eb = E_B): number {
  const M = M_N - Eb;
  const pmu = Math.sqrt(Math.max(0, Emu * Emu - M_MU * M_MU));
  const num = M_P * M_P - M * M - M_MU * M_MU + 2 * M * Emu;
  const den = 2 * (M - Emu + pmu * cosmu);
  return num / den;
}

export function consEnergy(Emu: number, Tp: number, Eb = E_B): number {
  return Emu + (Tp + M_P) - (M_N - Eb);
}

/** Muon energy for a neutrino of energy Ev scattering quasi-elastically off a neutron at rest, at lab angle θ (cosθ = c). */
export function muonEnergyAtRest(Ev: number, c: number, Eb = E_B): number | null {
  const M = M_N - Eb;
  const C = M * M + M_MU * M_MU - M_P * M_P + 2 * Ev * M;
  const a = M + Ev;
  const A = a * a - Ev * Ev * c * c;
  const B = -a * C;
  const D = (C * C) / 4 + Ev * Ev * c * c * M_MU * M_MU;
  const disc = B * B - 4 * A * D;
  if (disc < 0) return null;
  const roots = [(-B + Math.sqrt(disc)) / (2 * A), (-B - Math.sqrt(disc)) / (2 * A)];
  for (const r of roots.sort((x, y) => y - x)) {
    if (r >= M_MU && a * r - C / 2 >= -1e-12) {
      // must also satisfy the un-squared equation: a·E − C/2 = Ev·c·p
      const p = Math.sqrt(r * r - M_MU * M_MU);
      if (Math.abs(a * r - C / 2 - Ev * c * p) < 1e-9) return r;
    }
  }
  return null;
}

/* ------------------------------------------------------------------------------------------------------------- */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(rng: () => number) {
  const u = Math.max(1e-12, rng());
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type V4 = [number, number, number, number]; // E, px, py, pz

function boost(v: V4, bx: number, by: number, bz: number): V4 {
  const b2 = bx * bx + by * by + bz * bz;
  if (b2 < 1e-18) return v;
  const g = 1 / Math.sqrt(1 - b2);
  const bp = bx * v[1] + by * v[2] + bz * v[3];
  const k = ((g - 1) * bp) / b2 + g * v[0];
  return [g * (v[0] + bp), v[1] + k * bx, v[2] + k * by, v[3] + k * bz];
}

export interface QEEvent {
  Emu: number;
  cosmu: number;
  Tp: number; // proton kinetic energy
  Q2: number;
  /** total four-momentum residual, for tests (should be ~1e-15) */
  resid: number;
}

export interface GenOpts {
  pF: number; // Fermi momentum, GeV (0 = nucleon at rest)
  Eb: number; // removal energy used to GENERATE the event
  MA: number; // dipole axial mass, GeV
}

/** One quasi-elastic event at neutrino energy Ev, or null if kinematically closed. */
export function genQE(Ev: number, o: GenOpts, rng: () => number): QEEvent | null {
  for (let tries = 0; tries < 200; tries++) {
    // initial nucleon
    let px = 0, py = 0, pz = 0;
    if (o.pF > 0) {
      const p = o.pF * Math.cbrt(rng());
      const c = 2 * rng() - 1;
      const s = Math.sqrt(1 - c * c);
      const ph = 2 * Math.PI * rng();
      px = p * s * Math.cos(ph); py = p * s * Math.sin(ph); pz = p * c;
    }
    const p2 = px * px + py * py + pz * pz;
    const Ei = Math.sqrt(M_N * M_N + p2) - o.Eb;
    const k: V4 = [Ev, 0, 0, Ev];
    const tot: V4 = [Ev + Ei, px, py, Ev + pz];
    const s = tot[0] * tot[0] - tot[1] * tot[1] - tot[2] * tot[2] - tot[3] * tot[3];
    const rs = Math.sqrt(Math.max(s, 0));
    if (rs < M_MU + M_P) return null;
    const Estar = (s + M_MU * M_MU - M_P * M_P) / (2 * rs);
    const pstar = Math.sqrt(Math.max(Estar * Estar - M_MU * M_MU, 0));
    const c = 2 * rng() - 1;
    const sn = Math.sqrt(1 - c * c);
    const ph = 2 * Math.PI * rng();
    const mu_cm: V4 = [Estar, pstar * sn * Math.cos(ph), pstar * sn * Math.sin(ph), pstar * c];
    const mu = boost(mu_cm, tot[1] / tot[0], tot[2] / tot[0], tot[3] / tot[0]);
    // Q² = -(k - p_mu)²
    const q: V4 = [k[0] - mu[0], k[1] - mu[1], k[2] - mu[2], k[3] - mu[3]];
    const Q2 = -(q[0] * q[0] - q[1] * q[1] - q[2] * q[2] - q[3] * q[3]);
    const w = Math.pow(1 + Math.max(Q2, 0) / (o.MA * o.MA), -4);
    if (rng() > w) continue;
    const pmu = Math.sqrt(mu[1] * mu[1] + mu[2] * mu[2] + mu[3] * mu[3]);
    const pf: V4 = [tot[0] - mu[0], tot[1] - mu[1], tot[2] - mu[2], tot[3] - mu[3]];
    const m2 = pf[0] * pf[0] - pf[1] * pf[1] - pf[2] * pf[2] - pf[3] * pf[3];
    return {
      Emu: mu[0],
      cosmu: mu[3] / pmu,
      Tp: pf[0] - M_P,
      Q2,
      resid: Math.abs(m2 - M_P * M_P),
    };
  }
  return null;
}

/* ---------------------------------------------------------- sample + reconstruction ---------------------------- */

export interface LabOpts {
  pF: number;
  EbTrue: number; // removal energy in the generator
  EbAssumed: number; // removal energy inside the reconstruction formulas (the macros fix this at 0.028)
  resMu: number; // fractional muon-energy resolution
  resP: number; // fractional proton-KE resolution
  resTh: number; // muon-angle resolution, radians
  mecFrac: number; // fraction of events that are 2p2h-like
  mecShift: number; // GeV: a 2p2h event looks like a QE event this much lower in energy
  fsiProb: number; // probability that a hidden neutron carries energy away from the visible proton
  fsiMean: number; // GeV: mean hidden energy
  MA: number;
}

export const LAB_DEFAULTS: LabOpts = {
  pF: 0.24,
  EbTrue: E_B,
  EbAssumed: E_B,
  resMu: 0.05,
  resP: 0.1,
  resTh: 0.01,
  mecFrac: 0,
  mecShift: 0.12,
  fsiProb: 0,
  fsiMean: 0.1,
  MA: 1.0,
};

export interface Sampler {
  /** cumulative weights over bins of width `w` starting at 0 */
  qe: number[];
  mec: number[];
  w: number;
}

export function makeSampler(qe: number[], mec: number[], w = 0.125): Sampler {
  const cum = (a: number[]) => {
    let s = 0;
    return a.map((v) => (s += Math.max(0, v)));
  };
  return { qe: cum(qe), mec: cum(mec), w };
}

function draw(cum: number[], w: number, rng: () => number) {
  const t = rng() * cum[cum.length - 1];
  let lo = 0, hi = cum.length - 1;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    if (cum[m] < t) lo = m + 1; else hi = m;
  }
  return (lo + rng()) * w;
}

export interface LabEvent {
  Et: number;
  cons: number;
  qe: number;
  mec: boolean;
}

export function runLab(N: number, o: LabOpts, sm: Sampler, seed = 12345): LabEvent[] {
  const rng = mulberry32(seed);
  const out: LabEvent[] = [];
  const g = { pF: o.pF, Eb: o.EbTrue, MA: o.MA };
  let guard = 0;
  while (out.length < N && guard++ < N * 6) {
    const isMec = rng() < o.mecFrac;
    const Et = draw(isMec ? sm.mec : sm.qe, sm.w, rng);
    const Eg = isMec ? Et - o.mecShift * (0.5 + rng()) : Et; // mean shift = mecShift, uniform in [0.5, 1.5]×
    if (Eg < 0.2) continue;
    const ev = genQE(Eg, g, rng);
    if (!ev) continue;
    const Emu = ev.Emu * (1 + o.resMu * gauss(rng));
    let Tp = ev.Tp * (1 + o.resP * gauss(rng));
    if (o.fsiProb > 0 && rng() < o.fsiProb) Tp -= -Math.log(Math.max(1e-12, rng())) * o.fsiMean;
    Tp = Math.max(0, Tp);
    const th = Math.acos(Math.max(-1, Math.min(1, ev.cosmu))) + o.resTh * gauss(rng);
    if (!(Emu > M_MU)) continue;
    const qe = qeFormula(Emu, Math.cos(th), o.EbAssumed);
    const cons = consEnergy(Emu, Tp, o.EbAssumed);
    if (!(qe > 0) || !isFinite(qe)) continue;
    out.push({ Et, cons, qe, mec: isMec });
  }
  return out;
}

export function matrix(ev: LabEvent[], pick: "cons" | "qe", nb = 60, max = 6) {
  const m = new Float64Array(nb * nb);
  const w = max / nb;
  for (const e of ev) {
    const i = Math.floor(e.Et / w);
    const j = Math.floor(e[pick] / w);
    if (i >= 0 && i < nb && j >= 0 && j < nb) m[j * nb + i]++; // row = reco, col = true
  }
  return { m, nb, max };
}

export function slice(ev: LabEvent[], pick: "cons" | "qe", lo: number, hi: number) {
  const r = ev.filter((e) => e.Et >= lo && e.Et < hi).map((e) => e[pick] / e.Et).sort((a, b) => a - b);
  if (r.length < 20) return null;
  const q = (p: number) => r[Math.min(r.length - 1, Math.floor(p * r.length))];
  return {
    n: r.length,
    median: q(0.5),
    lo: q(0.16),
    hi: q(0.84),
    below80: r.filter((x) => x < 0.8).length / r.length,
  };
}
