"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import { Reveal } from "@/components/home/Reveal";
import { useLazyVideoInView } from "@/components/sections/useLazyVideoInView";

const HEADSET_VIDEO_SRC = "/neroes-headset-assembly.mp4";

export function ProductShowcase() {
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

  return (
    <section className="bg-background py-24 md:py-32" aria-labelledby="product-showcase-heading">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <h2
              id="product-showcase-heading"
              className="font-exo text-4xl font-bold tracking-tight text-foreground md:text-5xl"
            >
              Rendimento Mental Treinável
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              A Neroes transforma software corporativo de biofeedback num jogo:
              um headset EEG lê a tua atividade cerebral em tempo real e
              devolve-a como sinal imediato dentro da experiência — só
              avanças mantendo a calma e o foco. Cada sessão é uma
              repetição de treino mensurável, tal como num ginásio, mas para
              a mente.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div
              ref={videoBoxRef}
              className="relative aspect-video overflow-hidden rounded-2xl bg-muted shadow-sm"
            >
              {/* Fallback shown before the video loads or if it fails to load */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />

              {!hasError && (
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full rounded-2xl object-cover"
                  src={isInView ? HEADSET_VIDEO_SRC : undefined}
                  preload="metadata"
                  autoPlay={isInView}
                  loop
                  muted
                  playsInline
                  onError={() => setHasError(true)}
                >
                  A tua atualização do navegador não suporta vídeo HTML5.
                </video>
              )}

              {!hasError && (
                <span
                  lang="en"
                  className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-widest text-white/80 backdrop-blur-md"
                >
                  Neroes Hardware Architecture
                </span>
              )}

              {!hasError && (
                <button
                  type="button"
                  onClick={openFullscreen}
                  aria-label="Ver vídeo do headset em ecrã inteiro, com som"
                  className="absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white shadow-lg transition-transform hover:scale-105">
                    <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" aria-hidden="true" />
                  </span>
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
