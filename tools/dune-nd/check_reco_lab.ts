import { STACK, stackValid } from "../../src/data/dune-nd";
import { runLab, makeSampler, LAB_DEFAULTS, slice } from "../../src/lib/physics/ndReco";
const V=stackValid("LF"); const mk=(a:readonly number[])=>a.map((v,i)=>V[i]?v:0); const sum=(a:number[])=>a.reduce((x,y)=>x+y,0);
const Q=mk(STACK.LF.QE),M=mk(STACK.LF.MEC); const MEC=sum(M)/(sum(Q)+sum(M)); console.log("MEC share",MEC);
const sm=makeSampler(Q,M);
const IDEAL={...LAB_DEFAULTS,pF:0,resMu:0,resP:0,resTh:0,mecFrac:0,fsiProb:0};
const P:Record<string,any>={ideal:IDEAL,nucleus:{...IDEAL,pF:0.24},detector:{...IDEAL,pF:0.24,resMu:0.05,resP:0.1,resTh:0.01},mec:{...LAB_DEFAULTS,mecFrac:MEC},eb0:{...LAB_DEFAULTS,EbAssumed:0},eb50:{...LAB_DEFAULTS,EbAssumed:0.05},mec_big:{...LAB_DEFAULTS,mecFrac:MEC,mecShift:0.4},base:{...LAB_DEFAULTS}};
for(const [k,o] of Object.entries(P)){const ev=runLab(30000,o,sm);for(const m of ["qe","cons"] as const){const s=slice(ev,m,1.5,2.5)!; console.log(k.padEnd(8),m.padEnd(5),"med",s.median.toFixed(3),"band",s.lo.toFixed(3),s.hi.toFixed(3),"<80%",(100*s.below80).toFixed(1)+"%");}}
