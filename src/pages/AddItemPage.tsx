import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useWardrobe } from "@/hooks/useWardrobe";
import { CLOTHING_TYPES, CLOTHING_CONFIG } from "@/constants/clothing";
import type {
  ClothingType,
  BabySize,
  ClothingColour,
  ClothingPattern,
} from "@/types";
import SizePicker from "@/components/SizePicker";
import ColourPicker from "@/components/ColourPicker";
import { PatternPicker } from "@/components/PatternPicker";

export default function AddItemPage() {
  const navigate = useNavigate();
  const { addItem, isAdding } = useWardrobe();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedSize, setSelectedSize] = useState<BabySize | null>(null);
  const [selectedPattern, setSelectedPattern] =
    useState<ClothingPattern | null>(null);
  const [selectedColour, setSelectedColour] = useState<ClothingColour | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleCameraClick = () => {
    setError(null);
    cameraInputRef.current?.click();
  };

  const handleGalleryClick = () => {
    setError(null);
    galleryInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-lavender-2 dark:border-border">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 dark:text-[#b6ccfe] text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full active:bg-[#edf2fb] dark:active:bg-[#1a2332] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50"
          aria-label="Back"
        >
          ‹
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-[#edf2fb]">
          Add clothing item
        </h1>
      </div>
      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-7">
        {/* Category */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-[#b6ccfe] uppercase tracking-wide mb-3">
            Category <span className="text-[#abc4ff]">*</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CLOTHING_TYPES.map((type) => {
              const cfg = CLOTHING_CONFIG[type];
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setError(null);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-[colors,transform] duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 ${
                    active
                      ? "border-[#abc4ff] bg-[#edf2fb] text-[#3b5bdb] dark:bg-[#1a2442] dark:text-[#abc4ff] dark:border-[#abc4ff]"
                      : "border-periwinkle dark:border-border bg-white dark:bg-[#1a2332] text-gray-700 dark:text-[#b6ccfe]"
                  }`}
                >
                  {cfg.icon.startsWith("/") || cfg.icon.startsWith("http") ? (
                    <img
                      src={cfg.icon}
                      alt={cfg.displayName}
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <span className="text-3xl">{cfg.icon}</span>
                  )}
                  <span className="font-medium text-sm">{cfg.displayName}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Size */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-[#b6ccfe] uppercase tracking-wide mb-3">
            Size{" "}
            <span className="text-gray-400 dark:text-text-muted font-normal normal-case">
              (optional)
            </span>
          </h2>
          <SizePicker value={selectedSize} onChange={setSelectedSize} />
        </section>

        {/* Pattern */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-[#b6ccfe] uppercase tracking-wide mb-3">
            Pattern{" "}
            <span className="text-gray-400 dark:text-text-muted font-normal normal-case">
              (optional)
            </span>
          </h2>
          <PatternPicker
            value={selectedPattern}
            onChange={setSelectedPattern}
          />
        </section>

        {/* Colour */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-[#b6ccfe] uppercase tracking-wide mb-3">
            Colour{" "}
            <span className="text-gray-400 dark:text-text-muted font-normal normal-case">
              (optional)
            </span>
          </h2>
          <ColourPicker value={selectedColour} onChange={setSelectedColour} />
          {selectedColour && (
            <p className="mt-2 text-sm text-gray-500 dark:text-text-muted">
              Selected:{" "}
              <span className="font-medium text-gray-700 dark:text-lavender-2">
                {selectedColour.name}
              </span>
            </p>
          )}
        </section>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}
      </div>
      {/* Footer CTA */}
      <div className="px-4 py-4 border-t border-lavender-2 dark:border-border space-y-2">
        {!selectedType && (
          <p className="text-center text-xs font-semibold text-gray-400 dark:text-[#7a90c0] uppercase tracking-wider">
            Select a category to continue
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCameraClick}
            disabled={isAdding || !selectedType}
            className={`py-4 rounded-2xl font-semibold text-base transition-[colors,opacity,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 flex items-center justify-center gap-2 ${
              !selectedType || isAdding
                ? "bg-[#edf2fb] dark:bg-[#1a2332] text-gray-300 dark:text-[#3a4a6a] cursor-not-allowed opacity-50"
                : "bg-[#abc4ff] text-white shadow-sm active:bg-[#92aaee]"
            }`}
          >
            <span>📷</span>
            <span>{isAdding ? "Wait..." : "Camera"}</span>
          </button>
          <button
            onClick={handleGalleryClick}
            disabled={isAdding || !selectedType}
            className={`py-4 rounded-2xl font-semibold text-base transition-[colors,opacity,transform] duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50 flex items-center justify-center gap-2 ${
              !selectedType || isAdding
                ? "bg-[#edf2fb] dark:bg-[#1a2332] text-gray-300 dark:text-[#3a4a6a] cursor-not-allowed opacity-50 border-2 border-[#d7e3fc] dark:border-[#1a2332]"
                : "bg-white border-2 border-[#abc4ff] text-[#abc4ff] shadow-sm active:bg-[#f8faff]"
            }`}
          >
            <span>🖼️</span>
            <span>{isAdding ? "Wait..." : "Gallery"}</span>
          </button>
        </div>
      </div>
      {/* Hidden file inputs - must NOT use display:none on iOS */}
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
