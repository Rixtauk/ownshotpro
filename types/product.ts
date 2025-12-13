// Product Mode Types for OwnShot Pro

export type ProductShotType = "packshot" | "lifestyle" | "flatlay";

export type BackgroundStyle = "white" | "light_grey" | "gradient" | "lifestyle";

export type SurfaceType =
  | "none"
  | "acrylic"
  | "paper"
  | "concrete"
  | "marble"
  | "wood_light"
  | "wood_dark"
  | "cloth";

export type ClothType = "linen" | "cotton" | "velvet";

export type CameraAngle = "front" | "three_quarter" | "side" | "top_down" | "macro";

export type Composition = "centered" | "rule_of_thirds" | "hero_negative_space";

export type LightingStyle =
  | "softbox_front"
  | "window_light"
  | "rim_light"
  | "dramatic"
  | "backlit";

export type ShadowType = "none" | "soft_contact" | "crisp" | "drop";

export type ReflectionType = "none" | "subtle" | "strong";

export type ProductPresetType = "amazon" | "brand_hero" | "social" | "catalog" | "custom";

export interface ProductOptions {
  // Quick preset (sets all other values)
  quickPreset: ProductPresetType;

  // Shot type
  shotType: ProductShotType;

  // Background
  background: {
    style: BackgroundStyle;
    color?: string; // hex color
    crispEdges: boolean;
  };

  // Surface
  surface: {
    type: SurfaceType;
    clothType?: ClothType;
    wrinkleAmount?: number; // 0-100
  };

  // Camera
  camera: {
    angle: CameraAngle;
    focalLength: number; // 0-100 (0=wide, 100=compressed/telephoto)
    composition: Composition;
  };

  // Lighting
  lighting: {
    style: LightingStyle;
    glowEnabled: boolean;
    glowIntensity: number; // 0-100
    intensity: number; // 0-100
    matteLevel: number; // 0-100
  };

  // Shadow & Reflection
  shadow: ShadowType;
  reflection: ReflectionType;

  // Label Protection (critical for products)
  labelProtection: {
    enabled: boolean;
    strictness: number; // 0-100 (0=low, 100=high)
  };

  // Cleanup options
  cleanup: {
    removeDust: boolean;
    removeScratches: boolean;
    reduceGlare: boolean;
    straighten: boolean;
    colorAccuracy: boolean;
  };

  // Props (only for lifestyle/flatlay)
  allowProps: boolean;
  propSuggestions?: string;
}

// Default product options
export const DEFAULT_PRODUCT_OPTIONS: ProductOptions = {
  quickPreset: "custom",
  shotType: "packshot",
  background: {
    style: "white",
    crispEdges: true,
  },
  surface: {
    type: "none",
  },
  camera: {
    angle: "front",
    focalLength: 50,
    composition: "centered",
  },
  lighting: {
    style: "softbox_front",
    glowEnabled: false,
    glowIntensity: 30,
    intensity: 70,
    matteLevel: 40,
  },
  shadow: "soft_contact",
  reflection: "none",
  labelProtection: {
    enabled: true,
    strictness: 80,
  },
  cleanup: {
    removeDust: true,
    removeScratches: true,
    reduceGlare: true,
    straighten: true,
    colorAccuracy: true,
  },
  allowProps: false,
};

// Labels for UI display
export const SHOT_TYPE_LABELS: Record<ProductShotType, string> = {
  packshot: "Packshot",
  lifestyle: "Lifestyle",
  flatlay: "Flat Lay",
};

export const BACKGROUND_STYLE_LABELS: Record<BackgroundStyle, string> = {
  white: "Pure White",
  light_grey: "Light Grey",
  gradient: "Gradient Studio",
  lifestyle: "Lifestyle Scene",
};

export const SURFACE_TYPE_LABELS: Record<SurfaceType, string> = {
  none: "None (floating)",
  acrylic: "White Acrylic",
  paper: "Matte Paper",
  concrete: "Concrete",
  marble: "Marble",
  wood_light: "Light Wood",
  wood_dark: "Dark Wood",
  cloth: "Cloth/Fabric",
};

export const CLOTH_TYPE_LABELS: Record<ClothType, string> = {
  linen: "Linen",
  cotton: "Cotton",
  velvet: "Velvet",
};

export const CAMERA_ANGLE_LABELS: Record<CameraAngle, string> = {
  front: "Front-on",
  three_quarter: "3/4 Hero",
  side: "Side Profile",
  top_down: "Top-down",
  macro: "Macro Detail",
};

export const COMPOSITION_LABELS: Record<Composition, string> = {
  centered: "Centered",
  rule_of_thirds: "Rule of Thirds",
  hero_negative_space: "Hero + Negative Space",
};

export const LIGHTING_STYLE_LABELS: Record<LightingStyle, string> = {
  softbox_front: "Softbox (safe)",
  window_light: "Window Light",
  rim_light: "Rim Light",
  dramatic: "Dramatic Studio",
  backlit: "Backlit",
};

export const SHADOW_TYPE_LABELS: Record<ShadowType, string> = {
  none: "None",
  soft_contact: "Soft Contact",
  crisp: "Crisp Shadow",
  drop: "Drop Shadow",
};

export const REFLECTION_TYPE_LABELS: Record<ReflectionType, string> = {
  none: "None",
  subtle: "Subtle",
  strong: "Strong",
};

export const QUICK_PRESET_LABELS: Record<ProductPresetType, string> = {
  amazon: "Amazon Ready",
  brand_hero: "Brand Hero",
  social: "Social Post",
  catalog: "Catalog",
  custom: "Custom",
};
