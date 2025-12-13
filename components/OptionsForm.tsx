"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PRESETS, ASPECT_RATIOS, IMAGE_SIZES } from "@/lib/presets";
import {
  EnhanceOptions,
  Preset,
  AspectRatio,
  ImageSize,
  ProductOptions,
} from "@/types";
import { ProductOptionsForm } from "./ProductOptionsForm";
import { Camera, Crop, Sun, Palette, Settings2, ChevronDown } from "lucide-react";

interface OptionsFormProps {
  options: EnhanceOptions;
  onChange: (options: EnhanceOptions) => void;
  productOptions?: ProductOptions;
  onProductOptionsChange?: (options: ProductOptions) => void;
  disabled?: boolean;
}

export function OptionsForm({
  options,
  onChange,
  productOptions,
  onProductOptionsChange,
  disabled
}: OptionsFormProps) {
  const updateOption = <K extends keyof EnhanceOptions>(
    key: K,
    value: EnhanceOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  const isInterior = options.preset === "interior";
  const isProduct = options.preset === "product";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Settings2 className="w-5 h-5" />
          Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Selection */}
        <div className="space-y-1.5">
          <Label htmlFor="preset" className="text-sm font-medium text-foreground">Preset</Label>
          <Select
            value={options.preset}
            onValueChange={(v) => updateOption("preset", v as Preset)}
            disabled={disabled}
          >
            <SelectTrigger id="preset" className="rounded-lg bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PRESETS).map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aspect Ratio & Size - Side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="aspectRatio" className="text-sm font-medium text-foreground">Aspect Ratio</Label>
            <Select
              value={options.aspectRatio}
              onValueChange={(v) => updateOption("aspectRatio", v as AspectRatio)}
              disabled={disabled}
            >
              <SelectTrigger id="aspectRatio" className="rounded-lg bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imageSize" className="text-sm font-medium text-foreground">Output Size</Label>
            <Select
              value={options.imageSize}
              onValueChange={(v) => updateOption("imageSize", v as ImageSize)}
              disabled={disabled}
            >
              <SelectTrigger id="imageSize" className="rounded-lg bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product-specific options */}
        {isProduct && productOptions && onProductOptionsChange && (
          <div className="pt-3 border-t border-border">
            <ProductOptionsForm
              options={productOptions}
              onChange={onProductOptionsChange}
              disabled={disabled}
            />
          </div>
        )}

        {/* Interior-specific options - Collapsible */}
        {isInterior && (
          <Collapsible defaultOpen className="pt-3 border-t border-border">
            <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-semibold text-foreground hover:text-foreground py-1">
              <span className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Interior Enhancement
              </span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              {/* Magazine Reshoot */}
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/60 transition-colors">
                <Checkbox
                  id="magazineReshoot"
                  checked={options.magazineReshoot ?? true}
                  onCheckedChange={(v) => updateOption("magazineReshoot", v === true)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="magazineReshoot" className="text-sm font-medium cursor-pointer text-foreground">
                    Magazine Reshoot
                  </Label>
                  <p className="text-xs text-muted-foreground leading-tight">
                    Better straight-on perspective
                  </p>
                </div>
              </div>

              {/* Creative Crop */}
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/60 transition-colors">
                <Checkbox
                  id="creativeCrop"
                  checked={options.creativeCrop ?? false}
                  onCheckedChange={(v) => updateOption("creativeCrop", v === true)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="creativeCrop" className="text-sm font-medium cursor-pointer text-foreground flex items-center gap-1.5">
                    <Crop className="w-3 h-3" />
                    Creative Crop
                  </Label>
                  <p className="text-xs text-muted-foreground leading-tight">
                    Magazine-style composition
                  </p>
                </div>
              </div>

              {/* HDR Windows */}
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/60 transition-colors">
                <Checkbox
                  id="hdrWindows"
                  checked={options.hdrWindows ?? false}
                  onCheckedChange={(v) => updateOption("hdrWindows", v === true)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="hdrWindows" className="text-sm font-medium cursor-pointer text-foreground flex items-center gap-1.5">
                    <Sun className="w-3 h-3" />
                    HDR Windows
                  </Label>
                  <p className="text-xs text-muted-foreground leading-tight">
                    Recover window detail
                  </p>
                </div>
              </div>

              {/* Allow Styling */}
              <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/60 transition-colors">
                <Checkbox
                  id="allowStyling"
                  checked={options.allowStyling ?? false}
                  onCheckedChange={(v) => updateOption("allowStyling", v === true)}
                  disabled={disabled}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="allowStyling" className="text-sm font-medium cursor-pointer text-foreground flex items-center gap-1.5">
                    <Palette className="w-3 h-3" />
                    Styling Props
                  </Label>
                  <p className="text-xs text-muted-foreground leading-tight">
                    Add decor (flowers, books)
                  </p>
                </div>
              </div>

              {/* Prop Suggestions */}
              {options.allowStyling && (
                <div className="ml-5 space-y-1.5">
                  <Label htmlFor="propSuggestions" className="text-xs text-foreground">
                    Prop suggestions
                  </Label>
                  <Input
                    id="propSuggestions"
                    placeholder="e.g., fresh flowers, books"
                    value={options.propSuggestions ?? ""}
                    onChange={(e) => updateOption("propSuggestions", e.target.value)}
                    disabled={disabled}
                    className="rounded-lg bg-muted/50 h-8 text-sm"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Strength Slider - Hidden for Product (has own controls) */}
        {!isProduct && (
          <div className="space-y-3 pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium text-foreground">Strength</Label>
              <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {options.strength}%
              </span>
            </div>
            <Slider
              value={[options.strength]}
              onValueChange={([v]) => updateOption("strength", v)}
              min={0}
              max={100}
              step={5}
              disabled={disabled}
              className="py-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtle</span>
              <span>Intensive</span>
            </div>
          </div>
        )}

        {/* Strict Preservation - Hidden for Interior and Product */}
        {!isInterior && !isProduct && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="strict" className="text-sm font-medium text-foreground">Strict Preservation</Label>
              <p className="text-xs text-muted-foreground">
                No object changes
              </p>
            </div>
            <Switch
              id="strict"
              checked={options.strictPreservation}
              onCheckedChange={(v) => updateOption("strictPreservation", v)}
              disabled={disabled}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
