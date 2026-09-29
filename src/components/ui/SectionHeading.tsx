import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  /** Rendered as H2 — never use for a page's H1. */
  title: string;
  intro?: ReactNode;
  /** Left by default: centred headings everywhere read as a template. */
  align?: "left" | "center";
  /** "inverted" is for sections on a dark (bg-primary) background. */
  tone?: "default" | "inverted";
  /** id for the H2, so the section can point aria-labelledby at it. */
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "default",
  id,
  className,
}: SectionHeadingProps) {
  const inverted = tone === "inverted";

  return (
    <div className={cn("mb-12 max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Eyebrow tone={inverted ? "inverse" : "brand"} className="mb-4">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={cn(
          "font-exo text-3xl font-bold leading-[1.1] tracking-tight md:text-[2.75rem]",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 text-lg leading-relaxed", inverted ? "text-white/75" : "text-muted-foreground")}>
          {intro}
        </p>
      )}
    </div>
  );
}
