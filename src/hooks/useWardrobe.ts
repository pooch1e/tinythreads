import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Crypto from 'expo-crypto';
import { BabySize, ClothingColour, ClothingItem, ClothingType } from '../types';
import { loadItems, saveItem, deleteItem as deleteItemFromStorage } from '../storage';
import { saveImage, deleteImage } from '../storage/images';
import { removeBackground } from '../services/backgroundRemoval';
import { useModelStatus } from './useModelStatus';

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const modelStatus = useModelStatus();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await loadItems();
      // Sort newest first
      setItems(loaded.sort((a, b) => b.createdAt - a.createdAt));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (
      type: ClothingType,
      sourceUri: string,
      size?: BabySize | null,
      colour?: ClothingColour | null,
    ): Promise<ClothingItem | null> => {
      setIsAdding(true);
      try {
        console.log('[addItem] start', { type, sourceUri });
        const id = Crypto.randomUUID();
        console.log('[addItem] generated id', id);

        // Always compress/resize to ~1024px first
        const compressed = await ImageManipulator.manipulateAsync(
          sourceUri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
        );
        console.log('[addItem] compressed', compressed.uri);

        let finalUri: string;
        let backgroundRemoved = false;

        if (modelStatus.status === 'ready') {
          console.log('[addItem] model ready — attempting background removal');
          try {
            // Attempt ONNX background removal
            const outputPath = `${compressed.uri.replace(/\.jpg$/, '')}_masked.png`;
            await removeBackground(compressed.uri, outputPath);
            console.log('[addItem] background removal succeeded', outputPath);
            finalUri = await saveImage(outputPath, id, true);
            backgroundRemoved = true;
          } catch (bgErr) {
            console.warn('[addItem] background removal failed, falling back', bgErr);
            // Fallback: save original compressed image
            finalUri = await saveImage(compressed.uri, id, false);
          }
        } else {
          console.log('[addItem] model not ready (status=' + modelStatus.status + ') — saving original');
          // Model not ready — save original
          finalUri = await saveImage(compressed.uri, id, false);
        }
        console.log('[addItem] image saved', finalUri);

        const item: ClothingItem = {
          id,
          type,
          imageUri: finalUri,
          backgroundRemoved,
          size: size ?? undefined,
          colour: colour ?? undefined,
          createdAt: Date.now(),
        };

        await saveItem(item);
        console.log('[addItem] item saved to storage', item.id);
        setItems((prev) => [item, ...prev]);
        return item;
      } catch (err) {
        console.error('[addItem] outer catch — failed to save item', err);
        Alert.alert('Error', 'Failed to save item. Please try again.');
        return null;
      } finally {
        setIsAdding(false);
      }
    },
    [modelStatus.status],
  );

  const deleteItem = useCallback(async (id: string) => {
    const all = await loadItems();
    const item = all.find((i) => i.id === id);
    if (item) {
      await deleteImage(item.imageUri);
      await deleteItemFromStorage(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }, []);

  return { items, isLoading, isAdding, addItem, deleteItem, refresh };
}
