import type { ClothingType } from '../types';

export const CLOTHING_TYPES: ClothingType[] = ['hat', 'top', 'trousers', 'socks'];

export const CLOTHING_CONFIG: Record<
  ClothingType,
  { displayName: string; pluralName: string; icon: string; order: number }
> = {
  hat:      { displayName: 'Hat',      pluralName: 'Hats',     icon: '🎩', order: 0 },
  top:      { displayName: 'Top',      pluralName: 'Tops',     icon: '👕', order: 1 },
  trousers: { displayName: 'Trousers', pluralName: 'Trousers', icon: '👖', order: 2 },
  socks:    { displayName: 'Socks',    pluralName: 'Socks',    icon: '🧦', order: 3 },
};
