import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClothingItem, SavedLook } from '../types';

const ITEMS_KEY = '@tinythreads/items';
const LOOKS_KEY = '@tinythreads/looks';

// ---------------------------------------------------------------------------
// Clothing Items
// ---------------------------------------------------------------------------

export async function loadItems(): Promise<ClothingItem[]> {
  try {
    const raw = await AsyncStorage.getItem(ITEMS_KEY);
    return raw ? (JSON.parse(raw) as ClothingItem[]) : [];
  } catch {
    return [];
  }
}

export async function saveItem(item: ClothingItem): Promise<void> {
  const items = await loadItems();
  const updated = [...items.filter((i) => i.id !== item.id), item];
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(updated));
}

export async function deleteItem(id: string): Promise<void> {
  const items = await loadItems();
  await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items.filter((i) => i.id !== id)));
}

// ---------------------------------------------------------------------------
// Saved Looks
// ---------------------------------------------------------------------------

export async function loadLooks(): Promise<SavedLook[]> {
  try {
    const raw = await AsyncStorage.getItem(LOOKS_KEY);
    return raw ? (JSON.parse(raw) as SavedLook[]) : [];
  } catch {
    return [];
  }
}

export async function saveLook(look: SavedLook): Promise<void> {
  const looks = await loadLooks();
  const updated = [...looks.filter((l) => l.id !== look.id), look];
  await AsyncStorage.setItem(LOOKS_KEY, JSON.stringify(updated));
}

export async function deleteLook(id: string): Promise<void> {
  const looks = await loadLooks();
  await AsyncStorage.setItem(LOOKS_KEY, JSON.stringify(looks.filter((l) => l.id !== id)));
}
