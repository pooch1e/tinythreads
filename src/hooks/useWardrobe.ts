import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { v4 as uuidv4 } from 'uuid';
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
        const id = uuidv4();

        // Always compress/resize to ~1024px first
        const compressed = await ImageManipulator.manipulateAsync(
          sourceUri,
          [{ resize: { width: 1024 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
        );

        let finalUri: string;
        let backgroundRemoved = false;

        if (modelStatus.status === 'ready') {
          try {
            // Attempt ONNX background removal
            const outputPath = `${compressed.uri.replace(/\.jpg$/, '')}_masked.png`;
            await removeBackground(compressed.uri, outputPath);
            finalUri = await saveImage(outputPath, id, true);
            backgroundRemoved = true;
          } catch {
            // Fallback: save original compressed image
            finalUri = await saveImage(compressed.uri, id, false);
          }
        } else {
          // Model not ready — save original
          finalUri = await saveImage(compressed.uri, id, false);
        }

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
        setItems((prev) => [item, ...prev]);
        return item;
      } catch (err) {
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
