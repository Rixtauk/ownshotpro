"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpandableSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ExpandableSection = React.forwardRef<HTMLDivElement, ExpandableSectionProps>(
  ({ title, defaultOpen = false, children, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const contentRef = React.useRef<HTMLDivElement>(null);

    return (
      <div ref={ref} className={cn("border-b border-border", className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between py-4 text-left transition-all",
            "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          )}
        >
          <span className="text-base font-medium">{title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              ref={contentRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: {
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: {
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
              className="overflow-hidden"
            >
              <div className="pb-4">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

ExpandableSection.displayName = "ExpandableSection";

export { ExpandableSection };
