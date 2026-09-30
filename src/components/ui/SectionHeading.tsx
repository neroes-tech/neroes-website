import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  /** Rendered as H2 — never use for a page's H1. */
  title: string;
  intro?: ReactNode;
  /** Centred by default, like every statement on the site; "left" for split layouts. */
  align?: "left" | "center";
  /** "inverted" is for sections on a black background. */
  tone?: "default" | "inverted";
  /** id for the H2, so the section can point aria-labelledby at it. */
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "default",
  id,
  className,
}: SectionHeadingProps) {
  const inverted = tone === "inverted";
  const centred = align === "center";

  return (
    <div className={cn("mb-14 md:mb-16", centred ? "mx-auto max-w-4xl text-center" : "max-w-3xl", className)}>
      {eyebrow && (
        <Eyebrow tone={inverted ? "inverse" : "brand"} className="mb-5">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={cn(
          "font-exo text-4xl font-medium leading-[1.02] tracking-[-0.035em] md:text-6xl",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-6 text-lg font-light leading-relaxed md:text-xl",
            centred && "mx-auto max-w-2xl",
            inverted ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
