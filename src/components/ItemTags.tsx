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
        <span className="text-[10px] font-medium bg-[#edf2fb] dark:bg-[#1a2332] text-[#3b5bdb] dark:text-[#b6ccfe] px-1.5 py-0.5 rounded-full leading-none">
          {item.size}
        </span>
      )}
      {item.colour && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#edf2fb] dark:bg-[#1a2332] text-[#3b5bdb] dark:text-[#b6ccfe] px-1.5 py-0.5 rounded-full leading-none">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 border border-[#ccdbfd] dark:border-[#263352]"
            style={{ backgroundColor: item.colour.hex }}
          />
          {item.colour.name}
        </span>
      )}
    </>
  );
}
