import { qeFormula, consEnergy, muonEnergyAtRest, genQE, mulberry32, runLab, makeSampler, LAB_DEFAULTS, slice, M_MU } from "../../src/lib/physics/ndReco";
// 1. inversion of QE formula at rest
let worst = 0;
for (const Ev of [0.3, 0.6, 1, 2, 3.5, 6, 10]) for (const c of [-0.5, 0, 0.3, 0.7, 0.95, 1]) {
  const E = muonEnergyAtRest(Ev, c); if (E == null) continue;
  const back = qeFormula(E, c); worst = Math.max(worst, Math.abs(back - Ev) / Ev);
}
console.log("QE formula round trip, worst rel err", worst);
// 2. generator, nucleon at rest, no smear: both methods exact
const rng = mulberry32(1);
let w1 = 0, w2 = 0, wres = 0, n = 0;
for (let i = 0; i < 20000; i++) {
  const Ev = 0.3 + 5 * rng();
  const e = genQE(Ev, { pF: 0, Eb: 0.028, MA: 1 }, rng); if (!e) continue; n++;
  w1 = Math.max(w1, Math.abs(qeFormula(e.Emu, e.cosmu) - Ev)); w2 = Math.max(w2, Math.abs(consEnergy(e.Emu, e.Tp) - Ev)); wres = Math.max(wres, e.resid);
}
console.log("at rest: worst |QE-Ev|", w1, "worst |cons-Ev|", w2, "4-mom mass resid", wres, "n", n);
// 3. Fermi gas: cons bias vs <p^2>/2M
let sum = 0, cnt = 0; const rng2 = mulberry32(2);
for (let i = 0; i < 40000; i++) { const Ev = 2; const e = genQE(Ev, { pF: 0.24, Eb: 0.028, MA: 1 }, rng2); if (!e) continue; sum += consEnergy(e.Emu, e.Tp) - Ev; cnt++; }
console.log("Fermi gas mean (cons-Ev) at Ev=2:", sum / cnt, " expected ~ 0.6 pF^2/(2M)=", 0.6 * 0.24 ** 2 / (2 * 0.939));
// 4. lab with data-like spectrum
const qe = Array.from({ length: 80 }, (_, i) => Math.exp(-0.5 * ((i * 0.125 + 0.06 - 2) / 0.9) ** 2));
const sm = makeSampler(qe, qe);
for (const [name, o] of [["ideal", { ...LAB_DEFAULTS, pF: 0, resMu: 0, resP: 0, resTh: 0 }], ["default", LAB_DEFAULTS], ["mec .2", { ...LAB_DEFAULTS, mecFrac: 0.2 }], ["fsi .5", { ...LAB_DEFAULTS, fsiProb: 0.5 }]] as const) {
  const ev = runLab(20000, o, sm);
  console.log(name, ev.length, "cons", JSON.stringify(slice(ev, "cons", 1.5, 2.5)), "qe", JSON.stringify(slice(ev, "qe", 1.5, 2.5)));
}
const t = Date.now(); runLab(40000, LAB_DEFAULTS, sm); console.log("40k events ms", Date.now() - t);
