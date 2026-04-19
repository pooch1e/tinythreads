import * as FileSystem from 'expo-file-system/legacy';

const IMAGE_DIR = `${FileSystem.documentDirectory}tinythreads/images/`;

export async function ensureImageDirExists(): Promise<void> {
  const info = await FileSystem.getInfoAsync(IMAGE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(IMAGE_DIR, { intermediates: true });
  }
}

/**
 * Copy a processed image into the app's persistent image directory.
 * Returns the new permanent URI.
 */
export async function saveImage(tempUri: string, itemId: string, isPng = false): Promise<string> {
  await ensureImageDirExists();
  const ext = isPng ? 'png' : 'jpg';
  const dest = `${IMAGE_DIR}${itemId}.${ext}`;
  await FileSystem.copyAsync({ from: tempUri, to: dest });
  return dest;
}

/**
 * Delete an image file from the persistent directory. Silently ignores missing files.
 */
export async function deleteImage(imageUri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(imageUri);
  if (info.exists) {
    await FileSystem.deleteAsync(imageUri, { idempotent: true });
  }
}
