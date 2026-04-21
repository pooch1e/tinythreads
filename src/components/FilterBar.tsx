import type { BabySize, ClothingColour } from '@/types';
import { BABY_SIZES } from '@/constants/sizes';
import { COLOUR_PALETTE } from '@/constants/colours';

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
        {BABY_SIZES.map((size) => {
          const active = activeSize === size;
          return (
            <button
              key={size}
              onClick={() => onSizeChange(active ? null : size)}
              className={`flex-shrink-0 px-3 py-1 rounded-full border text-xs font-medium transition-all active:scale-95 ${
                active
                  ? 'border-pink-400 bg-pink-50 text-pink-700'
                  : 'border-gray-200 bg-white text-gray-500'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Colour row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-gray-400 flex-shrink-0">Colour</span>
        {COLOUR_PALETTE.map((colour) => {
          const active = activeColour?.name === colour.name;
          return (
            <button
              key={colour.name}
              onClick={() => onColourChange(active ? null : colour)}
              title={colour.name}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all active:scale-90 ${
                active ? 'border-pink-500 scale-110' : 'border-gray-200'
              }`}
              style={{ backgroundColor: colour.hex }}
              aria-label={colour.name}
              aria-pressed={active}
            />
          );
        })}
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
