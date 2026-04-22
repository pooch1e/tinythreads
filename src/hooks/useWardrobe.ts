import { useState, useCallback, useEffect } from 'react';
import type { ClothingItem, ClothingType, BabySize, ClothingColour } from '../types';
import {
  loadItems,
  addItemToStorage,
  removeItemFromStorage,
  updateItemInStorage,
} from '../storage/metadata';
import { saveImage, deleteImage } from '../storage/images';
import { prepareUploadedImage, removeImageBackground } from '../utils/imageProcessing';
import {
  notifyWardrobeItemsUpdated,
  subscribeToWardrobeItemsUpdated,
} from '../utils/wardrobeEvents';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(() => loadItems());
  const [isAdding, setIsAdding] = useState(false);

  const refresh = useCallback(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => subscribeToWardrobeItemsUpdated(refresh), [refresh]);

  const addItem = useCallback(
    async (
      file: File,
      type: ClothingType,
      size?: BabySize,
      colour?: ClothingColour,
    ): Promise<void> => {
      setIsAdding(true);
      try {
        const blob = await prepareUploadedImage(file);
        const id = crypto.randomUUID();
        await saveImage(id, blob);

        const item: ClothingItem = {
          id,
          type,
          imageId: id,
          size,
          colour,
          createdAt: Date.now(),
          processing: true,
        };

        addItemToStorage(item);
        refresh();
        notifyWardrobeItemsUpdated();

        void (async () => {
          try {
            const processedBlob = await removeImageBackground(file);
            await saveImage(id, processedBlob);
          } finally {
            updateItemInStorage(id, (storedItem) => ({
              ...storedItem,
              processing: false,
            }));
            refresh();
            notifyWardrobeItemsUpdated();
          }
        })();
      } finally {
        setIsAdding(false);
      }
    },
    [refresh],
  );

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    const item = loadItems().find((i) => i.id === id);
    if (item) {
      await deleteImage(item.imageId);
    }
    removeItemFromStorage(id);
    refresh();
    notifyWardrobeItemsUpdated();
  }, [refresh]);

  return { items, isAdding, addItem, deleteItem, refresh };
}
