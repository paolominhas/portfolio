import { STACK, stackValid } from "../../src/data/dune-nd";
const v = stackValid("LF");
let last = 0; v.forEach((ok, i) => { if (ok && i < 48) last = i; });
const n = Math.min(48, last + 1);
const pick = (k: "QE" | "RES" | "DIS" | "MEC") => STACK.LF[k].slice(0, n).map((x: number) => Math.round(x / 1000));
console.log("// NDLAr CC0pi stack, digitised (data/dune-nd.ts STACK.LF), 0.125 GeV bins from 0, in thousands of events");
console.log(`export const ND_STACK = { n: ${n}, QE: ${JSON.stringify(pick("QE"))}, RES: ${JSON.stringify(pick("RES"))}, DIS: ${JSON.stringify(pick("DIS"))}, MEC: ${JSON.stringify(pick("MEC"))} } as const;`);
