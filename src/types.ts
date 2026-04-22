export type ClothingType = "hat" | "top" | "trousers" | "socks";

export type BabySize =
  | "0-3m"
  | "3-6m"
  | "6-9m"
  | "9-12m"
  | "12-18m"
  | "18-24m"
  | "2-3y"
  | "3-4y";

export interface ClothingColour {
  name: string;
  hex: string;
}

export interface ClothingItem {
  id: string;
  type: ClothingType;
  imageId: string; // IndexedDB key for the image blob
  size?: BabySize;
  colour?: ClothingColour;
  createdAt: number; // Unix timestamp ms
  processing?: boolean;
}

export interface SavedLook {
  id: string;
  name: string;
  itemIds: Partial<Record<ClothingType, string>>; // type → ClothingItem.id
  createdAt: number;
}
