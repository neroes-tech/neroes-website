"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * A statement that comes into view as it scrolls in: faint and a little low
 * when it enters, solid by the time it reaches the upper half of the screen.
 * Tied to the scroll position (not a timer), so it never replays on its own.
 * Opacity and transform only: a scroll-linked blur() made every frame
 * GPU-bound and delayed the next paint after clicks by 200–340 ms (INP).
 * The text is always in the DOM — screen readers get it at once.
 *
 * Reduced motion: explicit static values, not a dropped style prop —
 * framer-motion keeps whatever it already wrote to the element, so the first
 * (pre-mount, motion) frame used to stay frozen. data-reveal is the CSS net
 * for the server HTML before hydration (globals.css).
 */
export function FocusReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 45%"] });
  const y = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.12, 1]);

  return (
    <motion.div
      ref={ref}
      data-reveal=""
      className={className}
      style={reduced ? { opacity: 1, y: 0 } : { opacity, y }}
    >
      {children}
    </motion.div>
  );
}
