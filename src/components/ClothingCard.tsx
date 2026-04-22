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
    <div className="relative flex-shrink-0 w-[100px]">
      {/* Image */}
      <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden bg-gray-100">
        {item.processing ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-pink-50 via-white to-amber-50 text-pink-400 animate-pulse">
            <div className="relative text-3xl leading-none">
              <span aria-hidden="true">🧸</span>
              <span className="absolute -top-1 -right-3 text-sm">✨</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-pink-500">Snipping...</span>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={item.type}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">
            ☁
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(item.id)}
        className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center shadow leading-none active:bg-red-500 transition-colors"
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
