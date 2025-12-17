"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ProductOptions,
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
  ProductScale,
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
  PRODUCT_SCALE_LABELS,
  PRODUCT_SCALE_DESCRIPTIONS,
} from "@/types/product";
import { getAvailableSurfaces } from "@/lib/productPromptBuilder";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ProductOptionsFormProps {
  options: ProductOptions;
  onChange: (options: ProductOptions) => void;
  disabled?: boolean;
}

export function ProductOptionsForm({
  options,
  onChange,
  disabled = false,
}: ProductOptionsFormProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateOptions = (updates: Partial<ProductOptions>) => {
    onChange({ ...options, ...updates });
  };

  // Type-safe nested update for object properties only
  type NestedKeys = "background" | "surface" | "camera" | "lighting" | "labelProtection" | "cleanup";

  const updateNested = <K extends NestedKeys>(
    key: K,
    value: Partial<ProductOptions[K]>
  ) => {
    onChange({
      ...options,
      [key]: { ...options[key], ...value },
    } as ProductOptions);
  };

  // Get available surfaces based on scale
  const availableSurfaces = getAvailableSurfaces(options.scale);
  const isSurfaceDisabled = (scale: ProductScale) => scale === "large" || scale === "extra_large";

  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-6">
        {/* Quick Presets */}
        <div className="space-y-3">
          <Label className="text-foreground">Quick Presets</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              Object.entries(QUICK_PRESET_LABELS) as [
                ProductPresetType,
                string
              ][]
            ).map(([preset, label]) => (
              <Button
                key={preset}
                variant={options.quickPreset === preset ? "default" : "outline"}
                size="sm"
                onClick={() => updateOptions({ quickPreset: preset })}
                disabled={disabled}
                className="text-xs whitespace-nowrap"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Scale */}
        <div className="space-y-3">
          <Label className="text-foreground">Product Scale</Label>
          <div className="grid grid-cols-2 gap-2">
            {(
              Object.entries(PRODUCT_SCALE_LABELS) as [ProductScale, string][]
            ).map(([scale, label]) => (
              <div key={scale} className="relative">
                <Button
                  variant={options.scale === scale ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateOptions({ scale, surface: { type: "none" } })}
                  disabled={disabled}
                  className="w-full"
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="text-[10px] opacity-70 mt-0.5">
                      {PRODUCT_SCALE_DESCRIPTIONS[scale]}
                    </span>
                  </div>
                </Button>
              </div>
            ))}
          </div>
          {options.scale === "extra_large" && (
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
              <p className="text-xs text-yellow-600 dark:text-yellow-500">
                For vehicles and extra-large products, consider using the Automotive preset for better results.
              </p>
            </div>
          )}
        </div>

        {/* Shot Type */}
        <div className="space-y-3">
          <Label className="text-foreground">Shot Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {(
              Object.entries(SHOT_TYPE_LABELS) as [ProductShotType, string][]
            ).map(([type, label]) => (
              <Button
                key={type}
                variant={options.shotType === type ? "default" : "outline"}
                size="sm"
                onClick={() => updateOptions({ shotType: type })}
                disabled={disabled}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Background Section */}
        <div className="space-y-3">
          <Label className="text-foreground text-base font-semibold">
            Background
          </Label>
          <div className="space-y-4 pl-2">
            <div className="space-y-2">
              <Label className="text-sm">Style</Label>
              <Select
                value={options.background.style}
                onValueChange={(value: BackgroundStyle) =>
                  updateNested("background", { style: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(BACKGROUND_STYLE_LABELS) as [
                      BackgroundStyle,
                      string
                    ][]
                  ).map(([style, label]) => (
                    <SelectItem key={style} value={style}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Custom Color (optional)</Label>
              <Input
                type="color"
                value={options.background.color || "#ffffff"}
                onChange={(e) =>
                  updateNested("background", { color: e.target.value })
                }
                disabled={disabled}
                className="h-10 w-full cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="crispEdges"
                checked={options.background.crispEdges}
                onCheckedChange={(checked) =>
                  updateNested("background", { crispEdges: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="crispEdges"
                className="text-sm font-normal cursor-pointer"
              >
                Keep edges crisp
              </Label>
            </div>
          </div>
        </div>

        {/* Camera Section */}
        <div className="space-y-3">
          <Label className="text-foreground text-base font-semibold">
            Camera
          </Label>
          <div className="space-y-4 pl-2">
            <div className="space-y-2">
              <Label className="text-sm">Angle</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  Object.entries(CAMERA_ANGLE_LABELS) as [
                    CameraAngle,
                    string
                  ][]
                ).map(([angle, label]) => (
                  <Button
                    key={angle}
                    variant={
                      options.camera.angle === angle ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => updateNested("camera", { angle })}
                    disabled={disabled}
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Composition</Label>
              <Select
                value={options.camera.composition}
                onValueChange={(value: Composition) =>
                  updateNested("camera", { composition: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(COMPOSITION_LABELS) as [
                      Composition,
                      string
                    ][]
                  ).map(([comp, label]) => (
                    <SelectItem key={comp} value={comp}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Lighting Section */}
        <div className="space-y-3">
          <Label className="text-foreground text-base font-semibold">
            Lighting
          </Label>
          <div className="space-y-4 pl-2">
            <div className="space-y-2">
              <Label className="text-sm">Style</Label>
              <Select
                value={options.lighting.style}
                onValueChange={(value: LightingStyle) =>
                  updateNested("lighting", { style: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(LIGHTING_STYLE_LABELS) as [
                      LightingStyle,
                      string
                    ][]
                  ).map(([style, label]) => (
                    <SelectItem key={style} value={style}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Intensity</Label>
                <span className="text-xs text-muted-foreground">
                  {options.lighting.intensity}%
                </span>
              </div>
              <Slider
                value={[options.lighting.intensity]}
                onValueChange={([value]) =>
                  updateNested("lighting", { intensity: value })
                }
                min={0}
                max={100}
                step={1}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* Shadow */}
        <div className="space-y-2">
          <Label className="text-foreground">Shadow</Label>
          <Select
            value={options.shadow}
            onValueChange={(value: ShadowType) =>
              updateOptions({ shadow: value })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(SHADOW_TYPE_LABELS) as [ShadowType, string][]
              ).map(([shadow, label]) => (
                <SelectItem key={shadow} value={shadow}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Label Protection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-foreground">Label Protection</Label>
            <Switch
              checked={options.labelProtection.enabled}
              onCheckedChange={(checked) =>
                updateNested("labelProtection", { enabled: checked })
              }
              disabled={disabled}
            />
          </div>
          {options.labelProtection.enabled && (
            <div className="space-y-2 pl-2">
              <div className="flex justify-between">
                <Label className="text-sm">Strictness</Label>
                <span className="text-xs text-muted-foreground">
                  {options.labelProtection.strictness}%
                </span>
              </div>
              <Slider
                value={[options.labelProtection.strictness]}
                onValueChange={([value]) =>
                  updateNested("labelProtection", { strictness: value })
                }
                min={0}
                max={100}
                step={1}
                disabled={disabled}
              />
            </div>
          )}
        </div>

        {/* Advanced Section */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <Label className="text-foreground text-base font-semibold cursor-pointer">
              Advanced Options
            </Label>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                advancedOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-2">
            {/* Surface */}
            <div className="space-y-2 pl-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Surface</Label>
                {isSurfaceDisabled(options.scale) && (
                  <span className="text-xs text-muted-foreground italic">
                    Disabled for large products
                  </span>
                )}
              </div>
              <Select
                value={options.surface.type}
                onValueChange={(value: SurfaceType) =>
                  updateNested("surface", { type: value })
                }
                disabled={disabled || isSurfaceDisabled(options.scale)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(SURFACE_TYPE_LABELS) as [
                      SurfaceType,
                      string
                    ][]
                  )
                    .filter(([surface]) => availableSurfaces.includes(surface))
                    .map(([surface, label]) => (
                      <SelectItem key={surface} value={surface}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {options.surface.type === "cloth" && (
                <div className="space-y-2 mt-3">
                  <Label className="text-xs">Cloth Type</Label>
                  <Select
                    value={options.surface.clothType || "linen"}
                    onValueChange={(value: ClothType) =>
                      updateNested("surface", { clothType: value })
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.entries(CLOTH_TYPE_LABELS) as [
                          ClothType,
                          string
                        ][]
                      ).map(([cloth, label]) => (
                        <SelectItem key={cloth} value={cloth}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <Label className="text-xs">Wrinkle Amount</Label>
                      <span className="text-xs text-muted-foreground">
                        {options.surface.wrinkleAmount || 0}%
                      </span>
                    </div>
                    <Slider
                      value={[options.surface.wrinkleAmount || 0]}
                      onValueChange={([value]) =>
                        updateNested("surface", { wrinkleAmount: value })
                      }
                      min={0}
                      max={100}
                      step={1}
                      disabled={disabled}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reflection */}
            <div className="space-y-2 pl-2">
              <Label className="text-sm">Reflection</Label>
              <Select
                value={options.reflection}
                onValueChange={(value: ReflectionType) =>
                  updateOptions({ reflection: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.entries(REFLECTION_TYPE_LABELS) as [
                      ReflectionType,
                      string
                    ][]
                  ).map(([reflection, label]) => (
                    <SelectItem key={reflection} value={reflection}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Matte Level */}
            <div className="space-y-2 pl-2">
              <div className="flex justify-between">
                <Label className="text-sm">Matte Level</Label>
                <span className="text-xs text-muted-foreground">
                  {options.lighting.matteLevel}%
                </span>
              </div>
              <Slider
                value={[options.lighting.matteLevel]}
                onValueChange={([value]) =>
                  updateNested("lighting", { matteLevel: value })
                }
                min={0}
                max={100}
                step={1}
                disabled={disabled}
              />
            </div>

            {/* Focal Length */}
            <div className="space-y-2 pl-2">
              <div className="flex justify-between">
                <Label className="text-sm">Focal Length</Label>
                <span className="text-xs text-muted-foreground">
                  {options.camera.focalLength}
                </span>
              </div>
              <Slider
                value={[options.camera.focalLength]}
                onValueChange={([value]) =>
                  updateNested("camera", { focalLength: value })
                }
                min={0}
                max={100}
                step={1}
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Wide</span>
                <span>Telephoto</span>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="space-y-3 pl-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Glow Effect</Label>
                <Switch
                  checked={options.lighting.glowEnabled}
                  onCheckedChange={(checked) =>
                    updateNested("lighting", { glowEnabled: checked })
                  }
                  disabled={disabled}
                />
              </div>
              {options.lighting.glowEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Intensity</Label>
                    <span className="text-xs text-muted-foreground">
                      {options.lighting.glowIntensity}%
                    </span>
                  </div>
                  <Slider
                    value={[options.lighting.glowIntensity]}
                    onValueChange={([value]) =>
                      updateNested("lighting", { glowIntensity: value })
                    }
                    min={0}
                    max={100}
                    step={1}
                    disabled={disabled}
                  />
                </div>
              )}
            </div>

            {/* Cleanup Options */}
            <div className="space-y-3 pl-2">
              <Label className="text-sm">Cleanup</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="removeDust"
                    checked={options.cleanup.removeDust}
                    onCheckedChange={(checked) =>
                      updateNested("cleanup", { removeDust: checked === true })
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor="removeDust"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Remove dust
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="removeScratches"
                    checked={options.cleanup.removeScratches}
                    onCheckedChange={(checked) =>
                      updateNested("cleanup", {
                        removeScratches: checked === true,
                      })
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor="removeScratches"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Remove scratches
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reduceGlare"
                    checked={options.cleanup.reduceGlare}
                    onCheckedChange={(checked) =>
                      updateNested("cleanup", { reduceGlare: checked === true })
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor="reduceGlare"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Reduce glare
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="straighten"
                    checked={options.cleanup.straighten}
                    onCheckedChange={(checked) =>
                      updateNested("cleanup", { straighten: checked === true })
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor="straighten"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Straighten product
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="colorAccuracy"
                    checked={options.cleanup.colorAccuracy}
                    onCheckedChange={(checked) =>
                      updateNested("cleanup", {
                        colorAccuracy: checked === true,
                      })
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor="colorAccuracy"
                    className="text-xs font-normal cursor-pointer"
                  >
                    Ensure color accuracy
                  </Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
