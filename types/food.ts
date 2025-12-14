// Food category types for OwnShot Pro

// Transform modes for interior food photography
export type TransformMode = "retouch" | "reshoot" | "reshoot_styled";

// Shot type options for food photography
export type FoodShotType = "overhead" | "45-degree" | "straight-on" | "close-up" | "styled-scene";

// Lighting styles for food
export type FoodLighting = "natural" | "studio" | "moody" | "bright-airy";

// Surface types for food photography
export type FoodSurface = "wood" | "marble" | "concrete" | "linen" | "slate" | "white";

// Food boost levels
export type FoodBoost = "off" | "plating" | "appetising" | "hero";

// Finish settings for matte/crisp control
export interface FoodFinish {
  matteCrisp: number; // 0-100: 0=matte, 100=crisp
  saturation: number; // -20 to +20
}

// Styling options for food enhancement
export interface FoodStyling {
  addSteam: boolean;
  addCondensation: boolean;
  reduceGlare: boolean;
}

// Complete food options interface
export interface FoodOptions {
  transformMode: TransformMode;
  shotType: FoodShotType;
  lighting: FoodLighting;
  surface: FoodSurface;
  foodBoost: FoodBoost;
  strength: number; // 0-100 overall intensity
  finish: FoodFinish;
  styling: FoodStyling;
  propSuggestions?: string;
  dishHint?: string; // Optional hint about the dish
}

// UI Labels for transform modes
export const TRANSFORM_MODE_LABELS: Record<TransformMode, { title: string; description: string }> = {
  retouch: {
    title: "Retouch Only",
    description: "Polish existing shot - lighting, color, cleanup"
  },
  reshoot: {
    title: "Reshoot",
    description: "Improve angle, composition, and lighting"
  },
  reshoot_styled: {
    title: "Reshoot + Styling",
    description: "Full magazine-style shot with props and styling"
  }
};

// UI Labels for shot types
export const FOOD_SHOT_TYPE_LABELS: Record<FoodShotType, string> = {
  "overhead": "Overhead (Flat Lay)",
  "45-degree": "45° Angle",
  "straight-on": "Straight-On",
  "close-up": "Close-Up",
  "styled-scene": "Styled Scene"
};

// UI Labels for lighting
export const FOOD_LIGHTING_LABELS: Record<FoodLighting, string> = {
  "natural": "Natural Light",
  "studio": "Studio",
  "moody": "Moody/Dark",
  "bright-airy": "Bright & Airy"
};

// UI Labels for surfaces
export const FOOD_SURFACE_LABELS: Record<FoodSurface, string> = {
  wood: "Wood",
  marble: "Marble",
  concrete: "Concrete",
  linen: "Linen",
  slate: "Slate",
  white: "White/Neutral"
};

// UI Labels for food boost
export const FOOD_BOOST_LABELS: Record<FoodBoost, { title: string; description: string }> = {
  off: { title: "Off", description: "Photo retouch only - no food changes" },
  plating: { title: "Plating Polish", description: "Tidy arrangement, clean plate rim" },
  appetising: { title: "Appetising Upgrade", description: "Improve food appearance (fresher, crispier)" },
  hero: { title: "Hero Restyle", description: "Ad-ready presentation, same dish" },
};

// Default food options
export const DEFAULT_FOOD_OPTIONS: FoodOptions = {
  transformMode: "retouch",
  shotType: "45-degree",
  lighting: "natural",
  surface: "wood",
  foodBoost: "off",
  strength: 60,
  finish: {
    matteCrisp: 55,
    saturation: 0
  },
  styling: {
    addSteam: false,
    addCondensation: false,
    reduceGlare: true
  }
};
