const mpi=0.13957, mmu=0.105658, Estar=(mpi*mpi-mmu*mmu)/(2*mpi);
console.log("E*",Estar);
const Enu=(Epi:number,th:number)=>{const g=Epi/mpi,b=Math.sqrt(1-1/(g*g));return Estar/(g*(1-b*Math.cos(th)));};
// max over Epi
for(const mr of [0,5,10,20,40]){const th=mr/1000;let best=0,at=0;for(let E=0.2;E<200;E*=1.0005){const v=Enu(E,th);if(v>best){best=v;at=E;}}console.log("theta",mr,"mrad max",best.toFixed(4),"at Epi",at.toFixed(2),"| formula E*/sin",(th>0?Estar/Math.sin(th):NaN).toFixed(4),"mpi/sin",(th>0?mpi/Math.sin(th):NaN).toFixed(2), "0.427Epi on-axis", (Estar*(Math.sqrt(1)+1)));}
console.log("on-axis ratio Enu/Epi at 30 GeV", Enu(30,0)/30, "= (1-mmu^2/mpi^2)=",1-mmu*mmu/(mpi*mpi));
// histogram for pion spectra
function hist(th:number,spec:(E:number)=>number){const Es=[];const bins=new Float64Array(600);for(let E=0.5;E<80;E+=0.01){const e=Enu(E,th);const w=spec(E);const k=Math.floor(e/0.02);if(k<600)bins[k]+=w;}
 let tot=0,m1=0,m2=0;for(let k=0;k<600;k++){const e=(k+0.5)*0.02;tot+=bins[k];m1+=bins[k]*e;m2+=bins[k]*e*e;}const mean=m1/tot,rms=Math.sqrt(m2/tot-mean*mean);let pk=0;for(let k=0;k<600;k++)if(bins[k]>bins[pk])pk=k;
 return {mean:+mean.toFixed(3),rms:+rms.toFixed(3),rel:+(rms/mean).toFixed(3),peak:+((pk+0.5)*0.02).toFixed(2)};}
for(const [nm,sp] of [["flat",(E:number)=>1],["1/E",(E:number)=>1/E],["exp(-E/8)",(E:number)=>Math.exp(-E/8)],["E exp(-E/6)",(E:number)=>E*Math.exp(-E/6)]] as const){console.log(nm);for(const mr of [0,5,10,20,40]) console.log("  ",mr,JSON.stringify(hist(mr/1000,sp)));}
