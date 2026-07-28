"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Segment = "default" | "corporate" | "sports";

interface SegmentContextValue {
  segment: Segment;
  setSegment: (segment: Segment) => void;
}

const SegmentContext = createContext<SegmentContextValue | null>(null);

/** Tracks which brand segment (Corporate/Sports tab on /services) is active, so the Navbar logo can switch with it. Defaults back to "default" whenever nothing sets it (e.g. every other page). */
export function SegmentProvider({ children }: { children: ReactNode }) {
  const [segment, setSegment] = useState<Segment>("default");

  return <SegmentContext.Provider value={{ segment, setSegment }}>{children}</SegmentContext.Provider>;
}

export function useSegment(): SegmentContextValue {
  const ctx = useContext(SegmentContext);
  if (!ctx) throw new Error("useSegment must be used within a SegmentProvider");
  return ctx;
}
