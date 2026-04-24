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
            className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-[colors,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 ${
              active
                ? 'border-[#abc4ff] bg-[#edf2fb] text-[#3b5bdb] dark:bg-[#1a2442] dark:text-[#abc4ff] dark:border-[#abc4ff]'
                : 'border-[#ccdbfd] dark:border-[#263352] bg-white dark:bg-[#1a2332] text-gray-600 dark:text-[#b6ccfe]'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
