/**
 * FilterBar — size, pattern and colour filters for the wardrobe, with a
 * "clear filters" action shown while any filter is active.
 */
import type { BabySize, ClothingColour, ClothingPattern } from "@/types";
import SizePicker from "@/components/SizePicker";
import ColourPicker from "@/components/ColourPicker";
import PatternPicker from "@/components/PatternPicker";
import { FOCUS_RING } from "@/constants/styles";

interface FilterBarProps {
  activeSize: BabySize | null;
  activeColour: ClothingColour | null;
  activePattern: ClothingPattern | null;
  onSizeChange: (size: BabySize | null) => void;
  onColourChange: (colour: ClothingColour | null) => void;
  onPatternChange: (pattern: ClothingPattern | null) => void;
}

const SECTION = "flex flex-col gap-2 px-4 py-2";
const HEADING = "text-sm font-semibold text-fg-muted";

export default function FilterBar({
  activeSize,
  activeColour,
  activePattern,
  onSizeChange,
  onColourChange,
  onPatternChange,
}: FilterBarProps) {
  const hasActiveFilter = activeSize !== null || activeColour !== null || activePattern !== null;

  const clearFilters = () => {
    onSizeChange(null);
    onColourChange(null);
    onPatternChange(null);
  };

  return (
    <div className="border-b border-border bg-surface">
      <div className={SECTION}>
        <h2 className={HEADING}>Size</h2>
        <SizePicker value={activeSize} onChange={onSizeChange} />
      </div>

      <div className={SECTION}>
        <h2 className={HEADING}>Pattern</h2>
        <PatternPicker value={activePattern} onChange={onPatternChange} />
      </div>

      <div className={SECTION}>
        <h2 className={HEADING}>Colour</h2>
        <ColourPicker value={activeColour} onChange={onColourChange} compact />
      </div>

      {hasActiveFilter && (
        <div className="flex justify-end px-2">
          <button
            onClick={clearFilters}
            className={`min-h-11 px-2 text-xs text-primary-text font-medium active:opacity-60 rounded ${FOCUS_RING}`}
          >
            Clear filters ×
          </button>
        </div>
      )}
    </div>
  );
}
