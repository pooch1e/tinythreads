/**
 * CategoryFolder — tappable wardrobe tile for one clothing category, showing
 * its icon and item count. While filters are active it shows how many items
 * match, plus a dot when there is at least one match.
 */
import { motion } from "framer-motion";
import { CLOTHING_CONFIG } from "@/constants/clothing";
import { FOCUS_RING } from "@/constants/styles";
import type { ClothingType } from "@/types";
import { formatItemCount } from "@/utils/clothing";
import CategoryIcon from "@/components/CategoryIcon";

interface CategoryFolderProps {
  type: ClothingType;
  totalCount: number;
  matchCount: number;
  isFilterActive: boolean;
  onClick: () => void;
}

export default function CategoryFolder({
  type,
  totalCount,
  matchCount,
  isFilterActive,
  onClick,
}: CategoryFolderProps) {
  const cfg = CLOTHING_CONFIG[type];
  const countLabel = isFilterActive
    ? `${matchCount} of ${totalCount} match`
    : formatItemCount(totalCount);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 p-6 rounded-[2.5rem] bg-surface-muted border-2 border-border transition-colors active:border-primary group w-full ${FOCUS_RING}`}
    >
      <div className="w-16 h-16 flex items-center justify-center bg-surface-raised rounded-3xl shadow-sm group-hover:shadow-md transition-shadow">
        <CategoryIcon type={type} className="w-10 h-10" />
      </div>

      {isFilterActive && matchCount > 0 && (
        <div
          className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full border border-surface shadow-sm"
          aria-hidden="true"
        />
      )}

      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-fg">{cfg.pluralName}</span>
        <span className="text-[10px] font-semibold text-fg-muted uppercase tracking-wider">
          {countLabel}
        </span>
      </div>
    </motion.button>
  );
}
