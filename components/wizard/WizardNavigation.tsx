"use client";

import * as React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type WizardStep } from "@/types/wizard";

interface WizardNavigationProps {
  currentStep: WizardStep;
  canProceed: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}

export function WizardNavigation({
  currentStep,
  canProceed,
  isLoading = false,
  onBack,
  onNext,
  nextLabel,
}: WizardNavigationProps) {
  const showBackButton = currentStep !== "upload";

  // Determine the next button label
  const getNextLabel = () => {
    if (nextLabel) return nextLabel;
    if (currentStep === "upload") return "Continue";
    if (currentStep === "configure") return "Generate";
    return "Continue";
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
      {/* Back Button */}
      {showBackButton ? (
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next/Action Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed || isLoading}
        className="w-full sm:w-auto sm:min-w-32"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {getNextLabel()}
      </Button>
    </div>
  );
}
