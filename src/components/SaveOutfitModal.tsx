/**
 * SaveOutfitModal — bottom sheet prompting for a name before saving the
 * current outfit; validates that the name isn't blank.
 */
import { useState, useRef, useEffect } from "react";
import BottomSheet from "@/components/BottomSheet";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, SHEET_BUTTON } from "@/constants/styles";

interface SaveOutfitModalProps {
  onSave: (name: string) => void;
  onCancel: () => void;
}

export default function SaveOutfitModal({ onSave, onCancel }: SaveOutfitModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please give your outfit a name.");
      return;
    }
    onSave(name.trim());
  };

  return (
    <BottomSheet title="Name your outfit" onClose={onCancel}>
      {/* text-base (16px) stops iOS Safari auto-zooming the page when the input is focused. */}
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => { setName(e.target.value); setError(""); }}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        placeholder="e.g. Sunday park walk"
        maxLength={60}
        aria-label="Outfit name"
        aria-invalid={error !== ""}
        className="w-full px-4 py-3 rounded-2xl border border-border-strong bg-surface text-base text-fg placeholder-fg-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-surface"
      />

      {error && <p className="text-xs text-error-text -mt-2">{error}</p>}

      <div className="flex flex-col gap-2 pt-1">
        <button onClick={handleSave} className={`${SHEET_BUTTON} ${PRIMARY_BUTTON}`}>
          Save outfit
        </button>
        <button onClick={onCancel} className={`${SHEET_BUTTON} ${SECONDARY_BUTTON}`}>
          Cancel
        </button>
      </div>
    </BottomSheet>
  );
}
