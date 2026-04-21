import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useLooks } from '@/hooks/useLooks';
import { useItemImages } from '@/hooks/useItemImages';
import { CLOTHING_TYPES } from '@/constants/clothing';
import type { ClothingType } from '@/types';
import { MAX_LOOKS } from '@/constants/limits';
import OutfitSlotRow from '@/components/OutfitSlotRow';
import EmptyState from '@/components/EmptyState';
import SaveOutfitModal from '@/components/SaveOutfitModal';
import { groupItemsByType } from '@/utils/clothing';

export default function BuildOutfitPage() {
  const navigate = useNavigate();
  const { items } = useWardrobe();
  const { addLook, atLimit } = useLooks();

  // Group items by type
  const itemsByType = useMemo(() => groupItemsByType(items), [items]);

  // Load all images upfront
  const imageMap = useItemImages(items);

  // Selected index per slot (always 0-based into that type's items array)
  const [selectedIndices, setSelectedIndices] = useState<Record<ClothingType, number>>(
    () => Object.fromEntries(CLOTHING_TYPES.map((t) => [t, 0])) as Record<ClothingType, number>,
  );

  const [modalVisible, setModalVisible] = useState(false);

  // Compute selected item IDs for non-empty slots
  const selectedItemIds = useMemo(() => {
    const result: Partial<Record<ClothingType, string>> = {};
    for (const type of CLOTHING_TYPES) {
      const typeItems = itemsByType[type];
      if (typeItems.length > 0) {
        result[type] = typeItems[selectedIndices[type]]?.id;
      }
    }
    return result;
  }, [itemsByType, selectedIndices]);

  const hasAnySelection = Object.values(selectedItemIds).some(Boolean);

  const handleSave = (name: string) => {
    addLook(name, selectedItemIds);
    setModalVisible(false);
    navigate('/outfits');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-800">Build Outfit</h1>
        </div>
        <EmptyState
          icon="✨"
          title="No clothes yet"
          description="Add some clothing items to your wardrobe before building an outfit."
          actionLabel="Go to Wardrobe"
          onAction={() => navigate('/wardrobe')}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-800">Build Outfit</h1>
        <p className="text-xs text-gray-400 mt-0.5">Swipe each row to change the item</p>
      </div>

      {/* Slot rows */}
      <div className="flex-1 overflow-y-auto">
        {CLOTHING_TYPES.map((type) => (
          <OutfitSlotRow
            key={type}
            type={type}
            items={itemsByType[type]}
            selectedIndex={selectedIndices[type]}
            imageMap={imageMap}
            onIndexChange={(index) =>
              setSelectedIndices((prev) => ({ ...prev, [type]: index }))
            }
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-2">
        {atLimit && (
          <p className="text-xs text-center text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
            You've reached the {MAX_LOOKS} outfit limit. Delete an outfit to save a new one.
          </p>
        )}
        <button
          onClick={() => setModalVisible(true)}
          disabled={!hasAnySelection || atLimit}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-95 ${
            !hasAnySelection || atLimit
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-pink-500 text-white shadow-sm active:bg-pink-600'
          }`}
        >
          Save outfit
        </button>
      </div>

      {/* Save modal */}
      <AnimatePresence>
        {modalVisible && (
          <SaveOutfitModal
            onSave={handleSave}
            onCancel={() => setModalVisible(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
