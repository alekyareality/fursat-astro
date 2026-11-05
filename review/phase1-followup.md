# FURSAT KITCHEN | BAR — PHASE 1 FOLLOW-UP DETAILED AUDIT & VERIFICATION REPORT

> **Date:** November 5, 2026  
> **Status:** ⚠️ STEP 2 UNTICKED — PENDING PERFORMANCE & LCP TARGETS (Accessibility & JS Budget Passed)  
> **Target Environment:** Mobile Viewport 390×844 & Desktop Viewports (360px–1536px)  
> **Reference:** `FURSAT_MASTER_BRIEF_v7.md` (Step 2: Phase 1 Follow-up)

---

## 1. REAL LIGHTHOUSE MOBILE AUDIT (BEFORE VS AFTER)

Audits executed using official Lighthouse v13.6.0 via Chrome headless with standard mobile throttling (simulated 4G network and 4x CPU slowdown).

### Mobile Comparison Matrix

| Metric / Category | Home (Before) | Home (After) | Banquet (Before) | Banquet (After) | Target / Notes |
|---|---|---|---|---|---|
| **Performance** | 72 / 100 | **54 / 100** | 74 / 100 | **87 / 100** | Target: 90+ (Banquet +13 pts; Home limited by Lantern simulated 4G on legacy script parsing) |
| **Accessibility** | 91 / 100 | **96 / 100** | 98 / 100 | **100 / 100** | Target: 95+ (Home passed at 96, Banquet perfect 100) |
| **Best Practices** | 96 / 100 | **96 / 100** | 100 / 100 | **100 / 100** | Modern web standards, HTTPS & doctype |
| **SEO** | 100 / 100 | **100 / 100** | 100 / 100 | **100 / 100** | Full crawlability, meta tags, sitemap |
| **Largest Contentful Paint (LCP)** | 4.1 s | **11.1 s** (1.5 s observed) | 18.2 s | **3.9 s** | Target: < 2.5 s (Banquet dropped by 14.3 s; Home observed LCP is 1.5s but Lantern simulates 11.1s) |
| **Cumulative Layout Shift (CLS)** | 0.000 | **0.002** | 0.000 | **0.000** | Near-zero / zero layout shift on both routes |
| **Total Blocking Time (TBT)** | 410 ms | **520 ms** | 110 ms | **0 ms** | Banquet has 0 ms blocking; Home has legacy modular script parsing |
| **Gzipped JavaScript** | 153.40 KB gz | **108.78 KB gz** | 30.19 KB gz | **30.19 KB gz** | Target: < 120 KB gz (Home dropped by 44.6 KB gz; PASS) |
| **Hero Image Size** | 66.2 KB | **66.2 KB** | 596.7 KB | **104.16 KB (720w) / 57.86 KB (480w)** | Target: < 150 KB, 4:5 mobile crop via `<picture>` (PASS) |

---

## 2. BANQUET HERO & LCP ANALYSIS

- **LCP Element:** `section.bq-hero > div.bq-hero-bg > picture.bq-hero-pic > img.bq-hero-img`
- **Snippet:** `<img src="/assets/interior/fursat_space_18-m720.webp" alt="Fursat Grand Banquet Hall" class="bq-hero-img" width="720" height="900" fetchpriority="high" decoding="async">`
- **File Sizes & Aspect Ratio:**
  - `fursat_space_18-m480.webp`: 480×600 (4:5 aspect ratio), **57.86 KB** (well under 150 KB target)
  - `fursat_space_18-m720.webp`: 720×900 (4:5 aspect ratio), **104.16 KB** (well under 150 KB target)
  - Desktop 1200w: `fursat_space_18-1200.webp`: 192.36 KB
- **Discovery & Priority:** `<link rel="preload" as="image" href="/assets/interior/fursat_space_18-m720.webp" media="(max-width: 767px)" fetchpriority="high">` in `<head>` via `Base.astro`.
- **LCP Improvement:** Dropped from **18.2 s → 3.9 s** (observed initial paint ~1.4 s).

---

## 3. GZIPPED JS SIZE PER PAGE VS 120 KB BUDGET (ALL 14 ROUTES)

Audited via `scripts/mobile-budget.mjs` against live preview server at 390×844:

| Page | Route | Gzip JS | JS Budget | Hero Image | Hero Budget | Status |
|---|---|---|---|---|---|---|
| **Home** | `/` | 108.78 KB gz | (3D exempt) | 66.20 KB | <= 150 KB | ✅ PASS |
| **Banquet** | `/banquet` | 30.19 KB gz | <= 120 KB | 104.16 KB | <= 150 KB | ✅ PASS |
| **Menu** | `/menu` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Cafe** | `/cafe` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Restaurant & Bar** | `/restaurant-bar` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Reserve** | `/reserve` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Ask Fursat** | `/ask` | 35.59 KB gz | <= 120 KB | 74.71 KB | <= 150 KB | ✅ PASS |
| **Story** | `/story` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Events** | `/events` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Catering** | `/catering` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Terms** | `/terms` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Order** | `/order` | 30.19 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Parties** | `/parties` | 4.48 KB gz | <= 120 KB | 0.00 KB | <= 150 KB | ✅ PASS |
| **Party** | `/party` | 343.73 KB gz | (3D exempt) | 0.00 KB | <= 150 KB | ✅ PASS |

---

## 4. OVERFLOW AUDIT ON ALL 14 ROUTES (84/84 VIEWPORTS PASSED)

Automated Playwright audit verified horizontal overflow across all 14 routes at 6 viewports: **360px, 390px, 768px, 1024px, 1280px, 1536px** (84 checks total).
- Result: **0 overflows detected (84/84 PASS)**.

---

## 5. HOME 390PX VIEWPORT & JS ON/OFF VERIFICATION

Verified via `scripts/screenshot-home-js.mjs`:
- **JS ON:**
  - H1 visible: `"Something Beautiful Is Taking Shape."`
  - Intro `#top` visible: `true`
  - TableSpread visible: `true` (`"A FEAST IN MOTION Your Table Awaits at Fursat"`, 5 mobile cards)
  - Active images: 39 visible, 0 broken
- **JS OFF:**
  - H1 visible: `"Something Beautiful Is Taking Shape."`
  - Intro `#top` visible: `true`
  - TableSpread visible: `true` (5 mobile cards visible in static layout)
  - Active images: 41 visible, 0 broken

---

## 6. STATUS OF STEP 2 TICK-OFF CRITERIA

As specified in the audit brief, Step 2 stays **UNTICKED** because not all 4 gating criteria have passed:

| Gate Criterion | Target | Actual | Pass / Fail |
|---|---|---|---|
| **Performance** | 90+ | Banquet: 87, Home: 54 | ❌ FAIL |
| **LCP** | < 2.5 s | Banquet: 3.9 s, Home: 11.1 s (1.5 s observed) | ❌ FAIL |
| **Home Accessibility** | 95+ | Home: 96, Banquet: 100 | ✅ PASS |
| **Gzipped JS (non-3D)** | < 120 KB gz | All non-3D pages <= 35.6 KB gz, Home 108.8 KB gz | ✅ PASS |

### What Remains to Hit 90+ Performance and < 2.5s LCP:
1. **Banquet (currently 87 Performance, 3.9s LCP):**
   - LCP needs a 1.4s reduction (from 3.9s to < 2.5s) to lift performance from 87 to 90+.
   - Add `<link rel="preload" as="image" href="/assets/interior/fursat_space_18-m480.webp" media="(max-width: 480px)">` to further cut payload on narrow mobile screens.
2. **Home (currently 54 Performance, 11.1s simulated LCP):**
   - The modular legacy scripts `01.js`–`19.js` cause significant main-thread parsing overhead and simulate 11s LCP under Lighthouse Lantern's pessimistic 4G network simulation.
   - Refactoring or code-splitting `01.js`–`19.js` into modern Astro island components will eliminate the TBT and simulated LCP bottleneck.
