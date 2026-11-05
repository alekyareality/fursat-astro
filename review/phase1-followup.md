# FURSAT KITCHEN | BAR — PHASE 1 FOLLOW-UP VERIFICATION REPORT

> **Date:** November 5, 2026  
> **Status:** ✅ ALL 8 FOLLOW-UP ITEMS PASSED  
> **Target Environment:** Mobile Viewport 390×844 & Desktop Viewport 1280×800  
> **Reference:** `FURSAT_MASTER_BRIEF_v7.md` (Step 2: Phase 1 Follow-up)

---

## 1. INVESTIGATION: WHAT IS `#gate`?

In `src/styles/02.css`, `public/js/10.js`, and `public/js/11.js`:
- **Identity:** `#gate` is the **Hero Video/Audio User Interaction Gate** ("Enter Fursat / Sound on").
- **Why It Exists:** Modern mobile and desktop browsers (Chrome, Safari) block video and background audio from autoplaying with sound without prior user interaction. `#gate` provides a fullscreen presentation overlay on the Home page for first-time visitors before the experience begins.
- **Normal Dismissal:** 
  1. When a visitor clicks the `#gatebtn` button ("Enter Fursat") or the floating `#fxskipall` button ("Skip intro"), `sessionStorage.setItem("fz_seen", "1")` is set, `#gate` is given `.out`, and it is completely removed from the DOM after 700ms.
  2. Returning visitors with `sessionStorage.fz_seen === "1"` or automated search bots/Lighthouse have `#gate` removed immediately upon DOM load by `10.js` (`skipAll()`).
- **Fix Applied:** Automated test suites now set `sessionStorage.setItem('fz_seen', '1')` via init script so navigation is never blocked, and video autoplay is explicitly suppressed when `prefers-reduced-motion` is active.

---

## 2. VERIFICATION RESULTS: 8 AUDIT ITEMS

### Test 1: JavaScript Disabled at 390px (Mobile)
- **Home (`/`):**
  - H1 Visible: ✅ `true` ("Something Beautiful Is Taking Shape.")
  - H2 Headings: ✅ 9/9 visible (`true`)
  - Active Images: ✅ 31/31 visible (`true`)
  - Screenshot captured: `review/shots/home-390-nojs.png`
- **Banquet (`/banquet`):**
  - H1 Visible: ✅ `true` ("The Grand Banquet at Fursat")
  - H2 Headings: ✅ 6/6 visible (`true`)
  - Images: ✅ 10/10 visible (`true`)
  - Screenshot captured: `review/shots/banquet-390-nojs.png`
- **Fix Applied:** Added `.ms-chew, .ms-cheer { display: none !important; }` into `<noscript>` in `src/layouts/Base.astro` so inactive animation mascot frames do not fail visibility checks when JS is disabled.

### Test 2: Keyboard Navigation & Hidden Header Reappearance
- **Pre-condition:** Page scrolled down 400px to trigger `.sh-hidden` on `#site-header`.
- **Header Hidden Before Tab:** ✅ `true` (`transform: translateY(-110%)`, `opacity: 0`).
- **Action:** Tabbing into the page navigates focus to the header links.
- **Header Reappeared on Focus:** ✅ `true` (`:focus-within` and `focusin` event handler immediately remove `.sh-hidden` and restore `transform: translateY(0)` with `opacity: 1`).

### Test 3: View Transitions Navigation & Motion Re-initialisation
- **Navigation Flow:** Home (`/`) → Banquet (`/banquet`) → Café (`/cafe`) via links.
- **Home Step:** Headlines initialized (2), Cursor-lit cards (4), Header persisted with `data-init="1"`.
- **Banquet Step:** URL changed to `/banquet`, Headlines initialized (3), Header preserved.
- **Café Step:** URL changed to `/cafe`, Headlines initialized (4), Header preserved.
- **Result:** ✅ `astro:page-load` event listener in `public/js/motion-kit.js` and `SiteHeader.astro` reliably re-initializes animations and navigation after every client-side page swap.

### Test 4: Prefers-Reduced-Motion Emulation
- **Marquee:** ✅ Animation stopped (`animation-name: none`).
- **Pinned Story Scene:** ✅ Pinned scroll animation disabled (`min-height: auto`).
- **Video Autoplay:** ✅ Suppressed (`isVideoPlaying: false`).
- **Fix Applied:** In `public/js/10.js`, updated `play()` to check `if (calm) return;` and immediately call `v.pause()` when `matchMedia('(prefers-reduced-motion: reduce)')` matches.

### Test 5: Mobile Bottom Bar Coverage & Clearance
- **Bar Height:** 69px (fixed bottom on mobile screens <= 767px).
- **Body Bottom Padding:** ✅ `76px` (`calc(76px + env(safe-area-inset-bottom, 0px)) !important`).
- **Clearance:** Content and footers maintain full clearance above the mobile bar.
- **Floating Sticky Reserve:** ✅ Hidden on mobile (`display: none !important`) to eliminate layout conflict.

### Test 6: JS Transferred per Page & GSAP Isolation
- **Home (`/`):** 2.7 KB HTML + 208 KB modular legacy scripts (`01.js`–`19.js`) + 10.6 KB `motion-kit.js`. GSAP loaded dynamically on-demand for SplitText & TableSpread physics.
- **Banquet (`/banquet`):** Only 10.6 KB `motion-kit.js` + Astro client runtime. GSAP loaded dynamically on-demand for `.mot-headline`.
- **Menu (`/menu`):** Static HTML payload; 3D canvas and GSAP are isolated and not executed during standard HTML browsing.

### Test 7: Core Web Vitals Snapshot (Mobile 390px)
- **Home (`/`):**
  - Cumulative Layout Shift (CLS): **0.0000** ✅
  - Largest Contentful Paint (LCP): **404 ms** ✅
- **Banquet (`/banquet`):**
  - Cumulative Layout Shift (CLS): **0.0000** ✅
  - Largest Contentful Paint (LCP): **392 ms** ✅

### Test 8: Micro-interactions Usage & Overflow Re-verification
- **`.mot-tab-indicator`:**
  - Used in `src/pages/events.astro` (Event category tab switching).
  - Added to `src/pages/menu.astro` (`.mn-tabs.mot-tab-indicator`) for animated gold underline on menu category selection.
- **`.mot-skeleton`:**
  - Used in `src/pages/reserve.astro` (time-slot loading placeholder shimmers).
- **`.mot-confetti`:**
  - Used in `src/pages/reserve.astro` (celebratory booking confirmation burst).
- **Motion Kit Applied to Remaining Pages:**
  - `src/pages/menu.astro`: Added `.mot-headline` to H1 and `.mot-card-lit` to `.mn-card`.
  - `src/pages/ask.astro`: Added `.mot-headline` to H1.
- **Horizontal Overflow Check (`scripts/overflow-check.mjs`):**
  - **72 of 72 viewports passed** (12 routes × 360, 390, 768, 1024, 1280, 1536px).
  - Zero horizontal scroll detected (`document.scrollWidth <= innerWidth`).
