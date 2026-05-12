"use client";

/**
 * SolutionChannelsScene — lead-themed solution section.
 * 4 colored channel "streams" (Meta, WhatsApp, Gmail, Calls) shoot lead
 * particles toward a central Xale core. As scroll progresses, the streams
 * intensify, particles fly faster, the core grows brighter.
 *
 * Visually distinct from drift scene: convergence, not divergence.
 *
 * Perf:
 *  - 4 Points clouds (one per channel, 100 particles each = 400 total)
 *  - 1 core sphere + 2 halo planes
 *  - All particle motion via direct buffer attribute mutation in useFrame
 *  - DPR cap 1.5, antialias false
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type Channel = {
  name: "Meta" | "WhatsApp" | "Gmail" | "Calls";
  color: string;
  origin: [number, number, number];
};

const CHANNELS: Channel[] = [
  { name: "Meta", color: "#1877F2", origin: [-4.2, 1.6, 0.5] },
  { name: "WhatsApp", color: "#25D366", origin: [4.2, 1.6, 0.5] },
  { name: "Gmail", color: "#EA4335", origin: [-4.2, -1.6, 0.5] },
  { name: "Calls", color: "#319b72", origin: [4.2, -1.6, 0.5] },
];

const PARTICLES_PER_CHANNEL = 80;

function ChannelStream({
  channel,
  progressRef,
}: {
  channel: Channel;
  progressRef: RefObject<number>;
}) {
  const ref = useRef<THREE.Points>(null);
  const lifetimesRef = useRef<Float32Array>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLES_PER_CHANNEL * 3);
    const lifetimes = new Float32Array(PARTICLES_PER_CHANNEL);
    for (let i = 0; i < PARTICLES_PER_CHANNEL; i++) {
      // Spawn near origin with random initial life
      lifetimes[i] = Math.random();
      positions[i * 3 + 0] = channel.origin[0];
      positions[i * 3 + 1] = channel.origin[1];
      positions[i * 3 + 2] = channel.origin[2];
    }
    lifetimesRef.current = lifetimes;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(channel.color),
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [channel.origin, channel.color]);

  useFrame((_, dt) => {
    if (!ref.current || !lifetimesRef.current) return;
    const positions = ref.current.geometry.attributes.position
      .array as Float32Array;
    const lifetimes = lifetimesRef.current;
    const p = progressRef.current ?? 0;
    // Speed scales with scroll progress
    const speed = 0.4 + p * 1.6;

    for (let i = 0; i < PARTICLES_PER_CHANNEL; i++) {
      lifetimes[i] += dt * speed;
      if (lifetimes[i] >= 1) {
        // Respawn at channel origin
        lifetimes[i] = 0;
        positions[i * 3 + 0] = channel.origin[0];
        positions[i * 3 + 1] = channel.origin[1];
        positions[i * 3 + 2] = channel.origin[2];
      } else {
        // Lerp toward core along a curved path (slight overshoot in middle for organic feel)
        const t = lifetimes[i];
        const ease = t * t * (3 - 2 * t); // smoothstep
        positions[i * 3 + 0] = channel.origin[0] * (1 - ease);
        positions[i * 3 + 1] = channel.origin[1] * (1 - ease);
        positions[i * 3 + 2] = channel.origin[2] * (1 - ease);
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

function ChannelLabel({ channel }: { channel: Channel }) {
  // A small glowing "source" marker at the channel origin
  return (
    <mesh position={channel.origin}>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshBasicMaterial
        color={channel.color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * MiniKanbanCore — a 3D mini-kanban panel at the center.
 * Three stage rows with fill bars. Rotates slowly. Channels converge into THIS
 * (a real pipeline, not a random sphere).
 */
function Core({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !glowRef.current) return;
    const t = state.clock.elapsedTime;
    const p = progressRef.current ?? 0;
    groupRef.current.rotation.y = t * 0.25 + p * Math.PI * 0.4;
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.04;
    const pulse = 1 + Math.sin(t * 1.2) * 0.025 + p * 0.18;
    groupRef.current.scale.setScalar(pulse);

    glowRef.current.scale.setScalar(1 + p * 0.6);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.12 + p * 0.2;
  });

  const STAGES = [
    { color: "#319b72", filled: 0.95 },
    { color: "#98cdb8", filled: 0.65 },
    { color: "#6fb99c", filled: 0.4 },
  ];

  return (
    <group>
      <group ref={groupRef}>
        {/* Panel body */}
        <mesh>
          <boxGeometry args={[1.5, 1.05, 0.06]} />
          <meshStandardMaterial
            color="#0a1f17"
            metalness={0.4}
            roughness={0.3}
            emissive="#04150f"
            emissiveIntensity={0.5}
          />
        </mesh>
        {/* Top accent strip */}
        <mesh position={[0, 0.45, 0.032]}>
          <planeGeometry args={[1.3, 0.045]} />
          <meshBasicMaterial color="#98cdb8" />
        </mesh>
        {/* Three stage rows */}
        {STAGES.map((s, i) => {
          const yPos = 0.22 - i * 0.2;
          return (
            <group key={i} position={[0, yPos, 0.032]}>
              {/* Stage dot */}
              <mesh position={[-0.6, 0, 0.001]}>
                <circleGeometry args={[0.038, 12]} />
                <meshBasicMaterial color={s.color} />
              </mesh>
              {/* Track (dim) */}
              <mesh position={[0.05, 0, 0]}>
                <planeGeometry args={[1.05, 0.08]} />
                <meshBasicMaterial color="#1a3a2c" transparent opacity={0.55} />
              </mesh>
              {/* Filled portion */}
              <mesh position={[-0.475 + (s.filled * 1.05) / 2, 0, 0.001]}>
                <planeGeometry args={[s.filled * 1.05, 0.075]} />
                <meshBasicMaterial color={s.color} transparent opacity={0.9} />
              </mesh>
            </group>
          );
        })}
        {/* Footer micro-line */}
        <mesh position={[-0.45, -0.42, 0.032]}>
          <planeGeometry args={[0.45, 0.04]} />
          <meshBasicMaterial color="#6fb99c" transparent opacity={0.4} />
        </mesh>
      </group>
      {/* Outer additive halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.3, 24, 24]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.12}
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
      <ambientLight intensity={0.7} />
      <ParallaxRig />
      <Core progressRef={progressRef} />
      {CHANNELS.map((c) => (
        <ChannelLabel key={c.name} channel={c} />
      ))}
      {CHANNELS.map((c) => (
        <ChannelStream key={`stream-${c.name}`} channel={c} progressRef={progressRef} />
      ))}
    </>
  );
}

export default function SolutionChannelsScene({
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
        gl.toneMappingExposure = 1.15;
      }}
    >
      <SceneContents progressRef={progressRef} />
    </Canvas>
  );
}
