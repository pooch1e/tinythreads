/**
 * Expo Go fallback implementation.
 *
 * `onnxruntime-react-native` requires a custom native build and crashes when
 * imported in Expo Go. For MVP development we expose the same interface but
 * mark the service as unavailable so the existing save-original fallback path
 * is used automatically.
 */

export function isBackgroundRemovalSupported(): boolean {
  return false;
}

export async function initSession(): Promise<void> {
  throw new Error('Background removal requires a custom dev build.');
}

export function disposeSession(): void {
  // No-op in Expo Go fallback mode.
}

export async function removeBackground(_sourceUri: string, _outputUri: string): Promise<void> {
  throw new Error('Background removal is unavailable in Expo Go.');
}
