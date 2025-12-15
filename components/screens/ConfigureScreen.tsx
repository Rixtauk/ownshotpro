"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileImage,
  Settings2,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Crop,
  Palette,
  Sun,
  ChevronDown,
  Flame,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OptionCardGroup, OptionCardItem } from "@/components/ui/option-card-group";
import { PRESETS, ASPECT_RATIOS, IMAGE_SIZES } from "@/lib/presets";
import {
  EnhanceOptions,
  Preset,
  AspectRatio,
  ImageSize,
  ProductOptions,
} from "@/types";
import {
  FoodOptions,
  TransformMode,
  FoodShotType,
  FoodLighting,
  FoodSurface,
  FoodBoost,
  TRANSFORM_MODE_LABELS,
  FOOD_SHOT_TYPE_LABELS,
  FOOD_LIGHTING_LABELS,
  FOOD_SURFACE_LABELS,
  FOOD_BOOST_LABELS,
} from "@/types/food";
import {
  ProductPresetType,
  ProductShotType,
  BackgroundStyle,
  CameraAngle,
  Composition,
  LightingStyle,
  ShadowType,
  SurfaceType,
  ClothType,
  ReflectionType,
  LifestyleScene,
  QUICK_PRESET_LABELS,
  SHOT_TYPE_LABELS,
  BACKGROUND_STYLE_LABELS,
  CAMERA_ANGLE_LABELS,
  COMPOSITION_LABELS,
  LIGHTING_STYLE_LABELS,
  SHADOW_TYPE_LABELS,
  SURFACE_TYPE_LABELS,
  CLOTH_TYPE_LABELS,
  REFLECTION_TYPE_LABELS,
  LIFESTYLE_SCENE_LABELS,
} from "@/types/product";
import { cn } from "@/lib/utils";

interface ConfigureScreenProps {
  file: File | null;
  originalPreview: string | null;
  options: EnhanceOptions;
  onOptionsChange: (options: EnhanceOptions) => void;
  productOptions: ProductOptions;
  onProductOptionsChange: (options: ProductOptions) => void;
  foodOptions: FoodOptions;
  onFoodOptionsChange: (options: FoodOptions) => void;
  onChangeImage: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

// Reusable card wrapper component
function ConfigCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {Icon && <Icon className="w-4 h-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

export function ConfigureScreen({
  file,
  originalPreview,
  options,
  onOptionsChange,
  productOptions,
  onProductOptionsChange,
  foodOptions,
  onFoodOptionsChange,
  onChangeImage,
  onGenerate,
  isLoading,
}: ConfigureScreenProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [stylingOpen, setStylingOpen] = useState(false);

  const updateOption = <K extends keyof EnhanceOptions>(
    key: K,
    value: EnhanceOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  // Helper to update nested product options
  type ProductNestedKeys = "background" | "surface" | "camera" | "lighting" | "labelProtection" | "cleanup";
  const updateProductNested = <K extends ProductNestedKeys>(
    key: K,
    value: Partial<ProductOptions[K]>
  ) => {
    onProductOptionsChange({
      ...productOptions,
      [key]: { ...productOptions[key], ...value },
    } as ProductOptions);
  };

  // Helper to update nested food options
  const updateFoodNested = <K extends "finish" | "styling">(
    key: K,
    value: Partial<FoodOptions[K]>
  ) => {
    onFoodOptionsChange({
      ...foodOptions,
      [key]: { ...foodOptions[key], ...value },
    } as FoodOptions);
  };

  const isInterior = options.preset === "interior";
  const isProduct = options.preset === "product";
  const isFood = options.preset === "food";

  // Transform mode items
  const transformModeItems: OptionCardItem<TransformMode>[] = (
    Object.entries(TRANSFORM_MODE_LABELS) as [
      TransformMode,
      { title: string; description: string }
    ][]
  ).map(([value, { title, description }]) => ({
    value,
    title,
    description,
  }));

  // Food boost items
  const foodBoostItems: OptionCardItem<FoodBoost>[] = (
    Object.entries(FOOD_BOOST_LABELS) as [
      FoodBoost,
      { title: string; description: string }
    ][]
  ).map(([value, { title, description }]) => ({
    value,
    title,
    description,
  }));

  // Shot type items for food
  const foodShotTypeItems: OptionCardItem<FoodShotType>[] = (
    Object.entries(FOOD_SHOT_TYPE_LABELS) as [FoodShotType, string][]
  ).map(([value, label]) => ({
    value,
    title: label,
  }));

  // Lighting items for food
  const foodLightingItems: OptionCardItem<FoodLighting>[] = (
    Object.entries(FOOD_LIGHTING_LABELS) as [FoodLighting, string][]
  ).map(([value, label]) => ({
    value,
    title: label,
  }));

  // Get current interior transform mode
  const getInteriorTransformMode = (): TransformMode => {
    if (!options.magazineReshoot) return "retouch";
    if (!options.allowStyling) return "reshoot";
    return "reshoot_styled";
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Image Preview */}
        <aside className="hidden lg:block lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-4">
            {file && originalPreview && (
              <Card className="glass-card overflow-hidden">
                <div className="relative w-full aspect-square bg-muted">
                  <Image
                    src={originalPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <FileImage className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={onChangeImage}
                    disabled={isLoading}
                    className="w-full"
                    size="sm"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </aside>

        {/* Main Content - Configuration Cards */}
        <main className="flex-1 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Configure Enhancement
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Customize your image transformation settings
            </p>
          </div>

          {/* Two-column card grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Card 1: Category Selection */}
            <ConfigCard title="Category" icon={Settings2}>
              <div className="space-y-1.5">
                <Label htmlFor="preset" className="text-sm font-medium text-foreground">
                  Preset
                </Label>
                <Select
                  value={options.preset}
                  onValueChange={(v) => updateOption("preset", v as Preset)}
                  disabled={isLoading}
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
            </ConfigCard>

            {/* Card 2: Output Settings */}
            <ConfigCard title="Output Settings" icon={ImageIcon}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="aspectRatio" className="text-sm font-medium text-foreground">
                    Aspect Ratio
                  </Label>
                  <Select
                    value={options.aspectRatio}
                    onValueChange={(v) => updateOption("aspectRatio", v as AspectRatio)}
                    disabled={isLoading}
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
                  <Label htmlFor="imageSize" className="text-sm font-medium text-foreground">
                    Output Size
                  </Label>
                  <Select
                    value={options.imageSize}
                    onValueChange={(v) => updateOption("imageSize", v as ImageSize)}
                    disabled={isLoading}
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
            </ConfigCard>

            {/* ===== INTERIOR OPTIONS ===== */}
            {isInterior && (
              <>
                <ConfigCard title="Transform Options" icon={Camera}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Mode</Label>
                      <OptionCardGroup
                        items={transformModeItems}
                        value={getInteriorTransformMode()}
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
                        disabled={isLoading}
                        columns={1}
                        size="sm"
                        aria-label="Interior transform mode"
                      />
                    </div>

                    {options.magazineReshoot && (
                      <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50">
                        <Checkbox
                          id="creativeCrop"
                          checked={options.creativeCrop ?? false}
                          onCheckedChange={(v) => updateOption("creativeCrop", v === true)}
                          disabled={isLoading}
                          className="mt-0.5"
                        />
                        <div>
                          <Label
                            htmlFor="creativeCrop"
                            className="text-sm font-medium cursor-pointer text-foreground flex items-center gap-1.5"
                          >
                            <Crop className="w-3 h-3" />
                            Creative Crop
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Magazine-style composition
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/50">
                      <Checkbox
                        id="hdrWindows"
                        checked={options.hdrWindows ?? false}
                        onCheckedChange={(v) => updateOption("hdrWindows", v === true)}
                        disabled={isLoading}
                        className="mt-0.5"
                      />
                      <div>
                        <Label
                          htmlFor="hdrWindows"
                          className="text-sm font-medium cursor-pointer text-foreground flex items-center gap-1.5"
                        >
                          <Sun className="w-3 h-3" />
                          HDR Windows
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Balance window light exposure
                        </p>
                      </div>
                    </div>

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
                          disabled={isLoading}
                          className="rounded-lg bg-muted/50 h-8 text-sm"
                        />
                      </div>
                    )}
                  </div>
                </ConfigCard>

                <ConfigCard title="Enhancement" icon={Sparkles}>
                  <div className="space-y-3">
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
                      disabled={isLoading}
                      className="py-1"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtle</span>
                      <span>Intensive</span>
                    </div>
                  </div>
                </ConfigCard>
              </>
            )}

            {/* ===== FOOD OPTIONS ===== */}
            {isFood && (
              <>
                {/* Food Transform Mode & Dish Polish */}
                <ConfigCard title="Food Transform" icon={Camera}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Mode</Label>
                      <OptionCardGroup
                        items={transformModeItems}
                        value={foodOptions.transformMode}
                        onChange={(value: TransformMode) =>
                          onFoodOptionsChange({ ...foodOptions, transformMode: value })
                        }
                        disabled={isLoading}
                        columns={1}
                        size="sm"
                        aria-label="Food transform mode"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-foreground text-sm">Dish Polish</Label>
                        <span className="text-xs text-muted-foreground">(food styling)</span>
                      </div>
                      <OptionCardGroup
                        items={foodBoostItems}
                        value={foodOptions.foodBoost}
                        onChange={(value: FoodBoost) =>
                          onFoodOptionsChange({ ...foodOptions, foodBoost: value })
                        }
                        disabled={isLoading}
                        columns={2}
                        size="sm"
                        aria-label="Dish polish level"
                      />
                    </div>
                  </div>
                </ConfigCard>

                {/* Shot Type & Lighting */}
                <ConfigCard title="Shot & Lighting" icon={Camera}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Shot Type</Label>
                      <OptionCardGroup
                        items={foodShotTypeItems}
                        value={foodOptions.shotType}
                        onChange={(value: FoodShotType) =>
                          onFoodOptionsChange({ ...foodOptions, shotType: value })
                        }
                        disabled={isLoading}
                        columns={2}
                        size="sm"
                        aria-label="Shot type"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Lighting</Label>
                      <OptionCardGroup
                        items={foodLightingItems}
                        value={foodOptions.lighting}
                        onChange={(value: FoodLighting) =>
                          onFoodOptionsChange({ ...foodOptions, lighting: value })
                        }
                        disabled={isLoading}
                        columns={2}
                        size="sm"
                        aria-label="Lighting style"
                      />
                    </div>
                  </div>
                </ConfigCard>

                {/* Enhancement Strength */}
                <ConfigCard title="Enhancement" icon={Sparkles}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Strength</Label>
                      <span className="text-xs text-muted-foreground">{foodOptions.strength}%</span>
                    </div>
                    <Slider
                      value={[foodOptions.strength]}
                      onValueChange={([value]) =>
                        onFoodOptionsChange({ ...foodOptions, strength: value })
                      }
                      min={0}
                      max={100}
                      step={5}
                      disabled={isLoading}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>Subtle</span>
                      <span>Maximum</span>
                    </div>
                  </div>
                </ConfigCard>

                {/* Surface & Hints */}
                <ConfigCard title="Surface & Hints" icon={Palette}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Surface</Label>
                      <Select
                        value={foodOptions.surface}
                        onValueChange={(value: FoodSurface) =>
                          onFoodOptionsChange({ ...foodOptions, surface: value })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="rounded-lg bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(FOOD_SURFACE_LABELS) as [FoodSurface, string][]).map(
                            ([surface, label]) => (
                              <SelectItem key={surface} value={surface}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-foreground">Dish Hint (optional)</Label>
                      <Input
                        placeholder="e.g., burger and fries, ramen, cocktail"
                        value={foodOptions.dishHint ?? ""}
                        onChange={(e) =>
                          onFoodOptionsChange({ ...foodOptions, dishHint: e.target.value })
                        }
                        disabled={isLoading}
                        className="rounded-lg bg-muted/50"
                      />
                    </div>

                    {foodOptions.transformMode === "reshoot_styled" && (
                      <div className="space-y-2">
                        <Label className="text-sm text-foreground">Prop Suggestions (optional)</Label>
                        <Input
                          placeholder="e.g., fresh herbs, linen napkin"
                          value={foodOptions.propSuggestions ?? ""}
                          onChange={(e) =>
                            onFoodOptionsChange({ ...foodOptions, propSuggestions: e.target.value })
                          }
                          disabled={isLoading}
                          className="rounded-lg bg-muted/50"
                        />
                      </div>
                    )}
                  </div>
                </ConfigCard>

                {/* Styling Options */}
                <ConfigCard title="Styling Options" icon={Sparkles} className="lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                      <Checkbox
                        id="addSteam"
                        checked={foodOptions.styling.addSteam}
                        onCheckedChange={(checked) =>
                          updateFoodNested("styling", { addSteam: checked === true })
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="addSteam" className="text-sm font-normal cursor-pointer flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" />
                        Add Steam
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                      <Checkbox
                        id="addCondensation"
                        checked={foodOptions.styling.addCondensation}
                        onCheckedChange={(checked) =>
                          updateFoodNested("styling", { addCondensation: checked === true })
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="addCondensation" className="text-sm font-normal cursor-pointer flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5" />
                        Add Condensation
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                      <Checkbox
                        id="reduceGlare"
                        checked={foodOptions.styling.reduceGlare}
                        onCheckedChange={(checked) =>
                          updateFoodNested("styling", { reduceGlare: checked === true })
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="reduceGlare" className="text-sm font-normal cursor-pointer flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5" />
                        Reduce Glare
                      </Label>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3 mt-4">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <span className="font-medium">Brand Truth Protection:</span> Always On - dish identity and ingredients are preserved.
                    </p>
                  </div>
                </ConfigCard>
              </>
            )}

            {/* ===== PRODUCT OPTIONS ===== */}
            {isProduct && (
              <>
                {/* Quick Presets & Shot Type */}
                <ConfigCard title="Product Style" icon={Sparkles}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Quick Preset</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(QUICK_PRESET_LABELS) as [ProductPresetType, string][]).map(
                          ([preset, label]) => (
                            <Button
                              key={preset}
                              variant={productOptions.quickPreset === preset ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                onProductOptionsChange({ ...productOptions, quickPreset: preset })
                              }
                              disabled={isLoading}
                              className="text-xs whitespace-nowrap"
                            >
                              {label}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground text-sm">Shot Type</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(Object.entries(SHOT_TYPE_LABELS) as [ProductShotType, string][]).map(
                          ([type, label]) => (
                            <Button
                              key={type}
                              variant={productOptions.shotType === type ? "default" : "outline"}
                              size="sm"
                              onClick={() =>
                                onProductOptionsChange({ ...productOptions, shotType: type })
                              }
                              disabled={isLoading}
                              className="text-xs"
                            >
                              {label}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Scene selector for lifestyle shots */}
                    {productOptions.shotType === "lifestyle" && (
                      <div className="space-y-2">
                        <Label className="text-foreground text-sm">Scene</Label>
                        <Select
                          value={productOptions.lifestyleScene || "random"}
                          onValueChange={(value: LifestyleScene) =>
                            onProductOptionsChange({ ...productOptions, lifestyleScene: value })
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="rounded-lg bg-muted/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(LIFESTYLE_SCENE_LABELS) as [LifestyleScene, string][]).map(
                              ([scene, label]) => (
                                <SelectItem key={scene} value={scene}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Random generates a different scene each time
                        </p>
                      </div>
                    )}
                  </div>
                </ConfigCard>

                {/* Background */}
                <ConfigCard title="Background" icon={Palette}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Style</Label>
                      <Select
                        value={productOptions.background.style}
                        onValueChange={(value: BackgroundStyle) =>
                          updateProductNested("background", { style: value })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="rounded-lg bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(BACKGROUND_STYLE_LABELS) as [BackgroundStyle, string][]).map(
                            ([style, label]) => (
                              <SelectItem key={style} value={style}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Custom Color (optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={productOptions.background.color || "#ffffff"}
                          onChange={(e) =>
                            updateProductNested("background", { color: e.target.value })
                          }
                          disabled={isLoading}
                          className="h-10 w-16 cursor-pointer p-1"
                        />
                        <Input
                          type="text"
                          value={productOptions.background.color || "#ffffff"}
                          onChange={(e) =>
                            updateProductNested("background", { color: e.target.value })
                          }
                          disabled={isLoading}
                          className="flex-1 rounded-lg bg-muted/50"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                      <Checkbox
                        id="crispEdges"
                        checked={productOptions.background.crispEdges}
                        onCheckedChange={(checked) =>
                          updateProductNested("background", { crispEdges: checked === true })
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="crispEdges" className="text-sm font-normal cursor-pointer">
                        Keep edges crisp
                      </Label>
                    </div>
                  </div>
                </ConfigCard>

                {/* Camera */}
                <ConfigCard title="Camera" icon={Camera}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Angle</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.entries(CAMERA_ANGLE_LABELS) as [CameraAngle, string][]).map(
                          ([angle, label]) => (
                            <Button
                              key={angle}
                              variant={productOptions.camera.angle === angle ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateProductNested("camera", { angle })}
                              disabled={isLoading}
                              className="text-xs"
                            >
                              {label}
                            </Button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Composition</Label>
                      <Select
                        value={productOptions.camera.composition}
                        onValueChange={(value: Composition) =>
                          updateProductNested("camera", { composition: value })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="rounded-lg bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(COMPOSITION_LABELS) as [Composition, string][]).map(
                            ([comp, label]) => (
                              <SelectItem key={comp} value={comp}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ConfigCard>

                {/* Lighting & Shadow */}
                <ConfigCard title="Lighting & Shadow" icon={Sun}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Lighting Style</Label>
                      <Select
                        value={productOptions.lighting.style}
                        onValueChange={(value: LightingStyle) =>
                          updateProductNested("lighting", { style: value })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="rounded-lg bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(LIGHTING_STYLE_LABELS) as [LightingStyle, string][]).map(
                            ([style, label]) => (
                              <SelectItem key={style} value={style}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-sm">Intensity</Label>
                        <span className="text-xs text-muted-foreground">{productOptions.lighting.intensity}%</span>
                      </div>
                      <Slider
                        value={[productOptions.lighting.intensity]}
                        onValueChange={([value]) =>
                          updateProductNested("lighting", { intensity: value })
                        }
                        min={0}
                        max={100}
                        step={1}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Shadow</Label>
                      <Select
                        value={productOptions.shadow}
                        onValueChange={(value: ShadowType) =>
                          onProductOptionsChange({ ...productOptions, shadow: value })
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="rounded-lg bg-muted/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(SHADOW_TYPE_LABELS) as [ShadowType, string][]).map(
                            ([shadow, label]) => (
                              <SelectItem key={shadow} value={shadow}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ConfigCard>

                {/* Label Protection */}
                <ConfigCard title="Label Protection" icon={Settings2}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground text-sm">Enable Protection</Label>
                      <Switch
                        checked={productOptions.labelProtection.enabled}
                        onCheckedChange={(checked) =>
                          updateProductNested("labelProtection", { enabled: checked })
                        }
                        disabled={isLoading}
                      />
                    </div>
                    {productOptions.labelProtection.enabled && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label className="text-sm">Strictness</Label>
                          <span className="text-xs text-muted-foreground">
                            {productOptions.labelProtection.strictness}%
                          </span>
                        </div>
                        <Slider
                          value={[productOptions.labelProtection.strictness]}
                          onValueChange={([value]) =>
                            updateProductNested("labelProtection", { strictness: value })
                          }
                          min={0}
                          max={100}
                          step={1}
                          disabled={isLoading}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                          <span>Flexible</span>
                          <span>Strict</span>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Controls how strictly text and logos are preserved during enhancement
                    </p>
                  </div>
                </ConfigCard>

                {/* Advanced Options - Collapsible */}
                <Card className="glass-card lg:col-span-2">
                  <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                      <div className="flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        <span className="text-base font-semibold text-foreground">Advanced Options</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          advancedOpen && "rotate-180"
                        )}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Surface */}
                          <div className="space-y-2">
                            <Label className="text-sm">Surface</Label>
                            <Select
                              value={productOptions.surface.type}
                              onValueChange={(value: SurfaceType) =>
                                updateProductNested("surface", { type: value })
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="rounded-lg bg-muted/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(Object.entries(SURFACE_TYPE_LABELS) as [SurfaceType, string][]).map(
                                  ([surface, label]) => (
                                    <SelectItem key={surface} value={surface}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>

                            {productOptions.surface.type === "cloth" && (
                              <div className="space-y-3 mt-3 pl-2 border-l-2 border-muted">
                                <div className="space-y-2">
                                  <Label className="text-xs">Cloth Type</Label>
                                  <Select
                                    value={productOptions.surface.clothType || "linen"}
                                    onValueChange={(value: ClothType) =>
                                      updateProductNested("surface", { clothType: value })
                                    }
                                    disabled={isLoading}
                                  >
                                    <SelectTrigger className="rounded-lg bg-muted/50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {(Object.entries(CLOTH_TYPE_LABELS) as [ClothType, string][]).map(
                                        ([cloth, label]) => (
                                          <SelectItem key={cloth} value={cloth}>
                                            {label}
                                          </SelectItem>
                                        )
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <Label className="text-xs">Wrinkle Amount</Label>
                                    <span className="text-xs text-muted-foreground">
                                      {productOptions.surface.wrinkleAmount || 0}%
                                    </span>
                                  </div>
                                  <Slider
                                    value={[productOptions.surface.wrinkleAmount || 0]}
                                    onValueChange={([value]) =>
                                      updateProductNested("surface", { wrinkleAmount: value })
                                    }
                                    min={0}
                                    max={100}
                                    step={1}
                                    disabled={isLoading}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Reflection */}
                          <div className="space-y-2">
                            <Label className="text-sm">Reflection</Label>
                            <Select
                              value={productOptions.reflection}
                              onValueChange={(value: ReflectionType) =>
                                onProductOptionsChange({ ...productOptions, reflection: value })
                              }
                              disabled={isLoading}
                            >
                              <SelectTrigger className="rounded-lg bg-muted/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {(Object.entries(REFLECTION_TYPE_LABELS) as [ReflectionType, string][]).map(
                                  ([reflection, label]) => (
                                    <SelectItem key={reflection} value={reflection}>
                                      {label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Matte Level */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-sm">Matte Level</Label>
                              <span className="text-xs text-muted-foreground">
                                {productOptions.lighting.matteLevel}%
                              </span>
                            </div>
                            <Slider
                              value={[productOptions.lighting.matteLevel]}
                              onValueChange={([value]) =>
                                updateProductNested("lighting", { matteLevel: value })
                              }
                              min={0}
                              max={100}
                              step={1}
                              disabled={isLoading}
                            />
                          </div>

                          {/* Focal Length */}
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label className="text-sm">Focal Length</Label>
                              <span className="text-xs text-muted-foreground">
                                {productOptions.camera.focalLength}
                              </span>
                            </div>
                            <Slider
                              value={[productOptions.camera.focalLength]}
                              onValueChange={([value]) =>
                                updateProductNested("camera", { focalLength: value })
                              }
                              min={0}
                              max={100}
                              step={1}
                              disabled={isLoading}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                              <span>Wide</span>
                              <span>Telephoto</span>
                            </div>
                          </div>

                          {/* Glow Effect */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Glow Effect</Label>
                              <Switch
                                checked={productOptions.lighting.glowEnabled}
                                onCheckedChange={(checked) =>
                                  updateProductNested("lighting", { glowEnabled: checked })
                                }
                                disabled={isLoading}
                              />
                            </div>
                            {productOptions.lighting.glowEnabled && (
                              <div className="space-y-2 pl-2 border-l-2 border-muted">
                                <div className="flex justify-between">
                                  <Label className="text-xs">Intensity</Label>
                                  <span className="text-xs text-muted-foreground">
                                    {productOptions.lighting.glowIntensity}%
                                  </span>
                                </div>
                                <Slider
                                  value={[productOptions.lighting.glowIntensity]}
                                  onValueChange={([value]) =>
                                    updateProductNested("lighting", { glowIntensity: value })
                                  }
                                  min={0}
                                  max={100}
                                  step={1}
                                  disabled={isLoading}
                                />
                              </div>
                            )}
                          </div>

                          {/* Cleanup Options */}
                          <div className="space-y-3 sm:col-span-2">
                            <Label className="text-sm font-medium">Cleanup</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                                <Checkbox
                                  id="removeDust"
                                  checked={productOptions.cleanup.removeDust}
                                  onCheckedChange={(checked) =>
                                    updateProductNested("cleanup", { removeDust: checked === true })
                                  }
                                  disabled={isLoading}
                                />
                                <Label htmlFor="removeDust" className="text-xs font-normal cursor-pointer">
                                  Remove dust
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                                <Checkbox
                                  id="removeScratches"
                                  checked={productOptions.cleanup.removeScratches}
                                  onCheckedChange={(checked) =>
                                    updateProductNested("cleanup", { removeScratches: checked === true })
                                  }
                                  disabled={isLoading}
                                />
                                <Label htmlFor="removeScratches" className="text-xs font-normal cursor-pointer">
                                  Remove scratches
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                                <Checkbox
                                  id="reduceGlareProduct"
                                  checked={productOptions.cleanup.reduceGlare}
                                  onCheckedChange={(checked) =>
                                    updateProductNested("cleanup", { reduceGlare: checked === true })
                                  }
                                  disabled={isLoading}
                                />
                                <Label htmlFor="reduceGlareProduct" className="text-xs font-normal cursor-pointer">
                                  Reduce glare
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                                <Checkbox
                                  id="straighten"
                                  checked={productOptions.cleanup.straighten}
                                  onCheckedChange={(checked) =>
                                    updateProductNested("cleanup", { straighten: checked === true })
                                  }
                                  disabled={isLoading}
                                />
                                <Label htmlFor="straighten" className="text-xs font-normal cursor-pointer">
                                  Straighten
                                </Label>
                              </div>

                              <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                                <Checkbox
                                  id="colorAccuracy"
                                  checked={productOptions.cleanup.colorAccuracy}
                                  onCheckedChange={(checked) =>
                                    updateProductNested("cleanup", { colorAccuracy: checked === true })
                                  }
                                  disabled={isLoading}
                                />
                                <Label htmlFor="colorAccuracy" className="text-xs font-normal cursor-pointer">
                                  Color accuracy
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onGenerate}
              disabled={!file || isLoading}
              size="lg"
              className="w-full lg:w-auto min-w-48 h-11 rounded-xl font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isLoading ? "Generating..." : "Generate Enhancement"}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
