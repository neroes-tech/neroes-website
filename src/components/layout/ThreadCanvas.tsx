"use client";

import { useEffect, useRef } from "react";

// Same brand accent used everywhere else in the design system (Navbar hover,
// Hero headline span, ProductShowcase play button, and — per CLAUDE.md's
// design-system doc — the brain's own synapse nodes in SynapseGraph.ts).
// Matches --color-brand-blue in globals.css.
const RAIL_COLOR = "#1E5BFF";

const HERO_SECTION_SELECTOR = 'section[aria-label="Introdução Neroes — inteligência neural viva"]';

/**
 * Fixed left-edge "EEG signal" rail — a glowing waveform anchored to the
 * page's scroll position (not the animation clock), so it reads as a static
 * rail the page slides past rather than a shape wobbling in place. Invisible
 * during the Hero's brain sequence, fading in only once the user has
 * scrolled past it; a bright node travels along it to mark scroll position,
 * and the whole rail stops short of the footer's dark background. Purely
 * decorative/ambient, so it's skipped entirely under prefers-reduced-motion.
 */
export default function ThreadCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const railX = 52 * dpr;

      ctx.clearRect(0, 0, canvas.width, h);

      // Fade in only after the Hero's brain sequence — the Hero section is
      // 320vh tall (sticky pin for the scroll-driven brain), not one
      // viewport, so its real measured height is used instead of guessing
      // at a fraction of window.innerHeight (which would fade the rail in
      // while the brain animation is still playing).
      const heroEl = document.querySelector<HTMLElement>(HERO_SECTION_SELECTOR);
      const heroHeight = heroEl?.offsetHeight ?? window.innerHeight;
      const fadeStart = Math.max(0, heroHeight - window.innerHeight * 0.5);
      const fadeEnd = heroHeight;

      if (scrollY < fadeStart) {
        animId = requestAnimationFrame(render);
        return;
      }
      const alpha = Math.min(1, (scrollY - fadeStart) / Math.max(1, fadeEnd - fadeStart));

      // Stop the rail before it crosses into the footer's dark background.
      let maxY = h;
      const footer = document.querySelector("footer");
      if (footer) {
        const rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          maxY = Math.max(0, rect.top * dpr);
        }
      }

      // Follower node: drifts gently down the visible rail as scroll
      // progresses through the page, capped at the footer boundary.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      const nodeViewportY = (window.innerHeight * 0.4 + scrollProgress * window.innerHeight * 0.3) * dpr;
      const targetNodeY = Math.min(maxY, nodeViewportY);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = RAIL_COLOR;
      ctx.shadowBlur = 8 * dpr;
      ctx.strokeStyle = RAIL_COLOR;
      ctx.lineWidth = 1.4 * dpr;

      ctx.beginPath();
      let activeNodeX = railX;

      for (let viewportY = 0; viewportY <= maxY; viewportY += 2 * dpr) {
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

        if (viewportY === 0) ctx.moveTo(x, viewportY);
        else ctx.lineTo(x, viewportY);

        if (Math.abs(viewportY - targetNodeY) < 3 * dpr) {
          activeNodeX = x;
        }
      }
      ctx.stroke();

      if (targetNodeY > 0 && targetNodeY < maxY) {
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
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 h-full w-full"
    />
  );
}
