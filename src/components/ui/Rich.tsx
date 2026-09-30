import { Fragment } from "react";

import { cn } from "@/lib/utils";

/**
 * Renders translation strings that mark emphasis with **double asterisks**
 * (the source copy leans on inline bold), without pulling in a Markdown
 * parser. Anything else is plain text. "inverse" is for black surfaces.
 */
export function Rich({
  text,
  tone = "default",
  strongClassName,
}: {
  text: string;
  tone?: "default" | "inverse";
  strongClassName?: string;
}) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className={cn("font-bold", tone === "inverse" ? "text-white" : "text-foreground", strongClassName)}
          >
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
