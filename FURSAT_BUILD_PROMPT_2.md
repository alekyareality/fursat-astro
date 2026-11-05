# FURSAT BUILD PROMPT 2: WOW FEATURES, 3D MENU, EVENT PLANNER, ALL PAGES

Paste ONE PHASE at a time into Antigravity. Finish and verify a phase before the next. After each phase write a short log to `scripts/phase-log.txt` (what changed, files, what was verified) so any session can resume.

## GLOBAL RULES (apply to every phase)
- Read HANDOFF.md first. Windows PowerShell, `npm.cmd`, restore PATH.
- Keep component CSS prefixes (`mn-`, `as-`, `rs-`, `bq-`, `ev-`, `ct-`, `hm-`, `st-`, `sh-`, `ts-`, `pv-`, `od-`). No bare `.card/.pk/.hd`.
- Content is visible by default. Animations use `from` values and clear props. If JS fails the page must still read fine.
- Every animation has a `prefers-reduced-motion` alternative. Animate `transform`, `opacity`, `clip-path` only.
- Never invent legal, price, offer or contact details. Use `TODO(client)` and put values in `src/data/*.json`.
- Alignment standard (check every page): 8px spacing grid, content container max 1280px with 24px side padding on mobile, consistent section vertical rhythm (96px desktop / 64px mobile), no horizontal scroll at any width, no text clipped, no image stretched. Test at 360, 390, 768, 1024, 1280, 1536. Add `scripts/overflow-check.mjs` (Playwright) that fails if `document.scrollWidth > innerWidth` on any page at any of those widths, and run it each phase.
- Photos: real photos where they exist. Where a dish has no real photo use the AI illustration. Show "Photos are representative" where a photo stands in for a dish type.

---

## PHASE 1: WOW LAYER (site-wide, tasteful, fast)
Build a small motion kit in `src/lib/motion.ts`, loaded only where used (dynamic import):
1. **Page transitions:** Astro view transitions (already enabled). Persist the header across pages. Hero image morphs to the next page's hero where the same image is used.
2. **Kinetic headlines:** GSAP SplitText line/word reveal on H1/H2 (SplitText is free in current GSAP 3.13+). Fallback: plain text.
3. **Scroll storytelling:** one pinned ScrollTrigger scene per key page (Home: table-spread; Banquet: hall transforms Day to Night; Cafe: coffee-steam parallax). Use CSS scroll-driven animations (`animation-timeline: view()`) as the lightweight option where supported, GSAP as fallback.
4. **Magnetic buttons + cursor-lit cards:** desktop fine-pointer only, off on touch and reduced motion.
5. **Image reveals:** leaf-cut clip-path wipe on scroll for gallery and dish cards; subtle parallax inside frames.
6. **Marquee strips** (cuisines, offers) pausing on hover.
7. **Smooth scroll:** do NOT add Lenis unless native scroll feels bad. If added, disable for reduced motion and keyboard anchors must still work.
8. **Micro-interactions:** animated tab indicator, button press states, number counters (e.g. "slots left"), skeleton loaders, success confetti on booking (reduced motion: static check mark).
9. **Header behaviour:** pill header that shrinks on scroll, hides on scroll-down, returns on scroll-up. Mobile bottom bar (Menu, Ask, Reserve, WhatsApp).
Acceptance: Lighthouse mobile Performance 90+, CLS < 0.1, nothing hidden when JS is off, overflow-check passes.

## PHASE 2: MENU PAGE WITH REAL 3D (split screen)
**Reality check first (decide, then build):** a single photo cannot be turned into a perfect 3D model. Use this ladder and report which tier each dish reaches:
- **Tier A (target for the 3 hero dishes + drinks counter):** real GLB models. Create them from the real photos with an image-to-3D tool (for example Meshy, Tripo, Luma, Polycam) or from a multi-angle photo set (photogrammetry). Place sources in `raw_assets/models/` and optimized files in `public/models/`.
- **Tier B (fallback if a GLB is not ready or looks wrong):** the current procedural plate with the real photo as the food-top texture, shaped as a slightly domed disc with a rim, shadow and soft lighting so it reads as a plate of food, not a flat picture.
- **Tier C (no WebGL / low memory / reduced motion):** a rotating-card photo viewer (swipeable) built from real photos.
Every dish uses the first tier that works. Never ship a broken or ugly GLB.

**Layout and interaction**
- Desktop: two halves. LEFT: Fursat drinks counter (GLB or procedural). RIGHT: a dining table with 3 food models. Mobile: stacked panels with the same behaviour.
- Hover/tap: model lifts and shows its name and price. Click/tap: the selected model expands (GSAP Flip) to cover about 3/4 of the screen, slow orbit/drag-rotate, and the menu panel for that category slides in beside it (dish list, veg/non-veg/spicy filters, search, prices from `menu.json`). Close button, Esc, and swipe-down on mobile return to the split view. Deep links `/menu#drinks`, `/menu#biryani`.
- Lighting: soft studio light, contact shadow, environment map small (under 200 KB), tone-mapped. Auto-rotate slowly only when visible and not reduced motion.
- Performance: load three.js / R3F only on `/menu`, only after the section nears the viewport. Models lazy-loaded on first interaction with the real photo as poster. Optimize every GLB: `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp --texture-size 1024`. Budget: under 2 MB per model, under 8 MB total 3D payload. Pause the render loop when off-screen or tab hidden. Cap pixel ratio at 2. Dispose geometries/textures on close.
- Fallback: ALWAYS render the full plain HTML menu below the stage (tabs: Restaurant & Bar, Café, Craft Your Plate). It is the SEO and low-end device version.
- **Craft Your Plate tab:** choose dishes (counters), live summary, "Send to WhatsApp" and "Save as image". Content `TODO(client)` until the real list arrives.
Acceptance: works on a mid-range Android in Chrome (test with CPU 4x slowdown), no WebGL crash, menu readable with JS off.

## PHASE 3: BANQUET HALL + EVENTS: THE EVENT PLANNER (custom forms)
Build ONE shared component `EventPlanner` (used on `/banquet`, `/events`, `/catering`, `/reserve` for groups) with different presets. It is a multi-step form, not a plain contact form. Progress bar, back/next, autosave to sessionStorage, keyboard accessible, each step validated, ends with a summary card.

**Step 1: Choose the event (big illustrated buttons, leaf-cut cards with icon and short line)**
Birthday · Anniversary · Corporate Party · Kitty / Ladies Night · Bar Bash · Baby Shower · Farewell / Get-together · Engagement / Small function · Outdoor Catering. Selecting one changes the form's accent colour, icon, headline copy, default guest range, suggested add-ons and suggested menu preset (data-driven from `src/data/events.json`).

**Step 2: Basics**
Date picker (blocks past dates, shows "popular" days), time slot buttons (Lunch / Evening / Night), guest count (slider + number, min/max per venue), venue choice (Banquet Hall / Restaurant section / Bar / Outdoor at your place), indoor/outdoor.

**Step 3: Menu customisation (the key feature)**
- Package tier buttons: Classic / Premium / Royal (names and contents `TODO(client)`; the only known price is "from ₹925 per person").
- Diet: Veg / Non-veg / Mixed (with % mix slider).
- Cuisine chips: Hyderabadi, North Indian, Andhra, Indo-Chinese, Continental, Street food.
- Build-your-menu: pick dishes from `menu.json` by course (Starters, Mains, Biryani and rice, Breads, Desserts, Drinks). Per-course limits from the package (for example "choose 4 starters"). Show the real dish photo on each choice. Counter shows chosen/limit.
- Live set-menu preview card (what the host will see) and indicative cost: `per-person × guests`, clearly labelled "indicative, final quote by our team".
- Add-ons as toggle chips: Live music, DJ, Decor, Cake, Photographer, Welcome drink, Live counters, Projector/mic. Prices `TODO(client)`.
- Alcohol: bar packages only for guests 21+, with a visible note; no pricing or discounts shown until the client confirms.
- Dietary notes box (Jain, allergies, no-onion-garlic).

**Step 4: Contact + consent**
Name, phone (+91 validation), email optional, preferred contact (WhatsApp/Call), consent checkbox linking to `/terms`.

**Step 5: Summary + send**
Review card with everything. Buttons: "Send on WhatsApp" (prefilled message with the full summary and UTM), "Request call back", "Download summary (PDF/image)". Also POST to the lead endpoint. Show mascot confirmation. If the backend is not built yet, say so clearly in the UI log and disable the POST, but keep WhatsApp working.

**Page-specific parts**
- `/banquet`: hero with Day/Night scroll transformation, 3D or panoramic hall viewer (use the interior photos), capacity and seating layouts (theatre, banquet, cocktail) as animated diagrams, packages, gallery, FAQ (FAQPage schema), the EventPlanner preset "Banquet".
- `/events`: tabs for each event type (hash-linked); each tab has its own hero image, copy, sample menu, gallery and the EventPlanner pre-set to that type. Corporate tab adds headcount tiers, GST invoice note, AV needs.
- `/catering`: EventPlanner preset "Outdoor" adds location area, service style (buffet/plated/live counters), staff and equipment toggles, travel distance note.
Data lives in `src/data/events.json`, `packages.json`, `addons.json`. No prices hard-coded in components.

## PHASE 4: REMAINING PAGES, FULLY BUILT AND ALIGNED
For each page: finished layout from the 12-page plan, real photos, motion kit from Phase 1, SEO title/description/canonical/OG, schema, FAQ, WhatsApp CTA with page-specific prefilled text.
- `/` Home: hero in wave-cutout style, offer card, space cards, signature dishes, panoramic viewer, table-spread scene, reels carousel (one playing at a time), reviews, map and hours.
- `/restaurant-bar`, `/cafe`: hero, highlights, reels, gallery, FAQ, Reserve.
- `/reserve`: date/time/guests, live slot picker, offer per slot from `offers.json`, scratch card, confirmation. All rules `TODO(client)`.
- `/ask`: leaf-cut result cards, results visible by default, real photos where they match.
- `/story`: story, mascot, timeline, legal block, map. Copy `TODO(client)`.
- `/terms`: offers, privacy, phone-number use.
- `/order`: simple "coming soon" with WhatsApp ordering link.

## PHASE 5: VERIFICATION REPORT (stop here and wait for review)
1. `npm.cmd run build` passes. Search `dist/` for "TODO": list every hit.
2. Screenshots at 360, 390, 768, 1280 for every page. Save in `review/shots/`.
3. `overflow-check.mjs` result table.
4. Lighthouse mobile table per page (Perf, A11y, SEO, LCP, CLS).
5. 3D report: which tier each model reached, file sizes, FPS on a throttled run.
6. EventPlanner test: each event type end-to-end, WhatsApp text output pasted in the report.
7. Reduced-motion and JS-off screenshots of Home, Menu, Banquet.
8. List of every `TODO(client)` still open.
