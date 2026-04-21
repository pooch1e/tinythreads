# Agent Working Guidelines

*Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.*

## 1. Think Before Coding

*Don't assume. Don't hide confusion. Surface tradeoffs.*

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

*Minimum code that solves the problem. Nothing speculative.*

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

*Touch only what you must. Clean up only your own mess.*

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

*Define success criteria. Loop until verified.*

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

*These guidelines are working if:* fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# TinyThreads — Agent Instructions

## What this project is

TinyThreads is a **mobile-first progressive web app (PWA)** — a baby clothing wardrobe manager. Parents can photograph clothing items, organise them by category, compose outfits, and save/view them. It is **web-only** (no React Native, no Expo). It is styled for mobile screens (max-width 430px) but runs in any browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build tool | Vite 6 |
| Framework | React 19 + TypeScript (strict) |
| Routing | React Router v7 (`BrowserRouter`) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Gestures | `@use-gesture/react` |
| Animation | `framer-motion` |
| Image storage | IndexedDB via `idb` |
| Metadata storage | `localStorage` |
| Image processing | Browser Canvas API |
| PWA | `vite-plugin-pwa` (Workbox, `generateSW` mode) |

---

## Project Structure

```
src/
  types.ts                  — ClothingItem, SavedLook, ClothingType, BabySize, ClothingColour, MAX_LOOKS
  constants/
    clothing.ts             — CLOTHING_TYPES array, CLOTHING_CONFIG map (icon, displayName, pluralName, order)
    colours.ts              — COLOUR_PALETTE (14 ClothingColour objects)
    sizes.ts                — BABY_SIZES array
  storage/
    metadata.ts             — localStorage CRUD for ClothingItem[] and SavedLook[]
    images.ts               — IndexedDB CRUD for image Blobs (keyed by UUID string)
  utils/
    imageProcessing.ts      — Canvas API: resize to max 1024px wide, encode JPEG quality 0.7
  hooks/
    useWardrobe.ts          — items state, addItem(file, type, size?, colour?), deleteItem(id), refresh()
    useLooks.ts             — looks state, addLook(name, itemIds), deleteLook(id), refresh(), atLimit
  components/               — shared reusable UI components
  pages/
    WardrobePage.tsx        — /wardrobe — browse items by category
    BuildOutfitPage.tsx     — /build — swipe to compose outfit
    OutfitsPage.tsx         — /outfits — view saved outfits
  App.tsx                   — shell layout + bottom nav (3 tabs)
  main.tsx                  — React root + router
  index.css                 — Tailwind import + mobile shell styles
public/
  icons/                    — PWA icons (icon-192.png, icon-512.png needed)
index.html                  — entry point, viewport meta, PWA meta tags
vite.config.ts              — Vite config (React plugin, Tailwind plugin, PWA plugin, path alias @/)
```

---

## Architecture Rules

- **Screens never contain business logic** — pages delegate entirely to hooks
- **Hooks own state** — hooks call storage layer directly; no global store / context
- **Storage layer is pure functions** — no React in `storage/` or `utils/`
- **No React Native** — use standard HTML elements (`div`, `button`, `img`, `input`) and CSS
- **No class components** — functional components and hooks only
- **Path alias** — use `@/` to import from `src/` (e.g. `import { CLOTHING_TYPES } from '@/constants/clothing'`)

---

## Data Model

```ts
// src/types.ts

type ClothingType = 'hat' | 'top' | 'trousers' | 'socks';

type BabySize = '0-3m' | '3-6m' | '6-9m' | '9-12m' | '12-18m' | '18-24m' | '2-3y' | '3-4y';

interface ClothingColour { name: string; hex: string; }

interface ClothingItem {
  id: string;           // UUID — also the IndexedDB image key (imageId)
  type: ClothingType;
  imageId: string;      // Key into IndexedDB images store
  size?: BabySize;
  colour?: ClothingColour;
  createdAt: number;    // Unix ms
}

interface SavedLook {
  id: string;
  name: string;
  itemIds: Partial<Record<ClothingType, string>>;  // type → ClothingItem.id
  createdAt: number;
}

const MAX_LOOKS = 10;
```

---

## Storage

### localStorage keys
| Key | Value |
|---|---|
| `@tinythreads/items` | `JSON.stringify(ClothingItem[])` |
| `@tinythreads/looks` | `JSON.stringify(SavedLook[])` |

### IndexedDB
- Database: `tinythreads`, version 1
- Object store: `images`
- Key: `ClothingItem.imageId` (UUID string)
- Value: JPEG `Blob`

Image URLs for rendering are created with `URL.createObjectURL(blob)` — these are ephemeral and must be revoked when no longer needed.

---

## Image Pipeline (US-1)

1. User selects file via `<input type="file" accept="image/*" capture="environment">`
2. `processImage(file)` in `utils/imageProcessing.ts` → resizes to max 1024px wide, encodes as JPEG 0.7 → returns `Blob`
3. `saveImage(id, blob)` in `storage/images.ts` → persists to IndexedDB
4. `addItemToStorage(item)` in `storage/metadata.ts` → persists metadata to localStorage

---

## Navigation

3 tabs via React Router nested routes under `App.tsx`:

| Path | Page | Tab label |
|---|---|---|
| `/wardrobe` | `WardrobePage` | Wardrobe 👗 |
| `/build` | `BuildOutfitPage` | Build ✨ |
| `/outfits` | `OutfitsPage` | Outfits 📸 |

Root `/` redirects to `/wardrobe`.

---

## Styling Conventions

- Tailwind utility classes for all component styling
- Mobile shell is fixed: `max-width: 430px`, centred, `height: 100dvh`, with a fixed bottom nav
- `app-content` div is the scrollable area (`flex: 1; overflow-y: auto`)
- Colour palette: pink accent `#ec4899` (active tab, primary buttons), greys for inactive states
- Touch targets minimum 44×44px (WCAG mobile guideline)

---

## Commands

```bash
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

---

## MVP Scope (do not exceed without instruction)

The MVP covers **US-1 through US-5** only. Do not implement:
- Background removal (no ONNX, no ML)
- Multi-photo per item
- Edit item after saving
- Notes/label fields
- Export/import
- Dark mode

See `EPIC.md` for the full epic, user stories, acceptance criteria, and task checklist.
