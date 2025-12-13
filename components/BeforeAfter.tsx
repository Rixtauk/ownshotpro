"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, Sparkles, ZoomIn } from "lucide-react";

interface BeforeAfterProps {
  originalUrl: string | null;
  enhancedUrl: string | null;
  onImageClick?: (type: "original" | "enhanced") => void;
  onDownload?: () => void;
}

export function BeforeAfter({
  originalUrl,
  enhancedUrl,
  onImageClick,
  onDownload
}: BeforeAfterProps) {
  if (!originalUrl) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Upload an image to see preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Image */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              Original
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => onImageClick?.("original")}
            >
              <Image
                src={originalUrl}
                alt="Original image"
                width={800}
                height={600}
                className="w-full h-auto max-h-[400px] object-contain"
                unoptimized
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ZoomIn className="w-4 h-4" />
                  Click to expand
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Image */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Enhanced
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden ${enhancedUrl ? 'cursor-pointer group' : ''}`}
              onClick={() => enhancedUrl && onImageClick?.("enhanced")}
            >
              {enhancedUrl ? (
                <>
                  <Image
                    src={enhancedUrl}
                    alt="Enhanced image"
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[400px] object-contain"
                    unoptimized
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <ZoomIn className="w-4 h-4" />
                      Click to expand
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-gray-500 font-medium">Click Generate to enhance</p>
                </div>
              )}
            </div>

            {/* Download button - only shows when enhanced image exists */}
            {enhancedUrl && onDownload && (
              <Button
                variant="outline"
                onClick={onDownload}
                className="w-full h-10 rounded-xl border-2"
              >
                Download Enhanced Image
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
