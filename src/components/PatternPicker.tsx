import { PATTERNS } from "@/constants/patterns";
import { ClothingPattern } from "@/types";

interface PatternPickerProps {
  value: ClothingPattern | null;
  onChange: (pattern: ClothingPattern | null) => void;
}

export function PatternPicker({ value, onChange }: PatternPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-[#edf2fb] dark:bg-[#1a2332]">
      {PATTERNS.map((p) => {
        const pattern: ClothingPattern = { name: p };
        const active = value?.name === pattern.name;
        return (
          <button
            key={pattern.name}
            onClick={() => onChange(active ? null : pattern)}
            title={pattern.name}
            className={`px-3 py-1.5 rounded-full border-2 text-sm font-medium capitalize transition-[colors,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 ${
              active
                ? "border-[#abc4ff] bg-[#edf2fb] text-[#3b5bdb] dark:bg-[#1a2442] dark:text-[#abc4ff] dark:border-[#abc4ff]"
                : "border-periwinkle bg-white text-gray-600 dark:bg-[#1a2332] dark:border-border dark:text-[#b6ccfe]"
            }`}
            aria-label={pattern.name}
            aria-pressed={active}
          >
            {pattern.name}
          </button>
        );
      })}
    </div>
  );
}
