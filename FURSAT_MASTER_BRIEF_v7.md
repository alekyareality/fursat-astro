# FURSAT KITCHEN | BAR: MASTER BRIEF (v7, single file: process + build + mobile + phone control)

**Save as:** `C:\Users\Seminarhall\.gemini\antigravity\scratch\fursat-astro\fursat\FURSAT_MASTER_BRIEF_v7.md` (project root, next to `package.json`; never inside `public/` or `src/`).
**Replaces:** FURSAT_MASTER_BRIEF_v6.md, FURSAT_HANDOFF_v5.md, FURSAT_BUILD_PROMPT_2.md, FURSAT_MOBILE_FIRST_WORLDS.md (their full content is included below as Parts A, B and C; Part D covers running sessions from a phone). Keep `HANDOFF.md` (v4) as the base facts file.
**Shell:** Windows PowerShell, `npm.cmd`, restore PATH first:
`$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`
**Standing rules:** no deployment until the owner says so (disable `deploy` and `deploy:login` scripts). Never invent legal, price, offer or contact details: use `TODO(client)` and `src/data/*.json`. Remove the suggested FSSAI number.

## HOW TO READ THIS FILE
1. **Precedence if parts disagree:** Part C (mobile-first) wins on design and performance. Part A wins on process. Part B gives the feature detail.
2. **Do the sections in the order below.** One step per message. Wait for a report each time. Never paste the whole file as a prompt; tell the session to read it and do ONE step.
3. **Weaker or faster models drift.** If you are using Gemini Flash or GPT-OSS, send one numbered item at a time, ask it to confirm each item done, and make it run `npm.cmd run build` and the overflow check after each step. Keep the 3D menu, tour and event planner for the strongest model available.

## ORDER OF WORK

| Step | What | Source |
|---|---|---|
| 0 | **Audit first.** Report what is really on disk. Build nothing. | Part A, section 1 |
| 1 | **Safety checks** (below) | this header |
| 2 | **Phase 1 follow-up** (below): close gaps in the motion layer | this header |
| 3 | **Mobile foundations:** device tiers, art-directed images, lazy heavy JS, budget script | Part C, section 7 STEP 1 |
| 4 | **Menu page with 3D** (Phase 2) | Part A 2.3, Part B Phase 2 |
| 5 | **Event planner** on Banquet, Events, Catering (Phase 3) | Part A 2.4, Part B Phase 3 |
| 6 | **Home "Step Inside Fursat" virtual tour** (Phase 1B) | Part A 2.2 |
| 7 | **Every page's "world"**, one page per message | Part C, sections 5-7 |
| 8 | **Verification report** (Phase 5) | Part B Phase 5 |

## PROGRESS CHECKLIST (tick as you go; any session should update this)
Mark `[x]` only after the owner has seen the screenshots. Date each tick.

- [x] Step 0: audit report saved as review/audit-v7.md (November 5, 2026)
- [ ] Step 1: safety checks (photo contact sheet checked by owner, TODO search clean, phone-number storage answered, routes explained)
- [ ] Step 2: Phase 1 follow-up closed (JS off, keyboard, view transitions, reduced motion, bottom bar, JS size, Lighthouse)
- [ ] Step 3: mobile foundations (device tiers, art-directed images, lazy heavy JS, budget script passing)
- [ ] Step 4: Menu page 3D (record tier reached per dish: GLB / plate-photo / photo viewer)
- [ ] Step 5: Event planner (Banquet, Events, Catering) tested end to end for every event type
- [ ] Step 6: Home "Step Inside Fursat" tour (360 images supplied: yes / no)
- [ ] Step 7 worlds, one per message: [ ] Home  [ ] Restaurant & Bar  [ ] Cafe  [ ] Banquet  [ ] Events  [ ] Catering  [ ] Reserve  [ ] Ask Fursat  [ ] Story  [ ] Terms/Order (plain)
- [ ] Step 8: verification report (build, overflow, mobile budget, Lighthouse, JS-off and reduced-motion shots, TODO list)
- [ ] Client items received: legal name / GSTIN / FSSAI / address / email / Maps embed / WhatsApp number / offer rules / prices / brand story / Craft Your Plate menu
- [ ] Owner approval to launch (deployment is a separate decision, not part of this file)


## STEP 1: SAFETY CHECKS (paste after the audit)
```
Do not deploy. Report only, then wait.
a) Create review/photo-map.html (git-ignored): every dish name beside its assigned photo for /menu and /ask. Flag duplicate images and photos whose filename is a camera code (dsc*, _n). The owner will check every match by eye.
b) List the 14 routes. We planned 12 pages. Explain the extra two.
c) After npm.cmd run build, search dist/ for "TODO". List each hit. The build must fail on any TODO in public pages when LAUNCH=1.
d) Report JS size per page and whether three.js / react-three-fiber load only on /menu. Confirm /menu renders a plain HTML menu with WebGL off.
e) List every video in public with size and where used. Only one plays at a time; none autoplays with sound.
f) Where is the offer-modal phone number stored? If nowhere, say so plainly. Confirm the consent checkbox links to /terms.
g) Confirm all offer values (percentages, code, timings, food-only) live in src/data/offers.json marked TODO(client).
```

## STEP 2: PHASE 1 FOLLOW-UP (paste after step 1)
```
Phase 1 follow-up. Do not start Phase 2.
1. Disable JavaScript; screenshot Home and Banquet at 390 px. Every heading and image must be visible. Fix anything hidden.
2. Keyboard test: Tab through Home. A hidden header must reappear on focus.
3. Navigate Home > Banquet > Cafe via links (view transitions). Headline reveals, magnetic buttons, card glow and header hide/show must still work after each navigation (re-initialise on astro:page-load).
4. Emulate prefers-reduced-motion: no pinned scene, marquee, magnetic effect or autoplay.
5. The mobile bottom bar must not cover the footer or any button (bottom padding = bar height + safe area).
6. Report JS transferred per page (KB) for Home, Banquet, Menu. GSAP must not load on pages that do not use it.
7. Run Lighthouse mobile on Home and Banquet: Performance, Accessibility, SEO, LCP, CLS.
8. List where .mot-tab-indicator, .mot-skeleton and .mot-confetti are actually used. Apply the motion kit to remaining pages that lack it, then rerun overflow-check.
Save to review/phase1-followup.md and stop.
```

## OWNER TASKS (in parallel)
- Get from Nikhil: offer hours (listing says open 12 PM, note says 10-4); whole bill vs food only; Fri-Sun offer; scratch card digital or physical; legal name, GSTIN, FSSAI, registered address, email, Maps embed; WhatsApp number (919059670033 in code vs 98483 60033 in chats); brand story and founder photos; Craft Your Plate menu; package and add-on names and prices; tour captions and capacities; approval of section names.
- Shoot 360 photos per zone (Google Street View app, phone steady at chest height, day and night if possible); day and night banquet photos; clear multi-angle photos (front, 45 degrees, side, top) of the 3 hero dishes and the drinks counter.
- Check the dish-photo contact sheet by eye. Test on a real mid-range Android phone over Wi-Fi (`http://<PC-IP>:4321`).
- Commit to git after every step. Copy the project out of the `scratch` folder to a stable location.

## RESUME PROMPT (any new session)
```
Read HANDOFF.md and FURSAT_MASTER_BRIEF_v7.md. Do not deploy. Do STEP 0 (audit) from Part A section 1 and save review/audit-v7.md. Then stop and wait. After I reply, do only the next step in ORDER OF WORK, one step at a time.
```

---
---

# PART A: HANDOFF v5 (process, audit, what to build)

## 0. RULE ZERO FOR ANY NEW SESSION
**Do not build anything until you have audited what already exists.** A previous session may have built part of a phase before stopping. Rebuilding on top of it causes duplicates and broken pages. Run section 1 first and report. Then continue.

No deployment until the owner says so. Disable `deploy` and `deploy:login` scripts if still present.

---

## 1. AUDIT PROMPT (paste first, every new session)

```
Read HANDOFF.md, FURSAT_HANDOFF_v5.md and FURSAT_BUILD_PROMPT_2.md. Change nothing yet.
Report, in a table, what is ACTUALLY built on disk (not what the logs say):

A. Phase 1 (motion kit): for each item say BUILT / PARTIAL / MISSING and name the file:
   src/lib/motion.ts, public/js/motion-kit.js, SiteHeader scroll shrink/hide, MarqueeStrip.astro,
   ScrollStoryHome.astro, src/styles/motion.css, .mot-* classes applied to which pages,
   scripts/overflow-check.mjs, SplitText headlines, magnetic buttons, image reveals, confetti.
B. Tour: is there a PanoramicViewer or any tour component? Which library? Does public/tour/ exist? Is there src/data/tour.json?
C. Menu page: list the components in src/components/menu/. Which 3D tier does each dish use (GLB, procedural plate with photo, photo viewer)? Are there any .glb files in public/models/? Is a plain HTML menu rendered when WebGL is off?
D. EventPlanner: does it exist? On which pages? Which steps? Data files events.json, packages.json, addons.json?
E. Pages: list every route with BUILT / STUB. Explain the 14 routes vs the 12 planned.
F. Run npm.cmd run build and report pass/fail. Run scripts/overflow-check.mjs if it exists and report.
G. Search dist/ for "TODO" and list every hit on public pages.
H. Where is the offer-modal phone number stored? If nowhere, say so.
I. Videos in public: file, size, where used.

Save the table to review/audit-v5.md. Then STOP and wait. Do not fix or build.
```

---

## 2. WHAT STILL HAS TO BE BUILT (only the parts the audit shows as MISSING or PARTIAL)

### 2.1 Phase 1: motion kit (target list)
Page transitions with persistent header, kinetic headlines (SplitText, plain-text fallback), scroll storytelling (CSS scroll-driven animations plus GSAP pinned scene), magnetic buttons and cursor-lit cards (fine pointer only), leaf-cut image reveals, marquee strips, native smooth scroll (no Lenis), micro-interactions (tab indicator, counters, skeletons, confetti), pill header that shrinks, hides on scroll-down and returns on scroll-up.
Checks the owner will make:
1. Content visible with JavaScript off (H1 included).
2. Hidden header still reachable by keyboard (reappears on focus).
3. Effects re-initialise after view-transition navigation (`astro:page-load`).
4. `prefers-reduced-motion` disables pinned scenes, marquee, magnetic buttons, autoplay.
5. No horizontal scroll at 360/390/768/1024/1280/1536.
6. New classes carry component prefixes.

### 2.2 Phase 1B: flagship Home section "Step Inside Fursat" (virtual tour)
Goal: the client should feel they have stepped into a new world.
- Section copy (placeholder, owner to approve): eyebrow "Virtual tour", title **Step Inside Fursat**, sub "Café, bar and banquet. Look around before you arrive.", button **Enter the space**. Alternate titles: Come, Feel the Vibe / Walk Into Fursat / Take a Seat. Take a Look.
- Entrance: leaf-shaped clip-path portal expands from the button to fullscreen (GSAP). Esc/close reverses. Focus trap, aria labels, body scroll locked while open.
- Viewer: Photo Sphere Viewer (or Pannellum), loaded only when the section nears the viewport and only on Home. Drag, swipe, keyboard arrows, zoom, fullscreen, mobile gyroscope button (ask permission, never auto-enable).
- Zones: Restaurant & Bar, Café, Banquet, Events. Day/Night toggle only where both images exist. Each zone has a Reserve or Plan-an-event button.
- Hotspots: glowing pins (pulse only when visible, none with reduced motion) showing a caption card; door hotspots move to the next zone with a fade. Captions in `src/data/tour.json`, marked `TODO(client)`. Do not invent capacities.
- Optional ambient audio: off by default.
- Source images: the 19 interior photos are normal photos, not 360. Until real 360 images exist, use the compressed photos in a wide drag-pan viewer with gentle drift, labelled as photo view. A zone switches to true 360 automatically when `public/tour/<zone>-360.webp` exists.
- 360 files: WebP/AVIF 4096x2048, max 700 KB each, blurred 1024 placeholder first, preload only the active zone, pause when off-screen.
- Fallback: no WebGL, slow connection or reduced motion gets a swipeable gallery with the same captions.
- CSS prefix `tr-`.
- **Owner task:** shoot 360 photos per zone (Google Street View app, phone held steady at chest height in the middle of each zone, day and night if possible).

### 2.3 Phase 2: Menu page with real 3D
Layout: LEFT drinks counter, RIGHT table with 3 food models. Select a model and it expands (GSAP Flip) to about 3/4 of the screen with slow orbit and the menu panel for that category beside it. Close button, Esc, swipe-down on mobile. Deep links `/menu#drinks`, `/menu#biryani`. A plain HTML menu always renders below.
**Reality check:** one photo cannot become an accurate 3D model. Tiers, use the first that works per dish and report which:
- **A (target for 3 hero dishes + drinks counter):** real GLB made from the real photos with an image-to-3D tool (Meshy, Tripo, Luma, Polycam) or a multi-angle photo set.
- **B:** procedural domed plate with rim, shadow and the real photo as the food-top texture (current approach).
- **C:** swipeable photo viewer when no WebGL, low memory or reduced motion.
Performance: three.js and R3F only on `/menu`, loaded when the section is near the viewport; models lazy on first interaction with the photo as poster; each GLB under 2 MB (`npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp --texture-size 1024`); total 3D under 8 MB; cap pixel ratio at 2; pause off-screen; dispose on close; test with 4x CPU slowdown.
Craft Your Plate tab: choose dishes with counters, live summary, Send to WhatsApp. Content `TODO(client)`.
**Owner task:** clear photos of the 3 hero dishes and the drinks counter from several angles (front, 45 degrees, side, top).

### 2.4 Phase 3: EventPlanner (Banquet, Events, Catering, group Reserve)
One shared multi-step component, data-driven from `src/data/events.json`, `packages.json`, `addons.json`.
1. Choose event (big leaf-cut buttons): Birthday, Anniversary, Corporate, Kitty/Ladies Night, Bar Bash, Baby Shower, Farewell/Get-together, Engagement/Small function, Outdoor Catering. Choice changes accent colour, icon, copy, default guest range, suggested add-ons and menu preset.
2. Basics: date (no past dates), time slot, guests (slider + number), venue (Banquet/Restaurant section/Bar/Outdoor), indoor/outdoor.
3. Menu customisation: package tier (Classic/Premium/Royal, names and contents `TODO(client)`), diet (veg/non-veg/mixed with slider), cuisine chips, build-your-menu from `menu.json` by course with limits and real dish photos, set-menu preview, add-on toggles (live music, DJ, decor, cake, photographer, welcome drink, live counters, projector/mic), dietary notes, indicative cost (per person x guests, labelled indicative). Alcohol packages 21+ only, no pricing or discounts until the client confirms.
4. Contact and consent: name, +91 phone, optional email, preferred contact, consent linking to `/terms`.
5. Summary: Send on WhatsApp (prefilled with full summary and UTM), request call back, download summary. Also POST to the lead endpoint. If no backend exists yet, say so plainly and keep WhatsApp working.
Only known price: "from ₹925 per person". Everything else `TODO(client)`.

### 2.5 Phases 4 and 5
Finish all remaining pages with the motion kit, SEO (title, description, canonical, OG, Restaurant/Menu/Offer/FAQPage schema), WhatsApp CTAs with page-specific text. Then the verification report in `FURSAT_BUILD_PROMPT_2.md` Phase 5.

---

## 3. GLOBAL RULES (unchanged)
- CSS prefixes per component. No bare `.card/.pk/.hd`.
- Content visible by default. Animations use `from` values. Reduced-motion alternative everywhere. Animate transform, opacity, clip-path only.
- Never invent legal, price, offer or contact details. Use `TODO(client)` and `src/data/*.json`. Remove the suggested FSSAI number.
- Alignment: 8px grid, container max 1280px, 96px/64px section rhythm, no horizontal scroll, no stretched images. Overflow check must pass.
- Real photos where they exist, AI illustrations otherwise, "representative photo" note where a photo stands in for a dish type. Review `review/photo-map.html` for correct dish-photo matches.

## 4. OPEN CLIENT ITEMS (Nikhil)
Offer hours (listing says open 12 PM, note says 10-4); whole bill vs food only; Fri-Sun offer; scratch card digital or physical; legal name, GSTIN, FSSAI, registered address, email, Maps embed; WhatsApp number (919059670033 vs 98483 60033); brand story copy and founder photos; Craft Your Plate menu; package names and prices; add-on prices; tour captions and capacities; approve tour section title.

## 5. WORKFLOW
1. Paste the audit prompt (section 1). Wait for `review/audit-v5.md`.
2. Build only what the audit marks MISSING or PARTIAL, one phase at a time, logging to `scripts/phase-log.txt`.
3. After each phase: build, overflow check, screenshots at 360/390/768/1280 in `review/shots/`, Lighthouse mobile table. Stop and report.
4. Owner sends the zip (without `node_modules`, `dist`, `raw_assets`) and screenshots to the reviewer. Apply the fix list, then next phase.

## 6. RESUME PROMPT (copy into a new session)
```
Read HANDOFF.md, FURSAT_HANDOFF_v5.md and FURSAT_BUILD_PROMPT_2.md. Shell rules are in the handoff. Do not deploy.
Step 1: run the audit prompt in section 1 of FURSAT_HANDOFF_v5.md and save review/audit-v5.md. Stop and wait.
Step 2 (only after I reply): build only the items marked MISSING or PARTIAL, starting with the lowest-numbered phase, one phase at a time.
```


---
---

# PART B: BUILD PROMPT (feature detail, phases 1-5)


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


---
---

# PART C: MOBILE-FIRST WORLDS (wins on design and performance)


Use with `FURSAT_HANDOFF_v5.md` and `FURSAT_BUILD_PROMPT_2.md`. This file changes the design priority: **the phone is the primary product. Desktop is the enhanced version.**

---

## 1. PRINCIPLES

1. **Design the 390 px phone screen first**, then enhance upward. Every page is judged on a phone before a laptop.
2. **One codebase, two experiences.** Do NOT build a separate `m.` site (duplicate content hurts Google ranking). Instead the same page renders a phone layout and a desktop layout, and heavy features load only where the device can handle them.
3. **Each page has one signature "world"**, a distinct mood and one memorable interaction. Everything else on the page is calm and fast. Wow comes from one strong moment, not from effects everywhere.
4. **Thumb-first.** Primary actions sit in the lower half of the screen. Tap targets 48 px. Sheets and swipes, not tiny menus.
5. **Content must be visible and readable without effects.** Motion adds, never hides.

## 2. HOW "SEPARATE MOBILE RENDERING" WORKS (without a second site)

- **Art-directed images:** `<picture>` with a portrait 4:5 crop for phones and a wide crop for desktop. Phone widths 480/720, desktop 1200/1600. Never send a 1600 px image to a phone.
- **Islands load by device:** use Astro `client:media="(max-width: 767px)"` for phone-only widgets and `client:media="(min-width: 768px)"` for desktop-only ones, `client:visible` for anything below the fold. Do not ship both versions of a component in the HTML.
- **Capability gate** (`src/lib/device.ts`): a function returning `tier: "lite" | "full"` using `navigator.connection.saveData`, `effectiveType` (2g/3g = lite), `navigator.deviceMemory` (< 4 GB = lite), `hardwareConcurrency` (< 4 = lite) and `prefers-reduced-motion`. Lite tier: no 3D, no tour WebGL, no autoplay video, no parallax, static posters. Full tier: everything.
- **Video on phones:** poster image only; play on tap; never autoplay more than one muted loop; `preload="none"`.
- **3D and tour on phones:** load only after the user taps "Enter" or selects a model, never on page load.
- **CSS:** mobile styles are the base, desktop in `min-width` queries. Use `content-visibility: auto` on long below-the-fold sections.
- **Fonts:** max 2 families, 2-3 weights, subsetted woff2, `font-display: swap`, preload only above-the-fold ones.

## 3. MOBILE PERFORMANCE BUDGET (fails the phase if exceeded)
- First load (excluding the hero image): under 500 KB transferred. Hero image under 150 KB.
- JavaScript under 120 KB gzipped on pages without 3D. GSAP and three.js never in the shared bundle.
- LCP under 2.5 s on throttled "Slow 4G + 4x CPU" (Lighthouse mobile), INP under 200 ms, CLS under 0.1.
- Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100.
- No horizontal scroll at 360 / 390 / 412 px. Text at least 16 px. Contrast AA.
- Test on at least one real mid-range Android phone, not only the emulator.

## 4. PHONE INTERACTION VOCABULARY (use these instead of regular patterns)
- **Bottom sheets** for menu items, booking, filters, offers (drag handle, swipe down to close, focus trap).
- **Scroll-snap carousels** for dishes, spaces, reels (cards peek at the edge to signal swipe).
- **Story-style reels:** full-screen vertical, tap left/right, progress bars, one video playing, tap to unmute.
- **Sticky thumb bar** (Menu, Ask, Reserve, WhatsApp) plus a contextual primary button per page ("Reserve", "Plan event", "Add to plate").
- **Light haptics** on key taps via `navigator.vibrate(10)` where supported, off with reduced motion.
- **Pull-to-reveal** details, long-press previews only if discoverable. No hidden-only gestures for essential actions.

## 5. THE WORLD FOR EACH PAGE
Each has: mood, signature moment (phone version / desktop version), calm sections. All copy is placeholder until the owner approves.

| Page | World | Signature moment (phone) | Desktop upgrade |
|---|---|---|---|
| **Home** `/` | **The Doorway.** Arrival at Fursat | Tap the arched door: it opens into a vertical journey from morning to night as you scroll; the elephant mascot greets at the top | Parallax layers inside the arch, wave panels, pinned table-spread scene |
| **Home: Step Inside** | **Look Around** | "Enter the space" portal opens the 360 tour fullscreen with gyroscope look-around | Mouse-drag look-around, hotspots, zone switcher |
| **Menu** `/menu` | **The Table** | Tap a dish on the table: it rises into a rotating 3D plate in a bottom sheet with its menu | Split screen: drinks counter left, food table right, model expands to 3/4 |
| **Restaurant & Bar** | **After Dark.** Deep emerald and gold, glass cards | Swipe cocktail cards; a pour animation fills the glass as the card settles | Neon-gold hover glow, ambient light that follows the pointer |
| **Cafe** | **Golden Hour.** Warm cream, steam | Steam rises behind the hero cup; tap makes a coffee-ring ripple; horizontal swipe menu | Parallax cup and steam, hover drift on cards |
| **Banquet** | **The Grand Hall** | Slider: Day to Night. The hall relights as you drag; swipe seating layouts | Pinned scroll transformation, 3D or panorama of the hall |
| **Events** | **Moments** | Tap an event button (Birthday, Anniversary, Corporate...) and the whole page re-themes (colour, icon, copy, confetti) | Animated theme morph, richer gallery |
| **Outdoor Catering** | **We Come To You** | A path draws from Fursat across a Hyderabad skyline illustration (Charminar silhouette) to "your place" as you scroll | Wider illustrated scene with parallax |
| **Reserve** | **Your Table, Your Time** | Tactile ticket-stub slot picker; scratch card appears on confirmation | Same, with larger ticket layout |
| **Ask Fursat** | **Mood Kitchen** | Floating mood orbs; pick one and result cards fly in with real photos | Orbs react to the pointer |
| **Story** | **Fursat, the Luxury of Time** | Slow editorial scroll; the mascot walks along a timeline | Large type, side-by-side photo storytelling |
| **Terms / Order** | **Calm.** Plain and fast | None (no effects on legal or stub pages) | None |

Each page: at most ONE heavy effect. Everything else uses the shared motion kit from Phase 1.

## 6. PHONE LAYOUT STANDARDS
- 24 px side padding, 8 px grid, section rhythm 64 px phone / 96 px desktop.
- Hero fits the first screen with the primary button visible without scrolling at 360x640.
- Headlines 36-44 px phone, 72-120 px desktop, balanced wrapping, no orphans.
- Images keep their leaf-cut shape on phones, with aspect ratios fixed to avoid layout shift.
- Bottom thumb bar never covers content: add bottom padding equal to its height plus the safe area.
- Forms: one question per step on phones, native inputs (`inputmode`, `autocomplete`), 16 px+ text so iOS does not zoom.

## 7. PROMPT FOR ANTIGRAVITY (one page at a time)

```
Read FURSAT_MOBILE_FIRST_WORLDS.md fully. Mobile-first is the rule: design the 390 px screen first, then enhance for desktop. Do not change business data. No deployment.

STEP 1: foundations only
- Create src/lib/device.ts (tier lite/full per section 2).
- Convert image usage to <picture> with portrait 4:5 mobile crops and 480/720 widths.
- Move heavy JS (GSAP scenes, three.js, tour) behind client:visible / client:media or the tier check.
- Add the mobile performance budget to a script scripts/mobile-budget.mjs that measures transferred bytes and JS size per page and fails above the limits in section 3.
- Report current numbers per page (before changes), then after. Stop.

Then, ONE PAGE PER MESSAGE (I will say which): build that page's "world" per the table in section 5, phone version first, then desktop. For each page: screenshots at 360, 390, 412, 768, 1280; run overflow-check and mobile-budget; Lighthouse mobile; JS-off and reduced-motion screenshots. List anything that could not be done. Stop and wait.
```

## 8. OWNER TASKS
- Test on a real phone over Wi-Fi (`http://<PC-IP>:4321`).
- Shoot 360 photos per zone, plus clear multi-angle photos of 3 hero dishes and the drinks counter.
- Day and night photos of the banquet hall if possible (for the Day to Night slider).
- Approve the world names and copy.

---
---

# PART D: RUNNING SESSIONS FROM YOUR PHONE (for the owner, not for the build)

There is no Antigravity phone app that I know of. Practical options:
1. **Remote desktop:** Chrome Remote Desktop (free, remotedesktop.google.com/access) on the PC plus the phone app; or AnyDesk. Lets you read replies, send messages and press Allow on permission prompts. A session left alone stalls on prompts such as "Allow list directory?".
2. **Keep the PC awake and plugged in:** Settings > System > Power > Screen and Sleep = Never while a session runs.
3. **Preview on your phone:** `http://<PC-IP>:4321` on the same Wi-Fi (find the IP with `ipconfig`; it can change). This is also the real mobile test.
4. **Review code from the phone via GitHub:** have the session commit and push to a PRIVATE repo after each step; read changes in the GitHub mobile app. Never push `raw_assets`, `node_modules` or secrets.
5. **Review with Claude:** phone screenshots of the preview plus `scripts/phase-log.txt`, or a zip (without `node_modules`, `dist`, `raw_assets`, videos, .glb).
6. **Permissions:** allow safe read-only commands and builds. Do not "always allow" delete, deploy or anything outside the project folder.
7. **Model choice:** if Claude quota is used up, Gemini 3.8 Flash can read screenshots and suits simpler pages and routine fixes; GPT-OSS is text-only as far as I know (scripts, JSON, schema). Keep the 3D menu, tour, event planner and final review for the strongest model. With smaller models send one numbered item at a time and require a build plus overflow check after each.
