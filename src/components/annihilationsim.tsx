'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Trail } from '@react-three/drei';
import { useState, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface KinematicProduct {
  type: string;
  mass: number;
  color: string;
  size: number;
  rawV?: THREE.Vector3;   
  finalV?: THREE.Vector3; 
}

// --- PHYSICS ENGINE: CONSERVATION OF MOMENTUM & BRANCHING ---
function generateProducts(targetType: string) {
  const incomingVelocity = new THREE.Vector3(15, 0, 0); 
  const mIn = 1.0; 
  const pIn = incomingVelocity.clone().multiplyScalar(mIn); 

  let products: KinematicProduct[] = [];
  let mTotal = mIn + 1.0; // Target is always 1 nucleon now
  let equation = "";

  // Quantum statistical branching: randomly choose a 3-pion or 5-pion event
  const isHighMultiplicity = Math.random() > 0.5;

  if (targetType === 'proton') {
    // Total charge must equal +1
    if (isHighMultiplicity) {
      products = [
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi-', mass: 0.14, color: '#3333ff', size: 0.1 },
        { type: 'pi0', mass: 0.135, color: '#22ff22', size: 0.1 },
        { type: 'pi0', mass: 0.135, color: '#22ff22', size: 0.1 },
      ];
      equation = "n̄ + p → 2π⁺ + π⁻ + 2π⁰";
    } else {
      products = [
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi-', mass: 0.14, color: '#3333ff', size: 0.1 },
      ];
      equation = "n̄ + p → 2π⁺ + π⁻";
    }
  } else if (targetType === 'neutron') {
    // Total charge must equal 0
    if (isHighMultiplicity) {
      products = [
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi-', mass: 0.14, color: '#3333ff', size: 0.1 },
        { type: 'pi-', mass: 0.14, color: '#3333ff', size: 0.1 },
        { type: 'pi0', mass: 0.135, color: '#22ff22', size: 0.1 },
      ];
      equation = "n̄ + n → 2π⁺ + 2π⁻ + π⁰";
    } else {
      products = [
        { type: 'pi+', mass: 0.14, color: '#ff3333', size: 0.1 },
        { type: 'pi-', mass: 0.14, color: '#3333ff', size: 0.1 },
        { type: 'pi0', mass: 0.135, color: '#22ff22', size: 0.1 },
      ];
      equation = "n̄ + n → π⁺ + π⁻ + π⁰";
    }
  }

  // Calculate Center of Mass Velocity
  const vCM = pIn.clone().divideScalar(mTotal);
  let pRand = new THREE.Vector3(0, 0, 0);
  
  // Generate random thermal velocities based on available mass-energy
  products.forEach(p => {
    const thermalSpeed = 25 / Math.sqrt(p.mass); 
    p.rawV = new THREE.Vector3(
      (Math.random() - 0.5) * thermalSpeed,
      (Math.random() - 0.5) * thermalSpeed,
      (Math.random() - 0.5) * thermalSpeed
    );
    pRand.add(p.rawV.clone().multiplyScalar(p.mass));
  });

  // Conserve momentum in the CM frame, then translate to Lab frame
  products.forEach(p => {
    if (p.rawV) {
      const correction = pRand.clone().divideScalar(mTotal);
      const u_i = p.rawV.clone().sub(correction); 
      p.finalV = u_i.add(vCM); 
    }
  });

  return { products, equation };
}

// --- INDIVIDUAL PARTICLE RENDERER ---
function FlyingParticle({ data, speed }: { data: KinematicProduct; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current && data.finalV) {
      meshRef.current.position.addScaledVector(data.finalV, delta * speed);
    }
  });

  return (
    <Trail width={data.size * 1.5} length={15} color={data.color} attenuation={(t) => t * t}>
      <Sphere ref={meshRef} args={[data.size, 16, 16]}>
        <meshBasicMaterial color={data.color} />
      </Sphere>
    </Trail>
  );
}

// --- THE 3D SCENE ---
function PhysicsScene({ targetType, phase, setPhase, speed, setReactionEq }: any) {
  const antineutronRef = useRef<THREE.Mesh>(null);
  
  // Re-roll the quantum dice every time the target changes or the beam fires
  const { products, equation } = useMemo(() => generateProducts(targetType), [targetType, phase]);

  // Update the UI equation display
  useEffect(() => {
    if (phase === 'idle') {
      setReactionEq(`n̄ + ${targetType === 'proton' ? 'p' : 'n'} → ???`);
    } else if (phase === 'annihilation') {
      setReactionEq(equation);
    }
  }, [phase, targetType, equation, setReactionEq]);

  useFrame((_, delta) => {
    if (phase === 'firing' && antineutronRef.current) {
      antineutronRef.current.position.x += 15 * (delta * speed);
      if (antineutronRef.current.position.x >= -0.5) {
        setPhase('annihilation');
      }
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={2} />

      {phase !== 'annihilation' && (
        <Trail width={0.2} length={5} color="#aaaaaa" attenuation={(t) => t * t}>
          <Sphere ref={antineutronRef} args={[0.15, 32, 32]} position={[-10, 0, 0]}>
            <meshStandardMaterial color="#aaaaaa" emissive="#333333" />
          </Sphere>
        </Trail>
      )}

      {phase !== 'annihilation' && (
        <group>
          {targetType === 'proton' && <Sphere args={[0.3, 32, 32]}><meshStandardMaterial color="#dddddd" emissive="#444444" /></Sphere>}
          {targetType === 'neutron' && <Sphere args={[0.3, 32, 32]}><meshStandardMaterial color="#aaaaaa" emissive="#333333" /></Sphere>}
        </group>
      )}

      {phase === 'annihilation' && (
        <group>
          {products.map((p, i) => (
            <FlyingParticle key={i} data={p} speed={speed} />
          ))}
        </group>
      )}
    </group>
  );
}

// --- UI & WRAPPER ---
export default function AnnihilationSim() {
  const [targetType, setTargetType] = useState('proton');
  const [phase, setPhase] = useState('idle'); 
  const [speed, setSpeed] = useState(0.5);
  const [reactionEq, setReactionEq] = useState("n̄ + p → ???");

  const fire = () => setPhase('firing');
  const reset = () => setPhase('idle');

  return (
    <div className="relative w-full h-[650px] rounded-2xl overflow-hidden border border-slate-800 bg-[#030712] my-12 shadow-2xl">
      
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <OrbitControls enableZoom={false} autoRotate={phase === 'idle'} autoRotateSpeed={0.5} />
        <Stars radius={50} depth={50} count={2000} factor={2} fade />
        <PhysicsScene targetType={targetType} phase={phase} setPhase={setPhase} speed={speed} setReactionEq={setReactionEq} />
      </Canvas>

      {/* --- UI: SCIENTIFIC LEGEND (Top Left) --- */}
      <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none bg-slate-900/60 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-lg">
        <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Pion Products</h3>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#ff3333]"></div><span className="text-slate-300 text-xs">Positive (π⁺)</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#3333ff]"></div><span className="text-slate-300 text-xs">Negative (π⁻)</span></div>
        <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#22ff22]"></div><span className="text-slate-300 text-xs">Neutral (π⁰)</span></div>
      </div>

      {/* --- UI: SUBTLE REACTION EQUATION (Top Right) --- */}
      <div className="absolute top-8 right-8 pointer-events-none">
        <span className="text-slate-500/80 font-mono text-[11px] font-medium tracking-[0.2em]">
          {reactionEq}
        </span>
      </div>

      {/* --- UI: CONTROLS & DISCLAIMER (Bottom Center) --- */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full max-w-lg px-4">
        
        <div className="flex bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-slate-700/50 w-full justify-center">
          {['proton', 'neutron'].map((t) => (
            <button
              key={t} onClick={() => { setTargetType(t); reset(); }} disabled={phase === 'firing'}
              className={`flex-1 py-2 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all duration-300 ${
                targetType === t ? 'bg-white/10 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              } disabled:opacity-30`}
            >
              {t} Target
            </button>
          ))}
        </div>

        <div className="flex items-center w-full gap-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50">
          {phase === 'idle' ? (
            <button onClick={fire} className="flex-1 py-3 border border-cyan-500/50 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-medium rounded-xl tracking-[0.2em] transition-all text-xs uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              Fire Beam
            </button>
          ) : (
            <button onClick={reset} className="flex-1 py-3 border border-slate-600/50 text-slate-400 hover:text-white hover:bg-slate-700/30 font-medium rounded-xl tracking-[0.2em] transition-all text-xs uppercase">
              Reset Chamber
            </button>
          )}

          <div className="flex flex-col flex-1 gap-2">
            <div className="flex justify-between text-[9px] text-slate-500 font-medium uppercase tracking-[0.2em]">
              <span>Speed</span>
              <span className="text-cyan-500">{speed.toFixed(1)}x</span>
            </div>
            <input 
              type="range" min="0.1" max="1.5" step="0.1" value={speed} 
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full h-[2px] bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* The Disclaimer */}
        <p className="text-[9px] text-slate-500/70 text-center uppercase tracking-widest px-8 mt-1">
          *This figure is purely illustrative - not a simulation!
        </p>

      </div>
    </div>
  );
}