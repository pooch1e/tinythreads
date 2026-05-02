import { motion, AnimatePresence } from 'framer-motion';
import type { ClothingItem } from '@/types';
import { useSingleImage } from '@/hooks/useSingleImage';
import ItemTags from '@/components/ItemTags';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
}

export default function ClothingCard({ item, onDelete }: ClothingCardProps) {
  const imageUrl = useSingleImage(item.imageId, item.processing ? 'processing' : 'ready');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      whileTap={{ scale: 0.95 }}
      className="relative shrink-0 w-full"
    >
      {/* Image Container - Aspect ratio controlled by parent grid */}
      <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-[#1a2332] shadow-sm border border-[#edf2fb] dark:border-[#263352]">
        <AnimatePresence mode="wait">
          {item.processing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#edf2fb] dark:bg-[#1a2332] text-[#abc4ff] animate-pulse"
            >
              <div className="relative text-3xl leading-none">
                <span aria-hidden="true">🧸</span>
                <span className="absolute -top-1 -right-3 text-sm">✨</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide text-[#abc4ff]">Snipping...</span>
            </motion.div>
          ) : imageUrl ? (
            <motion.img
              key="image"
              src={imageUrl}
              alt={item.type}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <motion.div
              key="empty"
              className="w-full h-full flex items-center justify-center text-[#b6ccfe] dark:text-[#263352] text-3xl"
            >
              ☁
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(item.id)}
        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gray-700 dark:bg-[#263352] text-white text-xs flex items-center justify-center shadow-lg leading-none active:bg-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 z-10"
        aria-label="Delete item"
      >
        ×
      </motion.button>

      {/* Tags */}
      <div className="mt-1.5 flex flex-wrap gap-1">
        <ItemTags item={item} />
      </div>
    </motion.div>
  );
}
