import { STACK } from "../../src/data/dune-nd";
const PX={LF:1e5/114.25,GF:2000/148};
for (const det of ["LF","GF"] as const) {
  console.log(det);
  const tot=STACK[det].QE.map((_,i)=>STACK[det].QE[i]+STACK[det].RES[i]+STACK[det].DIS[i]+STACK[det].MEC[i]);
  const valid=tot.map(t=>t>=20*PX[det]);
  const vi=valid.map((v,i)=>v?i:-1).filter(i=>i>=0); console.log(" valid bins from",vi[0]*0.125,"to",(vi[vi.length-1]+1)*0.125,"count",vi.length);
  let covered=0,all=0; tot.forEach((t,i)=>{all+=t; if(valid[i])covered+=t;}); console.log(" valid share of events",(100*covered/all).toFixed(1)+"%");
  for (const [lo,hi] of [[0,1],[1,2],[2,3],[3,4],[4,6],[0,10]]) {
    const t:any={QE:0,RES:0,DIS:0,MEC:0}; let T=0;
    for(let i=lo/0.125;i<hi/0.125;i++) if(valid[i]) for(const k of ["QE","RES","DIS","MEC"] as const){t[k]+=STACK[det][k][i];T+=STACK[det][k][i];}
    console.log(` ${lo}-${hi} GeV (valid bins) total ${T}`, Object.fromEntries(Object.entries(t).map(([k,v]:any)=>[k,T?(100*v/T).toFixed(1)+"%":"-"])));
  }
}
