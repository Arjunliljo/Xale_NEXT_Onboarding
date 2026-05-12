"use client";

/**
 * SolutionConvergenceScene — particles fly inward to form a glowing core.
 * Represents unification (the answer to the problem of leaking leads).
 *
 * Perf:
 *  - 1 Points mesh (300 particles) + 1 sphere core
 *  - All particle motion done on CPU but extremely cheap: 300 particles ≈
 *    ~0.05ms/frame on M1
 *  - DPR cap 1.5, no antialias
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 300;
const SPAWN_RADIUS = 5.5;
const CORE_RADIUS = 0.35;

function Core() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const s = 1 + Math.sin(t * 1.4) * 0.08;
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = t * 0.4;
  });

  return (
    <group>
      {/* Glowing inner core */}
      <mesh ref={ref}>
        <icosahedronGeometry args={[CORE_RADIUS, 1]} />
        <meshBasicMaterial color="#98cdb8" />
      </mesh>
      {/* Outer halo */}
      <mesh>
        <sphereGeometry args={[CORE_RADIUS * 2.6, 24, 24]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer halo 2 */}
      <mesh>
        <sphereGeometry args={[CORE_RADIUS * 4.5, 24, 24]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function ConvergingParticles() {
  const ref = useRef<THREE.Points>(null);

  const { geometry, material, originalPositions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const original = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      // Random point on sphere surface at SPAWN_RADIUS
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SPAWN_RADIUS * (0.6 + Math.random() * 0.4);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      original[i * 3 + 0] = x;
      original[i * 3 + 1] = y;
      original[i * 3 + 2] = z;
      speeds[i] = 0.3 + Math.random() * 0.7;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#98cdb8"),
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat, originalPositions: original, speeds };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      const ox = positions[i * 3 + 0];
      const oy = positions[i * 3 + 1];
      const oz = positions[i * 3 + 2];
      const d2 = ox * ox + oy * oy + oz * oz;
      const d = Math.sqrt(d2);

      if (d < CORE_RADIUS * 1.4) {
        // Respawn at outer shell
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = SPAWN_RADIUS * (0.7 + Math.random() * 0.4);
        positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      } else {
        // Pull inward toward origin
        const pull = speeds[i] * dt;
        const k = pull / d;
        positions[i * 3 + 0] = ox - ox * k;
        positions[i * 3 + 1] = oy - oy * k;
        positions[i * 3 + 2] = oz - oz * k;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
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
    camera.position.y = target.current.y * 0.35;
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
      <ambientLight intensity={0.7} />
      <ParallaxRig />
      <Core />
      <ConvergingParticles />
    </>
  );
}

export default function SolutionConvergenceScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0, 6.5] }}
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
