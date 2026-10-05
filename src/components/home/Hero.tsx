"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  ECG_HEIGHT_PX,
  ECG_PATH,
  ECG_PERIOD_PX,
  ECG_SYNC_OFFSET_PX,
  ECG_WINDOW_PX,
  HEART_RED,
  HEARTBEAT_PERIOD_S,
  heartbeatBlink,
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

// The logo's vivid blue, solid (no gradient): 6.5:1 on the dark background.
const HERO_ACCENT = "text-brand-vivid";

// Small labels on the dark background (white/60: 7.4:1).
const LABEL = "text-[11px] font-bold uppercase tracking-[0.14em] text-white/60";

// Translucent readouts with a hairline border, square corners. No blur
// (backdrop-filter over the WebGL canvas in a sticky section left them blank
// after scrolling back in Chrome), no glow, no float.
const HUD_CARD = "border border-white/30 bg-white/[0.07] p-3";

// Scroll progress (0..1) windows. The text is in and sharp well before the
// brain starts to break apart at 0.55 (BrainHero's Ato III), so it is never
// racing the explosion; the results take over at the end (Ato IV, 0.85).
const REVEAL = { headline: [0.06, 0.26], subtitle: [0.1, 0.3], ctas: [0.14, 0.34] } as const;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Scroll-coupled reveal: faint and a little low at 0, in place at 1. Opacity
 * and transform only — a blur() here, re-set ten times a second while
 * scrolling, made frames GPU-bound and delayed the paint after clicks (INP).
 */
function revealStyle(revealed: number): CSSProperties {
  return {
    opacity: revealed,
    transform: `translateY(${(1 - revealed) * 18}px)`,
    transition: "opacity 150ms linear, transform 150ms linear",
  };
}

/** The status dot over one beat (heartbeat.ts blink envelope), as keyframes. */
const DOT_KEYFRAMES = [0, 0.06, 0.12, 0.2, 0.3, 0.45, 0.65, 1].map((offset) => ({
  offset,
  opacity: 0.3 + 0.7 * heartbeatBlink(offset),
}));

/** Heartbeat monitor, in lockstep with the brain's red vital points (heartbeat.ts). */
function HeartbeatCard({ reduced, className }: { reduced: boolean; className?: string }) {
  const { t } = useLanguage();
  const h = t.home;

  const ecgRef = useRef<SVGSVGElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Web Animations, run by the compositor: the per-frame JS loop this replaced
  // kept the main thread busy on every section of the page. startTime 0 puts
  // both on the page clock (document.timeline shares performance.now()'s
  // origin), the clock heartbeatPhase() gives the brain — so the R spike still
  // crosses the trace's centre line as the brain's red points flash.
  useEffect(() => {
    if (reduced) return;
    const timing: KeyframeAnimationOptions = { duration: HEARTBEAT_PERIOD_S * 1000, iterations: Infinity };
    const animations = [
      ecgRef.current?.animate(
        [
          { transform: `translateX(${ECG_SYNC_OFFSET_PX}px)` },
          { transform: `translateX(${ECG_SYNC_OFFSET_PX - ECG_PERIOD_PX}px)` },
        ],
        timing,
      ),
      dotRef.current?.animate(DOT_KEYFRAMES, timing),
    ];
    for (const animation of animations) if (animation) animation.startTime = 0;
    return () => animations.forEach((animation) => animation?.cancel());
  }, [reduced]);

  return (
    <div aria-hidden="true" className={cn(HUD_CARD, className)}>
      <div className="relative h-8 overflow-hidden" style={{ width: ECG_WINDOW_PX, maxWidth: "100%" }}>
        <svg
          ref={ecgRef}
          viewBox={`0 0 ${ECG_PERIOD_PX * 2} ${ECG_HEIGHT_PX}`}
          width={ECG_PERIOD_PX * 2}
          height={ECG_HEIGHT_PX}
          className="max-w-none"
          fill="none"
          style={{ transform: `translateX(${ECG_SYNC_OFFSET_PX}px)` }}
        >
          <path d={ECG_PATH} stroke={HEART_RED} strokeOpacity="0.3" strokeWidth="1" strokeLinejoin="round" />
          <path d={ECG_PATH} stroke={HEART_RED} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.1 4.5" />
        </svg>
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
      </div>
      <p className={cn(LABEL, "mt-2 flex items-center gap-2 whitespace-nowrap")}>
        <span ref={dotRef} className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: HEART_RED }} />
        <span>
          {h.heroHudBiosignals}: <span className="text-heart-soft">{h.heroHudActive}</span>
        </span>
      </p>
    </div>
  );
}

/** The headline result. */
function AnxietyCard({ className }: { className?: string }) {
  const { t } = useLanguage();
  const h = t.home;
  return (
    <div aria-hidden="true" className={cn(HUD_CARD, "min-w-56", className)}>
      <p className={LABEL}>{h.heroHudAnxiety}</p>
      <p className="mt-1.5 font-exo text-3xl font-medium leading-none tracking-[-0.03em] tabular-nums text-white">
        {t.shared.evidence.leadValue}
      </p>
    </div>
  );
}

/**
 * Opening screen, told by scrolling (as in version 2). The section is a
 * little over two and a half screens tall with a pinned stage: first the
 * brain on its own, with the heartbeat readouts; as the visitor scrolls, the
 * headline, text and buttons come into focus, centred; then the camera dives
 * and the brain breaks into points behind the text; at the end the measured
 * results appear. Scrolling back up plays it in reverse.
 *
 * Layout: the text is centred in the space between the floating navigation
 * and a bottom band that holds the two readouts and the results, so nothing
 * slides under the navigation or off the bottom on short laptop screens; the
 * headline also scales with the screen's height.
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
  const { progressRef, act, progress } = useScrollNarrative(sectionRef, !reduced);

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
  const reveal = ([from, to]: readonly [number, number]) => (shown ? 1 : gate ? smoothstep(from, to, progress) : 0);
  const headlineReveal = reveal(REVEAL.headline);
  const subtitleReveal = reveal(REVEAL.subtitle);
  const ctaReveal = reveal(REVEAL.ctas);
  const kpisShown = !reduced && act >= 4;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative bg-hero text-white"
      style={{ height: reduced ? undefined : "260vh" }}
    >
      <div
        // Deep-navy backdrop of version 2, which gives the particle brain its depth.
        className={cn(
          "relative flex h-svh min-h-[560px] w-full flex-col overflow-hidden bg-hero-gradient",
          !reduced && "sticky top-0",
        )}
      >
        {/* A failing WebGL brain must never take the Hero down with it. */}
        <ErrorBoundary label="BrainHero">
          <BrainHero progressRef={progressRef} />
        </ErrorBoundary>

        {/* Readability behind the copy over the brightest particles; it only
            comes in with the text, so the brain opens unshaded. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-hero-scrim"
          style={{ opacity: headlineReveal }}
        />

        {/* The copy, centred between the navigation (pt) and the bottom band */}
        <div className="relative z-20 flex flex-1 items-center justify-center px-4 pb-4 pt-24 md:px-6 md:pt-28">
          <div className="mx-auto max-w-6xl text-center" onFocus={() => setFocusReveal(true)}>
            <h1
              id="hero-heading"
              className="font-exo text-[length:clamp(2.75rem,min(8vw,11.5svh),6.5rem)] font-light leading-[1.05] tracking-[-0.045em]"
              style={revealStyle(headlineReveal)}
            >
              <span className="block">{h.heroHeadlineLine1}</span>{" "}
              <span className={cn("block", HERO_ACCENT)}>{h.heroHeadlineLine2}</span>
            </h1>

            <p
              className="mx-auto mt-5 max-w-2xl text-balance text-base font-light leading-relaxed tracking-[-0.01em] text-white/80 sm:text-lg md:mt-7 md:text-xl"
              style={revealStyle(subtitleReveal)}
            >
              {h.heroSubtitle}
            </p>

            <div
              className="mt-7 flex flex-wrap items-center justify-center gap-3 md:mt-9"
              style={{ ...revealStyle(ctaReveal), pointerEvents: ctaReveal > 0.5 ? "auto" : "none" }}
            >
              <Button asChild size="lg" variant="inverse">
                <Link href="#evidencia">{h.heroPrimaryCta}</Link>
              </Button>
              <Button asChild size="lg" variant="outlineInverse">
                <Link href="/contact">{h.heroSecondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom band: heartbeat · the results (Ato IV) · anxiety result */}
        <div className="relative z-20 pb-5 md:pb-7">
          <div className="container mx-auto grid items-end gap-4 px-4 md:px-6 xl:grid-cols-[15rem_minmax(0,1fr)_15rem]">
            <HeartbeatCard reduced={reduced} className="hidden xl:block" />

            {reduced ? (
              <span className="hidden xl:block" />
            ) : (
              <dl
                className="mx-auto grid w-full max-w-2xl grid-cols-3 divide-x divide-white/15 border-y border-white/15 transition-opacity duration-700"
                style={{ opacity: kpisShown ? 1 : 0 }}
                aria-hidden={!kpisShown}
              >
                {h.heroKpis.map((kpi) => (
                  // justify-end in a column-reverse flex = top: the three values share
                  // one line however many lines their labels wrap to. On phones the
                  // labels drop to 10px and tighter tracking so long words fit the cell.
                  <div key={kpi.label} className="flex flex-col-reverse justify-end gap-1.5 px-1.5 py-3 text-center sm:px-3 md:py-4">
                    <dt className={cn(LABEL, "max-sm:text-[10px] max-sm:tracking-[0.06em]")}>{kpi.label}</dt>
                    <dd className="font-exo text-2xl font-medium tracking-[-0.03em] tabular-nums text-white md:text-4xl">
                      {kpi.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <AnxietyCard className="hidden justify-self-end xl:block" />
          </div>
        </div>

        {/* Scroll hint — only while the brain is on its own (the results band is still empty then) */}
        {!reduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 transition-opacity duration-500"
            style={{ opacity: act === 1 && headlineReveal < 0.05 ? 1 : 0 }}
          >
            <span className={LABEL}>{h.heroScrollHint}</span>
            <span className="animate-nudge">
              <ChevronDown className="h-5 w-5 text-white/60" />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
