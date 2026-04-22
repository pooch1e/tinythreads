import type { ClothingItem, SavedLook } from '../types';

const ITEMS_KEY = '@tinythreads/items';
const LOOKS_KEY = '@tinythreads/looks';

// ── Generic localStorage helpers ─────────────────────────────

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

// ── Items ─────────────────────────────────────────────────────

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

// ── Looks ─────────────────────────────────────────────────────

export const loadLooks = () => loadFromStorage<SavedLook>(LOOKS_KEY);
export const saveLooks = (looks: SavedLook[]) =>
  localStorage.setItem(LOOKS_KEY, JSON.stringify(looks));
export const addLookToStorage = (look: SavedLook) => addToStorage<SavedLook>(LOOKS_KEY, look);
export const removeLookFromStorage = (id: string) => removeFromStorage(LOOKS_KEY, id);
