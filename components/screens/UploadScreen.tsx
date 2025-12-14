"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadScreenProps {
  file: File | null;
  originalPreview: string | null;
  onFileSelect: (file: File) => void;
  onContinue: () => void;
  disabled?: boolean;
}

export function UploadScreen({
  file,
  originalPreview,
  onFileSelect,
  onContinue,
  disabled = false,
}: UploadScreenProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } =
    useDropzone({
      onDrop,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
      },
      maxFiles: 1,
      maxSize: 8 * 1024 * 1024, // 8MB
      disabled,
      noClick: !!file, // Disable click when file is uploaded
    });

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center gap-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Upload Your Image
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Choose an image to enhance with AI-powered transformation
          </p>
        </div>

        {/* Dropzone / Preview Area */}
        <div className="w-full">
          <div
            {...getRootProps()}
            className={cn(
              "glass-card rounded-xl overflow-hidden transition-all",
              "border-2 border-dashed border-border",
              !file && "glass-card-hover cursor-pointer hover:border-primary/50",
              isDragActive && "border-primary bg-primary/10 scale-[1.01]",
              isDragReject && "border-destructive bg-destructive/10",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input {...getInputProps()} />

            {!file ? (
              // Empty state - show upload prompt
              <div className="p-8 md:p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-base md:text-lg">
                      {isDragActive ? "Drop your image here" : "Drag & drop an image"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPEG, WebP - max 8MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // File uploaded - show preview inside the dropzone
              <div className="relative">
                {/* Image preview */}
                <div className="relative w-full aspect-[4/3] bg-muted/50">
                  {originalPreview && (
                    <Image
                      src={originalPreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  )}
                </div>

                {/* File info bar */}
                <div className="p-3 border-t border-border bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        open();
                      }}
                      className="shrink-0 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                </div>

                {/* Drag overlay when dragging new file */}
                {isDragActive && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-primary mx-auto mb-2" />
                      <p className="font-semibold text-foreground">Drop to replace</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Continue button */}
        <Button
          onClick={onContinue}
          disabled={!file || disabled}
          size="lg"
          className="w-full h-12 rounded-xl font-semibold text-base"
        >
          Continue to Settings
        </Button>
      </div>
    </div>
  );
}
