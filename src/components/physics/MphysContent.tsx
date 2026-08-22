'use client';

import React, { useRef, Suspense } from 'react';
import Link from 'next/link';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, Line, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import AnnihilationSim from '@/components/annihilationsim';
import EnergyHistogram from '@/components/graph';

/**
 * MPHYS CONTENT
 * ─────────────────────────────────────────────────────────────────
 * Ported from the old portfolio route (projects/hibeam/HibeamClientContent.tsx)
 * — same Three.js globe, detector-geometry CTA, KaTeX, annihilation
 * sim, and energy histogram, functionally unchanged. What changed is
 * purely the skin: the old ad hoc slate/cyan palette is remapped to
 * this site's actual design system (abyss #0A0E1A background, ember
 * #FF6B3D warm accent, kelp #2F9E7C cool accent, font-bodoni
 * headings, bg-stars grain) so this page reads as the same site as
 * physics.paolo.org.uk/, not a bolted-on import.
 */

// ---------------------------------------------------------
// 1. DYNAMIC FIGURE COMPONENT
// ---------------------------------------------------------
const InteractiveMagneticFigure = () => (
  <div className="my-16 relative group rounded-2xl overflow-hidden border border-[var(--accent-border)] bg-white/[0.03] p-8 shadow-[0_0_40px_rgba(255,107,61,0.08)]">
    <div className="absolute -inset-4 bg-gradient-to-r from-ember/15 to-kelp/15 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1">
        <h3 className="font-bodoni text-2xl font-medium text-white mb-2">Interactive: The Detectors</h3>
        <p className="text-white/50 mb-6 leading-relaxed">
          Visualise the detectors in this project!
        </p>
        <Link
          href="/research/mphys/interactive"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ember hover:bg-ember/85 text-abyss font-bold rounded-full transition-transform hover:scale-105"
        >
          Interact with the detectors &rarr;
        </Link>
      </div>
      <div className="w-full md:w-1/3 aspect-square rounded-xl bg-abyss border border-white/10 flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-full h-[1px] bg-ember/50 shadow-[0_0_10px_#FF6B3D] animate-pulse"></div>
        <div className="absolute w-[1px] h-full bg-ember/50 shadow-[0_0_10px_#FF6B3D] animate-pulse"></div>
        <div className="w-16 h-16 rounded-full border-4 border-ember/80 border-dashed animate-spin-slow"></div>
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

const locations = [
  { name: 'ESS, Lund', lat: 55.7047, lng: 13.1910, offset: [0.3, 0.4, 0] },
  { name: 'University of Edinburgh', lat: 55.95, lng: -3.19, offset: [-0.6, 0.6, 0] },
  { name: 'IFJ PAN, Krakow', lat: 50.0647, lng: 19.9450, offset: [0.4, -0.3, 0] },
];

function Earth({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthTexture = useTexture('/images/earth.jpg');

  // Troika Text instances (drei's <Text>) expose `fillOpacity`, which
  // isn't part of THREE.Object3D — a minimal structural interface is
  // enough for what this component actually reads/writes.
  const textRefs = useRef<({ fillOpacity?: number } | null)[]>([]);
  const lineMatRefs = useRef<(THREE.Material | null)[]>([]);

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
        const endPos = startPos.clone().multiplyScalar(1.2);

        endPos.x += loc.offset[0];
        endPos.y += loc.offset[1];
        endPos.z += loc.offset[2];

        const anchorX = loc.offset[0] > 0 ? 'left' : 'right';

        return (
          <group key={i}>
            <mesh position={startPos}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color="#FF6B3D" />
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
// 3. THE MAIN CONTENT COMPONENT
// ---------------------------------------------------------
export default function MphysContent() {
  const globeContainerRef = useRef<HTMLDivElement>(null);

  return (
    <article className="min-h-screen bg-abyss bg-stars text-white/70 selection:bg-ember/30 pb-32 relative overflow-hidden">

      {/* HEADER */}
      <header className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-ember/15 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">Particle Physics</span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">C++ Simulation</span>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent-muted)] rounded-full">European Spallation Source</span>
          </div>
          <h1 className="font-bodoni text-5xl md:text-7xl font-medium text-white tracking-tight mb-6 leading-tight [text-shadow:0_4px_40px_rgba(255,107,61,0.15)]">
            Vanishing Neutrons
          </h1>
          <p className="text-xl md:text-2xl text-white/50 mb-10 leading-relaxed font-light">
            How to test if a new particle detector works, and if it can see vanishing neutrons.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-white/40">
            <span>By <strong className="text-white/70">Paolo Minhas</strong></span>
            <span>&bull;</span>
            <span>February 2026</span>
            <span>&bull;</span>
            <span>5 min read</span>
          </div>
        </div>
      </header>

      {/* ARTICLE CONTENT */}
      <div className="max-w-3xl mx-auto px-6 pt-16 text-lg md:text-xl leading-relaxed space-y-8 text-white/60">
        <p className="text-2xl text-white/80 font-light leading-relaxed">
          Why do we exist? When we look around the universe we can see stars and galaxies in every direction. Why is this all here? In this project, working with scientists around Europe, we begin to search for new answers.
        </p>
      </div>

      <div className="mt-8 max-w-3xl mx-auto px-6 text-lg md:text-xl leading-relaxed space-y-8 text-white/60">
        <p>
          This project will help researchers at the European Spallation Source (ESS) in Lund (a future neutron beam facility) make a new detector to answer this fundamental question. To answer the question of why we exist, we have to know why there is far more matter in our universe than antimatter. We know we have new evidence for this if we shoot neutrons through space and some randomly become antineutrons (their own &ldquo;mirror image&rdquo;), so we tested a prototype detector using a proton beam as a proxy for that signature in Krakow (this will be explained below).
        </p>
      </div>

      {/* SCROLLYTELLING GLOBE SECTION */}
      <div ref={globeContainerRef} className="h-[250vh] relative w-full my-12">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-abyss/60 to-transparent">
          <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 3, 5]} intensity={2} />
            <Suspense fallback={null}>
              <Earth containerRef={globeContainerRef} />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* CONTINUATION OF ARTICLE CONTENT */}
      <div className="max-w-3xl mx-auto px-6 text-lg md:text-xl leading-relaxed space-y-8 text-white/60">
        <p>
          A team of around 20 physicists are currently working on HIBEAM (High-Intensity Baryon Extraction and Measurement, which basically means measuring neutrons) based in Lund, Sweden. Comparing the data they obtained in Krakow with simulations we ran at the University of Edinburgh in Scotland allowed us to find out how well our detector worked.
        </p>

        <h2 className="font-bodoni text-3xl font-medium text-white mt-16 mb-6">Shooting protons or neutrons?</h2>
        <p>
          In the introduction above you may have noticed the mention of a &ldquo;signature&rdquo;, and that despite the final experiment using a neutron beam,
          we are using a proton beam to test the prototype. In fact, these two questions are related to each other.
        </p>
        <p>
          In particle physics, a signature is what a particle can be detected by: some particles, such as neutrons, are very difficult to detect. So instead of detecting them directly, they can be detected by the products they leave behind when they smash into something. In essence that is what our detector is - something for the particles to smash into and leave a trace that can be detected.
          In the case of antineutrons, they smash up and leave behind several &ldquo;pions&rdquo;. These are a mixture of particles slighty smaller than neutrons and protons, with charges of <InlineMath math="+1" />, <InlineMath math="-1" /> or <InlineMath math="0" />.
        </p>

        <AnnihilationSim />

        <p>
          This animation shows antineutrons &ldquo;annihilating&rdquo; matter particles (mirror images cancelling each other out). The leftover energy is released as pions.
        </p>

        <p>
          Our detector is a time projection chamber made of mostly argon (a box where we can trace particle&apos;s paths) - there is no magnetic field so the paths are all straight. We can use a proton beam as the pion signature is in some ways comparable to the protons. We can look at how much energy the protons lose passing through the detector, the directions and paths they take and how quickly they lose energy at different angles to see if the detector is working well.
        </p>

        <p>
          There are also other processes going on that we cannot control that will affect our data - like random fluctuations called noise in our electronics, and particles showering our detector from space called cosmic muons (heavy electrons showering on Earth caused by radiation from space entering the atmosphere).
        </p>

        <div className="relative w-full my-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
          <img
            src="/images/prototpc.png"
            alt="The HIBEAM ProtoTPC Detector"
            className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105"
          />

          <div className="absolute bottom-0 left-0 w-full bg-abyss/85 backdrop-blur-md border-t border-[var(--accent-border)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-ember shadow-[0_0_8px_#FF6B3D]"></div>
              <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em]">
                The Prototype TPC
              </p>
            </div>
            <p className="text-sm text-white/60 leading-relaxed md:pr-12">
              Inside this time projection chamber, the argon gas mixture serves as the target area to detect the protons coming in. If you look closely at the silver cylinder you can see a black square - this is the detector part of the chamber - the cuboid in the interactive mock-ups below. This picture was taken by Blahoslav Rataj.
            </p>
          </div>
        </div>

        <h2 className="font-bodoni text-3xl font-medium text-white mt-16 mb-6">Simulating the detector</h2>

        <p>
          We simulated protons passing through our detector as they did in Krakow.
        </p>
        <InteractiveMagneticFigure />
        <p>
          By clicking above you will be able to visualise exactly what the detectors in this experiment look like! The simulations were done using those exact geometries.
        </p>

        <h2 className="font-bodoni text-3xl font-medium text-white mt-16 mb-6">Does it work?</h2>

        <p>
          We can look at how much energy the protons lose when passing through our detector with a <InlineMath math="\frac{dE}{dx}" /> energy loss graph. This means a graph of the change in the amount of energy deposited in the detector per unit of length travelled in the detector (so if the path lengths are different this discrepancy is divided out).
        </p>
        <EnergyHistogram />
        <p>
          We know this distribution should follow a function called the &ldquo;Landau Distribution&rdquo; - which looks similar to a normal distribution; however, the positive side has a long tail as particles initially lose a lot of energy and lose less the further the pass through the medium. This function cannot be analytically solved however, so we use an approximation for it called the Moyal distribution.
          We can see the fit matches the data, apart from the positive tail not being fully modelled. This is due to the approximations we have made here (on this web page).
        </p>

        <p>
          We can then conclude that our detector is functioning by comparing this simulation here to data! If they match well enough then we can move forward and add new modifications to the prototype to better model the final HIBEAM detector.
        </p>

        {/* --- ACKNOWLEDGEMENTS FOOTNOTE --- */}
        <footer className="mt-24 pt-8 border-t border-white/10">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            Acknowledgements
          </h4>
          <p className="text-sm md:text-base text-white/40 leading-relaxed">
            This project was undertaken with the generous support of the <a href="https://www.particle-nuclear.lu.se/experimental-particle-and-nuclear-physics/hibeam-nnbar" className="text-[var(--accent)]/80 hover:text-[var(--accent)] transition-colors">HIBEAM/NNBAR</a> research team at the <a href="https://ess.eu" className="text-[var(--accent)]/80 hover:text-[var(--accent)] transition-colors">European Spallation Source</a> and my supervisors <a href="https://ess.eu/john-womersley" target="_blank" rel="noopener noreferrer" className="text-white/70 font-medium hover:text-[var(--accent)] transition-colors">Prof. John Womersley</a> &amp; <a href="https://en.wikipedia.org/wiki/Victoria_Martin" target="_blank" rel="noopener noreferrer" className="text-white/70 font-medium hover:text-[var(--accent)] transition-colors">Prof. Victoria Martin</a>. I would like to specially thank <a href="https://portal.research.lu.se/en/persons/matthias-holl/" target="_blank" rel="noopener noreferrer" className="text-white/70 font-medium hover:text-[var(--accent)] transition-colors">Dr. Matthias Holl</a> for his expert guidance with the data from and simulations of the prototype detector.
          </p>
        </footer>
      </div>

    </article>
  );
}
