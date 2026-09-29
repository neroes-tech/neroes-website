import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility with existing call sites; no longer used. */
  delay?: number;
};

/**
 * Plain wrapper. Sections used to fade-and-slide in on scroll; that motion
 * carried no information and made every section feel like a template, so
 * content now simply renders in place.
 */
export function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>;
}
