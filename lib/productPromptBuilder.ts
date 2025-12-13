import type {
  ProductOptions,
  ProductShotType,
  BackgroundStyle,
  SurfaceType,
  CameraAngle,
  Composition,
  LightingStyle,
  ShadowType,
  ReflectionType,
  ClothType,
} from "@/types/product";

/**
 * Base rules that are always prepended to product prompts
 * These protect product identity, branding, and ensure photorealistic output
 */
const BASE_RULES = `CRITICAL RULES:
- Product identity MUST be preserved exactly - do not modify shape, design, branding, or text
- All labels, logos, and text on product MUST remain readable and unaltered
- Product must be photorealistic, professional e-commerce quality
- No artistic interpretations or creative liberties with the product itself
- Maintain accurate colors and materials of the original product
- Only modify background, lighting, and staging as directed`;

/**
 * Shot type templates for different product photography styles
 */
const SHOT_TYPE_TEMPLATES: Record<ProductShotType, string> = {
  packshot: `Studio packshot for e-commerce. Clean, professional product photography with controlled studio lighting. Product should be sharp, well-defined, and ready for online retail.`,

  lifestyle: `Lifestyle product photography showing the product in a real-world environment. Natural setting that suggests product use context while keeping product as the hero element.`,

  flatlay: `Top-down flat lay arrangement. Product artfully arranged from directly above, perfect for cosmetics, accessories, and lifestyle products. Clean, organized composition.`,
};

/**
 * Background style descriptions
 */
const BACKGROUND_STYLES: Record<BackgroundStyle, string> = {
  white: "pure white background (#FFFFFF), seamless studio backdrop",
  light_grey: "light grey background (#F5F5F5), subtle neutral backdrop",
  gradient: "subtle gradient studio backdrop transitioning from white to light grey",
  lifestyle: "natural lifestyle environment appropriate to product context",
};

/**
 * Surface type descriptions
 */
const SURFACE_DESCRIPTIONS: Record<SurfaceType, string> = {
  none: "product floating cleanly with no visible surface",
  acrylic: "white acrylic surface with subtle reflective properties",
  paper: "matte paper surface with no reflections",
  concrete: "smooth concrete surface with natural texture",
  marble: "white marble surface with natural veining",
  wood_light: "light natural wood surface with visible grain",
  wood_dark: "dark wood surface with rich grain patterns",
  cloth: "fabric surface", // Extended with cloth type
};

/**
 * Cloth type descriptions
 */
const CLOTH_DESCRIPTIONS: Record<ClothType, string> = {
  linen: "natural linen fabric with characteristic texture",
  cotton: "soft cotton fabric with gentle weave",
  velvet: "luxurious velvet fabric with rich texture",
};

/**
 * Camera angle descriptions
 */
const CAMERA_ANGLES: Record<CameraAngle, string> = {
  front: "straight-on front view, product facing camera directly",
  three_quarter: "3/4 angle hero shot showing front and side",
  side: "side profile view emphasizing product silhouette",
  top_down: "directly overhead top-down view",
  macro: "macro close-up showing product details and texture",
};

/**
 * Composition styles
 */
const COMPOSITIONS: Record<Composition, string> = {
  centered: "product perfectly centered in frame",
  rule_of_thirds: "product positioned using rule of thirds for dynamic composition",
  hero_negative_space: "product as hero with generous negative space around it",
};

/**
 * Lighting style descriptions
 */
const LIGHTING_STYLES: Record<LightingStyle, string> = {
  softbox_front: "soft, even front lighting from softbox, minimal shadows",
  window_light: "natural window light with soft, directional quality",
  rim_light: "rim lighting emphasizing product edges and form",
  dramatic: "dramatic studio lighting with strong highlights and shadows",
  backlit: "backlit setup with glow around product edges",
};

/**
 * Shadow type descriptions
 */
const SHADOW_DESCRIPTIONS: Record<ShadowType, string> = {
  none: "no visible shadow",
  soft_contact: "soft contact shadow directly beneath product",
  crisp: "crisp, defined shadow with clear edges",
  drop: "drop shadow extending away from product",
};

/**
 * Reflection type descriptions
 */
const REFLECTION_DESCRIPTIONS: Record<ReflectionType, string> = {
  none: "no reflection",
  subtle: "subtle reflection on surface beneath product",
  strong: "strong mirror-like reflection",
};

/**
 * Build surface description including cloth specifics
 */
function buildSurfaceDescription(options: ProductOptions): string {
  const { surface } = options;

  if (surface.type === "none") {
    return SURFACE_DESCRIPTIONS.none;
  }

  if (surface.type === "cloth" && surface.clothType) {
    const clothDesc = CLOTH_DESCRIPTIONS[surface.clothType];
    const wrinkleDesc = surface.wrinkleAmount !== undefined
      ? surface.wrinkleAmount < 20
        ? " pressed smooth with minimal wrinkles"
        : surface.wrinkleAmount < 50
        ? " with natural subtle wrinkles"
        : surface.wrinkleAmount < 80
        ? " with visible wrinkles and natural folds"
        : " with pronounced wrinkles and organic folds"
      : "";

    return `${clothDesc}${wrinkleDesc}`;
  }

  return SURFACE_DESCRIPTIONS[surface.type];
}

/**
 * Build background description
 */
function buildBackgroundDescription(options: ProductOptions): string {
  const { background } = options;

  let desc = BACKGROUND_STYLES[background.style];

  if (background.color) {
    desc += `, custom background color ${background.color}`;
  }

  if (background.crispEdges) {
    desc += ". Product edges must be crisp and perfectly cut out";
  }

  return desc;
}

/**
 * Build camera description
 */
function buildCameraDescription(options: ProductOptions): string {
  const { camera } = options;

  let desc = CAMERA_ANGLES[camera.angle];
  desc += `. ${COMPOSITIONS[camera.composition]}.`;

  // Focal length interpretation
  if (camera.focalLength < 35) {
    desc += " Wide angle lens perspective with slight environmental context";
  } else if (camera.focalLength < 65) {
    desc += " Standard focal length with natural perspective";
  } else {
    desc += " Compressed telephoto perspective with shallow depth, professional product photography look";
  }

  return desc;
}

/**
 * Build lighting description including glow effects
 */
function buildLightingDescription(options: ProductOptions): string {
  const { lighting } = options;

  let desc = LIGHTING_STYLES[lighting.style];

  // Intensity
  if (lighting.intensity < 30) {
    desc += ", low key moody lighting";
  } else if (lighting.intensity < 70) {
    desc += ", balanced studio lighting";
  } else {
    desc += ", bright, high-key lighting";
  }

  // Matte level
  if (lighting.matteLevel > 70) {
    desc += ", very matte finish with minimal specular highlights";
  } else if (lighting.matteLevel > 40) {
    desc += ", semi-matte finish with controlled highlights";
  } else {
    desc += ", glossy finish with strong specular highlights";
  }

  // Glow effect (for bottles, tech products, etc.)
  if (lighting.glowEnabled) {
    if (lighting.glowIntensity < 30) {
      desc += ". Subtle glow effect around product";
    } else if (lighting.glowIntensity < 70) {
      desc += ". Moderate glow effect highlighting product";
    } else {
      desc += ". Strong ethereal glow effect emphasizing product";
    }
  }

  return desc;
}

/**
 * Build label protection instructions
 */
function buildLabelProtection(options: ProductOptions): string {
  const { labelProtection } = options;

  if (!labelProtection.enabled) {
    return "";
  }

  let protection = "\n\nLABEL PROTECTION: ";

  if (labelProtection.strictness < 30) {
    protection += "Preserve main brand name and logo. Minor label details may vary slightly.";
  } else if (labelProtection.strictness < 70) {
    protection += "All text, logos, and branding must remain clearly readable and accurate.";
  } else {
    protection += "STRICT - Every letter, number, logo, and design element on product labels must be EXACTLY preserved. Zero tolerance for text modifications.";
  }

  return protection;
}

/**
 * Build cleanup instructions
 */
function buildCleanupInstructions(options: ProductOptions): string {
  const { cleanup } = options;
  const instructions: string[] = [];

  if (cleanup.removeDust) {
    instructions.push("remove any dust or particles");
  }
  if (cleanup.removeScratches) {
    instructions.push("remove scratches and imperfections");
  }
  if (cleanup.reduceGlare) {
    instructions.push("reduce excessive glare and hot spots");
  }
  if (cleanup.straighten) {
    instructions.push("ensure product is perfectly straight and aligned");
  }
  if (cleanup.colorAccuracy) {
    instructions.push("maintain accurate product colors");
  }

  if (instructions.length === 0) {
    return "";
  }

  return `\n\nCLEANUP: ${instructions.join(", ")}.`;
}

/**
 * Build props description (only for lifestyle/flatlay)
 */
function buildPropsDescription(options: ProductOptions): string {
  const { shotType, allowProps, propSuggestions } = options;

  // Props only allowed for lifestyle and flatlay
  if (shotType === "packshot" || !allowProps) {
    return "";
  }

  let desc = "\n\nPROPS: ";

  if (propSuggestions && propSuggestions.trim()) {
    desc += `Include the following props to enhance the scene: ${propSuggestions}. `;
  } else {
    // Default prop suggestions based on shot type
    if (shotType === "lifestyle") {
      desc += "Include contextual props that suggest product usage and lifestyle setting. ";
    } else if (shotType === "flatlay") {
      desc += "Include complementary items arranged artfully in flat lay composition. ";
    }
  }

  desc += "Props should support the product as hero, not distract from it.";

  return desc;
}

/**
 * Main function to build the complete product prompt
 */
export function buildProductPrompt(options: ProductOptions): string {
  const sections: string[] = [];

  // Always start with base rules
  sections.push(BASE_RULES);

  // Shot type template
  sections.push(`\nSHOT TYPE: ${SHOT_TYPE_TEMPLATES[options.shotType]}`);

  // Background
  sections.push(`\nBACKGROUND: ${buildBackgroundDescription(options)}`);

  // Surface
  const surfaceDesc = buildSurfaceDescription(options);
  sections.push(`\nSURFACE: ${surfaceDesc}`);

  // Camera
  sections.push(`\nCAMERA: ${buildCameraDescription(options)}`);

  // Lighting
  sections.push(`\nLIGHTING: ${buildLightingDescription(options)}`);

  // Shadow
  if (options.shadow !== "none") {
    sections.push(`\nSHADOW: ${SHADOW_DESCRIPTIONS[options.shadow]}`);
  }

  // Reflection
  if (options.reflection !== "none") {
    sections.push(`\nREFLECTION: ${REFLECTION_DESCRIPTIONS[options.reflection]}`);
  }

  // Label protection (critical for products)
  const labelProtection = buildLabelProtection(options);
  if (labelProtection) {
    sections.push(labelProtection);
  }

  // Cleanup instructions
  const cleanup = buildCleanupInstructions(options);
  if (cleanup) {
    sections.push(cleanup);
  }

  // Props (only for lifestyle/flatlay when allowed)
  const props = buildPropsDescription(options);
  if (props) {
    sections.push(props);
  }

  // Join all sections
  return sections.join("\n");
}

/**
 * Helper function to preview prompt for debugging/UI display
 */
export function getPromptPreview(options: ProductOptions, maxLength: number = 200): string {
  const fullPrompt = buildProductPrompt(options);
  if (fullPrompt.length <= maxLength) {
    return fullPrompt;
  }
  return fullPrompt.substring(0, maxLength) + "...";
}
