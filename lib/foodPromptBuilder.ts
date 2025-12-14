import {
  FoodOptions,
  TransformMode,
  FoodShotType,
  FoodLighting,
  FoodSurface,
  FoodBoost,
} from "@/types/food";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function strengthTier(strength: number): string {
  if (strength <= 15) return "Minimal (technical corrections only)";
  if (strength <= 35) return "Subtle (natural menu photo)";
  if (strength <= 65) return "Standard (marketing-ready)";
  if (strength <= 85) return "High polish (editorial menu hero)";
  return "Maximum polish (ad-ready, still photoreal)";
}

function matteInstruction(matte: number): string {
  if (matte <= 20) return "crisp, clean, modern finish (not overly sharp)";
  if (matte <= 55) return "balanced finish with gentle highlight roll-off";
  if (matte <= 80) return "premium matte/filmic finish with lifted blacks and soft contrast";
  return "strong matte/filmic finish with very smooth highlights (still realistic)";
}

function saturationInstruction(sat: number): string {
  if (sat <= -10) return "muted editorial saturation (restrained, premium)";
  if (sat < 0) return "slightly muted saturation (editorial)";
  if (sat === 0) return "natural, true-to-life saturation";
  if (sat <= 10) return "slightly richer saturation (appetising but realistic)";
  return "more vibrant saturation (still believable, avoid neon/oversaturation)";
}

function transformModeBlock(mode: TransformMode): string {
  switch (mode) {
    case "retouch":
      return `TRANSFORM MODE: Retouch Only (Hard Constraint)
- Keep the same camera angle and framing as much as possible.
- Do NOT add props. Do NOT change the scene.
- Only lighting/color/cleanup/sharpness improvements.`;
    case "reshoot":
      return `TRANSFORM MODE: Reshoot (Composition Allowed)
- You may improve framing and composition (crop/reframe) for a more professional shot.
- You may reduce phone wide-angle distortion; simulate a natural lens look.
- Do NOT add extra props unless explicitly requested.`;
    case "reshoot_styled":
      return `TRANSFORM MODE: Styled (Reshoot + Minimal Props)
- You may improve framing/composition and add a SMALL number of tasteful props that support the dish.
- Props must be minimal, realistic, and not distract from the food.`;
  }
}

function shotTypeBlock(shotType: FoodShotType): string {
  switch (shotType) {
    case "overhead":
      return `SHOT TYPE: Top-Down Flat Lay
- Use a true top-down angle (90°) if reshoot is allowed.
- Composition: clean, intentional spacing; centered or rule-of-thirds.
- Keep background simple; avoid clutter.`;
    case "45-degree":
      return `SHOT TYPE: 45° Hero
- Use a flattering 30–60° angle (table-level but slightly elevated) if reshoot is allowed.
- Emphasize layers, height, and the most appetising side of the dish.
- Keep the plate edges clean and framing intentional.`;
    case "straight-on":
      return `SHOT TYPE: Straight-On
- Eye-level shot, perfect for burgers, sandwiches, and layered dishes.
- Emphasizes height and cross-section details.`;
    case "close-up":
      return `SHOT TYPE: Macro Detail
- Create a tight, appetising close-up that emphasizes texture (crisp edges, sauce sheen, garnish detail).
- Subtle depth-of-field look is allowed (photoreal).
- Avoid making the food look fake or overly glossy.`;
    case "styled-scene":
      return `SHOT TYPE: Table Scene
- A premium restaurant table vibe: dish remains the hero, background is supportive and uncluttered.
- Keep props minimal and tasteful (only if styling is allowed).`;
  }
}

function lightingBlock(lighting: FoodLighting): string {
  switch (lighting) {
    case "natural":
      return `LIGHTING STYLE: Bright Daylight Menu Look
- Soft, bright, natural daylight feel.
- Clean whites, controlled highlights, gentle shadows.
- No harsh phone flash look.`;
    case "studio":
      return `LIGHTING STYLE: Studio
- Professional studio lighting - clean, even illumination with controlled shadows.
- Commercial product quality ideal for catalogs and advertising.`;
    case "moody":
      return `LIGHTING STYLE: Moody Editorial
- Directional soft light, deeper shadows, premium contrast.
- Controlled highlights, rich midtones, cinematic but still appetising.
- Keep the food readable (don't crush shadows).`;
    case "bright-airy":
      return `LIGHTING STYLE: Warm & Cozy Restaurant
- Warm ambient feel with clean color balance (avoid yellow/orange cast).
- Soft highlights, inviting warmth, natural skin/wood tones if present.`;
  }
}

function surfaceBlock(surface: FoodSurface): string {
  switch (surface) {
    case "wood":
      return `SURFACE/BACKGROUND: Use a premium natural wood tabletop surface (clean, subtle grain).`;
    case "marble":
      return `SURFACE/BACKGROUND: Use a light marble surface (premium, minimal pattern, not distracting).`;
    case "concrete":
      return `SURFACE/BACKGROUND: Use a dark stone/slate surface for a premium restaurant feel.`;
    case "linen":
      return `SURFACE/BACKGROUND: Use a neutral linen texture (subtle, premium, not busy).`;
    case "slate":
      return `SURFACE/BACKGROUND: Use dark slate or stone surface for contrast.`;
    case "white":
      return `SURFACE/BACKGROUND: A clean solid white background or gentle studio gradient (premium catalog/menu style).`;
  }
}

function foodBoostBlock(boost: FoodBoost): string {
  switch (boost) {
    case "off":
      return `FOOD BOOST: OFF
- Do not change the food itself. Retouch only (light/color/cleanup).`;
    case "plating":
      return `FOOD BOOST: Plating Polish
- You may tidy plating: clean plate rim, remove smudges/crumbs, and slightly reposition existing elements for a more intentional presentation.
- Do not add new ingredients.`;
    case "appetising":
      return `FOOD BOOST: Appetising Upgrade - MAKE THE FOOD LOOK BETTER

YOUR MAIN TASK: Significantly improve how the food looks. Make it look like a professional food advertisement.

SPECIFICALLY DO THESE THINGS:
- BUNS/BREAD: Make them look fresh, evenly browned, with an appetising golden sheen. Fix any dull or flat areas.
- CHEESE: Make melted cheese look smooth, gooey, and perfectly melted. Improve the drape and texture.
- MEAT/PATTY: Make it look juicy and well-cooked, not dry or grey.
- GREENS/SALAD: Make lettuce and greens look crisp, fresh, and vibrant - not limp or wilted.
- FRIES: Make them look golden, crispy, and perfectly cooked - not pale or soggy.
- SAUCES: Make them look glossy and appetising.
- OVERALL: Clean up any mess, smudges, or unappealing areas. Make the presentation look intentional.

KEEP THE SAME DISH - don't add new ingredients that aren't there, but DO make what's there look much better.`;
    case "hero":
      return `FOOD BOOST: Hero Restyle - MAXIMUM FOOD STYLING

YOUR MAIN TASK: Transform this into an advertisement-quality hero shot. Make it look PERFECT.

GO ALL OUT:
- Make every element look absolutely perfect and mouth-watering.
- Perfect the shapes, textures, and presentation of all food elements.
- The bun should look like it came from a professional food stylist.
- The cheese should have that perfect melt you see in commercials.
- Fries should look golden and crispy like in fast food ads.
- Everything should look fresh, vibrant, and irresistible.
- Clean up everything - this should look like a hero shot for an ad campaign.

STILL KEEP IT THE SAME DISH - same type of food, same core items. But make it look stunning.`;
  }
}

function conditionalEffectsBlock(options: FoodOptions): string {
  const parts: string[] = [];

  if (options.styling.addSteam) {
    parts.push(`STEAM:
- If the dish appears hot (e.g., grilled meat, soup, coffee), add subtle realistic steam.
- Keep it minimal and believable. If the dish is not hot, do not add steam.`);
  }

  if (options.styling.addCondensation) {
    parts.push(`CONDENSATION:
- If there is a cold drink present, add subtle realistic condensation droplets.
- If no drink is present, ignore this instruction.`);
  }

  if (options.styling.reduceGlare) {
    parts.push(`GLARE CONTROL:
- Reduce harsh glare on sauces, plates, cutlery, or glossy ingredients while keeping realistic specular highlights.`);
  }

  return parts.join("\n\n");
}

export function buildFoodPrompt(options: FoodOptions): string {
  // Normalize values
  const matte = clamp(options.finish.matteCrisp, 0, 100);
  const saturation = clamp(options.finish.saturation, -20, 20);
  const strength = clamp(options.strength, 0, 100);
  const dishHint = (options.dishHint ?? "").trim();
  const propSuggestions = (options.propSuggestions ?? "").trim();
  const boostEnabled = options.foodBoost !== "off";

  // Base rules - softer when food boost is enabled
  const BASE_RULES = boostEnabled
    ? `You are a professional food stylist creating advertisement-quality food photography.

TASK: Generate a NEW, improved version of this food photo where the food looks significantly more appetising and delicious. This is NOT a simple edit - you must REGENERATE the food to look better.

WHAT TO GENERATE:
- The SAME type of dish (same food items visible)
- But with MUCH better appearance - like a professional food ad
- Fresh, vibrant, appetising, mouth-watering

DO NOT:
- Invent completely different food items
- Add text, logos, or branding
- Make it look like CGI or illustration

OUTPUT:
- Return one final image only. No text.`
    : `You are a professional food photographer + editorial retoucher.

HARD RULES (must follow):
- Keep the dish recognizable and truthful to the original photo.
- Do NOT invent new ingredients or change the dish into something else.
- Do NOT add text, logos, watermarks, menus, or branding.
- Photorealistic only (no CGI/illustration look).
- If packaging/labels/text exist, keep them EXACTLY unchanged (do not rewrite or guess text).
- Keep portion size and quantity roughly consistent (no huge size changes).

OUTPUT:
- Return one final edited image only. No text response.`;

  const dishHintLine = dishHint
    ? `DISH HINT (use only as context, do not invent new items): ${dishHint}`
    : "";

  const COMPOSITION_RULES = `COMPOSITION:
- Make the subject look intentional and appetising.
- Remove awkward empty space via crop/reframe if allowed by transform mode.
- Keep the dish as the hero; background must not compete.`;

  const propLine =
    options.transformMode === "reshoot_styled" && propSuggestions
      ? `PROP SUGGESTIONS (max 3, minimal): ${propSuggestions}`
      : "";

  const FINISH = `FINISH / GRADE:
- Strength: ${strength}/100 (${strengthTier(strength)})
- Finish: ${matteInstruction(matte)}
- Saturation: ${saturationInstruction(saturation)}
- Editorial quality: clean white balance, controlled highlights, gentle shadows.
- Avoid HDR look, avoid crunchy sharpening, preserve natural food texture (no plastic smoothing).`;

  // Strong closing reminder when boost is enabled
  const CLOSING_REMINDER = boostEnabled
    ? `CRITICAL: You must GENERATE a new image where the food looks NOTICEABLY BETTER than the input. The bun must look fresher and more golden. The cheese must look more melted and gooey. Any fries must look crispier. Do NOT just apply filters - actually regenerate improved food. The difference should be obvious when comparing before and after.`
    : null;

  // Assemble in fixed order for predictability
  // IMPORTANT: Food Boost comes EARLY (right after base rules) so the AI prioritizes it
  const sections = [
    BASE_RULES,
    boostEnabled ? foodBoostBlock(options.foodBoost) : null, // Food boost FIRST when enabled
    dishHintLine,
    transformModeBlock(options.transformMode),
    shotTypeBlock(options.shotType),
    COMPOSITION_RULES,
    surfaceBlock(options.surface),
    lightingBlock(options.lighting),
    !boostEnabled ? foodBoostBlock(options.foodBoost) : null, // Food boost at end when OFF
    conditionalEffectsBlock(options),
    propLine,
    FINISH,
    CLOSING_REMINDER, // Reinforce the main task at the end
  ].filter(Boolean);

  return sections.join("\n\n");
}

// Helper function to build from FoodOptions object (for API compatibility)
export function buildFoodPromptFromOptions(options: FoodOptions): string {
  return buildFoodPrompt(options);
}
