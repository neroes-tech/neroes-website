"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

/**
 * A statement that comes into focus as it scrolls into view: blurred and
 * faint when it enters, sharp by the time it reaches the upper half of the
 * screen. Tied to the scroll position (not a timer), so it never replays on
 * its own. The text is always in the DOM — screen readers get it at once —
 * and under reduced motion it is simply shown.
 */
export function BlurReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 45%"] });
  const blur = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.12, 1]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <motion.div ref={ref} className={className} style={reduced ? undefined : { filter, opacity }}>
      {children}
    </motion.div>
  );
}
