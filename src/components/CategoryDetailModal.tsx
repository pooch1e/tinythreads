/**
 * CategoryDetailModal — full-height bottom sheet listing the (filtered) items
 * in one clothing category. Dragging the handle/header down or pressing Escape
 * dismisses it; the item grid scrolls independently.
 */
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useId } from "react";
import { CLOTHING_CONFIG } from "@/constants/clothing";
import { FOCUS_RING } from "@/constants/styles";
import type { ClothingItem, ClothingType } from "@/types";
import { formatItemCount } from "@/utils/clothing";
import { useEscapeToClose } from "@/hooks/useEscapeToClose";
import ClothingCard from "@/components/ClothingCard";
import CategoryIcon from "@/components/CategoryIcon";

interface CategoryDetailModalProps {
  type: ClothingType | null;
  items: ClothingItem[];
  isOpen: boolean;
  onClose: () => void;
  onDeleteItem: (id: string) => void;
}

const DISMISS_OFFSET = 150;
const DISMISS_VELOCITY = 500;

export default function CategoryDetailModal({
  type,
  items,
  isOpen,
  onClose,
  onDeleteItem,
}: CategoryDetailModalProps) {
  const titleId = useId();
  const dragControls = useDragControls();
  useEscapeToClose(onClose, isOpen);

  const cfg = type ? CLOTHING_CONFIG[type] : null;

  return (
    <AnimatePresence>
      {isOpen && type && cfg && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) {
                onClose();
              }
            }}
            className="fixed inset-x-0 mx-auto w-full max-w-[430px] bottom-0 top-[10%] bg-bg rounded-t-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border-t border-white/20"
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="touch-none cursor-grab active:cursor-grabbing bg-surface"
            >
              <div className="w-full flex justify-center py-3">
                <div className="w-12 h-1.5 rounded-full bg-border" />
              </div>

              <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-surface-muted rounded-xl">
                    <CategoryIcon type={type} className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 id={titleId} className="text-xl font-bold text-fg">
                      {cfg.pluralName}
                    </h2>
                    <p className="text-[10px] text-fg-muted font-bold uppercase tracking-wider">
                      {formatItemCount(items.length)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  onPointerDown={(e) => e.stopPropagation()}
                  autoFocus
                  aria-label={`Close ${cfg.pluralName.toLowerCase()}`}
                  className={`w-11 h-11 rounded-full bg-surface-muted flex items-center justify-center text-fg-muted active:scale-90 transition-transform ${FOCUS_RING}`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center pb-20">
                  <span className="text-5xl opacity-50 grayscale" aria-hidden="true">🧺</span>
                  <p className="text-sm font-medium text-fg-muted">
                    No {cfg.pluralName.toLowerCase()} here yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 pb-24">
                  {items.map((item) => (
                    <ClothingCard key={item.id} item={item} onDelete={onDeleteItem} />
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
