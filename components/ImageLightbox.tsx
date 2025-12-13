"use client";

import { useCallback, useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageType = "original" | "enhanced";

interface ImageLightboxProps {
  originalUrl: string | null;
  enhancedUrl: string | null;
  initialImage: ImageType | null;
  onClose: () => void;
}

export function ImageLightbox({
  originalUrl,
  enhancedUrl,
  initialImage,
  onClose,
}: ImageLightboxProps) {
  const [currentImage, setCurrentImage] = useState<ImageType>(
    initialImage || "original"
  );

  const isOpen = initialImage !== null;

  // Get available images
  const images: { type: ImageType; url: string; label: string }[] = [];
  if (originalUrl) images.push({ type: "original", url: originalUrl, label: "Original" });
  if (enhancedUrl) images.push({ type: "enhanced", url: enhancedUrl, label: "Enhanced" });

  const currentIndex = images.findIndex((img) => img.type === currentImage);
  const currentImageData = images[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setCurrentImage(images[currentIndex + 1].type);
    }
  }, [currentIndex, images]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentImage(images[currentIndex - 1].type);
    }
  }, [currentIndex, images]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          goToNext();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Sync with initialImage when it changes
  useEffect(() => {
    if (initialImage) {
      setCurrentImage(initialImage);
    }
  }, [initialImage]);

  if (!currentImageData) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation - Previous */}
          {currentIndex > 0 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Navigation - Next */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Image container */}
          <div className="relative max-w-[90vw] max-h-[85vh]">
            <Image
              src={currentImageData.url}
              alt={`${currentImageData.label} image`}
              width={1920}
              height={1080}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              unoptimized
              priority
            />
          </div>

          {/* Image label pills */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {images.map((img) => (
              <button
                key={img.type}
                onClick={() => setCurrentImage(img.type)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  currentImage === img.type
                    ? "bg-white text-gray-900"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                {img.label}
              </button>
            ))}
          </div>

          {/* Keyboard hint */}
          <p className="absolute bottom-6 right-6 text-white/50 text-xs hidden md:block">
            Arrow keys to navigate, ESC to close
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
