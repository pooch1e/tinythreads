/**
 * BuildOutfitPage — /build. One swipeable row per clothing category to pick an
 * item from each, then save the combination as a named outfit.
 */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useWardrobe } from "@/hooks/useWardrobe";
import { useLooks } from "@/hooks/useLooks";
import { useItemImages } from "@/hooks/useItemImages";
import { CLOTHING_TYPES } from "@/constants/clothing";
import { MAX_LOOKS } from "@/constants/limits";
import { DISABLED_BUTTON, PRIMARY_BUTTON } from "@/constants/styles";
import type { ClothingType } from "@/types";
import PageHeader from "@/components/PageHeader";
import OutfitSlotRow from "@/components/OutfitSlotRow";
import EmptyState from "@/components/EmptyState";
import SaveOutfitModal from "@/components/SaveOutfitModal";
import { groupItemsByType } from "@/utils/clothing";

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
  const canSave = hasAnySelection && !atLimit;

  const handleSave = (name: string) => {
    addLook(name, selectedItemIds);
    setModalVisible(false);
    navigate("/outfits");
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Build Outfit" />
        <EmptyState
          icon="✨"
          title="No clothes yet"
          description="Add some clothing items to your wardrobe before building an outfit."
          actionLabel="Go to Wardrobe"
          onAction={() => navigate("/wardrobe")}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Build Outfit" subtitle="Swipe each row to change" />

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

      <div className="px-4 py-4 border-t border-border space-y-2">
        {atLimit && (
          <p className="text-xs text-center text-warning-text bg-warning-surface px-3 py-2 rounded-xl">
            You've reached the {MAX_LOOKS} outfit limit. Delete an outfit to save a new one.
          </p>
        )}
        <button
          onClick={() => setModalVisible(true)}
          disabled={!canSave}
          className={`w-full py-4 rounded-2xl font-semibold text-base ${
            canSave ? PRIMARY_BUTTON : DISABLED_BUTTON
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
