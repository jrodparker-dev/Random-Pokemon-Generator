# Random Pokémon Generator (Vite + React)

This project has been migrated to a Vite + React app and is set up to publish a built version to `docs/` for GitHub Pages.

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```

## Build

```bash
npm run build
```

Build artifacts are generated in `dist/`.

## Publish via GitHub Pages from `/docs`

Copy the latest build output into `docs/`:

```bash
rm -rf docs
cp -r dist docs
```

Then commit and push to GitHub. In repo settings, configure GitHub Pages to serve from the `docs/` folder on your default branch.

## Data structure (for customization)

The data layer is isolated in:

- `src/data/pokemonData.ts`

Key points:

- Static dex JSON files are loaded from `public/dex/*.json`.
- Sprite images are loaded from:
  - `public/sprites/normal/*.webp`
  - `public/sprites/shiny/*.webp`
- Region and type option lists are centralized in `src/data/pokemonData.ts`.

To add/edit data later, you usually modify:

- Existing dex files in `public/dex/`
- Or add a new dex file and include it in `REGIONS` in `src/data/pokemonData.ts`
