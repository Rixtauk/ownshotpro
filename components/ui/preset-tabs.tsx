"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface PresetTab {
  id: string;
  label: string;
  icon?: LucideIcon;
}

export interface PresetTabsProps {
  items: PresetTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

const PresetTabs = React.forwardRef<HTMLDivElement, PresetTabsProps>(
  ({ items, activeId, onChange, className }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll active tab into view
    React.useEffect(() => {
      const activeElement = scrollRef.current?.querySelector(
        `[data-tab-id="${activeId}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, [activeId]);

    return (
      <div
        ref={ref}
        className={cn("relative w-full overflow-hidden", className)}
      >
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 md:justify-center"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item) => {
            const isActive = item.id === activeId;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                data-tab-id={item.id}
                onClick={() => onChange(item.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[44px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="preset-tab-indicator"
                    className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                {Icon && (
                  <Icon className="relative z-10 h-4 w-4 shrink-0" />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

PresetTabs.displayName = "PresetTabs";

export { PresetTabs };
