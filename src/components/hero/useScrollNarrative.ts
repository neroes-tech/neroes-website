"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type NarrativeAct = 1 | 2 | 3 | 4;

export interface ScrollNarrative {
  /**
   * Smoothed scroll progress (0..1), updated every animation frame.
   * Read via `.current` — this does NOT trigger re-renders, so imperative
   * consumers (WebGL render loops, canvas overlays) can sample it at 60fps
   * without paying for React's reconciliation on every tick.
   */
  progressRef: RefObject<number>;
  /** Current narrative act (1–4). Reactive: changes trigger a re-render. */
  act: NarrativeAct;
  /**
   * Progress (0..1) local to the current act. Reactive, but throttled to
   * ~10 updates/sec — enough to drive a CSS transition smoothly without
   * re-rendering on every one of the 60fps lerp ticks.
   */
  actProgress: number;
}

// ── Ato boundaries, in scroll progress (0..1) ──────────────────────────
const ACT_BOUNDARIES: readonly [number, number, number, number, number] = [0, 0.22, 0.55, 0.85, 1];
const LERP_FACTOR = 0.04;
const REACT_STATE_THROTTLE_MS = 100;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function resolveAct(p: number): { act: NarrativeAct; actProgress: number } {
  for (let i = 0; i < 4; i++) {
    const start = ACT_BOUNDARIES[i]!;
    const end = ACT_BOUNDARIES[i + 1]!;
    if (p < end || i === 3) {
      const span = end - start;
      const local = span > 0 ? (p - start) / span : 0;
      return { act: (i + 1) as NarrativeAct, actProgress: Math.min(1, Math.max(0, local)) };
    }
  }
  // Unreachable — i === 3 above always resolves before the loop ends.
  return { act: 4, actProgress: 1 };
}

/**
 * Tracks scroll progress through the page (or, if `sectionRef` is given,
 * through that specific section only — 0 at its top, 1 once it has fully
 * scrolled past the viewport) via a native scroll listener, damps it with
 * Lerp(0.04) each animation frame for a smooth 60fps feel, and maps the
 * result onto the Hero's 4 narrative acts:
 *
 *   ATO I   Revelação        0.00–0.22
 *   ATO II  Dissecação       0.22–0.55
 *   ATO III Fly-Through      0.55–0.85
 *   ATO IV  Emergência de Dados 0.85–1.00
 */
export function useScrollNarrative(sectionRef?: RefObject<HTMLElement | null>): ScrollNarrative {
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const [act, setAct] = useState<NarrativeAct>(1);
  const [actProgress, setActProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let lastStateFlush = 0;

    const computeTarget = () => {
      const section = sectionRef?.current;
      let next: number;
      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        next = total > 0 ? -rect.top / total : 0;
      } else {
        const doc = document.documentElement;
        const total = doc.scrollHeight - window.innerHeight;
        next = total > 0 ? doc.scrollTop / total : 0;
      }
      targetRef.current = Math.min(1, Math.max(0, next));
    };

    const onScrollOrResize = () => computeTarget();
    computeTarget();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    const tick = (now: number) => {
      progressRef.current = lerp(progressRef.current, targetRef.current, LERP_FACTOR);

      if (now - lastStateFlush >= REACT_STATE_THROTTLE_MS) {
        lastStateFlush = now;
        const resolved = resolveAct(progressRef.current);
        setAct((prev) => (prev !== resolved.act ? resolved.act : prev));
        setActProgress(resolved.actProgress);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sectionRef]);

  return { progressRef, act, actProgress };
}
