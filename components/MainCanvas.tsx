"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Upload,
  AlertCircle,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "enhanced" | "compare" | "original";

interface MainCanvasProps {
  originalUrl: string | null;
  enhancedUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  onDownload: () => void;
  canGenerate: boolean;
  settingsSummary: string;
}

export function MainCanvas({
  originalUrl,
  enhancedUrl,
  isLoading,
  error,
  onGenerate,
  onDownload,
  canGenerate,
  settingsSummary,
}: MainCanvasProps) {
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
      if (e.key === "ArrowLeft" && originalUrl) {
        setViewMode("original");
      } else if (e.key === "ArrowRight" && enhancedUrl) {
        setViewMode("enhanced");
      } else if (e.key === " " && enhancedUrl && originalUrl) {
        e.preventDefault();
        setViewMode(viewMode === "compare" ? "enhanced" : "compare");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, enhancedUrl, originalUrl]);

  // Determine which image to show
  const showImage = viewMode === "original" ? originalUrl : (enhancedUrl || originalUrl);

  return (
    <Card className="flex flex-1 flex-col overflow-hidden">
      {/* Canvas header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 p-4">
        {/* View mode toggle */}
        <div className="inline-flex rounded-lg border border-white/30 bg-white/40 p-1">
          <button
            onClick={() => setViewMode("enhanced")}
            disabled={!enhancedUrl}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              viewMode === "enhanced"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
            )}
          >
            Enhanced
          </button>
          <button
            onClick={() => setViewMode("compare")}
            disabled={!enhancedUrl || !originalUrl}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              viewMode === "compare"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
            )}
          >
            Compare
          </button>
          <button
            onClick={() => setViewMode("original")}
            disabled={!originalUrl}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              viewMode === "original"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
            )}
          >
            Original
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {enhancedUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-9 rounded-lg border-white/30 bg-white/40"
            >
              Download
            </Button>
          )}
          <Button
            size="sm"
            onClick={onGenerate}
            disabled={!canGenerate || isLoading}
            className="hidden h-9 rounded-lg md:inline-flex"
          >
            {isLoading ? "Enhancing..." : "Boost"}
          </Button>
        </div>
      </div>

      {/* Canvas body - big preview */}
      <div
        className="relative flex-1 p-4"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Error display */}
        {error && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 shadow-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div
          ref={containerRef}
          className="relative h-full min-h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50"
        >
          {!originalUrl ? (
            // Empty state
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-600">Upload an image to get started</p>
                <p className="text-sm text-gray-500 mt-1">Then click Generate to enhance</p>
              </div>
            </div>
          ) : viewMode === "compare" && enhancedUrl ? (
            // Compare mode with slider
            <div className="relative h-full w-full select-none">
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
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                style={{ left: `${comparePosition}%`, transform: "translateX(-50%)" }}
                onMouseDown={handleMouseDown}
                onTouchMove={handleTouchMove}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <GripVertical className="w-5 h-5 text-gray-600" />
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
            <div className="relative h-full w-full">
              {showImage && (
                <Image
                  src={showImage}
                  alt={viewMode === "original" ? "Original" : "Enhanced"}
                  fill
                  className="object-contain"
                  unoptimized
                />
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

      {/* Canvas footer */}
      <div className="flex items-center justify-between gap-4 border-t border-white/20 p-4">
        <div className="hidden text-xs text-muted-foreground md:block truncate">
          {settingsSummary}
        </div>
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="h-11 w-full rounded-xl md:w-auto md:px-8 font-semibold"
          size="lg"
        >
          {isLoading ? "Enhancing..." : "Boost Your Image"}
        </Button>
      </div>
    </Card>
  );
}
