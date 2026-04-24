import type { BabySize, ClothingColour, ClothingPattern } from '@/types';
import SizePicker from '@/components/SizePicker';
import ColourPicker from '@/components/ColourPicker';
import { PatternPicker } from '@/components/PatternPicker';

interface FilterBarProps {
  activeSize: BabySize | null;
  activeColour: ClothingColour | null;
  activePattern: ClothingPattern | null;
  onSizeChange: (size: BabySize | null) => void;
  onColourChange: (colour: ClothingColour | null) => void;
  onPatternChange: (pattern: ClothingPattern | null) => void;
}

export default function FilterBar({
  activeSize,
  activeColour,
  activePattern,
  onSizeChange,
  onColourChange,
  onPatternChange,
}: FilterBarProps) {
  const hasActiveFilter = activeSize !== null || activeColour !== null || activePattern !== null;

  return (
    <div className="border-b border-lavender-2 dark:border-border">
      {/* Size row */}
      <div className="flex flex-col gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <h2 className="text-sm font-semibold text-gray-400 dark:text-text-muted">Size</h2>
        <SizePicker value={activeSize} onChange={onSizeChange} />
      </div>

      {/* Pattern row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-gray-400 dark:text-text-muted shrink-0">Pattern</span>
        <PatternPicker value={activePattern} onChange={onPatternChange} />
      </div>

      {/* Colour row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">        <ColourPicker value={activeColour} onChange={onColourChange} swatchSize="w-6 h-6" />
      </div>

      {/* Clear filters */}
      {hasActiveFilter && (
        <div className="flex justify-end px-4 pb-2">
          <button
            onClick={() => { onSizeChange(null); onColourChange(null); onPatternChange(null); }}
            className="text-xs text-[#abc4ff] font-medium active:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 rounded"
          >
            Clear filters ×
          </button>
        </div>
      )}
    </div>
  );
}
