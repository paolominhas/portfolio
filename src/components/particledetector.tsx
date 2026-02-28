import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import collisionData from '../../public/data/collision-data.json';

export default function ParticleDetector() {
  const pointsRef = useRef<THREE.Points>(null);

  // 1. Setup the initial positions and velocities based on our JSON
  const particleCount = collisionData.particles.length;
  
  const { positions, velocities, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorHelper = new THREE.Color();

    collisionData.particles.forEach((p, i) => {
      // Set Origins
      positions[i * 3] = p.origin[0];
      positions[i * 3 + 1] = p.origin[1];
      positions[i * 3 + 2] = p.origin[2];

      // Set Velocities
      velocities[i * 3] = p.velocity[0];
      velocities[i * 3 + 1] = p.velocity[1];
      velocities[i * 3 + 2] = p.velocity[2];

      // Set Colors
      colorHelper.set(p.color);
      colors[i * 3] = colorHelper.r;
      colors[i * 3 + 1] = colorHelper.g;
      colors[i * 3 + 2] = colorHelper.b;
    });

    return { positions, velocities, colors };
  }, [particleCount]);

  // 2. Animate the particles on every single frame
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    const currentPositions = positionsAttr.array as Float32Array;

    // Loop through all particles and move them based on their velocity
    for (let i = 0; i < particleCount; i++) {
      currentPositions[i * 3] += velocities[i * 3] * delta;     // X
      currentPositions[i * 3 + 1] += velocities[i * 3 + 1] * delta; // Y
      currentPositions[i * 3 + 2] += velocities[i * 3 + 2] * delta; // Z
    }

    // Tell Three.js the positions have changed so it redraws them
    positionsAttr.needsUpdate = true;
  });

  // 3. Render the particles (Notice we fixed the TS error here too!)
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.1} 
        vertexColors={true} 
        transparent={true} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
}