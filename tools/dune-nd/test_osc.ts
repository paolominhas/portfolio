import { makeEngine, stdParams } from "../../src/lib/physics/neutrinoOsc";
const L=1284.9; // km  (globes baseline)
const rho=2.848;
function curve(d:number, anti:boolean, ord:"NO"|"IO"="NO"){const eng=makeEngine(stdParams(d,ord),null);const E:number[]=[],P:number[]=[];for(let i=0;i<=1200;i++){const e=0.3+i*(8-0.3)/1200;E.push(e);P.push(eng.probs(e,L,rho,anti)[1*3+0]);}return {E,P};}
const c=curve(270,false);
// peaks
let best=[] as [number,number][];
for(let i=1;i<c.E.length-1;i++) if(c.P[i]>c.P[i-1]&&c.P[i]>c.P[i+1]) best.push([c.E[i],c.P[i]]);
console.log("peaks (E,P) delta=270 nu:",best.map(b=>b.map(x=>+x.toFixed(3))).join(" | "));
for (const d of [0,90,180,270]) {const cc=curve(d,false); let pk=[] as number[][]; for(let i=1;i<cc.E.length-1;i++) if(cc.P[i]>cc.P[i-1]&&cc.P[i]>cc.P[i+1]) pk.push([+cc.E[i].toFixed(2),+cc.P[i].toFixed(4)]); console.log("nu d",d,JSON.stringify(pk.slice(0,3)));}
for (const d of [90,270]) {const cc=curve(d,true); let pk=[] as number[][]; for(let i=1;i<cc.E.length-1;i++) if(cc.P[i]>cc.P[i-1]&&cc.P[i]>cc.P[i+1]) pk.push([+cc.E[i].toFixed(2),+cc.P[i].toFixed(4)]); console.log("nubar d",d,JSON.stringify(pk.slice(0,3)));}
// delta-sensitivity: P(-90)-P(+90) at first/second maxima with Gaussian resolution
function smear(E:number[],P:number[],res:number){return E.map((e,i)=>{let s=0,w=0;for(let j=0;j<E.length;j++){const sg=res*e;const g=Math.exp(-0.5*((E[j]-e)/sg)**2);s+=g*P[j];w+=g;}return s/w;});}
const A=curve(270,false), B=curve(90,false);
const idx=(E:number[],e:number)=>E.reduce((b,x,i)=>Math.abs(x-e)<Math.abs(E[b]-e)?i:b,0);
for(const res of [0.0001,0.05,0.1,0.2,0.3]){const sa=smear(A.E,A.P,res), sb=smear(B.E,B.P,res);const i1=idx(A.E,2.6),i2=idx(A.E,0.87);console.log("res",res,"diff@2.6",(sa[i1]-sb[i1]).toFixed(4),"diff@0.87",(sa[i2]-sb[i2]).toFixed(4),"P@0.87 smeared",sa[i2].toFixed(4));}
