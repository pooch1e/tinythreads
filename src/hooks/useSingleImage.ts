/**
 * useSingleImage — loads one image from IndexedDB as an object URL and revokes
 * it on change or unmount. Bump `version` to reload when the blob behind an
 * unchanged imageId has been replaced.
 */
import { useEffect, useState } from "react";
import { getImageUrl } from "@/storage/images";

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
