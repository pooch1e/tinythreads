/**
 * useWardrobe — owns the wardrobe item list. Adds items (showing the photo
 * immediately and cutting out its background in the background), deletes
 * them, resumes processing interrupted by a reload, and keeps every mounted
 * instance in sync via wardrobe update events.
 */
import { useState, useCallback, useEffect } from "react";
import type {
  ClothingItem,
  ClothingType,
  BabySize,
  ClothingColour,
  ClothingPattern,
} from "@/types";
import {
  loadItems,
  addItemToStorage,
  removeItemFromStorage,
  removeItemFromLooks,
  updateItemInStorage,
} from "@/storage/metadata";
import { saveImage, deleteImage, getImageBlob } from "@/storage/images";
import {
  prepareUploadedImage,
  removeImageBackground,
} from "@/utils/imageProcessing";
import {
  notifyWardrobeItemsUpdated,
  subscribeToWardrobeItemsUpdated,
} from "@/utils/wardrobeEvents";

// Module-level so jobs outlive the component that started them and so multiple
// hook instances (and StrictMode's double effects) never process an item twice.
const activeJobs = new Set<string>();

function markProcessed(itemId: string) {
  activeJobs.delete(itemId);
  updateItemInStorage(itemId, (item) => ({ ...item, processing: false }));
  notifyWardrobeItemsUpdated();
}

function processInBackground(itemId: string, imageId: string, source: Blob) {
  activeJobs.add(itemId);
  void (async () => {
    try {
      const processed = await removeImageBackground(source);
      await saveImage(imageId, processed);
      // The item may have been deleted mid-processing; don't resurrect its blob.
      if (!loadItems().some((i) => i.id === itemId)) {
        await deleteImage(imageId);
      }
    } finally {
      markProcessed(itemId);
    }
  })();
}

function resumeInterruptedJobs() {
  for (const item of loadItems()) {
    if (!item.processing || activeJobs.has(item.id)) continue;
    activeJobs.add(item.id);
    void getImageBlob(item.imageId)
      .catch(() => undefined)
      .then((blob) => {
        if (blob) {
          processInBackground(item.id, item.imageId, blob);
        } else {
          markProcessed(item.id);
        }
      });
  }
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(() => loadItems());
  const [isAdding, setIsAdding] = useState(false);

  const refresh = useCallback(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => subscribeToWardrobeItemsUpdated(refresh), [refresh]);

  useEffect(() => {
    resumeInterruptedJobs();
  }, []);

  const addItem = useCallback(
    async (
      file: File,
      type: ClothingType,
      size?: BabySize,
      pattern?: ClothingPattern,
      colour?: ClothingColour,
    ): Promise<void> => {
      setIsAdding(true);
      try {
        const prepared = await prepareUploadedImage(file);
        const id = crypto.randomUUID();
        await saveImage(id, prepared);

        const item: ClothingItem = {
          id,
          type,
          imageId: id,
          size,
          pattern,
          colour,
          createdAt: Date.now(),
          processing: true,
        };

        addItemToStorage(item);
        notifyWardrobeItemsUpdated();
        processInBackground(id, id, prepared);
      } finally {
        setIsAdding(false);
      }
    },
    [],
  );

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    const item = loadItems().find((i) => i.id === id);
    // Metadata goes first so an in-flight background job sees the item is gone.
    removeItemFromStorage(id);
    removeItemFromLooks(id);
    if (item) {
      await deleteImage(item.imageId);
    }
    notifyWardrobeItemsUpdated();
  }, []);

  return { items, isAdding, addItem, deleteItem, refresh };
}
