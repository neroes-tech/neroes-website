import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  /** Rendered as H2 — never use for a page's H1. */
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
  /** "inverted" is for sections on a dark (bg-primary) background. */
  tone?: "default" | "inverted";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const inverted = tone === "inverted";

  return (
    <div
      className={cn(
        "mx-auto mb-12",
        align === "center" ? "max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-medium uppercase tracking-widest",
            inverted ? "text-primary-foreground/70" : "text-secondary",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-exo text-3xl font-bold tracking-tight md:text-4xl",
          inverted ? "text-primary-foreground" : "text-primary",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-lg leading-relaxed", inverted ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {intro}
        </p>
      )}
    </div>
  );
}
