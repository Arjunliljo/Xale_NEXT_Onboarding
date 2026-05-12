"use client";

/**
 * HeroLeadOrbitScene — lead-themed hero.
 * 8 3D "lead cards" (avatar + name plate + status pill) orbiting a central
 * glowing Xale core. Scroll progress drives orbit speed + camera depth.
 * Cursor parallax tilts the camera + each card subtly tilts toward cursor.
 *
 * Visual = "Xale captures every lead into one platform" — leads orbit, get pulled in.
 *
 * Perf:
 *  - 8 lead-card groups (3 meshes each = 24) + 1 core sphere + 2 halo planes
 *  - All animation via useFrame mutating refs; no React state
 *  - DPR cap 1.5, antialias false
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type LeadConfig = {
  name: string;
  avatar: string;
  source: "meta" | "whatsapp" | "gmail" | "calls";
  orbitRadius: number;
  orbitInclination: number;
  orbitOffset: number;
  speed: number;
};

const SOURCE_COLOR: Record<LeadConfig["source"], string> = {
  meta: "#1877F2",
  whatsapp: "#25D366",
  gmail: "#EA4335",
  calls: "#319b72",
};

const LEADS: LeadConfig[] = [
  { name: "Anjana P.", avatar: "A", source: "meta", orbitRadius: 2.4, orbitInclination: 0.0, orbitOffset: 0, speed: 0.20 },
  { name: "Kayal S.", avatar: "K", source: "whatsapp", orbitRadius: 2.7, orbitInclination: 0.4, orbitOffset: 1.1, speed: 0.18 },
  { name: "Hari M.", avatar: "H", source: "gmail", orbitRadius: 2.5, orbitInclination: -0.3, orbitOffset: 2.2, speed: 0.22 },
  { name: "Neethu S.", avatar: "N", source: "calls", orbitRadius: 2.8, orbitInclination: 0.2, orbitOffset: 3.3, speed: 0.19 },
  { name: "Nila Academy", avatar: "N", source: "meta", orbitRadius: 2.45, orbitInclination: -0.45, orbitOffset: 4.0, speed: 0.21 },
  { name: "Munnar Trails", avatar: "M", source: "whatsapp", orbitRadius: 2.65, orbitInclination: 0.25, orbitOffset: 4.8, speed: 0.17 },
  { name: "Athira K.", avatar: "A", source: "gmail", orbitRadius: 2.55, orbitInclination: -0.15, orbitOffset: 5.6, speed: 0.23 },
  { name: "Kerala Wings", avatar: "K", source: "calls", orbitRadius: 2.75, orbitInclination: 0.35, orbitOffset: 6.2, speed: 0.20 },
];

function LeadCard({
  lead,
  index,
  progressRef,
}: {
  lead: LeadConfig;
  index: number;
  progressRef: RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const accentColor = useMemo(() => new THREE.Color(SOURCE_COLOR[lead.source]), [lead.source]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scrollBoost = 1 + (progressRef.current ?? 0) * 1.5;
    const angle = lead.orbitOffset + t * lead.speed * scrollBoost;

    const x = Math.cos(angle) * lead.orbitRadius;
    const z = Math.sin(angle) * lead.orbitRadius;
    const y = Math.sin(angle * 1.3 + lead.orbitOffset) * lead.orbitInclination * 1.4;

    groupRef.current.position.set(x, y, z);

    // Face the camera (orient cards toward origin from their orbit position)
    groupRef.current.lookAt(0, 0, 0);
    // Add a slight wobble so cards aren't perfectly flat
    groupRef.current.rotation.z = Math.sin(t * 0.7 + index) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[1.2, 0.7, 0.05]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Accent stripe (source color) */}
      <mesh position={[-0.55, 0, 0.026]}>
        <planeGeometry args={[0.07, 0.55]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Avatar circle (top-left) */}
      <mesh position={[-0.4, 0.18, 0.026]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.9} />
      </mesh>

      {/* Name line */}
      <mesh position={[-0.05, 0.18, 0.026]}>
        <planeGeometry args={[0.55, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>

      {/* Source line */}
      <mesh position={[-0.15, 0.04, 0.026]}>
        <planeGeometry args={[0.4, 0.04]} />
        <meshBasicMaterial color="#98cdb8" transparent opacity={0.55} />
      </mesh>

      {/* Status pill (bottom-right) */}
      <mesh position={[0.32, -0.2, 0.026]}>
        <planeGeometry args={[0.32, 0.1]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.4} />
      </mesh>

      {/* Soft outer glow */}
      <mesh position={[0, 0, -0.04]}>
        <planeGeometry args={[1.5, 0.95]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Core({ progressRef }: { progressRef: RefObject<number> }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current || !haloRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;

    // Core pulses; stronger pulse as user scrolls
    const pulse = 1 + Math.sin(t * 2) * 0.05 + p * 0.3;
    coreRef.current.scale.setScalar(pulse);
    coreRef.current.rotation.y = t * 0.6;

    // Halo grows with scroll
    haloRef.current.scale.setScalar(1 + p * 0.6);
    const mat = haloRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.15 + p * 0.25;
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial
          color="#98cdb8"
          metalness={0.5}
          roughness={0.2}
          emissive="#319b72"
          emissiveIntensity={1.0}
        />
      </mesh>
      <mesh ref={haloRef}>
        <sphereGeometry args={[1.1, 32, 16]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
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

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (pointer.x - target.current.x) * 0.05;
    target.current.y += (pointer.y - target.current.y) * 0.05;

    const p = progressRef.current ?? 0;
    // Dolly forward as user scrolls (camera moves closer)
    const baseZ = 7.0;
    const targetZ = baseZ - p * 1.5;
    camera.position.z += (targetZ - camera.position.z) * 0.1;

    camera.position.x = target.current.x * 0.6;
    camera.position.y = 0.2 + target.current.y * 0.4;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContents({ progressRef }: { progressRef: RefObject<number> }) {
  useEffect(() => {
    attachPointer();
  }, []);

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 6]} intensity={1.0} color="#cce8d8" />
      <directionalLight position={[-4, -3, 3]} intensity={0.45} color="#319b72" />
      <pointLight position={[0, 0, 0]} intensity={1.0} color="#98cdb8" distance={6} />

      <CameraRig progressRef={progressRef} />
      <Core progressRef={progressRef} />

      {LEADS.map((lead, i) => (
        <LeadCard key={i} lead={lead} index={i} progressRef={progressRef} />
      ))}
    </>
  );
}

export default function HeroLeadOrbitScene({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0.2, 7] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <SceneContents progressRef={progressRef} />
    </Canvas>
  );
}
