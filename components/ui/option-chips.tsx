"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ChipOption {
  value: string;
  label: string;
}

export interface OptionChipsProps {
  options: ChipOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

const OptionChips = React.forwardRef<HTMLDivElement, OptionChipsProps>(
  ({ options, value, onChange, multiple = false, className }, ref) => {
    const isSelected = React.useCallback(
      (optionValue: string) => {
        if (multiple && Array.isArray(value)) {
          return value.includes(optionValue);
        }
        return value === optionValue;
      },
      [value, multiple]
    );

    const handleSelect = React.useCallback(
      (optionValue: string) => {
        if (multiple && Array.isArray(value)) {
          // Multi-select: toggle
          if (value.includes(optionValue)) {
            onChange(value.filter((v) => v !== optionValue));
          } else {
            onChange([...value, optionValue]);
          }
        } else {
          // Single select
          onChange(optionValue);
        }
      },
      [value, onChange, multiple]
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-2",
          className
        )}
      >
        {options.map((option) => {
          const selected = isSelected(option.value);

          return (
            <motion.button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1 }}
              className={cn(
                "relative inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all min-h-[44px] min-w-[44px]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {selected && (
                <motion.div
                  layoutId={multiple ? undefined : "chip-selected"}
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }
);

OptionChips.displayName = "OptionChips";

export { OptionChips };
