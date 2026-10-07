/**
 * Cross-checks the TypeScript pricing engine (src/lib/physics/options.ts)
 * against reference values computed by the Python `optionlab` library
 * (which is itself tested against closed-form identities), plus a few
 * statistical checks that hold for any correct implementation.
 *
 * Run from the repo root:   npx tsx scripts/check-options.ts
 */
import assert from "node:assert/strict";
import {
  REFERENCE_CASE,
  bsGreeks,
  bsPrice,
  fdGreeks,
  mcPrice,
  normCdf,
  runningEstimate,
  simulatePaths,
  standardNormals,
  terminalDensity,
  type OptionKind,
  type OptionParams,
} from "../src/lib/physics/options";

// Reference values from the Python library (full double precision).
const REFERENCE: {
  p: OptionParams;
  call: Record<string, number>;
  put: Record<string, number>;
}[] = [{"p":{"s0":100,"k":100,"r":0.05,"sigma":0.2,"t":1.0,"q":0.0},"call":{"price":10.450583572185565,"delta":0.6368306511756191,"gamma":0.018762017345846895,"vega":37.52403469169379,"theta":-6.414027546438197,"rho":53.232481545376345},"put":{"price":5.573526022256971,"delta":-0.3631693488243809,"gamma":0.018762017345846895,"vega":37.52403469169379,"theta":-1.657880423934626,"rho":-41.89046090469506}},{"p":{"s0":100,"k":95,"r":0.03,"sigma":0.25,"t":0.75,"q":0.02},"call":{"price":11.363171865840123,"delta":0.6383091357699743,"gamma":0.016888872717311775,"vega":31.666636344959574,"theta":-5.5751867039547,"rho":39.35080628336798},"put":{"price":5.738345438900808,"delta":-0.3468028038330884,"gamma":0.016888872717311775,"vega":31.666636344959574,"theta":-4.758819557159818,"rho":-30.313969366657236}},{"p":{"s0":80,"k":100,"r":0.01,"sigma":0.4,"t":2.0,"q":0.0},"call":{"price":12.03879309069211,"delta":0.4696030437194853,"gamma":0.008789860737568208,"vega":45.004086976349235,"theta":-4.75570320170359,"rho":51.05890081373343},"put":{"price":30.058660421367634,"delta":-0.5303969562805146,"gamma":0.008789860737568208,"vega":45.004086976349235,"theta":-3.7755045283968354,"rho":-144.98083384761762}},{"p":{"s0":120,"k":100,"r":0.08,"sigma":0.15,"t":0.25,"q":0.04},"call":{"price":20.799372449262407,"delta":0.9854590064901505,"gamma":0.001487271552970915,"vega":0.8031266386042941,"theta":-3.3071914267930174,"rho":24.363927082388912},"put":{"price":0.013259730037776918,"delta":-0.004590827259017573,"gamma":0.001487271552970915,"vega":0.8031266386042941,"theta":-0.21784124233498173,"rho":-0.1410397502799714}},{"p":{"s0":100,"k":100,"r":0.0,"sigma":0.6,"t":0.1,"q":0.0},"call":{"price":7.558058781332932,"delta":0.5377902939066647,"gamma":0.02093169945092376,"vega":12.559019670554257,"theta":-37.67705901166277,"rho":4.622097060933354},"put":{"price":7.558058781332932,"delta":-0.46220970609333534,"gamma":0.02093169945092376,"vega":12.559019670554257,"theta":-37.67705901166277,"rho":-5.377902939066646}},{"p":{"s0":60,"k":110,"r":0.05,"sigma":0.3,"t":3.0,"q":0.01},"call":{"price":3.553374585015895,"delta":0.24221946524511756,"gamma":0.009882962003484128,"vega":32.020796891288576,"theta":-2.0046978319019164,"rho":32.93937998907347},"put":{"price":40.00451997886175,"delta":-0.7282260683033907,"gamma":0.009882962003484128,"vega":32.020796891288576,"theta":2.1469287183067967,"rho":-251.09425223119558}},{"p":{"s0":100,"k":130,"r":-0.01,"sigma":0.1,"t":0.5,"q":0.0},"call":{"price":0.00014899668194505444,"delta":8.992912505624436e-05,"gamma":5.06658778271019e-05,"vega":0.025332938913550953,"theta":-0.002444854733118301,"rho":0.00442195791183969},"put":{"price":30.65177670840407,"delta":-0.9999100708749438,"gamma":5.06658778271019e-05,"vega":0.025332938913550953,"theta":-1.3089611318503398,"rho":-65.32139189794923}},{"p":{"s0":100,"k":70,"r":0.05,"sigma":0.2,"t":1.0,"q":0.0},"call":{"price":33.54009835541592,"delta":0.9835530004157195,"gamma":0.0020491818684031985,"vega":4.098363736806397,"theta":-3.650596457988441,"rho":64.81520168615603},"put":{"price":0.12615807046589622,"delta":-0.01644699958428055,"gamma":0.0020491818684031985,"vega":4.098363736806397,"theta":-0.3212934722359422,"rho":-1.7708580288939513}}];
const CDF_REFERENCE: [number, number][] = [[-9,1.1285884059538324e-19],[-8,6.22096057427174e-16],[-6,9.865876450376946e-10],[-4,3.167124183311986e-05],[-3,0.0013498980316300933],[-2,0.022750131948179195],[-1,0.15865525393145707],[-0.5,0.3085375387259869],[0,0.5],[0.5,0.6914624612740131],[1,0.8413447460685429],[2,0.9772498680518208],[3,0.9986501019683699],[4,0.9999683287581669],[6,0.9999999990134123],[8,0.9999999999999993]];

const KEYS = ["price", "delta", "gamma", "vega", "theta", "rho"] as const;
const close = (a: number, b: number, abs: number, rel = 0) =>
  Math.abs(a - b) <= abs + rel * Math.abs(b);
const std = (xs: number[]) => {
  const m = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
};

// Absolute error under 1e-15 everywhere; relative error under 1e-12 for |x| <= 4.
// (Beyond |x| = 6 the relative error rises to ~1e-8, but the value is < 1e-9 there,
// so the absolute error stays below 1e-18 and prices are unaffected.)
let worstAbs = 0;
let worstRelCore = 0;
for (const [x, ref] of CDF_REFERENCE) {
  const abs = Math.abs(normCdf(x) - ref);
  worstAbs = Math.max(worstAbs, abs);
  assert.ok(abs < 1e-15, `normCdf(${x}) absolute error ${abs}`);
  if (Math.abs(x) <= 4) {
    const rel = abs / ref;
    worstRelCore = Math.max(worstRelCore, rel);
    assert.ok(rel < 1e-12, `normCdf(${x}) relative error ${rel}`);
  }
}
console.log(`normCdf vs scipy: worst absolute error ${worstAbs.toExponential(2)}, worst relative error for |x|<=4 ${worstRelCore.toExponential(2)}`);

let worstBs = 0;
for (const row of REFERENCE) {
  for (const kind of ["call", "put"] as OptionKind[]) {
    const got = { price: bsPrice(row.p, kind), ...bsGreeks(row.p, kind) };
    for (const key of KEYS) {
      const want = row[kind][key];
      const err = Math.abs(got[key] - want);
      worstBs = Math.max(worstBs, err / (1 + Math.abs(want)));
      assert.ok(close(got[key], want, 1e-9, 1e-9), `${kind} ${key}: ${got[key]} vs ${want}`);
    }
  }
  // put-call parity
  const { p } = row;
  const parity = bsPrice(p, "call") - bsPrice(p, "put");
  assert.ok(close(parity, p.s0 * Math.exp(-p.q * p.t) - p.k * Math.exp(-p.r * p.t), 1e-9));
}
console.log(`Black-Scholes price + 5 Greeks vs Python, ${REFERENCE.length * 2} cases: worst scaled error ${worstBs.toExponential(2)}`);

// Monte Carlo agrees with the closed form and antithetic variates help.
const P = REFERENCE_CASE;
const exact = bsPrice(P, "call");
const zPlain = standardNormals(1_000_000, 1);
const zAnti = standardNormals(500_000, 1);
const plain = mcPrice(P, "call", zPlain, false);
const anti = mcPrice(P, "call", zAnti, true);
assert.ok(Math.abs(plain.price - exact) < 4 * plain.stdErr, "plain MC within 4 SE");
assert.ok(Math.abs(anti.price - exact) < 4 * anti.stdErr, "antithetic MC within 4 SE");
assert.ok(anti.stdErr < plain.stdErr, "antithetic reduces the standard error");
assert.equal(anti.nPaths, 1_000_000);
console.log(`MC call, 1M paths: plain ${plain.price.toFixed(4)} +/- ${plain.stdErr.toFixed(4)}, antithetic ${anti.price.toFixed(4)} +/- ${anti.stdErr.toFixed(4)}, exact ${exact.toFixed(4)}`);

// Error scales as 1/sqrt(N).
const small = mcPrice(P, "call", standardNormals(100_000, 3));
const large = mcPrice(P, "call", standardNormals(400_000, 3));
assert.ok(close(large.stdErr / small.stdErr, 0.5, 0.03), "standard error ~ 1/sqrt(N)");

// The running estimate ends exactly where the one-shot estimate does.
const run = runningEstimate(P, "call", zPlain, false, [100, 10_000, 1_000_000]);
assert.equal(run.length, 3);
assert.ok(close(run[2].price, plain.price, 1e-9) && close(run[2].stdErr, plain.stdErr, 1e-9));

// Greeks by bumping: close to analytic with common random numbers, and much less noisy than without.
const g = bsGreeks(P, "call");
const fd = fdGreeks(P, "call", { nPaths: 400_000, seed: 0, spotBump: 0.01, volBump: 0.01, antithetic: true, crn: true });
assert.ok(close(fd.delta, g.delta, 3e-3), "fd delta");
assert.ok(close(fd.vega, g.vega, 0, 0.01), "fd vega");
assert.ok(close(fd.gamma, g.gamma, 0, 0.05), "fd gamma");
const deltas = (crn: boolean) =>
  Array.from({ length: 30 }, (_, s) =>
    fdGreeks(P, "call", { nPaths: 20_000, seed: s, spotBump: 0.01, volBump: 0.01, antithetic: true, crn }).delta,
  );
const sdCrn = std(deltas(true));
const sdIndep = std(deltas(false));
assert.ok(sdCrn < 0.1 * sdIndep, `CRN should cut delta noise (got ${sdCrn} vs ${sdIndep})`);
console.log(`FD Greeks (400k): delta ${fd.delta.toFixed(4)} vs ${g.delta.toFixed(4)}, gamma ${fd.gamma.toFixed(5)} vs ${g.gamma.toFixed(5)}, vega ${fd.vega.toFixed(3)} vs ${g.vega.toFixed(3)}`);
console.log(`Delta spread over 30 seeds: CRN ${sdCrn.toFixed(4)}, independent ${sdIndep.toFixed(4)} (x${(sdIndep / sdCrn).toFixed(0)})`);

// Simulated paths have the right terminal distribution: ln(S_T/S0) ~ N((r-q-s^2/2)T, s^2 T).
const nPaths = 20_000;
const steps = 50;
const paths = simulatePaths(P, nPaths, steps, 11);
assert.equal(paths.length, nPaths * (steps + 1));
assert.equal(paths[0], P.s0);
const logRet = Array.from({ length: nPaths }, (_, i) => Math.log(paths[i * (steps + 1) + steps] / P.s0));
const mean = logRet.reduce((s, x) => s + x, 0) / nPaths;
const sd = std(logRet);
assert.ok(Math.abs(mean - (P.r - P.q - 0.5 * P.sigma ** 2) * P.t) < 4 * sd / Math.sqrt(nPaths), "path drift");
assert.ok(close(sd, P.sigma * Math.sqrt(P.t), 0.005), "path volatility");

// The terminal density integrates to 1 and has mean S0*exp((r-q)T) (the discounted price is a martingale).
let area = 0;
let first = 0;
const lo = 1e-3;
const hi = P.s0 * 12;
const nGrid = 200_000;
const dx = (hi - lo) / nGrid;
for (let i = 0; i < nGrid; i++) {
  const x = lo + (i + 0.5) * dx;
  const f = terminalDensity(P, x);
  area += f * dx;
  first += x * f * dx;
}
assert.ok(close(area, 1, 1e-4), `density area ${area}`);
assert.ok(close(first, P.s0 * Math.exp((P.r - P.q) * P.t), 1e-2), `density mean ${first}`);

console.log("all checks passed");
