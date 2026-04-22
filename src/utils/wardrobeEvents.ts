const WARDROBE_ITEMS_UPDATED_EVENT = "tinythreads:wardrobe-items-updated";

export function notifyWardrobeItemsUpdated() {
  window.dispatchEvent(new Event(WARDROBE_ITEMS_UPDATED_EVENT));
}

export function subscribeToWardrobeItemsUpdated(callback: () => void) {
  window.addEventListener(WARDROBE_ITEMS_UPDATED_EVENT, callback);
  return () => window.removeEventListener(WARDROBE_ITEMS_UPDATED_EVENT, callback);
}
