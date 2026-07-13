"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface MouseParallax {
  /** Smoothed horizontal pointer position, -1 (left edge) to 1 (right edge). */
  xRef: RefObject<number>;
  /** Smoothed vertical pointer position, -1 (top edge) to 1 (bottom edge). */
  yRef: RefObject<number>;
}

const LERP_FACTOR = 0.08;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Tracks the pointer's normalized position (-1..1 on each axis, centered at
 * the middle of `containerRef` — or the viewport, if omitted) and damps it
 * with an independent Lerp(0.08) each animation frame, for a subtle "alive"
 * micro-parallax that trails the cursor rather than snapping to it. Fully
 * decoupled from scroll — pair with `useScrollNarrative` for the macro
 * narrative progress and this hook for the micro pointer jitter.
 *
 * Position is exposed via refs (`.current`), not React state: this is meant
 * to be sampled every animation frame by an imperative consumer (a WebGL
 * render loop, a canvas layer, or a direct `style.transform` write), not to
 * drive JSX re-renders.
 */
export function useMouseParallax(containerRef?: RefObject<HTMLElement | null>): MouseParallax {
  const targetX = useRef(0);
  const targetY = useRef(0);
  const smoothX = useRef(0);
  const smoothY = useRef(0);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const rect = containerRef?.current?.getBoundingClientRect();
      if (rect) {
        targetX.current = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY.current = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      } else {
        targetX.current = (event.clientX / window.innerWidth - 0.5) * 2;
        targetY.current = (event.clientY / window.innerHeight - 0.5) * 2;
      }
    };
    const handlePointerLeave = () => {
      targetX.current = 0;
      targetY.current = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    let rafId = 0;
    const tick = () => {
      smoothX.current = lerp(smoothX.current, targetX.current, LERP_FACTOR);
      smoothY.current = lerp(smoothY.current, targetY.current, LERP_FACTOR);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [containerRef]);

  return { xRef: smoothX, yRef: smoothY };
}
