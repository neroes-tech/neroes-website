"use client";

import { useEffect, useState } from "react";

/**
 * Calendly's booking page embedded inline, as a plain iframe — no Calendly
 * script on our origin. The iframe is only rendered after mount, so
 * `embed_domain` can carry the real host (Calendly's documented inline-embed
 * parameters). Calendly picks the language from the visitor's browser and
 * shows its own cookie notice inside the frame.
 */
export function CalendlyEmbed({ url, title }: { url: string; title: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      const embed = new URL(url);
      embed.searchParams.set("embed_type", "Inline");
      embed.searchParams.set("embed_domain", window.location.hostname);
      setSrc(embed.toString());
    } catch {
      setSrc(null);
    }
  }, [url]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {src ? (
        <iframe src={src} title={title} loading="lazy" className="block h-[1080px] w-full sm:h-[760px]" />
      ) : (
        // Space held while the frame is prepared, so the page doesn't jump.
        <div aria-hidden="true" className="h-[1080px] w-full bg-muted sm:h-[760px]" />
      )}
    </div>
  );
}
