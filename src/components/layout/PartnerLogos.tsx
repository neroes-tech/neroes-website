"use client";

import Image from "next/image";

import { PARTNERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The partner logos in one row: greyscale at rest, their real colours on
 * hover or keyboard focus. "inverse" renders them white, for black surfaces.
 * "spread" runs the row edge to edge (first logo on the left edge, last on
 * the right), so it lines up with a column grid above it; on phones it
 * becomes a centred 3 × 2 grid.
 */
export function PartnerLogos({
  tone = "default",
  spread = false,
  className,
}: {
  tone?: "default" | "inverse";
  spread?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        spread
          ? "grid grid-cols-3 place-items-center gap-x-6 gap-y-10 md:flex md:items-center md:justify-between md:gap-x-8"
          : "flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-16",
        className,
      )}
    >
      {PARTNERS.map((partner) => (
        <li key={partner.name} className="flex items-center">
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-block transition-[filter,opacity] duration-300",
              tone === "inverse"
                ? "opacity-70 brightness-0 invert hover:opacity-100 focus-visible:opacity-100"
                : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0",
            )}
          >
            <Image
              src={partner.logo}
              alt={partner.name}
              width={partner.width}
              height={partner.height}
              style={{ height: partner.height, width: "auto" }}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
