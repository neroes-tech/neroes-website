"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";

// The three.js-powered brain is a decorative, non-critical visual — load it
// after the initial page render instead of blocking the Hero's first paint
// with its bundle weight.
const BrainHero = dynamic(() => import("@/components/BrainHero"), { ssr: false });

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.14,
        delayChildren: reduced ? 0 : 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const hoverSpring = { type: "spring", stiffness: 400, damping: 17 } as const;

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      <BrainHero />

      <motion.div
        className="pointer-events-none relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow badge */}
        <motion.p
          variants={item}
          className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary"
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

        {/* Headline */}
        <motion.h1
          variants={item}
          className="mt-8 font-exo text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl"
        >
          Treinamos o cérebro{" "}
          <span className="text-brand-blue">como treinas o corpo.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl"
        >
          Um headset EEG lê as tuas ondas cerebrais enquanto jogas um jogo
          que só se ganha mantendo a calma e a concentração — treinando foco,
          controlo emocional e resiliência, sessão após sessão.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
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

        {/* Verified outcome detail */}
        <motion.p variants={item} className="mt-10 text-sm font-medium tracking-wide text-muted-foreground">
          Resultados medidos:{" "}
          <span className="text-primary">+111% controlo emocional</span>
          <span aria-hidden="true"> &middot; </span>
          <span className="text-secondary">&minus;14.2% ansiedade</span>
        </motion.p>
      </motion.div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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
    </section>
  );
}
