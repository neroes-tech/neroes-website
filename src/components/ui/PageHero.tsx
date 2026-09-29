import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

interface PageHeroProps {
  /** Small monospace label above the title, e.g. "Ciência". */
  eyebrow?: string;
  /** Rendered as the page's single H1 — keep to one PageHero per page. */
  title: string;
  subtitle?: ReactNode;
  /** "decorative" = dark ink surface (kept name for existing call sites). */
  variant?: "default" | "decorative";
  maxWidth?: keyof typeof MAX_WIDTH;
  /** "compact" trims vertical padding for shorter pages (legal, contact). */
  size?: "default" | "compact";
  /** Optional CTA(s) rendered directly under the subtitle. */
  cta?: ReactNode;
  /** Centred, as in version 2 (default); "left" for text-heavy pages. */
  align?: "center" | "left";
  className?: string;
}

/**
 * Page header for inner pages: centred and typographic (the version 2
 * layout), closed by a 1px rule. No background shapes, no entrance animation.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  variant = "default",
  maxWidth = "4xl",
  size = "default",
  cta,
  align = "center",
  className,
}: PageHeroProps) {
  const dark = variant === "decorative";
  const centred = align === "center";

  return (
    <section
      className={cn(
        "border-b",
        size === "compact" ? "pb-12 pt-16 md:pb-14 md:pt-20" : "pb-16 pt-20 md:pb-20 md:pt-28",
        dark ? "border-white/10 bg-brand-ink text-white" : "border-border bg-background",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(MAX_WIDTH[maxWidth], centred && "mx-auto text-center")}>
          {eyebrow && (
            <Eyebrow tone={dark ? "inverse" : "brand"} className="mb-5">
              {eyebrow}
            </Eyebrow>
          )}
          <h1
            className={cn(
              "font-exo text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl",
              dark ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-6 max-w-2xl text-lg leading-relaxed md:text-xl",
                centred && "mx-auto",
                dark ? "text-white/75" : "text-muted-foreground",
              )}
            >
              {subtitle}
            </p>
          )}
          {cta && (
            <div className={cn("mt-9 flex flex-wrap items-center gap-3", centred && "justify-center")}>{cta}</div>
          )}
        </div>
      </div>
    </section>
  );
}
