/**
 * styles — shared Tailwind class strings for buttons, toggle pills and focus
 * rings, so interactive elements look and behave the same everywhere.
 */

export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50";

const PRESSABLE = `active:scale-95 transition-[colors,transform] duration-150 ${FOCUS_RING}`;

export const PRIMARY_BUTTON = `bg-primary text-on-primary shadow-sm active:bg-primary-hover ${PRESSABLE}`;

export const SECONDARY_BUTTON = `bg-surface-muted text-fg-secondary active:bg-border ${PRESSABLE}`;

export const DANGER_BUTTON = `bg-error text-white active:bg-error-hover ${PRESSABLE}`;

export const DISABLED_BUTTON = "bg-surface-muted text-fg-disabled cursor-not-allowed";

export const SHEET_BUTTON = "w-full py-3.5 rounded-2xl font-semibold text-sm";

export const TOGGLE = PRESSABLE;

export const TOGGLE_ACTIVE = "border-primary bg-primary-surface text-primary-text";

export const TOGGLE_INACTIVE = "border-border-strong bg-surface text-fg-secondary";
