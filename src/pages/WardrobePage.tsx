import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useWardrobe } from "@/hooks/useWardrobe";
import { CLOTHING_TYPES, CLOTHING_CONFIG } from "@/constants/clothing";
import type {
  BabySize,
  ClothingColour,
  ClothingItem,
  ClothingPattern,
  ClothingType,
} from "@/types";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import ConfirmDeleteSheet from "@/components/ConfirmDeleteSheet";
import CategoryFolder from "@/components/CategoryFolder";
import CategoryDetailModal from "@/components/CategoryDetailModal";
import { groupItemsByType } from "@/utils/clothing";

export default function WardrobePage() {
  const navigate = useNavigate();
  const { items, deleteItem } = useWardrobe();

  const [activeSize, setActiveSize] = useState<BabySize | null>(null);
  const [activeColour, setActiveColour] = useState<ClothingColour | null>(null);
  const [activePattern, setActivePattern] = useState<ClothingPattern | null>(
    null,
  );
  const [pendingDelete, setPendingDelete] = useState<ClothingItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ClothingType | null>(
    null,
  );

  const isFilterActive = activeSize !== null || activeColour !== null || activePattern !== null;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeSize && item.size !== activeSize) return false;
      if (activeColour && item.colour?.name !== activeColour.name) return false;
      if (activePattern && item.pattern?.name !== activePattern.name)
        return false;
      return true;
    });
  }, [items, activeSize, activeColour, activePattern]);

  const itemsByType = useMemo(() => groupItemsByType(filteredItems), [filteredItems]);
  const totalItemsByType = useMemo(() => groupItemsByType(items), [items]);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    await deleteItem(pendingDelete.id);
    setPendingDelete(null);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="relative flex items-center justify-center px-4 py-4 border-b border-lavender-2 dark:border-border">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-[#edf2fb]">
            Wardrobe
          </h1>
        </div>
        <EmptyState
          icon="👗"
          title="Your wardrobe is empty"
          description="Add your baby's clothing items to get started."
          actionLabel="Add first item"
          onAction={() => navigate("/wardrobe/add")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f8faff] dark:bg-[#0d1117]">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-4 border-b border-lavender-2 dark:border-border bg-white dark:bg-[#0d1117]">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-[#edf2fb]">
          Wardrobe
        </h1>
        <div className="absolute right-4">
          <button
            onClick={() => navigate("/wardrobe/add")}
            className="w-10 h-10 rounded-full bg-[#abc4ff] text-white text-2xl flex items-center justify-center shadow-sm active:bg-[#92aaee] active:scale-95 transition-[colors,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50"
            aria-label="Add clothing item"
          >
            +
          </button>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        activeSize={activeSize}
        activeColour={activeColour}
        activePattern={activePattern}
        onSizeChange={setActiveSize}
        onColourChange={setActiveColour}
        onPatternChange={setActivePattern}
      />

      {/* Folders Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-2 gap-4 pb-12"
        >
          {CLOTHING_TYPES.map((type) => {
            const hasFilteredItems = isFilterActive && (itemsByType[type]?.length || 0) > 0;
            return (
            <motion.div
              key={type}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CategoryFolder
                type={type}
                count={totalItemsByType[type]?.length || 0}
                isFiltered={hasFilteredItems}
                onClick={() => setSelectedCategory(type)}
              />
            </motion.div>
          )})}
        </motion.div>
      </div>

      {/* Category Detail Modal */}
      <CategoryDetailModal
        type={selectedCategory || "top"}
        items={selectedCategory ? itemsByType[selectedCategory] || [] : []}
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onDeleteItem={(id) => {
          const item = items.find((i) => i.id === id);
          if (item) setPendingDelete(item);
        }}
      />

      {pendingDelete && (
        <ConfirmDeleteSheet
          title={`Delete ${CLOTHING_CONFIG[pendingDelete.type].displayName}?`}
          body="This item will be permanently removed from your wardrobe and any saved outfits that include it."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
