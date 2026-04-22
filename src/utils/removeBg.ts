import { removeBackground, type ImageSource } from "@imgly/background-removal";

type RemoveBgProps = {
  file: ImageSource;
};

export async function removeBg({ file }: RemoveBgProps): Promise<Blob> {
  try {
    return await removeBackground(file);
  } catch (error) {
    throw new Error(`Error removing image background: ${error}`);
  }
}

const worker = new Worker(
  new URL("../workers/removeBg.worker.ts", import.meta.url),
  { type: "module" },
);

export function removeBgAsync(file: File | Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      const { success, buffer, error } = event.data;
      if (success) {
        resolve(new Blob([buffer], { type: "image/png" }));
      } else {
        reject(new Error(error));
      }
    };
    worker.postMessage({ file });
  });
}
