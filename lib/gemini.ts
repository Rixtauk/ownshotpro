import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "@/types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GenerateImageParams {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}

export interface GenerateImageResult {
  success: boolean;
  imageData?: Buffer;
  error?: string;
}

// Map our image sizes to Gemini config values
function mapImageSize(size: ImageSize): string {
  const mapping: Record<ImageSize, string> = {
    "1K": "1024",
    "2K": "2048",
    "4K": "4096",
  };
  return mapping[size];
}

// Map our aspect ratios to Gemini format
function mapAspectRatio(ratio: AspectRatio): string | undefined {
  if (ratio === "match") return undefined;
  return ratio;
}

// Single-pass image enhancement
export async function generateEnhancedImage(
  params: GenerateImageParams
): Promise<GenerateImageResult> {
  const { imageBase64, mimeType, prompt, aspectRatio, imageSize } = params;

  try {
    // Build the image part
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    // Build config
    // Include both TEXT and IMAGE to allow model reasoning about edits
    const config: Record<string, unknown> = {
      responseModalities: ["TEXT", "IMAGE"],
    };

    // Add image config if we have specific requirements
    const imageConfig: Record<string, string> = {};

    const mappedAspectRatio = mapAspectRatio(aspectRatio);
    if (mappedAspectRatio) {
      imageConfig.aspectRatio = mappedAspectRatio;
    }

    imageConfig.imageSize = mapImageSize(imageSize);

    if (Object.keys(imageConfig).length > 0) {
      config.imageConfig = imageConfig;
    }

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [imagePart, { text: prompt }],
        },
      ],
      config,
    });

    // Extract the image from response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return { success: false, error: "No response from Gemini" };
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      return { success: false, error: "No content parts in response" };
    }

    // Find the last part with inlineData (the generated image)
    let imageData: string | undefined;
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data;
      }
    }

    if (!imageData) {
      return { success: false, error: "No image data in response" };
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(imageData, "base64");

    return { success: true, imageData: buffer };
  } catch (error) {
    console.error("Gemini API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
