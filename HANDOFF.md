# 🏛️ FURSAT KITCHEN | BAR — MASTER ARCHITECTURAL HANDOFF DOCUMENT (v4)

> **Paste this entire document into any new AI session to continue with 100% precision.**  
> **Status:** ✅ Build Passing (Exit Code 0 — 14 Routes Built)  
> **Updated:** November 5, 2026 | Local Time: 08:52 IST  
> **Project Directory:** `C:\Users\Seminarhall\.gemini\antigravity\scratch\fursat-astro\fursat`  
> **Live Preview:** `http://localhost:4321` (Network: `http://192.168.0.6:4321`)

---

## 1. ⚡ QUICK START / RESUME COMMANDS

Run this in Windows PowerShell at the beginning of any new session:

```powershell
# 1. Restore machine & user PATH (required for node and npm in Windows PowerShell)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 2. Navigate to project root
cd "C:\Users\Seminarhall\.gemini\antigravity\scratch\fursat-astro\fursat"

# 3. Build & Preview Commands
npm.cmd run build                          # Full production compilation (dist/)
npm.cmd run preview -- --port 4321 --host  # Local preview server
npm.cmd run dev -- --port 3000 --host      # Hot-reloading development server
```

> ⚠️ **Rule 1:** Always run `npm.cmd` rather than `npm` (Windows PowerShell execution policy blocks `.ps1`).  
> ⚠️ **Rule 2:** All node packages (`astro`, `react`, `gsap`, `tailwindcss`, `three`, `@react-three/fiber`, `sharp`, `wrangler`) are installed in `node_modules/`.  
> ⚠️ **Rule 3:** The asset compression pipeline is fully resumable: `npm.cmd run compress`. If a session is interrupted, it automatically skips completed files using `scripts/compress-progress.json`.

---

## 2. 🎯 WHAT WAS ACCOMPLISHED (THIS SESSION'S UPDATES)

1. **Comprehensive Asset & Performance Audit (`FURSAT_ASSET_AUDIT.md`)**
   - Conducted deep scan of all image packs, raw video reels, reference screenshots, and public assets.
   - Identified uncompressed raw camera images in `public/assets/` (up to 21 MB each) that would have severely degraded page load speed.
   - Identified that `raw_assets/` is correctly gitignored (preserving 10 raw video reels of 25–152 MB each and uncompressed raw camera packs).

2. **Automated Resumable Sharp Compression Pipeline (`scripts/compress-assets.mjs`)**
   - Engineered a 5-phase Node.js Sharp compression pipeline with state persistence (`scripts/compress-progress.json`):
     - **Phase 1 (Interior Spaces):** Converted all 19 interior photos to WebP (1920px max width, quality 82). Achieved **84% to 95% reduction** (dropped from ~4 MB each to ~350–600 KB).
     - **Phase 2 (Dish Photography):** Converted all 28 real menu dish photos to WebP (1200px max width, quality 80). Achieved **96% to 100% reduction** (e.g., `jamicon_jerk_chicken_with_fires.jpg` dropped from **21.19 MB → 160.5 KB**, `dsc08852.jpg` from **17.53 MB → 110.9 KB**).
     - **Phase 3 (Ask Fursat Real Photo Mapping):** Mapped 25 real restaurant dish photos into `public/assets/ask/dishes/`, replacing generic AI illustrations with actual restaurant dishes while retaining AI illustrations only for unmatched edge items.
     - **Phase 4 (`menu.json` Path Synchronization):** Updated 18 dish image paths in `public/data/menu.json` from `.jpg` to `.webp` (backed up to `menu.json.bak`).
     - **Phase 5 (Source Code Asset Migration):** Automatically scanned and upgraded all 15 component and page files in `src/` to reference the compressed `.webp` assets.

3. **3D / GLB Asset Architecture Clarified (`FoodTableCanvas.tsx` & `DrinksCounterCanvas.tsx`)**
   - Clarified that instead of heavyweight static `.glb` files (which cause mobile WebGL memory crashes and lack dynamic lighting), the menu page uses an interactive procedural 3D system built in Three.js & React Three Fiber:
     - Circular porcelain plates and gold-trimmed ceramic chargers rendered procedurally.
     - Real dish photos mapped directly as texture maps (`<meshBasicMaterial map={texture} />`).
     - Interactive 3D Gold Cloche that lifts on click/hover to reveal the Signature Nalli Gosht Biryani.
     - All 3D texture references have been updated to the new lightweight `.webp` files.

4. **Wrangler Direct Deployment Infrastructure Added**
   - Installed `wrangler` (Cloudflare CLI v4.157.0) into `devDependencies`.
   - Added npm deployment scripts to `package.json`:
     - `npm.cmd run deploy:login` → Authenticate with Cloudflare in browser.
     - `npm.cmd run deploy` → Uploads `dist/` directly to Cloudflare Pages (bypassing the need for local Git).

5. **Full Production Build Verification**
   - Ran `npm.cmd run build` — **Verified Exit Code 0, 14 routes built in 27.87s**.

---

## 3. 🎨 REFERENCE DESIGN & ASSET MAPPING MATRIX

| Reference Asset | Expectation | Production Code Implementation |
|:---|:---|:---|
| **Cinder & Dew Aesthetic** (WhatsApp reference screenshots) | Warm luxury cafe aesthetic, organic paper cards, dark emerald green & gold | Built Tailwind v4 theme: Paper Cream (`#F2EEE4`), Deep Forest Green (`#1F2A14`), Darkest Olive (`#12190B`), Royal Gold (`#E0A63C`), Terracotta (`#B5532A`). Signature leaf-cut curved corners (`border-radius: 64px 8px 64px 8px`). |
| **Table Animation Reel** (`table_animation_ref.mp4`) | Dynamic dishes sliding and rotating into place on a dining spread on scroll | Built `TableSpread.astro`: GSAP ScrollTrigger hardware-accelerated physics where dish platters glide from left & right with subtle rotational inertia and drop shadow settle onto marble. Responsive CSS fallback for mobile. |
| **Mascot Offer Flow** (`mascot_offer_design.jpg`) | 3D elephant in emerald royal sherwani offering 15% discount across 3 steps | Built `MascotOfferModal.astro` & `Mascot.astro`: Floating interactive elephant badge → Step 1: Phone number capture (+91 validation + terms) → Step 2: Instant celebratory reward ticket revealing `FURSAT15` with 1-click clipboard copy. |
| **Interior Panoramas** (19 High-Res Google Drive photos) | Virtual tour feel across dining spaces | Built `PanoramicViewer.astro`: 4 switchable zones (Restaurant & Bar, Café Lounge, Grand Banquet, Events) with smooth mouse/touch drag-pan physics and pulsing gold pins displaying ambiance details. Now powered by compressed `.webp` files. |
| **Ask Fursat Dish Recommendations** (`/ask`) | AI mood & craving dish recommendations | 38 recommendation cards in `ask.astro`. Top dishes now showcase **real restaurant photography** (converted to WebP ~35–160 KB) rather than generic AI illustrations. |
| **3D Split Menu Concept** | 50/50 split food/drinks counter expanding to 3/4 screen | Built in `src/components/menu/FoodTableCanvas.tsx` and `DrinksCounterCanvas.tsx` using Three.js / React Three Fiber procedural geometry with real food textures and interactive gold cloche dome. |

---

## 4. 📊 ASSET COMPRESSION SUMMARY

### Top Dish Photos (Before vs After)
- `jamicon_jerk_chicken_with_fires.jpg`: **21.19 MB → 160.5 KB (↓99%)**
- `dsc08852.jpg`: **17.53 MB → 110.9 KB (↓99%)**
- `_n.jpg`: **15.50 MB → 118.7 KB (↓99%)**
- `dsc08919.jpg`: **14.80 MB → 123.9 KB (↓99%)**
- `pandu_mirchi_kodi_kebab.jpg`: **12.99 MB → 129.3 KB (↓99%)**
- `dsc08946.jpg`: **11.26 MB → 36.3 KB (↓100%)**
- `karvepaku_kodi_vepudu.jpg`: **9.26 MB → 166.5 KB (↓98%)**
- `dsc03308.jpg`: **9.26 MB → 166.5 KB (↓98%)**
- `angaraa_chicken_tikka_.jpg`: **8.93 MB → 181.4 KB (↓98%)**
- `lotus_biscoff_.jpg`: **8.91 MB → 34.2 KB (↓100%)**

### Interior Photos (19 Spaces)
- Average size dropped from **~4.2 MB → ~550 KB (↓86%)**
- Highest compression: `fursat_space_13.jpg` (**1.93 MB → 103.3 KB, ↓95%**)

---

## 5. 📂 FOLDER SEPARATION: RAW VS DEPLOYABLE

### `raw_assets/` (NEVER deploy — completely gitignored)
- `raw_assets/reels/`: 10 camera video reels (25 MB to 152 MB each)
- `raw_assets/images_pack_1/`: Original uncompressed food photos
- `raw_assets/images_pack_2/`: Original uncompressed food photos
- `raw_assets/interior_images/`: Original uncompressed interior JPGs
- `raw_assets/reference_design/`: Original client WhatsApp reference images

### `public/` (Clean, compressed, deployable)
- `public/assets/interior/*.webp`: 19 lightweight high-res interior spaces
- `public/assets/dishes/*.webp`: 28 compressed restaurant food dishes
- `public/assets/ask/dishes/*.webp`: 38 AI recommendation dish images (featuring real food photography)
- `public/assets/mascot/*.webp`: Multi-resolution WebP elephant mascot
- `public/assets/*.mp4`: Compressed web video loops (under 9 MB)
- `public/data/menu.json`: Full menu data with `.webp` image bindings
- `public/_headers`: Cloudflare Pages security & caching headers

---

## 6. 🛡️ CRITICAL ARCHITECTURAL RULES

1. **Component CSS Isolation:**
   - Always use component-scoped class prefixes: `mn-` (Menu), `as-` (Ask), `rs-` (Reserve), `sh-` (Header), `ts-` (TableSpread), `pv-` (PanoramicViewer), `hm-` (Home), `ct-` (Catering), `bq-` (Banquet), `rb-` (RestaurantBar), `ev-` (Events), `st-` (Story), `od-` (Order).
   - Never use bare `.card`, `.pk`, or `.hd` classes.
2. **Motion Accessibility:**
   - All interactive elements must declare default visible states.
   - Always wrap GSAP ScrollTrigger and Three.js continuous rotations in `prefers-reduced-motion` guards.
3. **Cloudflare 25 MiB File Limit:**
   - Every file deployed to Cloudflare Pages must remain below 25 MiB (largest current video is `hero-master-v2.mp4` at 8.93 MB ✅).

---

## 7. 🚀 REMAINING ITEMS BEFORE OFFICIAL LAUNCH

### Priority A: Finalize Client Details (`src/data/site.json`)
Before pointing the live domain, replace placeholder strings in `src/data/site.json`:
- `email`: `TODO(client)@fursatind.in`
- `address.line1`: `TODO(client): Unit number, Capital Park`
- `address.embed`: `TODO(client): Google Maps embed URL`
- `legal.name`: `TODO(client): Legal entity name`
- `legal.gstin`: `TODO(client): GSTIN`
- `legal.fssai`: `TODO(client): FSSAI licence number` *(suggested: `13624013000521`)*
- `social.youtube`: `TODO(client)`

### Priority B: Deployment Execution (Choose One)
- **Option 1: Direct Cloudflare Pages Deploy via Wrangler (No Git Needed)**
  ```powershell
  cd "C:\Users\Seminarhall\.gemini\antigravity\scratch\fursat-astro\fursat"
  npm.cmd run deploy:login
  npm.cmd run deploy
  ```
- **Option 2: GitHub Codespace / Git Push**
  - Push the repository to `https://github.com/alekyareality/fursat-astro.git`
  - Connect Cloudflare Pages to the repo:
    - Framework preset: `Astro`
    - Build command: `npm run build`
    - Output directory: `dist`
    - Environment variable: `NODE_VERSION = 20`
