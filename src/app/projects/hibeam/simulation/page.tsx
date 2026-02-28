'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from '@/components/scene';
import ParticleDetector from '@/components/particledetector'; 

export default function SimulationPage() {
  return (
    // Make the div take up the whole screen (or however big you want it)
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      
      {/* This Canvas is ONLY loaded when someone visits this specific page */}
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        
        {/* Let the user rotate the camera */}
        <OrbitControls />
        
        {/* Your original background effect playing in the distance */}
        <Scene />
        
        {/* The new Geant4 collision happening in the center */}
        <ParticleDetector />
        
      </Canvas>
      
    </div>
  );
}