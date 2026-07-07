"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

interface PageHeroProps {
  /** Small uppercase label above the title, e.g. "Sport science". */
  eyebrow?: string;
  /** Rendered as the page's single H1 — keep to one PageHero per page. */
  title: string;
  subtitle?: ReactNode;
  /** "decorative" adds the neural-grid texture + radial glow (Brain Experience style). */
  variant?: "default" | "decorative";
  maxWidth?: keyof typeof MAX_WIDTH;
  /** "compact" trims vertical padding for shorter pages (legal, contact). */
  size?: "default" | "compact";
  /** Optional CTA(s) rendered directly under the subtitle. */
  cta?: ReactNode;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "default",
  maxWidth = "4xl",
  size = "default",
  cta,
  className,
}: PageHeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const reduced = prefersReducedMotion ?? false;

  const isDecorative = variant === "decorative";

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        size === "compact" ? "py-20" : "py-24",
        isDecorative ? "bg-primary text-primary-foreground" : "bg-background",
        className,
      )}
    >
      {isDecorative ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/25 via-primary to-primary" />
          <div className="absolute inset-0 bg-neural-grid text-primary-foreground/10" />
        </div>
      ) : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {!reduced ? (
            <>
              <motion.div
                className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
                animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute right-0 top-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl"
                animate={{ x: [0, -24, 0], y: [0, 18, 0] }}
                transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-decorative-violet-soft blur-3xl"
                animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
                transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          ) : (
            <>
              <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-decorative-violet-soft blur-3xl" />
            </>
          )}
          <div className="absolute inset-0 bg-neural-grid text-primary/[0.04]" />
        </div>
      )}

      <div className={cn("container relative mx-auto px-4 text-center md:px-6", MAX_WIDTH[maxWidth])}>
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {eyebrow && (
            <p
              className={cn(
                "mb-4 text-sm font-medium uppercase tracking-widest",
                isDecorative ? "text-primary-foreground/70" : "text-secondary",
              )}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className={cn(
              "font-exo text-4xl font-bold leading-tight tracking-tight md:text-5xl",
              isDecorative ? "text-primary-foreground" : "text-primary",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mx-auto mt-6 text-lg leading-relaxed",
                isDecorative ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {subtitle}
            </p>
          )}
          {cta && <div className="mt-10 flex flex-wrap items-center justify-center gap-4">{cta}</div>}
        </motion.div>
      </div>
    </section>
  );
}
