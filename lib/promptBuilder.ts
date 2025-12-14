import { Preset, PresetDefinition, EnhanceOptions, TransformMode } from "@/types";
import { PRESETS } from "./presets";

interface PromptParams {
  preset: Preset;
  strength: number; // 0-100
  strictPreservation: boolean;
}

interface InteriorPromptParams {
  transformMode: TransformMode;
  creativeCrop?: boolean;
  propSuggestions?: string;
}

export function buildEnhancementPrompt(params: PromptParams): string {
  const { preset } = params;

  // Interior now uses buildInteriorPrompt called from API route
  if (preset === "interior") {
    // Fallback for non-interior code paths
    return buildInteriorPrompt({
      transformMode: "retouch",
      creativeCrop: false,
    });
  }

  // Fall back to generic prompt for other presets
  return buildGenericPrompt(params);
}

// =============================================================================
// INTERIOR PRESET - Single-Pass with Geometry First
// =============================================================================

export function buildInteriorPrompt(params: InteriorPromptParams): string {
  const { transformMode, creativeCrop, propSuggestions } = params;

  let parts: string[] = [];

  // Transform mode determines the approach
  switch (transformMode) {
    case "retouch":
      parts.push("Edit this interior photo for a design magazine.");
      parts.push("IMPORTANT: Maintain the EXACT camera angle and composition. Polish the existing shot only.");
      parts.push("Fix the geometry: straighten the horizon, make all vertical lines perfectly vertical.");
      break;

    case "reshoot":
      parts.push("Recreate this interior scene as a professional design magazine photo.");
      parts.push("IMPORTANT: Reshoot from a perfectly straight-on, centered camera position facing the main feature.");
      parts.push("Extend the frame to show more of the room - a wider, more balanced composition.");
      break;

    case "reshoot_styled":
      parts.push("Recreate this interior scene as a professional design magazine photo with full styling.");
      parts.push("IMPORTANT: Reshoot from a perfectly straight-on, centered camera position facing the main feature.");
      parts.push("Extend the frame to show more of the room - a wider, more balanced composition.");
      if (propSuggestions && propSuggestions.trim()) {
        parts.push(`Add these items: ${propSuggestions.trim()}.`);
      } else {
        parts.push("Add tasteful styling: decorative objects, books, plants, artwork, rugs - whatever elevates the scene.");
      }
      break;
  }

  if (creativeCrop) {
    parts.push("Reframe for a balanced, magazine-worthy composition.");
  }

  // Lighting
  parts.push("Apply clean, bright editorial lighting with neutral white balance.");

  // HDR is now automatic - always recover window detail
  parts.push("Automatically recover detail in highlights and through windows - show the exterior view naturally.");

  // Grade
  parts.push("Premium matte film look with lifted blacks and smooth highlights.");

  parts.push("Photorealistic quality. No text or watermarks.");

  return parts.join(" ");
}

// =============================================================================
// GENERIC PROMPT BUILDER (for Product, People, General presets)
// =============================================================================

function buildGenericPrompt(params: PromptParams): string {
  const { preset, strength, strictPreservation } = params;
  const presetDef: PresetDefinition = PRESETS[preset];

  // Map strength 0-100 to descriptive intensity
  const intensityDesc = getIntensityDescription(strength);

  // Build the prompt sections
  const sections: string[] = [];

  // Core instruction
  sections.push(
    `Enhance this image with ${intensityDesc} improvements while strictly preserving the original identity, layout, and key objects.`
  );

  // Preset-specific focus areas
  sections.push(`Focus on: ${presetDef.focusAreas.join(", ")}.`);

  // Enhancement directives based on strength
  sections.push(buildEnhancementDirectives(strength));

  // Preset-specific style hints
  sections.push(`Style guidance: ${presetDef.styleHints.join(". ")}.`);

  // Strict preservation rules
  if (strictPreservation) {
    sections.push(
      "STRICT MODE: Do NOT add or remove any objects, people, or elements. " +
        "Do NOT alter the composition or framing. " +
        "Preserve all existing text, labels, and signage exactly as they appear."
    );
  }

  // Universal rules
  sections.push(
    "IMPORTANT: Do NOT add any new logos, text, watermarks, or branding. " +
      "Do NOT add artificial elements that were not in the original image. " +
      "Maintain the authentic character of the photograph."
  );

  return sections.join("\n\n");
}

function getIntensityDescription(strength: number): string {
  if (strength <= 20) return "subtle";
  if (strength <= 40) return "light";
  if (strength <= 60) return "moderate";
  if (strength <= 80) return "strong";
  return "intensive";
}

function buildEnhancementDirectives(strength: number): string {
  const directives: string[] = [];

  // Always include these
  directives.push("Improve lighting balance and reduce harsh shadows");
  directives.push("Enhance overall sharpness and clarity");

  if (strength >= 30) {
    directives.push("Optimize color vibrancy and saturation");
    directives.push("Clean up minor artifacts and noise");
  }

  if (strength >= 50) {
    directives.push("Balance highlights and shadows for better dynamic range");
    directives.push("Enhance fine details and textures");
  }

  if (strength >= 70) {
    directives.push("Apply professional-grade color correction");
    directives.push("Maximize detail recovery in darker areas");
  }

  return `Enhancements to apply: ${directives.join(". ")}.`;
}
