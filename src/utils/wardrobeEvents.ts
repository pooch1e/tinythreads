/**
 * wardrobeEvents — a window-level event used to tell every mounted
 * useWardrobe instance that the stored item list has changed.
 */

const WARDROBE_ITEMS_UPDATED_EVENT = "tinythreads:wardrobe-items-updated";

export function notifyWardrobeItemsUpdated() {
  window.dispatchEvent(new Event(WARDROBE_ITEMS_UPDATED_EVENT));
}

export function subscribeToWardrobeItemsUpdated(callback: () => void) {
  window.addEventListener(WARDROBE_ITEMS_UPDATED_EVENT, callback);
  return () => window.removeEventListener(WARDROBE_ITEMS_UPDATED_EVENT, callback);
}
