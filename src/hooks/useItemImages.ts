/**
 * useItemImages — loads IndexedDB object URLs for a list of clothing items as
 * a Map of imageId → objectUrl, revoking them when the list changes or the
 * component unmounts.
 */
import { useState, useEffect } from "react";
import type { ClothingItem } from "@/types";
import { getImageUrl } from "@/storage/images";

export function useItemImages(items: ClothingItem[]): Map<string, string> {
  const [imageMap, setImageMap] = useState<Map<string, string>>(new Map());

  // Background removal overwrites the blob under the same imageId, so the
  // processing flag is part of the key to pick up the finished image.
  const itemsKey = items
    .map((i) => `${i.imageId}:${i.processing ? "processing" : "ready"}`)
    .join(",");

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
  // Keyed on a string so the effect only re-runs when the item images actually change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  return imageMap;
}
