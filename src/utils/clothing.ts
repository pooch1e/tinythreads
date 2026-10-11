/**
 * clothing — helpers for working with collections of clothing items.
 */
import type { ClothingItem, ClothingType } from "@/types";
import { CLOTHING_TYPES } from "@/constants/clothing";

/**
 * Every type in CLOTHING_TYPES is always present in the result (possibly []).
 */
export function groupItemsByType(
  items: ClothingItem[],
): Record<ClothingType, ClothingItem[]> {
  return Object.fromEntries(
    CLOTHING_TYPES.map((type) => [type, items.filter((i) => i.type === type)]),
  ) as Record<ClothingType, ClothingItem[]>;
}

export function formatItemCount(count: number): string {
  return `${count} ${count === 1 ? "item" : "items"}`;
}
