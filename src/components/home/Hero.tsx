"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { AtmosphericBackdrop } from "@/components/hero/AtmosphericBackdrop";
import { CursorHalo } from "@/components/hero/CursorHalo";
import { GrainOverlay } from "@/components/hero/GrainOverlay";
import { ParticleMorph } from "@/components/hero/ParticleMorph";
import { useScrollNarrative } from "@/components/hero/useScrollNarrative";
import { Button } from "@/components/ui/button";

// The three.js-powered brain is a decorative, non-critical visual — load it
// after the initial page render instead of blocking the Hero's first paint
// with its bundle weight.
const BrainHero = dynamic(() => import("@/components/BrainHero"), { ssr: false });

// Real, already-verified metrics (Science page) — the Ato IV "data emergence"
// reveal must not invent numbers that aren't backed by the site's own content.
const KPIS = [
  { target: 111, prefix: "+", suffix: "%", decimals: 0, label: "Controlo emocional" },
  { target: 21.7, prefix: "+", suffix: "%", decimals: 1, label: "Velocidade de decisão" },
  { target: 14.2, prefix: "-", suffix: "%", decimals: 1, label: "Ansiedade" },
] as const;

const HEADLINE_LINES = ["Treinamos o cérebro", "como treinas o corpo."] as const;

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

function KpiTicker({ kpi, active }: { kpi: (typeof KPIS)[number]; active: boolean }) {
  const formatted = useCountUp(kpi.target, kpi.decimals, active);
  return (
    <div className="rounded-2xl border border-border bg-card/70 px-4 py-3 backdrop-blur-sm">
      <p className="font-exo text-2xl font-bold text-brand-blue">
        {kpi.prefix}
        {formatted}
        {kpi.suffix}
      </p>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
    </div>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const sectionRef = useRef<HTMLElement>(null);
  const { progressRef, act } = useScrollNarrative(reduced ? undefined : sectionRef);

  const hoverSpring = { type: "spring", stiffness: 400, damping: 17 } as const;

  const lineVariants: Variants = {
    hidden: { y: "100%" },
    visible: (i: number) => ({
      y: "0%",
      transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const fadeVariants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.8, delay: reduced ? 0 : 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const act4Active = !reduced && act >= 4;

  return (
    <section
      ref={sectionRef}
      aria-label="Introdução Neroes — inteligência neural viva"
      className="relative w-full bg-background"
      style={{ height: reduced ? undefined : "320vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <AtmosphericBackdrop reduced={reduced} />
        <BrainHero progressRef={progressRef} />
        {!reduced && <ParticleMorph progressRef={progressRef} />}

        {!reduced && (
          <>
            <GrainOverlay />
            <CursorHalo containerRef={sectionRef} />
          </>
        )}

        <div className="pointer-events-none relative z-20 mx-auto max-w-4xl px-4 text-center md:px-6">
          {/* Kicker */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeVariants}
            className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-foreground/60"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {!reduced && (
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-secondary"
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            Treino mental baseado em neurociência
          </motion.p>

          {/* Headline — line-by-line mask reveal (Ato I) */}
          <h1 className="mt-8 font-exo text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
            {HEADLINE_LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={lineVariants}
                  className={i === 1 ? "block text-brand-blue" : "block"}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeVariants}
            className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl"
          >
            Um headset EEG lê as tuas ondas cerebrais enquanto jogas um jogo
            que só se ganha mantendo a calma e a concentração — treinando foco,
            controlo emocional e resiliência, sessão após sessão.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeVariants}
            className="pointer-events-auto mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
                  Marcar uma demonstração
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
                <Link href="/science">Ver a ciência</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* ── ATO IV: emergência de dados — KPIs reais com count-up ── */}
          {!reduced && (
            <div
              className="mt-10 grid grid-cols-1 gap-4 transition-opacity duration-700 sm:grid-cols-3"
              style={{ opacity: act >= 4 ? 1 : 0 }}
              aria-hidden={act < 4}
            >
              {KPIS.map((kpi) => (
                <KpiTicker key={kpi.label} kpi={kpi} active={act4Active} />
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
