import { useMemo } from 'react';
import type { SavedLook, ClothingItem, ClothingType } from '@/types';
import { CLOTHING_TYPES, CLOTHING_CONFIG } from '@/constants/clothing';
import { useSingleImage } from '@/hooks/useSingleImage';

interface LookCardProps {
  look: SavedLook;
  allItems: ClothingItem[];
  onDelete: (id: string) => void;
}

// One slot in the 2×2 image grid
function GridSlot({ type, item }: { type: ClothingType; item: ClothingItem | undefined }) {
  const cfg = CLOTHING_CONFIG[type];
  const url = useSingleImage(item?.imageId);

  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
      {item && url ? (
        <img src={url} alt={type} className="w-full h-full object-cover" draggable={false} />
      ) : (
        <span className="text-2xl opacity-25">{cfg.icon}</span>
      )}
    </div>
  );
}

export default function LookCard({ look, allItems, onDelete }: LookCardProps) {
  const itemsById = useMemo(() => new Map(allItems.map((i) => [i.id, i])), [allItems]);

  const date = new Date(look.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{look.name}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">{date}</p>
        </div>
        <button
          onClick={() => onDelete(look.id)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 active:text-red-500 active:bg-red-50 transition-colors"
          aria-label="Delete outfit"
        >
          🗑
        </button>
      </div>

      {/* 2×2 image grid */}
      <div className="grid grid-cols-2 gap-1.5 px-4 pb-4">
        {CLOTHING_TYPES.map((type) => {
          const itemId = look.itemIds[type];
          const item = itemId ? itemsById.get(itemId) : undefined;
          return <GridSlot key={type} type={type} item={item} />;
        })}
      </div>
    </div>
  );
}
