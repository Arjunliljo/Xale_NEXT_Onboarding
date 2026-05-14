"use client";

/**
 * ProblemDriftScene — lead-themed problem section.
 * 10 lead cards drift apart from each other as the user scrolls; each card
 * fades out and gains a red "missed" pulse near the end. Cursor parallax
 * tilts the camera. Represents leads being lost across disconnected tools.
 *
 * Perf:
 *  - 10 lead-card groups (each ~5 meshes) ≈ 50 meshes (all under one Canvas)
 *  - All animation in useFrame mutating refs/materials; no React state
 *  - DPR cap 1.5, antialias false
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

const TOOL_COLOR = {
  spreadsheet: "#98cdb8",
  whatsapp: "#25D366",
  meta: "#1877F2",
  inbox: "#EA4335",
} as const;

type Tool = keyof typeof TOOL_COLOR;

type Lead = {
  startPos: [number, number, number];
  driftDir: [number, number, number];
  tool: Tool;
  rotPhase: number;
};

const LEADS: Lead[] = [
  { startPos: [-1.2, 0.6, 0.4], driftDir: [-2.6, 1.2, -0.4], tool: "spreadsheet", rotPhase: 0.0 },
  { startPos: [1.1, 0.7, 0.2], driftDir: [2.5, 1.4, 0.1], tool: "whatsapp", rotPhase: 0.7 },
  { startPos: [-1.0, -0.8, 0.6], driftDir: [-2.4, -1.3, 0.2], tool: "meta", rotPhase: 1.4 },
  { startPos: [1.2, -0.7, 0.3], driftDir: [2.3, -1.5, -0.1], tool: "inbox", rotPhase: 2.1 },
  { startPos: [-0.5, 1.1, -0.2], driftDir: [-1.5, 2.4, -0.6], tool: "whatsapp", rotPhase: 2.8 },
  { startPos: [0.6, -1.1, -0.4], driftDir: [1.4, -2.6, -0.7], tool: "spreadsheet", rotPhase: 3.5 },
  { startPos: [-1.5, 0.0, 0.5], driftDir: [-3.0, 0.2, 0.8], tool: "meta", rotPhase: 4.2 },
  { startPos: [1.4, 0.2, -0.3], driftDir: [3.0, -0.1, -0.6], tool: "inbox", rotPhase: 4.9 },
  { startPos: [0.0, 1.3, 0.5], driftDir: [0.3, 2.7, 0.9], tool: "whatsapp", rotPhase: 5.6 },
  { startPos: [0.2, -1.4, -0.1], driftDir: [-0.2, -2.8, -0.4], tool: "meta", rotPhase: 6.3 },
];

function LeadCard({
  lead,
  index,
  progressRef,
}: {
  lead: Lead;
  index: number;
  progressRef: RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const accent = useMemo(() => new THREE.Color(TOOL_COLOR[lead.tool]), [lead.tool]);
  // Per-axis rotation accumulators wrapped at 2π. Sharing a single `t` and
  // scaling by non-integer per-axis coefficients caused a visible jolt every
  // ~6s when t wrapped, because the wrap didn't land on a 2π boundary in the
  // scaled rotation. Per-axis wrap lands cleanly on 2π and is invisible.
  const rotXRef = useRef(0);
  const rotYRef = useRef(0);
  const zPhaseRef = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current || !glowRef.current) return;
    const p = progressRef.current ?? 0;
    // Clamp dt to avoid huge catch-up jumps when the tab regains focus.
    const safeDt = dt > 0.1 ? 0.1 : dt;

    // Drift outward as scroll progresses
    const drift = p; // 0 → 1
    groupRef.current.position.x = lead.startPos[0] + lead.driftDir[0] * drift;
    groupRef.current.position.y = lead.startPos[1] + lead.driftDir[1] * drift;
    groupRef.current.position.z = lead.startPos[2] + lead.driftDir[2] * drift;

    // Tumbling rotation, accelerating with scroll.
    const spin = 0.2 + p * 1.2;
    rotXRef.current = (rotXRef.current + safeDt * spin * 0.4) % (Math.PI * 2);
    rotYRef.current = (rotYRef.current + safeDt * spin * 0.6) % (Math.PI * 2);
    zPhaseRef.current = (zPhaseRef.current + safeDt * 0.5) % (Math.PI * 2);
    groupRef.current.rotation.x = lead.rotPhase + rotXRef.current;
    groupRef.current.rotation.y = lead.rotPhase + rotYRef.current;
    groupRef.current.rotation.z = Math.sin(zPhaseRef.current + index) * 0.1;

    // Red "missed" glow grows past 60% scroll
    const missGlow = THREE.MathUtils.smoothstep(p, 0.5, 1.0);
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = missGlow * 0.45;
  });

  return (
    <group ref={groupRef}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[1.1, 0.65, 0.045]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.35}
          roughness={0.35}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Accent stripe */}
      <mesh position={[-0.51, 0, 0.024]}>
        <planeGeometry args={[0.06, 0.5]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {/* Avatar */}
      <mesh position={[-0.36, 0.15, 0.024]}>
        <circleGeometry args={[0.09, 16]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
      {/* Name line */}
      <mesh position={[-0.03, 0.15, 0.024]}>
        <planeGeometry args={[0.5, 0.05]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>
      {/* Source line */}
      <mesh position={[-0.13, 0.03, 0.024]}>
        <planeGeometry args={[0.36, 0.035]} />
        <meshBasicMaterial color="#98cdb8" transparent opacity={0.5} />
      </mesh>
      {/* Red "missed" overlay (grows with scroll) */}
      <mesh ref={glowRef} position={[0, 0, -0.04]}>
        <planeGeometry args={[1.4, 0.9]} />
        <meshBasicMaterial
          color="#da2a46"
          transparent
          opacity={0}
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

function SceneContents({ progressRef }: { progressRef: RefObject<number> }) {
  useEffect(() => {
    attachPointer();
  }, []);
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.85} color="#cce8d8" />
      <ParallaxRig />
      {LEADS.map((lead, i) => (
        <LeadCard key={i} lead={lead} index={i} progressRef={progressRef} />
      ))}
    </>
  );
}

export default function ProblemDriftScene({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0, 6.5] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <SceneContents progressRef={progressRef} />
    </Canvas>
  );
}
