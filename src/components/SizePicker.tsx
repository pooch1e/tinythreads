/**
 * SizePicker — wrapping row of size toggle pills. Clicking the active size
 * deselects it.
 */
import type { BabySize } from "@/types";
import { BABY_SIZES } from "@/constants/sizes";
import { TOGGLE, TOGGLE_ACTIVE, TOGGLE_INACTIVE } from "@/constants/styles";

interface SizePickerProps {
  value: BabySize | null;
  onChange: (size: BabySize | null) => void;
}

export default function SizePicker({ value, onChange }: SizePickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {BABY_SIZES.map((size) => {
        const active = value === size;
        return (
          <button
            key={size}
            onClick={() => onChange(active ? null : size)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium ${TOGGLE} ${
              active ? TOGGLE_ACTIVE : TOGGLE_INACTIVE
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
