"use client";

/**
 * SolutionStackScene — 5 channel dashboard panels that converge into a
 * layered stack as the user scrolls. Tells the "unified platform" story
 * literally: scattered tools → one stack.
 *
 * Panels:
 *  1. Meta Lead Ads (blue)
 *  2. WhatsApp Business (green)
 *  3. Gmail (red)
 *  4. TeleCMI Calls (teal)
 *  5. Xale unified dashboard (front, brand green) — the "destination"
 *
 * Scroll-driven:
 *  - 0.0–0.4: panels scattered (each at unique x/y/z + rotation)
 *  - 0.4–0.85: panels translate + rotate to align facing camera
 *  - 0.85–1.0: panels stacked precisely, slight z-offsets, Xale glows
 *
 * Cursor-driven:
 *  - Whole stack tilts based on cursor x/y (parallax)
 *
 * Perf:
 *  - 5 panel groups (~10 meshes each) ≈ 50 meshes, all flat geometry
 *  - useFrame mutates refs only — no React state changes
 *  - DPR cap 1.5, antialias false, no env / HDRI / post
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type PanelConfig = {
  label: string;
  accent: string;
  /** Stack order: 0 = back, 4 = front (Xale) */
  stackIndex: number;
  /** Initial scattered position (before scroll) */
  scattered: {
    pos: [number, number, number];
    rot: [number, number, number];
  };
};

const PANELS: PanelConfig[] = [
  {
    label: "Meta",
    accent: "#1877F2",
    stackIndex: 0,
    scattered: { pos: [-3.4, 0.9, -1.8], rot: [0.15, 0.6, -0.2] },
  },
  {
    label: "WhatsApp",
    accent: "#25D366",
    stackIndex: 1,
    scattered: { pos: [3.3, 1.0, -1.0], rot: [-0.1, -0.55, 0.18] },
  },
  {
    label: "Gmail",
    accent: "#EA4335",
    stackIndex: 2,
    scattered: { pos: [-3.0, -1.2, -0.4], rot: [-0.2, 0.4, 0.15] },
  },
  {
    label: "Calls",
    accent: "#319b72",
    stackIndex: 3,
    scattered: { pos: [3.1, -1.1, -2.2], rot: [0.2, -0.45, -0.2] },
  },
  {
    label: "Xale",
    accent: "#98cdb8",
    stackIndex: 4,
    scattered: { pos: [0.0, 0.5, -3.5], rot: [-0.3, 0.0, 0.0] },
  },
];

const STACK_Z_OFFSET = 0.18; // gap between stacked layers

// =========================================================================
// Panel UI Renderers — each draws the channel-specific flat UI on a plane
// =========================================================================

function MetaPanelUI({ accent }: { accent: string }) {
  return (
    <>
      {/* Header */}
      <mesh position={[0, 0.66, 0.026]}>
        <planeGeometry args={[2.3, 0.18]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {/* "Get more leads" title bar */}
      <mesh position={[-0.4, 0.66, 0.027]}>
        <planeGeometry args={[1.2, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      {/* 3 form fields */}
      {[0.32, 0.08, -0.16].map((y, i) => (
        <group key={i} position={[0, y, 0.026]}>
          <mesh position={[-0.85, 0, 0]}>
            <planeGeometry args={[0.35, 0.06]} />
            <meshBasicMaterial color="#98cdb8" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0.32, 0, 0]}>
            <planeGeometry args={[1.4, 0.16]} />
            <meshBasicMaterial color="#1a3a2c" transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
      {/* Submit button */}
      <mesh position={[0.5, -0.5, 0.026]}>
        <planeGeometry args={[1.0, 0.18]} />
        <meshBasicMaterial color={accent} />
      </mesh>
    </>
  );
}

function WhatsappPanelUI({ accent }: { accent: string }) {
  return (
    <>
      {/* Header */}
      <mesh position={[0, 0.66, 0.026]}>
        <planeGeometry args={[2.3, 0.18]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      {/* Avatar circle */}
      <mesh position={[-0.95, 0.66, 0.027]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Name strip */}
      <mesh position={[-0.6, 0.66, 0.027]}>
        <planeGeometry args={[0.5, 0.05]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Chat bubbles */}
      <mesh position={[-0.4, 0.35, 0.026]}>
        <planeGeometry args={[0.95, 0.15]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0.45, 0.12, 0.026]}>
        <planeGeometry args={[0.85, 0.14]} />
        <meshBasicMaterial color={accent} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.5, -0.12, 0.026]}>
        <planeGeometry args={[0.75, 0.13]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
      {/* Input bar at bottom */}
      <mesh position={[0, -0.55, 0.026]}>
        <planeGeometry args={[2.1, 0.14]} />
        <meshBasicMaterial color="#1a3a2c" transparent opacity={0.8} />
      </mesh>
    </>
  );
}

function GmailPanelUI({ accent }: { accent: string }) {
  return (
    <>
      {/* Header */}
      <mesh position={[0, 0.66, 0.026]}>
        <planeGeometry args={[2.3, 0.18]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[-0.5, 0.66, 0.027]}>
        <planeGeometry args={[1.0, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
      {/* Email rows */}
      {[0.35, 0.18, 0.01, -0.16, -0.33].map((y, i) => (
        <group key={i} position={[0, y, 0.026]}>
          <mesh position={[-0.95, 0, 0]}>
            <circleGeometry args={[0.04, 12]} />
            <meshBasicMaterial color={accent} transparent opacity={0.7} />
          </mesh>
          <mesh position={[-0.4, 0, 0]}>
            <planeGeometry args={[0.7, 0.05]} />
            <meshBasicMaterial
              color={i === 0 ? "#ffffff" : "#98cdb8"}
              transparent
              opacity={i === 0 ? 0.9 : 0.6}
            />
          </mesh>
          <mesh position={[0.6, 0, 0]}>
            <planeGeometry args={[0.9, 0.04]} />
            <meshBasicMaterial color="#6fb99c" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function CallsPanelUI({ accent }: { accent: string }) {
  return (
    <>
      {/* Header */}
      <mesh position={[0, 0.66, 0.026]}>
        <planeGeometry args={[2.3, 0.18]} />
        <meshBasicMaterial color="#1a3a2c" />
      </mesh>
      <mesh position={[-0.6, 0.66, 0.027]}>
        <planeGeometry args={[0.9, 0.06]} />
        <meshBasicMaterial color={accent} transparent opacity={0.95} />
      </mesh>
      {/* Call log rows */}
      {[0.32, 0.08, -0.16, -0.4].map((y, i) => (
        <group key={i} position={[0, y, 0.026]}>
          <mesh position={[-0.95, 0, 0]}>
            <circleGeometry args={[0.05, 12]} />
            <meshBasicMaterial color={accent} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.3, 0.025, 0]}>
            <planeGeometry args={[0.8, 0.04]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          <mesh position={[-0.4, -0.04, 0]}>
            <planeGeometry args={[0.5, 0.03]} />
            <meshBasicMaterial color="#98cdb8" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.85, 0, 0]}>
            <planeGeometry args={[0.35, 0.08]} />
            <meshBasicMaterial color={accent} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function XalePanelUI({ accent }: { accent: string }) {
  return (
    <>
      {/* Header w/ gradient feel (use the accent green) */}
      <mesh position={[0, 0.66, 0.026]}>
        <planeGeometry args={[2.3, 0.18]} />
        <meshBasicMaterial color="#0e3225" />
      </mesh>
      <mesh position={[-0.95, 0.66, 0.027]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <mesh position={[-0.55, 0.66, 0.027]}>
        <planeGeometry args={[0.55, 0.05]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* 3-column kanban */}
      {[-0.7, 0, 0.7].map((x, col) => (
        <group key={col} position={[x, 0.18, 0.026]}>
          {/* Column header */}
          <mesh position={[0, 0.22, 0]}>
            <planeGeometry args={[0.55, 0.04]} />
            <meshBasicMaterial
              color={col === 0 ? "#319b72" : col === 1 ? "#98cdb8" : "#6fb99c"}
              transparent
              opacity={0.85}
            />
          </mesh>
          {/* Cards */}
          {[0.05, -0.1].map((cardY, c) => (
            <mesh key={c} position={[0, cardY, 0]}>
              <planeGeometry args={[0.62, 0.14]} />
              <meshBasicMaterial
                color="#1a3a2c"
                transparent
                opacity={0.85}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Footer chart bars */}
      <group position={[0, -0.42, 0.026]}>
        {[0.35, 0.55, 0.4, 0.7, 0.55, 0.85, 0.65].map((h, i) => (
          <mesh
            key={i}
            position={[-0.7 + i * 0.23, -0.05 + h * 0.05, 0]}
          >
            <planeGeometry args={[0.16, h * 0.18]} />
            <meshBasicMaterial color={accent} />
          </mesh>
        ))}
      </group>
    </>
  );
}

const PANEL_UI = {
  Meta: MetaPanelUI,
  WhatsApp: WhatsappPanelUI,
  Gmail: GmailPanelUI,
  Calls: CallsPanelUI,
  Xale: XalePanelUI,
} as const;

// =========================================================================
// Panel — drives positioning/rotation based on scroll progress
// =========================================================================

function Panel({
  config,
  progressRef,
}: {
  config: PanelConfig;
  progressRef: RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const isXale = config.label === "Xale";
  const UIComponent = PANEL_UI[config.label as keyof typeof PANEL_UI];

  const accentColor = useMemo(() => new THREE.Color(config.accent), [config.accent]);

  // Final stacked position: each panel offset on Z by stackIndex
  const stackedPos = useMemo<[number, number, number]>(
    () => [0, 0, -config.stackIndex * STACK_Z_OFFSET + 0.5],
    [config.stackIndex]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;

    // Convergence factor — 0 = scattered, 1 = stacked.
    // Section is 100vh tall now (no sticky), so progress 0→1 spans the
    // section's full transit through viewport. Assembly should peak by
    // the time section is centered (~progress 0.5).
    const align = THREE.MathUtils.smoothstep(p, 0.25, 0.6);

    // Position lerp
    const px = THREE.MathUtils.lerp(config.scattered.pos[0], stackedPos[0], align);
    const py = THREE.MathUtils.lerp(config.scattered.pos[1], stackedPos[1], align);
    const pz = THREE.MathUtils.lerp(config.scattered.pos[2], stackedPos[2], align);
    // Add gentle idle bob (more pronounced when scattered, subtle when stacked)
    const bob = Math.sin(t * 0.5 + config.stackIndex) * 0.06 * (1 - align);
    groupRef.current.position.set(px, py + bob, pz);

    // Rotation lerp (scattered → flat to camera)
    const rx = THREE.MathUtils.lerp(config.scattered.rot[0], 0, align);
    const ry = THREE.MathUtils.lerp(config.scattered.rot[1], 0, align);
    const rz = THREE.MathUtils.lerp(config.scattered.rot[2], 0, align);
    // Idle wiggle while scattered
    const idleRot = (1 - align) * Math.sin(t * 0.35 + config.stackIndex * 0.5) * 0.06;
    groupRef.current.rotation.set(rx, ry + idleRot, rz);

    // Xale glow ramps up as stack assembles + scroll completes
    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const glowT = isXale
        ? THREE.MathUtils.smoothstep(p, 0.5, 0.75)
        : THREE.MathUtils.smoothstep(p, 0.0, 0.3) * (1 - align);
      glowMat.opacity = 0.05 + glowT * (isXale ? 0.4 : 0.18);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Panel body */}
      <mesh>
        <boxGeometry args={[2.4, 1.55, 0.05]} />
        <meshStandardMaterial
          color={isXale ? "#0a1f17" : "#0e2620"}
          metalness={0.35}
          roughness={0.4}
          emissive={isXale ? "#0e3225" : "#04150f"}
          emissiveIntensity={isXale ? 0.7 : 0.35}
        />
      </mesh>

      {/* Panel UI (channel-specific) */}
      <UIComponent accent={config.accent} />

      {/* Outer rim glow */}
      <mesh ref={glowRef} position={[0, 0, -0.04]}>
        <planeGeometry args={[2.8, 1.95]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// =========================================================================
// Cursor parallax — tilt whole stack
// =========================================================================

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

function StackContainer({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    target.current.x += (pointer.x - target.current.x) * 0.04;
    target.current.y += (pointer.y - target.current.y) * 0.04;
    // Tilt the whole stack with cursor
    groupRef.current.rotation.y = target.current.x * 0.25;
    groupRef.current.rotation.x = -target.current.y * 0.18;
  });

  return (
    <group ref={groupRef}>
      {PANELS.map((p, i) => (
        <Panel key={i} config={p} progressRef={progressRef} />
      ))}
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = progressRef.current ?? 0;
    // Subtle dolly in as stack assembles
    const z = THREE.MathUtils.lerp(7.0, 5.8, p);
    camera.position.z += (z - camera.position.z) * 0.07;
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
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 4, 6]} intensity={1.0} color="#cce8d8" />
      <directionalLight position={[-4, -2, 4]} intensity={0.4} color="#319b72" />

      <CameraRig progressRef={progressRef} />
      <StackContainer progressRef={progressRef} />
    </>
  );
}

export default function SolutionStackScene({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 38, position: [0, 0, 7] }}
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
