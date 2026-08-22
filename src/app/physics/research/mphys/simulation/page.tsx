'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BackgroundContent } from '@/components/scene';
import ParticleDetector from '@/components/particledetector';

/**
 * Ported unchanged from projects/hibeam/simulation/page.tsx — the
 * Three.js logic doesn't need re-skinning (it's a full-bleed 3D
 * canvas, not themed chrome), just a background colour swap from
 * flat black to abyss so it matches the rest of /research/mphys.
 */
export default function MphysSimulationPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#0A0E1A' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <OrbitControls />
        <BackgroundContent />
        <ParticleDetector />
      </Canvas>
    </div>
  );
}
