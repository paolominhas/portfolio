'use client';

import { Component, Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * MPHYS SCROLLYTELLING GLOBE
 * ─────────────────────────────────────────────────────────────────
 * Extracted from MphysContent.tsx and rebuilt, because the old version had
 * three problems:
 *
 *  1. It went blank on scroll. The globe sits in a `position: sticky` panel,
 *     but the page's <article> had `overflow-hidden`, and any ancestor with
 *     overflow other than `visible` becomes the sticky element's scroll
 *     container, so the panel never stuck and simply scrolled away while the
 *     scroll-driven animation carried on with nothing on screen. (The article
 *     now uses `overflow-x-clip`, which clips without creating a scroll
 *     container. Fixed in MphysContent.tsx.)
 *
 *  2. It sat too high / was cropped. Camera distance and the pan were fixed
 *     numbers tuned for one desktop window. Here the camera distance is
 *     computed from the viewport's aspect ratio, so the globe is the same
 *     fraction of the screen on a wide monitor and a narrow phone, and the
 *     pan is computed so the focus point (northern Europe) always ends up at
 *     the centre of the screen rather than at a hard-coded offset.
 *
 *  3. It was fragile on phones. Heights use `svh` (so the mobile URL bar
 *     doesn't change the track length mid-scroll), the canvas lets vertical
 *     swipes scroll the page, the pixel ratio is capped, rendering pauses when
 *     the globe is off-screen, and labels are DOM text instead of WebGL text.
 *     (drei's <Text> downloads a font from a CDN at runtime, and when that
 *     failed the whole canvas died.) If anything in WebGL still fails, an
 *     error boundary shows a static fallback instead of a blank gap.
 */

const R = 2.5; // globe radius in world units

function toVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// dx/dy: where the label sits relative to its pin, as a direction on screen.
const LOCATIONS = [
  { name: 'ESS, Lund', short: 'ESS · Lund', lat: 55.7047, lng: 13.191, dx: 1, dy: 0.7 },
  { name: 'University of Edinburgh', short: 'Edinburgh', lat: 55.95, lng: -3.19, dx: -1, dy: 0.9 },
  { name: 'IFJ PAN, Kraków', short: 'IFJ PAN · Kraków', lat: 50.0647, lng: 19.945, dx: 1, dy: -0.8 },
];

// Where the camera should end up looking: roughly the middle of the three sites.
const FOCUS = toVec3(54, 10, R);

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function Earth({ track, sticky }: { track: RefObject<HTMLDivElement | null>; sticky: RefObject<HTMLDivElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const texture = useTexture('/images/earth.jpg');
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const lines = useRef<(THREE.Material | null)[]>([]);
  const tmp = useRef({ w: new THREE.Vector3(), p: new THREE.Vector3(), c: new THREE.Vector3(), v: new THREE.Vector3() });

  useFrame((state) => {
    const g = group.current;
    const t = track.current;
    const s = sticky.current;
    if (!g || !t || !s) return;

    // 0 -> 1 across the part of the track where the panel is actually stuck.
    const rect = t.getBoundingClientRect();
    const travel = Math.max(rect.height - s.clientHeight, 1);
    const progress = clamp01(-rect.top / travel);

    // CAMERA: size the globe as a fraction of the *smaller* screen dimension.
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / state.size.height;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const portrait = aspect < 0.85;
    const zoom = smooth(0, 0.6, progress);
    const fraction = THREE.MathUtils.lerp(portrait ? 0.5 : 0.45, portrait ? 0.74 : 0.95, zoom);
    cam.position.z = (2 * R) / (fraction * 2 * tanHalf * Math.min(1, aspect));

    // ROTATE (same choreography as before: a slow turn that brings Europe round to face the camera).
    const spin = smooth(0, 0.8, progress);
    g.rotation.y = spin * 1.2 + 0.5 + Math.PI;
    g.rotation.x = spin * (Math.PI / 6);

    // PAN: put the focus point at the centre of the screen (not a hard-coded offset).
    g.position.set(0, 0, 0);
    g.updateMatrixWorld(true);
    const { w, p, c, v } = tmp.current;
    w.copy(FOCUS);
    g.localToWorld(w);
    const pan = smooth(0, 0.8, progress);
    g.position.set(-w.x * pan, -w.y * pan, 0);
    g.updateMatrixWorld(true);

    // LABELS: fade in at the end, and fade out for any pin that has turned round the back.
    const fade = smooth(0.7, 0.95, progress);
    g.getWorldPosition(c);
    LOCATIONS.forEach((loc, i) => {
      p.copy(toVec3(loc.lat, loc.lng, R));
      g.localToWorld(p);
      const facing = p.clone().sub(c).normalize().dot(v.copy(cam.position).sub(p).normalize());
      const visible = fade * smooth(0.05, 0.3, facing);
      const el = labels.current[i];
      if (el) el.style.opacity = String(visible);
      const mat = lines.current[i];
      if (mat) {
        mat.transparent = true;
        mat.opacity = visible * 0.45;
      }
    });
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.8} />
      </mesh>

      {LOCATIONS.map((loc, i) => {
        const pin = toVec3(loc.lat, loc.lng, R);
        // The label floats out from the pin along the surface normal, then sideways/up a little.
        const tip = pin.clone().multiplyScalar(1.12);
        tip.x += loc.dx * 0.25;
        tip.y += loc.dy * 0.25;
        const side = loc.dx > 0 ? 'right' : 'left';
        return (
          <group key={loc.name}>
            <mesh position={pin}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshBasicMaterial color="#FF6B3D" />
            </mesh>
            <Line
              points={[pin, tip]}
              color="white"
              lineWidth={1}
              transparent
              opacity={0}
              ref={(el) => {
                if (el) lines.current[i] = el.material as THREE.Material;
              }}
            />
            <Html position={tip} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
              <div
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className="whitespace-nowrap text-[11px] md:text-sm tracking-[0.08em] text-white/90 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]"
                style={{
                  opacity: 0,
                  transform: side === 'right' ? 'translate(6px,-50%)' : 'translate(calc(-100% - 6px),-50%)',
                }}
              >
                <span className="md:hidden">{loc.short}</span>
                <span className="hidden md:inline">{loc.name}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/** If WebGL or the texture fails, show a quiet static panel instead of a blank gap. */
class GlobeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('MPhys globe could not render:', error);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="h-40 w-40 rounded-full bg-gradient-to-br from-kelp/40 to-abyss border border-white/10" />
          <p className="text-sm text-white/50">Lund (ESS) · Edinburgh · Kraków (IFJ PAN)</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MphysGlobe() {
  const track = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  // Don't burn battery rendering a globe nobody can see.
  useEffect(() => {
    const el = track.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: '200px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // The track is the scroll distance; the sticky panel inside it is what the reader sees.
    <div ref={track} className="relative my-12 h-[240vh] supports-[height:100svh]:h-[240svh] w-full">
      <div
        ref={sticky}
        className="sticky top-0 h-screen supports-[height:100svh]:h-svh w-full overflow-hidden bg-gradient-to-b from-transparent via-abyss/60 to-transparent"
      >
        <GlobeBoundary>
          <Canvas
            frameloop={onScreen ? 'always' : 'never'}
            dpr={[1, 1.75]}
            camera={{ position: [0, 0, 12], fov: 45 }}
            style={{ touchAction: 'pan-y' }}
            role="img"
            aria-label="A globe turning to show Lund, Edinburgh and Kraków"
          >
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 3, 5]} intensity={2} />
            <Suspense fallback={null}>
              <Earth track={track} sticky={sticky} />
            </Suspense>
          </Canvas>
        </GlobeBoundary>
      </div>
    </div>
  );
}
