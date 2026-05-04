import { motion } from "framer-motion";
import { CLOTHING_CONFIG } from "@/constants/clothing";
import type { ClothingType } from "@/types";

interface CategoryFolderProps {
  type: ClothingType;
  count: number;
  isFiltered: boolean;
  onClick: () => void;
}

export default function CategoryFolder({
  type,
  count,
  isFiltered,
  onClick,
}: CategoryFolderProps) {
  const cfg = CLOTHING_CONFIG[type];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-3 p-6 rounded-[2.5rem] bg-[#edf2fb] dark:bg-[#1a2332] border-2 border-[#d7e3fc] dark:border-[#263352] transition-colors active:border-[#abc4ff] group w-full"
    >
      <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-[#263352] rounded-3xl shadow-sm group-hover:shadow-md transition-shadow">
        {cfg.icon.startsWith("/") || cfg.icon.startsWith("http") ? (
          <img src={cfg.icon} alt="" className="w-10 h-10 object-contain" />
        ) : (
          <span className="text-4xl">{cfg.icon}</span>
        )}
      </div>

      {isFiltered && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-[#abc4ff] rounded-full border border-white dark:border-[#1a2332] shadow-sm" aria-label="Has filtered items" />
      )}

      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-gray-700 dark:text-lavender-2">
          {cfg.pluralName}
        </span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-[#7a90c0] uppercase tracking-wider">
          {count} items
        </span>
      </div>

      {/* Decorative folder tab effect could be added here, but keep it clean for now */}
    </motion.button>
  );
}
