"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OptionCardItem<T extends string> {
  value: T;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface OptionCardGroupProps<T extends string> {
  items: OptionCardItem<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  columns?: 1 | 2 | 3;
  size?: "sm" | "md";
  className?: string;
  "aria-label"?: string;
}

export function OptionCardGroup<T extends string>({
  items,
  value,
  onChange,
  disabled = false,
  columns = 2,
  size = "md",
  className,
  "aria-label": ariaLabel,
}: OptionCardGroupProps<T>) {
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const enabledItems = items.filter((item) => !item.disabled);
    const currentEnabledIndex = enabledItems.findIndex(
      (item) => item.value === items[index].value
    );

    let nextEnabledIndex = currentEnabledIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextEnabledIndex = (currentEnabledIndex + 1) % enabledItems.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextEnabledIndex =
          (currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length;
        break;
      case "Home":
        e.preventDefault();
        nextEnabledIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextEnabledIndex = enabledItems.length - 1;
        break;
      default:
        return;
    }

    const nextItem = enabledItems[nextEnabledIndex];
    const nextIndex = items.findIndex((item) => item.value === nextItem.value);
    setFocusedIndex(nextIndex);
    itemRefs.current[nextIndex]?.focus();
  };

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  }[columns];

  const sizeClasses = {
    sm: "text-xs p-3 min-h-[60px]",
    md: "text-sm p-4 min-h-[80px]",
  }[size];

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("grid gap-2", gridColsClass, className)}
    >
      {items.map((item, index) => {
        const isSelected = value === item.value;
        const isDisabled = disabled || item.disabled;

        return (
          <Button
            key={item.value}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            variant={isSelected ? "default" : "outline"}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(item.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            className={cn(
              "flex flex-col items-start justify-start h-auto whitespace-normal text-left",
              sizeClasses
            )}
          >
            {item.icon && (
              <div className="flex items-center gap-2 mb-1">
                {item.icon}
              </div>
            )}
            <div className="font-semibold">{item.title}</div>
            {item.description && (
              <div className="text-xs font-normal text-muted-foreground mt-1 leading-tight">
                {item.description}
              </div>
            )}
          </Button>
        );
      })}
    </div>
  );
}
