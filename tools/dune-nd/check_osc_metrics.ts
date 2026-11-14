import { makeEngine, stdParams } from "../../src/lib/physics/neutrinoOsc";
const L=1300,RHO=2.848,E0=0.3,E1=8.5,NT=850,R0=0.5,R1=6,NR=276;
const app=(d:number,anti:boolean,ord:"NO"|"IO")=>{const eng=makeEngine(stdParams(d,ord),null);const y=new Float64Array(NT+1);for(let i=0;i<=NT;i++)y[i]=eng.probs(E0+(E1-E0)*i/NT,L,RHO,anti)[3];return y;};
const fold=(P:Float64Array,res:number,bias:number)=>{const o=new Float64Array(NR+1);for(let j=0;j<=NR;j++){const er=R0+(R1-R0)*j/NR;let n=0,d=0;for(let i=0;i<=NT;i++){const e=E0+(E1-E0)*i/NT;const mu=e*(1+bias);const sg=Math.max(1e-4,res*mu);const z=(er-mu)/sg;if(Math.abs(z)>5)continue;const w=Math.exp(-0.5*z*z)/sg;n+=w*P[i];d+=w;}o[j]=d>0?n/d:0;}return o;};
const near=(e:number)=>Math.max(0,Math.min(NR,Math.round((e-R0)/(R1-R0)*NR)));
const gap=(a:Float64Array,b:Float64Array,lo:number,hi:number)=>{let m=0;for(let j=near(lo);j<=near(hi);j++)m=Math.max(m,Math.abs(a[j]-b[j]));return m;};
for(const anti of [false,true]){const A=app(270,anti,"NO"),B=app(90,anti,"NO");
 const i0=[fold(A,0.002,0),fold(B,0.002,0)];
 console.log(anti?"nubar":"nu","ideal gaps",gap(i0[0],i0[1],1.8,3.4).toFixed(4),gap(i0[0],i0[1],0.6,1.15).toFixed(4));
 for(const [res,bias] of [[0.15,0],[0.3,0],[0.05,-0.1],[0.05,0.1],[0.0,-0.1]]){const s=[fold(A,Math.max(res,0.002),bias),fold(B,Math.max(res,0.002),bias)];const g1=gap(s[0],s[1],1.8,3.4),g2=gap(s[0],s[1],0.6,1.15);console.log("  res",res,"bias",bias,"gaps",g1.toFixed(4),(100*g1/gap(i0[0],i0[1],1.8,3.4)).toFixed(0)+"%",g2.toFixed(4),(100*g2/gap(i0[0],i0[1],0.6,1.15)).toFixed(0)+"%");}}
console.log("--- shift metric");
{const A=app(270,false,"NO"),B=app(90,false,"NO");const ia=fold(A,0.002,0),ib=fold(B,0.002,0);
 for(const [res,bias] of [[0.002,0],[0.15,0],[0.05,-0.1],[0.05,-0.05],[0.05,0.05],[0.002,-0.1]]){const sa=fold(A,Math.max(res,0.002),bias);
  const chg=(lo:number,hi:number)=>{let m=0;for(let j=near(lo);j<=near(hi);j++)m=Math.max(m,Math.abs(sa[j]-ia[j]));return m;};
  console.log("res",res,"bias",bias,"chg1/gap1",(100*chg(1.8,3.4)/gap(ia,ib,1.8,3.4)).toFixed(0)+"%","chg2/gap2",(100*chg(0.6,1.15)/gap(ia,ib,0.6,1.15)).toFixed(0)+"%");}}
