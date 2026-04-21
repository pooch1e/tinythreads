import type { BabySize, ClothingColour } from '@/types';
import SizePicker from '@/components/SizePicker';
import ColourPicker from '@/components/ColourPicker';

interface FilterBarProps {
  activeSize: BabySize | null;
  activeColour: ClothingColour | null;
  onSizeChange: (size: BabySize | null) => void;
  onColourChange: (colour: ClothingColour | null) => void;
}

export default function FilterBar({
  activeSize,
  activeColour,
  onSizeChange,
  onColourChange,
}: FilterBarProps) {
  const hasActiveFilter = activeSize !== null || activeColour !== null;

  return (
    <div className="border-b border-gray-100">
      {/* Size row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Size</span>
        <SizePicker value={activeSize} onChange={onSizeChange} />
      </div>

      {/* Colour row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Colour</span>
        <ColourPicker value={activeColour} onChange={onColourChange} swatchSize="w-6 h-6" />
      </div>

      {/* Clear filters */}
      {hasActiveFilter && (
        <div className="flex justify-end px-4 pb-2">
          <button
            onClick={() => { onSizeChange(null); onColourChange(null); }}
            className="text-xs text-pink-500 font-medium active:opacity-60"
          >
            Clear filters ×
          </button>
        </div>
      )}
    </div>
  );
}
