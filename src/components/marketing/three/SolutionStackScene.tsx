"use client";

/**
 * SolutionStackScene — 5 vertical brand cards that converge into a layered
 * stack as the user scrolls. Tells the "unified platform" story through
 * geometry: increasing-side polygons (triangle → square → pentagon →
 * hexagon → circle) in a unified brand-green palette.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type PanelConfig = {
  label: string;
  /** Polygon side count for the center mark. 32 ≈ smooth circle. */
  sides: number;
  /** Base tint + accent line color. */
  tint: string;
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
    sides: 3,
    tint: "#1f5a44",
    stackIndex: 0,
    scattered: { pos: [-3.3, 1.15, -1.8], rot: [0.2, 0.6, -0.22] },
  },
  {
    label: "WhatsApp",
    sides: 4,
    tint: "#256e52",
    stackIndex: 1,
    scattered: { pos: [3.15, 1.15, -1.0], rot: [-0.14, -0.55, 0.2] },
  },
  {
    label: "Gmail",
    sides: 5,
    tint: "#319b72",
    stackIndex: 2,
    scattered: { pos: [-3.05, -1.2, -0.5], rot: [-0.22, 0.45, 0.18] },
  },
  {
    label: "Calls",
    sides: 6,
    tint: "#6fb99c",
    stackIndex: 3,
    scattered: { pos: [2.95, -1.15, -2.0], rot: [0.22, -0.5, -0.22] },
  },
  {
    label: "Xale",
    sides: 32,
    tint: "#98cdb8",
    stackIndex: 4,
    scattered: { pos: [0.0, 0.4, -3.4], rot: [-0.3, 0.0, 0.0] },
  },
];

const PANEL_W = 0.95;
const PANEL_H = 1.45;
const STACK_Z_OFFSET = 0.14;

// =========================================================================
// Card content — polygon mark + name strip + accent line
// =========================================================================

function CardContent({ tint, sides }: { tint: string; sides: number }) {
  const isCircle = sides >= 16;
  return (
    <>
      {/* Glass surface inset */}
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[PANEL_W - 0.08, PANEL_H - 0.08]} />
        <meshBasicMaterial color="#0a1d15" transparent opacity={0.5} />
      </mesh>

      {/* Top tinted band — color identity at the top of the card */}
      <mesh position={[0, PANEL_H / 2 - 0.07, 0.027]}>
        <planeGeometry args={[PANEL_W - 0.08, 0.05]} />
        <meshBasicMaterial color={tint} transparent opacity={0.85} />
      </mesh>

      {/* Polygon outer ring */}
      <mesh
        position={[0, 0.32, 0.027]}
        rotation={[0, 0, sides === 4 ? Math.PI / 4 : 0]}
      >
        <ringGeometry args={[0.21, 0.245, sides]} />
        <meshBasicMaterial color={tint} transparent opacity={0.55} />
      </mesh>

      {/* Polygon filled inner */}
      <mesh
        position={[0, 0.32, 0.028]}
        rotation={[0, 0, sides === 4 ? Math.PI / 4 : 0]}
      >
        <circleGeometry args={[0.16, sides]} />
        <meshBasicMaterial color={tint} />
      </mesh>

      {/* Inner negative space (small darker polygon for depth) */}
      <mesh
        position={[0, 0.32, 0.029]}
        rotation={[0, 0, sides === 4 ? Math.PI / 4 : 0]}
      >
        <circleGeometry args={[0.075, sides]} />
        <meshBasicMaterial color="#0a1d15" />
      </mesh>

      {/* Center dot */}
      <mesh position={[0, 0.32, 0.03]}>
        <circleGeometry args={[0.025, 18]} />
        <meshBasicMaterial color={tint} />
      </mesh>

      {/* Channel name strip (large) */}
      <mesh position={[0, -0.18, 0.028]}>
        <planeGeometry args={[0.62, 0.06]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.92} />
      </mesh>

      {/* Subtitle strip */}
      <mesh position={[0, -0.28, 0.028]}>
        <planeGeometry args={[0.4, 0.028]} />
        <meshBasicMaterial color={tint} transparent opacity={0.65} />
      </mesh>

      {/* Side count / "shape label" — three tiny dots representing rank */}
      <group position={[0, -0.43, 0.028]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.12 + i * 0.06, 0, 0]}>
            <circleGeometry args={[0.015, 12]} />
            <meshBasicMaterial
              color={tint}
              transparent
              opacity={i < (isCircle ? 5 : Math.min(sides - 2, 4)) ? 0.9 : 0.18}
            />
          </mesh>
        ))}
      </group>

      {/* Bottom accent underline */}
      <mesh position={[0, -PANEL_H / 2 + 0.06, 0.028]}>
        <planeGeometry args={[PANEL_W - 0.18, 0.005]} />
        <meshBasicMaterial color={tint} transparent opacity={0.75} />
      </mesh>
    </>
  );
}

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

  const tintColor = useMemo(
    () => new THREE.Color(config.tint),
    [config.tint]
  );

  const stackedPos = useMemo<[number, number, number]>(
    () => [0, 0, -config.stackIndex * STACK_Z_OFFSET + 0.5],
    [config.stackIndex]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;

    // Wide range = slower, more settled convergence as the user scrolls.
    const align = THREE.MathUtils.smoothstep(p, 0.15, 0.85);

    const px = THREE.MathUtils.lerp(
      config.scattered.pos[0],
      stackedPos[0],
      align
    );
    const py = THREE.MathUtils.lerp(
      config.scattered.pos[1],
      stackedPos[1],
      align
    );
    const pz = THREE.MathUtils.lerp(
      config.scattered.pos[2],
      stackedPos[2],
      align
    );
    const bob =
      Math.sin(t * 0.5 + config.stackIndex) * 0.06 * (1 - align);
    groupRef.current.position.set(px, py + bob, pz);

    const rx = THREE.MathUtils.lerp(config.scattered.rot[0], 0, align);
    const ry = THREE.MathUtils.lerp(config.scattered.rot[1], 0, align);
    const rz = THREE.MathUtils.lerp(config.scattered.rot[2], 0, align);
    const idleRot =
      (1 - align) * Math.sin(t * 0.35 + config.stackIndex * 0.5) * 0.06;
    groupRef.current.rotation.set(rx, ry + idleRot, rz);

    if (glowRef.current) {
      const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
      const glowT = isXale
        ? THREE.MathUtils.smoothstep(p, 0.7, 0.92)
        : THREE.MathUtils.smoothstep(p, 0.0, 0.25) * (1 - align);
      glowMat.opacity = 0.05 + glowT * (isXale ? 0.45 : 0.2);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[PANEL_W, PANEL_H, 0.04]} />
        <meshStandardMaterial
          color={isXale ? "#0a1f17" : "#0c211c"}
          metalness={0.42}
          roughness={0.36}
          emissive={isXale ? "#0e3225" : "#04150f"}
          emissiveIntensity={isXale ? 0.8 : 0.35}
        />
      </mesh>

      {/* Card content */}
      <CardContent tint={config.tint} sides={config.sides} />

      {/* Outer rim glow */}
      <mesh ref={glowRef} position={[0, 0, -0.04]}>
        <planeGeometry args={[PANEL_W + 0.28, PANEL_H + 0.28]} />
        <meshBasicMaterial
          color={tintColor}
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
