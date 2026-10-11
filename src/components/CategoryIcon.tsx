/**
 * CategoryIcon — the illustrated icon for a clothing category. Decorative:
 * callers always render the category name alongside it.
 */
import { CLOTHING_CONFIG } from "@/constants/clothing";
import type { ClothingType } from "@/types";

interface CategoryIconProps {
  type: ClothingType;
  className?: string;
}

export default function CategoryIcon({ type, className = "" }: CategoryIconProps) {
  return (
    <img
      src={CLOTHING_CONFIG[type].icon}
      alt=""
      draggable={false}
      className={`object-contain ${className}`}
    />
  );
}
