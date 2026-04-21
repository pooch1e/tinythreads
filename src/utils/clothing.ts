import type { ClothingItem, ClothingType } from '@/types';
import { CLOTHING_TYPES } from '@/constants/clothing';

/**
 * Groups an array of ClothingItems by type, returning a record keyed by
 * ClothingType. Every type in CLOTHING_TYPES is always present (may be []).
 */
export function groupItemsByType(
  items: ClothingItem[],
): Record<ClothingType, ClothingItem[]> {
  return Object.fromEntries(
    CLOTHING_TYPES.map((type) => [type, items.filter((i) => i.type === type)]),
  ) as Record<ClothingType, ClothingItem[]>;
}
