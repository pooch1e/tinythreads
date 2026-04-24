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
    <div className="flex flex-wrap gap-3 p-2 rounded-2xl bg-[#edf2fb] dark:bg-[#1a2332]">
      {COLOUR_PALETTE.map((colour) => {
        const active = value?.name === colour.name;
        return (
          <button
            key={colour.name}
            onClick={() => onChange(active ? null : colour)}
            title={colour.name}
            className={`${swatchSize} rounded-full border-2 transition-[colors,transform] duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 ${
              active
                ? "border-[#abc4ff] scale-110"
                : "border-periwinkle dark:border-border"
            }`}
            style={{ backgroundColor: colour.hex }}
            aria-label={colour.name}
            aria-pressed={active}
          />
        );
      })}
    </div>
  );
}
