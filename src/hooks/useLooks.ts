import { useState, useCallback } from 'react';
import type { SavedLook, ClothingType } from '../types';
import { MAX_LOOKS } from '../constants/limits';
import {
  loadLooks,
  addLookToStorage,
  removeLookFromStorage,
} from '../storage/metadata';

export function useLooks() {
  const [looks, setLooks] = useState<SavedLook[]>(() => loadLooks());

  const refresh = useCallback(() => {
    setLooks(loadLooks());
  }, []);

  const addLook = useCallback(
    (name: string, itemIds: Partial<Record<ClothingType, string>>): void => {
      const look: SavedLook = {
        id: crypto.randomUUID(),
        name: name.trim(),
        itemIds,
        createdAt: Date.now(),
      };
      addLookToStorage(look);
      setLooks(loadLooks());
    },
    [],
  );

  const deleteLook = useCallback((id: string): void => {
    removeLookFromStorage(id);
    setLooks(loadLooks());
  }, []);

  const atLimit = looks.length >= MAX_LOOKS;

  return { looks, addLook, deleteLook, refresh, atLimit };
}
