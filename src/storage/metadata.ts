import type { ClothingItem, SavedLook } from '../types';

const ITEMS_KEY = '@tinythreads/items';
const LOOKS_KEY = '@tinythreads/looks';

// --- Items ---

export function loadItems(): ClothingItem[] {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? (JSON.parse(raw) as ClothingItem[]) : [];
  } catch {
    return [];
  }
}

export function saveItems(items: ClothingItem[]): void {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function addItemToStorage(item: ClothingItem): void {
  const items = loadItems();
  saveItems([item, ...items]);
}

export function removeItemFromStorage(id: string): void {
  const items = loadItems().filter((i) => i.id !== id);
  saveItems(items);
}

// --- Looks ---

export function loadLooks(): SavedLook[] {
  try {
    const raw = localStorage.getItem(LOOKS_KEY);
    return raw ? (JSON.parse(raw) as SavedLook[]) : [];
  } catch {
    return [];
  }
}

export function saveLooks(looks: SavedLook[]): void {
  localStorage.setItem(LOOKS_KEY, JSON.stringify(looks));
}

export function addLookToStorage(look: SavedLook): void {
  const looks = loadLooks();
  saveLooks([look, ...looks]);
}

export function removeLookFromStorage(id: string): void {
  const looks = loadLooks().filter((l) => l.id !== id);
  saveLooks(looks);
}
