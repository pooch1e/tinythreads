import { removeBg } from "./removeBg";
import { loadImage, canvasToBlob } from "./canvasUtils";

const MAX_WIDTH = 1024;

/**
 * Removes background (best effort), resizes, and exports as PNG.
 * Returns a PNG Blob at max 1024px wide.
 */
export async function processImage(file: File | Blob): Promise<Blob> {
  let source: Blob = file;

  // Try remove bg, if error - continue
  try {
    source = await removeBg({ file });
  } catch {
    source = file;
  }

  const url = URL.createObjectURL(source);

  try {
    const img = await loadImage(url);

    const scale = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
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

    const blob = await canvasToBlob(canvas, "image/png");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
