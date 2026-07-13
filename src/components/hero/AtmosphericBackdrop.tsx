"use client";

import { motion } from "framer-motion";

/**
 * ── CAMADA 1 · BACKDROP ATMOSFÉRICO ─────────────────────────────────────
 * A living radial wash (center #FAFAF7, edges haloed in brand-blue at ~6%)
 * breathing at ~0.08Hz, plus a radial vignette darkening the frame edges.
 * Sits behind the WebGL canvas (z-0) — the brief's isometric vector grid is
 * instead realized as real geometry rotating in 3D space inside BrainHero
 * itself (a better fit for a WebGL scene than a flat SVG overlay would be).
 * Uses framer-motion — already a project dependency, not a new one.
 */
export function AtmosphericBackdrop({ reduced }: { reduced: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {reduced ? (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, #FAFAF7 0%, rgba(30,91,255,0.05) 100%)",
          }}
        />
      ) : (
        <motion.div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, #FAFAF7 0%, rgba(30,91,255,0.06) 100%)" }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 1 / 0.08, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Radial vignette — darkens the frame edges for a cinematic frame */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 45%, rgba(30,34,51,0.16) 100%)",
        }}
      />
    </div>
  );
}
