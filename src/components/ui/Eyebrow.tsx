import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Instrument-style label: section index ("02 — Plataforma"), study
 * methodology, data captions. Monospace, small, tracked — never for
 * running text.
 */
export function Eyebrow({
  children,
  tone = "brand",
  className,
  as: Tag = "p",
}: {
  children: ReactNode;
  tone?: "brand" | "muted" | "inverse";
  className?: string;
  as?: "p" | "span" | "div";
}) {
  return (
    <Tag
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.16em]",
        tone === "brand" && "text-secondary",
        tone === "muted" && "text-muted-foreground",
        tone === "inverse" && "text-white/60",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
