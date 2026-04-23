import type { ClothingColour } from "@/types";
import { COLOUR_PALETTE } from "@/constants/colours";

interface ColourPickerProps {
  value: ClothingColour | null;
  onChange: (colour: ClothingColour | null) => void;
  /** Swatch button size class. Defaults to 'w-9 h-9'. */
  swatchSize?: string;
}

/**
 * Row of circular colour swatch buttons.
 * Clicking the active colour deselects it.
 */
export default function ColourPicker({
  value,
  onChange,
  swatchSize = "w-9 h-9",
}: ColourPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {COLOUR_PALETTE.map((colour) => {
        const active = value?.name === colour.name;
        return (
          <div key={colour.name} className=" w-9 h-9">
            <button
              onClick={() => onChange(active ? null : colour)}
              title={colour.name}
              className={`${swatchSize} rounded-full border-2 transition-all active:scale-90 relative ${
                active ? "border-black scale-110" : "border-gray-200"
              }`}
              style={{ backgroundColor: colour.hex }}
              aria-label={colour.name}
              aria-pressed={active}
            >
              <span className="absolute top-1/2 left-1/2 -translate-1/2 size-12"></span>
              {/* testing tailwind lab trick to get the animated div*/}
            </button>
          </div>
        );
      })}
    </div>
  );
}
