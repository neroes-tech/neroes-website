"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { useLazyVideoInView } from "@/components/sections/useLazyVideoInView";

interface ProductVideoProps {
  /** Light, muted ambient loop — what every visitor downloads. */
  src: string;
  /** Full-quality cut with sound, fetched only when asked for. */
  fullSrc?: string;
  poster: string;
  caption: string;
  /** Opens the video full screen, with sound. */
  soundLabel: string;
  pauseLabel: string;
  resumeLabel: string;
  fallback: string;
}

type WebkitVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * Full-bleed product film. The muted loop loads only near the viewport and
 * plays only while on screen; because it moves for longer than 5s it always
 * has a visible pause control (WCAG 2.2.2), and under reduced motion it
 * never starts on its own. "With sound" swaps in the full-quality file,
 * picks up at the same frame and goes full screen; leaving full screen
 * mutes it again.
 */
export function ProductVideo({
  src,
  fullSrc,
  poster,
  caption,
  soundLabel,
  pauseLabel,
  resumeLabel,
  fallback,
}: ProductVideoProps) {
  const { ref: boxRef, isInView } = useLazyVideoInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const reduced = useReducedMotion() ?? false;
  // A pause the visitor chose — scrolling back must not undo it.
  const userPaused = useRef(false);
  const usingFullSrc = useRef(false);

  // Play while on screen, pause when scrolled away (no decoding off screen).
  useEffect(() => {
    const box = boxRef.current;
    const video = videoRef.current;
    if (!isInView || !box || !video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (!entry.isIntersecting) video.pause();
        else if (!reduced && !userPaused.current) {
          void video.play().catch(() => {
            // Autoplay can be blocked; the controls still work.
          });
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [isInView, reduced, boxRef]);

  // Back from full screen: return to the silent loop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mute = () => {
      if (!document.fullscreenElement) video.muted = true;
    };
    const muteWebkit = () => {
      video.muted = true;
    };
    document.addEventListener("fullscreenchange", mute);
    video.addEventListener("webkitendfullscreen", muteWebkit);
    return () => {
      document.removeEventListener("fullscreenchange", mute);
      video.removeEventListener("webkitendfullscreen", muteWebkit);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const openWithSound = () => {
    const video = videoRef.current as WebkitVideo | null;
    if (!video) return;
    if (fullSrc && !usingFullSrc.current) {
      usingFullSrc.current = true;
      const at = video.currentTime;
      video.addEventListener("loadedmetadata", () => (video.currentTime = at), { once: true });
      video.src = fullSrc;
    }
    video.muted = false;
    userPaused.current = false;
    void video.play().catch(() => {});
    // Still inside the click, so the browser grants full screen.
    if (video.requestFullscreen) {
      void video.requestFullscreen().catch(() => {
        // Refused: it keeps playing inline, with sound.
      });
    } else {
      try {
        video.webkitEnterFullscreen?.();
      } catch {
        // Older iOS before metadata: inline playback with sound.
      }
    }
  };

  return (
    <figure>
      <div
        ref={boxRef}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#5b544c] sm:aspect-video lg:max-h-[88svh]"
      >
        {!hasError && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={isInView ? src : undefined}
            poster={poster}
            preload="none"
            loop
            muted
            playsInline
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setHasError(true)}
          >
            {fallback}
          </video>
        )}
        {!hasError && (
          <div className="absolute inset-x-0 bottom-0">
            <div className="container mx-auto flex flex-wrap gap-2 px-4 pb-4 md:px-6 md:pb-6">
              <button
                type="button"
                onClick={togglePlay}
                className="h-10 rounded-md bg-brand-ink/85 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {playing ? pauseLabel : resumeLabel}
              </button>
              <button
                type="button"
                onClick={openWithSound}
                className="h-10 rounded-md bg-white px-4 text-sm font-medium text-brand-ink transition-colors hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {soundLabel}
              </button>
            </div>
          </div>
        )}
      </div>
      <figcaption className="container mx-auto px-4 pt-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground md:px-6">
        {caption}
      </figcaption>
    </figure>
  );
}
