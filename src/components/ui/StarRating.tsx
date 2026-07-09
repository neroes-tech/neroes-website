import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number;
  max?: number;
  className?: string;
}

export function StarRating({ rating = 5, max = 5, className }: StarRatingProps) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of ${max} stars`}
      className={cn("flex items-center gap-1", className)}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-secondary text-secondary" : "fill-none text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
