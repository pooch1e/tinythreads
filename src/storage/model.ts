import * as FileSystem from 'expo-file-system/legacy';

const MODEL_DIR = `${FileSystem.documentDirectory}tinythreads/model/`;
const MODEL_FILENAME = 'u2net_cloth_seg.onnx';
export const MODEL_PATH = `${MODEL_DIR}${MODEL_FILENAME}`;

// Hosted on Hugging Face — u2net model specialised for clothing segmentation
const MODEL_DOWNLOAD_URL =
  'https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx';

export async function isModelDownloaded(): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(MODEL_PATH);
  return info.exists;
}

/**
 * Download the ONNX model if it hasn't been downloaded yet.
 * onProgress is called with a 0–1 float as the download progresses.
 */
export async function downloadModelIfNeeded(
  onProgress?: (progress: number) => void,
): Promise<string> {
  const exists = await isModelDownloaded();
  if (exists) {
    onProgress?.(1);
    return MODEL_PATH;
  }

  // Ensure directory exists
  await FileSystem.makeDirectoryAsync(MODEL_DIR, { intermediates: true });

  const downloadResumable = FileSystem.createDownloadResumable(
    MODEL_DOWNLOAD_URL,
    MODEL_PATH,
    {},
    (event) => {
      if (event.totalBytesExpectedToWrite > 0) {
        onProgress?.(event.totalBytesWritten / event.totalBytesExpectedToWrite);
      }
    },
  );

  const result = await downloadResumable.downloadAsync();
  if (!result) throw new Error('Model download failed — no result returned');

  onProgress?.(1);
  return result.uri;
}
