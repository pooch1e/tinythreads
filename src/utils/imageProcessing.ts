/**
 * imageProcessing — the photo pipeline: downscale an upload to a compact JPEG,
 * then (in the background) cut out the subject and centre it on a white square.
 */
import { removeBgAsync } from "@/utils/removeBg";
import { loadImage, canvasToBlob } from "@/utils/canvasUtils";
import { normaliseFlatpack } from "@/utils/flatpack";

const UPLOAD_MAX_WIDTH = 600;
const UPLOAD_JPEG_QUALITY = 0.85;

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

    return await canvasToBlob(canvas, type, quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function prepareUploadedImage(file: File | Blob): Promise<Blob> {
  return resizeImage(file, UPLOAD_MAX_WIDTH, "image/jpeg", UPLOAD_JPEG_QUALITY);
}

/**
 * Takes the output of prepareUploadedImage. If background removal fails, the
 * prepared image is returned unchanged so the item still has a usable photo.
 */
export async function removeImageBackground(prepared: Blob): Promise<Blob> {
  try {
    const cutout = await removeBgAsync(prepared);
    return await normaliseFlatpack(cutout);
  } catch {
    return prepared;
  }
}
