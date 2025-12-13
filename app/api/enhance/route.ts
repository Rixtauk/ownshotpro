import { NextRequest, NextResponse } from "next/server";
import { generateEnhancedImage } from "@/lib/gemini";
import { buildEnhancementPrompt, buildInteriorPrompt } from "@/lib/promptBuilder";
import { buildProductPrompt } from "@/lib/productPromptBuilder";
import { validateImageFile } from "@/lib/validators";
import { Preset, AspectRatio, ImageSize, ProductOptions, DEFAULT_PRODUCT_OPTIONS } from "@/types";

// Force Node.js runtime (not Edge)
export const runtime = "nodejs";

// Increase timeout for image generation
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Parse FormData
    const formData = await request.formData();

    // Get file
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Parse options from FormData
    const preset = (formData.get("preset") as Preset) || "general";
    const aspectRatio =
      (formData.get("aspectRatio") as AspectRatio) || "match";
    const imageSize = (formData.get("imageSize") as ImageSize) || "2K";
    const strength = parseInt(formData.get("strength") as string) || 60;
    const strictPreservation = formData.get("strictPreservation") === "true";

    // Interior-specific options
    const magazineReshoot = formData.get("magazineReshoot") === "true";
    const allowStyling = formData.get("allowStyling") === "true";
    const hdrWindows = formData.get("hdrWindows") === "true";
    const creativeCrop = formData.get("creativeCrop") === "true";
    const propSuggestions = formData.get("propSuggestions") as string || "";

    // Product-specific options
    const productOptionsStr = formData.get("productOptions") as string | null;
    let productOptions: ProductOptions = DEFAULT_PRODUCT_OPTIONS;
    if (productOptionsStr) {
      try {
        productOptions = JSON.parse(productOptionsStr);
      } catch (e) {
        console.error("Failed to parse product options:", e);
      }
    }

    // Read file as ArrayBuffer then convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    let prompt: string;

    if (preset === "product") {
      // Product mode with studio-quality controls
      console.log(`Processing Product (shot: ${productOptions.shotType}, preset: ${productOptions.quickPreset}, labelProtection: ${productOptions.labelProtection.enabled})...`);
      prompt = buildProductPrompt(productOptions);
    } else if (preset === "interior") {
      // Single-pass Interior processing with geometry-first prompt
      console.log(`Processing Interior (magazineReshoot: ${magazineReshoot}, creativeCrop: ${creativeCrop}, styling: ${allowStyling}, hdrWindows: ${hdrWindows})...`);
      prompt = buildInteriorPrompt({
        magazineReshoot,
        allowStyling,
        hdrWindows,
        creativeCrop,
        propSuggestions: propSuggestions || undefined,
      });
    } else {
      // Non-interior presets use generic prompt
      prompt = buildEnhancementPrompt({
        preset,
        strength,
        strictPreservation,
      });
    }

    const result = await generateEnhancedImage({
      imageBase64: base64,
      mimeType: file.type,
      prompt,
      aspectRatio,
      imageSize,
    });

    if (!result.success || !result.imageData) {
      return NextResponse.json(
        { error: result.error || "Enhancement failed" },
        { status: 500 }
      );
    }

    // Return binary image data (convert Buffer to Uint8Array for NextResponse)
    return new NextResponse(new Uint8Array(result.imageData), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="enhanced.png"',
      },
    });
  } catch (error) {
    console.error("Enhancement error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
