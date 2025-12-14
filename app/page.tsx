"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "@/components/Dropzone";
import { OptionsForm } from "@/components/OptionsForm";
import { MainCanvas } from "@/components/MainCanvas";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WizardStepIndicator } from "@/components/wizard/WizardStepIndicator";
import { UploadScreen } from "@/components/screens/UploadScreen";
import { ConfigureScreen } from "@/components/screens/ConfigureScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";
import { EnhanceOptions, ProductOptions, DEFAULT_PRODUCT_OPTIONS, FoodOptions, DEFAULT_FOOD_OPTIONS } from "@/types";
import { WizardStep } from "@/types/wizard";
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
  const [wizardStep, setWizardStep] = useState<WizardStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<EnhanceOptions>(DEFAULT_OPTIONS);
  const [productOptions, setProductOptions] = useState<ProductOptions>(DEFAULT_PRODUCT_OPTIONS);
  const [foodOptions, setFoodOptions] = useState<FoodOptions>(DEFAULT_FOOD_OPTIONS);

  // Wizard navigation functions
  const goToUpload = () => {
    setWizardStep('upload');
  };

  const goToConfigure = () => {
    if (file) setWizardStep('configure');
  };

  const goToResults = () => {
    setWizardStep('results');
  };

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
    setEnhancedImage(null); // Clear previous result

    // Navigate to results immediately to show loading state
    goToResults();

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

      // Add food options when in food mode
      if (options.preset === "food") {
        formData.append("foodOptions", JSON.stringify(foodOptions));
      }

      // Add transform mode for interior
      formData.append("transformMode", options.transformMode ?? "reshoot");

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
    : options.preset === "food"
    ? [
        "Food",
        foodOptions.foodBoost !== "off" &&
          (foodOptions.foodBoost === "plating" ? "Plating Polish" :
           foodOptions.foodBoost === "appetising" ? "Appetising" :
           foodOptions.foodBoost === "hero" ? "Hero Restyle" : null),
        foodOptions.shotType.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        foodOptions.styling.addSteam && "Steam",
        foodOptions.styling.addCondensation && "Condensation",
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
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-6">
          <span className="text-lg font-semibold">
            <span className="text-foreground">OwnShot</span>
            <span className="text-primary"> Pro</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground md:block">
              Transform your photos into stock-quality images
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Wizard Step Indicator */}
      <WizardStepIndicator currentStep={wizardStep} />

      {/* Wizard Content */}
      <main className="mx-auto max-w-screen-2xl px-6 py-6">
        {wizardStep === 'upload' && (
          <UploadScreen
            file={file}
            originalPreview={originalPreview}
            onFileSelect={handleFileSelect}
            onContinue={goToConfigure}
            disabled={isLoading}
          />
        )}

        {wizardStep === 'configure' && (
          <ConfigureScreen
            file={file}
            originalPreview={originalPreview}
            options={options}
            onOptionsChange={setOptions}
            productOptions={productOptions}
            onProductOptionsChange={handleProductOptionsChange}
            foodOptions={foodOptions}
            onFoodOptionsChange={setFoodOptions}
            onChangeImage={goToUpload}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        )}

        {wizardStep === 'results' && originalPreview && (
          <ResultsScreen
            originalUrl={originalPreview}
            enhancedUrl={enhancedImage}
            isLoading={isLoading}
            error={error}
            onDownload={handleDownload}
            onStartOver={goToUpload}
            onAdjustSettings={goToConfigure}
            settingsSummary={settingsSummary}
          />
        )}
      </main>
    </div>
  );
}
