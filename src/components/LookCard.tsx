import { useMemo } from 'react';
import { motion } from 'framer-motion';
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
    <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#edf2fb] dark:bg-[#1a2332] flex items-center justify-center">
      {item && url ? (
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={url}
          alt={type}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <span className="text-2xl opacity-25">
          {cfg.icon.startsWith('/') || cfg.icon.startsWith('http') ? (
            <img src={cfg.icon} alt="" className="w-8 h-8 object-contain grayscale" />
          ) : (
            cfg.icon
          )}
        </span>
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
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-[#111827] rounded-2xl border border-[#d7e3fc] dark:border-[#263352] shadow-sm overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-[#edf2fb] text-sm leading-tight">{look.name}</h3>
          <p className="text-[11px] text-gray-400 dark:text-[#7a90c0] mt-0.5">{date}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1, color: '#ef4444' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(look.id)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-[#7a90c0] active:text-red-500 active:bg-red-50 dark:active:bg-red-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50"
          aria-label="Delete outfit"
        >
          🗑
        </motion.button>
      </div>

      {/* 2×2 image grid */}
      <div className="grid grid-cols-2 gap-1.5 px-4 pb-4">
        {CLOTHING_TYPES.map((type) => {
          const itemId = look.itemIds[type];
          const item = itemId ? itemsById.get(itemId) : undefined;
          return <GridSlot key={type} type={type} item={item} />;
        })}
      </div>
    </motion.div>
  );
}
