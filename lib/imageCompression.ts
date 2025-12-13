/**
 * Compress an image file to reduce upload size
 * Particularly useful for large mobile photos
 */

const MAX_WIDTH = 4096;
const MAX_HEIGHT = 4096;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB target
const QUALITY_STEPS = [0.9, 0.8, 0.7, 0.6, 0.5];

export async function compressImage(file: File): Promise<File> {
  // If file is already small enough, return as-is
  if (file.size <= MAX_FILE_SIZE) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = async () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw image to canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to get under size limit
        let blob: Blob | null = null;
        const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";

        for (const quality of QUALITY_STEPS) {
          blob = await new Promise<Blob | null>((res) => {
            canvas.toBlob(res, mimeType, quality);
          });

          if (blob && blob.size <= MAX_FILE_SIZE) {
            break;
          }
        }

        if (!blob) {
          // If still too large, just return the smallest we got
          blob = await new Promise<Blob | null>((res) => {
            canvas.toBlob(res, "image/jpeg", 0.5);
          });
        }

        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: blob.type,
            lastModified: Date.now(),
          });
          console.log(
            `Compressed image from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
          );
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      } catch (err) {
        console.error("Compression error:", err);
        resolve(file); // Return original on error
      }
    };

    img.onerror = () => {
      console.error("Failed to load image for compression");
      resolve(file); // Return original on error
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
