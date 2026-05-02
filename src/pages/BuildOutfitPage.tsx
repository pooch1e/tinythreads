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

  const itemsByType = useMemo(() => groupItemsByType(items), [items]);
  const imageMap = useItemImages(items);

  const [selectedIndices, setSelectedIndices] = useState<Record<ClothingType, number>>(
    () => Object.fromEntries(CLOTHING_TYPES.map((t) => [t, 0])) as Record<ClothingType, number>,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItemIds = useMemo(() => {
    const result: Partial<Record<ClothingType, string>> = {};
    for (const type of CLOTHING_TYPES) {
      const typeItems = itemsByType[type];
      if (typeItems.length > 0) result[type] = typeItems[selectedIndices[type]]?.id;
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
        <div className="px-4 py-4 border-b border-[#d7e3fc] dark:border-[#263352]">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-[#edf2fb]">Build Outfit</h1>
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
      <div className="relative flex flex-col items-center justify-center px-4 py-4 border-b border-[#d7e3fc] dark:border-[#263352]">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-[#edf2fb]">Build Outfit</h1>
        <p className="text-[10px] font-semibold text-gray-400 dark:text-[#7a90c0] uppercase tracking-wider mt-1">Swipe each row to change</p>
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
      <div className="px-4 py-4 border-t border-[#d7e3fc] dark:border-[#263352] space-y-2">
        {atLimit && (
          <p className="text-xs text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-3 py-2 rounded-xl">
            You've reached the {MAX_LOOKS} outfit limit. Delete an outfit to save a new one.
          </p>
        )}
        <button
          onClick={() => setModalVisible(true)}
          disabled={!hasAnySelection || atLimit}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-[colors,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 ${
            !hasAnySelection || atLimit
              ? 'bg-[#edf2fb] dark:bg-[#1a2332] text-gray-400 dark:text-[#7a90c0] cursor-not-allowed'
              : 'bg-[#abc4ff] text-white shadow-sm active:bg-[#92aaee]'
          }`}
        >
          Save outfit
        </button>
      </div>

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
