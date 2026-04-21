import { useEffect, useState } from 'react';
import type { ClothingItem } from '@/types';
import { getImageUrl } from '@/storage/images';

interface ClothingCardProps {
  item: ClothingItem;
  onDelete: (id: string) => void;
}

export default function ClothingCard({ item, onDelete }: ClothingCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    getImageUrl(item.imageId).then((url) => {
      objectUrl = url;
      setImageUrl(url);
    });

    return () => {
      // Revoke the object URL when component unmounts to avoid memory leaks
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [item.imageId]);

  return (
    <div className="relative flex-shrink-0 w-[100px]">
      {/* Image */}
      <div className="w-[100px] h-[100px] rounded-2xl overflow-hidden bg-gray-100">
        {imageUrl ? (
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
        {item.size && (
          <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full leading-none">
            {item.size}
          </span>
        )}
        {item.colour && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full leading-none"
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0 border border-gray-200"
              style={{ backgroundColor: item.colour.hex }}
            />
            {item.colour.name}
          </span>
        )}
      </div>
    </div>
  );
}
