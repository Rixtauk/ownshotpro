"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, Gauge } from "lucide-react";
import {
  AutoOptions,
  AutoShotType,
  AutoAngle,
  AutoEnvironment,
  AutoLighting,
  AUTO_SHOT_TYPE_LABELS,
  AUTO_ANGLE_LABELS,
  AUTO_ENVIRONMENT_LABELS,
  AUTO_LIGHTING_LABELS,
} from "@/types/automotive";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

interface AutoOptionsFormProps {
  options: AutoOptions;
  onChange: (options: AutoOptions) => void;
  disabled?: boolean;
}

export function AutoOptionsForm({
  options,
  onChange,
  disabled = false,
}: AutoOptionsFormProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const updateOptions = (updates: Partial<AutoOptions>) => {
    onChange({ ...options, ...updates });
  };

  // Shot type items
  const shotTypeItems: OptionCardItem<AutoShotType>[] = (
    Object.entries(AUTO_SHOT_TYPE_LABELS) as [AutoShotType, string][]
  ).map(([value, label]) => ({
    value,
    title: label,
  }));

  // Angle items (subset for card display)
  const primaryAngles: AutoAngle[] = [
    "three_quarter_front",
    "side_profile",
    "rear_three_quarter",
    "front",
  ];

  const angleItems: OptionCardItem<AutoAngle>[] = primaryAngles.map((value) => ({
    value,
    title: AUTO_ANGLE_LABELS[value],
  }));

  // Environment items
  const environmentItems: OptionCardItem<AutoEnvironment>[] = (
    Object.entries(AUTO_ENVIRONMENT_LABELS) as [AutoEnvironment, string][]
  ).map(([value, label]) => ({
    value,
    title: label,
  }));

  return (
    <Card className="glass-card">
      <CardContent className="p-6 space-y-6">
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

        {/* Camera Angle */}
        <div className="space-y-3">
          <Label className="text-foreground">Camera Angle</Label>
          <OptionCardGroup
            items={angleItems}
            value={options.angle}
            onChange={(value) => updateOptions({ angle: value })}
            disabled={disabled}
            columns={2}
            size="sm"
            aria-label="Camera angle"
          />
          {/* Additional angles dropdown */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              More angles (detail shots)
            </Label>
            <Select
              value={options.angle}
              onValueChange={(value: AutoAngle) =>
                updateOptions({ angle: value })
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  Object.entries(AUTO_ANGLE_LABELS) as [AutoAngle, string][]
                ).map(([angle, label]) => (
                  <SelectItem key={angle} value={angle}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Environment */}
        <div className="space-y-3">
          <Label className="text-foreground">Environment</Label>
          <OptionCardGroup
            items={environmentItems}
            value={options.environment}
            onChange={(value) => updateOptions({ environment: value })}
            disabled={disabled}
            columns={2}
            size="sm"
            aria-label="Environment"
          />
        </div>

        {/* Lighting */}
        <div className="space-y-2">
          <Label className="text-foreground">Lighting Style</Label>
          <Select
            value={options.lighting}
            onValueChange={(value: AutoLighting) =>
              updateOptions({ lighting: value })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries(AUTO_LIGHTING_LABELS) as [AutoLighting, string][]
              ).map(([lighting, label]) => (
                <SelectItem key={lighting} value={lighting}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Strength Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-foreground">Strength</Label>
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

        {/* Reflection Intensity Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-foreground">Reflection Intensity</Label>
            <span className="text-xs text-muted-foreground">
              {options.reflectionIntensity}%
            </span>
          </div>
          <Slider
            value={[options.reflectionIntensity]}
            onValueChange={([value]) =>
              updateOptions({ reflectionIntensity: value })
            }
            min={0}
            max={100}
            step={5}
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Matte</span>
            <span>Mirror Gloss</span>
          </div>
        </div>

        {/* Dramatic Level Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-foreground">Dramatic Level</Label>
            <span className="text-xs text-muted-foreground">
              {options.dramaticLevel}%
            </span>
          </div>
          <Slider
            value={[options.dramaticLevel]}
            onValueChange={([value]) =>
              updateOptions({ dramaticLevel: value })
            }
            min={0}
            max={100}
            step={5}
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>Subtle</span>
            <span>Cinematic</span>
          </div>
        </div>

        {/* Advanced Options - Collapsible */}
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
          <CollapsibleContent className="space-y-3 pt-2">
            {/* Show Movement */}
            <div className="flex items-center space-x-2 pl-2">
              <Checkbox
                id="showMovement"
                checked={options.showMovement}
                onCheckedChange={(checked) =>
                  updateOptions({ showMovement: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="showMovement"
                className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
              >
                <Gauge className="w-3.5 h-3.5" />
                Show Movement (spinning wheels)
              </Label>
            </div>

            {/* Cleanup Reflections */}
            <div className="flex items-center space-x-2 pl-2">
              <Checkbox
                id="cleanupReflections"
                checked={options.cleanupReflections}
                onCheckedChange={(checked) =>
                  updateOptions({ cleanupReflections: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="cleanupReflections"
                className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Cleanup Reflections
              </Label>
            </div>

            {/* Enhance Details */}
            <div className="flex items-center space-x-2 pl-2">
              <Checkbox
                id="enhanceDetails"
                checked={options.enhanceDetails}
                onCheckedChange={(checked) =>
                  updateOptions({ enhanceDetails: checked === true })
                }
                disabled={disabled}
              />
              <Label
                htmlFor="enhanceDetails"
                className="text-sm font-normal cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Enhance Details (chrome, paint, wheels)
              </Label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Vehicle Protection Notice */}
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
                Vehicle Identity Protection: Always On
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Vehicle make, model, body style, and badges are always preserved. Only environment, lighting, and presentation are enhanced.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
