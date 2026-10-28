# Fursat Kitchen & Bar: coming-soon site (Astro)

```bash
# needs Node 20+ (see .nvmrc). npm install reads package.json and installs everything
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
npm run preview
```

## Structure
- `src/pages/index.astro`: the page, assembled from components in order
- `src/components/`: Hero, intro (Heli / Logo / Gate / Caption), Ask-Fursat wizard, booking + legal dialogs, picks tray, menu overlay, legal bar
- `src/layouts/Base.astro`: meta/SEO tags, structured data (`src/data/ld.json`), stylesheet imports
- `src/styles/`: the seven stylesheets, in cascade order (`07.css` is the main one)
- `public/js/`: page scripts (classic scripts, loaded in order; `07`-`13` hold the hero video, cards, Ask Fursat, intro and skip logic)
- `public/assets/`: images, fonts, videos, audio (content-hashed names)
- `public/_headers`: cache + security headers (Cloudflare Pages / Netlify)
- `public/robots.txt`, sitemap via `@astrojs/sitemap`, `public/og-image.jpg` (1200x630 share image)

## Notes
- Site URL is `https://fursatind.in`; change it in `astro.config.mjs` if the domain differs.
- The intro is skipped for search-engine bots and repeat visits (see `public/js`), and one "Skip intro" button covers the whole sequence.
- Next steps when ready: move the page scripts into `src/scripts/` as modules, turn the dish cards into a data-driven `Card.astro` fed from the menu JSON (or Sanity), and add image optimisation with `astro:assets`.

## Packages
`package.json` lists every package (Astro, sitemap, React, Tailwind, TypeScript). `npm install` creates `node_modules/` and `package-lock.json`. Commit the lock file; never commit `node_modules/` or `dist/` (they are in `.gitignore`).
React and Tailwind are installed but not wired in yet; that is Phase 3 of the plan.

## GitHub Codespaces
`.devcontainer/devcontainer.json` does everything on first open: Node 22, `npm install`, then `npm run dev` with the site opening in the preview pane (port 4321). Nothing to install by hand.
