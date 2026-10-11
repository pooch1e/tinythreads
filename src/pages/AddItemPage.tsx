/**
 * AddItemPage — /wardrobe/add. Pick a category (required) plus optional size,
 * pattern and colour, then take or choose a photo to add the item.
 */
import { useNavigate } from "react-router-dom";
import { useRef, useState, type ChangeEvent } from "react";
import { useWardrobe } from "@/hooks/useWardrobe";
import { CLOTHING_TYPES, CLOTHING_CONFIG } from "@/constants/clothing";
import {
  DISABLED_BUTTON,
  FOCUS_RING,
  PRIMARY_BUTTON,
  TOGGLE,
  TOGGLE_ACTIVE,
  TOGGLE_INACTIVE,
} from "@/constants/styles";
import type {
  ClothingType,
  BabySize,
  ClothingColour,
  ClothingPattern,
} from "@/types";
import PageHeader from "@/components/PageHeader";
import CategoryIcon from "@/components/CategoryIcon";
import SizePicker from "@/components/SizePicker";
import ColourPicker from "@/components/ColourPicker";
import PatternPicker from "@/components/PatternPicker";

const SECTION_HEADING = "text-sm font-semibold text-fg-secondary uppercase tracking-wide mb-3";
const OPTIONAL_LABEL = "text-fg-muted font-normal normal-case";
const PHOTO_BUTTON = "py-4 rounded-2xl font-semibold text-base border-2 flex items-center justify-center gap-2";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { addItem, isAdding } = useWardrobe();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedSize, setSelectedSize] = useState<BabySize | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<ClothingPattern | null>(null);
  const [selectedColour, setSelectedColour] = useState<ClothingColour | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canPickPhoto = selectedType !== null && !isAdding;

  const openPicker = (input: HTMLInputElement | null) => {
    setError(null);
    input?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    try {
      await addItem(
        file,
        selectedType,
        selectedSize ?? undefined,
        selectedPattern ?? undefined,
        selectedColour ?? undefined,
      );
      navigate("/wardrobe", { replace: true });
    } catch {
      setError("Failed to save the photo. Please try again.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Add item"
        leading={
          <button
            onClick={() => navigate(-1)}
            className={`text-fg-secondary text-2xl leading-none w-11 h-11 flex items-center justify-center rounded-full active:bg-surface-muted transition-colors ${FOCUS_RING}`}
            aria-label="Back"
          >
            ‹
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-7">
        <section>
          <h2 className={SECTION_HEADING}>
            Category <span className="text-primary-text">*</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CLOTHING_TYPES.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setError(null);
                  }}
                  aria-pressed={active}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 ${TOGGLE} ${
                    active ? TOGGLE_ACTIVE : TOGGLE_INACTIVE
                  }`}
                >
                  <CategoryIcon type={type} className="w-12 h-12" />
                  <span className="font-medium text-sm">{CLOTHING_CONFIG[type].displayName}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className={SECTION_HEADING}>
            Size <span className={OPTIONAL_LABEL}>(optional)</span>
          </h2>
          <SizePicker value={selectedSize} onChange={setSelectedSize} />
        </section>

        <section>
          <h2 className={SECTION_HEADING}>
            Pattern <span className={OPTIONAL_LABEL}>(optional)</span>
          </h2>
          <PatternPicker value={selectedPattern} onChange={setSelectedPattern} />
        </section>

        <section>
          <h2 className={SECTION_HEADING}>
            Colour <span className={OPTIONAL_LABEL}>(optional)</span>
          </h2>
          <ColourPicker value={selectedColour} onChange={setSelectedColour} />
          {selectedColour && (
            <p className="mt-2 text-sm text-fg-muted">
              Selected: <span className="font-medium text-fg">{selectedColour.name}</span>
            </p>
          )}
        </section>

        {error && (
          <p role="alert" className="text-sm text-error-text bg-error-surface px-4 py-3 rounded-xl">
            {error}
          </p>
        )}
      </div>

      <div className="px-4 py-4 border-t border-border space-y-2">
        {!selectedType && (
          <p className="text-center text-xs font-semibold text-fg-muted uppercase tracking-wider">
            Select a category to continue
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openPicker(cameraInputRef.current)}
            disabled={!canPickPhoto}
            className={`${PHOTO_BUTTON} ${
              canPickPhoto ? `border-transparent ${PRIMARY_BUTTON}` : `border-transparent ${DISABLED_BUTTON}`
            }`}
          >
            <span aria-hidden="true">📷</span>
            <span>{isAdding ? "Wait..." : "Camera"}</span>
          </button>
          <button
            onClick={() => openPicker(galleryInputRef.current)}
            disabled={!canPickPhoto}
            className={`${PHOTO_BUTTON} ${
              canPickPhoto
                ? `bg-surface border-primary text-primary-text shadow-sm active:bg-bg active:scale-95 transition-[colors,transform] duration-150 ${FOCUS_RING}`
                : `border-border ${DISABLED_BUTTON}`
            }`}
          >
            <span aria-hidden="true">🖼️</span>
            <span>{isAdding ? "Wait..." : "Gallery"}</span>
          </button>
        </div>
      </div>

      {/* Hidden via opacity rather than display:none, which stops iOS opening the picker. */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="absolute opacity-0 w-px h-px pointer-events-none"
        onChange={handleFileChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="absolute opacity-0 w-px h-px pointer-events-none"
        onChange={handleFileChange}
      />
    </div>
  );
}
