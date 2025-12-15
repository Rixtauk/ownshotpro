"use client";

import * as React from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

function CustomHandle() {
  return (
    <ReactCompareSliderHandle
      buttonStyle={{
        display: "none",
      }}
      linesStyle={{
        width: 2,
        background: "hsl(var(--background))",
        boxShadow: "0 0 12px rgba(0,0,0,0.3)",
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background shadow-lg flex items-center justify-center border border-border">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
    </ReactCompareSliderHandle>
  );
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  className,
  beforeLabel = "Original",
  afterLabel = "Enhanced",
}: BeforeAfterProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-card", className)}>
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeSrc}
            alt={beforeLabel}
            style={{ objectFit: "contain" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterSrc}
            alt={afterLabel}
            style={{ objectFit: "contain" }}
          />
        }
        handle={<CustomHandle />}
        className="w-full h-full"
        style={{ aspectRatio: "4/3" }}
      />

      {/* Labels */}
      <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium pointer-events-none">
        {afterLabel}
      </div>
    </div>
  );
}
