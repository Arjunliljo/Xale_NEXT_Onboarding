"use client";

/**
 * PillarsConstellationScene — 6 distinct 3D geometric primitives floating
 * in a wide horizontal band. Each primitive represents one of the six
 * product pillars. Each rotates independently at a unique speed.
 *
 * Distinct from chain/blob/convergence: geometric variety is the visual hook.
 *
 * Perf:
 *  - 6 meshes (cube, sphere, torus, tetra, octa, cylinder), low-poly each
 *  - All animation via useFrame mutating refs; no React state
 *  - DPR cap 1.5, no antialias
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Shape = "box" | "sphere" | "torus" | "tetra" | "octa" | "cylinder";

const PILLARS: { shape: Shape; x: number; y: number; z: number; accent: string }[] = [
  { shape: "box", x: -4.5, y: 0.8, z: -0.5, accent: "#319b72" },
  { shape: "sphere", x: -2.7, y: -0.7, z: -1.2, accent: "#98cdb8" },
  { shape: "torus", x: -0.9, y: 0.6, z: -0.4, accent: "#6fb99c" },
  { shape: "tetra", x: 0.9, y: -0.6, z: -0.9, accent: "#319b72" },
  { shape: "octa", x: 2.7, y: 0.8, z: -1.3, accent: "#98cdb8" },
  { shape: "cylinder", x: 4.5, y: -0.5, z: -0.5, accent: "#6fb99c" },
];

function PillarShape({
  shape,
  x,
  y,
  z,
  accent,
  index,
}: {
  shape: Shape;
  x: number;
  y: number;
  z: number;
  accent: string;
  index: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // Each shape spins on different axes at different speeds
    const speedA = 0.15 + (index % 3) * 0.05;
    const speedB = 0.12 + (index % 2) * 0.04;
    ref.current.rotation.x = t * speedA + index;
    ref.current.rotation.y = t * speedB + index * 0.7;
    // Gentle vertical bob, phased per index
    ref.current.position.y = y + Math.sin(t * 0.6 + index * 1.1) * 0.18;
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      {shape === "box" && <boxGeometry args={[0.95, 0.95, 0.95]} />}
      {shape === "sphere" && <sphereGeometry args={[0.6, 24, 16]} />}
      {shape === "torus" && <torusGeometry args={[0.55, 0.2, 12, 32]} />}
      {shape === "tetra" && <tetrahedronGeometry args={[0.85, 0]} />}
      {shape === "octa" && <octahedronGeometry args={[0.75, 0]} />}
      {shape === "cylinder" && (
        <cylinderGeometry args={[0.45, 0.45, 1.0, 24]} />
      )}
      <meshStandardMaterial
        color="#0e3225"
        metalness={0.7}
        roughness={0.3}
        emissive={accent}
        emissiveIntensity={0.35}
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

function ParallaxRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useFrame(() => {
    target.current.x += (pointer.x - target.current.x) * 0.04;
    target.current.y += (pointer.y - target.current.y) * 0.04;
    camera.position.x = target.current.x * 0.5;
    camera.position.y = 0.1 + target.current.y * 0.25;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContents() {
  useEffect(() => {
    attachPointer();
  }, []);
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.1} color="#cce8d8" />
      <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#319b72" />
      <ParallaxRig />
      {PILLARS.map((p, i) => (
        <PillarShape key={i} {...p} index={i} />
      ))}
    </>
  );
}

export default function PillarsConstellationScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 38, position: [0, 0.2, 7] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <SceneContents />
    </Canvas>
  );
}
