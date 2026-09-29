import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Flat, rectangular actions: colour change on hover, no glow, no scale.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Ink — the default solid action. */
        default: "bg-primary text-primary-foreground hover:bg-secondary",
        /** Brand blue — at most one per view. */
        brand: "bg-secondary text-secondary-foreground hover:bg-primary",
        outline:
          "border border-foreground/25 bg-transparent text-foreground hover:border-foreground hover:bg-foreground/[0.04]",
        ghost: "text-foreground hover:bg-muted",
        /** On dark surfaces (Hero). */
        inverse: "bg-white text-brand-ink hover:bg-white/85 focus-visible:ring-offset-brand-ink",
        outlineInverse:
          "border border-white/35 bg-transparent text-white hover:border-white hover:bg-white/[0.06] focus-visible:ring-offset-brand-ink",
      },
      size: {
        default: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
