"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFileSelect: (file: File) => void | Promise<void>;
  disabled?: boolean;
  currentFile?: File | null;
}

export function Dropzone({
  onFileSelect,
  disabled,
  currentFile,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
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
    });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "glass-card glass-card-hover rounded-xl p-8 text-center cursor-pointer transition-all",
        "border-2 border-dashed border-border",
        "hover:border-primary/50",
        isDragActive && "border-primary bg-primary/10 scale-[1.02]",
        isDragReject && "border-destructive bg-destructive/10",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {currentFile ? (
          <>
            <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{currentFile.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Drop a new image to replace
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {isDragActive ? "Drop your image here" : "Drag & drop an image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse (PNG, JPEG, WebP - max 8MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
