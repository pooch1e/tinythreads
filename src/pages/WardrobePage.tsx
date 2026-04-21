import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardrobe } from '@/hooks/useWardrobe';
import { CLOTHING_TYPES, CLOTHING_CONFIG } from '@/constants/clothing';
import type { BabySize, ClothingColour, ClothingItem } from '@/types';
import ClothingCard from '@/components/ClothingCard';
import FilterBar from '@/components/FilterBar';
import EmptyState from '@/components/EmptyState';

// ── Confirmation dialog ──────────────────────────────────────

interface ConfirmDeleteProps {
  item: ClothingItem;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDeleteDialog({ item, onConfirm, onCancel }: ConfirmDeleteProps) {
  const cfg = CLOTHING_CONFIG[item.type];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />
      {/* Sheet */}
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl px-5 py-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-800 text-center">
          Delete {cfg.displayName}?
        </h3>
        <p className="text-sm text-gray-500 text-center">
          This item will be permanently removed from your wardrobe and any saved outfits that include it.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={onConfirm}
            className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-semibold text-sm active:bg-red-600 active:scale-95 transition-all"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm active:bg-gray-200 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────

export default function WardrobePage() {
  const navigate = useNavigate();
  const { items, deleteItem } = useWardrobe();

  const [activeSize, setActiveSize] = useState<BabySize | null>(null);
  const [activeColour, setActiveColour] = useState<ClothingColour | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ClothingItem | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeSize && item.size !== activeSize) return false;
      if (activeColour && item.colour?.name !== activeColour.name) return false;
      return true;
    });
  }, [items, activeSize, activeColour]);

  // Sections: only show types that have at least one item (filtered or unfiltered)
  const sections = useMemo(() => {
    return CLOTHING_TYPES.map((type) => ({
      type,
      cfg: CLOTHING_CONFIG[type],
      items: filteredItems.filter((i) => i.type === type),
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
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800">Wardrobe</h1>
        </div>
        <EmptyState
          icon="👗"
          title="Your wardrobe is empty"
          description="Add your baby's clothing items to get started."
          actionLabel="Add first item"
          onAction={() => navigate('/wardrobe/add')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-800">Wardrobe</h1>
        <button
          onClick={() => navigate('/wardrobe/add')}
          className="w-10 h-10 rounded-full bg-pink-500 text-white text-2xl flex items-center justify-center shadow-sm active:bg-pink-600 active:scale-95 transition-all"
          aria-label="Add clothing item"
        >
          +
        </button>
      </div>

      {/* Filters */}
      <FilterBar
        activeSize={activeSize}
        activeColour={activeColour}
        onSizeChange={setActiveSize}
        onColourChange={setActiveColour}
      />

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 pb-16">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-gray-400">No items match the current filters.</p>
            <button
              onClick={() => { setActiveSize(null); setActiveColour(null); }}
              className="text-sm text-pink-500 font-medium active:opacity-60"
            >
              Clear filters
            </button>
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.type} className="px-4 py-4 border-b border-gray-50 last:border-b-0">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{section.cfg.icon}</span>
                <h2 className="text-sm font-semibold text-gray-700">
                  {section.cfg.pluralName}
                </h2>
                <span className="text-xs text-gray-400 font-medium">
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
                <p className="text-xs text-gray-400 italic">
                  No {section.cfg.pluralName.toLowerCase()} match the current filters.
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation sheet */}
      {pendingDelete && (
        <ConfirmDeleteDialog
          item={pendingDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
