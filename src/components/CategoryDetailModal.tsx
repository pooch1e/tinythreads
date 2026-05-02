import { motion, AnimatePresence } from "framer-motion";
import { CLOTHING_CONFIG } from "@/constants/clothing";
import type { ClothingItem, ClothingType } from "@/types";
import ClothingCard from "@/components/ClothingCard";

interface CategoryDetailModalProps {
  type: ClothingType;
  items: ClothingItem[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteItem: (id: string) => void;
}

export default function CategoryDetailModal({
  type,
  items,
  isOpen,
  onClose,
  onDeleteItem,
}: CategoryDetailModalProps) {
  const cfg = CLOTHING_CONFIG[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="fixed inset-x-0 bottom-0 top-[10%] bg-[#f8faff] dark:bg-[#0d1117] rounded-t-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border-t border-white/20 touch-none"
          >
            {/* Grab Handle - Now functional for dragging */}
            <div className="w-full flex justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#edf2fb] dark:border-[#1a2332] bg-white dark:bg-[#0d1117]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#edf2fb] dark:bg-[#1a2332] rounded-xl">
                  {cfg.icon.startsWith("/") || cfg.icon.startsWith("http") ? (
                    <img src={cfg.icon} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-xl">{cfg.icon}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-[#edf2fb]">
                    {cfg.pluralName}
                  </h2>
                  <p className="text-[10px] text-gray-400 dark:text-[#7a90c0] font-bold uppercase tracking-wider">
                    {items.length} items
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#edf2fb] dark:bg-[#1a2332] flex items-center justify-center text-gray-500 dark:text-[#7a90c0] active:scale-90 transition-transform"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 touch-pan-y">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center pb-20">
                  <span className="text-5xl opacity-50 grayscale">🧺</span>
                  <p className="text-sm font-medium text-gray-400 dark:text-[#7a90c0]">
                    No {cfg.pluralName.toLowerCase()} here yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 pb-24">
                  {items.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={onDeleteItem}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
