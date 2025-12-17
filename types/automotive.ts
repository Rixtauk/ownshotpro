// Automotive category types for OwnShot Pro

// Shot type options for automotive photography
export type AutoShotType = "studio" | "showroom" | "outdoor" | "detail" | "action";

// Camera angle options for vehicles
export type AutoAngle =
  | "three_quarter_front"
  | "side_profile"
  | "rear_three_quarter"
  | "front"
  | "rear"
  | "interior"
  | "wheel_detail"
  | "engine";

// Environment/scene options
export type AutoEnvironment =
  | "dark_studio"
  | "white_cyclorama"
  | "showroom"
  | "urban_street"
  | "mountain_road"
  | "coastal"
  | "industrial"
  | "parking_garage";

// Lighting style options
export type AutoLighting =
  | "dramatic"
  | "soft_studio"
  | "natural"
  | "neon"
  | "sunset"
  | "overcast";

// Complete automotive options interface
export interface AutoOptions {
  shotType: AutoShotType;
  angle: AutoAngle;
  environment: AutoEnvironment;
  lighting: AutoLighting;
  reflectionIntensity: number; // 0-100
  dramaticLevel: number; // 0-100
  showMovement: boolean; // motion blur on wheels
  cleanupReflections: boolean;
  enhanceDetails: boolean; // chrome, paint, wheels
  strength: number; // 0-100
}

// UI Labels for shot types
export const AUTO_SHOT_TYPE_LABELS: Record<AutoShotType, string> = {
  studio: "Studio",
  showroom: "Showroom",
  outdoor: "Outdoor",
  detail: "Detail Shot",
  action: "Action Shot",
};

// UI Labels for angles
export const AUTO_ANGLE_LABELS: Record<AutoAngle, string> = {
  three_quarter_front: "3/4 Front (Hero)",
  side_profile: "Side Profile",
  rear_three_quarter: "3/4 Rear",
  front: "Front",
  rear: "Rear",
  interior: "Interior",
  wheel_detail: "Wheel Detail",
  engine: "Engine Bay",
};

// UI Labels for environments
export const AUTO_ENVIRONMENT_LABELS: Record<AutoEnvironment, string> = {
  dark_studio: "Dark Studio",
  white_cyclorama: "White Cyclorama",
  showroom: "Showroom",
  urban_street: "Urban Street",
  mountain_road: "Mountain Road",
  coastal: "Coastal Road",
  industrial: "Industrial",
  parking_garage: "Parking Garage",
};

// UI Labels for lighting
export const AUTO_LIGHTING_LABELS: Record<AutoLighting, string> = {
  dramatic: "Dramatic",
  soft_studio: "Soft Studio",
  natural: "Natural",
  neon: "Neon",
  sunset: "Sunset/Golden Hour",
  overcast: "Overcast",
};

// Default automotive options
export const DEFAULT_AUTO_OPTIONS: AutoOptions = {
  shotType: "studio",
  angle: "three_quarter_front",
  environment: "dark_studio",
  lighting: "dramatic",
  reflectionIntensity: 60,
  dramaticLevel: 50,
  showMovement: false,
  cleanupReflections: true,
  enhanceDetails: true,
  strength: 70,
};
