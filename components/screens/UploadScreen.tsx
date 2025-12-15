"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, ImageIcon, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionButton } from "@/components/ui/motion-button";
import { AppContainer } from "@/components/app-container";
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
    <AppContainer className="max-w-3xl py-4 md:py-6">
      <div className="flex flex-col items-center gap-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-title text-foreground">
            Upload Your Image
          </h1>
          <p className="text-sm text-muted-foreground">
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
              <div className="p-6 md:p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground text-base md:text-lg">
                      {isDragActive ? "Drop your image here" : "Drag & drop an image"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>

                  {/* Supported formats row */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileImage className="w-3.5 h-3.5" />
                      <span>PNG, JPEG, WebP</span>
                    </div>
                    <span className="text-muted-foreground/50">·</span>
                    <span className="text-xs text-muted-foreground">Max 8MB</span>
                  </div>
                </div>
              </div>
            ) : (
              // File uploaded - show preview inside the dropzone
              <div className="relative">
                {/* Image preview */}
                <div className="relative w-full aspect-[16/10] bg-muted/50">
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
                <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
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
        <MotionButton
          onClick={onContinue}
          disabled={!file || disabled}
          size="lg"
          className="w-full max-w-md"
        >
          Continue to Settings
        </MotionButton>
      </div>
    </AppContainer>
  );
}
