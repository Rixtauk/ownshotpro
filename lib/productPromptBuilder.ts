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
  LifestyleScene,
  ProductScale,
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
 * Lifestyle scene variations for variety on regeneration
 * Each scene has environment, props, and mood options
 */
type LifestyleSceneKey = Exclude<LifestyleScene, "random">;

interface LifestyleSceneData {
  environment: string;
  props: string[];
  moods: string[];
}

const LIFESTYLE_SCENES: Record<LifestyleSceneKey, LifestyleSceneData> = {
  kitchen_counter: {
    environment: "on a clean kitchen counter with natural daylight streaming through a window",
    props: ["fresh herbs in a small pot", "wooden cutting board", "ceramic bowl", "linen kitchen towel", "olive oil bottle"],
    moods: ["bright morning light", "warm afternoon glow", "soft natural daylight"],
  },
  office_desk: {
    environment: "on a modern minimalist office desk with ambient workspace lighting",
    props: ["leather notebook", "elegant pen", "coffee cup", "small succulent plant", "wireless earbuds case"],
    moods: ["focused daylight from window", "warm afternoon ambiance", "soft diffused natural light"],
  },
  outdoor_cafe: {
    environment: "on a charming cafe table with dappled sunlight filtering through foliage",
    props: ["espresso cup and saucer", "croissant on plate", "folded newspaper", "designer sunglasses", "small flower vase"],
    moods: ["golden hour warmth", "bright morning sunshine", "soft afternoon glow"],
  },
  cozy_home: {
    environment: "on a soft knit blanket or throw in a cozy, inviting living space",
    props: ["scented candle", "open book", "warm mug of tea", "reading glasses", "soft wool texture"],
    moods: ["cozy evening lamplight", "soft morning light", "warm golden hour"],
  },
  bathroom_shelf: {
    environment: "on a pristine bathroom shelf or marble vanity with soft, spa-like lighting",
    props: ["small potted orchid", "folded white towel", "decorative candle", "ceramic soap dish", "eucalyptus sprig"],
    moods: ["spa-like calm brightness", "clean natural light", "soft diffused glow"],
  },
  bedside_table: {
    environment: "on a stylish bedside table with soft, intimate ambient lighting",
    props: ["hardcover book", "small table lamp glow", "delicate plant", "jewelry dish", "alarm clock"],
    moods: ["cozy evening warmth", "soft morning awakening", "intimate warm glow"],
  },
  garden_patio: {
    environment: "on an outdoor garden table surrounded by lush greenery and natural elements",
    props: ["potted herbs", "garden flowers in vase", "linen napkin", "terracotta pot", "gardening gloves"],
    moods: ["golden hour sunshine", "bright natural daylight", "dappled afternoon light"],
  },
  living_room: {
    environment: "on a stylish coffee table in an elegant, well-designed living room setting",
    props: ["art book", "decorative sculpture", "small potted plant", "design magazine", "ceramic coaster"],
    moods: ["afternoon window light", "cozy evening ambiance", "bright airy daylight"],
  },
};

/**
 * Helper to get appropriate surfaces based on product scale
 * Large products can't be placed on tabletop surfaces
 */
export function getAvailableSurfaces(scale: ProductScale): SurfaceType[] {
  if (scale === "large" || scale === "extra_large") {
    // Large products: only floor-based or none
    return ["none"];
  }

  // Small and medium products can use all surfaces
  return [
    "none",
    "acrylic",
    "paper",
    "concrete",
    "marble",
    "wood_light",
    "wood_dark",
    "cloth",
  ];
}

/**
 * Get scale-specific camera and staging adjustments
 */
function getScaleAdjustments(scale: ProductScale): string {
  switch (scale) {
    case "small":
      return "Macro product photography optimized for small objects. Close-up perspective emphasizing fine details, textures, and craftsmanship. Controlled studio environment with precise lighting for maximum detail capture.";

    case "medium":
      return "Standard product photography with balanced perspective. Product comfortably fits in frame with appropriate environmental context.";

    case "large":
      return "Large-scale product photography with increased camera distance and environmental context. Product positioned on floor or in room setting with appropriate sense of scale. Professional lighting setup using larger softboxes and room illumination. Wide perspective showing product in realistic spatial context.";

    case "extra_large":
      return "⚠️ EXTRA LARGE SCALE DETECTED - Consider using Automotive preset for vehicles. If proceeding: Expansive environmental photography with significant camera distance. Product requires large space context. Professional studio or outdoor environment with appropriate scale reference.";
  }
}

/**
 * Get randomized lifestyle setup for variety on regeneration
 */
function getRandomLifestyleSetup(scene?: LifestyleScene): {
  scene: LifestyleSceneKey;
  environment: string;
  mood: string;
  props: string[];
} {
  const sceneKeys = Object.keys(LIFESTYLE_SCENES) as LifestyleSceneKey[];

  // Pick random scene if "random" or not specified
  const selectedScene: LifestyleSceneKey =
    scene === "random" || !scene
      ? sceneKeys[Math.floor(Math.random() * sceneKeys.length)]
      : scene as LifestyleSceneKey;

  const sceneData = LIFESTYLE_SCENES[selectedScene];

  // Pick random mood
  const randomMood = sceneData.moods[Math.floor(Math.random() * sceneData.moods.length)];

  // Pick 2 random props
  const shuffledProps = [...sceneData.props].sort(() => 0.5 - Math.random());
  const randomProps = shuffledProps.slice(0, 2);

  return {
    scene: selectedScene,
    environment: sceneData.environment,
    mood: randomMood,
    props: randomProps,
  };
}

/**
 * Build lifestyle-specific prompt with scene variations
 */
function buildLifestylePrompt(options: ProductOptions): string {
  const setup = getRandomLifestyleSetup(options.lifestyleScene);

  return `Lifestyle product photography ${setup.environment}.
Atmosphere: ${setup.mood}.
Scene includes subtle complementary props: ${setup.props.join(", ")}.
Product remains the absolute hero - props enhance but never distract.
Natural, editorial quality that feels authentic and aspirational.`;
}

/**
 * Build surface description including cloth specifics and scale validation
 */
function buildSurfaceDescription(options: ProductOptions): string {
  const { surface, scale } = options;

  // For large products, override surface selection if needed
  if ((scale === "large" || scale === "extra_large") && surface.type !== "none") {
    return "product positioned on floor or in appropriate large-scale room environment";
  }

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

  // Product scale adjustments
  const scaleAdjustments = getScaleAdjustments(options.scale);
  sections.push(`\nSCALE: ${scaleAdjustments}`);

  // Shot type template - use dynamic lifestyle prompt for lifestyle shots
  if (options.shotType === "lifestyle") {
    sections.push(`\nSHOT TYPE: ${buildLifestylePrompt(options)}`);
  } else {
    sections.push(`\nSHOT TYPE: ${SHOT_TYPE_TEMPLATES[options.shotType]}`);
  }

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
