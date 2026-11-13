# FURSAT v4 hybrid build: About, Café, Restaurant & Bar, Party, Reserve

**Replaces the earlier P0 / P3 / P5 / P6 zips.** One push, from commit 45a204c.

## Method (all 5 pages, same system)
- Your textless ChatGPT backgrounds carry the carved plaster, gold ribbons, green bands, plates and rings.
  `scripts/prep-bg.py` upscales them (2048 desktop / 1080 phone), erases the empty card outlines, stretches plain bands for text, slices them where live content must grow, and **traces every dark frame** → photos are clipped exactly inside the gold lips (`HyWindows.astro`).
- Live HTML on top, positioned in stage units (1/1000 of the width), so it scales with the art at every width. Phone uses its own tall art below 768px (Reserve: below 1180px).
- Content and logic unchanged: booking flow + WhatsApp message tested, party planner tested (26 × ₹925 = ₹24,050), all FAQs, prices, packages kept.
- Header: cream "plaster" variant on all 5 pages. Master cream #F8EAD8.

## Motion (src/scripts/fk-motion.ts) — Anime.js v4 + Motion
- Anime.js: hero timeline, headline word-rise stagger, gold ornament line-draw, price count-up, staggered ring/plate/card pop-in.
- Motion: in-view reveals, scroll parallax of every photo inside its frame, spring 3D tilt on cards and plates (mouse only).
- Off under reduced motion; safety timers so content can never stay hidden.

## Check vs mocks
| Page | Desktop | Phone | Notes |
|---|---|---|---|
| About | Yes | Yes | Real photos (daylight) |
| Café | Yes | Yes | Satin gold ribbon over hero |
| Restaurant & Bar | Yes | Yes | Real bar + dish photos |
| Party | Yes | Yes | Live package cards (tabs 4/2/5) sit in the plain band; "Why Choose" plates + quote added (your OK) |
| Reserve | Yes | Yes | Form auto-fits the cream blob (zoom ≤1) on desktop; blob stretches on phone/tablet |

## v4.1 — Party fix
- Clean middle band (no streaks), plaster texture, cards always in one row (equal height, button pinned at the bottom), a different real photo on each card.
- Planner left (sticky on desktop), dishes + add-ons right, proper padding on the accordions.
- Phone: intro moved clear of the gold lip, closing line clear of the band edge.
- Re-tested: tabs, Plan this party, stepper, WhatsApp link (Elite ₹1,499 × 26 = ₹38,974).

## Before pushing
1. `npm install` (adds **animejs**) — required.
2. `npm run build` → must say 14 page(s) built. (Not run here: no network in this workspace; pages were rendered from the real .astro files and checked in Chromium.)
3. Open /story, /cafe, /restaurant-bar, /party, /reserve at desktop and phone and check the motion once.

TODO(client): founder line · FSSAI/GSTIN · evening photos · confirm café/cocktail prices.

## v4.2 — uniform card shape
One shared `.fk-card` (fk-tokens.css): cream card, thin gold edge, photo with wave cut on the right, round icon badge, serif title, price/label bottom-left, round green button bottom-right.
Applied to: Café + Restaurant & Bar cards (cocktails now use real bar photos), Party package cards, Reserve "Experiences" and "More at Fursat".
Logic kept: Party `data-plan` (planner fills, tested), Reserve `data-xp` presets (sets occasion, tested), Private → /banquet link. No page errors.
See cards-uniform-1440.jpg / cards-uniform-390.jpg.

## v4.3 — gold glow layer (all 5 pages)
Gold light = "selected / main action", tuned for the cream background.
- Header (all pages): Reserve pill gets a gold rim, a slow breathing halo and a one-time shine sweep; the active nav link glows.
- Reserve panel (matches the booking reference): calendar icon heading "Book Your Experience" + italic line + gold rule; Quick/Concierge/Pick pill, selected date, time and seating glow gold; guest dots glow; amber glowing "Request a Table" with calendar icon and arrow; gold rim on the summary ticket; gold focus glow on inputs.
- Party: selected tab glows gold; "Send this plan on WhatsApp" is the same amber glow CTA; total glows.
- Every page: green buttons get a gold rim + hover glow and shine; cards glow gold on hover; icon badges and "+" buttons have a soft halo; headings have a faint warm light.
- Kept honest copy (no "instant confirmation" — it stays "not confirmed until we reply").
- Reduced motion: halo and shine are off. Logic retested: Reserve submit (WhatsApp format unchanged, done screen), presets, Party planner. No page errors.

## v4.4 — colour roles (replaces the v4.3 all-gold glow)
- Green = main action: Request a Table, Send this plan on WhatsApp, the header Reserve pill, "+" buttons. Gold rim; light sweep only on green.
- Gold = selected state + edges: Quick tab, date, time, seating, Party tab. Crisp darker-gold edge + soft shadow, no glow on cream.
- Brown #74501a = small gold-toned text. Amber removed. Heading glow removed.
- All in fk-tokens.css as --fk-action-*, --fk-selected-*, --fk-edge, --fk-icon-gold, --fk-text-gold, --fk-focus.
Measured contrast (all pass): selected text on gold 7.96–11.4; selected edge on cream 3.46; gold icon on cream 3.95; gold text 6.11; focus ring on cream 5.0; cream on green 8.4–12.7; green button on cream 11.8.
Logic retested: Reserve preset (Birthday), submit → WhatsApp format unchanged, done screen; Party planner. No page errors on all 5 pages.

## v4.5 — typography, clarity, motion
**Type (better-typography audit, computed on all 5 pages at 1440 + 390):**
- Fonts: 3 → 2. Playfair Display (serif) + Poppins (sans). Manrope removed from Party, header dropdown, mobile bar (502 uses → 0).
- One type scale in fk-tokens.css: --fk-t-h2 / h3 / faq / price / body / small / label. Section titles, card titles, prices, FAQ, labels on every page now use it (were 43–55px, 19.8 vs 21.6px, 17.3 vs 20.8px…).
- Titles never smaller than body: Story phone values 12 → 14px, Café/Bar phone pillars 12.5 → 14px.
- 12px floor for labels (were 9.9–11px): time "10% off", ticket labels, card tags, kickers, mobile bar. Date weekday 11.5px to fit 68px chips.
- Tabular numbers on prices, totals, guest count, times. Balanced headings, pretty paragraphs, root antialiasing.
**Clarity:** FAQ answers capped at 68ch (were 85). Party section title fixed for word animation.
**Motion (Anime.js + Motion, keyed off shared classes, no markup changes):** masked word rise on section titles; photo frames settle from deeper zoom + darker tone; magnetic green buttons (spring); cream spotlight on cards; gold scroll-progress hairline under the header; native page-to-page view transitions (header stays put).
Tested with stand-ins for Anime.js/Motion (not installed here): no errors, words split, progress bar, frames settle. Real easing runs after `npm install`.
Logic: Reserve preset + submit (WhatsApp format unchanged, done screen), Party planner — pass at 1440 and 390. No page errors.
Note: the blank area under Party in full-page shots is my renderer's CSS order (07.css vs 10.css); the real build scrolls normally.

## v4.6 — remaining pages + wiring (deployment set)
**Wiring fixed:** header now links /party (Celebrate menu + phone menu, active state); "Bar menu" link → /restaurant-bar#cocktails (was a dead #bar-menu); footer adds Reserve, Our Story, Party Packages and fixes /events#birthday; /parties (old standalone estimate with sample prices) → 301 to /party via public/_redirects, page + parties.js removed, llms.txt updated.
**Restyled to the cream system (content, forms and logic untouched; class names kept):** Banquet, Events, Catering, Order, Terms (dark → cream by colour role), Ask (fonts + master cream). All use the cream header, shared tokens, Playfair + Poppins, green main buttons, gold edges, cream veils over hero photos. Footer and phone bottom bar moved to the brand forest green with a gold hairline (applies site-wide).
**Bug fixed (was live):** Banquet and Catering enquiry forms opened WhatsApp with an empty message (no handler, no field names). New src/scripts/wa-form.ts: required fields checked first, then a labelled message ("Full Name: …, Guest Count: …"). Catering labels now linked to their fields (accessibility).
**Removed:** Newsreader font (Ask) — @font-face, preload and the two font files.
**Checks (all 11 built pages, 1440 + 390):** fonts = Playfair + Poppins only; no page errors; no horizontal overflow; no stale links; Reserve, Party, Banquet, Catering, Ask logic pass.
**Still to do with images:** Banquet / Events / Catering hero art (prompts in project doc fursat-banquet-bg-prompts.md). Home and Menu not touched.

## v4.7 — fit to screen on desktop
Cause: the desktop art is tall and scaled by width only, so on wide-short screens (1366×768 laptops ≈ 1350×650 visible) the hero ran below the fold.
- Stage width = screen width, capped at 1.5 × screen height, never under 980px (Reserve 1300px so its form stays readable). Same rule on every page; the header scales with the stage. The stage carries its cream into the side gutters, edges softened. Phones/tablets unchanged.
- Café/Bar hero text block tightened (starts 160u, 3-line lead) → hero buttons now inside the first screen on every desktop size tested (1024×700, 1280×720, 1348×640, 1536×740, 1440×900, 1920×950, 2560×1300).
- Reserve: fixed an old bug — the form-fit zoom was applied to the positioned frame, which also scaled its left offset and slid the panel over the headline. Zoom now applies inside the frame; panel sits exactly in the art's cream blob at every size; form 86–94% (was ~80%). Reserve layout now switches by the stage's own width (container queries, 980px), not the screen's.
- Short screens: header items stay on one line (Phase 2 pill hidden there).
Checks: logic (Reserve, Party), no errors, no overflow, phones unchanged, header on one line — 5 pages × 6 screen sizes.

## v4.8 — phone pass (11 pages × 360 / 390 / 414, measured)
Fixed: Banquet + Catering form fields ran 2px past the screen (inputs now border-box) · header WhatsApp + menu buttons 38 → 44px (all pages) · Ask: carousel buttons 44px and no longer shrink, dots hidden on phones (Previous/Next/Pause do the job; they could not fit at a usable size), "from" price label 9 → 12px, Food tab 44px wide · Order: "Order via WhatsApp" above the bottom bar on 360px phones.
Verified: no sideways overflow, no text under 12px (allowed: Reserve weekday chip 11.5px), all taps ≥44px (Ask dots 24px on tablets = WCAG AA minimum), inputs ≥16px (no iPhone zoom), headings clear of the header, hero buttons above the bottom bar, room for the bottom bar at page end, no errors. Logic (Reserve, Party, forms, Ask) and desktop regression (11 pages × 6 sizes) pass.

## v4.9 — launch-ready extras that need nothing from the owner
- **Live "Open now" badge** (header on screens ≥1400px wide and in the phone menu): computed in India time from site.json hours, handles the after-midnight close (Fri–Sat 1 AM). Tested 7 cases with the browser set to New York time: all correct. Hidden if JavaScript is off.
- **Time-of-day mood** (India time): soft fresh light in the morning, warm dusk from 5 pm, over the hero art only (fades out before the cards; text untouched).
- **Google FAQ rich results**: FAQPage structured data on Café and Restaurant & Bar, generated from the questions on the page (3 each, parsed OK).
- Checked and already fine (no change needed): canonical URLs on all 13 pages; share images + Restaurant structured data in the layout; the 3D code only downloads when the panorama starts (Reserve: only after tapping "Pick your spot").
Full checklist rerun: phone (11 pages × 3 sizes), desktop (11 × 7 sizes incl. 1366×768 and 2560), logic — all pass.

## v5.0 — side margins removed (owner decision)
- v4.7's width cap (stage = 1.5 × screen height, plaster margins at the sides) is removed: every page is full width again.
- Kept: Reserve panel drift fix (zoom inside the frame), tighter Café/Bar hero, header on one line (narrow desktops), all v4.8 phone fixes, v4.9 open badge / mood / FAQ data.
- Fixed: button text could be clipped (the shine effect hides overflow, and a squeezed button cut its label: "xplore our packages"). Buttons no longer shrink; hero button rows wrap if needed.
- Reserve switches to the desktop layout at a 1180px stage again (as before v4.7).
Checked: 11 pages × 8 sizes (incl. owner's 1366×634): full width, no clipped buttons, header one line, Reserve headline clear, no overflow, no errors; phone and logic pass.
Known trade-off: the desktop art is tall, so at full width on 1366×768 laptops the hero buttons sit just below the first screen. The only fix without side margins is wide (16:9) hero art per page.

## v5.1 — first screen complete on desktop, full width (final)
- Party: the owner's hero image widened by stretching only its plain plaster band (text side); photo frames, gold and leaves untouched. Hero 650u → 476u tall, headline on 2 lines, content below moved up to match. New files: party-deskw-0.webp (+ shade), scripts/bg-specs/party-deskw.out.json. Phone unchanged.
- Café + Restaurant & Bar: art cannot be widened cleanly (hero flows into the ring band), so the hero text starts under the header and the title runs on 2 lines; text column stays clear of the photo frame.
- Story already fit; Reserve unchanged (its form is taller than a laptop screen at a readable size).
Checked at 1366×634 (owner), 1280×720, 1024×700, 1536×740, 1440×900, 1920×950, 2560×1300: full width, first screen complete on Story / Café / Bar / Party, no clipped buttons, header one line, Reserve clear, no overflow, no errors. Phone (11 pages × 3 sizes) and logic pass.

## v5.2 — Reserve: complete booking on the first screen (desktop + phone)
- Desktop (≥1180px stage): owner's Reserve art widened by stretching the plain middle of the cream panel (reserve-deskw-0.webp + shade, scripts/bg-specs/reserve-deskw.out.json). Top section 800u → 465u (= 635px at 1366 wide). Form in two columns inside the cream panel: heading | booking style; date + time | guests, occasion, seating, name, mobile; note | Request a Table. Hero text compact on the photo; decorative ticket + perks strip hidden here. Form shown at 99% (1366×634) to 100%.
- Phone (≤767px): photo hero hidden on Reserve only; form as a cream card under the header; times and seating swipe in one row; guests|occasion and name|mobile side by side; ticket, perks and guest dots hidden; subtitle hidden on narrow/short phones. "Request a Table" above the bottom bar on 360, 375, 390, 414 wide phones (iPhone SE 375×667 needs a 78px scroll). Inputs stay 16px; taps ≥44px.
- Tablet (768–1179) unchanged.
- Card "+" buttons 42 → 44px (all pages).
Checked: Reserve logic at 1366, 1920, 1024, 768, 390, 360 (swipe-row time pick, Concierge tab, Birthday preset, WhatsApp message includes the chosen time, done screen); desktop 11 pages × 7 sizes; phone 11 pages × 3 sizes; Party/Banquet/Catering/Ask logic. No errors.

## v5.3 — route wiring audit + final review
- Audited every internal link and anchor on all 11 built pages (+ Home and Menu headers/footers): 691 OK. Fixed: Events "Anniversaries" chip pointed to a missing #anniversary → now the shared Birthdays & Anniversaries card (#birthday, same as the footer). Events "Book a Birthday Event" and "Host a Bar Bash" now open /party (the birthday and bar-party packages with the price planner) instead of the banquet hall form; corporate and kitty stay on the banquet enquiry.
- Every button/link on the built pages has a target (no dead controls). Main buttons per page checked against their labels.
- Known, left as is: Home's "#spaces"/"#banquets" links open overlays by script (only break without JavaScript); Home is due for its rebuild.
- Café/Bar: tested widening the art like Party/Reserve (stretch and texture-repeat): both damage the green feature band (smear, broken gold edge), so not shipped. Their hero already fits the first screen; a more compact Café/Bar needs one wide hero image (prompt #2 in project doc fursat-wide-hero-prompts.md).

## v5.4 — invisible text fixes, contrast scan, page weight
- Party "Choose your dishes": menus opened but the dish names were pale cream on cream (old dark-theme colour) → dark text, brown group labels.
- Banquet "Send Enquiry via WhatsApp" and Catering "Request Catering Proposal": button had no background (colour script nested a gradient inside a gradient) → green main-action button again.
- New automated contrast scan on all 11 pages (1366 + 390): header active link 3.8 → 5.1:1; hero highlight words (Story / Café / Bar / Party) 2.7 → 3.7:1. Remaining flags are text on dark art images (the scan cannot see images; visually readable).
- Page weight: 36 used photos re-saved at web size (same filenames, nothing in code changed): 128 MB → 12 MB, then interior photos 1280px wide. Images loaded on opening (1366×634): Catering 3.0 → 1.2 MB, Events 2.8 → 0.6 MB, Café 2.3 → 1.3 MB, Order 0.7 → 0.3 MB; every built page ≤ 1.4 MB. Footer logo + Events photos now lazy-load (no page loads below-the-fold images early).
- Unreferenced original camera photos left untouched (photo tools may need them).
Known next clean-up: ~180 KB of old shared CSS (07.css etc., mostly the old Home page) still loads on every page; split it when Home is rebuilt.
Checks: phone 11 × 3 sizes, desktop 11 × 4 sizes (first screen, overflow, clipped buttons), logic (Reserve, Party, forms, Ask): all pass.
