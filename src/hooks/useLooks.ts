import { useState, useEffect, useCallback } from 'react';
import { SavedLook, MAX_LOOKS } from '../types';
import { loadLooks, saveLook, deleteLook as deleteLookFromStorage } from '../storage';
import { v4 as uuidv4 } from 'uuid';

export function useLooks() {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const loaded = await loadLooks();
      // Chronological, newest first
      setLooks(loaded.sort((a, b) => b.createdAt - a.createdAt));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLook = useCallback(
    async (name: string, itemIds: SavedLook['itemIds']): Promise<SavedLook | null> => {
      if (looks.length >= MAX_LOOKS) return null;
      const look: SavedLook = {
        id: uuidv4(),
        name: name.trim() || 'Untitled Look',
        itemIds,
        createdAt: Date.now(),
      };
      await saveLook(look);
      setLooks((prev) => [look, ...prev]);
      return look;
    },
    [looks.length],
  );

  const deleteLook = useCallback(async (id: string) => {
    await deleteLookFromStorage(id);
    setLooks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const atLimit = looks.length >= MAX_LOOKS;

  return { looks, isLoading, addLook, deleteLook, refresh, atLimit };
}
