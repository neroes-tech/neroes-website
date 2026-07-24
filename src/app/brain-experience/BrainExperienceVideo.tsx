"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import { useLazyVideoInView } from "@/components/sections/useLazyVideoInView";

const TEASER_VIDEO_SRC = "/brain-experience-teaser.mp4";

// Same container, overlay, badge and custom play-button pattern as
// ProductShowcase's headset video — the client asked for the two video
// cards on the site to be visually identical.
export function BrainExperienceVideo() {
  const { ref: videoBoxRef, isInView } = useLazyVideoInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  // The `autoPlay` attribute isn't reliable once `src` is attached after the
  // element has already mounted (most browsers only honor it at parse time)
  // — calling `.play()` explicitly once the video scrolls into view is.
  useEffect(() => {
    if (!isInView) return;
    void videoRef.current?.play().catch(() => {
      // Autoplay can still be blocked by the browser; the Play button
      // remains available as a manual fallback.
    });
  }, [isInView]);

  const openFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play();
    if (video.requestFullscreen) {
      void video.requestFullscreen().catch(() => {
        // Fullscreen can be blocked (e.g. iOS Safari) — the video still
        // plays inline, unmuted, which is an acceptable fallback.
      });
    }
  };

  if (hasError) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl bg-muted p-8 text-center shadow-sm">
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
    <div ref={videoBoxRef} className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full rounded-2xl object-cover"
        src={isInView ? TEASER_VIDEO_SRC : undefined}
        preload="metadata"
        autoPlay={isInView}
        loop
        muted
        playsInline
        onError={() => setHasError(true)}
      >
        O teu navegador não suporta vídeo HTML5.
      </video>

      <span
        lang="en"
        className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-md"
      >
        Neroes Brain Experience
      </span>

      <button
        type="button"
        onClick={openFullscreen}
        aria-label="Ver vídeo da Brain Experience em ecrã inteiro, com som"
        className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg transition-transform hover:scale-105">
          <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden="true" />
        </span>
      </button>
    </div>
  );
}
