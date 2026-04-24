import type { ClothingItem } from '@/types';
import { useSingleImage } from '@/hooks/useSingleImage';
import ItemTags from '@/components/ItemTags';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
}

export default function ClothingCard({ item, onDelete }: ClothingCardProps) {
  const imageUrl = useSingleImage(item.imageId, item.processing ? 'processing' : 'ready');

  return (
    <div className="relative shrink-0 w-25">
      {/* Image */}
      <div className="w-25 h-25 rounded-2xl overflow-hidden bg-[#edf2fb] dark:bg-[#1a2332]">
        {item.processing ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-[#edf2fb] dark:bg-[#1a2332] text-[#abc4ff] animate-pulse">
            <div className="relative text-3xl leading-none">
              <span aria-hidden="true">🧸</span>
              <span className="absolute -top-1 -right-3 text-sm">✨</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-[#abc4ff]">Snipping...</span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={item.type}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#b6ccfe] dark:text-[#263352] text-3xl">
            ☁
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(item.id)}
        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gray-700 dark:bg-[#263352] text-white text-xs flex items-center justify-center shadow leading-none active:bg-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#abc4ff]/50"
        aria-label="Delete item"
      >
        ×
      </button>

      {/* Tags */}
      <div className="mt-1.5 flex flex-wrap gap-1">
        <ItemTags item={item} />
      </div>
    </div>
  );
}
