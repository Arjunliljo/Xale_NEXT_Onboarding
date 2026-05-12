"use client";

/**
 * HeroGlobeScene — earth globe with FILLED continent meshes and
 * orbital-ring satellites.
 *
 * Continent rendering:
 *   Natural Earth 1:110m land polygons (public domain) are loaded from
 *   `/public/assets/world-land-110m.json`, decoded via topojson-client,
 *   triangulated with earcut, and each triangle's vertices projected onto
 *   the sphere surface. The result is a real filled mesh of continents.
 *
 * Orbital rings:
 *   3 inclined orbital rings circle the globe. Each carries a small
 *   satellite that travels along its path. The orbits-group tilts with
 *   cursor x/y for parallax depth. Satellites brighten + scale up when
 *   the cursor is near (computed in screen space).
 *
 * Globe interactivity:
 *   - Pointer-move velocity injects rotational impulse with momentum decay
 *   - Scroll progress boosts rotation speed + dollies camera slightly
 *
 * Perf:
 *   - Single merged BufferGeometry for ALL continents = 1 draw call for land
 *   - 3 thin torus meshes + 3 satellites = 6 extra meshes for orbits
 *   - All animation via useFrame mutating refs — no React state per frame
 *   - DPR cap 1.5, antialias false, no env/HDRI/post
 *
 * Attribution:
 *   Land geometry: Natural Earth (public domain) via world-atlas (MIT).
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import earcut from "earcut";
import type {
  Topology,
  GeometryCollection as TopoGeometryCollection,
  GeometryObject,
} from "topojson-specification";
import type {
  FeatureCollection,
  Feature,
  Geometry,
  Polygon,
  MultiPolygon,
} from "geojson";

const RADIUS = 1.7;

// =========================================================================
// TopoJSON loader — fetch + decode + flatten into ring lists
// =========================================================================

type Ring = number[][]; // [[lon, lat], ...]
type LandPolygon = { outer: Ring; holes: Ring[] };

function flattenLand(
  fc: FeatureCollection | Feature | Geometry,
): LandPolygon[] {
  const result: LandPolygon[] = [];
  const collectGeom = (g: Geometry | null | undefined) => {
    if (!g) return;
    if (g.type === "Polygon") {
      const poly = g as Polygon;
      result.push({
        outer: poly.coordinates[0] as Ring,
        holes: poly.coordinates.slice(1) as unknown as Ring[],
      });
    } else if (g.type === "MultiPolygon") {
      const mp = g as MultiPolygon;
      for (const polygon of mp.coordinates) {
        result.push({
          outer: polygon[0] as Ring,
          holes: polygon.slice(1) as unknown as Ring[],
        });
      }
    }
  };

  if ("type" in fc && fc.type === "FeatureCollection") {
    for (const f of fc.features) collectGeom(f.geometry);
  } else if ("type" in fc && fc.type === "Feature") {
    collectGeom((fc as Feature).geometry);
  } else {
    collectGeom(fc as Geometry);
  }
  return result;
}

function useLandPolygons(): LandPolygon[] | null {
  const [polys, setPolys] = useState<LandPolygon[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/assets/world-land-110m.json")
      .then((r) => r.json() as Promise<Topology>)
      .then((topo) => {
        if (cancelled) return;
        const landObj = topo.objects.land as
          | TopoGeometryCollection
          | GeometryObject;
        const fc = feature(topo, landObj) as
          | FeatureCollection
          | Feature
          | Geometry;
        setPolys(flattenLand(fc));
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.warn("Failed to load land mask", err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return polys;
}

// =========================================================================
// Project (lon, lat) → 3D point on sphere
// =========================================================================

function latLonToVec3(
  lat: number,
  lon: number,
  r: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  out.set(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
  return out;
}

// =========================================================================
// Subdivide a ring so triangle edges curve along the sphere
// =========================================================================

function subdivideRing(ring: Ring, maxDegStep: number): Ring {
  const out: Ring = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    out.push([a[0], a[1]]);
    const dLon = b[0] - a[0];
    const dLat = b[1] - a[1];
    const dist = Math.sqrt(dLon * dLon + dLat * dLat);
    if (dist > maxDegStep) {
      const steps = Math.ceil(dist / maxDegStep);
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        out.push([a[0] + dLon * t, a[1] + dLat * t]);
      }
    }
  }
  return out;
}

// =========================================================================
// Build a merged BufferGeometry of triangulated continent surfaces
// =========================================================================

function buildContinentGeometry(
  polys: LandPolygon[],
  radius: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const tmpVec = new THREE.Vector3();

  for (const poly of polys) {
    // Subdivide rings so long edges curve along the sphere instead of
    // cutting straight through it. Step = 4° gives smooth Africa / Asia.
    const outer = subdivideRing(poly.outer, 4);
    const holes = poly.holes.map((h) => subdivideRing(h, 4));

    // Flatten to [lon, lat, lon, lat, ...] for earcut
    const flat: number[] = [];
    const holeStarts: number[] = [];
    for (const [lon, lat] of outer) flat.push(lon, lat);
    let cursor = outer.length;
    for (const hole of holes) {
      holeStarts.push(cursor);
      for (const [lon, lat] of hole) flat.push(lon, lat);
      cursor += hole.length;
    }

    const tris = earcut(flat, holeStarts);
    if (tris.length === 0) continue;

    const baseIndex = positions.length / 3;
    // Push vertices (projected to sphere)
    for (let i = 0; i < flat.length; i += 2) {
      const lon = flat[i];
      const lat = flat[i + 1];
      latLonToVec3(lat, lon, radius, tmpVec);
      positions.push(tmpVec.x, tmpVec.y, tmpVec.z);
    }
    // Push indices (offset by baseIndex)
    for (let i = 0; i < tris.length; i++) {
      indices.push(baseIndex + tris[i]);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

// =========================================================================
// ContinentSurface — single merged mesh of all continents
// =========================================================================

function ContinentSurface({ polys }: { polys: LandPolygon[] }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const fadeT = useRef(0);

  const geometry = useMemo(
    () => buildContinentGeometry(polys, RADIUS * 1.003),
    [polys],
  );

  useFrame((_, dt) => {
    if (!matRef.current) return;
    if (fadeT.current < 1) {
      fadeT.current = Math.min(1, fadeT.current + dt * 2.5);
      matRef.current.opacity = fadeT.current;
    }
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        ref={matRef}
        color="#98cdb8"
        metalness={0.2}
        roughness={0.65}
        emissive="#1e6149"
        emissiveIntensity={0.45}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// =========================================================================
// CoastlineOutlines — thin glowing strokes along every land polygon edge
// =========================================================================

function CoastlineOutlines({ polys }: { polys: LandPolygon[] }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const tmp = new THREE.Vector3();
    for (const poly of polys) {
      const subOuter = subdivideRing(poly.outer, 4);
      for (let i = 0; i < subOuter.length; i++) {
        const [lonA, latA] = subOuter[i];
        const [lonB, latB] = subOuter[(i + 1) % subOuter.length];
        latLonToVec3(latA, lonA, RADIUS * 1.006, tmp);
        positions.push(tmp.x, tmp.y, tmp.z);
        latLonToVec3(latB, lonB, RADIUS * 1.006, tmp);
        positions.push(tmp.x, tmp.y, tmp.z);
      }
      for (const hole of poly.holes) {
        const subHole = subdivideRing(hole, 4);
        for (let i = 0; i < subHole.length; i++) {
          const [lonA, latA] = subHole[i];
          const [lonB, latB] = subHole[(i + 1) % subHole.length];
          latLonToVec3(latA, lonA, RADIUS * 1.006, tmp);
          positions.push(tmp.x, tmp.y, tmp.z);
          latLonToVec3(latB, lonB, RADIUS * 1.006, tmp);
          positions.push(tmp.x, tmp.y, tmp.z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [polys]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#cce8d8" transparent opacity={0.55} />
    </lineSegments>
  );
}

// =========================================================================
// GlobeShell — dark ocean + faint wireframe + outer atmosphere
// =========================================================================

function GlobeShell() {
  return (
    <group>
      {/* Ocean: green-tinted, no longer near-black */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.995, 48, 32]} />
        <meshStandardMaterial
          color="#13402f"
          metalness={0.15}
          roughness={0.7}
          emissive="#0e3225"
          emissiveIntensity={0.75}
        />
      </mesh>
      {/* Wireframe lat/lon overlay — slightly more visible for that
          industries-style green grid feel */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.001, 36, 18]} />
        <meshBasicMaterial
          color="#6fb99c"
          wireframe
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
      {/* Outer atmosphere glow — a touch greener and brighter */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.14, 32, 16]} />
        <meshBasicMaterial
          color="#319b72"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// =========================================================================
// Orbital rings + satellites — separate group, cursor parallax
// =========================================================================

type Orbit = {
  radius: number;
  inclination: number; // X-axis tilt in radians
  yaw: number; // initial Y rotation
  satelliteSpeed: number; // satellite orbital angular velocity
  spin: number; // ring's own slow autonomous yaw (rad/s)
  color: string;
  easeCoef: number; // pointer-follow ease (lower = heavier inertia)
  tiltStrength: number; // how strongly this ring tilts to follow cursor
  phase: number;
};

// Three compact rings, layered with distinct inertia → real parallax
// depth. Inner ring follows cursor most eagerly; outer ring lags.
const ORBITS: Orbit[] = [
  {
    radius: RADIUS * 1.05,
    inclination: 0.18,
    yaw: 0,
    satelliteSpeed: 0.55,
    spin: 0.05,
    color: "#98cdb8",
    easeCoef: 0.04,
    tiltStrength: 0.55,
    phase: 0,
  },
  {
    radius: RADIUS * 1.16,
    inclination: -0.42,
    yaw: 1.2,
    satelliteSpeed: 0.42,
    spin: 0.035,
    color: "#6fb99c",
    easeCoef: 0.028,
    tiltStrength: 0.7,
    phase: 1.7,
  },
  {
    radius: RADIUS * 1.28,
    inclination: 0.66,
    yaw: 2.4,
    satelliteSpeed: 0.32,
    spin: 0.025,
    color: "#319b72",
    easeCoef: 0.02,
    tiltStrength: 0.85,
    phase: 3.2,
  },
];

function OrbitRing({ orbit, index }: { orbit: Orbit; index: number }) {
  // Each ring lives in its own group with its own eased cursor follow and
  // its own proximity value. No shared parent, no wobble — pure cursor
  // lean + slow autonomous spin.
  const groupRef = useRef<THREE.Group>(null);
  const strokeMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ease = useRef({ x: 0, y: 0 });
  const proximity = useRef(0);
  // Delta-accumulated clock wrapped at 2π / spin so that orbit.yaw + t * spin
  // stays bounded for arbitrarily long sessions. Using raw elapsedTime here
  // accumulates float precision loss over time and visually accelerates rotation.
  const tRef = useRef(0);

  useFrame((_, dt) => {
    if (!groupRef.current) return;

    // Per-ring inertia: each ring eases at its own rate, so the three
    // rings glide toward the cursor at different speeds — natural parallax.
    ease.current.x += (pointer.x - ease.current.x) * orbit.easeCoef;
    ease.current.y += (pointer.y - ease.current.y) * orbit.easeCoef;

    const safeDt = dt > 0.1 ? 0.1 : dt;
    tRef.current = (tRef.current + safeDt) % (Math.PI * 2);
    const t = tRef.current;

    // Tilt toward cursor + slow autonomous spin. No sine wobble — that
    // was the "bobble" that fought the cursor response.
    groupRef.current.rotation.x =
      orbit.inclination - ease.current.y * orbit.tiltStrength;
    groupRef.current.rotation.y =
      orbit.yaw + t * orbit.spin + ease.current.x * orbit.tiltStrength * 1.1;
    groupRef.current.rotation.z = ease.current.x * orbit.tiltStrength * 0.18;

    // Each ring has a distinct "sweet zone" along the cursor's radius
    // from screen-center: inner ring lights up when cursor is near the
    // globe; outer ring lights up when cursor is at the edges.
    const cursorR = Math.hypot(pointer.x, pointer.y);
    const ringSweetR = 0.15 + index * 0.32;
    const targetProx = Math.max(0, 1 - Math.abs(cursorR - ringSweetR) * 1.6);
    proximity.current += (targetProx - proximity.current) * 0.05;

    if (strokeMatRef.current) {
      strokeMatRef.current.opacity = 0.4 + proximity.current * 0.5;
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = 0.06 + proximity.current * 0.28;
    }
    groupRef.current.scale.setScalar(1 + proximity.current * 0.04);
  });

  return (
    <group ref={groupRef}>
      {/* Hairline stroke — crisp ring outline */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbit.radius, 0.004, 8, 160]} />
        <meshBasicMaterial
          ref={strokeMatRef}
          color={orbit.color}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Soft glow halo — additive, pulses with cursor proximity */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbit.radius, 0.022, 8, 128]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color={orbit.color}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <Satellite orbit={orbit} proximityRef={proximity} />
    </group>
  );
}

function Satellite({
  orbit,
  proximityRef,
}: {
  orbit: Orbit;
  proximityRef: RefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);

  useFrame((_, dt) => {
    if (!ref.current || !glowRef.current) return;
    const safeDt = dt > 0.1 ? 0.1 : dt;
    tRef.current = (tRef.current + safeDt) % (Math.PI * 2);
    const t = tRef.current;
    const angle = t * orbit.satelliteSpeed + orbit.phase;
    const x = Math.cos(angle) * orbit.radius;
    const z = Math.sin(angle) * orbit.radius;
    ref.current.position.set(x, 0, z);
    glowRef.current.position.set(x, 0, z);

    const prox = proximityRef.current ?? 0;
    const baseScale = 1 + prox * 0.7;
    ref.current.scale.setScalar(baseScale);
    glowRef.current.scale.setScalar(baseScale * 2.0);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.2 + prox * 0.4;
  });

  return (
    <>
      <mesh ref={ref}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={orbit.color} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial
          color={orbit.color}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function OrbitsGroup() {
  return (
    <>
      {ORBITS.map((o, i) => (
        <OrbitRing key={i} orbit={o} index={i} />
      ))}
    </>
  );
}

// =========================================================================
// Pointer tracking + drag-momentum rotation
// =========================================================================

const pointer = {
  x: 0,
  y: 0,
  velX: 0,
  velY: 0,
  attached: false,
};
function attachPointer() {
  if (pointer.attached || typeof window === "undefined") return;
  pointer.attached = true;
  // Clamp accumulator so a high-refresh mouse or a paused RAF (tab hidden)
  // can't let velX/velY grow unbounded — otherwise the next animated
  // frame applies a huge impulse and the globe spins violently.
  const MAX_VEL = 0.25;
  const clamp = (v: number) => (v > MAX_VEL ? MAX_VEL : v < -MAX_VEL ? -MAX_VEL : v);
  window.addEventListener(
    "pointermove",
    (e) => {
      const newX = (e.clientX / window.innerWidth) * 2 - 1;
      const newY = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.velX = clamp(pointer.velX + (newX - pointer.x));
      pointer.velY = clamp(pointer.velY + (newY - pointer.y));
      pointer.x = newX;
      pointer.y = newY;
    },
    { passive: true },
  );
  // Reset accumulator when tab regains focus so we don't apply stale
  // velocity that may have built up from queued events.
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      pointer.velX = 0;
      pointer.velY = 0;
    }
  });
}

function GlobeAssembly({
  progressRef,
  polys,
}: {
  progressRef: RefObject<number>;
  polys: LandPolygon[] | null;
}) {
  const globeRef = useRef<THREE.Group>(null);
  const rotVel = useRef({ x: 0, y: 0 });
  const ease = useRef({ x: 0, y: 0 });
  const baseRot = useRef({ y: 0 });

  useFrame((_, dt) => {
    if (!globeRef.current) return;
    const p = progressRef.current ?? 0;

    // Gentle flick momentum — small impulse, slow decay, so quick cursor
    // movements add a whisper of spin instead of yanking the globe.
    rotVel.current.y += pointer.velX * 0.9;
    rotVel.current.x += -pointer.velY * 0.6;
    rotVel.current.y *= 0.94;
    rotVel.current.x *= 0.94;
    pointer.velX *= 0.5;
    pointer.velY *= 0.5;

    // Autonomous slow yaw, untouched by cursor
    const baseRotY = (0.04 + p * 0.08) * dt;
    baseRot.current.y += baseRotY + rotVel.current.y * dt;

    // Slow position-parallax easing — globe drifts toward the cursor with
    // weighty inertia. Smaller coefficient = smoother, less jumpy.
    ease.current.x += (pointer.x - ease.current.x) * 0.02;
    ease.current.y += (pointer.y - ease.current.y) * 0.02;

    globeRef.current.rotation.y = baseRot.current.y + ease.current.x * 0.22;
    globeRef.current.rotation.x = THREE.MathUtils.clamp(
      -ease.current.y * 0.18 + rotVel.current.x * 0.15,
      -0.4,
      0.4,
    );
  });

  return (
    <group ref={globeRef}>
      <GlobeShell />
      {polys && (
        <>
          <ContinentSurface polys={polys} />
          <CoastlineOutlines polys={polys} />
        </>
      )}
    </group>
  );
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Slow camera parallax — drifts toward cursor with weighty inertia
    target.current.x += (pointer.x - target.current.x) * 0.02;
    target.current.y += (pointer.y - target.current.y) * 0.02;
    const p = progressRef.current ?? 0;
    const targetZ = 6.4 - p * 0.8;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.x = target.current.x * 0.18;
    camera.position.y = 0.1 + target.current.y * 0.12;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function SceneContents({ progressRef }: { progressRef: RefObject<number> }) {
  const polys = useLandPolygons();
  useEffect(() => {
    attachPointer();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 6]} intensity={1.0} color="#cce8d8" />
      <directionalLight
        position={[-3, -2, 3]}
        intensity={0.35}
        color="#319b72"
      />
      <CameraRig progressRef={progressRef} />
      <GlobeAssembly progressRef={progressRef} polys={polys} />
      <OrbitsGroup />
    </>
  );
}

export default function HeroGlobeScene({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  return (
    <Canvas
      dpr={typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches ? [1, 1.25] : [1, 1.5]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
      }}
      camera={{ fov: 38, position: [0, 0.1, 6.4] }}
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
