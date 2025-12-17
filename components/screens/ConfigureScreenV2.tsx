"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileImage,
  Settings2,
  Image as ImageIcon,
  Sparkles,
  Camera,
  Palette,
  Sun,
  ChevronDown,
  Flame,
  Droplets,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { OptionCardGroup, OptionCardItem } from "@/components/ui/option-card-group";
import { PRESETS, ASPECT_RATIOS, IMAGE_SIZES } from "@/lib/presets";
import {
  EnhanceOptions,
  Preset,
  AspectRatio,
  ImageSize,
  ProductOptions,
  AutoOptions,
} from "@/types";
import {
  AutoShotType,
  AutoAngle,
  AutoEnvironment,
  AutoLighting,
  AUTO_SHOT_TYPE_LABELS,
  AUTO_ANGLE_LABELS,
  AUTO_ENVIRONMENT_LABELS,
  AUTO_LIGHTING_LABELS,
} from "@/types/automotive";
import {
  FoodOptions,
  TransformMode,
  FoodShotType,
  FoodLighting,
  FoodSurface,
  FoodBoost,
  TRANSFORM_MODE_LABELS,
  INTERIOR_MODE_LABELS,
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
import { MotionButton } from "@/components/ui/motion-button";

interface ConfigureScreenV2Props {
  file: File | null;
  originalPreview: string | null;
  options: EnhanceOptions;
  onOptionsChange: (options: EnhanceOptions) => void;
  productOptions: ProductOptions;
  onProductOptionsChange: (options: ProductOptions) => void;
  foodOptions: FoodOptions;
  onFoodOptionsChange: (options: FoodOptions) => void;
  autoOptions: AutoOptions;
  onAutoOptionsChange: (options: AutoOptions) => void;
  onChangeImage: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

// Preset tab component
function PresetTabs({
  value,
  onChange,
  disabled,
}: {
  value: Preset;
  onChange: (preset: Preset) => void;
  disabled: boolean;
}) {
  const presets = Object.values(PRESETS);

  return (
    <div className="relative overflow-x-auto hide-scrollbar">
      <div className="flex gap-2 pb-2">
        {presets.map((preset) => {
          const isActive = value === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onChange(preset.id)}
              disabled={disabled}
              className={cn(
                "relative px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground border-beam",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="relative z-10">{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Quick settings card component
function QuickSettingCard({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

export function ConfigureScreenV2({
  file,
  originalPreview,
  options,
  onOptionsChange,
  productOptions,
  onProductOptionsChange,
  foodOptions,
  onFoodOptionsChange,
  autoOptions,
  onAutoOptionsChange,
  onChangeImage,
  onGenerate,
  isLoading,
}: ConfigureScreenV2Props) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

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
  const isAutomotive = options.preset === "automotive";

  // Get current interior transform mode
  const getInteriorTransformMode = (): TransformMode => {
    if (!options.magazineReshoot) return "retouch";
    if (!options.allowStyling) return "reshoot";
    return "reshoot_styled";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Container with max-width */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-12 space-y-6">

        {/* Image Thumbnail - Compact */}
        {file && originalPreview && (
          <Card className="glass-card overflow-hidden">
            <div className="flex items-center gap-4 p-3">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                <Image
                  src={originalPreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="outline"
                onClick={onChangeImage}
                disabled={isLoading}
                size="sm"
              >
                Change
              </Button>
            </div>
          </Card>
        )}

        {/* Preset Tabs - Horizontal Scroll */}
        <div>
          <PresetTabs
            value={options.preset}
            onChange={(preset) => updateOption("preset", preset)}
            disabled={isLoading}
          />
        </div>

        {/* Quick Settings Grid - 2x2 on mobile, 4 cols on desktop */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Transform Mode (only show for presets that use it) */}
              {(isInterior || isFood) && (
                <QuickSettingCard label="Transform" className="col-span-2 lg:col-span-1">
                  <Select
                    value={isInterior ? getInteriorTransformMode() : foodOptions.transformMode}
                    onValueChange={(v: TransformMode) => {
                      if (isInterior) {
                        if (v === "retouch") {
                          updateOption("magazineReshoot", false);
                          updateOption("allowStyling", false);
                        } else if (v === "reshoot") {
                          updateOption("magazineReshoot", true);
                          updateOption("allowStyling", false);
                        } else {
                          updateOption("magazineReshoot", true);
                          updateOption("allowStyling", true);
                        }
                      } else {
                        onFoodOptionsChange({ ...foodOptions, transformMode: v });
                      }
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-10 rounded-lg bg-muted/50">
                      <SelectValue>
                        {(isInterior ? INTERIOR_MODE_LABELS : TRANSFORM_MODE_LABELS)[isInterior ? getInteriorTransformMode() : foodOptions.transformMode].title}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(isInterior ? INTERIOR_MODE_LABELS : TRANSFORM_MODE_LABELS) as [TransformMode, { title: string; description: string }][]).map(
                        ([mode, { title, description }]) => (
                          <SelectItem key={mode} value={mode} className="py-2.5">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium">{title}</span>
                              <span className="text-xs text-muted-foreground leading-tight">{description}</span>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </QuickSettingCard>
              )}

              {/* Output Size - Chips */}
              <QuickSettingCard label="Output Size" className={cn(isInterior || isFood ? "" : "col-span-2 lg:col-span-1")}>
                <div className="flex gap-1">
                  {IMAGE_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => updateOption("imageSize", size.value)}
                      disabled={isLoading}
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        options.imageSize === size.value
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {size.value}
                    </button>
                  ))}
                </div>
              </QuickSettingCard>

              {/* Aspect Ratio */}
              <QuickSettingCard label="Aspect Ratio" className="col-span-2 lg:col-span-1">
                <Select
                  value={options.aspectRatio}
                  onValueChange={(v) => updateOption("aspectRatio", v as AspectRatio)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-10 rounded-lg bg-muted/50">
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
              </QuickSettingCard>

              {/* Strength Slider */}
              <QuickSettingCard label="Strength" className="col-span-2 lg:col-span-1">
                <div className="space-y-2">
                  <Slider
                    value={[isFood ? foodOptions.strength : options.strength]}
                    onValueChange={([v]) => {
                      if (isFood) {
                        onFoodOptionsChange({ ...foodOptions, strength: v });
                      } else {
                        updateOption("strength", v);
                      }
                    }}
                    min={0}
                    max={100}
                    step={5}
                    disabled={isLoading}
                    className="py-1"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtle</span>
                    <span className="font-semibold text-foreground">
                      {isFood ? foodOptions.strength : options.strength}%
                    </span>
                    <span>Max</span>
                  </div>
                </div>
              </QuickSettingCard>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options - Expandable */}
        <Card className="glass-card">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Advanced Options</span>
              <span className="text-xs text-muted-foreground">(preset-specific)</span>
            </div>
            <motion.div
              animate={{ rotate: advancedOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {advancedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <CardContent className="px-4 pb-4 pt-0 space-y-6">

                  {/* ===== INTERIOR ADVANCED OPTIONS ===== */}
                  {isInterior && (
                    <>
                      {options.allowStyling && (
                        <div className="space-y-2">
                          <Label htmlFor="sceneDirection" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                            <Palette className="w-3.5 h-3.5" />
                            Scene Direction
                          </Label>
                          <Input
                            id="sceneDirection"
                            placeholder="e.g., add fresh flowers, close background doors"
                            value={options.propSuggestions ?? ""}
                            onChange={(e) => updateOption("propSuggestions", e.target.value)}
                            disabled={isLoading}
                            className="rounded-lg bg-muted/50"
                          />
                          <p className="text-xs text-muted-foreground">
                            Optional: Guide scene styling and prop placement
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {/* ===== FOOD ADVANCED OPTIONS ===== */}
                  {isFood && (
                    <>
                      {/* Dish Polish */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Dish Polish (Food Styling)</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.entries(FOOD_BOOST_LABELS) as [FoodBoost, { title: string; description: string }][]).map(
                            ([boost, { title, description }]) => (
                              <button
                                key={boost}
                                onClick={() => onFoodOptionsChange({ ...foodOptions, foodBoost: boost })}
                                disabled={isLoading}
                                className={cn(
                                  "p-3 rounded-lg text-left transition-all border",
                                  foodOptions.foodBoost === boost
                                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                                    : "bg-muted/50 border-transparent hover:bg-muted hover:border-border"
                                )}
                              >
                                <div className="text-xs font-semibold">{title}</div>
                                <div className="text-xs opacity-80 mt-0.5">{description}</div>
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Shot Type & Lighting */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Shot Type</Label>
                          <Select
                            value={foodOptions.shotType}
                            onValueChange={(value: FoodShotType) =>
                              onFoodOptionsChange({ ...foodOptions, shotType: value })
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="rounded-lg bg-muted/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.entries(FOOD_SHOT_TYPE_LABELS) as [FoodShotType, string][]).map(
                                ([type, label]) => (
                                  <SelectItem key={type} value={type}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Lighting</Label>
                          <Select
                            value={foodOptions.lighting}
                            onValueChange={(value: FoodLighting) =>
                              onFoodOptionsChange({ ...foodOptions, lighting: value })
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="rounded-lg bg-muted/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.entries(FOOD_LIGHTING_LABELS) as [FoodLighting, string][]).map(
                                ([lighting, label]) => (
                                  <SelectItem key={lighting} value={lighting}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Surface */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Surface</Label>
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

                      {/* Dish Hint */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Dish Hint (optional)</Label>
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

                      {/* Scene Direction */}
                      {foodOptions.transformMode === "reshoot_styled" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Scene Direction (optional)</Label>
                          <Input
                            placeholder="e.g., add fresh herbs, linen napkin"
                            value={foodOptions.propSuggestions ?? ""}
                            onChange={(e) =>
                              onFoodOptionsChange({ ...foodOptions, propSuggestions: e.target.value })
                            }
                            disabled={isLoading}
                            className="rounded-lg bg-muted/50"
                          />
                        </div>
                      )}

                      {/* Styling Checkboxes */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Effects</Label>
                        <div className="grid grid-cols-1 gap-2">
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
                      </div>

                      {/* Brand Truth Notice */}
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          <span className="font-medium">Brand Truth Protection:</span> Always On - dish identity and ingredients are preserved.
                        </p>
                      </div>
                    </>
                  )}

                  {/* ===== PRODUCT ADVANCED OPTIONS ===== */}
                  {isProduct && (
                    <>
                      {/* Quick Presets */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Quick Preset</Label>
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
                                className="text-xs"
                              >
                                {label}
                              </Button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Shot Type */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Shot Type</Label>
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

                      {/* Lifestyle Scene */}
                      {productOptions.shotType === "lifestyle" && (
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Scene</Label>
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
                        </div>
                      )}

                      {/* Background */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Background</Label>
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

                      {/* Camera & Composition */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Camera Angle</Label>
                          <Select
                            value={productOptions.camera.angle}
                            onValueChange={(value: CameraAngle) =>
                              updateProductNested("camera", { angle: value })
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="rounded-lg bg-muted/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(Object.entries(CAMERA_ANGLE_LABELS) as [CameraAngle, string][]).map(
                                ([angle, label]) => (
                                  <SelectItem key={angle} value={angle}>
                                    {label}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-foreground">Composition</Label>
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

                      {/* Lighting */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Lighting</Label>
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

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-xs">Intensity</Label>
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
                      </div>

                      {/* Shadow */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Shadow</Label>
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

                      {/* Surface */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Surface</Label>
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
                      </div>

                      {/* Label Protection */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-foreground">Label Protection</Label>
                          <Switch
                            checked={productOptions.labelProtection.enabled}
                            onCheckedChange={(checked) =>
                              updateProductNested("labelProtection", { enabled: checked })
                            }
                            disabled={isLoading}
                          />
                        </div>
                        {productOptions.labelProtection.enabled && (
                          <div className="space-y-2 pl-3 border-l-2 border-muted">
                            <div className="flex justify-between">
                              <Label className="text-xs">Strictness</Label>
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
                          </div>
                        )}
                      </div>

                      {/* Cleanup Options */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Cleanup</Label>
                        <div className="grid grid-cols-2 gap-2">
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
                        </div>
                      </div>
                    </>
                  )}

                  {/* ===== AUTOMOTIVE ADVANCED OPTIONS ===== */}
                  {isAutomotive && (
                    <>
                      {/* Shot Type */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Shot Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.entries(AUTO_SHOT_TYPE_LABELS) as [AutoShotType, string][]).map(
                            ([type, label]) => (
                              <Button
                                key={type}
                                variant={autoOptions.shotType === type ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  onAutoOptionsChange({ ...autoOptions, shotType: type })
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

                      {/* Camera Angle */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Camera Angle</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(Object.entries(AUTO_ANGLE_LABELS) as [AutoAngle, string][]).map(
                            ([angle, label]) => (
                              <Button
                                key={angle}
                                variant={autoOptions.angle === angle ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  onAutoOptionsChange({ ...autoOptions, angle: angle })
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

                      {/* Environment */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Environment</Label>
                        <Select
                          value={autoOptions.environment}
                          onValueChange={(value: AutoEnvironment) =>
                            onAutoOptionsChange({ ...autoOptions, environment: value })
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="rounded-lg bg-muted/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(AUTO_ENVIRONMENT_LABELS) as [AutoEnvironment, string][]).map(
                              ([env, label]) => (
                                <SelectItem key={env} value={env}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Lighting */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Lighting</Label>
                        <Select
                          value={autoOptions.lighting}
                          onValueChange={(value: AutoLighting) =>
                            onAutoOptionsChange({ ...autoOptions, lighting: value })
                          }
                          disabled={isLoading}
                        >
                          <SelectTrigger className="rounded-lg bg-muted/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.entries(AUTO_LIGHTING_LABELS) as [AutoLighting, string][]).map(
                              ([lighting, label]) => (
                                <SelectItem key={lighting} value={lighting}>
                                  {label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Reflection & Dramatic Sliders */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-sm font-medium text-foreground">Reflection</Label>
                            <span className="text-xs text-muted-foreground">{autoOptions.reflectionIntensity}%</span>
                          </div>
                          <Slider
                            value={[autoOptions.reflectionIntensity]}
                            onValueChange={([value]) =>
                              onAutoOptionsChange({ ...autoOptions, reflectionIntensity: value })
                            }
                            min={0}
                            max={100}
                            step={1}
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label className="text-sm font-medium text-foreground">Dramatic</Label>
                            <span className="text-xs text-muted-foreground">{autoOptions.dramaticLevel}%</span>
                          </div>
                          <Slider
                            value={[autoOptions.dramaticLevel]}
                            onValueChange={([value]) =>
                              onAutoOptionsChange({ ...autoOptions, dramaticLevel: value })
                            }
                            min={0}
                            max={100}
                            step={1}
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Effect Checkboxes */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-foreground">Effects</Label>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                            <Checkbox
                              id="showMovement"
                              checked={autoOptions.showMovement}
                              onCheckedChange={(checked) =>
                                onAutoOptionsChange({ ...autoOptions, showMovement: checked === true })
                              }
                              disabled={isLoading}
                            />
                            <Label htmlFor="showMovement" className="text-sm font-normal cursor-pointer">
                              Motion blur (spinning wheels)
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                            <Checkbox
                              id="cleanupReflections"
                              checked={autoOptions.cleanupReflections}
                              onCheckedChange={(checked) =>
                                onAutoOptionsChange({ ...autoOptions, cleanupReflections: checked === true })
                              }
                              disabled={isLoading}
                            />
                            <Label htmlFor="cleanupReflections" className="text-sm font-normal cursor-pointer">
                              Clean up reflections
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
                            <Checkbox
                              id="enhanceDetails"
                              checked={autoOptions.enhanceDetails}
                              onCheckedChange={(checked) =>
                                onAutoOptionsChange({ ...autoOptions, enhanceDetails: checked === true })
                              }
                              disabled={isLoading}
                            />
                            <Label htmlFor="enhanceDetails" className="text-sm font-normal cursor-pointer">
                              Enhance details (chrome, paint, wheels)
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Protection Notice */}
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          <span className="font-medium">Vehicle Identity Protection:</span> Always On - make, model, badges, and distinctive features are preserved.
                        </p>
                      </div>
                    </>
                  )}

                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Generate Button */}
        <MotionButton
          onClick={onGenerate}
          disabled={!file || isLoading}
          size="lg"
          className="w-full shadow-xl shadow-primary/20"
        >
          <Sparkles className="w-5 h-5" />
          {isLoading ? "Enhancing..." : "Enhance Photo"}
        </MotionButton>
      </div>
    </div>
  );
}
