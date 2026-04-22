import { useEffect, useState } from 'react';
import { getImageUrl } from '@/storage/images';

/**
 * Loads a single image from IndexedDB as an object URL.
 * Revokes the URL on unmount to avoid memory leaks.
 */
export function useSingleImage(imageId: string | undefined, version?: string): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) {
      setUrl(null);
      return;
    }

    let active = true;
    let objectUrl: string | null = null;
    getImageUrl(imageId).then((u) => {
      if (!active) {
        if (u) {
          URL.revokeObjectURL(u);
        }
        return;
      }
      objectUrl = u;
      setUrl(u);
    });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageId, version]);

  return url;
}
