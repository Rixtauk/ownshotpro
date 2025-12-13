import { Preset, PresetDefinition } from "@/types";

export const PRESETS: Record<Preset, PresetDefinition> = {
  interior: {
    id: "interior",
    label: "Interior",
    description: "Magazine-quality matte film finish for architectural & room photos",
    focusAreas: [
      "filmic matte tonal curve",
      "neutral WB with controlled warm practicals",
      "texture preservation (velvet, wood grain)",
      "vertical/perspective correction",
    ],
    styleHints: [
      "lifted blacks, gentle highlight roll-off",
      "muted editorial saturation",
      "no HDR or crispy sharpening",
    ],
  },
  product: {
    id: "product",
    label: "Product",
    description: "Ideal for e-commerce and catalog photography",
    focusAreas: [
      "product edge sharpness",
      "color accuracy",
      "background cleanup",
      "surface reflections and highlights",
    ],
    styleHints: [
      "ensure true-to-life colors",
      "enhance material textures",
      "clean up minor imperfections",
    ],
  },
  people: {
    id: "people",
    label: "People",
    description: "Portrait and lifestyle photography enhancement",
    focusAreas: [
      "skin tone accuracy",
      "facial feature preservation",
      "eye clarity",
      "hair detail",
    ],
    styleHints: [
      "maintain natural skin texture",
      "enhance eye catchlights",
      "preserve facial expressions exactly",
    ],
  },
  general: {
    id: "general",
    label: "General",
    description: "Balanced enhancement for any image type",
    focusAreas: [
      "overall sharpness",
      "color vibrancy",
      "contrast balance",
      "noise reduction",
    ],
    styleHints: [
      "balanced enhancement across all elements",
      "natural-looking improvements",
      "preserve original composition",
    ],
  },
};

export const ASPECT_RATIOS = [
  { value: "match" as const, label: "Match Original" },
  { value: "1:1" as const, label: "1:1 (Square)" },
  { value: "4:5" as const, label: "4:5 (Portrait)" },
  { value: "16:9" as const, label: "16:9 (Widescreen)" },
  { value: "3:2" as const, label: "3:2 (Classic)" },
  { value: "9:16" as const, label: "9:16 (Vertical)" },
];

export const IMAGE_SIZES = [
  { value: "1K" as const, label: "1K (1024px)" },
  { value: "2K" as const, label: "2K (2048px)", default: true },
  { value: "4K" as const, label: "4K (4096px)" },
];
