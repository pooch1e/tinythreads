/**
 * WardrobePage — /wardrobe. Category folders with item counts, filterable by
 * size, pattern and colour; tapping a folder opens its items in a sheet where
 * they can be deleted.
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWardrobe } from "@/hooks/useWardrobe";
import { CLOTHING_TYPES, CLOTHING_CONFIG } from "@/constants/clothing";
import { PRIMARY_BUTTON } from "@/constants/styles";
import type {
  BabySize,
  ClothingColour,
  ClothingItem,
  ClothingPattern,
  ClothingType,
} from "@/types";
import PageHeader from "@/components/PageHeader";
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
  const [activePattern, setActivePattern] = useState<ClothingPattern | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ClothingItem | null>(null);
  // Kept after closing so the sheet's exit animation still shows the right category.
  const [selectedCategory, setSelectedCategory] = useState<ClothingType | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const isFilterActive = activeSize !== null || activeColour !== null || activePattern !== null;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeSize && item.size !== activeSize) return false;
      if (activeColour && item.colour?.name !== activeColour.name) return false;
      if (activePattern && item.pattern?.name !== activePattern.name) return false;
      return true;
    });
  }, [items, activeSize, activeColour, activePattern]);

  const matchesByType = useMemo(() => groupItemsByType(filteredItems), [filteredItems]);
  const totalsByType = useMemo(() => groupItemsByType(items), [items]);

  const openCategory = (type: ClothingType) => {
    setSelectedCategory(type);
    setIsCategoryOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    await deleteItem(pendingDelete.id);
    setPendingDelete(null);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Wardrobe" />
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
    <div className="flex flex-col h-full">
      <PageHeader
        title="Wardrobe"
        trailing={
          <button
            onClick={() => navigate("/wardrobe/add")}
            className={`w-11 h-11 rounded-full text-2xl flex items-center justify-center ${PRIMARY_BUTTON}`}
            aria-label="Add clothing item"
          >
            +
          </button>
        }
      />

      <FilterBar
        activeSize={activeSize}
        activeColour={activeColour}
        activePattern={activePattern}
        onSizeChange={setActiveSize}
        onColourChange={setActiveColour}
        onPatternChange={setActivePattern}
      />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 gap-4 pb-12"
        >
          {CLOTHING_TYPES.map((type) => (
            <motion.div
              key={type}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <CategoryFolder
                type={type}
                totalCount={totalsByType[type].length}
                matchCount={matchesByType[type].length}
                isFilterActive={isFilterActive}
                onClick={() => openCategory(type)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <CategoryDetailModal
        type={selectedCategory}
        items={selectedCategory ? matchesByType[selectedCategory] : []}
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        onDeleteItem={(id) => {
          const item = items.find((i) => i.id === id);
          if (item) setPendingDelete(item);
        }}
      />

      <AnimatePresence>
        {pendingDelete && (
          <ConfirmDeleteSheet
            title={`Delete ${CLOTHING_CONFIG[pendingDelete.type].displayName}?`}
            body="This item will be permanently removed from your wardrobe and from any saved outfits that include it."
            onConfirm={handleDeleteConfirm}
            onCancel={() => setPendingDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
