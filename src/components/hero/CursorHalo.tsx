"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * A small circle that follows the pointer with mix-blend-difference,
 * growing while the pointer is over the hero. Position is written directly
 * to the DOM via a ref on every pointermove — no React state, no re-renders.
 */
export function CursorHalo({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const halo = haloRef.current;
    if (!container || !halo) return;

    const handleMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      halo.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      halo.style.opacity = "1";
    };
    const handleEnter = () => {
      halo.style.width = "72px";
      halo.style.height = "72px";
      halo.style.backgroundColor = "rgba(30,91,255,0.1)";
      halo.style.borderColor = "transparent";
    };
    const handleLeave = () => {
      halo.style.opacity = "0";
      halo.style.width = "20px";
      halo.style.height = "20px";
      halo.style.backgroundColor = "transparent";
      halo.style.borderColor = "#1E2233";
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerenter", handleEnter);
    container.addEventListener("pointerleave", handleLeave);
    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerenter", handleEnter);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, [containerRef]);

  return (
    <div
      ref={haloRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 h-5 w-5 rounded-full border border-[#1E2233] opacity-0 mix-blend-difference transition-[width,height,opacity,background-color,border-color] duration-300 ease-out will-change-transform"
    />
  );
}
