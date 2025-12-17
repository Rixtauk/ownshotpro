"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StickyFooterProps {
  children: React.ReactNode;
  className?: string;
}

const StickyFooter = React.forwardRef<HTMLDivElement, StickyFooterProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Mobile: Fixed to bottom
          "fixed bottom-0 left-0 right-0 z-40",
          // Desktop: Sticky
          "md:sticky md:bottom-0",
          // Glass effect with blur
          "glass-card border-t",
          // Safe area padding for mobile notches
          "pb-safe",
          // Padding
          "px-4 py-4 md:px-6",
          className
        )}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    );
  }
);

StickyFooter.displayName = "StickyFooter";

export { StickyFooter };
