import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small uppercase label: section name ("A plataforma", never numbered), captions,
 * study methods. Never for running text.
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
        "text-xs font-bold uppercase tracking-[0.14em]",
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
