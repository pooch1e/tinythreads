import type { BabySize } from '@/types';
import { BABY_SIZES } from '@/constants/sizes';

interface SizePickerProps {
  value: BabySize | null;
  onChange: (size: BabySize | null) => void;
}

/**
 * Horizontally scrollable row of size toggle pills.
 * Clicking the active size deselects it.
 */
export default function SizePicker({ value, onChange }: SizePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {BABY_SIZES.map((size) => {
        const active = value === size;
        return (
          <button
            key={size}
            onClick={() => onChange(active ? null : size)}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all active:scale-95 ${
              active
                ? 'border-pink-400 bg-pink-50 text-pink-700'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
