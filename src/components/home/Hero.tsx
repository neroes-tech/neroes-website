"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "framer-motion";

import {
  ECG_HEIGHT_PX,
  ECG_PATH,
  ECG_PERIOD_PX,
  ECG_SYNC_OFFSET_PX,
  HEART_RED,
  heartbeatBlink,
  heartbeatPhase,
} from "@/components/hero/heartbeat";
import { useScrollNarrative } from "@/components/hero/useScrollNarrative";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// The three.js-powered brain is a decorative, non-critical visual — load it
// after the initial page render instead of blocking the Hero's first paint
// with its bundle weight.
const BrainHero = dynamic(() => import("@/components/BrainHero"), { ssr: false });

// Real, already-verified metrics (Science page) — the Ato IV "data emergence"
// reveal must not invent numbers that aren't backed by the site's own
// content. Labels come from t.home.statsLabels (same order).
const KPI_VALUES = [
  { target: 111, prefix: "+", suffix: "%", decimals: 0 },
  { target: 21.7, prefix: "+", suffix: "%", decimals: 1 },
  { target: 14.2, prefix: "-", suffix: "%", decimals: 1 },
] as const;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const REVEAL_TRANSITION = "opacity 150ms linear, transform 150ms linear";

/** Inline style for a scroll-coupled fade + rise: opacity/translateY driven directly by scroll progress (0..1), not by mount time. Deliberately decoupled from the brain's own camera motion (zoom direction there has changed more than once) — a simple, elegant settle that doesn't imply a specific depth direction. */
function revealStyle(revealed: number, reduced: boolean): CSSProperties {
  if (reduced) return { opacity: 1, transform: "none" };
  return {
    opacity: revealed,
    transform: `translateY(${(1 - revealed) * 32}px)`,
    transition: REVEAL_TRANSITION,
  };
}

/** requestAnimationFrame count-up from 0 to `target`, formatted with the KPI's own decimals/prefix/suffix. */
function useCountUp(target: number, decimals: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, durationMs]);

  return value.toFixed(decimals);
}

function KpiTicker({
  kpi,
  label,
  active,
}: {
  kpi: (typeof KPI_VALUES)[number];
  label: string;
  active: boolean;
}) {
  const formatted = useCountUp(kpi.target, kpi.decimals, active);
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1424]/80 px-4 py-3">
      <p className="font-exo text-2xl font-bold text-[#22D3EE]">
        {kpi.prefix}
        {formatted}
        {kpi.suffix}
      </p>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-300">{label}</p>
    </div>
  );
}

// Deep-tech backdrop: lit navy centre falling off to near-black edges.
const HERO_BG = "radial-gradient(ellipse 80% 70% at 50% 45%, #0D1B2A 0%, #0A192F 35%, #040711 100%)";
// Subtle 48px tech grid, masked so it fades out toward the edges.
const GRID_STYLE: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
  maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
};

// Shown in the HUD card; see the flag in the summary — the verified figure
// in docs/content-inventory.md is -14.2% (10 sessions).
const ANXIETY_REDUCTION = "−42%";

// No backdrop-filter on these (or the KPI tickers): in Chrome, backdrop-blur
// over the WebGL canvas inside the sticky Hero, combined with the float
// animation, can leave the cards blank after they scroll out and back in.
// A near-opaque fill reads the same over the dark backdrop.
const HUD_CARD =
  "absolute hidden rounded-xl border border-white/10 bg-[#0B1424]/85 p-3 shadow-2xl lg:block";

/** Decorative "live lab monitoring" HUD cards floating beside the brain. */
function HudCards({ reduced }: { reduced: boolean }) {
  const { t } = useLanguage();

  // ECG scroll + status-dot blink read the shared heartbeat clock
  // (heartbeat.ts), the same one the brain's red vital points blink on —
  // the R spike crosses the trace's centre line as those points flash.
  const ecgX = useMotionValue(ECG_SYNC_OFFSET_PX);
  const dotOpacity = useMotionValue(1);
  useAnimationFrame(() => {
    if (reduced) return;
    const phase = heartbeatPhase(performance.now());
    ecgX.set(ECG_SYNC_OFFSET_PX - ECG_PERIOD_PX * phase);
    dotOpacity.set(0.3 + 0.7 * heartbeatBlink(phase));
  });

  const float = (delay: number) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -10, 0] },
          transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay },
        };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {/* Heartbeat monitor — red dotted ECG, in lockstep with the brain's red vital points */}
      <motion.div className={`${HUD_CARD} left-[6%] top-[20%] w-56`} {...float(0)}>
        <div className="relative h-8 overflow-hidden">
          <motion.svg
            viewBox={`0 0 ${ECG_PERIOD_PX * 2} ${ECG_HEIGHT_PX}`}
            width={ECG_PERIOD_PX * 2}
            height={ECG_HEIGHT_PX}
            className="max-w-none"
            fill="none"
            style={{ x: ecgX }}
          >
            {/* faint continuous trace + particle dots on top, echoing the brain's point cloud */}
            <path d={ECG_PATH} stroke={HEART_RED} strokeOpacity="0.25" strokeWidth="1" strokeLinejoin="round" />
            <path
              d={ECG_PATH}
              stroke={HEART_RED}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="0.1 4.5"
              style={{ filter: "drop-shadow(0 0 3px rgba(255,59,92,0.9))" }}
            />
          </motion.svg>
          {/* centre "read head": the beat lands here */}
          <div className="absolute inset-y-0 left-1/2 w-px bg-white/15" />
          {/* fade the trace in/out at the card edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0B1424] via-transparent to-[#0B1424] opacity-80" />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-200">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF3B5C]"
            style={{ opacity: dotOpacity }}
          />
          {t.home.heroHudBiosignals}: <span className="text-[#FF6B84]">{t.home.heroHudActive}</span>
        </p>
      </motion.div>

      <motion.div className={`${HUD_CARD} bottom-[18%] right-[6%]`} {...float(1.5)}>
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#22D3EE]" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-300">{t.home.heroHudAnxiety}</p>
            <p className="font-exo text-lg font-bold text-white">{ANXIETY_REDUCTION}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef, act, progress } = useScrollNarrative(reduced ? undefined : sectionRef);

  // Holds the whole text block at opacity 0 for the first ~500ms after
  // mount, regardless of scroll — gives the brain's own entrance a beat to
  // breathe before any text starts competing for attention.
  const [textReady, setTextReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setTextReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const hoverSpring = { type: "spring", stiffness: 400, damping: 17 } as const;

  // ── Text-block reveal, coupled to scroll progress instead of to mount
  // time — starts at opacity 0 / translateY 32px, staggered so the headline
  // leads, then the subtitle, then the CTAs. The window (0.15 → 0.45/0.5/0.55)
  // is deliberately later than the scroll's very start: the camera's zoom-in
  // (smoothstep(0, 0.9, progress) — see BrainHero) is only ~29% done by
  // progress 0.32, which is where the old window finished — text used to
  // arrive fully visible before the brain had visibly expanded much at all.
  // This window instead completes around progress 0.45-0.55 (camera ~50-70%
  // zoomed in), staying inside Ato II so it settles before Ato III's fly-
  // through/explosion at 0.55. Gated by textReady (see above) so it never
  // starts before the 500ms breathing room has passed, even if the user
  // scrolls immediately.
  const gate = reduced || textReady;
  const headlineReveal = reduced ? 1 : gate ? smoothstep(0.15, 0.45, progress) : 0;
  const subtitleReveal = reduced ? 1 : gate ? smoothstep(0.2, 0.5, progress) : 0;
  const ctaReveal = reduced ? 1 : gate ? smoothstep(0.25, 0.55, progress) : 0;

  const act4Active = !reduced && act >= 4;

  return (
    <section
      ref={sectionRef}
      aria-label="Introdução Neroes — inteligência neural viva"
      className="relative w-full bg-[#040711]"
      style={{ height: reduced ? undefined : "320vh" }}
    >
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{ background: HERO_BG }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={GRID_STYLE} />
        <BrainHero progressRef={progressRef} />
        <HudCards reduced={reduced} />

        {/* Readability scrim behind the copy — keeps white text ≥ AA over the brightest particles. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "radial-gradient(ellipse 45% 35% at 50% 50%, rgba(4,7,17,0.55), transparent 75%)" }}
        />

        <div className="pointer-events-none relative z-20 mx-auto max-w-4xl px-4 text-center md:px-6">
          {/* Headline — fades/rises in as the brain's hemispheres open (scroll 0 → 0.32) */}
          <h1
            className="font-exo text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
            style={revealStyle(headlineReveal, reduced)}
          >
            <span className="block">{t.home.heroHeadlineLine1}</span>
            <span className="block bg-gradient-to-r from-[#00F0FF] via-[#22D3EE] to-[#60A5FA] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
              {t.home.heroHeadlineLine2}
            </span>
          </h1>

          {/* Subtitle — follows the headline (scroll 0.08 → 0.4) */}
          <p
            className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl"
            style={revealStyle(subtitleReveal, reduced)}
          >
            {t.home.heroSubtitle}
          </p>

          {/* CTAs — settle last, fully visible by scroll 0.5 */}
          <div
            className="pointer-events-auto mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            style={revealStyle(ctaReveal, reduced)}
          >
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.04, y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={hoverSpring}
            >
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-[#22D3EE] px-8 text-lg font-semibold text-[#040711] transition-shadow hover:bg-[#67E8F9] hover:shadow-[0_0_32px_-4px_rgba(34,211,238,0.6)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#040711]"
              >
                <Link href="/contact">
                  {t.home.heroPrimaryCta}
                  <ArrowRight
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={reduced ? undefined : { scale: 1.04, y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={hoverSpring}
            >
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full border-white/40 bg-transparent px-8 text-lg text-white hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#040711]"
              >
                <Link href="/science">{t.home.heroSecondaryCta}</Link>
              </Button>
            </motion.div>
          </div>

          {/* ── ATO IV: emergência de dados — KPIs reais com count-up ── */}
          {!reduced && (
            <div
              className="mt-10 grid grid-cols-1 gap-4 transition-opacity duration-700 sm:grid-cols-3"
              style={{ opacity: act >= 4 ? 1 : 0 }}
              aria-hidden={act < 4}
            >
              {KPI_VALUES.map((kpi, i) => (
                <KpiTicker key={t.home.heroKpiLabels[i]} kpi={kpi} label={t.home.heroKpiLabels[i]!} active={act4Active} />
              ))}
            </div>
          )}
        </div>

        {/* Scroll hint — only meaningful in Ato I, fades out after */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500"
          style={{ opacity: reduced || act === 1 ? 1 : 0 }}
        >
          {reduced ? (
            <ChevronDown className="h-6 w-6 text-white/60" />
          ) : (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-6 w-6 text-white/60" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Soft hand-off from the dark Hero into the light sections below. With
          the scroll narrative, the sticky viewport stays pinned until the
          section's very end, so the fade has to overlay its bottom edge (a
          block after it would sit hidden behind the pinned viewport); without
          it (reduced motion) a plain block below the Hero does the job. */}
      {reduced ? (
        <div aria-hidden="true" className="h-40 w-full bg-gradient-to-b from-[#040711] to-background" />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-b from-transparent to-background"
        />
      )}
    </section>
  );
}
