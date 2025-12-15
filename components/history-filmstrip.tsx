"use client";

import * as React from "react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  src: string;
  label?: string;
  timestamp?: number;
}

interface HistoryFilmstripProps {
  items: HistoryItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function HistoryFilmstrip({
  items,
  activeId,
  onSelect,
  className,
}: HistoryFilmstripProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">History</span>
        <span className="text-xs text-muted-foreground">
          {items.length} {items.length === 1 ? "version" : "versions"}
        </span>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative h-16 w-24 overflow-hidden rounded-lg border-2 bg-muted flex-shrink-0 transition-all",
                item.id === activeId
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-border"
              )}
              title={item.label ?? `Version ${index + 1}`}
            >
              <Image
                src={item.src}
                alt={item.label ?? `Version ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
              {/* Version number badge */}
              <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-xs font-medium">
                {index + 1}
              </div>
              {/* Active indicator */}
              {item.id === activeId && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
