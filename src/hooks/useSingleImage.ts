import { useEffect, useState } from 'react';
import { getImageUrl } from '@/storage/images';

/**
 * Loads a single image from IndexedDB as an object URL.
 * Revokes the URL on unmount to avoid memory leaks.
 */
export function useSingleImage(imageId: string | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageId) return;
    let objectUrl: string | null = null;
    getImageUrl(imageId).then((u) => {
      objectUrl = u;
      setUrl(u);
    });
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageId]);

  return url;
}
