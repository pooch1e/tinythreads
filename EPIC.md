# TinyThreads — Epic

## Overview

**TinyThreads** is a mobile-first progressive web app (PWA) that lets parents photograph, categorise, and outfit-plan their baby's wardrobe. Accessible from any phone browser with no app install required.

---

## Goals

- No Apple Developer account / App Store required
- Works from mobile Safari and Chrome via a URL
- Installable to home screen as a PWA
- Data stored locally on device (IndexedDB + localStorage)
- Static hosting (Vercel / Netlify)

---

## User Stories

---

### US-1 — Upload & Categorise a Clothing Item
> *As a parent, I can upload a photo of a clothing item, assign it a category, size, and colour, so that it appears in my digital wardrobe.*

**Acceptance criteria:**
- I can tap an "Add item" button from the Wardrobe tab
- I am shown a form to choose a category (Hat / Top / Trousers / Socks) before picking a photo
- I can optionally set a size (0-3m … 3-4y) and colour
- Tapping "Choose photo" opens the native device camera or photo library
- The photo is resized/compressed in-browser (max 1024px wide, JPEG 0.7) and saved to IndexedDB
- I am returned to the wardrobe after saving, where the new item is visible

**Out of scope for MVP:** background removal, multi-photo, editing after save

**Tasks:**
- [x] T-04 — Define shared TypeScript types
- [x] T-05 — Define clothing constants (types, sizes, colours)
- [x] T-07 — IndexedDB image storage (`storage/images.ts`)
- [x] T-06 — localStorage metadata storage (`storage/metadata.ts`)
- [x] T-08 — Canvas image processing (`utils/imageProcessing.ts`)
- [x] T-11 — `useWardrobe` hook
- [ ] T-09 — Build `AddItemPage` — category selector, size picker, colour picker
- [ ] T-10 — Wire file input → process → save → navigate

---

### US-2 — View & Manage Wardrobe
> *As a parent, I can browse all my uploaded clothing items, grouped by category, so I can see what's in the wardrobe.*

**Acceptance criteria:**
- Items displayed in sections: Hats, Tops, Trousers, Socks
- Each item shows its photo as a thumbnail card
- Size and colour tags visible on each card
- Filter by size or colour
- Delete item with confirmation
- Empty state when wardrobe is empty

**Tasks:**
- [ ] T-12 — Build `WardrobePage` — sections per type, `ClothingCard` component
- [ ] T-13 — Build `FilterBar` component
- [ ] T-14 — Delete item flow (confirmation → delete → remove from IndexedDB)
- [ ] T-15 — `EmptyState` component

---

### US-3 — Create an Outfit
> *As a parent, I can select one clothing item from each category to compose an outfit.*

**Acceptance criteria:**
- Navigate to "Build Outfit" tab
- One swipeable row per category (Hat / Top / Trousers / Socks)
- Swipe left/right to cycle through items of that type
- Selected items previewed on screen
- A category can be left empty
- Cannot save with zero items selected

**Tasks:**
- [ ] T-08a — Configure `@use-gesture/react` + `framer-motion`
- [ ] T-16 — Build `BuildOutfitPage` — swipe rows per category
- [ ] T-17 — `OutfitSlotRow` component with swipe gesture

---

### US-4 — Save & Name an Outfit
> *As a parent, I can name and save a composed outfit so I can find and reuse it later.*

**Acceptance criteria:**
- "Save outfit" triggers a name input prompt
- Name is required
- Saved with name, item IDs, creation timestamp
- Navigates to Outfits tab after save
- Save disabled (with message) when at the 10-look limit

**Tasks:**
- [ ] T-18 — Save outfit flow — name dialog, validation, `addLook()`, navigate
- [ ] T-19 — `useLooks` hook *(already built)*

---

### US-5 — View Saved Outfits
> *As a parent, I can see all my saved outfits in one place.*

**Acceptance criteria:**
- All saved outfits listed, most recent first
- Each outfit card: name, creation date, grid of item photos
- Deleted item slots show a placeholder
- Delete outfit with confirmation
- Empty state when no outfits saved

**Tasks:**
- [ ] T-20 — Build `OutfitsPage`
- [ ] T-21 — Build `LookCard` component
- [ ] T-22 — Delete outfit flow

---

### US-6 — Install as Home Screen App (PWA)
> *As a parent, I can add TinyThreads to my phone's home screen so it opens like a native app.*

**Acceptance criteria:**
- `manifest.json` with name, icons, `display: standalone`
- Service Worker caches app shell for offline load
- Opens full-screen with no browser chrome from home screen

**Tasks:**
- [x] T-23 — `vite-plugin-pwa` configured in `vite.config.ts`
- [ ] T-24 — Generate app icons (192×192 and 512×512)
- [ ] T-25 — Test PWA install prompt on iOS Safari and Android Chrome

---

## Stretch Goals (post-MVP)

- Edit clothing item (type, size, colour) after saving
- Notes / label field on items
- Multiple photos per item
- Export / import wardrobe as JSON backup
- Share an outfit as an image
- Dark mode

---

## Limits

| Constraint | Value |
|---|---|
| Max saved outfits | 10 |
| Image max width | 1024px |
| Image quality | JPEG 0.7 |
| Clothing categories | Hat, Top, Trousers, Socks |
| Baby sizes | 0-3m, 3-6m, 6-9m, 9-12m, 12-18m, 18-24m, 2-3y, 3-4y |
| Colours | 14 (White → Black) |
