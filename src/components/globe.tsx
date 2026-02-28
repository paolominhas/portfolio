'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, useScroll } from '@react-three/drei';
import * as THREE from 'three';

// 1. The Coordinate Converter
function get3DPosition(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// 2. Define your 3 locations (e.g., London, New York, Tokyo)
const locations = [
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
];

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Load your Earth image from the public folder
  const earthTexture = useTexture('/earth.jpg');
  
  // Hook into the scrollbar
  const scroll = useScroll();
  
  const globeRadius = 2;

  useFrame((state) => {
    // scroll.offset goes from 0.0 (top of page) to 1.0 (bottom of page)
    const currentScroll = scroll.offset;

    // Slowly rotate the earth automatically
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }

    // ZOOM LOGIC: 
    // Start camera at Z=8 (zoomed out). As user scrolls to 1.0, move to Z=3.5 (zoomed in).
    const startZ = 8;
    const endZ = 3.5;
    state.camera.position.z = THREE.MathUtils.lerp(startZ, endZ, currentScroll);
  });

  return (
    <group>
      {/* The Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[globeRadius, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.6} />
      </mesh>

      {/* The Location Pins */}
      {locations.map((loc, i) => {
        const position = get3DPosition(loc.lat, loc.lng, globeRadius);
        return (
          <mesh key={i} position={position}>
            {/* Make the pins tiny glowing spheres */}
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
        );
      })}
    </group>
  );
}