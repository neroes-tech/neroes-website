"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ── MOTION INSTEAD OF CHROME ─────────────────────────────────────────────
 * A 2000-particle Canvas 2D system layered over BrainHero's WebGL scene —
 * purely additive, doesn't touch BrainHero's internals. Each particle has
 * three precomputed 3D "shape targets" (galaxy, brain-hugging, dot-matrix);
 * every frame we blend between them by scroll progress and
 * project the result with hand-rolled perspective math (same technique as
 * the rest of this project's canvas-based visuals — no new dependency).
 *
 * ── ATO I   (0.00–0.22) Camada oculta — só o cérebro WebGL fica visível ──
 * ── ATO II  (0.22–0.55) Surge já em galáxia, rotação acelerada (eixo Y) ──
 * ── ATO III (0.55–0.85) Colapso sobre o córtex — spikes de luz ──
 * ── ATO IV  (0.85–1.00) Dot-matrix minimalista ──
 */

const PARTICLE_COUNT = 2000;
const ELECTRIC_BLUE = "30,91,255";
const TEAL = "34,211,197";
const VIOLET = "139,92,246";

const MAGNET_RADIUS = 150;
const MAGNET_LERP = 0.05;
const MAGNET_STRENGTH = 22;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

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

interface Shapes {
  galaxy: Float32Array;
  brain: Float32Array;
  dotMatrix: Float32Array;
  colorIndex: Uint8Array;
  phase: Float32Array;
}

function buildShapes(count: number): Shapes {
  const rand = mulberry32(20260713);
  const galaxy = new Float32Array(count * 3);
  const brain = new Float32Array(count * 3);
  const dotMatrix = new Float32Array(count * 3);
  const colorIndex = new Uint8Array(count);
  const phase = new Float32Array(count);

  const gridSize = Math.ceil(Math.sqrt(count));

  for (let i = 0; i < count; i++) {
    // ── ATO II: galáxia — braços espirais achatados ──
    const arm = Math.floor(rand() * 3);
    const armAngle = (arm / 3) * Math.PI * 2;
    const galaxyRadius = Math.pow(rand(), 0.6) * 150;
    const spiral = armAngle + galaxyRadius * 0.045 + rand() * 0.4;
    galaxy[i * 3] = Math.cos(spiral) * galaxyRadius;
    galaxy[i * 3 + 1] = (rand() - 0.5) * 10 * (1 - galaxyRadius / 190);
    galaxy[i * 3 + 2] = Math.sin(spiral) * galaxyRadius;

    // ── ATO III: envolve o córtex — elipsoide orgânico ligeiramente enrugado ──
    const theta = Math.acos(1 - 2 * rand());
    const phi = rand() * Math.PI * 2;
    const sx = Math.sin(theta) * Math.cos(phi);
    const sy = Math.cos(theta);
    const sz = Math.sin(theta) * Math.sin(phi);
    const wrinkle = 1 + 0.08 * Math.sin(phi * 7 + theta * 3) + 0.05 * Math.sin(phi * 4 - theta * 9);
    brain[i * 3] = sx * 145 * wrinkle;
    brain[i * 3 + 1] = sy * 108 * wrinkle;
    brain[i * 3 + 2] = sz * 130 * wrinkle;

    // ── ATO IV: dot-matrix — grelha plana e minimalista ──
    const gx = i % gridSize;
    const gy = Math.floor(i / gridSize);
    dotMatrix[i * 3] = (gx - gridSize / 2) * 9;
    dotMatrix[i * 3 + 1] = (gy - gridSize / 2) * 9;
    dotMatrix[i * 3 + 2] = 0;

    const roll = rand();
    colorIndex[i] = roll > 0.62 ? 2 : roll > 0.3 ? 1 : 0;
    phase[i] = rand() * Math.PI * 2;
  }

  return { galaxy, brain, dotMatrix, colorIndex, phase };
}

export function ParticleMorph({ progressRef }: { progressRef: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const shapes = buildShapes(PARTICLE_COUNT);
    const palette = [ELECTRIC_BLUE, TEAL, VIOLET];

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

    // ── Magnetic mouse field: raw screen-space pixel coords, own elastic
    // lerp(0.05) — decoupled from the 3D parallax hook, this is a 2D
    // screen-space effect, not a rotation input.
    let mouseX = -9999;
    let mouseY = -9999;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handlePointerLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    // Preallocated, reused every frame.
    const offsetX = new Float32Array(PARTICLE_COUNT);
    const offsetY = new Float32Array(PARTICLE_COUNT);
    const outX = new Float32Array(PARTICLE_COUNT);
    const outY = new Float32Array(PARTICLE_COUNT);
    const outSize = new Float32Array(PARTICLE_COUNT);
    const outAlpha = new Float32Array(PARTICLE_COUNT);
    const outColorIndex = new Uint8Array(PARTICLE_COUNT);

    const FOCAL = 640;
    const CAM_DIST = 430;

    let raf = 0;
    let running = true;
    const start = performance.now();

    const render = () => {
      const elapsed = (performance.now() - start) / 1000;
      const progress = progressRef.current;

      // ── Blend weights across the 3 remaining Ato shapes — overlapping
      // smoothstep ramps so the morph crossfades instead of popping at
      // boundaries. Galaxy now covers the full Ato I–II span (no toroid).
      const w2 = 1 - smoothstep(0.45, 0.6, progress);
      const w3 = smoothstep(0.45, 0.6, progress) * (1 - smoothstep(0.78, 0.9, progress));
      const w4 = smoothstep(0.78, 0.9, progress);
      const total = w2 + w3 + w4 || 1;

      // The layer itself stays invisible through Ato I (progress 0–0.22) so
      // only BrainHero's WebGL cloud is on screen at rest, then fades in
      // already in galaxy form for Ato II onward.
      const layerFadeIn = smoothstep(0.0, 0.22, progress);

      const rotY = elapsed * (0.15 + w2 * 0.9); // Ato II: rotação acelerada no eixo Y
      const rotX = 0.25;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const scale = Math.min(width, height) / 340;
      const cx = width / 2;
      const cy = height / 2;

      // Boost this layer's visual prominence during Ato II (galaxy is meant
      // to be the star there), easing back toward baseline once the brain's
      // own WebGL light show (synapse spikes, dissolve) takes over in Atos
      // III–IV — keeps both layers from competing for attention.
      const prominence = layerFadeIn * (0.75 + 0.6 * w2);

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const bx =
          (shapes.galaxy[i * 3]! * w2 + shapes.brain[i * 3]! * w3 + shapes.dotMatrix[i * 3]! * w4) / total;
        const by =
          (shapes.galaxy[i * 3 + 1]! * w2 + shapes.brain[i * 3 + 1]! * w3 + shapes.dotMatrix[i * 3 + 1]! * w4) /
          total;
        const bz =
          (shapes.galaxy[i * 3 + 2]! * w2 + shapes.brain[i * 3 + 2]! * w3 + shapes.dotMatrix[i * 3 + 2]! * w4) /
          total;

        // Dot-matrix (w4-dominant) shouldn't spin with the rest — blend the
        // rotation itself out as w4 takes over.
        const spin = 1 - w4;
        const rx = (bx * cosY + bz * sinY) * spin + bx * (1 - spin);
        const rz = (-bx * sinY + bz * cosY) * spin + bz * (1 - spin);
        const ry = (by * cosX - rz * sinX) * spin + by * (1 - spin);
        const rz2 = (by * sinX + rz * cosX) * spin + bz * (1 - spin);

        const perspective = FOCAL / (FOCAL + rz2 + CAM_DIST);
        let sx = cx + rx * perspective * scale;
        let sy = cy + ry * perspective * scale;

        // ── Magnetic field: gently attracts nearby particles toward the
        // cursor within a 150px radius, eased with its own Lerp(0.05).
        const dx = mouseX - sx;
        const dy = mouseY - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let targetOffX = 0;
        let targetOffY = 0;
        if (dist < MAGNET_RADIUS && dist > 0.01) {
          const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;
          targetOffX = (dx / dist) * pull;
          targetOffY = (dy / dist) * pull;
        }
        offsetX[i] = offsetX[i]! + (targetOffX - offsetX[i]!) * MAGNET_LERP;
        offsetY[i] = offsetY[i]! + (targetOffY - offsetY[i]!) * MAGNET_LERP;
        sx += offsetX[i]!;
        sy += offsetY[i]!;

        const twinkle = 0.85 + 0.15 * Math.sin(elapsed * 0.9 + shapes.phase[i]!);
        // Ato III core "spikes": near the brain surface, occasional bright flares.
        const spike = w3 > 0.3 && shapes.phase[i]! % 1.7 < 0.02 * w3 ? 1.8 : 1;

        outX[i] = sx;
        outY[i] = sy;
        outSize[i] = Math.max(0.8, (1.5 + twinkle * 0.7) * perspective * spike * prominence);
        outAlpha[i] = Math.min(1, Math.max(0.22, perspective * 1.3 - 0.1) * twinkle * prominence);
        outColorIndex[i] = shapes.colorIndex[i]!;
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const size = outSize[i]!;
        ctx.fillStyle = `rgba(${palette[outColorIndex[i]!]},${outAlpha[i]!.toFixed(3)})`;
        ctx.fillRect(outX[i]! - size / 2, outY[i]! - size / 2, size, size);
      }

      ctx.restore();
      if (running) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = !!entry?.isIntersecting;
        if (running) raf = requestAnimationFrame(render);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    observer.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reduced, progressRef]);

  if (reduced) return null;

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
  );
}
