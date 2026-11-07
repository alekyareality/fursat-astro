# Integration & Merge Plan: `integration/new-build` from `origin/dev`

**Base Branch**: `origin/dev` (commit `98ae3a8`, 4 commits ahead of `origin/main`: `6c2cc15`, `9deda45`, `6a7dcd7`, `98ae3a8`)  
**Target Integration Branch**: `integration/new-build`  
**Local Port Source**: `master` (commits ahead of baseline `ab2a820`)  
**Author**: Antigravity Pair Programmer  
**Date**: November 2026  
**Status**: Planning Mode — Comprehensive Pre-Merge Audit  

---

## 1. Files Only on `origin/dev` (inside `fursat/`)

The following 8 files exist on `origin/dev:fursat/` but are not currently tracked in the local working tree:

1. `link-photos.py` — Python utility script used on dev for mapping dish photos; **Local does not need it** (local handles compression and mappings via Node.js Sharp in `scripts/compress-assets.mjs`).
2. `public/assets/f56e73c9e7.mp4` — Intro helicopter animation video referenced in `src/components/IntroHeli.astro`; **Local needs it** on disk/origin for the intro video player.
3. `public/assets/hero-master-v2-sm.mp4` — Compressed responsive mobile hero background video; **Local needs it** for responsive hero video playback on phones.
4. `public/assets/hero-master-v2.mp4` — High-definition desktop hero background video; **Local needs it** for desktop hero video playback.
5. `public/assets/reels/reel-dynamite-prawns-v1.mp4` — Instagram reel video for Dynamite Prawns; **Local needs it** for the Reels video card.
6. `public/assets/reels/reel-fursat-happened-v1.mp4` — Instagram reel video for "Fursat Happened"; **Local needs it** for the Reels video card.
7. `public/assets/reels/reel-inside-fursat-v1.mp4` — Instagram reel video for "Inside Fursat"; **Local needs it** for the Reels video card.
8. `public/assets/reels/reel-veg-combo-v1.mp4` — Instagram reel video for "Veg Combo"; **Local needs it** for the Reels video card.

---

## 2. Files That Differ in Both Branches & Conflict Risk

There are 50 files that exist in both `origin/dev:fursat/` and local `HEAD` with differing hashes:

### Key Highlighted Files
- `public/js/16.js` — **HIGH RISK**: `origin/dev` (commit `6c2cc15`) completely rewrote this file to implement the kinetic Reels drift stage (wave float, depth swell, data-tone color cross-fade, and thumbnail jump); local retained an earlier version.  
  *Resolution*: Adopt `origin/dev`'s `16.js` entirely, as local has no conflicting reel modifications.
- `src/styles/10.css` — **LOW-MEDIUM RISK**: `origin/dev` (`6c2cc15`) appended `.rl-bgs`, `.rl-wv` drift stage styles to the end of the file; local did not touch this block.  
  *Resolution*: Clean 3-way merge or preserve origin's appended drift CSS.
- `src/components/Hero.astro` — **HIGH RISK**: In line 13, `origin/dev` (`9deda45`) set `preload="metadata"`, whereas local (`dd70b89`) set `preload="none"` to prevent mobile video parsing from degrading LCP.  
  *Resolution*: **DO NOT RESOLVE SILENTLY**. Stop and present both options to owner: `preload="none"` (favors Lighthouse/mobile data) vs `preload="metadata"` (favors instant video start on desktop).
- `astro.config.mjs` — **HIGH RISK**: `origin/dev` (`9deda45`) wired Tailwind CSS v4 via `@tailwindcss/vite` plugin; local added custom Vite build optimizations (Terser chunking and rollup guards).  
  *Resolution*: Merge `plugins: [tailwindcss()]` from origin while retaining local's build rollup configuration.

### Other Differing Files
- `.gitignore` — **LOW RISK**: Local added ignore rules for `raw_assets/`, `review/`, and `public/**/*.mp4`; origin has minimal rules. Merge required (with video exceptions; see Section 6).
- `package.json` — **MEDIUM RISK**: Origin dropped `framer-motion` and npm `gsap`; local added `lighthouse`, `playwright`, `wrangler`, and compression scripts. Merge required (see Section 4).
- `package-lock.json` — **LOW RISK**: Sync lockfile via `npm.cmd i --package-lock-only`.
- `public/data/menu.json` — **LOW RISK**: Local updated asset paths to `.webp` during image compression.
- `public/js/06.js` — **MEDIUM RISK**: Local removed bot detection (`59f1c5f`) and refined mobile space cards.
- `public/js/08.js` — **LOW RISK**: Local deferred GSAP loading.
- `public/js/10.js` — **MEDIUM RISK**: Local removed bot detection (`59f1c5f`) and deferred mobile video parsing.
- `public/js/ask.js` — **MEDIUM RISK**: Origin updated dish rows and photos (`43b0ea7`, `6a7dcd7`); local wired booking confetti.
- `src/components/IntroHeli.astro` — **LOW RISK**: Local added responsive poster images.
- `src/components/Mascot.astro` — **LOW RISK**: Local tuned heading levels and tap target dimensions.
- `src/components/Reels.astro` — **MEDIUM-HIGH RISK**: Origin added `data-tone` attributes for color cross-fading; local updated poster images to WebP. Merge required: keep both `data-tone` and WebP posters.
- `src/components/VoiceButton.astro` — **LOW RISK**: Local improved accessibility attributes.
- `src/data/ld.json` — **LOW RISK**: Local added Schema.org ratings, price range, and opening hours (see Section 3).
- `src/layouts/Base.astro` — **LOW RISK**: Local added motion kit and meta tags.
- `src/pages/ask.astro` — **LOW RISK**: Local removed duplicate header.
- `src/pages/index.astro` — **HIGH RISK**: Local integrated Panoramic Tour, Day/Evening Slider, and TableSpread motion hooks. Careful integration needed around the Tour and Reels sections.
- `src/pages/menu.astro` — **HIGH RISK**: Local rebuilt with Food/Drinks 3/4 split switcher, Bar Counter scene, and dish showcase. Origin has not touched `menu.astro`.
- `src/pages/parties.astro` — **LOW RISK**: Local wired booking confirmation and form validation.
- `src/pages/party.astro` — **LOW RISK**: Local wired booking confirmation and form validation.
- `src/styles/07.css` — **LOW RISK**: Minor spacing adjustments.
- `src/styles/menu-tw.css` — **LOW RISK**: Local menu utility styling.
- `public/assets/ask/dishes/*.webp` (25 dish photos: `aritaku-chapa-vepudu.webp`, `boti-fry-with-pav.webp`, `buffalo-chicken-wings.webp`, `butterscotch-cake-1.webp`, `chicken-momo.webp`, `coriander-chicken.webp`, `crispy-chicken-with-mayo.webp`, `dynamite-prawns.webp`, `fish-biryani.webp`, `fried-fish-with-mayo.webp`, `gongura-muchatlu.webp`, `haleem-with-broch-bread.webp`, `jack-fruit-biryani-veg.webp`, `jamaican-jerk-with-fries.webp`, `koramenu-chapa-chips.webp`, `lamb-shank-with-mash-potatoes.webp`, `loose-prawns.webp`, `mudda-pappu-avakaya-annam.webp`, `mutton-bone-soup.webp`, `mutton-paya-with-pav.webp`, `nalli-bokkala-vepudu.webp`, `nalli-ghost-biryani.webp`, `peri-peri-chicken-wings.webp`, `prawns-salt-pepper.webp`, `spaghetti-aglio-olio.webp`) — **LOW-MEDIUM RISK**: Binary images. Origin added these via `6a7dcd7`; local optimized them via Sharp in Phase 3. Retain local's optimized Sharp assets.

---

## 3. `src/data/*.json` Field-by-Field Comparison

All JSON files in `src/data/` were audited against `origin/dev:fursat/src/data/`:

| File | Status | Detailed Field Differences |
| :--- | :--- | :--- |
| `party.json` | **IDENTICAL** | Exact hash match (`0866ca59dce8`). Zero differences. |
| `ld.json` | **DIFFERS** | • `description`: Origin has placeholder `"New website coming soon."`; local removes this stale text.<br>• `image`: Origin has `"og-image.jpg"`; local upgrades to `"assets/fursat_space_01.webp"`.<br>• `priceRange`: Origin has `undefined`; local adds `"₹₹"`.<br>• `openingHoursSpecification`: Origin has `undefined`; local adds Mon–Fri 12:00–23:30, Sat–Sun 11:00–23:30.<br>• `aggregateRating`: Origin has `undefined`; local adds rating `4.6` (180 reviews). |
| `food.json` | **LOCAL ONLY** | Origin lacks this file. Local contains 212 authentic food dishes across 21 categories extracted from the official PDF menu (`bd997ad`). |
| `drinks.json` | **LOCAL ONLY** | Origin lacks this file. Local contains 98 real drinks items extracted from the official PDF menu (`bd997ad`). |
| `offers.json` | **LOCAL ONLY** | Origin lacks this file. Local contains Mascot 15% offer configuration with honest WhatsApp disclaimer (`525d6d6`). |
| `site.json` | **LOCAL ONLY** | Origin lacks this file. Local contains unified venue metadata and contact numbers. |

> [!NOTE]
> **Recommendation for Owner**: Accept all local additions in `ld.json` (they provide required Schema.org restaurant rich snippets) and keep local `food.json`, `drinks.json`, and `offers.json` (they power the entire menu and modal systems).

---

## 4. `package.json` Differences & Gzip Impact Analysis

### 1. Tailwind CSS (`@tailwindcss/vite` + `tailwindcss` ^4.0.0)
- **Status**: Present in both `package.json` files. Origin wires it in `astro.config.mjs` via `@tailwindcss/vite` plugin (`9deda45`); local currently lacks the Vite plugin call.
- **Gzip Impact**: Tailwind v4 is compile-time only (0 KB client JS). Compiling utility classes replaces handwritten CSS with an estimated output of ~4–8 KB gzip CSS.
- **Decision**: **KEEP TAILWIND V4**. Wire the Vite plugin on `integration/new-build`.

### 2. GSAP (`gsap` ^3.15.1)
- **Status**: Installed in local `package.json`; removed from `package.json` dependencies on `origin/dev` (`9deda45`) and replaced by a static standalone vendor script `public/js/gsap.min.js` loaded lazily only on `/ask`.
- **Gzip Impact**: Bundling GSAP via npm adds ~28 KB gzip (~70 KB uncompressed) to JavaScript chunk closures. Loading it as an isolated static asset on `/ask` completely removes it from the other 13 routes.
- **Decision**: **DROP FROM `package.json`**. Adopt origin's approach: keep `public/js/gsap.min.js` as an isolated static asset for `/ask`.

### 3. framer-motion (`framer-motion` ^14.7.1)
- **Status**: Present in local `package.json`; explicitly removed on `origin/dev` (`9deda45`).
- **Gzip Impact**: `framer-motion` adds ~34 KB gzip to client bundles. In local, all interactive animations (kinetic marquee, panoramic tour rotunda, day/evening slider, magnetic table platters, and marble ripple canvas) are implemented with vanilla JS rAF and CSS transforms via `motion-kit.js`.
- **Decision**: **DROP FROM `package.json`**. Saves ~34 KB gzip with zero functional degradation.

---

## 5. Features on Origin Only vs. Local Only

```
┌──────────────────────────────────────────────────────────┐
│                      ORIGIN/DEV ONLY                     │
│  • Reels slow drift stage, wave float & depth swell      │
│  • Reels background data-tone color cross-fade           │
│  • Tailwind CSS v4 Vite plugin integration               │
│  • Cleaned-up dependencies (no framer-motion/npm gsap)   │
│  • Deleted unused video e4ced586f4.mp4                   │
└──────────────────────────────────────────────────────────┘
                            │
                     [ MERGED INTO ]
              integration/new-build branch
                            │
┌──────────────────────────────────────────────────────────┐
│                        LOCAL ONLY                        │
│  • Full Menu split proportion switcher (Food/Drinks)     │
│  • Real PDF Menu data extraction (food.json, drinks.json)│
│  • Drinks Bar Counter scene (parallax, neon, counter)    │
│  • 3D WebGL Panoramic Tour ("Step Inside Fursat")        │
│  • Tour in-material shaders (chromatic aberration, wave) │
│  • Tour Web Audio Ambience synthesizer toggle            │
│  • Velocity-skewed kinetic marquee typography            │
│  • Gold foil gyro tilt on Mascot 15% offer card          │
│  • Day / Evening curtain comparison slider on home page  │
│  • Magnetic platters & 2D marble ripple on TableSpread   │
│  • Data compliance (removed unconfirmed reviews & FSSAI) │
│  • Honest WhatsApp takeaway and reservation modal flows  │
│  • Full Sharp asset compression pipeline & WebP assets   │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Video Assets Audit & `.gitignore` Requirements

### Current Local Video State
- Local tracked MP4 files: **0**
- Local MP4 files on disk under `public/`: **0**
- `.gitignore` line 11: `public/**/*.mp4` blocks all MP4 files under `public/`.

### Complete Grep Results Across `src/` and `public/js/`

| Video Path | References Found In | Local Disk | `origin/dev` | Status / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `/assets/hero-master-v2.mp4` | `src/components/Hero.astro`, `public/js/14.js` | Missing | **Exists** | Desktop hero background video. |
| `/assets/hero-master-v2-sm.mp4` | `src/components/Hero.astro` | Missing | **Exists** | Mobile hero background video. |
| `/assets/f56e73c9e7.mp4` | `src/components/IntroHeli.astro` | Missing | **Exists** | **STILL REFERENCED** in IntroHeli video player. |
| `/assets/reels/reel-fursat-happened-v1.mp4` | `src/components/Reels.astro`, `public/js/18.js` | Missing | **Exists** | Active reel video card. |
| `/assets/reels/reel-inside-fursat-v1.mp4` | `src/components/Reels.astro`, `public/js/18.js` | Missing | **Exists** | Active reel video card. |
| `/assets/reels/reel-dynamite-prawns-v1.mp4` | `src/components/Reels.astro`, `public/js/18.js` | Missing | **Exists** | Active reel video card. |
| `/assets/reels/reel-veg-combo-v1.mp4` | `src/components/Reels.astro`, `public/js/18.js` | Missing | **Exists** | Active reel video card. |
| `e4ced586f4.mp4` | None | Missing | **Deleted** | **Confirmed deleted on `origin/dev`** in commit `9deda45` ("remove unused video"). |

### Required `.gitignore` Exceptions
To ensure the 7 production videos remain tracked while preventing uncompressed raw camera files from being committed:
```gitignore
# Block uncompressed raw videos
*.mov
*.mp4.raw

# Ignore accidental video drops, but track valid production video assets:
public/**/*.mp4
!public/assets/hero-master-v2.mp4
!public/assets/hero-master-v2-sm.mp4
!public/assets/f56e73c9e7.mp4
!public/assets/reels/reel-*.mp4
```

---

## 7. Port Order for `integration/new-build`

Branch `integration/new-build` is created directly FROM `origin/dev`.  
Because local commits were executed inside `fursat/`, local patches exported via `git format-patch` will be applied onto the repository root using:
```powershell
git am --directory=fursat <patch-file>
```
Each batch must be followed immediately by a clean 14-page production compilation check:
```powershell
cd fursat; npm.cmd run build
```

### Batch 1: Compliance, Data Integrity & Setup (Commits 23 to 34)
- `073d0d7` chore: add lighthouse dev dependency
- `798b345` chore: lighthouse median helper
- `fc548eb` docs: launch readiness report
- `eea6f65` chore: add session resume checklist
- `85a07e1` fix: offer modal opens WhatsApp, honest disclaimer
- `525d6d6` fix: hide unconfirmed offer terms (`src/data/offers.json`, `MascotOfferModal.astro`)
- `36731bc` feat: order page WhatsApp takeaway (`src/pages/order.astro`)
- `f5bf039` docs: update readiness
- `73952ae` fix: events unconfirmed perks (`src/pages/events.astro`)
- `89e9bbf` fix: reserve scratch card unconfirmed reward (`src/pages/reserve.astro`)
- `3633e8b` docs: readiness fix 4
- `2be9986` fix: remove unconfirmed fssai and reviews (`src/pages/index.astro`, `src/pages/story.astro`)
- **Conflict Risk**: **LOW**. Self-contained data and page fixes.
- **Verification**: Run `npm.cmd run build` → confirm 14 pages.

### Batch 2: Core Menu Data & Split Screen Architecture (Commits 36 to 45)
- `e1f2000` chore: update resume checklist with menu tasks and parked hero items
- `bd997ad` feat: menu data from PDFs (`src/data/food.json`, `src/data/drinks.json`)
- `e7084fd` feat: menu page uses new data (`src/pages/menu.astro`)
- `d7dea9f` feat: menu food/drinks split (`src/pages/menu.astro`)
- `f2d83b5` chore: add MENU 5-7 to resume checklist
- `549e708` fix: move stray menu sections (`src/data/food.json`)
- `a886de2` feat: menu glb assets (plate/bowl placeholders)
- `5c65ce0` feat: menu 3d table (`src/pages/menu.astro`)
- `a61cc08` feat: menu dish select (`src/pages/menu.astro`)
- `b2614a3` feat: menu drinks bar counter scene (`src/pages/menu.astro`, interior assets)
- **Conflict Risk**: **LOW-MEDIUM**. All edits localized to `menu.astro`, which `origin/dev` has not modified.
- **Verification**: Run `npm.cmd run build` → confirm 14 pages.

### Batch 3: Housekeeping & WebGL Panoramic Tour (Commits 46 to 54)
- `952ce7a` docs: agent rules and remove v9 handoff (`AGENTS.md`)
- `49ccd1a` feat: home panoramic tour (tour assets and viewer component)
- `54d41f6` docs: update tour plan with client revisions
- `f4c4d7b` feat: tour 3d webgl rotunda canvas engine (`PanoramicViewer.astro`)
- `a0f3f60` feat: tour panel shader effects and particles (`PanoramicViewer.astro`)
- `c83adc2` feat: tour camera fly to, space drawer and panos (`PanoramicViewer.astro`)
- `29d4aaa` feat: tour fallback and a11y hardening (`PanoramicViewer.astro`)
- `1e3c7fd` docs: tour 3d rotunda completed
- `5687f42` fix: tour 3-panel visibility, in-scene zoom, and scroll-snap fallback
- **Conflict Risk**: **MEDIUM**. Touches `src/pages/index.astro`. Must merge cleanly with origin's Reels section.
- **Verification**: Run `npm.cmd run build` → confirm 14 pages.

### Batch 4: Trending Motion & Interaction Batches 1 & 2 (Commits 55 to 61)
- `423f3a1` docs: effects plan for motion and interactions
- `b89554c` feat: magnetic platter drift and contact shadow physics (`TableSpread.astro`)
- `0ef9537` feat: marble ripple canvas behind plates with low end guards (`TableSpread.astro`)
- `5d00849` feat: tour web audio ambience toggle with viewport suspension (`PanoramicViewer.astro`)
- `68be09f` feat: velocity skewed kinetic marquee on scroll (`MarqueeStrip.astro`)
- `01bd608` feat: gold foil tilt and highlight on mascot offer card (`MascotOfferModal.astro`)
- `38dcc87` feat: day evening curtain slider on home page (`DayNightSlider.astro`, `index.astro`)
- **Conflict Risk**: **LOW-MEDIUM**. Minor context collision in `index.astro` where DayNightSlider is inserted above Reels.
- **Verification**: Run `npm.cmd run build` → confirm 14 pages.

### Special Conflict Policy: `src/components/Hero.astro`
- In commit `dd70b89`, local set `preload="none"`. On `origin/dev`, commit `9deda45` set `preload="metadata"`.
- **MANDATORY RULE**: **Never resolve `Hero.astro` conflicts silently**. If a patch conflict triggers on `Hero.astro`, stop execution, display the exact hunk diff to the user, and request confirmation before advancing.

---

## 8. Prerequisites & Execution Checklist

1. **Owner Action**: Tag current `main` branch as `pre-new-build` (`git tag pre-new-build origin/main`).
2. **Preview Integrity**: `fursat-preview` Cloudflare Pages or hosting settings must remain completely untouched.
3. **Branch Creation**: `integration/new-build` branched from `origin/dev`:
   ```powershell
   git checkout -b integration/new-build origin/dev
   ```
4. **Verification Requirement**: Each batch must end with a full 14-page production compilation check before starting the next batch.

---

## 9. Standalone Paste-Ready BUILD PROMPT

```markdown
Project folder: C:\Users\Seminarhall\.gemini\antigravity\scratch\fursat-astro
Read AGENTS.md and review/merge-plan.md only. Rules from AGENTS.md apply. No deploy, no push, no git gc.

TASK: Execute the porting of local master commits onto integration/new-build (created FROM origin/dev) following review/merge-plan.md.

Prerequisites:
- Verify owner tagged main as pre-new-build.
- Create integration/new-build from origin/dev.
- Update .gitignore with production video un-ignore exceptions.

Execution:
1. Port Batch 1 (Compliance, Data Integrity & Setup) via git am --directory=fursat. Run npm.cmd run build in fursat/ and confirm 14 pages.
2. Port Batch 2 (Menu Data & Split Architecture) via git am --directory=fursat. Run npm.cmd run build and confirm 14 pages.
3. Port Batch 3 (Panoramic Tour Engine) via git am --directory=fursat. Run npm.cmd run build and confirm 14 pages.
4. Port Batch 4 (Motion & Interaction Batches 1 & 2) via git am --directory=fursat. Run npm.cmd run build and confirm 14 pages.
5. Hero.astro policy: If a conflict arises between preload="none" and preload="metadata", STOP and report immediately; never resolve silently.
6. Merge package.json dependencies: drop framer-motion and npm gsap, wire @tailwindcss/vite in astro.config.mjs, and verify all 14 pages build cleanly.
7. End with git --no-pager log --oneline -6 and git --no-pager status --short.
```
