import { Preset, PresetDefinition, EnhanceOptions, TransformMode } from "@/types";
import { PRESETS } from "./presets";

interface PromptParams {
  preset: Preset;
  strength: number; // 0-100
  strictPreservation: boolean;
}

interface InteriorPromptParams {
  transformMode: TransformMode;
  strength: number; // 0-100
  propSuggestions?: string;
}

export function buildEnhancementPrompt(params: PromptParams): string {
  const { preset } = params;

  // Interior now uses buildInteriorPrompt called from API route
  if (preset === "interior") {
    // Fallback for non-interior code paths
    return buildInteriorPrompt({
      transformMode: "retouch",
      strength: 50,
    });
  }

  // Fall back to generic prompt for other presets
  return buildGenericPrompt(params);
}

// =============================================================================
// INTERIOR PRESET - Single-Pass with Geometry First
// =============================================================================

export function buildInteriorPrompt(params: InteriorPromptParams): string {
  const { transformMode, strength, propSuggestions } = params;

  let parts: string[] = [];

  // Strength affects intensity of changes
  const intensityWord = strength <= 25 ? "subtle" : strength <= 50 ? "moderate" : strength <= 75 ? "significant" : "dramatic";
  const changeLevel = strength <= 25 ? "minimal" : strength <= 50 ? "balanced" : strength <= 75 ? "noticeable" : "extensive";

  // Transform mode determines the approach
  switch (transformMode) {
    case "retouch":
      // Polish mode - keeps composition, fixes geometry
      parts.push("Edit this interior photo for a design magazine.");
      parts.push("IMPORTANT: Maintain the EXACT camera angle and composition. Polish the existing shot only.");
      parts.push("Fix the geometry: straighten the horizon, make all vertical lines perfectly vertical.");
      if (strength <= 30) {
        parts.push("Make only subtle corrections - preserve the natural feel of the original photo.");
      } else if (strength <= 60) {
        parts.push("Apply moderate enhancements to lighting and clarity while keeping the authentic atmosphere.");
      } else {
        parts.push("Apply professional-grade corrections and enhancements for maximum impact.");
      }
      break;

    case "reshoot":
      // Recompose mode - true architectural perspective with perpendicular lines
      parts.push("Transform this interior into a professional architectural photograph.");
      parts.push("CRITICAL PERSPECTIVE REQUIREMENT: Reposition the virtual camera to achieve perfect two-point perspective.");
      parts.push("All vertical lines (walls, door frames, windows, furniture edges) must be perfectly vertical - no convergence or lean.");
      parts.push("The camera must be level - horizon line perfectly horizontal.");
      if (strength <= 40) {
        parts.push("Make subtle perspective corrections while keeping a similar viewpoint.");
        parts.push("Slightly extend the frame to show more context.");
      } else if (strength <= 70) {
        parts.push("Reframe the shot with the camera facing the main wall or feature straight-on at 90 degrees.");
        parts.push("Extend the frame width to show more of the room in a balanced composition.");
      } else {
        parts.push("IMPORTANT: Create a dramatically different straight-on shot facing the room's focal point perpendicularly.");
        parts.push("Position as if standing centered in the room, camera at chest height, facing directly at the main feature wall.");
        parts.push("Significantly extend the frame to create a wide, grand architectural composition showing the full space.");
      }
      parts.push("Correct any barrel distortion or lens warping from the original photo.");
      break;

    case "reshoot_styled":
      // Restyle mode - recompose + add décor
      parts.push("Transform this interior into a styled architectural magazine photograph.");
      parts.push("CRITICAL PERSPECTIVE REQUIREMENT: Reposition the virtual camera to achieve perfect two-point perspective.");
      parts.push("All vertical lines must be perfectly vertical - no convergence. Camera must be level.");
      if (strength <= 40) {
        parts.push("Make subtle perspective corrections and add minimal, tasteful styling touches.");
      } else if (strength <= 70) {
        parts.push("Reframe the shot with camera facing the main feature straight-on at 90 degrees.");
        parts.push("Extend the frame to show more of the room in a balanced composition.");
      } else {
        parts.push("IMPORTANT: Create a straight-on shot facing the room's focal point perpendicularly.");
        parts.push("Position centered in the room, camera at chest height, facing directly at the main feature wall.");
        parts.push("Significantly extend the frame to create a wide, grand architectural composition.");
      }
      parts.push("Correct any barrel distortion or lens warping.");

      if (propSuggestions && propSuggestions.trim()) {
        parts.push(`Add these styling items: ${propSuggestions.trim()}.`);
      } else {
        const stylingLevel = strength <= 40 ? "Add a few tasteful accents" : strength <= 70 ? "Add tasteful styling: decorative objects, books, plants" : "Add comprehensive styling: decorative objects, books, plants, artwork, rugs, throws - elevate the entire scene";
        parts.push(`${stylingLevel}.`);
      }
      break;
  }

  // Lighting - intensity based on strength
  if (strength <= 30) {
    parts.push("Gently improve lighting while preserving the natural atmosphere.");
  } else if (strength <= 60) {
    parts.push("Apply clean, bright editorial lighting with neutral white balance.");
  } else {
    parts.push("Apply premium editorial lighting with perfect white balance and beautiful natural light quality.");
  }

  // HDR is now automatic - always recover window detail
  parts.push("Automatically recover detail in highlights and through windows - show the exterior view naturally.");

  // Grade - intensity based on strength
  if (strength <= 30) {
    parts.push("Subtle matte film look.");
  } else {
    parts.push("Premium matte film look with lifted blacks and smooth highlights.");
  }

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
