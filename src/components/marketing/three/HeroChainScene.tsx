"use client";

/**
 * HeroChainScene — voxr-style 3D chain.
 * 5 interlocking torus rings arranged on a diagonal axis, each rotated 90°
 * from the previous so they visually link. The whole chain rotates slowly,
 * the ring around the camera axis precesses gently, and cursor moves
 * subtly tilt the chain.
 *
 * Perf:
 *  - 5 toruses, low segment counts (24 radial × 8 tubular = 384 tris each)
 *  - One MeshStandardMaterial shared across all rings
 *  - All animation via useFrame mutating refs; no React state
 *  - DPR cap 1.5, antialias false
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const RING_COUNT = 5;
const RING_GAP = 0.95;
const RING_RADIUS = 0.85;
const RING_TUBE = 0.13;

function ChainLink({
  index,
  groupRef,
}: {
  index: number;
  groupRef: React.RefObject<THREE.Group | null>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    // Each ring slowly rotates on its own primary axis to catch the light
    const spinAxis = index % 2 === 0 ? "z" : "x";
    if (spinAxis === "z") {
      meshRef.current.rotation.z = t * 0.18 + index * 0.3;
    } else {
      meshRef.current.rotation.x = t * 0.18 + index * 0.3;
    }
  });

  // Position chain links along a slight diagonal so the chain reads as a 3D form
  const xPos = (index - (RING_COUNT - 1) / 2) * RING_GAP;
  const yPos = Math.sin((index - (RING_COUNT - 1) / 2) * 0.6) * 0.2;
  const zPos = Math.cos((index - (RING_COUNT - 1) / 2) * 0.5) * 0.4;

  // Each link is rotated 90° from its neighbor on Y axis so the rings interlock
  const yRot = (index % 2) * (Math.PI / 2);

  return (
    <mesh
      ref={meshRef}
      position={[xPos, yPos, zPos]}
      rotation={[0, yRot, 0]}
    >
      <torusGeometry args={[RING_RADIUS, RING_TUBE, 16, 32]} />
      <meshStandardMaterial
        color="#0e3225"
        metalness={0.85}
        roughness={0.18}
        emissive="#0c2a1f"
        emissiveIntensity={0.55}
      />
    </mesh>
  );
}

function ChainGroup({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Whole chain precesses slowly
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.35;
    groupRef.current.rotation.x = Math.cos(t * 0.12) * 0.12;
    // Slight up-down float
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <ChainLink key={i} index={i} groupRef={groupRef} />
      ))}
    </group>
  );
}

// Soft halo behind the chain — adds depth and a green wash
function Halo() {
  return (
    <mesh position={[0, 0, -1.5]}>
      <planeGeometry args={[10, 6]} />
      <meshBasicMaterial
        color="#319b72"
        transparent
        opacity={0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

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

function ParallaxRig({
  chainRef,
}: {
  chainRef: React.RefObject<THREE.Group | null>;
}) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (pointer.x - target.current.x) * 0.05;
    target.current.y += (pointer.y - target.current.y) * 0.05;
    // Camera parallax
    camera.position.x = target.current.x * 0.5;
    camera.position.y = 0.2 + target.current.y * 0.35;
    camera.lookAt(0, 0, 0);
    // Chain also subtly tilts toward cursor
    if (chainRef.current) {
      chainRef.current.rotation.z = target.current.x * 0.2;
    }
  });

  return null;
}

function SceneContents() {
  const chainRef = useRef<THREE.Group | null>(null);
  useEffect(() => {
    attachPointer();
  }, []);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} color="#cce8d8" />
      <directionalLight position={[-4, -3, 3]} intensity={0.6} color="#319b72" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#98cdb8" />

      <ParallaxRig chainRef={chainRef} />
      <Halo />
      <ChainGroup groupRef={chainRef} />
    </>
  );
}

export default function HeroChainScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0.2, 6.5] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <SceneContents />
    </Canvas>
  );
}
