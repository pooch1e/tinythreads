import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useLooks } from '@/hooks/useLooks';
import { useItemImages } from '@/hooks/useItemImages';
import { CLOTHING_TYPES } from '@/constants/clothing';
import type { ClothingType } from '@/types';
import OutfitSlotRow from '@/components/OutfitSlotRow';
import EmptyState from '@/components/EmptyState';

// ── Save modal ───────────────────────────────────────────────

interface SaveModalProps {
  onSave: (name: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

function SaveModal({ onSave, onCancel, isSaving }: SaveModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Small delay so the animation completes before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please give your outfit a name.');
      return;
    }
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl px-5 py-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-800 text-center">Name your outfit</h3>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="e.g. Sunday park walk"
          maxLength={60}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
        />

        {error && (
          <p className="text-xs text-red-500 -mt-2">{error}</p>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all active:scale-95 ${
              isSaving
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-pink-500 text-white active:bg-pink-600'
            }`}
          >
            {isSaving ? 'Saving…' : 'Save outfit'}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold text-sm active:bg-gray-200 active:scale-95 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────

export default function BuildOutfitPage() {
  const navigate = useNavigate();
  const { items } = useWardrobe();
  const { addLook, atLimit } = useLooks();

  // Group items by type
  const itemsByType = useMemo(() => {
    const map: Partial<Record<ClothingType, typeof items>> = {};
    for (const type of CLOTHING_TYPES) {
      map[type] = items.filter((i) => i.type === type);
    }
    return map as Record<ClothingType, typeof items>;
  }, [items]);

  // Load all images upfront
  const imageMap = useItemImages(items);

  // Selected index per slot (always 0-based into that type's items array)
  const [selectedIndices, setSelectedIndices] = useState<Record<ClothingType, number>>({
    hat: 0,
    top: 0,
    trousers: 0,
    socks: 0,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    addLook(name, selectedItemIds);
    setIsSaving(false);
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
            You've reached the 10 outfit limit. Delete an outfit to save a new one.
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
          <SaveModal
            onSave={handleSave}
            onCancel={() => setModalVisible(false)}
            isSaving={isSaving}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
