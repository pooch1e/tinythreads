/**
 * OutfitSlotRow — one clothing slot in the outfit builder. Swipe the photo
 * horizontally to cycle through that category's items; shows the current
 * item's tags and pagination dots.
 */
import { useState } from "react";
import { useDrag } from "@use-gesture/react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClothingItem, ClothingType } from "@/types";
import { CLOTHING_CONFIG } from "@/constants/clothing";
import ItemTags from "@/components/ItemTags";
import CategoryIcon from "@/components/CategoryIcon";

interface OutfitSlotRowProps {
  type: ClothingType;
  items: ClothingItem[];
  selectedIndex: number;
  imageMap: Map<string, string>;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD = 40;

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

  // Uses total movement rather than the last frame's direction so a small
  // wobble on release can't flip the swipe.
  const bind = useDrag(
    ({ last, movement: [mx] }) => {
      if (!last || Math.abs(mx) < SWIPE_THRESHOLD) return;
      if (mx > 0) prev();
      else next();
    },
    { axis: "x", filterTaps: true },
  );

  const currentItem = items.length > 0 ? items[selectedIndex] : null;
  const imageUrl = currentItem ? imageMap.get(currentItem.imageId) : null;

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-b-0">
      <div className="flex flex-col items-center gap-1 w-14 shrink-0">
        <CategoryIcon type={type} className="w-8 h-8" />
        <span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wide">
          {cfg.displayName}
        </span>
      </div>

      <div
        {...(items.length > 1 ? bind() : {})}
        className="relative flex-1 flex items-center justify-center overflow-hidden touch-pan-y h-[120px]"
      >
        {items.length === 0 ? (
          <div className="w-[100px] h-[100px] rounded-2xl border-2 border-dashed border-border-strong flex items-center justify-center">
            <CategoryIcon type={type} className="w-10 h-10 opacity-20 grayscale" />
          </div>
        ) : (
          <AnimatePresence mode="wait" initial={false} custom={dragDirection}>
            <motion.div
              key={currentItem?.id ?? "empty"}
              custom={dragDirection}
              variants={{
                enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="shrink-0"
            >
              <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden bg-surface-muted shadow-sm">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={type}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-placeholder text-3xl"
                    aria-hidden="true"
                  >
                    ☁
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="flex flex-col items-start gap-2 w-20 shrink-0">
        {currentItem && (
          <div className="flex flex-col items-start gap-1">
            <ItemTags item={currentItem} />
          </div>
        )}

        {items.length > 1 && (
          <div className="flex items-center gap-1 flex-wrap mt-auto" aria-hidden="true">
            {items.map((item, i) => (
              <span
                key={item.id}
                className={`w-1.5 h-1.5 rounded-full transition-[colors,transform] duration-150 ${
                  i === selectedIndex ? "bg-primary scale-125" : "bg-border-strong"
                }`}
              />
            ))}
          </div>
        )}

        {items.length === 0 && (
          <span className="text-[10px] text-fg-muted leading-tight">No items yet</span>
        )}
      </div>
    </div>
  );
}
