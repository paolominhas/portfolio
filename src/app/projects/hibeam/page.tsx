'use client';

import React, { useRef, Suspense} from 'react';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import { Canvas, useFrame  } from '@react-three/fiber';
import { useTexture, Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------
// 1. DYNAMIC FIGURE COMPONENT
// ---------------------------------------------------------
const InteractiveMagneticFigure = () => (
  <div className="my-16 relative group rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900/50 p-8 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
    <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-white mb-2">Interactive: The Detectors</h3>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Visualise the detectors in this project!
        </p>
        <Link 
          href="hibeam/interactive" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full transition-transform hover:scale-105"
        >
          Run the Simulation &rarr;
        </Link>
      </div>
      <div className="w-full md:w-1/3 aspect-square rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-full h-[1px] bg-cyan-500/50 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
        <div className="absolute w-[1px] h-full bg-cyan-500/50 shadow-[0_0_10px_#22d3ee] animate-pulse"></div>
        <div className="w-16 h-16 rounded-full border-4 border-cyan-400/80 border-dashed animate-spin-slow"></div>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------
// 2. 3D GLOBE COMPONENTS
// ---------------------------------------------------------
function get3DPosition(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}
// 1. Updated Offsets (Smaller nudges since we are pushing them out first)
const locations = [
  { name: 'ESS, Lund', lat: 55.7047, lng: 13.1910, offset: [0.3, 0.4, 0] },
  { name: 'University of Edinburgh', lat: 55.95, lng: -3.19, offset: [-0.6, 0.6, 0] },
  { name: 'IFJ PAN, Krakow', lat: 50.0647, lng: 19.9450, offset: [0.4, -0.3, 0] },
];

function Earth({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthTexture = useTexture('/images/earth.jpg');
  
  const textRefs = useRef<any[]>([]);
  const lineMatRefs = useRef<any[]>([]); 
  
  const globeRadius = 2.5;

  useFrame((state) => {
    if (!containerRef.current || !earthGroupRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableDistance = rect.height - window.innerHeight;
    const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1);

    // ZOOM & PAN
    const zoomProgress = Math.min(progress / 0.5, 1);
    state.camera.position.z = THREE.MathUtils.lerp(12, 6, zoomProgress);

    const panProgress = Math.min(progress / 0.8, 1);
    earthGroupRef.current.position.y = THREE.MathUtils.lerp(0, -1.25, panProgress);

    // ROTATE
    const rotationProgress = Math.min(progress / 0.8, 1);
    earthGroupRef.current.rotation.y = (rotationProgress * 1.2) + 0.5 + Math.PI; 
    earthGroupRef.current.rotation.x = rotationProgress * (Math.PI / 6);

    // FADE IN
    let opacity = 0;
    if (progress > 0.8) {
      opacity = Math.min((progress - 0.8) * 10, 1);
    }

    textRefs.current.forEach((textNode) => {
      if (textNode) textNode.fillOpacity = opacity; 
    });
    
    lineMatRefs.current.forEach((mat) => {
      if (mat) {
        mat.transparent = true;
        mat.opacity = opacity * 0.4;
      }
    });
  });

  return (
    <group ref={earthGroupRef}>
      <mesh>
        <sphereGeometry args={[globeRadius, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.8} />
      </mesh>
      
      {locations.map((loc, i) => {
        const startPos = get3DPosition(loc.lat, loc.lng, globeRadius);
        
        // THE FIX: Push it 20% out into space FIRST to clear the crust
        const endPos = startPos.clone().multiplyScalar(1.2);
        
        // THEN apply the visual nudges to prevent overlapping
        endPos.x += loc.offset[0];
        endPos.y += loc.offset[1];
        endPos.z += loc.offset[2];

        const anchorX = loc.offset[0] > 0 ? 'left' : 'right';

        return (
          <group key={i}>
            <mesh position={startPos}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            <Line
              points={[startPos, endPos]}
              color="white"
              lineWidth={1}
              ref={(el) => { 
                if (el) lineMatRefs.current[i] = el.material; 
              }}
            />
            
            <Billboard position={endPos}>
              <Text
                ref={(el) => { textRefs.current[i] = el; }}
                fontSize={0.11} 
                color="#ffffff"
                anchorX={anchorX}
                anchorY="middle"
                letterSpacing={0.05}
                fillOpacity={0} 
              >
                {loc.name}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------
// 3. THE MAIN ARTICLE COMPONENT
// ---------------------------------------------------------
export default function HIBEAMarticle() {
  const globeContainerRef = useRef<HTMLDivElement>(null);

  return (
    <article className="min-h-screen bg-transparent text-slate-300 selection:bg-cyan-500/30 font-sans pb-32">
      
      {/* HEADER */}
      <header className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-900/30 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-2 mb-6">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full">Particle Physics</span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full">C++ Simulation</span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/50 rounded-full">European Spallation Source</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
            Vanishing Neutrons
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-10 leading-relaxed font-light">
            Why neutrons becoming antimatter is fascinating, and how we can see it for ourselves.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-slate-500">
            <span>By <strong className="text-slate-300">Paolo Minhas</strong></span>
            <span>&bull;</span>
            <span>February 2026</span>
            <span>&bull;</span>
            <span>10 min read</span>
          </div>
        </div>
      </header>

      {/* ARTICLE CONTENT - RESTORED TO SINGLE COLUMN */}
      <div className="max-w-3xl mx-auto px-6 pt-16 text-lg md:text-xl leading-relaxed space-y-8 text-slate-300">
        
        <p className="text-2xl text-slate-200 font-light leading-relaxed">
          Why do we exist? When we look out round the universe we can see stars and galaxies in every direction. Why is this all here? this can be explained via a phenomenon known as CP violation 
        </p>

      </div>

      {/* SCROLLYTELLING GLOBE SECTION */}
      {/* 250vh means the user has to scroll down for 2.5x the height of their screen to pass this section */}
      <div ref={globeContainerRef} className="h-[250vh] relative w-full my-12">
        {/* sticky keeps the canvas locked in the viewport while scrolling through the 250vh container */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-slate-950/50 to-transparent">
          <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 3, 5]} intensity={2} />
            <Suspense fallback={null}>
              {/* We pass the container ref so the Earth knows exactly when it enters and leaves the screen */}
              <Earth containerRef={globeContainerRef} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* CONTINUATION OF ARTICLE CONTENT */}
      <div className="max-w-3xl mx-auto px-6 text-lg md:text-xl leading-relaxed space-y-8 text-slate-300">
        <p>
          To explain this, we need a mechanism that violates Baryon number—a rule in particle physics that says matter and antimatter must balance. While most searches focus on protons decaying, there is a more exotic alternative: what if a neutron could spontaneously turn into an antineutron (<InlineMath math="n \rightarrow \bar{n}" />)?
        </p>
        
        <h2 className="text-3xl font-bold text-white mt-16 mb-6">The Magnetic Dampening</h2>
        <p>
          If this <InlineMath math="\Delta B = 2" /> transition happens, it is incredibly rare. Theoretical models suggest a free neutron would need over <InlineMath math="10^8" /> seconds to flip. But here is the catch: we don&apos;t live in a vacuum. We live on Earth, surrounded by a magnetic field.
        </p>
        <p>
          Because neutrons and antineutrons have opposite magnetic moments, an external magnetic field forces their energy levels to split. This Zeeman splitting (<InlineMath math="\Delta E" />) completely disrupts the delicate quantum superposition required for the particle to oscillate.
        </p>

        <div className="my-12 p-8 bg-slate-900 rounded-2xl border-l-4 border-cyan-500 shadow-xl">
          <p className="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">The Mathematical Collapse</p>
          <div className="text-white text-center text-xl md:text-2xl py-4 overflow-x-auto">
            <BlockMath math={String.raw`P_{n \rightarrow \bar{n}}(t) = \left( \frac{2 \delta m}{\Delta E} \right)^2 \sin^2\left( \frac{\Delta E}{2 \hbar} t \right)`} />
          </div>
          <p className="text-sm text-slate-400 mt-4 text-center">
            Because the interaction mass (<InlineMath math="\delta m" />) is infinitesimally small, any environmental energy split (<InlineMath math="\Delta E" />) crushes the probability amplitude to near zero.
          </p>
        </div>

        <p>
          Our Monte Carlo simulations using Geant4 confirm this mathematically. If a beam of cold neutrons flies down a 50-meter tube, even a localised magnetic "hot spot" of 10 nanotesla is enough to quench the signal entirely. 
        </p>
        <InteractiveMagneticFigure />
        <p>
          This is exactly why experiments like HIBEAM at the European Spallation Source require multi-layer Mu-metal shielding. We aren&apos;t just fighting background noise; we are fighting the environment&apos;s tendency to force the universe to "choose" a state. By creating the most magnetically pristine vacuum on Earth, we might just catch matter looking in the mirror.
        </p>
      </div>

    </article>
  );
}