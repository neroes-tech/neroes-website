import type { Metadata } from "next";
import type { ReactNode } from "react";

// Legacy English pages kept reachable for existing links but out of search
// results: their statistics predate the Home's evidence section. Remove this
// once the pages are updated (or redirect them if the team retires them).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function SportLayout({ children }: { children: ReactNode }) {
  return children;
}
