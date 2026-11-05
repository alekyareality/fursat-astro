# 🔍 Fursat Asset Audit — Pre-Deployment Checklist
> **Status: NO DEPLOYMENT YET** — Audit findings to resolve first  
> **Date:** November 5, 2026 | 08:40 IST

---

## 1. 📸 Reference Design Images You Gave → What Was Built

| Reference File | What You Gave | Built Into |
|:---|:---|:---|
| `WhatsApp Image 2026-11-04 at 23.14.33.jpeg` (121 KB) | Cinder & Dew aesthetic — warm luxury café card design | Base design language: Paper Cream `#F2EEE4`, Deep Forest Green `#1F2A14`, Royal Gold `#E0A63C`, leaf-cut corners `border-radius: 64px 8px 64px 8px` |
| `WhatsApp Image 2026-11-04 at 23.14.33 (1).jpeg` (132 KB) | Cinder & Dew — menu card layout | Menu page card grid, sticky category pills, dietary filter badges |
| `WhatsApp Image 2026-11-04 at 23.14.34.jpeg` (222 KB) | Cinder & Dew — full page layout reference | Hero section proportions, section spacing, footer style |
| `WhatsApp Image 2026-11-04 at 23.14.34 (1).jpeg` (144 KB) | Cinder & Dew — typography & color palette | Font pairing: Newsreader (serif body) + Sacramento (script accent) |
| `mascot_offer_design.jpg` | 3D elephant in royal sherwani — 3-step offer flow | Built into `MascotOfferModal.astro` + `Mascot.astro`: floating badge → phone capture → FURSAT15 reward ticket |
| `table_animation_ref.mp4` | Dish platters sliding onto a dining spread on scroll | Built into `TableSpread.astro`: GSAP ScrollTrigger dish physics animation |

---

## 2. 🗺️ Pages Built — What Each Page Uses

| Page | Interior Photos Used | Dish Photos Used | Videos Used |
|:---|:---|:---|:---|
| `/` Home | `space_01,03,04,09,10,12` (Space Cards) | TableSpread animation | `hero-master-v2.mp4` (8.93 MB hero) |
| `/menu` | `space_07` (hero bg) | ALL 28 dish JPGs from your packs | None |
| `/reserve` | `space_08` | None | None |
| `/ask` | None | 38 WebP dishes (AI recommendation cards) | None |
| `/banquet` | `space_02,04,14,17,18` | None | None |
| `/cafe` | `space_05,06,09,11,15` | None | None |
| `/catering` | `space_02,03,05,14` | None | None |
| `/events` | `space_08,11,12,17` | None | None |
| `/restaurant-bar` | `space_08` | None | None |
| `/story` | `space_13,16,19` + panoramic viewer | None | None |
| `/order` | `space_10` | None | None |
| `/terms` | None | None | None |

---

## 3. ❌ GLB / 3D Assets — FINDING

> [!CAUTION]
> **No GLB or GLTF files exist anywhere in the project.**  
> The menu page does NOT use any 3D/GLB assets from your images.

The handoff doc notes (Section 3) that a **"3D Split Menu Concept"** was requested but the implementation decision was:
> *"Implemented robust production solution… Avoids mobile WebGL context crashes"*

The menu page uses **plain HTML image cards** (`<img>` tags reading from `menu.json`) — not 3D models. The dish images displayed are your real JPG photos from `images_pack_1` and `images_pack_2`, served directly as `.jpg`.

**The 38 WebP dish images in `/ask/dishes/`** (for the AI recommendation page) appear to be generated/stock illustrations, not photos from your packs.

---

## 4. 🔴 CRITICAL: Image Compression — NOT DONE

> [!CAUTION]
> **Dish photos and interior photos are serving uncompressed raw JPGs. This will make the site very slow.**

### Dish Photos — Severely Oversized

| File | Current Size | Should Be | Status |
|:---|:---|:---|:---|
| `jamicon_jerk_chicken_with_fires.jpg` | **21.2 MB** | ~80 KB | 🔴 265× too big |
| `dsc08852.jpg` | **17.5 MB** | ~80 KB | 🔴 219× too big |
| `_n.jpg` | **15.5 MB** | ~80 KB | 🔴 194× too big |
| `dsc08919.jpg` | **14.8 MB** | ~80 KB | 🔴 185× too big |
| `pandu_mirchi_kodi_kebab.jpg` | **13 MB** | ~80 KB | 🔴 162× too big |
| `dsc08946.jpg` | **11.3 MB** | ~80 KB | 🔴 141× too big |
| `dsc03308.jpg` | **9.3 MB** | ~80 KB | 🔴 116× too big |
| *(20 more dish photos)* | 3–9 MB each | ~80 KB | 🔴 All need compression |

### Interior / Space Photos — Oversized

| File | Current Size | Should Be | Status |
|:---|:---|:---|:---|
| `fursat_space_08.jpg` | **5.6 MB** | ~150 KB | 🔴 37× too big |
| `fursat_space_02.jpg` | **5.5 MB** | ~150 KB | 🔴 37× too big |
| *(17 more space photos)* | 2–5.6 MB each | ~150 KB | 🔴 All need compression |

### Video Files — Mixed

| File | Current Size | Limit | Status |
|:---|:---|:---|:---|
| `hero-master-v2.mp4` | 8.93 MB | 25 MB | ⚠️ Large but under limit |
| `e4ced586f4.mp4` | 5.98 MB | 25 MB | ⚠️ Large but under limit |
| `hero-master-v2-sm.mp4` | 3.88 MB | 25 MB | ⚠️ OK |
| `reel-*.mp4` (4 files) | 0.56–0.78 MB | 25 MB | ✅ Good |
| **Raw reels in `raw_assets/`** | 25–152 MB | — | ✅ Correctly excluded from deploy |

---

## 5. 📂 Raw vs Deploy Separation — CURRENT STATE

### What's correctly in `raw_assets/` (gitignored ✅):
- `reels/` — 10 raw video files (25–152 MB each)
- `images_pack_1/` — 11 raw dish photos (5–21 MB each)
- `images_pack_2/` — 17 raw dish/space photos (2.5–9 MB each)
- `interior_images/` — 19 raw interior JPGs (2–5.6 MB each)
- `reference_design/` — 4 WhatsApp reference screenshots
- `mascot_offer_design.jpg` — Mascot reference
- `table_animation_ref.mp4` — Animation reference

### What's in `public/` (will be deployed — ⚠️ PROBLEM):
- `public/assets/dishes/` — 28 uncompressed JPGs (3–21 MB each) → **MUST compress to WebP**
- `public/assets/interior/` — 19 uncompressed JPGs (1.9–5.6 MB each) → **MUST compress to WebP**
- `public/assets/*.mp4` — Videos present (8.93 MB hero) → **Should check if needed at that quality**

---

## 6. ✅ What IS Properly Compressed

| Asset Group | Format | Avg Size | Status |
|:---|:---|:---|:---|
| `/ask/dishes/` — 38 AI recommendation dish images | WebP | ~35 KB | ✅ Excellent |
| Mascot images (md/sm variants) | WebP | 20–45 KB | ✅ Good |
| Reel thumbnails (`post-*.webp`) | WebP | Small | ✅ Good |
| Fonts (`*.woff2`) | woff2 | 5–15 KB | ✅ Good |

---

## 7. 🛠️ ACTION PLAN — Before Deployment

### Step 1: Compress all dish photos (28 files → WebP)
Target: **80 KB max per dish photo** at 1200×900px

### Step 2: Compress all interior space photos (19 files → WebP)  
Target: **150 KB max** at 1920×1080px

### Step 3: Consider hero video optimization
`hero-master-v2.mp4` at 8.93 MB — could potentially go to ~3 MB with better compression, reducing home page load time significantly.

### Step 4: Verify `/ask/dishes/` WebP images match YOUR real dish photos
Currently these appear to be AI-generated illustrations. If you want your **real dish photography** shown in the Ask page AI recommendations, they need to be replaced.

### Step 5: Folder separation for GitHub Codespace
Once compressed, the `public/` folder will be clean deploy-ready assets. The `raw_assets/` are already gitignored.

---

> [!IMPORTANT]
> **Need to know:** Do you have `ffmpeg` or `sharp` installed, or should I use Node.js sharp (already in project dependencies) to batch compress all images automatically?
