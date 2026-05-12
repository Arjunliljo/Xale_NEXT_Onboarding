"use client";

/**
 * IndustriesGlobeScene — wireframe globe with industry "markers" radiating
 * outward. Distinct from card-based scenes.
 *
 * Perf:
 *  - 1 wireframe sphere + 6 small cone meshes + 1 inner glow sphere
 *  - All animation in useFrame mutating refs
 *  - dpr cap 1.5, no antialias, no env, no post
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const MARKERS = [
  { lat: 25, lon: 78, color: "#319b72" }, // India
  { lat: 51, lon: -0.1, color: "#98cdb8" }, // UK
  { lat: 40, lon: -74, color: "#6fb99c" }, // US East
  { lat: -33, lon: 151, color: "#319b72" }, // Sydney
  { lat: 1.3, lon: 103, color: "#98cdb8" }, // Singapore
  { lat: 19, lon: -99, color: "#6fb99c" }, // Mexico City
];

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.08;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.05;
  });

  const markerData = useMemo(
    () =>
      MARKERS.map((m) => ({
        position: latLonToVec3(m.lat, m.lon, 1.9),
        outerPos: latLonToVec3(m.lat, m.lon, 2.25),
        color: m.color,
      })),
    []
  );

  return (
    <group ref={groupRef}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[1.85, 32, 16]} />
        <meshBasicMaterial
          color="#319b72"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.78, 32, 16]} />
        <meshBasicMaterial
          color="#0e3225"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* Outer atmosphere additive */}
      <mesh>
        <sphereGeometry args={[2.05, 32, 16]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Markers — small cone + connecting line + glow dot */}
      {markerData.map((m, i) => {
        const dir = m.position.clone().normalize();
        const coneQuat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir
        );
        return (
          <group key={i}>
            {/* Connecting line from globe surface to outer position */}
            <Line a={m.position} b={m.outerPos} color={m.color} />
            {/* Marker dot at outer position */}
            <mesh position={m.outerPos}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial color={m.color} />
            </mesh>
            {/* Cone marker pointing outward */}
            <mesh position={m.position} quaternion={coneQuat}>
              <coneGeometry args={[0.04, 0.18, 8]} />
              <meshBasicMaterial color={m.color} transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Line({
  a,
  b,
  color,
}: {
  a: THREE.Vector3;
  b: THREE.Vector3;
  color: string;
}) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([a.x, a.y, a.z, b.x, b.y, b.z], 3)
    );
    return g;
  }, [a, b]);

  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.7} />
    </lineSegments>
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
    camera.position.y = 0.1 + target.current.y * 0.3;
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
      <directionalLight position={[4, 5, 5]} intensity={0.8} color="#cce8d8" />
      <ParallaxRig />
      <Globe />
    </>
  );
}

export default function IndustriesGlobeScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 38, position: [0, 0.1, 6.5] }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <SceneContents />
    </Canvas>
  );
}
