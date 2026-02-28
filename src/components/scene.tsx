'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import { Environment, Float, Stars, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';

// --- Part A: The Actual 3D Content ---
// This component holds your "World". separating it allows for easier testing
// and cleaner separation of concerns from the Canvas settings.
function BackgroundContent() {
  const meshRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // OPTIMIZATION: Use useMemo for heavy calculations so they don't run every frame
  // Example: Generating random positions for particles
  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  // 2. LISTENER: efficiently track mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize coordinates to -1 (left/bottom) to +1 (right/top)
      // This makes the math easier regardless of screen size.
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3. ANIMATION LOOP: The "Game Loop"
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Basic constant rotation (idling)
      meshRef.current.rotation.y += delta * 0.05;

      // PARALLAX MATH (Linear Interpolation or "Lerp")
      // Instead of snapping to the mouse, we move 10% of the way there every frame.
      // formula: current + (target - current) * speed
      
      // Rotate the group based on mouse X
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.current.y * 0.2, // Target (limit rotation to small angle)
        delta * 2               // Speed (smoothness)
      );

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.current.x * 0.2 + (state.clock.elapsedTime * 0.05), // Mouse + Auto-rotation
        delta * 2
      );
    }
  });

  return (
    <group ref={meshRef}>
      {/* Example: A floating, aesthetically pleasing abstract shape */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Float>
      
      {/* Example: Custom Geometry */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[positions, 3]}
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#5eead4" transparent opacity={0.8} />
      </points>
    </group>
  );
}

// --- Part B: The Canvas Wrapper ---
// This is what you export to layout.tsx
export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none">
      <Canvas
        // 1. PERFORMANCE: Limit pixel ratio to 2 to save battery on high-res screens (MacBooks)
        dpr={[1, 2]} 
        // 2. CAMERA: Fixed settings prevent jarring jumps
        camera={{ position: [0, 0, 5], fov: 45 }}
        // 3. COLOR: Match your Tailwind theme manually or via gl settings
        gl={{ antialias: true, alpha: true }} 
      >
        {/* PERFORMANCE: Automatically lowers quality if fps drops */}
        <AdaptiveDpr pixelated />

        {/* LOADING: Suspense ensures the 3D part doesn't block the UI from showing */}
        <Suspense fallback={null}>
            
            {/* LIGHTING: Essential for 3D depth */}
            <ambientLight intensity={0.5} />
            
            {/* CONTENT */}
            <BackgroundContent />
            
            {/* ENVIRONMENT: Adds subtle reflections without heavy textures */}
            <Environment preset="city" />
            
        </Suspense>
      </Canvas>
    </div>
  );
}