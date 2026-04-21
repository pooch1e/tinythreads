import { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClothingItem, ClothingType } from '@/types';
import { CLOTHING_CONFIG } from '@/constants/clothing';
import ItemTags from '@/components/ItemTags';

interface OutfitSlotRowProps {
  type: ClothingType;
  items: ClothingItem[];
  selectedIndex: number;
  imageMap: Map<string, string>;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD = 40; // px to trigger a swipe

export default function OutfitSlotRow({
  type,
  items,
  selectedIndex,
  imageMap,
  onIndexChange,
}: OutfitSlotRowProps) {
  const cfg = CLOTHING_CONFIG[type];
  const [dragDirection, setDragDirection] = useState<1 | -1>(1);

  const prev = () => {
    setDragDirection(-1);
    onIndexChange((selectedIndex - 1 + items.length) % items.length);
  };

  const next = () => {
    setDragDirection(1);
    onIndexChange((selectedIndex + 1) % items.length);
  };

  const bind = useDrag(
    ({ last, movement: [mx], direction: [dx], cancel }) => {
      if (!last) return;
      if (Math.abs(mx) < SWIPE_THRESHOLD) return;
      // Positive dx = swipe right = go to previous
      if (dx > 0) {
        cancel();
        prev();
      } else {
        cancel();
        next();
      }
    },
    { axis: 'x', filterTaps: true },
  );

  const currentItem = items.length > 0 ? items[selectedIndex] : null;
  const imageUrl = currentItem ? imageMap.get(currentItem.imageId) : null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0">
      {/* Type label */}
      <div className="flex flex-col items-center gap-1 w-14 flex-shrink-0">
        <span className="text-2xl">{cfg.icon}</span>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          {cfg.displayName}
        </span>
      </div>

      {/* Swipeable image card */}
      <div
        {...(items.length > 1 ? bind() : {})}
        className="relative flex-1 flex items-center justify-center overflow-hidden touch-pan-y"
        style={{ height: 120 }}
      >
        {items.length === 0 ? (
          // Empty slot placeholder
          <div className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
            <span className="text-3xl">{cfg.icon}</span>
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false} custom={dragDirection}>
            <motion.div
              key={currentItem?.id ?? 'empty'}
              custom={dragDirection}
              variants={{
                enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex-shrink-0"
            >
              <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={type}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
                    ☁
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Right: tags + pagination dots */}
      <div className="flex flex-col items-start gap-2 w-20 flex-shrink-0">
        {currentItem && (
          <div className="flex flex-col items-start gap-1">
            <ItemTags item={currentItem} />
          </div>
        )}

        {/* Pagination dots */}
        {items.length > 1 && (
          <div className="flex items-center gap-1 flex-wrap mt-auto">
            {items.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === selectedIndex ? 'bg-pink-500 scale-125' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {items.length === 0 && (
          <span className="text-[10px] text-gray-400 leading-tight">
            No items yet
          </span>
        )}
      </div>
    </div>
  );
}
