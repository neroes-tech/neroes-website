"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";

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
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

// The three.js brain is a non-critical visual — load it after first paint
// instead of blocking the Hero on its bundle.
const BrainHero = dynamic(() => import("@/components/BrainHero"), { ssr: false });

// The logo's vivid blue, solid (no gradient): 6.5:1 on the ink background.
const HERO_ACCENT = "text-[#00A5E9]";

// Instrument labels on the ink background (white/60: 6.9:1).
const LABEL = "font-mono text-[11px] uppercase tracking-[0.14em] text-white/60";

/**
 * Opening screen, laid out like a specification sheet: small labels in the
 * top corners, the particle brain as the object on show, the headline
 * anchored low, and one ruled strip underneath with what it is, what to do
 * next and the two readouts. No scroll-jacking — the only scroll effect is
 * the camera easing toward the brain as the Hero leaves the screen.
 *
 * On small screens the same content stacks: labels, headline, text and
 * buttons, then the brain as its own band, then the readouts beneath it.
 */
export function Hero() {
  const { t } = useLanguage();
  const h = t.home;
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const dollyRef = useRef(0);

  // Same page clock as the brain's red points (heartbeat.ts): the R spike
  // crosses the trace's centre line as those points flash.
  const ecgX = useMotionValue(ECG_SYNC_OFFSET_PX);
  const dotOpacity = useMotionValue(1);
  useAnimationFrame(() => {
    if (reduced) return;
    const phase = heartbeatPhase(performance.now());
    ecgX.set(ECG_SYNC_OFFSET_PX - ECG_PERIOD_PX * phase);
    dotOpacity.set(0.35 + 0.65 * heartbeatBlink(phase));
  });

  // 0 while the Hero sits at the top, 1 once it has scrolled off: feeds the
  // brain's camera dolly. Passive listener, at most one read per frame.
  useEffect(() => {
    const section = sectionRef.current;
    if (reduced || !section) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const { top, height } = section.getBoundingClientRect();
      dollyRef.current = Math.min(Math.max(-top / Math.max(height, 1), 0), 1);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} aria-labelledby="hero-heading" className="relative overflow-hidden bg-brand-ink text-white">
      {/* Deliberately not positioned: on desktop the brain inside it is placed
          against the section, edge to edge, while the text stays on the grid. */}
      <div className="container mx-auto flex flex-col px-4 md:px-6 lg:min-h-[calc(100svh-4rem)]">
        <div className="z-10 flex items-start justify-between gap-6 pt-10 lg:order-1 lg:pt-8">
          <Eyebrow tone="inverse">{h.heroEyebrow}</Eyebrow>
          <p aria-hidden="true" className={cn(LABEL, "hidden lg:block")}>
            {h.heroFigure}
          </p>
        </div>

        <h1
          id="hero-heading"
          className="z-10 mt-7 font-exo text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:order-3 lg:mt-0 lg:text-[4.5rem] 2xl:text-[5.25rem]"
        >
          <span className="block">{h.heroHeadlineLine1}</span>{" "}
          <span className={cn("block", HERO_ACCENT)}>{h.heroHeadlineLine2}</span>
        </h1>

        {/* Desktop only (the loop is spelled out in section 02 anyway): the
            spec block in the free space left of the brain, shown above the
            headline but read after it. Its auto margins also push the
            headline down to the strip. */}
        <div className="z-10 hidden lg:order-2 lg:my-auto lg:block lg:py-10">
          <p className={LABEL}>{h.heroLoopLabel}</p>
          <ol className="mt-4 space-y-2.5">
            {h.platform.steps.map((step, i) => (
              <li key={step.index} className={cn(LABEL, "grid grid-cols-[2.75rem_6.5rem_1fr] items-baseline")}>
                <span className={HERO_ACCENT}>{step.index}</span>
                <span className="text-white">{step.title}</span>
                <span>{h.heroLoopDetail[i]}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* No z-index on the strip itself: that would make it a stacking
            context and lift the brain inside it over the headline. Its text
            cells carry z-10 instead. */}
        <div className="mt-8 grid grid-cols-2 gap-x-6 border-t border-white/15 pb-10 pt-6 lg:order-4 lg:mt-10 lg:grid-cols-12 lg:gap-x-0 lg:pb-8">
          <div className="z-10 col-span-2 lg:col-span-6 lg:pr-10">
            <p className="max-w-xl text-lg leading-relaxed text-white/75">{h.heroSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="inverse">
                <Link href="#evidencia">{h.heroPrimaryCta}</Link>
              </Button>
              <Button asChild size="lg" variant="outlineInverse">
                <Link href="/contact">{h.heroSecondaryCta}</Link>
              </Button>
            </div>
          </div>

          {/* The brain: a band of its own on small screens, the full-bleed
              backdrop on desktop (drawn right of centre and raised, clear of
              the headline). */}
          <div className="relative col-span-2 -mx-4 mt-8 h-[46vh] min-h-[300px] md:-mx-6 lg:absolute lg:inset-0 lg:z-0 lg:m-0 lg:h-auto">
            <BrainHero offsetRatio={0.2} offsetYRatio={0.12} dollyRef={dollyRef} />
            <p aria-hidden="true" className={cn(LABEL, "absolute bottom-3 left-4 md:left-6 lg:hidden")}>
              {h.heroFigure}
            </p>
          </div>

          {/* Readouts: the illustrative vital-sign trace, and the headline result with its source */}
          <div aria-hidden="true" className="z-10 mt-6 lg:col-span-3 lg:mt-0 lg:border-l lg:border-white/15 lg:px-8">
            <p className={cn(LABEL, "flex items-center gap-2")}>
              <motion.span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: HEART_RED, opacity: dotOpacity }}
              />
              {h.heroHudSignal}
            </p>
            <div className="relative mt-4 h-8 overflow-hidden" style={{ width: ECG_WINDOW_PX, maxWidth: "100%" }}>
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
          </div>
          <div className="z-10 mt-6 lg:col-span-3 lg:mt-0 lg:border-l lg:border-white/15 lg:pl-8">
            <p className={LABEL}>{h.heroHudAnxiety}</p>
            <p className="mt-2 font-exo text-5xl font-bold leading-none tabular-nums text-white">
              {t.shared.evidence.leadValue}
            </p>
            <p className="mt-2 text-sm text-white/60">{h.heroHudAnxietySource}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
