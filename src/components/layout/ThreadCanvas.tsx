"use client";

import { useEffect, useRef, useState } from "react";
import { Brain } from "lucide-react";

// Exactly the "Schedule Brain Experience" button's color — verified against
// --secondary in globals.css (hsl(186 100% 26%) = #007785), not a guessed
// or invented teal.
const RAIL_COLOR = "#007785";
const RAIL_X = 52;

// Just below the Navbar (h-20 = 80px) — any higher and the icon renders
// behind its translucent, blurred glass background and reads as a smudge.
const ICON_TOP = 96;
const ICON_SIZE = 26;

// Rail + icon stay hidden until the brain's own hemisphere-opening/dissection
// sequence is underway, so they don't compete with the Hero's brain reveal.
const VISIBILITY_TRIGGER = 0.6; // × window.innerHeight

/**
 * Fixed left-edge "EEG signal" rail — a glowing teal waveform, anchored to
 * the page's scroll position (not the animation clock) so it reads as a
 * static rail the page slides past rather than a shape wobbling in place.
 * Topped by a real lucide-react Brain icon (a hand-drawn canvas version
 * warped at small sizes; an actual SVG stays crisp at any DPI) the line
 * grows out of — its rendered position is measured via ref so the two never
 * drift apart. A bright node travels along the rail to mark scroll
 * position, and the whole thing stops short of the footer's dark
 * background. Purely decorative/ambient, so it's skipped entirely under
 * prefers-reduced-motion.
 */
export default function ThreadCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Under reduced motion, skip the scroll-driven reveal entirely — the
    // canvas draws nothing anyway (see the effect below), so just leave the
    // (empty) icon+rail shown with no transition to worry about.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * VISIBILITY_TRIGGER);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      t += 0.015;
      const dpr = window.devicePixelRatio || 1;
      const h = canvas.height;
      const scrollY = window.scrollY;
      const railX = RAIL_X * dpr;

      ctx.clearRect(0, 0, canvas.width, h);

      // Line starts right where the real SVG icon (rendered as DOM, not
      // canvas) ends — measured live so the two elements never drift apart.
      const iconRect = iconRef.current?.getBoundingClientRect();
      const lineStartY = (iconRect ? iconRect.bottom + 4 : ICON_TOP + ICON_SIZE) * dpr;

      // Stop the rail before it crosses into the footer's dark background.
      let maxY = h;
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          maxY = Math.max(0, rect.top * dpr);
        }
      }

      if (maxY <= lineStartY) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Follower node: a true scroll-progress indicator, like a scrollbar
      // thumb. It starts right at the icon (scrollY = 0) and travels the
      // full length of the visible rail — from lineStartY down to maxY
      // (the footer boundary) — reaching the very bottom exactly when the
      // user has scrolled to the end of the document.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      const targetNodeY = lineStartY + scrollProgress * (maxY - lineStartY);

      ctx.save();
      ctx.shadowColor = RAIL_COLOR;
      ctx.shadowBlur = 8 * dpr;
      ctx.strokeStyle = RAIL_COLOR;
      ctx.lineWidth = 1.4 * dpr;

      ctx.beginPath();
      let activeNodeX = railX;

      for (let viewportY = lineStartY; viewportY <= maxY; viewportY += 2 * dpr) {
        // Anchor the wave's shape to the page's absolute scroll position
        // (viewportY + scrollY), not to elapsed time — this is what keeps
        // the curve reading as a fixed rail the page slides past, instead
        // of an independent shape wobbling on screen. Only a tiny
        // time-driven micro-flicker is layered on top, for a subtle "live
        // signal" feel without the wobble.
        const pageY = viewportY / dpr + scrollY;
        const freq = pageY / 65;
        const microNoise = Math.sin(pageY / 12 + t * 2) * 0.2;
        const waveX = (Math.sin(freq * 1.2) * 6 + Math.sin(freq * 2.8) * 3 + microNoise) * dpr;
        const x = railX + waveX;

        if (viewportY === lineStartY) ctx.moveTo(x, viewportY);
        else ctx.lineTo(x, viewportY);

        if (Math.abs(viewportY - targetNodeY) < 3 * dpr) {
          activeNodeX = x;
        }
      }
      ctx.stroke();

      if (targetNodeY > lineStartY && targetNodeY < maxY) {
        ctx.beginPath();
        ctx.arc(activeNodeX, targetNodeY, 4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = RAIL_COLOR;
        ctx.shadowBlur = 14 * dpr;
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={iconRef}
        // top-[96px] must stay in sync with ICON_TOP above.
        className="fixed left-[52px] top-[96px] z-40 -translate-x-1/2"
      >
        <Brain width={ICON_SIZE} height={ICON_SIZE} stroke={RAIL_COLOR} strokeWidth={1.75} />
      </div>
      <canvas ref={canvasRef} className="fixed left-0 top-0 z-30 h-full w-full" />
    </div>
  );
}
