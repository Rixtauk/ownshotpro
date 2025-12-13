"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/Dropzone";
import { OptionsForm } from "@/components/OptionsForm";
import { MainCanvas } from "@/components/MainCanvas";
import { EnhanceOptions, ProductOptions, DEFAULT_PRODUCT_OPTIONS } from "@/types";
import { validateImageFile } from "@/lib/validators";
import { applyProductPreset } from "@/lib/productPresets";
import { compressImage } from "@/lib/imageCompression";

const DEFAULT_OPTIONS: EnhanceOptions = {
  preset: "interior",
  aspectRatio: "match",
  imageSize: "2K",
  strength: 70,
  strictPreservation: true,
  magazineReshoot: true,
  creativeCrop: false,
  allowStyling: false,
  hdrWindows: false,
  propSuggestions: "",
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<EnhanceOptions>(DEFAULT_OPTIONS);
  const [productOptions, setProductOptions] = useState<ProductOptions>(DEFAULT_PRODUCT_OPTIONS);

  // Handle product options change, including preset changes
  const handleProductOptionsChange = useCallback((newOptions: ProductOptions) => {
    // If quick preset changed, apply the preset settings
    if (newOptions.quickPreset !== productOptions.quickPreset && newOptions.quickPreset !== "custom") {
      setProductOptions(applyProductPreset(newOptions.quickPreset));
    } else {
      // Otherwise, mark as custom if any setting was manually changed
      setProductOptions({
        ...newOptions,
        quickPreset: "custom",
      });
    }
  }, [productOptions.quickPreset]);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setError(null);
    setEnhancedImage(null);

    // Compress large images (especially from mobile cameras)
    const processedFile = await compressImage(selectedFile);
    setFile(processedFile);

    const previewUrl = URL.createObjectURL(processedFile);
    setOriginalPreview(previewUrl);
  }, []);

  const handleGenerate = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("preset", options.preset);
      formData.append("aspectRatio", options.aspectRatio);
      formData.append("imageSize", options.imageSize);
      formData.append("strength", options.strength.toString());
      formData.append("strictPreservation", options.strictPreservation.toString());
      formData.append("magazineReshoot", (options.magazineReshoot ?? true).toString());
      formData.append("creativeCrop", (options.creativeCrop ?? false).toString());
      formData.append("allowStyling", (options.allowStyling ?? false).toString());
      formData.append("hdrWindows", (options.hdrWindows ?? false).toString());
      formData.append("propSuggestions", options.propSuggestions ?? "");

      // Add product options when in product mode
      if (options.preset === "product") {
        formData.append("productOptions", JSON.stringify(productOptions));
      }

      const response = await fetch("/api/enhance", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setEnhancedImage(imageUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Enhancement failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = `ownshot-enhanced-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Build settings summary string
  const settingsSummary = options.preset === "product"
    ? [
        "Product",
        productOptions.quickPreset !== "custom"
          ? productOptions.quickPreset.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())
          : "Custom",
        productOptions.shotType.charAt(0).toUpperCase() + productOptions.shotType.slice(1),
        productOptions.labelProtection.enabled && "Label Protected",
      ].filter(Boolean).join(" · ")
    : [
        options.preset.charAt(0).toUpperCase() + options.preset.slice(1),
        options.imageSize,
        options.magazineReshoot && "Reshoot",
        options.creativeCrop && "Creative crop",
        options.allowStyling && "Styling",
        options.hdrWindows && "HDR windows",
      ].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">OwnShot</span>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Pro
            </span>
          </div>
          <div className="hidden text-sm text-muted-foreground md:block">
            Transform your photos into stock-quality images
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[340px_1fr]">
        {/* Left: Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-[calc(100vh-5.5rem)] lg:overflow-auto lg:pr-2 lg:scrollbar-thin">
          {/* Upload */}
          <Dropzone
            onFileSelect={handleFileSelect}
            disabled={isLoading}
            currentFile={file}
          />

          {/* Options */}
          <OptionsForm
            options={options}
            onChange={setOptions}
            productOptions={productOptions}
            onProductOptionsChange={handleProductOptionsChange}
            disabled={isLoading}
          />

          {/* Mobile: sticky generate */}
          <div className="lg:hidden">
            <button
              onClick={handleGenerate}
              disabled={!file || isLoading}
              className="h-12 w-full rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enhancing..." : "Boost Your Image"}
            </button>
          </div>
        </aside>

        {/* Right: Canvas */}
        <section className="flex flex-col gap-4">
          <MainCanvas
            originalUrl={originalPreview}
            enhancedUrl={enhancedImage}
            isLoading={isLoading}
            error={error}
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            canGenerate={!!file}
            settingsSummary={settingsSummary}
          />
        </section>
      </main>
    </div>
  );
}
