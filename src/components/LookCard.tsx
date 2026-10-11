/**
 * LookCard — card for a saved outfit: name, save date, a delete button, and a
 * one-row strip with a thumbnail (or greyed category icon) per clothing slot.
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import type { SavedLook, ClothingItem, ClothingType } from "@/types";
import { CLOTHING_TYPES } from "@/constants/clothing";
import { FOCUS_RING } from "@/constants/styles";
import { useSingleImage } from "@/hooks/useSingleImage";
import CategoryIcon from "@/components/CategoryIcon";

interface LookCardProps {
  look: SavedLook;
  allItems: ClothingItem[];
  onDelete: (id: string) => void;
}

function SlotThumbnail({ type, item }: { type: ClothingType; item: ClothingItem | undefined }) {
  const url = useSingleImage(item?.imageId, item?.processing ? "processing" : "ready");

  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden bg-surface-muted flex items-center justify-center">
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
        <CategoryIcon type={type} className="w-7 h-7 grayscale opacity-25" />
      )}
    </div>
  );
}

export default function LookCard({ look, allItems, onDelete }: LookCardProps) {
  const itemsById = useMemo(() => new Map(allItems.map((i) => [i.id, i])), [allItems]);

  const date = new Date(look.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between pl-4 pr-2 pt-2 pb-1">
        <div>
          <h3 className="font-semibold text-fg text-sm leading-tight">{look.name}</h3>
          <p className="text-[11px] text-fg-muted mt-0.5">{date}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(look.id)}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-fg-muted hover:text-error-text active:text-error-text active:bg-error-surface transition-colors ${FOCUS_RING}`}
          aria-label={`Delete outfit ${look.name}`}
        >
          🗑
        </motion.button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 px-4 pb-4">
        {CLOTHING_TYPES.map((type) => {
          const itemId = look.itemIds[type];
          const item = itemId ? itemsById.get(itemId) : undefined;
          return <SlotThumbnail key={type} type={type} item={item} />;
        })}
      </div>
    </motion.div>
  );
}
