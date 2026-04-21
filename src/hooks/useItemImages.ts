import { useState, useEffect } from 'react';
import type { ClothingItem } from '@/types';
import { getImageUrl } from '@/storage/images';

/**
 * Loads IndexedDB object URLs for a list of clothing items.
 * Returns a Map of imageId → objectUrl.
 * Revokes all object URLs when the items list changes or the component unmounts.
 */
export function useItemImages(items: ClothingItem[]): Map<string, string> {
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (items.length === 0) {
      setImageMap(new Map());
      return;
    }

    let cancelled = false;
    const created: string[] = [];

    Promise.all(
      items.map(async (item) => {
        const url = await getImageUrl(item.imageId);
        if (url) created.push(url);
        return [item.imageId, url] as [string, string | null];
      }),
    ).then((entries) => {
      if (cancelled) {
        created.forEach((url) => URL.revokeObjectURL(url));
        return;
      }
      const map = new Map<string, string>();
      for (const [id, url] of entries) {
        if (url) map.set(id, url);
      }
      setImageMap(map);
    });

    return () => {
      cancelled = true;
      created.forEach((url) => URL.revokeObjectURL(url));
    };
  // Stringify ids so the effect only re-runs when the actual item list changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.imageId).join(',')]);

  return imageMap;
}
