import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useWardrobe } from "@/hooks/useWardrobe";
import { CLOTHING_TYPES, CLOTHING_CONFIG } from "@/constants/clothing";
import type {
  BabySize,
  ClothingColour,
  ClothingItem,
  ClothingPattern,
} from "@/types";
import ClothingCard from "@/components/ClothingCard";
import FilterBar from "@/components/FilterBar";
import EmptyState from "@/components/EmptyState";
import ConfirmDeleteSheet from "@/components/ConfirmDeleteSheet";
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

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeSize && item.size !== activeSize) return false;
      if (activeColour && item.colour?.name !== activeColour.name) return false;
      if (activePattern && item.pattern?.name !== activePattern.name)
        return false;
      return true;
    });
  }, [items, activeSize, activeColour, activePattern]);

  const sections = useMemo(() => {
    const byType = groupItemsByType(filteredItems);
    return CLOTHING_TYPES.map((type) => ({
      type,
      cfg: CLOTHING_CONFIG[type],
      items: byType[type],
      totalCount: items.filter((i) => i.type === type).length,
    })).filter((s) => s.totalCount > 0);
  }, [filteredItems, items]);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    await deleteItem(pendingDelete.id);
    setPendingDelete(null);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b border-lavender-2 dark:border-border">
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-4 border-b border-lavender-2 dark:border-border">
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

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 pb-16">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-gray-400 dark:text-text-muted">
              No items match the current filters.
            </p>
            <button
              onClick={() => {
                setActiveSize(null);
                setActiveColour(null);
                setActivePattern(null);
              }}
              className="text-sm text-[#abc4ff] font-medium active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 rounded"
            >
              Clear filters
            </button>
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section.type}
              className="px-4 py-4 border-b border-[#edf2fb] dark:border-[#1a2332] last:border-b-0"
            >
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{section.cfg.icon}</span>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-lavender-2">
                  {section.cfg.pluralName}
                </h2>
                <span className="text-xs text-gray-400 dark:text-text-muted font-medium">
                  {section.items.length}
                  {section.items.length !== section.totalCount && (
                    <span> of {section.totalCount}</span>
                  )}
                </span>
              </div>

              {/* Cards row */}
              {section.items.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {section.items.map((item) => (
                    <ClothingCard
                      key={item.id}
                      item={item}
                      onDelete={() => setPendingDelete(item)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-text-muted italic">
                  No {section.cfg.pluralName.toLowerCase()} match the current
                  filters.
                </p>
              )}
            </div>
          ))
        )}
      </div>

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
