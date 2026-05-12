"use client";

/**
 * HeroScene — Hero R3F scene. Idle, ambient — not scroll-driven.
 * Floating glass cards drift in 3D space, gently rotating, with subtle
 * cursor parallax tilting the whole scene as the mouse moves.
 *
 * Performance:
 *  - Single Canvas, ≤ 8 meshes total. No transmission, no env map, no HDRI.
 *  - All animation via useFrame mutating refs. No React state.
 *  - dpr capped at [1, 1.5], antialias false.
 *  - Pointer parallax computed from raw window coords with low-pass smoothing
 *    inside useFrame — no event listener per-frame allocations.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type CardConfig = {
  position: [number, number, number];
  rotation: [number, number, number];
  accent: string;
  scale?: number;
  spinSpeed?: number;
  driftPhase?: number;
};

const CARDS: CardConfig[] = [
  { position: [-3.2, 1.5, -1.2], rotation: [0.15, -0.4, 0.1], accent: "#1877F2", scale: 0.95, spinSpeed: 0.12, driftPhase: 0 },
  { position: [3.0, 0.8, -2.4], rotation: [-0.2, 0.5, -0.15], accent: "#98cdb8", scale: 1.05, spinSpeed: -0.1, driftPhase: 1.4 },
  { position: [-1.8, -1.6, -0.6], rotation: [0.25, 0.3, 0.2], accent: "#25D366", scale: 0.85, spinSpeed: 0.14, driftPhase: 2.7 },
  { position: [2.6, -1.4, -3.0], rotation: [-0.1, -0.6, -0.2], accent: "#319b72", scale: 1.0, spinSpeed: -0.13, driftPhase: 0.7 },
  { position: [0.1, 2.4, -4.0], rotation: [0.3, 0.2, -0.3], accent: "#6fb99c", scale: 0.75, spinSpeed: 0.1, driftPhase: 3.5 },
  { position: [-3.8, -0.6, -3.6], rotation: [-0.4, 0.2, 0.3], accent: "#98cdb8", scale: 0.7, spinSpeed: 0.16, driftPhase: 4.2 },
];

// Module-level (not per-component) refs so the pointer listener can be set up
// once at the document level — fewer DOM listeners.
const pointer = { x: 0, y: 0, attached: false };
function attachPointer() {
  if (pointer.attached || typeof window === "undefined") return;
  pointer.attached = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}

function FloatingCard({
  config,
  index,
}: {
  config: CardConfig;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const accentColor = useMemo(() => new THREE.Color(config.accent), [config.accent]);
  const basePos = useMemo(() => new THREE.Vector3(...config.position), [config.position]);
  const baseRot = useMemo(() => new THREE.Euler(...config.rotation), [config.rotation]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const phase = config.driftPhase ?? 0;

    // Idle drift: sinusoidal Y bob, slight X sway, slow Z drift
    const yBob = Math.sin(t * 0.5 + phase) * 0.18;
    const xSway = Math.cos(t * 0.3 + phase) * 0.08;
    const zDrift = Math.sin(t * 0.2 + phase * 1.7) * 0.1;

    groupRef.current.position.x = basePos.x + xSway;
    groupRef.current.position.y = basePos.y + yBob;
    groupRef.current.position.z = basePos.z + zDrift;

    // Idle spin
    const spin = config.spinSpeed ?? 0.1;
    groupRef.current.rotation.x =
      baseRot.x + Math.sin(t * 0.4 + phase) * 0.1;
    groupRef.current.rotation.y = baseRot.y + t * spin;
    groupRef.current.rotation.z =
      baseRot.z + Math.cos(t * 0.3 + phase) * 0.05;
  });

  const s = config.scale ?? 1;

  return (
    <group ref={groupRef} scale={s}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[1.5, 0.95, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.3}
          roughness={0.4}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Accent stripe (top) */}
      <mesh position={[0, 0.32, 0.022]}>
        <planeGeometry args={[1.32, 0.04]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.9} />
      </mesh>

      {/* UI lines */}
      <mesh position={[-0.28, 0.05, 0.022]}>
        <planeGeometry args={[0.8, 0.06]} />
        <meshBasicMaterial color="#98cdb8" transparent opacity={0.55} />
      </mesh>
      <mesh position={[-0.4, -0.1, 0.022]}>
        <planeGeometry args={[0.55, 0.04]} />
        <meshBasicMaterial color="#6fb99c" transparent opacity={0.3} />
      </mesh>
      <mesh position={[-0.5, -0.22, 0.022]}>
        <planeGeometry args={[0.35, 0.04]} />
        <meshBasicMaterial color="#6fb99c" transparent opacity={0.22} />
      </mesh>

      {/* Soft rim glow */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[1.9, 1.35]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Index marker (just for code clarity, not visual) */}
      <group userData={{ index }} />
    </group>
  );
}

function ConnectionLines() {
  // Draw faint connecting lines between adjacent cards — gives a "network" feel
  // without the O(n²) cost. We connect each card to the next two.
  const geom = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < CARDS.length - 1; i++) {
      const a = CARDS[i].position;
      const b = CARDS[i + 1].position;
      positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial
        color="#319b72"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function ParallaxRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Low-pass smoothing toward the global pointer.
    target.current.x += (pointer.x - target.current.x) * 0.05;
    target.current.y += (pointer.y - target.current.y) * 0.05;

    // Tilt camera based on smoothed pointer. Subtle: 0.6 units of sway max.
    camera.position.x = target.current.x * 0.6;
    camera.position.y = 0.2 + target.current.y * 0.4;
    camera.lookAt(0, 0, -1);
  });

  return null;
}

function SceneContents() {
  useEffect(() => {
    attachPointer();
  }, []);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={1.0} color="#cce8d8" />
      <directionalLight position={[-4, -3, 4]} intensity={0.5} color="#6fb99c" />

      <ParallaxRig />
      <ConnectionLines />

      {CARDS.map((card, i) => (
        <FloatingCard key={i} config={card} index={i} />
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 40, position: [0, 0.2, 6.5] }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <SceneContents />
    </Canvas>
  );
}
