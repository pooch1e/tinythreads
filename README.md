# TinyThreads

A minimal, privacy-first baby wardrobe and outfit builder app. Snap photos of clothing, organize your wardrobe, and build outfits with ease.

## Features

- Add clothing items with photos, size, and color
- Automatic background removal and PNG conversion for item images
- Organize and filter your wardrobe
- Build and save outfits
- All data stored locally (no cloud)

## Tech Stack

- React 19
- TypeScript
- Vite
- IndexedDB (via idb)
- Tailwind CSS

## Image Flow

1. User selects or takes a photo when adding an item
2. Background is removed and image is converted to PNG
3. Image is resized and stored in IndexedDB
4. Images are loaded as object URLs for display

## Local Development

```bash
npm install
npm run dev
```

## Folder Structure

- `src/` — App source code
  - `components/` — UI components
  - `hooks/` — React hooks for data and image logic
  - `storage/` — IndexedDB and metadata helpers
  - `utils/` — Image processing and utility functions

## License

MIT
