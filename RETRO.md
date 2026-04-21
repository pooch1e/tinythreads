# TinyThreads — Technical Retro

Agent context document. Describes what was built, how it works, and decisions made at each step. Intended for future agent sessions continuing this project.

---

## Project History

Originally a React Native / Expo managed app (iOS target). Abandoned native approach due to Apple Developer Program cost. Re-architected from scratch as a mobile-first PWA. All Expo/React Native code was deleted and the project was re-scaffolded in the same git repo (history preserved).

---

## Architecture Decisions

### Why Vite + React (not Next.js or Remix)
Single-page app with no server requirements. Static output to `dist/` deploys directly to Vercel/Netlify with zero config. Next.js would add unnecessary complexity and a build-time node server layer for no benefit.

### Why React Router v7 (not file-based routing)
Small app with a fixed 3-tab structure. Explicit `<Routes>` in `main.tsx` is more transparent than a file-based convention. Routes are defined in one place.

### Why no global state store (no Redux/Zustand/Context)
Each page owns its own hook instance. There are only 2 data entities (items + looks). Both hooks read from `localStorage` on mount and stay in sync via direct mutation + reload. No cross-page reactive state is needed — the tabs are independent views that load fresh data from storage. This approach was carried over from the original Expo architecture and remains valid.

### Why `localStorage` for metadata and IndexedDB for images
`localStorage` has a ~5-10 MB limit but metadata (item/look JSON) is tiny — a full wardrobe of 200 items is ~50 KB. Images are stored separately in IndexedDB which has no practical limit on modern devices (quota-based, typically GBs on Android, ~50 MB on iOS Safari). This keeps the storage layers cleanly separated by data type and size profile.

### iOS Safari storage caveat
IndexedDB on iOS Safari is subject to 7-day eviction if the site hasn't been visited (Intelligent Tracking Prevention). This is the main data-loss risk for the app. PWA install ("Add to Home Screen") does not fully mitigate this. A future export/import feature (stretch goal) is the recommended mitigation.

---

## Tech Stack (final)

| Layer | Library | Version |
|---|---|---|
| Build | Vite | 6.4.x |
| Framework | React + TypeScript | 19.x / 5.8.x |
| Routing | React Router | 7.x |
| Styling | Tailwind CSS v4 | 4.1.x |
| Gestures | `@use-gesture/react` | 10.x |
| Animation | `framer-motion` | 12.x |
| Image storage | `idb` (IndexedDB wrapper) | 8.x |
| Metadata storage | `localStorage` (native) | — |
| Image processing | Canvas API (native) | — |
| PWA | `vite-plugin-pwa` (Workbox) | 0.21.x |

---

## File Structure

```
src/
  types.ts                        — all shared TypeScript types + MAX_LOOKS constant
  constants/
    clothing.ts                   — CLOTHING_TYPES[], CLOTHING_CONFIG map
    colours.ts                    — COLOUR_PALETTE (14 colours)
    sizes.ts                      — BABY_SIZES (8 sizes)
  storage/
    metadata.ts                   — localStorage CRUD (items + looks)
    images.ts                     — IndexedDB CRUD via idb (image blobs)
  utils/
    imageProcessing.ts            — Canvas resize + JPEG compress
  hooks/
    useWardrobe.ts                — items state + addItem / deleteItem / refresh
    useLooks.ts                   — looks state + addLook / deleteLook / refresh / atLimit
    useItemImages.ts              — loads IndexedDB object URLs for a ClothingItem[]
  components/
    EmptyState.tsx                — reusable empty state (icon, title, desc, optional CTA)
    ClothingCard.tsx              — 100×100 image card with tags + delete button
    FilterBar.tsx                 — scrollable size pills + colour swatches
    OutfitSlotRow.tsx             — swipeable row for outfit builder
    LookCard.tsx                  — saved outfit card with 2×2 image grid
  pages/
    WardrobePage.tsx              — /wardrobe
    AddItemPage.tsx               — /wardrobe/add
    BuildOutfitPage.tsx           — /build
    OutfitsPage.tsx               — /outfits
  App.tsx                         — shell + bottom nav (3 tabs)
  main.tsx                        — React root + BrowserRouter + Routes
  index.css                       — Tailwind import + mobile shell CSS + utilities
public/
  icons/                          — PWA icons (192×192, 512×512 — to be generated)
index.html                        — entry point with PWA meta tags
vite.config.ts                    — Vite + React + Tailwind + PWA plugin config
```

---

## Data Model

```ts
type ClothingType = 'hat' | 'top' | 'trousers' | 'socks';

type BabySize = '0-3m' | '3-6m' | '6-9m' | '9-12m' | '12-18m' | '18-24m' | '2-3y' | '3-4y';

interface ClothingColour { name: string; hex: string; }

interface ClothingItem {
  id: string;        // UUID — also the IndexedDB key (imageId === id)
  type: ClothingType;
  imageId: string;   // Key into IndexedDB 'images' object store
  size?: BabySize;
  colour?: ClothingColour;
  createdAt: number; // Unix ms
}

interface SavedLook {
  id: string;
  name: string;
  itemIds: Partial<Record<ClothingType, string>>; // type → ClothingItem.id
  createdAt: number;
}

const MAX_LOOKS = 10;
```

### localStorage keys
- `@tinythreads/items` → `JSON.stringify(ClothingItem[])`
- `@tinythreads/looks` → `JSON.stringify(SavedLook[])`

### IndexedDB
- DB name: `tinythreads`, version 1
- Object store: `images`
- Key: UUID string (= `ClothingItem.imageId`)
- Value: JPEG `Blob`

---

## Feature Implementation Notes

---

### Scaffold (pre-US work)

- Expo project deleted in full (including `.expo/`, `.npmrc`, `node_modules`)
- `.gitignore` replaced with Vite-appropriate entries
- `package.json` written manually (Vite scaffolder rejected non-empty directory)
- `tsconfig.json` → references `tsconfig.app.json` (src/) and `tsconfig.node.json` (vite config)
- `tsconfig.app.json` → strict mode, `jsx: react-jsx`, path alias `@/ → src/`
- `vite.config.ts` → `@vitejs/plugin-react@4` (v6 requires Vite 8+, locked to v4 for Vite 6 compat), `@tailwindcss/vite`, `vite-plugin-pwa`
- Tailwind v4: no config file required — `@import "tailwindcss"` in `index.css` is sufficient
- PWA: `vite-plugin-pwa` in `generateSW` mode, manifest embedded in config, Workbox precaches all build assets
- `index.html`: `viewport` meta with `maximum-scale=1, user-scalable=no` (prevents iOS auto-zoom on input focus), PWA apple meta tags
- Mobile shell: `max-width: 430px`, centred, `height: 100dvh` (dynamic viewport height accounts for mobile browser chrome), `env(safe-area-inset-bottom)` padding on bottom nav for iPhone notch

---

### US-1 — Upload & Categorise (`AddItemPage`)

**Route:** `/wardrobe/add` (sub-route of wardrobe, back-navigates to `/wardrobe`)

**Key implementation details:**
- Hidden `<input type="file" accept="image/*" capture="environment">` triggered programmatically via `useRef` — avoids building a custom file picker UI while getting native camera/gallery access on mobile
- `capture="environment"` opens rear camera by default on Android; on iOS Safari it presents a "Take Photo / Photo Library" action sheet regardless
- Input value is reset after each selection (`e.target.value = ''`) so the same file can be re-selected without a second tap
- Category must be selected before the file input is triggered — validated in `handleChoosePhoto`, shows inline error if not set (avoids confusing the native file picker opening with no context)
- Size and colour are optional; tap-to-toggle (tapping an active selection deselects it)
- Colour palette rendered as circular swatches with `border-gray-200` so white/light colours are visible against white background
- `isAdding` state from `useWardrobe` disables the button and shows "Saving…" during the async pipeline
- On success: `navigate('/wardrobe', { replace: true })` — `replace` prevents back-navigating to the add form after saving

**Image pipeline (`useWardrobe.addItem` → `utils/imageProcessing.ts` → `storage/images.ts`):**
1. `processImage(file)` — creates an object URL from the `File`, loads into an `<img>`, draws to canvas at ≤1024px wide (preserving aspect ratio), encodes as JPEG at quality 0.7, returns `Blob`
2. `saveImage(id, blob)` — opens/reuses IndexedDB connection (lazy singleton `dbPromise`), stores blob at key = UUID
3. `addItemToStorage(item)` — read-modify-write to `localStorage`: loads existing array, prepends new item, serialises back
4. React state updated via `setItems(loadItems())` — re-reads from storage to ensure consistency

---

### US-2 — View & Manage Wardrobe (`WardrobePage`)

**Route:** `/wardrobe`

**Key implementation details:**
- Sections derived with `useMemo`: only clothing types with ≥1 item total are rendered (filtered or not); avoids showing empty Hat/Socks sections when user only has tops
- Section header shows `items.length of totalCount` when a filter reduces the visible count (e.g. "2 of 5")
- Three distinct empty states:
  1. Zero items in wardrobe → full `EmptyState` component with "Add first item" CTA
  2. Items exist but none match filters → centred inline message with "Clear filters" button
  3. Items exist, type has items, but none match filters → per-section italic note
- Delete flow: tap `×` on card → sets `pendingDelete` state → bottom sheet confirmation dialog renders over content (fixed overlay + backdrop). Confirm calls `deleteItem()` which removes from IndexedDB then localStorage. Cancel clears `pendingDelete`.
- Bottom sheet uses `onClick` on backdrop to dismiss (same UX as iOS action sheets)

**`ClothingCard` image loading:**
- `useEffect` on `item.imageId` calls `getImageUrl(imageId)` → `URL.createObjectURL(blob)`
- Cleanup function revokes the object URL on unmount — critical to avoid memory leaks when scrolling a long list
- Shows a cloud emoji placeholder (`☁`) while loading or if image is missing from IndexedDB

**`FilterBar`:**
- Two horizontally scrollable rows (size pills, colour swatches)
- `.no-scrollbar` CSS utility hides scrollbars on all browsers while keeping scroll functionality
- "Clear filters ×" link only renders when at least one filter is active

---

### US-3 — Create an Outfit (`BuildOutfitPage` + `OutfitSlotRow`)

**Route:** `/build`

**Key implementation details:**
- All item images for the page are loaded once via `useItemImages(items)` and passed as a single `imageMap` prop to each `OutfitSlotRow` — avoids N×4 separate IndexedDB calls (one per slot)
- `useItemImages` batches all `getImageUrl` calls with `Promise.all`, stores created object URLs in a ref for cleanup, keys the effect on `items.map(i => i.imageId).join(',')` to avoid unnecessary re-runs

**`OutfitSlotRow` swipe gesture:**
- `useDrag` from `@use-gesture/react` with `axis: 'x'` (constrains to horizontal) and `filterTaps: true` (prevents accidental swipe on tap)
- Threshold: `|movement[x]| >= 40px` on drag end to trigger index change — low enough for quick swipes, high enough to avoid accidental triggers when scrolling the page vertically
- Direction: `dx > 0` (swipe right) = previous item, `dx < 0` (swipe left) = next item (matches natural "flick to next" mental model)
- Index wraps: `(index + 1) % items.length` and `(index - 1 + items.length) % items.length`
- `touch-pan-y` CSS on the drag container tells the browser not to intercept vertical scroll while the gesture handler manages horizontal

**Animation (`framer-motion`):**
- `AnimatePresence mode="wait"` ensures the exit animation completes before the enter animation starts — prevents two cards being visible simultaneously
- `custom={dragDirection}` passes swipe direction (1 or -1) as a variant parameter
- Variants: `enter` slides in from `x: dir * 80`, `exit` slides out to `x: dir * -80` — creates a directional carousel feel
- Duration 180ms with `easeOut` — snappy on mobile without feeling abrupt
- Gesture is only bound (`{...bind()}`) when `items.length > 1`; single-item slots have no gesture to avoid confusion

**Empty slot (no items of that type):**
- Dashed border placeholder with the type icon — communicates "this category exists but has no items" without blocking outfit saving for populated categories

---

### US-4 — Save & Name an Outfit (within `BuildOutfitPage`)

**Key implementation details:**
- `SaveModal` is an `AnimatePresence`-wrapped bottom sheet using a spring animation (`type: 'spring', damping: 30, stiffness: 300`) — matches iOS sheet physics
- `useEffect` with a 150ms delay auto-focuses the name input after the open animation completes — avoids keyboard appearing before the sheet is visible
- Enter key submits the form (`onKeyDown` handler)
- Name is trimmed and validated non-empty client-side before calling `addLook`
- `addLook` is synchronous (localStorage write) — no async needed, no loading state required beyond the brief `isSaving` flag
- After save: `navigate('/outfits')` takes user directly to see their new outfit
- "Save outfit" button disabled when: (a) no items selected across any slot, or (b) `atLimit` (10 looks reached)
- Limit warning banner (`amber-50`) appears above the button when at limit — communicates why it's disabled

---

### US-5 — View Saved Outfits (`OutfitsPage` + `LookCard`)

**Route:** `/outfits`

**Key implementation details:**
- `LookCard` resolves `ClothingItem` objects by building `Map<id, item>` from `allItems` on each render — O(n) but n is small, no memoisation needed
- `GridSlot` is a private sub-component within `LookCard` — one per `ClothingType`, uses a local `useImageUrl` hook (private to the file) that loads one image and revokes its object URL on unmount
- All 4 grid slots always render (including types not in the look) — missing slots show the type icon at 25% opacity as a placeholder. This makes the grid always a consistent 2×2 shape.
- Date formatted with `toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })` — produces "21 Apr 2026" format
- Outfit count shown as `{n} / 10` in the header — gives users awareness of the limit
- Delete flow mirrors WardrobePage: tap trash icon → bottom sheet confirmation. Confirmation copy clarifies that only the outfit record is deleted, not the clothing items themselves (important UX distinction).
- `EmptyState` CTA navigates to `/build` to prompt the user directly into the outfit builder

---

## Known Issues / Tech Debt

| Item | Notes |
|---|---|
| PWA icons missing | `public/icons/icon-192.png` and `icon-512.png` are referenced in `vite.config.ts` manifest but not yet generated. PWA install will work but icons will be blank. Needs placeholder PNG assets. |
| iOS Safari 7-day eviction | IndexedDB data can be cleared if the app isn't visited for 7 days. No export/import mitigation yet (stretch goal). |
| `capture="environment"` on iOS | On iOS Safari, `capture="environment"` shows a "Take Photo / Photo Library / Browse" action sheet rather than opening the camera directly. Behaviour is OS-controlled and cannot be overridden. |
| `app/` LSP ghost errors | The editor LSP retains stale diagnostics for the deleted Expo `app/` directory path. These do not exist on disk and do not affect the build. Will self-resolve when the LSP is fully restarted. |
| Bundle size | 410 kB JS (131 kB gzip). `framer-motion` is the largest contributor (~130 kB raw). Acceptable for a PWA but could be reduced with `framer-motion/mini` if needed. |
| `useItemImages` effect dependency | Uses `.join(',')` on imageIds as the effect key to avoid an eslint exhaustive-deps warning. This is intentional and correct but suppressed with a comment. |

---

## Stretch Goals (not started)

- Edit clothing item (type, size, colour) after saving
- Notes/label field on items
- Export wardrobe as JSON + images zip for backup
- Import from backup
- Share an outfit as a flat image (Canvas compositing)
- Dark mode
- PWA icon assets (blocking for full PWA install UX)
