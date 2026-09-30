import type { ReactNode } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

const MAX_WIDTH = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

interface PageHeroProps {
  /** Small uppercase label above the title, e.g. "Ciência". */
  eyebrow?: string;
  /** Rendered as the page's single H1 — keep to one PageHero per page. */
  title: string;
  subtitle?: ReactNode;
  /** "decorative" = black surface. */
  variant?: "default" | "decorative";
  maxWidth?: keyof typeof MAX_WIDTH;
  /** "compact" trims vertical padding for shorter pages (legal, contact). */
  size?: "default" | "compact";
  /** Optional CTA(s) rendered directly under the subtitle. */
  cta?: ReactNode;
  /** Centred (default); "left" for text-heavy pages. */
  align?: "center" | "left";
  className?: string;
}

/**
 * Page header for inner pages: one large, tightly set statement, centred,
 * with room above for the floating navigation. No shapes, no animation.
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
        size === "compact" ? "pb-14 pt-32 md:pb-16 md:pt-40" : "pb-16 pt-36 md:pb-24 md:pt-48",
        dark ? "bg-black text-white" : "bg-background",
        className,
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn(MAX_WIDTH[maxWidth], centred && "mx-auto text-center")}>
          {eyebrow && (
            <Eyebrow tone={dark ? "inverse" : "brand"} className="mb-6">
              {eyebrow}
            </Eyebrow>
          )}
          <h1
            className={cn(
              "font-exo text-5xl font-medium leading-[0.98] tracking-[-0.04em] md:text-7xl",
              dark ? "text-white" : "text-foreground",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-7 max-w-2xl text-lg font-light leading-relaxed md:text-xl",
                centred && "mx-auto",
                dark ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {subtitle}
            </p>
          )}
          {cta && (
            <div className={cn("mt-10 flex flex-wrap items-center gap-3", centred && "justify-center")}>{cta}</div>
          )}
        </div>
      </div>
    </section>
  );
}
