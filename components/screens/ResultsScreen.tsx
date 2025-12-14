"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  GripVertical,
  Download,
  Settings,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "enhanced" | "compare" | "original";

interface ResultsScreenProps {
  originalUrl: string;
  enhancedUrl: string | null;
  isLoading: boolean;
  error: string | null;
  settingsSummary: string;
  onStartOver: () => void;
  onAdjustSettings: () => void;
  onDownload: () => void;
}

export function ResultsScreen({
  originalUrl,
  enhancedUrl,
  isLoading,
  error,
  settingsSummary,
  onStartOver,
  onAdjustSettings,
  onDownload,
}: ResultsScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("enhanced");
  const [comparePosition, setComparePosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-switch to enhanced when generation completes
  useEffect(() => {
    if (enhancedUrl && !isLoading) {
      setViewMode("enhanced");
    }
  }, [enhancedUrl, isLoading]);

  // Handle compare slider drag
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      setComparePosition((x / rect.width) * 100);
    },
    [isDragging]
  );

  // Touch support for compare slider
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      setComparePosition((x / rect.width) * 100);
    },
    []
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setViewMode("original");
      } else if (e.key === "ArrowRight" && enhancedUrl) {
        setViewMode("enhanced");
      } else if (e.key === " " && enhancedUrl) {
        e.preventDefault();
        setViewMode(viewMode === "compare" ? "enhanced" : "compare");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, enhancedUrl]);

  // Determine which image to show
  const showImage = viewMode === "original" ? originalUrl : (enhancedUrl || originalUrl);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        {/* Header with view mode toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1">
            <button
              onClick={() => setViewMode("enhanced")}
              disabled={!enhancedUrl}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                viewMode === "enhanced"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
              )}
            >
              Enhanced
            </button>
            <button
              onClick={() => setViewMode("compare")}
              disabled={!enhancedUrl}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                viewMode === "compare"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
              )}
            >
              Compare
            </button>
            <button
              onClick={() => setViewMode("original")}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                viewMode === "original"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Original
            </button>
          </div>
        </div>

        {/* Large image preview area */}
        <div
          className="relative p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Error display */}
          {error && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2 shadow-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-muted"
          >
            {viewMode === "compare" && enhancedUrl ? (
              // Compare mode with slider
              <div className="absolute inset-0 select-none">
                {/* Original image (full) */}
                <div className="absolute inset-0">
                  <Image
                    src={originalUrl}
                    alt="Original"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Enhanced image (clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}
                >
                  <Image
                    src={enhancedUrl}
                    alt="Enhanced"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-background shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${comparePosition}%`, transform: "translateX(-50%)" }}
                  onMouseDown={handleMouseDown}
                  onTouchMove={handleTouchMove}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background shadow-lg flex items-center justify-center">
                    <GripVertical className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium">
                  Original
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium">
                  Enhanced
                </div>
              </div>
            ) : (
              // Single image view
              <div className="absolute inset-0">
                {showImage ? (
                  <Image
                    src={showImage}
                    alt={viewMode === "original" ? "Original" : "Enhanced"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    No image to display
                  </div>
                )}

                {/* Loading overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                    <p className="text-white font-medium">Generating enhancement...</p>
                  </div>
                )}

                {/* View mode indicator */}
                {showImage && !isLoading && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium">
                    {viewMode === "original" ? "Original" : enhancedUrl ? "Enhanced" : "Original"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Settings summary */}
        <div className="border-t border-border px-4 py-3 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center truncate">
            {settingsSummary}
          </p>
        </div>

        {/* Action buttons */}
        <div className="border-t border-border p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="ghost"
              onClick={onStartOver}
              className="flex-1 h-11 rounded-xl"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <Button
              variant="secondary"
              onClick={onAdjustSettings}
              className="flex-1 h-11 rounded-xl"
            >
              <Settings className="w-4 h-4 mr-2" />
              Adjust Settings
            </Button>
            <Button
              onClick={onDownload}
              disabled={!enhancedUrl || isLoading}
              className="flex-1 h-11 rounded-xl font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
