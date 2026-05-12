"use client";

/**
 * HeroRibbonScene — a 3D data ribbon (tube along a parametric curve) drifting
 * in space, with a sparse particle field behind. Subtle cursor parallax.
 *
 * Visually distinct from FloatingCards / FeaturesHeroScene:
 *  - No cards, no satellites
 *  - Pure abstract motion — represents "pipeline flow"
 *  - Glassy green ribbon with vertex-color falloff
 *  - 400 lightweight particle points behind (drei <Points />-style but raw)
 *
 * Perf:
 *  - 1 mesh (tube) + 1 Points = 2 draw calls
 *  - Tube geometry built once via useMemo, reused every frame
 *  - All motion via useFrame mutating refs
 *  - DPR cap 1.5, no antialias, no env, no post
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Parametric curve — a wide, gentle 3D Lissajous-like path
function makeRibbonCurve() {
  const points: THREE.Vector3[] = [];
  const segments = 200;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = t * Math.PI * 2;
    points.push(
      new THREE.Vector3(
        Math.sin(a * 1.5) * 3.6,
        Math.sin(a * 2) * 1.4,
        Math.cos(a * 1.0) * 2.0 - 1.0
      )
    );
  }
  return new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.5);
}

function Ribbon() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const curve = makeRibbonCurve();
    // tubularSegments, radius, radialSegments, closed
    const geo = new THREE.TubeGeometry(curve, 220, 0.06, 16, true);

    // Color falloff along the tube length via vertex colors
    const positions = geo.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const c1 = new THREE.Color("#319b72");
    const c2 = new THREE.Color("#98cdb8");
    const c3 = new THREE.Color("#ffffff");
    const tmp = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const t = (i / positions.count) % 1;
      // Triangular wave gradient: green -> light -> green
      const w = Math.sin(t * Math.PI * 4) * 0.5 + 0.5;
      if (w < 0.5) {
        tmp.copy(c1).lerp(c2, w * 2);
      } else {
        tmp.copy(c2).lerp(c3, (w - 0.5) * 2);
      }
      colors[i * 3 + 0] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.y = t * 0.08;
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.12;
    meshRef.current.rotation.z = Math.cos(t * 0.12) * 0.06;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        metalness={0.4}
        roughness={0.25}
        emissive="#0e3225"
        emissiveIntensity={0.65}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a spherical shell of radius 4-9
      const r = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#98cdb8"),
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.08) * 0.05;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

// Module-level pointer (shared across mounted scenes; single window listener)
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
      <directionalLight position={[4, 6, 5]} intensity={1.0} color="#cce8d8" />
      <directionalLight position={[-4, -3, 2]} intensity={0.5} color="#319b72" />

      <ParallaxRig />
      <ParticleField />
      <Ribbon />
    </>
  );
}

export default function HeroRibbonScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 42, position: [0, 0.2, 6.5] }}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <SceneContents />
    </Canvas>
  );
}
