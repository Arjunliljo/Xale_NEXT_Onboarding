"use client";

/**
 * HeroLeadBarsScene — lead-themed bars hero.
 * 16 vertical 3D bars arranged in a curved row. Each bar represents a
 * lead-volume metric. Bars rise from base height on scroll. "Lead dots"
 * (small green pulses) climb each bar continuously. Bars near the cursor
 * X position glow brighter (interactive).
 *
 * Perf:
 *  - 16 bars + 16 dot trails (each trail = 3 small spheres) ≈ 64 meshes
 *  - All animation in useFrame mutating refs/scale/material props
 *  - DPR cap 1.5, antialias false
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

const BAR_COUNT = 16;
const BAR_SPACING = 0.55;
const ROW_WIDTH = BAR_SPACING * (BAR_COUNT - 1);
const DOTS_PER_BAR = 3;

const pointer = { x: 0, y: 0, normX: 0, attached: false };
function attachPointer() {
  if (pointer.attached || typeof window === "undefined") return;
  pointer.attached = true;
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      // Map screen X to bar X position (approximately matches camera fov 42)
      pointer.normX = pointer.x * 6.5; // tuned to bar row width
    },
    { passive: true }
  );
}

function Bar({
  index,
  progressRef,
  basePhase,
}: {
  index: number;
  progressRef: RefObject<number>;
  basePhase: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const barRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const dotsRef = useRef<THREE.Mesh[]>([]);

  const x = -ROW_WIDTH / 2 + index * BAR_SPACING;
  // Slight Z arc so the row curves toward the camera at the edges
  const z = -Math.abs(index - (BAR_COUNT - 1) / 2) * 0.07 - 0.4;

  useFrame((state) => {
    if (!groupRef.current || !barRef.current || !glowRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;

    // Base height: idle sine wave per bar; scroll boost adds to it
    const idleHeight = 0.45 + Math.sin(t * 1.2 + basePhase) * 0.15 + Math.sin(t * 0.5 + index * 0.3) * 0.1;
    const scrollHeight = idleHeight + p * 1.6;
    // Cursor proximity boost (X distance only)
    const dx = Math.abs(x - pointer.normX);
    const proximity = Math.max(0, 1 - dx / 2.0);
    const finalHeight = scrollHeight + proximity * 0.6;

    // Apply height via Y scale (geometry is 1 unit tall, anchored at base)
    barRef.current.scale.y = finalHeight;
    barRef.current.position.y = finalHeight / 2 - 1.2;

    // Glow strength scales with proximity + scroll
    const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
    glowMat.opacity = 0.08 + proximity * 0.35 + p * 0.15;
    glowRef.current.scale.y = finalHeight;
    glowRef.current.position.y = finalHeight / 2 - 1.2;

    // Color via emissive intensity on the bar material
    const barMat = barRef.current.material as THREE.MeshStandardMaterial;
    barMat.emissiveIntensity = 0.4 + proximity * 0.7 + p * 0.3;

    // Climbing dots (one per dot, looped)
    for (let i = 0; i < DOTS_PER_BAR; i++) {
      const dot = dotsRef.current[i];
      if (!dot) continue;
      const phase = (t * 0.45 + basePhase + i / DOTS_PER_BAR) % 1;
      const dotY = -1.2 + phase * finalHeight;
      dot.position.y = dotY;
      const dotMat = dot.material as THREE.MeshBasicMaterial;
      // Fade in mid-bar, fade out near top
      dotMat.opacity = Math.sin(phase * Math.PI) * (0.85 + proximity * 0.15);
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* Bar mesh — pivoted at base */}
      <mesh ref={barRef}>
        <boxGeometry args={[0.32, 1, 0.32]} />
        <meshStandardMaterial
          color="#0e3225"
          metalness={0.5}
          roughness={0.3}
          emissive="#319b72"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Glow plane behind the bar */}
      <mesh ref={glowRef} position={[0, 0, -0.2]}>
        <planeGeometry args={[0.55, 1]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Climbing lead-dots */}
      {Array.from({ length: DOTS_PER_BAR }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) dotsRef.current[i] = el;
          }}
          position={[0, -1.0, 0.18]}
        >
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshBasicMaterial
            color="#98cdb8"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloorPlane() {
  return (
    <mesh position={[0, -1.22, -0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[ROW_WIDTH + 2, 4]} />
      <meshBasicMaterial
        color="#319b72"
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    target.current.x += (pointer.x - target.current.x) * 0.05;
    target.current.y += (pointer.y - target.current.y) * 0.05;
    const p = progressRef.current ?? 0;
    // Dolly slightly back on scroll so tall bars stay in frame
    const baseZ = 5.5;
    const targetZ = baseZ + p * 1.5;
    camera.position.z += (targetZ - camera.position.z) * 0.08;
    camera.position.x = target.current.x * 0.6;
    camera.position.y = 0.3 + target.current.y * 0.3;
    camera.lookAt(0, -0.1, 0);
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
      <directionalLight position={[-4, -2, 4]} intensity={0.45} color="#319b72" />

      <CameraRig progressRef={progressRef} />
      <FloorPlane />

      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar
          key={i}
          index={i}
          progressRef={progressRef}
          basePhase={i * 0.4}
        />
      ))}
    </>
  );
}

export default function HeroLeadBarsScene({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0.3, 5.5] }}
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
