"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS, type WizardStep } from "@/types/wizard";

interface WizardStepIndicatorProps {
  currentStep: WizardStep;
  compact?: boolean;
}

export function WizardStepIndicator({ currentStep, compact = false }: WizardStepIndicatorProps) {
  const currentStepNumber = WIZARD_STEPS.find((s) => s.id === currentStep)?.number ?? 1;

  // Compact mode for results page - just show dots
  if (compact) {
    return (
      <div className="flex items-center justify-center gap-2 py-2">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = step.number < currentStepNumber;
          const isCurrent = step.number === currentStepNumber;
          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  (isCompleted || isCurrent) && "bg-primary",
                  !isCompleted && !isCurrent && "bg-muted"
                )}
              />
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-6 transition-colors",
                    step.number < currentStepNumber ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 py-4">
      {WIZARD_STEPS.map((step, index) => {
        const isCompleted = step.number < currentStepNumber;
        const isCurrent = step.number === currentStepNumber;
        const isUpcoming = step.number > currentStepNumber;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              {/* Circle/Dot */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-primary text-primary-foreground shadow-md",
                  isUpcoming && "border-muted bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors md:text-sm",
                  (isCurrent || isCompleted) && "text-foreground",
                  isUpcoming && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {/* Connector line */}
            {index < WIZARD_STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-6 h-0.5 w-12 transition-colors md:w-20",
                  step.number < currentStepNumber && "bg-primary",
                  step.number >= currentStepNumber && "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
