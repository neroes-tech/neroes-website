"use client";

import { useEffect, useRef } from "react";

/**
 * ── CAMADA 5 · CINEMA GRADE ──────────────────────────────────────────────
 * Bundles the "film" treatments from the brief into one overlay stack:
 *   1. Grain   — noise tile redrawn at a fixed 12fps (not tied to the main
 *                render loop, so it never competes with the WebGL scene).
 *   2. LUT      — a faint brand-blue screen-blend wash across the whole
 *                section, for a cohesive "graded" color feel.
 *   3. Scanline — a repeating 1px horizontal gradient at 2% opacity.
 * All skipped under prefers-reduced-motion (the caller controls that by not
 * mounting this component).
 *
 * A "halation" radial-gradient layer (soft amber smear at the frame's
 * optical center) used to sit here too — removed because it read as a
 * visible circular halo behind the brain rather than a subtle grade.
 */
export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const SIZE = 128;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const imageData = ctx.createImageData(SIZE, SIZE);

    const draw = () => {
      const buf = imageData.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 13; // ~5% alpha per pixel, within the 3-5% spec range
      }
      ctx.putImageData(imageData, 0, 0);
    };

    draw();
    const interval = setInterval(draw, 1000 / 12); // 12fps, per spec

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 1. Grain */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-40 mix-blend-overlay"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 2. LUT — faint brand-blue grade wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-brand-blue/[0.03] mix-blend-screen"
      />

      {/* 3. Scanline — repeating 1px horizontal gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)",
        }}
      />
    </>
  );
}
