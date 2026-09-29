"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * prefers-reduced-motion that is safe to branch markup on. framer-motion's
 * useReducedMotion reads the media query during the first client render, but
 * the server can't know it — so a component whose markup depends on it (the
 * Hero's pinned height, its scroll-only elements) failed hydration for every
 * reduced-motion visitor and React threw the server HTML away. This reports
 * false until mounted, then the real preference (and follows changes).
 */
export function useReducedMotionSafe(): boolean {
  const prefers = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!prefers;
}
