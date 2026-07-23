"use client";

import { useState } from "react";

// The real H.264 .mp4 (converted from the earlier undecodable .mov) is
// now in public/ — the timeout-based "silent stall" detection that
// compensated for the old file's dead codec is gone; a standard onError
// (404s, network failures) is enough for a properly-encoded file.
export function BrainExperienceVideo() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-muted p-8 text-center shadow-xl">
        <p className="font-exo font-bold text-foreground">Vídeo indisponível neste navegador</p>
        <p className="text-sm text-muted-foreground">
          Pede-nos uma demonstração ao vivo em{" "}
          <a href="mailto:info@neroes.tech" className="text-secondary hover:underline">
            info@neroes.tech
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <video
      controls
      playsInline
      preload="metadata"
      className="aspect-square w-full rounded-2xl border border-border object-cover shadow-xl"
      onError={() => setHasError(true)}
    >
      <source src="/brain-experience-teaser.mp4" type="video/mp4" />
      O teu navegador não suporta vídeo HTML5.
    </video>
  );
}
