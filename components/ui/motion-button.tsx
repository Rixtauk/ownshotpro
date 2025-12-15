"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const motionButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25",
        secondary:
          "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof motionButtonVariants> {
  asChild?: boolean;
  children?: React.ReactNode;
}

const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(motionButtonVariants({ variant, size, className }))}
          ref={ref}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ y: 0, scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className={cn(motionButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
MotionButton.displayName = "MotionButton";

export { MotionButton, motionButtonVariants };
