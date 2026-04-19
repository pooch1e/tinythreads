# TinyThreads — Agent Guide

A baby clothing wardrobe app built with Expo + React Native. Users catalogue clothing items (with optional AI background removal), then drag-swipe slots to compose and save outfits.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Expo ~54 (managed workflow, New Architecture enabled) |
| Language | TypeScript strict mode |
| UI | React Native 0.81, expo-image, Pressable (never TouchableOpacity) |
| Navigation | expo-router (file-based, `app/(tabs)/`) |
| Gestures / Animation | react-native-gesture-handler, react-native-reanimated |
| Persistence | AsyncStorage (metadata) + expo-file-system (image files) |
| ML | onnxruntime-react-native — ONNX model for background removal |
| IDs | uuid |

---

## Project Structure

```
app/(tabs)/       # Screens — wardrobe, add, builder, looks
src/
  components/     # Reusable UI (PascalCase filenames)
  constants/      # Static data — CLOTHING_TYPES, COLOUR_PALETTE, BABY_SIZES
  hooks/          # Stateful logic — useWardrobe, useLooks, useModelStatus
  services/       # backgroundRemoval.ts (ONNX pipeline)
  storage/        # index.ts (CRUD), images.ts (file ops), model.ts (model download)
  types.ts        # All shared types and constants (e.g. MAX_LOOKS = 5)
```

Screens never contain business logic — they delegate entirely to hooks.

---

## Important Notes

### Background Removal
- `src/services/backgroundRemoval.ts` is a **stub** in Expo Go — returns `isBackgroundRemovalSupported() = false` and throws on invocation.
- Full ONNX pipeline requires a **custom native build** (EAS or bare workflow).
- `useWardrobe.addItem` gracefully falls back to saving the original image when the model is unavailable. The `backgroundRemoved` flag on `ClothingItem` tracks which path was used.
- The model (`u2net_cloth_seg.onnx`) is downloaded from Hugging Face on first run via `src/storage/model.ts`. Model init is kicked off in `app/_layout.tsx` on app mount.

### State Management
- No global store. State lives in custom hooks using `useState` + `useCallback`.
- `useModelStatus` uses a **module-level singleton** (`globalStatus` + `globalListeners`) so multiple hook instances share one ONNX state without re-initialising.

### Data Storage
- Metadata: AsyncStorage keys `@tinythreads/items` and `@tinythreads/looks`.
- Images: `<documentDirectory>/tinythreads/images/<uuid>.jpg|png`.
- All images are preprocessed to 1024px wide, JPEG 0.7 before saving.

### No Tests
There is no test setup. No Jest, no RNTL, no test scripts.

### No EAS / CI
No `eas.json`, no `.env`, no CI config. Local dev only at this stage.

---

## Conventions

- **Naming:** PascalCase components, `use`-prefix hooks, `SCREAMING_SNAKE_CASE` constants.
- **Styles:** `StyleSheet.create({})` co-located at the bottom of every file. No theme provider, no styled-components.
- **Images:** Always use `expo-image` `<Image>` with `contentFit="contain"`.
- **Taps:** Use `Pressable` exclusively.
- **Types:** Define all shared types in `src/types.ts`. Inline component `Props` interfaces at the top of each file.
- **Exports:** `default export` for components/screens; named exports for hooks and storage functions.
- **No nested routes:** All screens are flat under `app/(tabs)/`.

---

## Running Locally

```bash
npm run start     # Expo dev server (Expo Go — limited: no background removal)
npm run ios       # iOS simulator
npm run android   # Android emulator
```

Full ML features require a custom dev build with native modules compiled.

> **Note:** `legacy-peer-deps=true` is set in `.npmrc` to resolve onnxruntime-react-native peer conflicts — do not remove it.
