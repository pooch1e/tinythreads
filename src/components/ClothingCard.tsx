/**
 * ClothingCard — square photo tile for one clothing item, with a processing
 * placeholder while its background is being removed, a delete button and
 * attribute tags.
 */
import { motion, AnimatePresence } from "framer-motion";
import type { ClothingItem } from "@/types";
import { CLOTHING_CONFIG } from "@/constants/clothing";
import { FOCUS_RING } from "@/constants/styles";
import { useSingleImage } from "@/hooks/useSingleImage";
import ItemTags from "@/components/ItemTags";

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
}

function describeItem(item: ClothingItem): string {
  return [item.colour?.name, item.pattern?.name, CLOTHING_CONFIG[item.type].displayName.toLowerCase()]
    .filter(Boolean)
    .join(" ");
}

export default function ClothingCard({ item, onDelete }: ClothingCardProps) {
  const imageUrl = useSingleImage(item.imageId, item.processing ? "processing" : "ready");
  const description = describeItem(item);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileTap={{ scale: 0.95 }}
      className="relative shrink-0 w-full"
    >
      <div className="aspect-square w-full rounded-2xl overflow-hidden bg-surface shadow-sm border border-border-subtle">
        <AnimatePresence mode="wait">
          {item.processing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-surface-muted text-primary-text animate-pulse"
            >
              <div className="relative text-3xl leading-none" aria-hidden="true">
                <span>🧸</span>
                <span className="absolute -top-1 -right-3 text-sm">✨</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide">Snipping...</span>
            </motion.div>
          ) : imageUrl ? (
            <motion.img
              key="image"
              src={imageUrl}
              alt={description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <motion.div
              key="empty"
              className="w-full h-full flex items-center justify-center text-placeholder text-3xl"
              aria-hidden="true"
            >
              ☁
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* The visible dot is 24px but the button itself is 44px to meet the touch-target minimum. */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(item.id)}
        className={`group absolute -top-3.5 -right-3.5 z-10 w-11 h-11 flex items-center justify-center rounded-full ${FOCUS_RING}`}
        aria-label={`Delete ${description}`}
      >
        <span className="w-6 h-6 rounded-full bg-gray-700 dark:bg-surface-raised text-white text-xs flex items-center justify-center shadow-lg leading-none group-active:bg-error transition-colors">
          ×
        </span>
      </motion.button>

      <div className="mt-1.5 flex flex-wrap gap-1">
        <ItemTags item={item} />
      </div>
    </motion.div>
  );
}
