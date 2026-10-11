/**
 * PatternPicker — wrapping row of pattern toggle pills. Clicking the active
 * pattern deselects it.
 */
import { PATTERNS } from "@/constants/patterns";
import { TOGGLE, TOGGLE_ACTIVE, TOGGLE_INACTIVE } from "@/constants/styles";
import type { ClothingPattern } from "@/types";

interface PatternPickerProps {
  value: ClothingPattern | null;
  onChange: (pattern: ClothingPattern | null) => void;
}

export default function PatternPicker({ value, onChange }: PatternPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PATTERNS.map((name) => {
        const active = value?.name === name;
        return (
          <button
            key={name}
            onClick={() => onChange(active ? null : { name })}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-full border text-sm font-medium capitalize ${TOGGLE} ${
              active ? TOGGLE_ACTIVE : TOGGLE_INACTIVE
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
