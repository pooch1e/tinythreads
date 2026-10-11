/**
 * types — shared domain types for clothing items, their attributes, and saved
 * outfits ("looks").
 */

export type ClothingType = "hat" | "outer" | "top" | "bottoms" | "shoes";

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

export type PatternName = "stripes" | "spots";

export interface ClothingPattern {
  name: PatternName;
}

export interface ClothingItem {
  id: string;
  type: ClothingType;
  imageId: string;
  size?: BabySize;
  colour?: ClothingColour;
  pattern?: ClothingPattern;
  createdAt: number;
  processing?: boolean;
}

export interface SavedLook {
  id: string;
  name: string;
  itemIds: Partial<Record<ClothingType, string>>;
  createdAt: number;
}
