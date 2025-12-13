"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";

interface OutputPanelProps {
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  canGenerate: boolean;
}

export function OutputPanel({
  isLoading,
  error,
  onGenerate,
  canGenerate,
}: OutputPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Generate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className="w-full h-11 text-base font-medium btn-glass rounded-xl"
          size="lg"
        >
          {isLoading ? "Enhancing..." : "Generate"}
        </Button>

        {/* Status */}
        {isLoading && (
          <p className="text-xs text-muted-foreground text-center">
            Processing... This may take a moment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
