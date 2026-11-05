# FURSAT KITCHEN | BAR — AUDIT REPORT (v7)

> **Date:** November 5, 2026 | **Build Status:** ✅ PASS (Exit Code 0 — 14 Routes Built)  
> **Source Brief:** FURSAT_MASTER_BRIEF_v7.md (Part A, Section 1)  
> **Target Folder:** `C:\Users\Seminarhall\.gemini\antigravity\scratch\fursat-astro\fursat`

---

## 1. EXECUTIVE SUMMARY & BUILD VERIFICATION

- **Production Build:** `npm.cmd run build` compiled **14 static routes** in 41.09s with **Exit Code 0**.
- **Dist TODO Audit:** 0 occurrences of "TODO" found in any built public HTML pages in `dist/`.
- **Git State:** The project directory is **not a git repository** (no `.git` directory exists on disk, and `git` is not installed on this Windows environment).

---

## 2. DETAILED AUDIT: PART A SECTION 1

### A. Phase 1 (Motion Kit)

| Item | Status | File Location / Details |
|:---|:---:|:---|
| `src/lib/motion.ts` | **BUILT** | Contains `EASE`, `SPRING`, `prefersReducedMotion()`, dynamic GSAP loader (`initGSAP`), SplitText reveal, leaf wipe, magnetic buttons, cursor-lit cards, counters. |
| `public/js/motion-kit.js` | **BUILT** | Self-contained vanilla IIFE (10.6 KB). Guards with `prefers-reduced-motion` and `pointer: fine`. Loads `/js/gsap.min.js` on-demand only if animated classes exist. Re-initializes on `astro:page-load`. |
| `SiteHeader` scroll shrink/hide | **BUILT** | In `src/components/SiteHeader.astro`. Shrinks after 60px (`.sh-scrolled`), hides on scroll-down (`.sh-hidden`), returns on scroll-up, and reappears on keyboard focus (`:focus-within` / `focusin`). |
| `MarqueeStrip.astro` | **BUILT** | In `src/components/MarqueeStrip.astro`. CSS-driven infinite loop, pauses on hover and focus-within, disabled on `prefers-reduced-motion`. |
| `ScrollStoryHome.astro` | **BUILT** | In `src/components/ScrollStoryHome.astro`. Pinned scroll storytelling table scene with CSS scroll-driven fallback and instant render for reduced motion. |
| `src/styles/motion.css` | **BUILT** | Micro-interactions: `.mot-btn-press`, `.mot-skeleton` (shimmer), `.mot-tab-indicator` (sliding gold underline), `.mot-confetti` (5-color burst). Full reduced-motion overrides. |
| `.mot-*` classes applied to pages | **PARTIAL** | Applied on 9 pages (`index`, `banquet`, `cafe`, `catering`, `events`, `restaurant-bar`, `story`, `reserve`, `terms`, `order`). Missing / partial on `ask.astro`, `menu.astro`, `parties.astro`, `party.astro`. |
| `scripts/overflow-check.mjs` | **BUILT** | Playwright test suite testing 12 pages across 360, 390, 768, 1024, 1280, 1536px. |
| SplitText headlines | **BUILT** | Supported via `.mot-headline` in `motion-kit.js` with plain-text fallback. |
| Magnetic buttons | **BUILT** | Supported via `.mot-magnetic` (fine pointer only, disabled on touch/reduced-motion). |
| Image reveals | **BUILT** | Supported via `.mot-reveal-img` (leaf clip-path wipe, default visible). |
| Confetti | **BUILT** | Supported via `.mot-confetti` and `.mot-confetti--active` in `motion.css`. |

---

### B. Tour (Virtual Tour & Panoramic Explorer)

| Question | Finding |
|:---|:---|
| Is there a `PanoramicViewer` or any tour component? | **YES.** `src/components/PanoramicViewer.astro` is built and active on the Home page. |
| Which library is used? | **Custom Vanilla Script.** Uses CSS touch/mouse drag-pan physics with inertia and pulsing hotspot cards. Does not load PhotoSphereViewer or Pannellum yet. |
| Does `public/tour/` exist? | **NO.** Not created yet. |
| Is there `src/data/tour.json`? | **NO.** Tour zone data is currently defined inside the frontmatter of `PanoramicViewer.astro`. |

---

### C. Menu Page (3D Tier Architecture & WebGL Fallback)

| Question | Finding |
|:---|:---|
| Components in `src/components/menu/` | `CartDrawer.tsx`, `DrinksCounterCanvas.tsx`, `FoodTableCanvas.tsx`, `MenuExplorer.tsx`, `SplitMenuExperience.tsx`, `cart.ts`, `motion.ts`. |
| Which 3D tier does each dish use? | **Tier B (Procedural Domed Plate with Real Photo Texture).** Rendered in Three.js & R3F with circular porcelain charger plates, real food texture mapping (`<meshBasicMaterial map={texture} />`), and interactive gold cloche dome. |
| Are there any `.glb` files in `public/models/`? | **NO.** `public/models/` does not exist; no `.glb` files in the repository. |
| Is a plain HTML menu rendered when WebGL is off? | **YES.** `src/pages/menu.astro` renders all categories and dishes from `public/data/menu.json` directly as static HTML cards at build time. |

---

### D. EventPlanner Component & Data Files

| Question | Finding |
|:---|:---|
| Does `EventPlanner` exist? | **NO (MISSING).** The unified multi-step `EventPlanner` component planned for Phase 3 has not been created yet. |
| On which pages? | Currently, `/banquet` has its own enquiry form (`.bq-form`), `/events` has a contact form, and `/parties` has a legacy party estimator. |
| Data files: `events.json`, `packages.json`, `addons.json`? | **MISSING.** None of these 3 files exist in `src/data/`. Only `ld.json`, `offers.json`, `party.json`, and `site.json` exist. |

---

### E. Routes Analysis: 14 Routes vs 12 Planned

| Route | Status | Notes |
|:---|:---:|:---|
| `/` | **BUILT** | Home page |
| `/restaurant-bar` | **BUILT** | Bar & dining world |
| `/cafe` | **BUILT** | Café & coffee world |
| `/banquet` | **BUILT** | Grand banquet hall & packages |
| `/events` | **BUILT** | Celebrations & events |
| `/catering` | **BUILT** | Outdoor catering world |
| `/menu` | **BUILT** | Full menu with 3D split canvas & static HTML fallback |
| `/ask` | **BUILT** | Ask Fursat mood & craving recommendations |
| `/reserve` | **BUILT** | Table booking interface |
| `/story` | **BUILT** | Brand story & heritage |
| `/order` | **STUB** | Simple "Coming Soon" page |
| `/terms` | **BUILT** | Terms, offer conditions & privacy notes |
| `/parties` | **EXTRA (Legacy)** | Older party package calculator (`parties.js`, `party.json`). |
| `/party` | **EXTRA (Legacy)** | Older 3D party stage experience (`StageCanvas.tsx`). |

*Explanation:* The 2 extra routes (`/parties` and `/party`) are legacy interactive party packages from earlier prototype builds. They should be retired once the unified Phase 3 `EventPlanner` is completed.

---

### F. Build & Overflow Check Results

- **Build:** `npm.cmd run build` passed in 41.09s (Exit Code 0).
- **Horizontal Overflow Check (`scripts/overflow-check.mjs`):** **PASS** across all 12 primary routes at 360px, 390px, 768px, 1024px, 1280px, and 1536px.

---

### G. Dist "TODO" Search Results

- Searched `dist/**/*.html` for `TODO`.
- **Result:** **0 hits** in public production HTML.
- *(Note: Placeholder strings like `TODO(client)` remain confined to `src/data/site.json` and are not leaked into rendered HTML).*

---

### H. Phone Number Storage & Consent Checkbox

- **Storage Location:** Browser `localStorage` under key `fursat_offer_claimed` (in `src/components/MascotOfferModal.astro`).
- **Backend Sync:** None. No backend API or lead capture endpoint exists; the number remains purely client-side to persist the unlocked coupon state.
- **Terms Consent:** The modal currently contains a disclaimer ("🔒 No spam. We only send your reservation coupon via SMS/WhatsApp.") but does not yet feature an explicit checkbox linking to `/terms`.

---

### I. Public Video Assets

| File | Size | Where Used |
|:---|:---:|:---|
| `public/assets/hero-master-v2.mp4` | 8.93 MB | Desktop hero video loop (`src/components/Hero.astro`) |
| `public/assets/hero-master-v2-sm.mp4` | 3.88 MB | Mobile hero video loop (`data-src-sm` in `src/components/Hero.astro`) |
| `public/assets/reel-dynamite-prawns-v1.mp4` | 0.59 MB | Video carousel (`src/components/Reels.astro`) |
| `public/assets/reel-fursat-happened-v1.mp4` | 0.56 MB | Video carousel (`src/components/Reels.astro`) |
| `public/assets/reel-inside-fursat-v1.mp4` | 0.64 MB | Video carousel (`src/components/Reels.astro`) |
| `public/assets/reel-veg-combo-v1.mp4` | 0.78 MB | Video carousel (`src/components/Reels.astro`) |
| `public/assets/e4ced586f4.mp4` | 5.98 MB | Unreferenced legacy video |
| `public/assets/f56e73c9e7.mp4` | 0.25 MB | Unreferenced legacy video |
