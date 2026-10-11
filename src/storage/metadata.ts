/**
 * metadata — localStorage persistence for clothing item metadata and saved
 * looks. Pure functions, no React.
 */
import type { ClothingItem, ClothingType, SavedLook } from "@/types";

const ITEMS_KEY = "@tinythreads/items";
const LOOKS_KEY = "@tinythreads/looks";

function loadFromStorage<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function addToStorage<T>(key: string, item: T): void {
  const items = loadFromStorage<T>(key);
  localStorage.setItem(key, JSON.stringify([item, ...items]));
}

function removeFromStorage(key: string, id: string): void {
  const items = loadFromStorage<{ id: string }>(key).filter((i) => i.id !== id);
  localStorage.setItem(key, JSON.stringify(items));
}

export const loadItems = () => loadFromStorage<ClothingItem>(ITEMS_KEY);
export const saveItems = (items: ClothingItem[]) =>
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
export const addItemToStorage = (item: ClothingItem) => addToStorage<ClothingItem>(ITEMS_KEY, item);
export const removeItemFromStorage = (id: string) => removeFromStorage(ITEMS_KEY, id);
export const updateItemInStorage = (
  id: string,
  updater: (item: ClothingItem) => ClothingItem,
) => {
  const items = loadItems().map((item) => (item.id === id ? updater(item) : item));
  saveItems(items);
};

export const loadLooks = () => loadFromStorage<SavedLook>(LOOKS_KEY);
export const saveLooks = (looks: SavedLook[]) =>
  localStorage.setItem(LOOKS_KEY, JSON.stringify(looks));
export const addLookToStorage = (look: SavedLook) => addToStorage<SavedLook>(LOOKS_KEY, look);
export const removeLookFromStorage = (id: string) => removeFromStorage(LOOKS_KEY, id);

export function removeItemFromLooks(itemId: string): void {
  const looks = loadLooks().map((look) => ({
    ...look,
    itemIds: Object.fromEntries(
      Object.entries(look.itemIds).filter(([, id]) => id !== itemId),
    ) as Partial<Record<ClothingType, string>>,
  }));
  saveLooks(looks);
}
