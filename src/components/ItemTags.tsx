import type { ClothingItem } from '@/types';

interface ItemTagsProps {
  item: ClothingItem;
}

/**
 * Renders size and colour tag pills for a clothing item.
 * Used in ClothingCard and OutfitSlotRow.
 */
export default function ItemTags({ item }: ItemTagsProps) {
  return (
    <>
      {item.size && (
        <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full leading-none">
          {item.size}
        </span>
      )}
      {item.colour && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full leading-none">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 border border-gray-200"
            style={{ backgroundColor: item.colour.hex }}
          />
          {item.colour.name}
        </span>
      )}
    </>
  );
}
