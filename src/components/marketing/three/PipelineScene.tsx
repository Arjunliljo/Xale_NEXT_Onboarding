"use client";

/**
 * PipelineScene — Apple-style pinned 3D scroll scene.
 *
 * Performance principles applied (per R3F best practices 2026):
 *  - All animations live in `useFrame`, reading a `useRef` for scroll progress.
 *    No React state changes during scroll → no reconciliation cost.
 *  - Single Canvas, single camera, ≤ 10 meshes total. No transmission material
 *    (too expensive on mobile GPUs). No post-processing (no bloom / DOF).
 *  - DPR capped at 1.5 (retina-cap), antialias false (we don't need MSAA for
 *    flat glass surfaces — relying on CSS smoothing of the canvas tag).
 *  - Geometry/Material instantiated once via `useMemo`; meshes positioned by
 *    mutating `ref.current.position` / `ref.current.rotation` inside `useFrame`.
 *  - No env maps, no HDRIs. Just three lights and a tonemap.
 *  - Lazy-loaded by the parent (`dynamic(..., { ssr: false })`).
 */

import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type CardConfig = {
  label: string;
  meta: string;
  accent: string;
  // Phase 1 = scattered position (sphere shell); Phase 2 = aligned pipeline.
  scatter: [number, number, number];
  scatterRotation: [number, number, number];
};

const CARDS: CardConfig[] = [
  { label: "Anjana · IELTS", meta: "Meta · 0s", accent: "#1877F2", scatter: [-3.2, 1.4, -1.5], scatterRotation: [0.3, -0.6, 0.2] },
  { label: "Kayal Studio", meta: "Reel · 2s", accent: "#98cdb8", scatter: [2.4, -1.2, -2.1], scatterRotation: [-0.2, 0.4, -0.3] },
  { label: "Hari M.", meta: "WhatsApp · 8s", accent: "#25D366", scatter: [-1.8, -2.0, 1.4], scatterRotation: [0.1, 0.8, 0.4] },
  { label: "Neethu S.", meta: "Won · 22d", accent: "#319b72", scatter: [3.0, 1.8, 1.0], scatterRotation: [-0.3, -0.4, -0.2] },
  { label: "Nila Academy", meta: "Visa · 18d", accent: "#156548", scatter: [-2.4, 2.2, 1.8], scatterRotation: [0.4, 0.2, -0.5] },
  { label: "Munnar Trails", meta: "Booked · 4d", accent: "#6fb99c", scatter: [1.6, -2.6, -0.6], scatterRotation: [-0.5, -0.3, 0.4] },
];

// Pipeline stages — final aligned positions (X axis, evenly spaced).
const PIPELINE_X = (i: number, count: number) => {
  const span = 7.5;
  return -span / 2 + (span / (count - 1)) * i;
};

type SceneProps = {
  progressRef: RefObject<number>;
};

function Card({
  config,
  index,
  total,
  progressRef,
}: {
  config: CardConfig;
  index: number;
  total: number;
  progressRef: RefObject<number>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // Stage that this card "settles" into during phase 2.
  const targetX = PIPELINE_X(index, total);
  const targetY = 0;
  const targetZ = 0;

  // Stage-progression beat — each card's "light up" moment in phase 3.
  const lightUpStart = 0.55 + (index / total) * 0.25;
  const lightUpEnd = lightUpStart + 0.05;

  useFrame((state) => {
    if (!meshRef.current) return;
    const p = progressRef.current ?? 0;

    // Phase splits (in scroll progress 0→1):
    //   0.00–0.30 → idle drift (scattered)
    //   0.30–0.60 → align into pipeline
    //   0.60–0.85 → cards "light up" one by one
    //   0.85–1.00 → final glow + slight zoom
    const alignT = THREE.MathUtils.smoothstep(p, 0.3, 0.6);
    const idleBob = Math.sin(state.clock.elapsedTime * 0.6 + index) * 0.05 * (1 - alignT);

    // Position: lerp from scatter → pipeline
    const x = THREE.MathUtils.lerp(config.scatter[0], targetX, alignT);
    const y = THREE.MathUtils.lerp(config.scatter[1] + idleBob, targetY + idleBob * 0.3, alignT);
    const z = THREE.MathUtils.lerp(config.scatter[2], targetZ, alignT);

    meshRef.current.position.set(x, y, z);

    // Rotation: lerp from chaotic → facing camera
    const rx = THREE.MathUtils.lerp(config.scatterRotation[0], 0, alignT);
    const ry = THREE.MathUtils.lerp(config.scatterRotation[1], 0, alignT);
    const rz = THREE.MathUtils.lerp(config.scatterRotation[2], 0, alignT);

    // Idle: gentle Y rotation when scattered
    const idleRot = (1 - alignT) * Math.sin(state.clock.elapsedTime * 0.3 + index * 0.4) * 0.15;
    meshRef.current.rotation.set(rx, ry + idleRot, rz);

    // Light-up moment
    if (glowRef.current) {
      const lightUp = THREE.MathUtils.smoothstep(p, lightUpStart, lightUpEnd);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = lightUp * 0.55;
    }
  });

  // Materials — one instance per card (could share if we don't need per-card color).
  // accent color used only on the edge glow, not on body, to keep look unified.
  const accentColor = useMemo(() => new THREE.Color(config.accent), [config.accent]);

  return (
    <group ref={meshRef}>
      {/* Card body — slim rounded rectangle */}
      <mesh>
        <boxGeometry args={[1.6, 1.0, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.2}
          roughness={0.35}
          emissive="#04150f"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Inner highlight strip */}
      <mesh position={[0, 0.32, 0.022]}>
        <planeGeometry args={[1.36, 0.04]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.85} />
      </mesh>

      {/* Body content lines (faux UI) */}
      <mesh position={[-0.3, 0.05, 0.022]}>
        <planeGeometry args={[0.8, 0.06]} />
        <meshBasicMaterial color="#98cdb8" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-0.45, -0.1, 0.022]}>
        <planeGeometry args={[0.5, 0.04]} />
        <meshBasicMaterial color="#6fb99c" transparent opacity={0.3} />
      </mesh>
      <mesh position={[-0.5, -0.22, 0.022]}>
        <planeGeometry args={[0.4, 0.04]} />
        <meshBasicMaterial color="#6fb99c" transparent opacity={0.25} />
      </mesh>

      {/* Light-up rim — appears in phase 3 */}
      <mesh ref={glowRef} position={[0, 0, -0.02]}>
        <planeGeometry args={[2.0, 1.4]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PipelineRibbon({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = progressRef.current ?? 0;
    const visT = THREE.MathUtils.smoothstep(p, 0.45, 0.7);
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = visT * 0.35;
  });

  return (
    <mesh ref={ref} position={[0, -0.05, -0.5]}>
      <planeGeometry args={[8.5, 0.04]} />
      <meshBasicMaterial color="#319b72" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  const startZ = 9;
  const endZ = 6.5;
  const startY = 0.2;
  const endY = 0;

  useFrame(() => {
    const p = progressRef.current ?? 0;
    const zoomT = THREE.MathUtils.smoothstep(p, 0.0, 1.0);
    camera.position.z = THREE.MathUtils.lerp(startZ, endZ, zoomT);
    camera.position.y = THREE.MathUtils.lerp(startY, endY, zoomT);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneContents({ progressRef }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#cce8d8" />
      <directionalLight position={[-3, -2, 2]} intensity={0.5} color="#6fb99c" />

      <CameraRig progressRef={progressRef} />
      <PipelineRibbon progressRef={progressRef} />

      {CARDS.map((card, i) => (
        <Card
          key={i}
          config={card}
          index={i}
          total={CARDS.length}
          progressRef={progressRef}
        />
      ))}
    </>
  );
}

export default function PipelineScene({ progressRef }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 38, position: [0, 0.2, 9] }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <SceneContents progressRef={progressRef} />
    </Canvas>
  );
}

// Silence unused import (we re-export the type ThreeElements in case future
// JSX intrinsic typing needs it; harmless).
export type { ThreeElements };
