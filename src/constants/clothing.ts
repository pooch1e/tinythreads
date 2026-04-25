import type { ClothingType } from "../types";

export const CLOTHING_TYPES: ClothingType[] = [
  "hat",
  "outer",
  "top",
  "bottoms",
  "shoes",
];

export const CLOTHING_CONFIG: Record<
  ClothingType,
  { displayName: string; pluralName: string; icon: string; order: number }
> = {
  hat: {
    displayName: "Hat",
    pluralName: "Hats",
    icon: "/assets/icons/items/beanie.png",
    order: 0,
  },
  outer: {
    displayName: "Outer",
    pluralName: "Outer",
    icon: "",
    order: 1,
  },
  top: { displayName: "Top", pluralName: "Tops", icon: '/assets/icons/items/top.png', order: 2 },
  bottoms: {
    displayName: "Bottoms",
    pluralName: "Bottoms",
    icon: "👖",
    order: 3,
  },
  shoes: { displayName: "Shoes", pluralName: "Shoes", icon: "🧦", order: 4 },
};
