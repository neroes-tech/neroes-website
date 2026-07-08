"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { VirtualBrain } from "@/components/home/VirtualBrain";

/* ------------------------------------------------------------------ */
/* Neural network background data                                      */
/* ------------------------------------------------------------------ */

type NetworkNode = {
  x: number;
  y: number;
  r: number;
  color: string;
  delay: number;
};

const NODE_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
} as const;

const NODES: readonly NetworkNode[] = [
  { x: 150, y: 170, r: 5, color: NODE_COLORS.secondary, delay: 0 },
  { x: 330, y: 110, r: 4, color: NODE_COLORS.accent, delay: 0.6 },
  { x: 520, y: 200, r: 6, color: NODE_COLORS.primary, delay: 1.2 },
  { x: 720, y: 105, r: 4, color: NODE_COLORS.secondary, delay: 0.3 },
  { x: 930, y: 185, r: 5, color: NODE_COLORS.accent, delay: 1.8 },
  { x: 1090, y: 120, r: 4, color: NODE_COLORS.secondary, delay: 0.9 },
  { x: 90, y: 420, r: 4, color: NODE_COLORS.accent, delay: 1.5 },
  { x: 270, y: 530, r: 5, color: NODE_COLORS.secondary, delay: 0.2 },
  { x: 480, y: 625, r: 4, color: NODE_COLORS.primary, delay: 1.1 },
  { x: 700, y: 555, r: 6, color: NODE_COLORS.secondary, delay: 0.7 },
  { x: 905, y: 640, r: 4, color: NODE_COLORS.accent, delay: 1.4 },
  { x: 1105, y: 495, r: 5, color: NODE_COLORS.secondary, delay: 0.4 },
  { x: 610, y: 370, r: 4, color: NODE_COLORS.accent, delay: 1.7 },
  { x: 1020, y: 350, r: 4, color: NODE_COLORS.primary, delay: 0.8 },
  { x: 180, y: 650, r: 4, color: NODE_COLORS.accent, delay: 1.0 },
];

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [10, 11], [2, 12], [12, 9], [12, 7], [3, 13],
  [13, 11], [13, 4], [6, 14], [14, 8], [1, 12],
];

type NetworkLine = { x1: number; y1: number; x2: number; y2: number };

const LINES: readonly NetworkLine[] = EDGES.flatMap(([a, b]) => {
  const from = NODES[a];
  const to = NODES[b];
  return from && to ? [{ x1: from.x, y1: from.y, x2: to.x, y2: to.y }] : [];
});

/* EEG-style waveform running along the lower part of the hero. */
const WAVE_SEGMENT = "h 90 l 14 -16 l 12 30 l 10 -44 l 12 40 l 10 -10";
const WAVE_PATH = `M -40 690 ${Array.from({ length: 9 }, () => WAVE_SEGMENT).join(" ")}`;

/* ------------------------------------------------------------------ */
/* Decorative background                                               */
/* ------------------------------------------------------------------ */

function NeuralBackground({ animate }: { animate: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Soft radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      {/* Drifting color blobs */}
      {animate ? (
        <>
          <motion.div
            className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
            animate={{ x: [0, -36, 0], y: [0, -20, 0], scale: [1.08, 1, 1.08] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl" />
        </>
      )}

      {/* Neural network: nodes, synapses and an EEG trace */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        focusable="false"
      >
        {LINES.map((line, i) =>
          animate ? (
            <motion.line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              initial={{ opacity: 0.08 }}
              animate={{ opacity: [0.06, 0.22, 0.06] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (i % 7) * 0.55,
              }}
            />
          ) : (
            <line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="hsl(var(--primary))"
              strokeWidth={1}
              opacity={0.12}
            />
          ),
        )}

        {NODES.map((node, i) =>
          animate ? (
            <g key={`node-${i}`}>
              {/* Expanding pulse ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                fill="none"
                stroke={node.color}
                strokeWidth={1.5}
                initial={{ r: node.r * 1.5, opacity: 0.3 }}
                animate={{ r: node.r * 3.5, opacity: 0 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: node.delay,
                }}
              />
              {/* Core node */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={node.color}
                animate={{ opacity: [0.35, 0.8, 0.35] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: node.delay,
                }}
              />
            </g>
          ) : (
            <circle
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.color}
              opacity={0.4}
            />
          ),
        )}

        {/* EEG trace */}
        <path
          d={WAVE_PATH}
          stroke="hsl(var(--secondary))"
          strokeWidth={1.5}
          opacity={0.15}
        />
        {animate && (
          <motion.path
            d={WAVE_PATH}
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0.15, pathOffset: 0, opacity: 0.5 }}
            animate={{ pathOffset: [0, 0.85] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>

      {/* Fade into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

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
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-background">
      <NeuralBackground animate={!reduced} />

      <div className="container relative z-10 grid grid-cols-1 items-center gap-10 px-4 py-20 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-16 lg:text-left">
        <motion.div
          className="mx-auto max-w-4xl text-center lg:mx-0 lg:max-w-none lg:text-left"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow badge */}
          <motion.p
            variants={item}
            className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-1.5 text-sm font-medium text-secondary lg:mx-0"
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
            <span className="text-secondary">como treinas o corpo.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground md:text-2xl lg:mx-0"
          >
            Um headset EEG lê as tuas ondas cerebrais enquanto jogas um jogo
            que só se ganha mantendo a calma e a concentração — treinando foco,
            controlo emocional e resiliência, sessão após sessão.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
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
          <motion.p
            variants={item}
            className="mt-10 text-sm font-medium tracking-wide text-muted-foreground"
          >
            Resultados medidos:{" "}
            <span className="text-primary">+111% controlo emocional</span>
            <span aria-hidden="true"> &middot; </span>
            <span className="text-secondary">&minus;14.2% ansiedade</span>
          </motion.p>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-sm lg:mx-0 lg:max-w-none"
          initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reduced ? 0.2 : 1,
            delay: reduced ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <VirtualBrain />
        </motion.div>
      </div>

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
