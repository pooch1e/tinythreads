import { useState, useCallback } from 'react';
import type { ClothingItem, ClothingType, BabySize, ClothingColour } from '../types';
import {
  loadItems,
  addItemToStorage,
  removeItemFromStorage,
} from '../storage/metadata';
import { saveImage, deleteImage } from '../storage/images';
import { processImage } from '../utils/imageProcessing';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(() => loadItems());
  const [isAdding, setIsAdding] = useState(false);

  const refresh = useCallback(() => {
    setItems(loadItems());
  }, []);

  const addItem = useCallback(
    async (
      file: File,
      type: ClothingType,
      size?: BabySize,
      colour?: ClothingColour,
    ): Promise<void> => {
      setIsAdding(true);
      try {
        const blob = await processImage(file);
        const id = crypto.randomUUID();
        await saveImage(id, blob);

        const item: ClothingItem = {
          id,
          type,
          imageId: id,
          size,
          colour,
          createdAt: Date.now(),
        };

        addItemToStorage(item);
        setItems(loadItems());
      } finally {
        setIsAdding(false);
      }
    },
    [],
  );

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    const item = loadItems().find((i) => i.id === id);
    if (item) {
      await deleteImage(item.imageId);
    }
    removeItemFromStorage(id);
    setItems(loadItems());
  }, []);

  return { items, isAdding, addItem, deleteItem, refresh };
}
