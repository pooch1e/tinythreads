import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useWardrobe } from '@/hooks/useWardrobe';
import { CLOTHING_TYPES, CLOTHING_CONFIG } from '@/constants/clothing';
import type { ClothingType, BabySize, ClothingColour } from '@/types';
import SizePicker from '@/components/SizePicker';
import ColourPicker from '@/components/ColourPicker';

export default function AddItemPage() {
  const navigate = useNavigate();
  const { addItem, isAdding } = useWardrobe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<ClothingType | null>(null);
  const [selectedSize, setSelectedSize] = useState<BabySize | null>(null);
  const [selectedColour, setSelectedColour] = useState<ClothingColour | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChoosePhoto = () => {
    if (!selectedType) {
      setError('Please select a category first.');
      return;
    }
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedType) return;

    try {
      await addItem(file, selectedType, selectedSize ?? undefined, selectedColour ?? undefined);
      navigate('/wardrobe', { replace: true });
    } catch {
      setError('Failed to save the photo. Please try again.');
    } finally {
      // reset input so the same file can be re-selected if needed
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100"
          aria-label="Back"
        >
          ‹
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Add clothing item</h1>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-7">

        {/* Category */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Category <span className="text-pink-500">*</span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CLOTHING_TYPES.map((type) => {
              const cfg = CLOTHING_CONFIG[type];
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setError(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
                    active
                      ? 'border-pink-400 bg-pink-50 text-pink-700'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{cfg.icon}</span>
                  <span className="font-medium text-sm">{cfg.displayName}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Size */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Size <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </h2>
          <SizePicker value={selectedSize} onChange={setSelectedSize} />
        </section>

        {/* Colour */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Colour <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </h2>
          <ColourPicker value={selectedColour} onChange={setSelectedColour} />
          {selectedColour && (
            <p className="mt-2 text-sm text-gray-500">
              Selected: <span className="font-medium text-gray-700">{selectedColour.name}</span>
            </p>
          )}
        </section>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-4 border-t border-gray-100">
        <button
          onClick={handleChoosePhoto}
          disabled={isAdding}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-95 ${
            isAdding
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-pink-500 text-white shadow-sm active:bg-pink-600'
          }`}
        >
          {isAdding ? 'Adding to wardrobe…' : '📷  Choose photo'}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
