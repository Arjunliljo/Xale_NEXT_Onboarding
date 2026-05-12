"use client";

/**
 * FeaturesHeroScene — calmer R3F scene for /features hero.
 * Big central card slowly rotating, with 4 satellite cards orbiting.
 *
 * Performance:
 *  - 5 meshes total, single canvas, no transmission/env, no HDRI.
 *  - All animation in useFrame, no React state.
 *  - DPR cap 1.5, antialias false.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const SATELLITES = [
  { angle: 0, radius: 2.6, accent: "#1877F2" },
  { angle: Math.PI / 2, radius: 2.6, accent: "#25D366" },
  { angle: Math.PI, radius: 2.6, accent: "#319b72" },
  { angle: (3 * Math.PI) / 2, radius: 2.6, accent: "#98cdb8" },
];

function CentralCard() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.18;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.05;
  });

  return (
    <group ref={ref}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[2.6, 1.6, 0.06]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.3}
          roughness={0.35}
          emissive="#04150f"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Accent strip */}
      <mesh position={[0, 0.55, 0.033]}>
        <planeGeometry args={[2.3, 0.06]} />
        <meshBasicMaterial color="#319b72" />
      </mesh>
      {/* UI lines */}
      {[
        { y: 0.2, w: 1.6, op: 0.6 },
        { y: 0.0, w: 1.1, op: 0.4 },
        { y: -0.2, w: 1.3, op: 0.45 },
        { y: -0.42, w: 0.8, op: 0.3 },
      ].map((l, i) => (
        <mesh key={i} position={[-0.3, l.y, 0.033]}>
          <planeGeometry args={[l.w, 0.08]} />
          <meshBasicMaterial color="#98cdb8" transparent opacity={l.op} />
        </mesh>
      ))}
      {/* Soft additive glow */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Satellite({
  angleOffset,
  radius,
  accent,
  index,
}: {
  angleOffset: number;
  radius: number;
  accent: string;
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const orbit = t * 0.18 + angleOffset;
    ref.current.position.x = Math.cos(orbit) * radius;
    ref.current.position.y = Math.sin(orbit) * radius * 0.4;
    ref.current.position.z = Math.sin(orbit) * radius * 0.7 - 0.5;
    ref.current.rotation.y = -orbit + Math.PI / 2;
    ref.current.rotation.x = Math.sin(t * 0.4 + index) * 0.1;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.95, 0.6, 0.035]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.25}
          roughness={0.45}
          emissive="#04150f"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0, 0.22, 0.02]}>
        <planeGeometry args={[0.8, 0.04]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.15, 0, 0.02]}>
        <planeGeometry args={[0.45, 0.04]} />
        <meshBasicMaterial color="#98cdb8" transparent opacity={0.45} />
      </mesh>
      <mesh position={[-0.22, -0.12, 0.02]}>
        <planeGeometry args={[0.3, 0.03]} />
        <meshBasicMaterial color="#6fb99c" transparent opacity={0.3} />
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

function ParallaxRig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (pointer.x - target.current.x) * 0.04;
    target.current.y += (pointer.y - target.current.y) * 0.04;
    camera.position.x = target.current.x * 0.4;
    camera.position.y = 0.1 + target.current.y * 0.25;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContents() {
  if (typeof window !== "undefined") attachPointer();
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} color="#cce8d8" />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#6fb99c" />

      <ParallaxRig />
      <CentralCard />
      {SATELLITES.map((s, i) => (
        <Satellite
          key={i}
          angleOffset={s.angle}
          radius={s.radius}
          accent={s.accent}
          index={i}
        />
      ))}
    </>
  );
}

export default function FeaturesHeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0.1, 6.5] }}
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
