"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhanceProgressDialogProps {
  open: boolean;
  stepLabel?: string;
  progress?: number;
}

const steps = [
  "Analyzing image...",
  "Processing enhancement...",
  "Applying transformations...",
  "Finalizing output...",
];

export function EnhanceProgressDialog({
  open,
  stepLabel,
  progress,
}: EnhanceProgressDialogProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [displayProgress, setDisplayProgress] = React.useState(0);

  // Simulate progress if not provided
  React.useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setDisplayProgress(0);
      return;
    }

    if (progress !== undefined) {
      setDisplayProgress(progress);
      return;
    }

    // Auto-progress simulation
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 3000);

    const progressInterval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8;
      });
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [open, progress]);

  const displayStepLabel = stepLabel || steps[currentStep];

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            Enhancing Your Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayStepLabel}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {displayStepLabel}
            </motion.div>
          </AnimatePresence>

          <Progress value={displayProgress} className="h-2" />

          <p className="text-xs text-muted-foreground">
            Please don&apos;t close this tab — your enhancement is being processed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
