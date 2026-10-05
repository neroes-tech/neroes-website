"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export type NarrativeAct = 1 | 2 | 3 | 4;

export interface ScrollNarrative {
  /**
   * Smoothed scroll progress (0..1), updated every animation frame while it
   * is moving.
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
  /**
   * Raw scroll progress (0..1) across the whole section, throttled the same
   * way as `actProgress`. Use this (not `progressRef`) for JSX-driven reveals
   * that need to react outside a single act's boundaries.
   */
  progress: number;
}

// ── Ato boundaries, in scroll progress (0..1) ──────────────────────────
const ACT_BOUNDARIES: readonly [number, number, number, number, number] = [0, 0.22, 0.55, 0.85, 1];
// Forward smoothing: 0.04 trailed a quick scroll by about a second, so the
// brain could already be breaking apart while the headline was still coming
// in. 0.08 keeps the motion soft but in step with the wheel.
const LERP_FACTOR = 0.08;
// Scrolling back up settles faster: at 0.04 a quick return to the top left
// the Hero black (brain still mid-dissolve) for 1–2s before it re-formed.
const LERP_FACTOR_BACK = 0.14;
const REACT_STATE_THROTTLE_MS = 100;
// The lerp factors are tuned per 60 Hz frame; this scales them by frame time.
const FRAME_MS = 1000 / 60;
// Close enough to the target to stop the loop.
const SETTLE_EPSILON = 1e-4;

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
 * scrolled past the viewport) via a native scroll listener, damps it with a
 * lerp each animation frame for a smooth feel, and maps the result onto the
 * Hero's 4 narrative acts:
 *
 *   ATO I   Revelação        0.00–0.22
 *   ATO II  Dissecação       0.22–0.55
 *   ATO III Fly-Through      0.55–0.85
 *   ATO IV  Emergência de Dados 0.85–1.00
 *
 * The frame loop only runs while the progress is catching up with the scroll
 * and stops once it settles (a scroll or resize restarts it): an endless loop
 * kept a throttled main thread busy on every section of the page.
 * `enabled: false` (reduced motion) tracks nothing at all.
 */
export function useScrollNarrative(sectionRef?: RefObject<HTMLElement | null>, enabled = true): ScrollNarrative {
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const [act, setAct] = useState<NarrativeAct>(1);
  const [actProgress, setActProgress] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let rafId = 0;
    let running = false;
    let lastFrame = 0;
    let lastStateFlush = 0;
    let flushed = progressRef.current;

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

    const flush = (now: number) => {
      lastStateFlush = now;
      flushed = progressRef.current;
      const resolved = resolveAct(flushed);
      setAct((prev) => (prev !== resolved.act ? resolved.act : prev));
      setActProgress(resolved.actProgress);
      setProgress(flushed);
    };

    const tick = (now: number) => {
      // Frame-rate independent: the same feel at 60, 120 or a throttled 30 fps.
      const dt = lastFrame ? Math.min(now - lastFrame, 100) : FRAME_MS;
      lastFrame = now;
      const target = targetRef.current;
      const base = target < progressRef.current ? LERP_FACTOR_BACK : LERP_FACTOR;
      const next = lerp(progressRef.current, target, 1 - Math.pow(1 - base, dt / FRAME_MS));
      const settled = Math.abs(target - next) < SETTLE_EPSILON;
      progressRef.current = settled ? target : next;

      if (settled) {
        if (flushed !== progressRef.current) flush(now);
        running = false;
        lastFrame = 0;
        return;
      }
      if (now - lastStateFlush >= REACT_STATE_THROTTLE_MS) flush(now);
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const onScrollOrResize = () => {
      computeTarget();
      start();
    };
    computeTarget();
    start();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [sectionRef, enabled]);

  return { progressRef, act, actProgress, progress };
}
