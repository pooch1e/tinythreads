import { removeBgAsync } from "./removeBg";
import { loadImage, canvasToBlob } from "./canvasUtils";

const FINAL_MAX_WIDTH = 1024;
const WORKER_MAX_WIDTH = 800;
const WORKER_JPEG_QUALITY = 0.85;

async function resizeImage(
  source: File | Blob,
  maxWidth: number,
  type: string,
  quality?: number,
): Promise<Blob> {
  const url = URL.createObjectURL(source);

  try {
    const img = await loadImage(url);

    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context unavailable");
    }

    ctx.drawImage(img, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, type, quality);
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function prepareUploadedImage(file: File | Blob): Promise<Blob> {
  return resizeImage(file, WORKER_MAX_WIDTH, "image/jpeg", WORKER_JPEG_QUALITY);
}

export async function removeImageBackground(file: File | Blob): Promise<Blob> {
  try {
    const compressed = await resizeImage(
      file,
      WORKER_MAX_WIDTH,
      "image/jpeg",
      WORKER_JPEG_QUALITY,
    );
    const processed = await removeBgAsync(compressed);
    return await resizeImage(processed, FINAL_MAX_WIDTH, "image/png");
  } catch {
    return await resizeImage(file, FINAL_MAX_WIDTH, "image/png");
  }
}
