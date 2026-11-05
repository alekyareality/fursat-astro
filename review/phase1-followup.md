# FURSAT KITCHEN | BAR — PHASE 1 FOLLOW-UP DETAILED AUDIT & VERIFICATION REPORT

> **Date:** November 5, 2026  
> **Status:** ✅ VERIFICATION COMPLETE (All 5 Target Audit Areas Measured & Verified)  
> **Target Environment:** Mobile Viewport 390×844 & Desktop Viewports (360px–1536px)  
> **Reference:** `FURSAT_MASTER_BRIEF_v7.md` (Step 2: Phase 1 Follow-up)

---

## 1. REAL LIGHTHOUSE MOBILE AUDIT (HOME & BANQUET)

Audits were executed using official Lighthouse v13.6.0 via Chrome headless with standard mobile throttling (simulated 4G network and 4x CPU slowdown).

### Summary Table

| Metric / Category | Home (`/`) | Banquet (`/banquet`) | Target / Notes |
|---|---|---|---|
| **Performance** | **72 / 100** | **74 / 100** | Under mobile CPU & 4G throttling |
| **Accessibility** | **91 / 100** | **98 / 100** | High compliance; semantic HTML & ARIA |
| **Best Practices** | **96 / 100** | **100 / 100** | Modern web standards, HTTPS & doctype |
| **SEO** | **100 / 100** | **100 / 100** | Full crawlability, meta tags, sitemap |
| **Largest Contentful Paint (LCP)** | **4.1 s** | **18.2 s** | Banquet LCP is uncompressed hero (`fursat_space_18.webp` @ 596 KB) without art direction (Step 3 target) |
| **Cumulative Layout Shift (CLS)** | **0.000** | **0.000** | Zero layout shift on both routes |
| **Total Blocking Time (TBT)** | **410 ms** | **110 ms** | Banquet minimal blocking; Home has legacy modular script parsing |
| **First Contentful Paint (FCP)** | **1.6 s** | **1.5 s** | Fast initial paint |
| **Speed Index** | **5.1 s** | **1.8 s** | Visual completion index |

> **Auditor Artifacts Saved:**
> - `review/lighthouse-home.json`
> - `review/lighthouse-banquet.json`
> - `scripts/extract-lh.mjs`

---

## 2. GZIPPED JS SIZE PER PAGE VS 120 KB BUDGET

Measurement performed using `dist/` production assets with standard Gzip compression (`zlib.gzipSync`).

### Per-Page Breakdown

| Page | Total Raw JS | Total Gzip JS | 120 KB Budget Status | Loads GSAP? | Primary Scripts |
|---|---|---|---|---|---|
| **Home (`/`)** | 409.49 KB | **153.40 KB** | ⚠️ **FAIL (+33.40 KB)** | Yes (on-demand) | `TableSpread` (44.75 KB gz), `01-19.js` (78.46 KB gz), `gsap.min.js` (27.61 KB gz), `motion-kit.js` (2.58 KB gz) |
| **Banquet (`/banquet`)** | 81.31 KB | **30.19 KB** | ✅ **PASS (-89.81 KB)** | Yes (on-demand) | `motion-kit.js` (2.58 KB gz), `gsap.min.js` (27.61 KB gz) |
| **Menu (`/menu`)** | 81.31 KB | **30.19 KB** | ✅ **PASS (-89.81 KB)** | Yes (on-demand) | `motion-kit.js` (2.58 KB gz), `gsap.min.js` (27.61 KB gz) |
| **Café (`/cafe`)** | 81.31 KB | **30.19 KB** | ✅ **PASS (-89.81 KB)** | Yes (on-demand) | `motion-kit.js` (2.58 KB gz), `gsap.min.js` (27.61 KB gz) |

### GSAP Loading Analysis
- **Mechanism:** `public/js/motion-kit.js` inspects the DOM for animated classes (`.mot-headline`, `.mot-reveal-img`, `.mot-magnetic`, `.mot-counter`, `.mot-parallax-frame`).
- **Isolation:** If none of these classes exist on a page (or if `prefers-reduced-motion: reduce` is active), `motion-kit.js` **does not load** `/js/gsap.min.js`.
- **Pages Loading GSAP:** Home, Banquet, Menu, Café all load GSAP on-demand because they utilize `.mot-headline` or `.mot-reveal-img`.
- **Budget Finding:** Banquet, Menu, and Café are only **30.19 KB gzipped** (well under the 120 KB limit). Home exceeds the budget solely due to the legacy `01.js`–`19.js` modular scripts (78 KB gzip) and `TableSpread` (44.8 KB gzip). Step 3 mobile foundations will tackle lazy-loading heavy canvas JS.

> **Auditor Artifacts Saved:**
> - `scripts/measure-js-sizes.mjs`
> - `review/js-budget-report.json`

---

## 3. MICRO-INTERACTIONS: `.mot-tab-indicator`, `.mot-skeleton`, `.mot-confetti`

### Files Utilizing Micro-interactions

| Class | Files Applied | Purpose |
|---|---|---|
| **`.mot-tab-indicator`** | `src/pages/events.astro`<br>`src/pages/menu.astro`<br>`src/pages/reserve.astro` | Sliding gold underline indicator for event tabs, menu category filters, and lunch/dinner time-slot pickers. |
| **`.mot-skeleton`** | `src/pages/reserve.astro`<br>`src/pages/parties.astro`<br>`public/js/ask.js` | Shimmer placeholder animation during async content loading. |
| **`.mot-confetti`** | `src/pages/reserve.astro` | Celebratory 5-color particle burst on perk scratch reveal AND booking confirmation. |

### Enhancements Applied in this Follow-up
1. **Confetti on Booking Confirmation:**
   - In `src/pages/reserve.astro`, added `.mot-confetti` to `#res-submit-btn`.
   - Upon valid table reservation submit, `submitBtn.classList.add('mot-confetti--active')` is triggered with a 1.2s timeout before opening WhatsApp.
2. **Skeleton on Async Content Loading:**
   - **Reserve Time Slots:** In `src/pages/reserve.astro`, selecting a new date immediately applies `.mot-skeleton` to `.rs-time-chip` elements for 350ms to indicate real-time slot availability lookup.
   - **Ask Fursat Search:** In `public/js/ask.js`, initiating a dish search immediately renders `.mot-skeleton` placeholder cards into `#as-results` while the menu data promise and search query resolve.
   - **Parties Package Catalog:** In `src/pages/parties.astro`, added dual `.mot-skeleton` cards inside `#pp-cards` so visitors see smooth placeholder shimmers while `parties.js` fetches `/data/packages.json`.

---

## 4. OVERFLOW CHECK ON ALL 14 ROUTES (84/84 VIEWPORTS PASSED)

Automated Playwright audit verified horizontal overflow across all 14 routes at 6 viewports: **360px, 390px, 768px, 1024px, 1280px, 1536px** (84 checks total).

### Results: 0 Overflows Detected (84/84 PASS)
- `/` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/menu` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/banquet` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/cafe` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/restaurant-bar` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/reserve` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/ask` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/story` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/events` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/catering` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/terms` @ 360, 390, 768, 1024, 1280, 1536px ✅
- `/order` @ 360, 390, 768, 1024, 1280, 1536px ✅
- **`/parties` (Extra Route 1)** @ 360, 390, 768, 1024, 1280, 1536px ✅
- **`/party` (Extra Route 2)** @ 360, 390, 768, 1024, 1280, 1536px ✅

### Analysis of the Two Extra Routes: `/parties` vs `/party`
- **Context:** The site brief originally planned 12 core pages. Two additional routes exist in `src/pages/`:
  1. **`/parties.astro`:** A lightweight, vanilla JavaScript package calculator. Uses `/js/parties.js` to fetch `/data/packages.json`. Includes occasion chips, a guest range slider (10–200), and calculates dynamic cost estimates. Does not use React or Three.js.
  2. **`/party.astro`:** A newer, component-based party package showcase. Imports `PartyStage.tsx` (`StageCanvas.tsx` with Three.js 3D canvas, ~946 KB uncompressed) and `src/data/party.json`.
- **Duplication & Linking Status:**
  - Neither page is currently linked in `SiteHeader.astro` or `MobileBar.astro`.
  - Neither page currently redirects to the other.
- **Recommendation:** 
  - **Keep `/party`** as the canonical route because its component architecture and package definitions (`party.json`) align with the modern site design system and upcoming Step 5 Event Planner.
  - Set up a **301 redirect from `/parties` to `/party`** once approved. (Do not delete until client confirms).

---

## 5. `#gate` INVESTIGATION: MOBILE BAR OVERLAY & NON-HOME ENTRY

Automated headless mobile tests (390×844) were conducted to analyze the interaction between `#gate` and the mobile navigation bar:

### Findings

| Question / Test Case | Result | Technical Evidence |
|---|---|---|
| **Does `#gate` overlay the mobile bottom bar?** | **NO** | `#gate` is positioned at `z-index: 80`. `.mb-bar` is positioned at `z-index: 9000`. |
| **Are mobile bar clicks intercepted by `#gate`?** | **NO** | `document.elementFromPoint(195, 810)` directly hits `a.mb-item mb-reserve` inside `.mb-bar` (`hitInsideBar: true`, `hitInsideGate: false`). |
| **Does `#gate` appear on non-Home entry pages?** | **NO** | Tested fresh entry to `http://localhost:4321/banquet`. `gatePresent: false`. `#gate` is only imported in `src/pages/index.astro`. |

> **Screenshot Evidence:**
> - `review/shots/gate-390-home.png` (Showing `#gate` active on Home with mobile bar positioned clearly above it)
> - `review/shots/gate-390-banquet.png` (Showing clean entry on Banquet with no `#gate`)
> - `review/gate-check-results.json`
