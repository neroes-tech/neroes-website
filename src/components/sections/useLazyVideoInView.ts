"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Defers attaching a real `src`/`autoPlay` to a <video> until its container
 * scrolls near the viewport, so `preload="none"` truly means "don't fetch
 * anything yet" instead of the browser silently prefetching on mount.
 */
export function useLazyVideoInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView, rootMargin]);

  return { ref, isInView };
}
