/**
 * ItemTags — size, pattern and colour pills for a clothing item. Renders a
 * fragment so the parent controls layout.
 */
import type { ClothingItem } from "@/types";

interface ItemTagsProps {
  item: ClothingItem;
}

const TAG =
  "inline-flex items-center gap-1 text-[10px] font-medium bg-surface-muted text-primary-text px-1.5 py-0.5 rounded-full leading-none";

export default function ItemTags({ item }: ItemTagsProps) {
  return (
    <>
      {item.size && <span className={TAG}>{item.size}</span>}
      {item.pattern && <span className={`${TAG} capitalize`}>{item.pattern.name}</span>}
      {item.colour && (
        <span className={TAG}>
          <span
            className="w-2 h-2 rounded-full shrink-0 border border-border-strong"
            style={{ backgroundColor: item.colour.hex }}
          />
          {item.colour.name}
        </span>
      )}
    </>
  );
}
