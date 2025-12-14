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
import { FoodOptionsForm } from "./FoodOptionsForm";
import { OptionCardGroup, OptionCardItem } from "@/components/ui/option-card-group";
import { FoodOptions, TransformMode, TRANSFORM_MODE_LABELS } from "@/types/food";
import { Camera, Crop, Palette, Settings2, ChevronDown } from "lucide-react";

interface OptionsFormProps {
  options: EnhanceOptions;
  onChange: (options: EnhanceOptions) => void;
  productOptions?: ProductOptions;
  onProductOptionsChange?: (options: ProductOptions) => void;
  foodOptions?: FoodOptions;
  onFoodOptionsChange?: (options: FoodOptions) => void;
  disabled?: boolean;
}

export function OptionsForm({
  options,
  onChange,
  productOptions,
  onProductOptionsChange,
  foodOptions,
  onFoodOptionsChange,
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
  const isFood = options.preset === "food";

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
            <CollapsibleContent className="space-y-3 pt-2">
              {/* Transform Mode */}
              <div className="space-y-2">
                <Label className="text-foreground text-sm">Transform Mode</Label>
                <OptionCardGroup
                  items={
                    (Object.entries(TRANSFORM_MODE_LABELS) as [
                      TransformMode,
                      { title: string; description: string }
                    ][]).map(([value, { title, description }]) => ({
                      value,
                      title,
                      description,
                    }))
                  }
                  value={
                    !options.magazineReshoot
                      ? "retouch"
                      : !options.allowStyling
                      ? "reshoot"
                      : "reshoot_styled"
                  }
                  onChange={(value: TransformMode) => {
                    if (value === "retouch") {
                      updateOption("magazineReshoot", false);
                      updateOption("allowStyling", false);
                    } else if (value === "reshoot") {
                      updateOption("magazineReshoot", true);
                      updateOption("allowStyling", false);
                    } else {
                      updateOption("magazineReshoot", true);
                      updateOption("allowStyling", true);
                    }
                  }}
                  disabled={disabled}
                  columns={1}
                  size="md"
                  aria-label="Interior transform mode"
                />
              </div>

              {/* Creative Crop - Show only for reshoot modes */}
              {options.magazineReshoot && (
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
              )}

              {/* Prop Suggestions - Show only for reshoot_styled mode */}
              {options.allowStyling && (
                <div className="space-y-1.5">
                  <Label htmlFor="propSuggestions" className="text-xs text-foreground flex items-center gap-1.5">
                    <Palette className="w-3 h-3" />
                    Prop Suggestions
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

        {/* Food-specific options */}
        {isFood && foodOptions && onFoodOptionsChange && (
          <div className="pt-3 border-t border-border">
            <FoodOptionsForm
              options={foodOptions}
              onChange={onFoodOptionsChange}
              disabled={disabled}
            />
          </div>
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
