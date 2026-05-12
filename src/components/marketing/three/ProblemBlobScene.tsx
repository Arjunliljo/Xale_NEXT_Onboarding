"use client";

/**
 * ProblemBlobScene — distinct from chain/cards.
 * A low-poly icosahedron that pulses + breathes via vertex displacement on
 * the GPU (custom vertex shader noise), with 80 small "leaking" particles
 * drifting outward — visualizing leads slipping away from a chaotic core.
 *
 * Perf:
 *  - 1 icosahedron (subdivisions=3 ≈ 642 tris) + 1 Points (80 particles)
 *  - Vertex displacement done in shader, NOT JS — zero per-frame CPU geometry work
 *  - All animation in useFrame mutating uniforms/positions, no React state
 *  - DPR cap 1.5, antialias false, additive blending for particles
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// GLSL noise — classic 3D simplex by Ashima Arts (MIT). Compact, fast.
const NOISE_GLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.28 },
        uColorA: { value: new THREE.Color("#0e3225") },
        uColorB: { value: new THREE.Color("#319b72") },
      },
      vertexShader: `
        ${NOISE_GLSL}
        uniform float uTime;
        uniform float uAmp;
        varying float vDisp;
        varying vec3 vNormal;
        void main() {
          vec3 pos = position;
          float n = snoise(pos * 1.2 + uTime * 0.35);
          float disp = n * uAmp;
          pos += normal * disp;
          vDisp = disp;
          vNormal = normalMatrix * normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vDisp;
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - max(0.0, dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
          vec3 col = mix(uColorA, uColorB, smoothstep(-0.2, 0.3, vDisp));
          col += pow(rim, 2.2) * vec3(0.6, 1.0, 0.85) * 0.6;
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1.5, 16]} />
    </mesh>
  );
}

function LeakingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 80;

  const { geometry, material, velocities, lifetimes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const lifetimes = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Start near the blob surface
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.6;
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      // Velocity outward + small random
      const vMag = 0.4 + Math.random() * 0.5;
      const norm = Math.sqrt(
        positions[i * 3] ** 2 +
          positions[i * 3 + 1] ** 2 +
          positions[i * 3 + 2] ** 2
      );
      velocities[i * 3 + 0] = (positions[i * 3] / norm) * vMag;
      velocities[i * 3 + 1] = (positions[i * 3 + 1] / norm) * vMag;
      velocities[i * 3 + 2] = (positions[i * 3 + 2] / norm) * vMag;
      lifetimes[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color("#da2a46"),
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat, velocities, lifetimes };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const positions = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] += velocities[i * 3 + 0] * dt;
      positions[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      positions[i * 3 + 2] += velocities[i * 3 + 2] * dt;
      lifetimes[i] += dt * 0.4;
      // Respawn when out of range
      if (lifetimes[i] > 1.0) {
        lifetimes[i] = 0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 1.6;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        positions[i * 3 + 0] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        const norm = Math.sqrt(x * x + y * y + z * z);
        const vMag = 0.4 + Math.random() * 0.5;
        velocities[i * 3 + 0] = (x / norm) * vMag;
        velocities[i * 3 + 1] = (y / norm) * vMag;
        velocities[i * 3 + 2] = (z / norm) * vMag;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    // Fade material based on time
    (material as THREE.PointsMaterial).opacity =
      0.5 + Math.sin(performance.now() / 800) * 0.2;
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
    camera.position.x = target.current.x * 0.4;
    camera.position.y = 0.0 + target.current.y * 0.3;
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
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={0.9} color="#cce8d8" />
      <ParallaxRig />
      <Blob />
      <LeakingParticles />
    </>
  );
}

export default function ProblemBlobScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: 38, position: [0, 0, 6] }}
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
