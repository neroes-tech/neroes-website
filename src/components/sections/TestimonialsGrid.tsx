"use client";

import { useRef, useState } from "react";

import { Reveal } from "@/components/home/Reveal";
import { useLazyVideoInView } from "@/components/sections/useLazyVideoInView";
import { cn } from "@/lib/utils";

// TODO(assets): real testimonial videos not supplied yet — see chat note.
// Featuring named real people requires the actual clips (and confirmation
// they're authorized for use) before this ships to production.
const CHAMPIONS = [
  { name: "João Crisóstomo", role: "Atleta Olímpico", videoSrc: "/videos/joao-crisostomo.mp4" },
  { name: "George", role: "Executive Innovator", videoSrc: "/videos/george-executive.mp4" },
] as const;

function ChampionCard({ name, role, videoSrc }: (typeof CHAMPIONS)[number]) {
  const { ref: containerRef, isInView } = useLazyVideoInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isUnmuted, setIsUnmuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const showOverlay = !isHovered;

  const activateAudio = () => {
    setIsUnmuted(true);
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      void video.play();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-[9/16] overflow-hidden rounded-xl bg-muted shadow-sm"
    >
      {/* Fallback avatar — shown until the real video is supplied or if it fails to load */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/15">
        <span className="font-exo text-4xl font-bold text-primary/40" aria-hidden="true">
          {name.charAt(0)}
        </span>
      </div>

      {!hasError && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={isInView ? videoSrc : undefined}
          preload="none"
          autoPlay={isInView}
          playsInline
          loop
          muted={!isUnmuted}
          onError={() => setHasError(true)}
        />
      )}

      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        onClick={activateAudio}
        aria-label={`Ouvir o testemunho de ${name}`}
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-5 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
          showOverlay ? "bg-[#1E2233]/40" : "bg-transparent",
        )}
      >
        <span
          className={cn(
            "font-exo text-lg font-bold text-white transition-opacity duration-300",
            showOverlay ? "opacity-100" : "opacity-0",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "text-sm text-white/80 transition-opacity duration-300",
            showOverlay ? "opacity-100" : "opacity-0",
          )}
        >
          {role}
        </span>
      </button>
    </div>
  );
}

export function TestimonialsGrid() {
  return (
    <section
      className="border-t border-border bg-background py-24 md:py-32"
      aria-labelledby="testimonials-grid-heading"
    >
      <div className="container mx-auto px-4 md:px-6">
        <Reveal className="text-center">
          <h2
            id="testimonials-grid-heading"
            className="font-exo text-4xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Apoiado por Campeões
          </h2>
        </Reveal>
        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
          {CHAMPIONS.map((champion, i) => (
            <Reveal key={champion.name} delay={i * 0.1}>
              <ChampionCard {...champion} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
