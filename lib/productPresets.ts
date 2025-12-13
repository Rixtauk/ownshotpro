import {
  ProductOptions,
  ProductPresetType,
  DEFAULT_PRODUCT_OPTIONS,
} from "@/types/product";

// Quick preset configurations
export const PRODUCT_QUICK_PRESETS: Record<ProductPresetType, Partial<ProductOptions>> = {
  amazon: {
    quickPreset: "amazon",
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
      glowIntensity: 0,
      intensity: 80,
      matteLevel: 30,
    },
    shadow: "soft_contact",
    reflection: "none",
    labelProtection: {
      enabled: true,
      strictness: 90,
    },
    cleanup: {
      removeDust: true,
      removeScratches: true,
      reduceGlare: true,
      straighten: true,
      colorAccuracy: true,
    },
    allowProps: false,
  },

  brand_hero: {
    quickPreset: "brand_hero",
    shotType: "packshot",
    background: {
      style: "gradient",
      crispEdges: true,
    },
    surface: {
      type: "acrylic",
    },
    camera: {
      angle: "three_quarter",
      focalLength: 70,
      composition: "rule_of_thirds",
    },
    lighting: {
      style: "rim_light",
      glowEnabled: false,
      glowIntensity: 0,
      intensity: 75,
      matteLevel: 40,
    },
    shadow: "crisp",
    reflection: "subtle",
    labelProtection: {
      enabled: true,
      strictness: 85,
    },
    cleanup: {
      removeDust: true,
      removeScratches: true,
      reduceGlare: false,
      straighten: true,
      colorAccuracy: true,
    },
    allowProps: false,
  },

  social: {
    quickPreset: "social",
    shotType: "lifestyle",
    background: {
      style: "lifestyle",
      crispEdges: false,
    },
    surface: {
      type: "wood_light",
    },
    camera: {
      angle: "three_quarter",
      focalLength: 60,
      composition: "rule_of_thirds",
    },
    lighting: {
      style: "window_light",
      glowEnabled: false,
      glowIntensity: 0,
      intensity: 65,
      matteLevel: 50,
    },
    shadow: "soft_contact",
    reflection: "none",
    labelProtection: {
      enabled: true,
      strictness: 75,
    },
    cleanup: {
      removeDust: true,
      removeScratches: false,
      reduceGlare: true,
      straighten: false,
      colorAccuracy: true,
    },
    allowProps: true,
    propSuggestions: "greenery, coffee cup, natural elements",
  },

  catalog: {
    quickPreset: "catalog",
    shotType: "packshot",
    background: {
      style: "light_grey",
      crispEdges: true,
    },
    surface: {
      type: "paper",
    },
    camera: {
      angle: "front",
      focalLength: 55,
      composition: "centered",
    },
    lighting: {
      style: "softbox_front",
      glowEnabled: false,
      glowIntensity: 0,
      intensity: 75,
      matteLevel: 35,
    },
    shadow: "drop",
    reflection: "none",
    labelProtection: {
      enabled: true,
      strictness: 85,
    },
    cleanup: {
      removeDust: true,
      removeScratches: true,
      reduceGlare: true,
      straighten: true,
      colorAccuracy: true,
    },
    allowProps: false,
  },

  custom: {
    quickPreset: "custom",
  },
};

// Apply a quick preset to get full ProductOptions
export function applyProductPreset(presetType: ProductPresetType): ProductOptions {
  if (presetType === "custom") {
    return { ...DEFAULT_PRODUCT_OPTIONS, quickPreset: "custom" };
  }

  const preset = PRODUCT_QUICK_PRESETS[presetType];
  return {
    ...DEFAULT_PRODUCT_OPTIONS,
    ...preset,
    background: {
      ...DEFAULT_PRODUCT_OPTIONS.background,
      ...preset.background,
    },
    surface: {
      ...DEFAULT_PRODUCT_OPTIONS.surface,
      ...preset.surface,
    },
    camera: {
      ...DEFAULT_PRODUCT_OPTIONS.camera,
      ...preset.camera,
    },
    lighting: {
      ...DEFAULT_PRODUCT_OPTIONS.lighting,
      ...preset.lighting,
    },
    labelProtection: {
      ...DEFAULT_PRODUCT_OPTIONS.labelProtection,
      ...preset.labelProtection,
    },
    cleanup: {
      ...DEFAULT_PRODUCT_OPTIONS.cleanup,
      ...preset.cleanup,
    },
  } as ProductOptions;
}

// Preset descriptions for UI
export const PRESET_DESCRIPTIONS: Record<ProductPresetType, string> = {
  amazon: "Pure white background, front-on, clean shadows - marketplace ready",
  brand_hero: "Gradient background, rim lighting, premium feel for brand sites",
  social: "Lifestyle scene with props, warm and inviting for social media",
  catalog: "Light grey background, drop shadow - professional catalog style",
  custom: "Configure all settings manually",
};
