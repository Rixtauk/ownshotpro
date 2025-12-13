import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface ProductAnalysis {
  productType: "bottle" | "box" | "apparel" | "jewelry" | "device" | "food" | "cosmetics" | "other";
  recommendedShotType: "packshot" | "lifestyle" | "flatlay";
  recommendedAngle: "front" | "three_quarter" | "side" | "top_down" | "macro";
  recommendedBackground: "white" | "light_grey" | "gradient" | "lifestyle";
  recommendedSurface: "none" | "acrylic" | "paper" | "marble" | "wood_light" | "wood_dark" | "cloth";
  recommendedLighting: "softbox_front" | "window_light" | "rim_light" | "dramatic" | "backlit";
  recommendedShadow: "none" | "soft_contact" | "crisp" | "drop";
  warnings: string[];
  confidence: number;
}

const ANALYSIS_PROMPT = `Analyze this product image and provide recommendations for professional product photography settings.

Return your analysis as a JSON object with the following structure:

{
  "productType": "<one of: bottle, box, apparel, jewelry, device, food, cosmetics, other>",
  "recommendedShotType": "<one of: packshot, lifestyle, flatlay>",
  "recommendedAngle": "<one of: front, three_quarter, side, top_down, macro>",
  "recommendedBackground": "<one of: white, light_grey, gradient, lifestyle>",
  "recommendedSurface": "<one of: none, acrylic, paper, marble, wood_light, wood_dark, cloth>",
  "recommendedLighting": "<one of: softbox_front, window_light, rim_light, dramatic, backlit>",
  "recommendedShadow": "<one of: none, soft_contact, crisp, drop>",
  "warnings": ["<array of any warnings or issues with the current image>"],
  "confidence": <number between 0 and 1 indicating confidence in the analysis>
}

Guidelines:
- For productType: Identify the category of product
- For recommendedShotType: packshot = clean isolated product, lifestyle = product in context, flatlay = overhead styled shot
- For recommendedAngle: Consider what shows the product best
- For recommendedBackground: Match the product's style and brand positioning
- For recommendedSurface: Consider reflective properties and product type
- For recommendedLighting: Match the product's material and desired mood
- For recommendedShadow: Enhance depth and product grounding
- For warnings: Flag any issues like poor lighting, blur, clutter, orientation issues, etc.
- For confidence: Be honest about uncertainty

Return ONLY the JSON object, no additional text.`;

// Default analysis to return if the API fails
function getDefaultAnalysis(): ProductAnalysis {
  return {
    productType: "other",
    recommendedShotType: "packshot",
    recommendedAngle: "three_quarter",
    recommendedBackground: "white",
    recommendedSurface: "none",
    recommendedLighting: "softbox_front",
    recommendedShadow: "soft_contact",
    warnings: ["Unable to analyze image automatically. Using default settings."],
    confidence: 0,
  };
}

export async function analyzeProductImage(imageBase64: string): Promise<ProductAnalysis> {
  try {
    // Build the image part
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg", // Assume JPEG, can be made configurable if needed
      },
    };

    // Call Gemini for text analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [imagePart, { text: ANALYSIS_PROMPT }],
        },
      ],
      config: {
        responseModalities: ["Text"],
      },
    });

    // Extract the text from response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      console.error("No response from Gemini");
      return getDefaultAnalysis();
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      console.error("No content parts in response");
      return getDefaultAnalysis();
    }

    // Find the text part
    let textResponse: string | undefined;
    for (const part of parts) {
      if (part.text) {
        textResponse = part.text;
        break;
      }
    }

    if (!textResponse) {
      console.error("No text in response");
      return getDefaultAnalysis();
    }

    // Parse JSON response
    try {
      // Clean the response to extract JSON
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON found in response:", textResponse);
        return getDefaultAnalysis();
      }

      const analysis = JSON.parse(jsonMatch[0]) as ProductAnalysis;

      // Validate the response has required fields
      if (!analysis.productType || !analysis.recommendedShotType) {
        console.error("Invalid analysis response:", analysis);
        return getDefaultAnalysis();
      }

      return analysis;
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Response text:", textResponse);
      return getDefaultAnalysis();
    }
  } catch (error) {
    console.error("Product analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    const defaultAnalysis = getDefaultAnalysis();
    defaultAnalysis.warnings = [
      `Analysis failed: ${message}. Using default settings.`,
    ];

    return defaultAnalysis;
  }
}
