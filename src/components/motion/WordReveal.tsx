"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";

function Word({ progress, range, reduced, children }: {
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <>
      <motion.span style={reduced ? undefined : { opacity }}>{children}</motion.span>{" "}
    </>
  );
}

/**
 * A long statement read word by word as it scrolls past: each word goes from
 * dim to full white in turn. Plain text for assistive technology (the words
 * are ordinary spans with their spaces); fully lit under reduced motion.
 */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          reduced={reduced}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}
