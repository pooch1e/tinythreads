/**
 * ColourPicker — wrapping grid of circular colour swatches. Clicking the
 * active colour deselects it. Each swatch keeps a 44px touch target; `compact`
 * only shrinks the visible circle.
 */
import type { ClothingColour } from "@/types";
import { COLOUR_PALETTE } from "@/constants/colours";
import { FOCUS_RING } from "@/constants/styles";

interface ColourPickerProps {
  value: ClothingColour | null;
  onChange: (colour: ClothingColour | null) => void;
  compact?: boolean;
}

export default function ColourPicker({ value, onChange, compact = false }: ColourPickerProps) {
  return (
    <div className={`flex flex-wrap ${compact ? "gap-0" : "gap-1"} p-1 rounded-2xl bg-surface-muted`}>
      {COLOUR_PALETTE.map((colour) => {
        const active = value?.name === colour.name;
        return (
          <button
            key={colour.name}
            onClick={() => onChange(active ? null : colour)}
            title={colour.name}
            aria-label={colour.name}
            aria-pressed={active}
            className={`w-11 h-11 flex items-center justify-center rounded-full active:scale-90 transition-transform duration-150 ${FOCUS_RING}`}
          >
            <span
              className={`${compact ? "w-7 h-7" : "w-9 h-9"} rounded-full border-2 transition-[colors,transform] duration-150 ${
                active ? "border-primary scale-110" : "border-border-strong"
              }`}
              style={{ backgroundColor: colour.hex }}
            />
          </button>
        );
      })}
    </div>
  );
}
