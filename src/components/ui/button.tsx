import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Pill-shaped actions. A colour change on hover — no glow, no scale.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        /** Solid black — the default action on light surfaces. */
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        /** Brand blue — at most one per view. */
        brand: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/[0.05]",
        ghost: "text-foreground hover:bg-foreground/[0.05]",
        /** Solid white — the main action on dark surfaces. */
        inverse: "bg-white text-black hover:bg-white/85 focus-visible:ring-white focus-visible:ring-offset-black",
        /** Translucent — the secondary action on dark surfaces. */
        outlineInverse:
          "border border-white/15 bg-white/10 text-white hover:bg-white/[0.16] focus-visible:ring-white focus-visible:ring-offset-black",
      },
      size: {
        default: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-[0.95rem]",
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
