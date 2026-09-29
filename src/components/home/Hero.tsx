"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";

import {
  ECG_HEIGHT_PX,
  ECG_PATH,
  ECG_PERIOD_PX,
  ECG_SYNC_OFFSET_PX,
  ECG_WINDOW_PX,
  HEART_RED,
  heartbeatBlink,
  heartbeatPhase,
} from "@/components/hero/heartbeat";
import { useScrollNarrative } from "@/components/hero/useScrollNarrative";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/utils";

// The three.js brain is a non-critical visual — load it after first paint
// instead of blocking the Hero on its bundle.
const BrainHero = dynamic(() => import("@/components/BrainHero"), { ssr: false });

// The logo's vivid blue, solid (no gradient): 6.5:1 on the ink background.
const HERO_ACCENT = "text-[#00A5E9]";

// Instrument labels on the ink background (white/60: 6.9:1).
const LABEL = "font-mono text-[11px] uppercase tracking-[0.14em] text-white/60";

// Flat, near-opaque cards: no blur (backdrop-filter over the WebGL canvas in
// a sticky section left them blank after scrolling back in Chrome), no glow,
// no float — they read as instrument readouts, not decoration.
const HUD_CARD = "absolute rounded-md border border-white/15 bg-brand-ink/90 p-3";

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Scroll-coupled fade + rise: driven by scroll progress (0..1), not by time. */
function revealStyle(revealed: number): CSSProperties {
  return {
    opacity: revealed,
    transform: `translateY(${(1 - revealed) * 32}px)`,
    transition: "opacity 150ms linear, transform 150ms linear",
  };
}

/**
 * The two readouts beside the brain, visible from the first frame. They sit
 * in the bottom corners, level with the scroll hint, so the centred headline
 * never runs into them; below 1280px there is no room beside it, so (as on
 * phones) the brain carries the heartbeat alone.
 */
function HudCards({ reduced }: { reduced: boolean }) {
  const { t } = useLanguage();
  const h = t.home;

  // Same page clock as the brain's red points (heartbeat.ts): the R spike
  // crosses the trace's centre line as those points flash.
  const ecgX = useMotionValue(ECG_SYNC_OFFSET_PX);
  const dotOpacity = useMotionValue(1);
  useAnimationFrame(() => {
    if (reduced) return;
    const phase = heartbeatPhase(performance.now());
    ecgX.set(ECG_SYNC_OFFSET_PX - ECG_PERIOD_PX * phase);
    dotOpacity.set(0.3 + 0.7 * heartbeatBlink(phase));
  });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden xl:block">
      <div className="container relative mx-auto h-full px-6">
        {/* Heartbeat monitor, in lockstep with the brain's red vital points */}
        <div className={cn(HUD_CARD, "bottom-[9%] left-6")}>
          <div className="relative h-8 overflow-hidden" style={{ width: ECG_WINDOW_PX, maxWidth: "100%" }}>
            <motion.svg
              viewBox={`0 0 ${ECG_PERIOD_PX * 2} ${ECG_HEIGHT_PX}`}
              width={ECG_PERIOD_PX * 2}
              height={ECG_HEIGHT_PX}
              className="max-w-none"
              fill="none"
              style={{ x: ecgX }}
            >
              <path d={ECG_PATH} stroke={HEART_RED} strokeOpacity="0.3" strokeWidth="1" strokeLinejoin="round" />
              <path d={ECG_PATH} stroke={HEART_RED} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.1 4.5" />
            </motion.svg>
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
          </div>
          <p className={cn(LABEL, "mt-2 flex items-center gap-2 whitespace-nowrap")}>
            <motion.span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: HEART_RED, opacity: dotOpacity }}
            />
            <span>
              {h.heroHudBiosignals}: <span className="text-[#FF6B84]">{h.heroHudActive}</span>
            </span>
          </p>
        </div>

        {/* The headline result, with its source */}
        <div className={cn(HUD_CARD, "bottom-[9%] right-6 min-w-56")}>
          <p className={LABEL}>{h.heroHudAnxiety}</p>
          <p className="mt-1.5 font-exo text-3xl font-bold leading-none tabular-nums text-white">
            {t.shared.evidence.leadValue}
          </p>
          <p className="mt-1.5 text-xs text-white/60">{h.heroHudAnxietySource}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Opening screen, told by scrolling (as in version 2). The section is three
 * screens tall with a pinned stage: first the brain on its own, with the
 * heartbeat readouts; as the visitor scrolls, the camera dives in and the
 * headline, text and buttons rise in, centred; at the end the brain breaks
 * into points and the measured results appear. Scrolling back up plays it in
 * reverse — the readouts never leave the screen.
 *
 * Reduced motion: no pinning and no scroll effects — one screen, everything
 * visible, the brain as a still frame.
 */
export function Hero() {
  const { t } = useLanguage();
  const h = t.home;
  // Hydration-safe: the pinned height and scroll-only elements depend on it.
  const reduced = useReducedMotionSafe();

  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef, act, progress } = useScrollNarrative(reduced ? undefined : sectionRef);

  // Give the brain a beat on its own before any text can appear, even if
  // the visitor scrolls straight away.
  const [textReady, setTextReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setTextReady(true), 500);
    return () => window.clearTimeout(timer);
  }, []);

  // Keyboard users can tab into the buttons before scrolling: show the whole
  // block then, so focus never lands on something invisible (WCAG 2.4.7).
  const [focusReveal, setFocusReveal] = useState(false);

  const shown = reduced || focusReveal;
  const gate = shown || textReady;
  const reveal = (from: number, to: number) => (shown ? 1 : gate ? smoothstep(from, to, progress) : 0);
  const headlineReveal = reveal(0.15, 0.45);
  const subtitleReveal = reveal(0.2, 0.5);
  const ctaReveal = reveal(0.25, 0.55);
  const kpisShown = !reduced && act >= 4;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative bg-brand-ink text-white"
      style={{ height: reduced ? undefined : "300vh" }}
    >
      <div
        className={cn(
          "flex h-[calc(100svh-4rem)] min-h-[560px] w-full items-center justify-center overflow-hidden",
          !reduced && "sticky top-16",
        )}
      >
        {/* A failing WebGL brain must never take the Hero down with it. */}
        <ErrorBoundary label="BrainHero">
          <BrainHero progressRef={progressRef} />
        </ErrorBoundary>

        <HudCards reduced={reduced} />

        {/* Readability behind the copy over the brightest particles; it only
            comes in with the text, so the brain opens unshaded. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: "radial-gradient(ellipse 45% 38% at 50% 50%, rgba(14,22,36,0.72), transparent 75%)",
            opacity: headlineReveal,
          }}
        />

        <div
          className="relative z-20 mx-auto max-w-4xl px-4 text-center md:px-6"
          onFocus={() => setFocusReveal(true)}
        >
          <h1
            id="hero-heading"
            className="font-exo text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-7xl"
            style={revealStyle(headlineReveal)}
          >
            <span className="block">{h.heroHeadlineLine1}</span>{" "}
            <span className={cn("block", HERO_ACCENT)}>{h.heroHeadlineLine2}</span>
          </h1>

          <p
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:mt-6 md:text-xl"
            style={revealStyle(subtitleReveal)}
          >
            {h.heroSubtitle}
          </p>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10"
            style={{ ...revealStyle(ctaReveal), pointerEvents: ctaReveal > 0.5 ? "auto" : "none" }}
          >
            <Button asChild size="lg" variant="inverse">
              <Link href="#evidencia">{h.heroPrimaryCta}</Link>
            </Button>
            <Button asChild size="lg" variant="outlineInverse">
              <Link href="/contact">{h.heroSecondaryCta}</Link>
            </Button>
          </div>

          {/* Ato IV — the brain breaks into points and the results emerge */}
          {!reduced && (
            <dl
              className="mx-auto mt-10 grid max-w-2xl grid-cols-3 divide-x divide-white/15 border-y border-white/15 transition-opacity duration-700 md:mt-12"
              style={{ opacity: kpisShown ? 1 : 0 }}
              aria-hidden={!kpisShown}
            >
              {h.heroKpis.map((kpi) => (
                <div key={kpi.label} className="flex flex-col-reverse gap-1.5 px-3 py-4">
                  <dt className={LABEL}>{kpi.label}</dt>
                  <dd className="font-exo text-2xl font-bold tabular-nums text-white md:text-3xl">{kpi.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Scroll hint — only while the brain is on its own */}
        {!reduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-500"
            style={{ opacity: act === 1 && headlineReveal < 0.05 ? 1 : 0 }}
          >
            <span className={LABEL}>{h.heroScrollHint}</span>
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown className="h-5 w-5 text-white/60" />
            </motion.span>
          </div>
        )}
      </div>
    </section>
  );
}
