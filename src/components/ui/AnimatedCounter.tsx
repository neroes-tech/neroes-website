interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  /** Kept for API compatibility; the value is no longer animated. */
  duration?: number;
}

/**
 * Renders a figure as-is. The count-up animation was removed: a result
 * should be readable the moment it is on screen, not after two seconds.
 */
export function AnimatedCounter({ end, suffix = "", prefix = "" }: CounterProps) {
  return (
    <span className="tabular-nums">
      {prefix}
      {end}
      {suffix}
    </span>
  );
}
