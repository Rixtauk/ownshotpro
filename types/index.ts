// Preset types
export type Preset = "interior" | "product" | "people" | "general";

// Re-export product types
export * from "./product";

// Aspect ratio options
export type AspectRatio = "match" | "1:1" | "4:5" | "16:9" | "3:2" | "9:16";

// Image size options
export type ImageSize = "1K" | "2K" | "4K";

// Interior enhancement mode (checkbox-based)
export type InteriorMode = "retouch" | "reshoot" | "reshoot-styling";

// Enhancement options passed to API
export interface EnhanceOptions {
  preset: Preset;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  strength: number; // 0-100
  strictPreservation: boolean; // Legacy - kept for non-interior presets
  // Interior-specific options
  magazineReshoot?: boolean;  // Enable reshoot mode (geometry + composition)
  allowStyling?: boolean;     // Enable styling additions (props)
  hdrWindows?: boolean;       // Recover window/exterior detail
  creativeCrop?: boolean;     // Allow reframing for better composition
  propSuggestions?: string;   // Custom prop suggestions text
}

// Preset definition structure
export interface PresetDefinition {
  id: Preset;
  label: string;
  description: string;
  focusAreas: string[];
  styleHints: string[];
}

// Form state
export interface FormState {
  file: File | null;
  originalPreview: string | null;
  enhancedImage: string | null;
  isLoading: boolean;
  error: string | null;
  options: EnhanceOptions;
}

// Helper to get interior mode from options
export function getInteriorMode(options: Pick<EnhanceOptions, "magazineReshoot" | "allowStyling">): InteriorMode {
  if (!options.magazineReshoot) return "retouch";
  if (!options.allowStyling) return "reshoot";
  return "reshoot-styling";
}

// Interior mode labels for UI
export const INTERIOR_MODE_LABELS: Record<InteriorMode, string> = {
  retouch: "Retouch (polish only)",
  reshoot: "Reshoot (geometry + composition)",
  "reshoot-styling": "Reshoot + Styling (full magazine)",
};
