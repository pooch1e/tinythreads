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
    icon: "/assets/icons/items/colour/beanieIcon.png",
    order: 0,
  },
  outer: {
    displayName: "Outer",
    pluralName: "Outer",
    icon: "/assets/icons/items/colour/outersGreen.png",
    order: 1,
  },
  top: {
    displayName: "Top",
    pluralName: "Tops",
    icon: "/assets/icons/items/colour/top.png",
    order: 2,
  },
  bottoms: {
    displayName: "Bottoms",
    pluralName: "Bottoms",
    icon: "/assets/icons/items/colour/bottomsYellow.png",
    order: 3,
  },
  shoes: {
    displayName: "Shoes",
    pluralName: "Shoes",
    icon: "/assets/icons/items/colour/socksBlue.png",
    order: 4,
  },
};
