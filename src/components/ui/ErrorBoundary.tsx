"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Rendered instead of the children once they have thrown. */
  fallback?: ReactNode;
  /** Short name for the console message, e.g. "BrainHero". */
  label?: string;
}

interface ErrorBoundaryState {
  failed: boolean;
}

/**
 * Keeps an optional, self-contained piece of UI (the WebGL brain, a video)
 * from taking the whole page down with it: if it throws while rendering or
 * in an effect, the fallback shows instead and the rest of the page stays
 * usable. Errors are still reported in the console.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label ?? "ErrorBoundary"}]`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
