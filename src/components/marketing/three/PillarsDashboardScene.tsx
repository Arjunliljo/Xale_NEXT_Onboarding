"use client";

/**
 * PillarsDashboardScene — 6 mini 3D dashboard widgets representing the
 * 6 pillars. Each is a distinct mini UI (kanban / chat / form / org / nodes
 * / chart). On scroll, the row translates horizontally — different widgets
 * come into view as the user scrolls past the section.
 *
 * Perf:
 *  - 6 widget groups (~6 meshes each ≈ 36 meshes)
 *  - All animation via useFrame mutating refs
 *  - DPR cap 1.5, antialias false
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

type Pillar = "kanban" | "chat" | "form" | "org" | "nodes" | "chart";

const PILLARS: { kind: Pillar; accent: string }[] = [
  { kind: "kanban", accent: "#319b72" },
  { kind: "chat", accent: "#25D366" },
  { kind: "form", accent: "#98cdb8" },
  { kind: "org", accent: "#6fb99c" },
  { kind: "nodes", accent: "#319b72" },
  { kind: "chart", accent: "#156548" },
];

const SPACING = 2.6;
const ROW_TOTAL_WIDTH = SPACING * (PILLARS.length - 1);

function KanbanWidget({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.05, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* 3 stage columns */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, 0, 0.022]}>
          {[0.18, 0, -0.18].map((y, j) => (
            <mesh key={j} position={[0, y, 0]}>
              <planeGeometry args={[0.42, 0.13]} />
              <meshBasicMaterial color={accent} transparent opacity={j === 0 ? 0.85 : 0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function ChatWidget({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.05, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Chat bubbles */}
      <mesh position={[-0.35, 0.28, 0.022]}>
        <planeGeometry args={[0.7, 0.18]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.35, 0.05, 0.022]}>
        <planeGeometry args={[0.6, 0.18]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.35, -0.2, 0.022]}>
        <planeGeometry args={[0.55, 0.16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function FormWidget({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.05, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* 3 form rows */}
      {[0.3, 0.05, -0.2].map((y, i) => (
        <group key={i}>
          <mesh position={[-0.3, y, 0.022]}>
            <planeGeometry args={[0.2, 0.05]} />
            <meshBasicMaterial color="#98cdb8" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.2, y, 0.022]}>
            <planeGeometry args={[0.7, 0.1]} />
            <meshBasicMaterial color={accent} transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
      {/* Submit */}
      <mesh position={[0.45, -0.42, 0.022]}>
        <planeGeometry args={[0.35, 0.12]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </group>
  );
}

function OrgWidget({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.05, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Top node */}
      <mesh position={[0, 0.32, 0.022]}>
        <circleGeometry args={[0.1, 16]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {/* Middle row */}
      {[-0.32, 0, 0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.022]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Bottom row */}
      {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
        <mesh key={i} position={[x, -0.28, 0.022]}>
          <circleGeometry args={[0.07, 16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function NodesWidget({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.05, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* 4 node boxes */}
      {[
        { x: -0.55, y: 0.2 },
        { x: -0.05, y: 0.35 },
        { x: 0.05, y: -0.1 },
        { x: 0.55, y: 0.2 },
      ].map((p, i) => (
        <mesh key={i} position={[p.x, p.y, 0.022]}>
          <planeGeometry args={[0.3, 0.16]} />
          <meshBasicMaterial color={accent} transparent opacity={0.75} />
        </mesh>
      ))}
    </group>
  );
}

function ChartWidget({ accent }: { accent: string }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.6, 1.05, 0.04]} />
        <meshStandardMaterial
          color="#0e2620"
          metalness={0.4}
          roughness={0.3}
          emissive="#04150f"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Bars */}
      {[0.3, 0.5, 0.4, 0.7, 0.6, 0.85].map((h, i) => (
        <mesh
          key={i}
          position={[-0.55 + i * 0.22, -0.3 + h * 0.25, 0.022]}
        >
          <planeGeometry args={[0.14, h * 0.5]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
    </group>
  );
}

const WIDGETS = {
  kanban: KanbanWidget,
  chat: ChatWidget,
  form: FormWidget,
  org: OrgWidget,
  nodes: NodesWidget,
  chart: ChartWidget,
} as const;

function PillarWidget({
  pillar,
  index,
  progressRef,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
  progressRef: RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const Widget = WIDGETS[pillar.kind];
  const baseX = -ROW_TOTAL_WIDTH / 2 + index * SPACING;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;

    // Horizontal scroll: shift row left as user scrolls down
    const scrollX = -p * ROW_TOTAL_WIDTH * 0.6;
    groupRef.current.position.x = baseX + scrollX;

    // Bob + idle rotation
    groupRef.current.position.y = Math.sin(t * 0.5 + index * 1.1) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 0.3 + index * 0.8) * 0.25;
    groupRef.current.rotation.x = Math.sin(t * 0.4 + index * 0.6) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <Widget accent={pillar.accent} />
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
    camera.position.y = target.current.y * 0.25;
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
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={1.0} color="#cce8d8" />
      <ParallaxRig />
      {PILLARS.map((p, i) => (
        <PillarWidget key={i} pillar={p} index={i} progressRef={progressRef} />
      ))}
    </>
  );
}

export default function PillarsDashboardScene({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 38, position: [0, 0, 6.5] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
    >
      <SceneContents progressRef={progressRef} />
    </Canvas>
  );
}
