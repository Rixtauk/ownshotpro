"use client";

import { useState } from "react";
import { ChevronDown, Flame, Droplets, Sun } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OptionCardGroup, OptionCardItem } from "@/components/ui/option-card-group";
import { cn } from "@/lib/utils";

interface FoodOptionsFormProps {
  options: FoodOptions;
  onChange: (options: FoodOptions) => void;
  disabled?: boolean;
}

export function FoodOptionsForm({
  options,
  onChange,
  disabled = false,
}: FoodOptionsFormProps) {
  const [stylingOpen, setStylingOpen] = useState(false);

  const updateOptions = (updates: Partial<FoodOptions>) => {
    onChange({ ...options, ...updates });
  };

  const updateNested = <K extends "finish" | "styling">(
    key: K,
    value: Partial<FoodOptions[K]>
  ) => {
    onChange({
      ...options,
      [key]: { ...options[key], ...value },
    } as FoodOptions);
  };

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

  // Shot type items
  const shotTypeItems: OptionCardItem<FoodShotType>[] = (
    Object.entries(FOOD_SHOT_TYPE_LABELS) as [FoodShotType, string][]
  ).map(([value, label]) => ({
    value,
    title: label,
  }));

  // Lighting items
  const lightingItems: OptionCardItem<FoodLighting>[] = (
    Object.entries(FOOD_LIGHTING_LABELS) as [FoodLighting, string][]
  ).map(([value, label]) => ({
    value,
    title: label,
  }));

  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-6">
        {/* Transform Mode */}
        <div className="space-y-3">
          <Label className="text-foreground">Transform Mode</Label>
          <OptionCardGroup
            items={transformModeItems}
            value={options.transformMode}
            onChange={(value) => updateOptions({ transformMode: value })}
            disabled={disabled}
            columns={1}
            size="md"
            aria-label="Transform mode"
          />
        </div>

        {/* Dish Polish (Food Boost) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-foreground">Dish Polish</Label>
            <span className="text-xs text-muted-foreground">(food styling)</span>
          </div>
          <OptionCardGroup
            items={foodBoostItems}
            value={options.foodBoost}
            onChange={(value) => updateOptions({ foodBoost: value })}
            disabled={disabled}
            columns={2}
            size="sm"
            aria-label="Dish polish level"
          />
        </div>

        {/* Shot Type */}
        <div className="space-y-3">
          <Label className="text-foreground">Shot Type</Label>
          <OptionCardGroup
            items={shotTypeItems}
            value={options.shotType}
            onChange={(value) => updateOptions({ shotType: value })}
            disabled={disabled}
            columns={2}
            size="sm"
            aria-label="Shot type"
          />
        </div>

        {/* Lighting */}
        <div className="space-y-3">
          <Label className="text-foreground">Lighting</Label>
          <OptionCardGroup
            items={lightingItems}
            value={options.lighting}
            onChange={(value) => updateOptions({ lighting: value })}
            disabled={disabled}
            columns={2}
            size="sm"
            aria-label="Lighting style"
          />
        </div>

        {/* Finish Section */}
        <div className="space-y-3">
          <Label className="text-foreground text-base font-semibold">
            Finish
          </Label>
          <div className="space-y-4 pl-2">
            {/* Strength Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Strength</Label>
                <span className="text-xs text-muted-foreground">{options.strength}%</span>
              </div>
              <Slider
                value={[options.strength]}
                onValueChange={([value]) => updateOptions({ strength: value })}
                min={0}
                max={100}
                step={5}
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Subtle</span>
                <span>Maximum</span>
              </div>
            </div>

            {/* Matte/Crisp Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Matte / Crisp</Label>
                <span className="text-xs text-muted-foreground">
                  {options.finish.matteCrisp}
                </span>
              </div>
              <Slider
                value={[options.finish.matteCrisp]}
                onValueChange={([value]) =>
                  updateNested("finish", { matteCrisp: value })
                }
                min={0}
                max={100}
                step={1}
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Matte</span>
                <span>Crisp</span>
              </div>
            </div>

            {/* Saturation Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">Saturation</Label>
                <span className="text-xs text-muted-foreground">
                  {options.finish.saturation > 0 ? "+" : ""}
                  {options.finish.saturation}
                </span>
              </div>
              <Slider
                value={[options.finish.saturation]}
                onValueChange={([value]) =>
                  updateNested("finish", { saturation: value })
                }
                min={-20}
                max={20}
                step={1}
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>-20</span>
                <span>+20</span>
              </div>
            </div>
          </div>
        </div>

        {/* Surface */}
        <div className="space-y-2">
          <Label className="text-foreground">Surface</Label>
          <Select
            value={options.surface}
            onValueChange={(value: FoodSurface) =>
              updateOptions({ surface: value })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(FOOD_SURFACE_LABELS) as [FoodSurface, string][]
              ).map(([surface, label]) => (
                <SelectItem key={surface} value={surface}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dish Hint */}
        <div className="space-y-2">
          <Label className="text-sm text-foreground">Dish Hint (optional)</Label>
          <Input
            placeholder="e.g., burger and fries, ramen, cocktail"
            value={options.dishHint ?? ""}
            onChange={(e) => updateOptions({ dishHint: e.target.value })}
            disabled={disabled}
            className="rounded-lg bg-muted/50"
          />
        </div>

        {/* Styling Options - Collapsible */}
        <Collapsible open={stylingOpen} onOpenChange={setStylingOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <Label className="text-foreground text-base font-semibold cursor-pointer">
              Styling Options
            </Label>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                stylingOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            {/* Add Steam */}
            <div className="flex items-center space-x-2 pl-2">
              <Checkbox
                id="addSteam"
                checked={options.styling.addSteam}
                onCheckedChange={(checked) =>
                  updateNested("styling", { addSteam: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="addSteam"
                className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5" />
                Add Steam
              </Label>
            </div>

            {/* Add Condensation */}
            <div className="flex items-center space-x-2 pl-2">
              <Checkbox
                id="addCondensation"
                checked={options.styling.addCondensation}
                onCheckedChange={(checked) =>
                  updateNested("styling", { addCondensation: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="addCondensation"
                className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
              >
                <Droplets className="w-3.5 h-3.5" />
                Add Condensation
              </Label>
            </div>

            {/* Reduce Glare */}
            <div className="flex items-center space-x-2 pl-2">
              <Checkbox
                id="reduceGlare"
                checked={options.styling.reduceGlare}
                onCheckedChange={(checked) =>
                  updateNested("styling", { reduceGlare: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="reduceGlare"
                className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
              >
                <Sun className="w-3.5 h-3.5" />
                Reduce Glare
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Prop Suggestions - Show only for reshoot_styled mode */}
        {options.transformMode === "reshoot_styled" && (
          <div className="space-y-2">
            <Label htmlFor="propSuggestions" className="text-sm text-foreground">
              Prop Suggestions (optional)
            </Label>
            <Input
              id="propSuggestions"
              placeholder="e.g., fresh herbs, linen napkin"
              value={options.propSuggestions ?? ""}
              onChange={(e) =>
                updateOptions({ propSuggestions: e.target.value })
              }
              disabled={disabled}
              className="rounded-lg bg-muted/50"
            />
          </div>
        )}

        {/* Brand Truth Notice */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 p-3">
          <div className="flex gap-2">
            <div className="text-blue-600 dark:text-blue-400 mt-0.5">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                Brand Truth Protection: Always On
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Dish Polish controls food improvements. Brand truth is always protected - no invented ingredients or portion changes.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
