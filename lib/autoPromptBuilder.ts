import type {
  AutoOptions,
  AutoShotType,
  AutoAngle,
  AutoEnvironment,
  AutoLighting,
} from "@/types/automotive";

/**
 * Base rules that are always prepended to automotive prompts
 * These protect vehicle identity and ensure photorealistic output
 */
const BASE_RULES = `CRITICAL RULES:
- Vehicle identity MUST be preserved exactly - do not modify make, model, body style, or distinctive features
- All badges, logos, license plates, and vehicle markings must remain readable and unaltered
- Vehicle must be photorealistic, professional automotive photography quality
- No artistic interpretations or creative liberties with the vehicle itself
- Maintain accurate colors, paint finish, and materials of the original vehicle
- Only modify environment, lighting, reflections, and staging as directed`;

/**
 * Shot type templates for different automotive photography styles
 */
const SHOT_TYPE_TEMPLATES: Record<AutoShotType, string> = {
  studio: `Professional studio automotive photography. Controlled environment with seamless backdrop, precision lighting setup. Vehicle should be impeccably presented with careful attention to reflections, highlights, and paint depth.`,

  showroom: `Showroom-style automotive photography. Clean, bright environment that suggests premium retail space. Vehicle displayed in pristine condition with showroom-quality presentation.`,

  outdoor: `Outdoor automotive photography in natural environment. Vehicle shown in real-world setting that complements its character while maintaining professional quality and hero status.`,

  detail: `Automotive detail photography focusing on specific elements. Macro-style close-up showing craftsmanship, materials, and design details. Sharp focus on featured element with appropriate depth of field.`,

  action: `Dynamic action automotive photography. Vehicle captured with sense of motion and energy. May include motion blur effects, rolling shutter, or environmental blur to convey speed and performance.`,
};

/**
 * Camera angle descriptions for vehicles
 */
const ANGLE_DESCRIPTIONS: Record<AutoAngle, string> = {
  three_quarter_front: "classic 3/4 front hero angle showing front fascia and side profile, the most iconic automotive angle",
  side_profile: "pure side profile view emphasizing vehicle silhouette and proportions",
  rear_three_quarter: "3/4 rear angle showing rear design and side character lines",
  front: "straight-on front view showcasing grille, headlights, and front fascia",
  rear: "straight-on rear view featuring taillights and rear design",
  interior: "interior cabin shot showing dashboard, seats, and interior details",
  wheel_detail: "close-up detail of wheel, tire, brake components, and wheel arch",
  engine: "engine bay detail showcasing mechanical components and engineering",
};

/**
 * Environment/scene descriptions
 */
const ENVIRONMENT_DESCRIPTIONS: Record<AutoEnvironment, string> = {
  dark_studio: "dark studio environment with black or charcoal seamless backdrop, dramatic lighting that emphasizes form and reflections",
  white_cyclorama: "pristine white cyclorama studio with seamless infinity backdrop, clean and pure presentation",
  showroom: "upscale automotive showroom with polished floors, subtle architectural elements, premium ambient lighting",
  urban_street: "modern urban street environment with contemporary architecture, clean pavement, city atmosphere",
  mountain_road: "scenic mountain road setting with winding asphalt, natural landscape, sense of adventure",
  coastal: "coastal road environment with ocean views, seaside atmosphere, natural beauty",
  industrial: "industrial setting with concrete, steel, urban textures, edgy contemporary feel",
  parking_garage: "modern parking garage with concrete pillars, dramatic shadows, urban minimalist aesthetic",
};

/**
 * Lighting style descriptions
 */
const LIGHTING_DESCRIPTIONS: Record<AutoLighting, string> = {
  dramatic: "dramatic high-contrast lighting with strong highlights, deep shadows, rim lighting that sculpts vehicle form and creates depth in paint",
  soft_studio: "soft, even studio lighting with controlled reflections, gentle highlights, professional catalog-quality illumination",
  natural: "natural daylight with soft directional quality, authentic outdoor feel, realistic environmental lighting",
  neon: "neon and colored accent lighting with vibrant reflections, contemporary urban aesthetic, bold color accents",
  sunset: "golden hour sunset lighting with warm tones, long shadows, romantic glow and rich color saturation",
  overcast: "soft overcast natural light with diffused even illumination, minimal shadows, muted refined tones",
};

/**
 * Build reflection intensity description
 */
function buildReflectionDescription(intensity: number, cleanup: boolean): string {
  let desc = "";

  if (intensity < 30) {
    desc = "Minimal reflections in paint and chrome, matte-leaning finish";
  } else if (intensity < 70) {
    desc = "Moderate reflections showing environment in paint and glass, balanced depth";
  } else {
    desc = "Strong mirror-like reflections in paint, chrome, and glass, showcasing deep glossy finish";
  }

  if (cleanup) {
    desc += ". Remove distracting or unflattering reflections while preserving paint depth and quality";
  }

  return desc;
}

/**
 * Build dramatic level description
 */
function buildDramaticDescription(level: number): string {
  if (level < 30) {
    return "Subtle, understated presentation with gentle contrast";
  } else if (level < 70) {
    return "Balanced drama with moderate contrast and visual impact";
  } else {
    return "Maximum drama with bold contrast, strong highlights and shadows, cinematic intensity";
  }
}

/**
 * Build movement/motion description
 */
function buildMovementDescription(showMovement: boolean, shotType: AutoShotType): string {
  if (!showMovement) {
    return "";
  }

  if (shotType === "action") {
    return "\n\nMOTION: Dynamic sense of movement with motion blur on wheels (spinning effect), possible environmental blur to convey speed. Vehicle body remains sharp while motion elements create energy.";
  }

  return "\n\nMOTION: Subtle motion blur on wheels only (spinning effect) to add dynamic energy while vehicle remains stationary and sharp.";
}

/**
 * Build detail enhancement description
 */
function buildDetailEnhancement(enhance: boolean): string {
  if (!enhance) {
    return "";
  }

  return `\n\nDETAIL ENHANCEMENT:
- Chrome and metallic elements: crisp highlights, mirror-like finish
- Paint surface: deep glossy appearance with clarity and depth
- Wheels: clean, sharp detail in spokes/design, tire lettering visible
- Glass: crystal clear with appropriate reflections
- Remove dust, dirt, water spots, and imperfections`;
}

/**
 * Build strength-based intensity description
 */
function buildStrengthDescription(strength: number): string {
  if (strength < 30) {
    return "\n\nINTENSITY: Subtle enhancement preserving most of original character. Light touch on environment and lighting adjustments.";
  } else if (strength < 70) {
    return "\n\nINTENSITY: Moderate transformation balancing original and enhanced elements. Professional upgrade while respecting source.";
  } else {
    return "\n\nINTENSITY: Strong transformation with full professional treatment. Maximum environmental and lighting enhancement for hero-level presentation.";
  }
}

/**
 * Main function to build the complete automotive prompt
 */
export function buildAutoPrompt(options: AutoOptions): string {
  const sections: string[] = [];

  // Always start with base rules
  sections.push(BASE_RULES);

  // Shot type template
  sections.push(`\nSHOT TYPE: ${SHOT_TYPE_TEMPLATES[options.shotType]}`);

  // Camera angle
  sections.push(`\nANGLE: ${ANGLE_DESCRIPTIONS[options.angle]}`);

  // Environment
  sections.push(`\nENVIRONMENT: ${ENVIRONMENT_DESCRIPTIONS[options.environment]}`);

  // Lighting
  sections.push(`\nLIGHTING: ${LIGHTING_DESCRIPTIONS[options.lighting]}`);

  // Dramatic level
  sections.push(`\nDRAMA: ${buildDramaticDescription(options.dramaticLevel)}`);

  // Reflections
  sections.push(
    `\nREFLECTIONS: ${buildReflectionDescription(options.reflectionIntensity, options.cleanupReflections)}`
  );

  // Movement/motion (if enabled)
  const movement = buildMovementDescription(options.showMovement, options.shotType);
  if (movement) {
    sections.push(movement);
  }

  // Detail enhancement (if enabled)
  const details = buildDetailEnhancement(options.enhanceDetails);
  if (details) {
    sections.push(details);
  }

  // Strength intensity
  sections.push(buildStrengthDescription(options.strength));

  // Join all sections
  return sections.join("\n");
}

/**
 * Helper function to preview prompt for debugging/UI display
 */
export function getPromptPreview(options: AutoOptions, maxLength: number = 200): string {
  const fullPrompt = buildAutoPrompt(options);
  if (fullPrompt.length <= maxLength) {
    return fullPrompt;
  }
  return fullPrompt.substring(0, maxLength) + "...";
}
