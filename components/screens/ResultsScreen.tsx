"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";
import { Card } from "@/components/ui/card";
import { AppContainer } from "@/components/app-container";
import { BeforeAfter } from "@/components/before-after";
import { ZoomPreviewDialog } from "@/components/zoom-preview-dialog";
import { HistoryFilmstrip, HistoryItem } from "@/components/history-filmstrip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Loader2,
  AlertCircle,
  Download,
  Settings,
  RotateCcw,
  ChevronDown,
  ZoomIn,
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
  onDownload: (format?: "png" | "jpg" | "webp") => void;
  history?: HistoryItem[];
  activeHistoryId?: string;
  onHistorySelect?: (id: string) => void;
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
  history = [],
  activeHistoryId,
  onHistorySelect,
}: ResultsScreenProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("enhanced");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomSrc, setZoomSrc] = useState("");
  const [zoomTitle, setZoomTitle] = useState("");

  // Auto-switch to enhanced when generation completes
  useEffect(() => {
    if (enhancedUrl && !isLoading) {
      setViewMode("enhanced");
    }
  }, [enhancedUrl, isLoading]);

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

  const openZoom = (src: string, title: string) => {
    setZoomSrc(src);
    setZoomTitle(title);
    setZoomOpen(true);
  };

  return (
    <AppContainer className="max-w-5xl py-8">
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

          {/* Zoom button */}
          {showImage && !isLoading && viewMode !== "compare" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openZoom(showImage, viewMode === "original" ? "Original" : "Enhanced")}
            >
              <ZoomIn className="w-4 h-4 mr-1" />
              Zoom
            </Button>
          )}
        </div>

        {/* Image preview area */}
        <div className="relative p-4">
          {/* Error display */}
          {error && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-2 shadow-lg">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-muted">
            {viewMode === "compare" && enhancedUrl ? (
              // Compare mode with react-compare-slider
              <BeforeAfter
                beforeSrc={originalUrl}
                afterSrc={enhancedUrl}
                className="absolute inset-0"
              />
            ) : (
              // Single image view
              <div className="absolute inset-0">
                {showImage ? (
                  <Image
                    src={showImage}
                    alt={viewMode === "original" ? "Original" : "Enhanced"}
                    fill
                    className="object-contain cursor-pointer"
                    unoptimized
                    onClick={() => openZoom(showImage, viewMode === "original" ? "Original" : "Enhanced")}
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

        {/* History filmstrip */}
        {history.length > 0 && onHistorySelect && (
          <div className="px-4 pb-4">
            <HistoryFilmstrip
              items={history}
              activeId={activeHistoryId}
              onSelect={onHistorySelect}
            />
          </div>
        )}

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

            {/* Download with format dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MotionButton
                  disabled={!enhancedUrl || isLoading}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                  <ChevronDown className="w-4 h-4 ml-1" />
                </MotionButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onDownload("png")}>
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload("jpg")}>
                  Download as JPG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload("webp")}>
                  Download as WebP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Zoom Dialog */}
      <ZoomPreviewDialog
        open={zoomOpen}
        onOpenChange={setZoomOpen}
        src={zoomSrc}
        title={zoomTitle}
      />
    </AppContainer>
  );
}
