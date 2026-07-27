"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

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
    <div className="rounded-2xl border border-border bg-card/70 px-4 py-3 backdrop-blur-sm">
      <p className="font-exo text-2xl font-bold text-brand-blue">
        {kpi.prefix}
        {formatted}
        {kpi.suffix}
      </p>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
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
      className="relative w-full bg-background"
      style={{ height: reduced ? undefined : "320vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <BrainHero progressRef={progressRef} />

        <div className="pointer-events-none relative z-20 mx-auto max-w-4xl px-4 text-center md:px-6">
          {/* Headline — fades/rises in as the brain's hemispheres open (scroll 0 → 0.32) */}
          <h1
            className="font-exo text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
            style={revealStyle(headlineReveal, reduced)}
          >
            <span className="block">{t.home.heroHeadlineLine1}</span>
            <span className="block text-brand-blue">{t.home.heroHeadlineLine2}</span>
          </h1>

          {/* Subtitle — follows the headline (scroll 0.08 → 0.4) */}
          <p
            className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl"
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
                className="group h-14 rounded-full bg-secondary px-8 text-lg font-semibold text-secondary-foreground transition-shadow hover:bg-secondary/90 hover:shadow-glow-secondary"
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
                className="h-14 rounded-full border-primary px-8 text-lg text-primary hover:bg-primary/5"
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
            <ChevronDown className="h-6 w-6 text-muted-foreground/60" />
          ) : (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-6 w-6 text-muted-foreground/60" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
