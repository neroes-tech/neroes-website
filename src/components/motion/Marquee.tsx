"use client";

import { useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";

import { useReducedMotionSafe } from "@/lib/useReducedMotionSafe";
import { cn } from "@/lib/utils";

/**
 * Endless horizontal strip. The items render twice (the copy is hidden from
 * assistive technology) and the track slides by half its width, so the loop
 * is seamless. It moves for longer than 5 seconds, so it has a visible pause
 * control under it (WCAG 2.2.2); pointing at the strip, or focusing inside
 * it, also holds it still, to read. Under reduced motion nothing moves: the
 * items wrap into a grid.
 */
export function Marquee({
  items,
  pauseLabel,
  playLabel,
  durationSeconds = 70,
  className,
}: {
  items: ReactNode[];
  pauseLabel: string;
  playLabel: string;
  durationSeconds?: number;
  className?: string;
}) {
  const reduced = useReducedMotionSafe();
  const [paused, setPaused] = useState(false);

  if (reduced) {
    return (
      <ul className={cn("container mx-auto flex flex-wrap justify-center gap-4 px-4 md:px-6", className)}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className={className}>
      <div className="group overflow-hidden">
        <div
          className={cn(
            "flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            paused && "[animation-play-state:paused]",
          )}
          style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
        >
          {/* Each copy carries its trailing gap (pr-4), so sliding by exactly
              half the track lands the second copy where the first began. */}
          <ul className="flex gap-4 pr-4">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <ul className="flex gap-4 pr-4" aria-hidden="true">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-6 flex justify-end px-4 md:px-6">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? playLabel : pauseLabel}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition-colors hover:bg-foreground/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
