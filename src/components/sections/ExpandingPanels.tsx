"use client";

import { useState } from "react";
import Image from "next/image";

import { Rich } from "@/components/ui/Rich";
import { cn } from "@/lib/utils";

export interface Panel {
  image: string;
  alt: string;
  /** CSS object-position, to keep the subject in frame as the panel narrows. */
  focus?: string;
  title: string;
  /** Supports **bold** (see Rich). */
  body: string;
}

// Share of the row the active panel takes: 1.38 : 1 ≈ 58% / 42%.
const ACTIVE_GROW = 1.38;

/**
 * Two photo panels side by side (desktop). Pointing at one — or reaching it
 * with the keyboard — widens it and brings up its text, while the other
 * narrows; the photos re-crop as they resize. The text of the narrow panel is
 * only hidden visually: screen readers always get both. On phones and small
 * tablets the panels stack, full width, with their text always shown.
 */
export function ExpandingPanels({
  panels,
  showLabel,
  defaultActive = panels.length - 1,
}: {
  panels: Panel[];
  /** Prefix for each panel's keyboard control, e.g. "Mostrar". */
  showLabel: string;
  defaultActive?: number;
}) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className="flex flex-col gap-3 lg:h-[76svh] lg:max-h-[700px] lg:min-h-[560px] lg:flex-row">
      {panels.map((panel, i) => {
        const isActive = active === i;
        return (
          <article
            key={panel.title}
            onMouseEnter={() => setActive(i)}
            style={{ flexGrow: isActive ? ACTIVE_GROW : 1 }}
            className="relative isolate flex min-h-[520px] basis-0 flex-col overflow-hidden rounded-3xl bg-neutral-900 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:min-h-0"
          >
            <Image
              src={panel.image}
              alt={panel.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="-z-10 object-cover"
              style={{ objectPosition: panel.focus ?? "center" }}
            />
            {/* Legibility: dark only where the text sits, so the photo keeps its light. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 via-45% to-transparent"
            />

            {/* Keyboard access to the widening (the whole panel is the target). */}
            <button
              type="button"
              aria-pressed={isActive}
              aria-label={`${showLabel}: ${panel.title}`}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              className="absolute inset-0 z-20 hidden cursor-default rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white lg:block"
            />

            <div className="mt-auto p-7 md:p-9 xl:p-10">
              {/* Wraps with the panel's width: fewer lines when it widens. */}
              <h3 className="font-exo text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-white md:text-6xl xl:text-7xl">
                {panel.title}
              </h3>
              {/* Fixed height on desktop, so both titles sit at the same height. */}
              <div className="mt-6 lg:h-[11.5rem]">
                <p
                  className={cn(
                    "max-w-lg rounded-2xl bg-black/45 p-5 text-base font-light leading-relaxed text-white/90 backdrop-blur-md transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none md:text-lg",
                    isActive ? "lg:translate-y-0 lg:opacity-100 lg:delay-200" : "lg:translate-y-6 lg:opacity-0",
                  )}
                >
                  <Rich text={panel.body} tone="inverse" />
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
