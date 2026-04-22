import type { ClothingColour } from "@/types";
import { COLOUR_PALETTE } from "@/constants/colours";
import { motion, AnimatePresence } from "framer-motion";

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
          <button
            key={colour.name}
            onClick={() => onChange(active ? null : colour)}
            title={colour.name}
            className={`${swatchSize} rounded-full border-2 transition-all active:scale-90 ${
              active ? "border-pink-500 scale-110" : "border-gray-200"
            }`}
            style={{ backgroundColor: colour.hex }}
            aria-label={colour.name}
            aria-pressed={active}
          >
            <AnimatePresence>
              {active && (
                <motion.div
                  layoutId="glassy"
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.10)",
                    backdropFilter: "blur(6px)",
                    border: "1.5px solid rgba(255,255,255,0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
