import * as React from "react";

import { cn } from "@/lib/utils";

// Soft container: large radius, hairline border, no shadow. Use only when
// content genuinely needs grouping — most sections read better as columns.
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-2xl border border-border bg-card text-card-foreground", className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6", className)} {...props} />,
);
CardContent.displayName = "CardContent";

export { Card, CardContent };
