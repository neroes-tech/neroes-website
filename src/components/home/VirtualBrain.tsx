"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* 3D particle brain — plain <canvas>, hand-rolled perspective math.    */
/* No 3D library is in the project's dependencies, so this renders the  */
/* wireframe/constellation look natively instead of pulling in three.js.*/
/* ------------------------------------------------------------------ */

type Point3D = { x: number; y: number; z: number };
type Particle = Point3D & { color: string; isGlow: boolean; glowPhase: number };
type Edge = readonly [number, number];

const PARTICLE_COUNT = 420;
const STEM_COUNT = 34;
const GLOW_COUNT = 12;
const NEIGHBORS_PER_POINT = 3;

// Saturated/darker hues so the mesh reads with strong contrast directly on
// the page's light off-white background — no dark panel needed behind it.
const ELECTRIC_BLUE = "37,99,235"; // blue-600
const TEAL = "13,148,136"; // teal-600
const VIOLET = "124,58,237"; // violet-600 — echoes the site's decorative-violet token

/** Deterministic pseudo-random generator so the point cloud is stable across re-renders. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a brain-shaped particle cloud: a wrinkled ellipsoid (cortex) with a
 * gaussian "crease" pinched along the vertical midline (the longitudinal
 * fissure) plus a small tapered cluster underneath for the brainstem.
 */
function generateBrain(): { particles: Particle[]; edges: Edge[] } {
  const rand = mulberry32(20260708);
  const particles: Particle[] = [];

  const RX = 138;
  const RY = 96;
  const RZ = 118;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.acos(1 - 2 * rand()); // polar angle, uniform on sphere
    const phi = rand() * Math.PI * 2;

    const sx = Math.sin(theta) * Math.cos(phi);
    const sy = Math.cos(theta);
    const sz = Math.sin(theta) * Math.sin(phi);

    const wrinkle =
      1 +
      0.12 * Math.sin(phi * 7 + theta * 3) +
      0.07 * Math.sin(phi * 4 - theta * 9) +
      0.05 * Math.sin(theta * 13 + phi * 2);
    const crease = 1 - 0.24 * Math.exp(-(sx * sx) / 0.05);
    const rFactor = Math.min(1.3, Math.max(0.6, wrinkle * crease));

    const colorRoll = rand();
    particles.push({
      x: sx * RX * rFactor,
      y: sy * RY * rFactor - 6,
      z: sz * RZ * rFactor,
      color: colorRoll > 0.62 ? TEAL : colorRoll > 0.18 ? ELECTRIC_BLUE : VIOLET,
      isGlow: false,
      glowPhase: rand() * Math.PI * 2,
    });
  }

  for (let i = 0; i < STEM_COUNT; i++) {
    const t = i / STEM_COUNT;
    const radius = 16 * (1 - t * 0.7);
    const angle = rand() * Math.PI * 2;
    particles.push({
      x: Math.cos(angle) * radius * 0.6,
      y: RY * 0.78 + t * 46,
      z: Math.sin(angle) * radius * 0.6 - 8,
      color: TEAL,
      isGlow: false,
      glowPhase: rand() * Math.PI * 2,
    });
  }

  for (let g = 0; g < GLOW_COUNT; g++) {
    const idx = Math.floor(rand() * PARTICLE_COUNT);
    const particle = particles[idx];
    if (particle) particle.isGlow = true;
  }

  // k-nearest-neighbour edges, computed once from the resting (unrotated) positions.
  const edgeSet = new Set<string>();
  const edges: Edge[] = [];
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (!p) continue;
    const distances: { j: number; d: number }[] = [];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const q = particles[j];
      if (!q) continue;
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dz = p.z - q.z;
      distances.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    distances.sort((a, b) => a.d - b.d);
    for (const { j, d } of distances.slice(0, NEIGHBORS_PER_POINT)) {
      if (d > 26 * 26) continue; // skip stray long edges between unrelated clusters
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([i, j]);
      }
    }
  }

  return { particles, edges };
}

const AUTO_ROTATE_SPEED = 0.0032; // radians per frame, ~40s per revolution
const MAX_TILT = 0.42; // radians
const TILT_EASING = 0.06;
const FOCAL_LENGTH = 640;
const CAMERA_DISTANCE = 430;

/**
 * 3D particle brain rendered on a plain <canvas> (no 3D library in the
 * project's dependencies). Auto-rotates continuously and slowly on Y; the
 * pointer adds an extra tilt on top for a real-depth parallax feel, via
 * genuine perspective-projected 3D math (not a CSS approximation). Floats
 * directly on the page's light background — no card/panel behind it — using
 * saturated Electric Blue / Teal / Neural Violet so the mesh stays crisp on
 * off-white. Freezes to a single static frame — no rotation, no pointer
 * tracking — under prefers-reduced-motion.
 */
export function VirtualBrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const { particles, edges } = generateBrain();

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      targetTiltY = nx * MAX_TILT;
      targetTiltX = -ny * MAX_TILT;
    };
    const handlePointerLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };
    if (!reduced) {
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);
    }

    let autoRotation = 0.4;
    let rafId = 0;

    const renderFrame = () => {
      const scale = Math.min(width, height) / 340;
      const cosY = Math.cos(autoRotation + tiltY);
      const sinY = Math.sin(autoRotation + tiltY);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      const projected: { x: number; y: number; z: number; radius: number; alpha: number }[] = [];

      for (const p of particles) {
        const rx = p.x * cosY + p.z * sinY;
        const rz = -p.x * sinY + p.z * cosY;
        const ry = p.y * cosX - rz * sinX;
        const rz2 = p.y * sinX + rz * cosX;

        const perspective = FOCAL_LENGTH / (FOCAL_LENGTH + rz2 + CAMERA_DISTANCE);
        projected.push({
          x: rx * perspective * scale,
          y: ry * perspective * scale,
          z: rz2,
          radius: 0,
          alpha: Math.min(1, Math.max(0.4, perspective * 1.15 - 0.15)),
        });
      }

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.globalCompositeOperation = "lighter";

      ctx.lineWidth = 0.6;
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        if (!pa || !pb) continue;
        const alpha = Math.min(pa.alpha, pb.alpha) * 0.55;
        ctx.strokeStyle = `rgba(${ELECTRIC_BLUE},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      const order = projected
        .map((point, index) => ({ index, z: point.z }))
        .sort((a, b) => a.z - b.z);

      const time = reduced ? 0 : performance.now() / 1000;

      for (const { index } of order) {
        const point = projected[index];
        const particle = particles[index];
        if (!point || !particle) continue;

        if (particle.isGlow) {
          const pulse = reduced ? 0.8 : 0.65 + 0.35 * Math.sin(time * 1.6 + particle.glowPhase);
          const radius = (2.8 + pulse * 2.4) * point.alpha;
          ctx.shadowColor = `rgba(${VIOLET},${0.85 * pulse})`;
          ctx.shadowBlur = 16 * pulse;
          ctx.fillStyle = `rgba(${VIOLET},${Math.min(1, point.alpha + 0.3)})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          const radius = 1.6 * point.alpha + 0.5;
          ctx.fillStyle = `rgba(${particle.color},${point.alpha})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    };

    const tick = () => {
      autoRotation += AUTO_ROTATE_SPEED;
      tiltX += (targetTiltX - tiltX) * TILT_EASING;
      tiltY += (targetTiltY - tiltY) * TILT_EASING;
      renderFrame();
      rafId = requestAnimationFrame(tick);
    };

    if (reduced) {
      renderFrame();
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reduced]);

  return (
    <div ref={containerRef} aria-hidden="true" className="relative h-full w-full select-none">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
