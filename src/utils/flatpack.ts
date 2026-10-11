/**
 * flatpack — normalises a background-removed cutout into a "flat-lay" photo:
 * crops to the visible subject and centres it on a fixed-size white square.
 */
import { loadImage, canvasToBlob } from "@/utils/canvasUtils";

const CANVAS_SIZE = 400;
const SUBJECT_FILL = 0.82; // fraction of the square the subject's longest side may occupy
const ALPHA_THRESHOLD = 10; // pixels at or below this alpha count as background
const BACKGROUND = "#ffffff";
const JPEG_QUALITY = 0.9;

type Bounds = { x: number; y: number; w: number; h: number };

function getContentBounds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): Bounds | null {
  const { data } = ctx.getImageData(0, 0, width, height);

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) return null;

  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function drawCentred(
  img: HTMLImageElement,
  bounds: Bounds,
  canvas: HTMLCanvasElement,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  const maxSubjectSize = CANVAS_SIZE * SUBJECT_FILL;
  const scale = Math.min(maxSubjectSize / bounds.w, maxSubjectSize / bounds.h);

  const scaledW = bounds.w * scale;
  const scaledH = bounds.h * scale;

  const offsetX = (CANVAS_SIZE - scaledW) / 2 - bounds.x * scale;
  const offsetY = (CANVAS_SIZE - scaledH) / 2 - bounds.y * scale;

  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale);
}

export async function normaliseFlatpack(blob: Blob): Promise<Blob> {
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);

    const scratch = document.createElement("canvas");
    scratch.width = img.width;
    scratch.height = img.height;
    const scratchCtx = scratch.getContext("2d");
    if (!scratchCtx) throw new Error("Canvas context unavailable");
    scratchCtx.drawImage(img, 0, 0);

    const bounds = getContentBounds(scratchCtx, img.width, img.height) ?? {
      x: 0,
      y: 0,
      w: img.width,
      h: img.height,
    };

    const output = document.createElement("canvas");
    output.width = CANVAS_SIZE;
    output.height = CANVAS_SIZE;
    drawCentred(img, bounds, output);

    // The white background makes the output opaque, so JPEG is far smaller than PNG.
    return await canvasToBlob(output, "image/jpeg", JPEG_QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}
