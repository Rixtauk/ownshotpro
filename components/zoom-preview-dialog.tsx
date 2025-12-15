"use client";

import * as React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ZoomPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  src: string;
  title?: string;
}

export function ZoomPreviewDialog({
  open,
  onOpenChange,
  src,
  title = "Preview",
}: ZoomPreviewDialogProps) {
  const [zoom, setZoom] = React.useState(100);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Reset zoom and position when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setZoom(100);
      setPosition({ x: 0, y: 0 });
    }
  }, [open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 100) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 100) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Limit panning based on zoom level
    const maxOffset = ((zoom - 100) / 100) * 150;
    setPosition({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 space-y-4">
          {/* Image container */}
          <div
            ref={containerRef}
            className="relative h-[60vh] w-full overflow-hidden rounded-xl border bg-muted cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
              style={{
                transform: `scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
              }}
            >
              <Image
                src={src}
                alt={title}
                fill
                className="object-contain select-none"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
                draggable={false}
              />
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.max(100, zoom - 20))}
              disabled={zoom <= 100}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <div className="flex-1 flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12">Zoom</span>
              <Slider
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                min={100}
                max={220}
                step={5}
                className="flex-1"
              />
              <span className="text-sm tabular-nums w-12 text-right">
                {zoom}%
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setZoom(Math.min(220, zoom + 20))}
              disabled={zoom >= 220}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={zoom === 100 && position.x === 0 && position.y === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
