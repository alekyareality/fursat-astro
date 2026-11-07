# Reference Design Layout Conversion Plan: Fursat Kitchen | Bar

> **Status:** REVISED & CORRECTED (Step 0)  
> **Target Branch:** `design/reference-layout` (branched from `integration/dev-port`)  
> **Source Material:** `raw_assets/reference_design/` (4 design reference images, Cinder & Dew editorial cafe/bar system)  
> **Scope:** Convert every route in `src/pages` to the reference layout **EXCEPT** `/` (home) and `/ask`.

---

## 0. Governing Design & Content Rules

1. **Reference Scope:** Layout structure, grid geometry, spacing scale, card/button shapes, and color tokens are drawn exclusively from the reference mockups (`raw_assets/reference_design/`).
2. **Zero Reference Copy Bleed:** NEVER copy reference text, sample prices (`$5.25`, `$28.00`), sample hours (`7:00 AM – 6:00 PM`), or sample locations (`123 Orchard Lane, Portland, OR`). All copy, operating hours (`12:00 PM – 11:30 PM`), address (`Level 3, Capital Park Building, Image Gardens Road, VIP Hills, Silicon Valley, Madhapur, Hyderabad 500081`), phone numbers (`+91 90596 70033`, `+91 98483 60033`), and dish/pricing details come strictly from Fursat.
3. **Omission Rule:** Any section in the reference design that does not have genuine Fursat content or an authenticated real photo must be omitted (e.g., the "Meet the Makers" team card is omitted because no staff portrait exists in inventory).
4. **Photo Integrity:** Only real photos verified by sight in `public/assets/` are permitted.
   - **Allowed food photos:** ONLY `angaraa_chicken_tikka_`, `karvepaku_kodi_vepudu`, `jamicon_jerk_chicken_with_fires`, `tandoori_prawns_`, `onion_rings`, `kothimiru_panner_vepudu`, `lotus_biscoff_`.
   - **Banned dish photos:** NEVER use `dsc05389`, `dsc08946`, `fursat_`, `fursat_1_`, `pandu_mirchi_kodi_kebab` as dishes.
   - Any unverified photo slot must be downgraded to `TODO(client)`.
5. **No Visual Quality Claims:** Never claim subjective visual results; request an owner phone check at designated quality gates.

---

## 1. Route Section Inventory (`src/pages`)

Every route currently in `src/pages` with its existing section-by-section breakdown (14 total routes):

### Route 1: `/` (`src/pages/index.astro`) — **DO NOT TOUCH**
1. Hero header with full-screen video background, interactive sound toggle & reservation button (`<Hero />`)
2. Interactive table platter drift & contact shadow canvas (`<TableSpread />`)
3. Lunch promotional offer strip with coupon code (`.hm-offer-strip`)
4. Velocity skewed kinetic marquee ticker strip (`<MarqueeStrip />`)
5. Five venue spaces enclave cards grid (`.hm-spaces`)
6. Day & evening ambience curtain lighting comparison slider (`<DayNightSlider />`)
7. Panoramic 360-degree virtual space tour viewer (`<PanoramicViewer />`)
8. Reels right-to-left drift video showcase (`<Reels />`)
9. Mascot gold foil tilt & interactive scratch offer card (`<Mascot />`)
10. Guest reviews testimonial grid (`.hm-reviews`)
11. Global footer & sticky mobile bottom navigation bar (`<SiteFooter />`, `<MobileBar />`)

### Route 2: `/ask` (`src/pages/ask.astro`) — **DO NOT TOUCH**
1. Ask Fursat hero banner with mascot on counter & script typography (`.as-hero`)
2. Voice & text mood companion search interface with quick mood pills (`.ac`, `#ask-fursat`)
3. Dynamic dish & drink recommendation results grid (`#as-results`, `.rs`)
4. Ambient background audio controller & mascot sparkles modal
5. Global footer & mobile navigation bar

### Route 3: `/banquet` (`src/pages/banquet.astro`)
1. Hero header with responsive picture background & dual gold/ghost CTA buttons (`.bq-hero`)
2. Venue capacity & technical specifications stats bar (`.bq-specs`)
3. Three-column banquet floor, dining & bar ambiance photo gallery (`.bq-gallery`)
4. All-inclusive tiered banquet packages grid (Silver, Gold, Platinum) (`.bq-packages`)
5. Date check & banquet booking enquiry form card (`.bq-enquiry`)
6. Banquet policies & booking FAQs accordion list (`.bq-faq`)

### Route 4: `/cafe` (`src/pages/cafe.astro`)
1. Split hero with headline, copy, dual buttons & morphing wave photo frame (`.cf-hero`)
2. Four quality & ritual pillars icon card grid (`.cf-pillars`)
3. Favorites from the counter menu cards grid with bestseller badges & prices (`.cf-menu-sec`)
4. Asymmetric three-photo atmosphere & natural light gallery (`.cf-ambiance`)
5. Remote work & operating hours FAQs accordion list (`.cf-faq`)

### Route 5: `/catering` (`src/pages/catering.astro`)
1. Full-width hero banner with dark scrim overlay & phone CTA buttons (`.ct-hero`)
2. Four live counter & buffet setup capability cards (`.ct-services`)
3. Catering guest scale & capacity metric cards (`.ct-scale`)
4. Horizontal scroll photo gallery strip of interior spaces (`.ct-gallery-strip`)
5. Outdoor catering quotation request form card (`.ct-quote`)

### Route 6: `/events` (`src/pages/events.astro`)
1. Celebration hero header with quick occasion anchor tabs (`.ev-hero`)
2. Four alternating occasion showcase cards (Birthdays, Corporate, Kitty Parties, Bar Bashes) (`.ev-occasions`)
3. Direct WhatsApp event concierge booking CTA banner (`.ev-cta`)

### Route 7: `/menu` (`src/pages/menu.astro`)
1. Hero header with breadcrumb eyebrow, headline & dish count (`.mn-hero`)
2. Food vs. Drinks proportion switch toggle bar (3/4 vs. 1/4 screen) (`.mn-switch-wrap`)
3. Food Pane: Dish showcase carousel with select dropdown & controls (`#pane-food`, `.mn-dish-showcase`)
4. Food Pane: Horizontal category filter tabs rail (`.mn-tabs--food`)
5. Food Pane: Multi-column food items grid with dietary indicators & prices (`#mn-grid-food`)
6. Drinks Pane: Fursat bar counter parallax scene with 3D GLB hook (`#mn-bar-scene`)
7. Drinks Pane: Bar counter category tabs rail (`.mn-tabs--drinks`)
8. Drinks Pane: Multi-column drinks cards grid with portion prices (30ml/bottle/glass) (`#mn-grid-drinks`)
9. Bottom 15% discount table reservation CTA banner (`.mn-cta-wrap`)

### Route 8: `/order` (`src/pages/order.astro`)
1. Centered hero banner with dark blurred glass background (`.od-hero`)
2. Takeaway ordering card with "Online ordering is coming soon" notice (`.od-card`)
3. Direct WhatsApp kitchen ordering CTA button & full menu browsing link (`.od-actions`)

### Route 9: `/parties` (`src/pages/parties.astro`)
1. Hero section with floating baby elephant mascot, script eyebrow & occasion chips (`.pp-hero`)
2. Interactive guest count range slider panel with dynamic price ribbon (`.pp-panel`)
3. Three-dimensional party package selection cards with conic gradient border glow (`.pp-cards`)
4. Fixed floating bottom glass summary dock with running estimate & WhatsApp booking link (`.pp-sum`)

### Route 10: `/party` (`src/pages/party.astro`)
1. Top bar with back-to-home navigation link (`.pa-top`)
2. Animated mascot stage with reactive idle & cheer poses (`.pa-host`)
3. Package group category filter tabs (`.pa-tabs`)
4. Horizontal snap carousel of arched package cards with breakdown details (`.pk-row`)
5. Interactive party estimation calculator with guest stepper & 3D stage canvas (`.pa-plan`)
6. Multi-course dish selection accordion menus (`.pa-choices`)
7. Menu add-ons list with fixed pricing (`.pa-add`)

### Route 11: `/reserve` (`src/pages/reserve.astro`)
1. Hero banner with confirmation badges & dark background image (`.rs-hero`)
2. Two-column body layout: Left reservation form box (guest selector, date picker, lunch/dinner slot chips, contact inputs) (`.rs-form-box`)
3. Two-column body layout: Right sidebar digital scratch card reward reveal widget (`.rs-scratch-card`)
4. Two-column body layout: Right sidebar venue preview card with rating & address (`.rs-preview-card`)

### Route 12: `/restaurant-bar` (`src/pages/restaurant-bar.astro`)
1. Hero banner with dark radial vignette, headline & dual CTA buttons (`.rb-hero`)
2. Artisanal mixology 21+ signature drinks cards grid with prices (`.rb-highlights`)
3. Royal Tandoor charcoal kitchen split section with signature dish list & four-photo gallery (`.rb-kitchen`)
4. Live acoustic & Sufi evenings weekend highlight box (`.rb-live`)
5. Restaurant & bar frequently asked questions accordion (`.rb-faq`)

### Route 13: `/story` (`src/pages/story.astro`)
1. Centered brand essence hero with italicized Fursat philosophy definition (`.st-hero`)
2. Two-column split narrative: heritage dining photo + unhurried hospitality story & quote box (`.st-narrative`)
3. Three pillars of craft numeric cards grid (Patience, Ingredients, Spaces) (`.st-values`)
4. Asymmetric corner-rounded interior gallery scroll strip (`.st-gallery`)
5. Official business registration, address & FSSAI legal disclosure box (`.st-legal`)

### Route 14: `/terms` (`src/pages/terms.astro`)
1. Document header with legal kicker & last-updated date (`.tr-title`, `.tr-updated`)
2. Section 1: Promotional offer terms & exclusions (Code: FURSAT15) (`.tr-section`)
3. Section 2: House rules & age 21+ admission policy (`.tr-section`)
4. Section 3: Privacy policy & customer data handling (`.tr-section`)
5. Section 4: Reservation & banquet cancellation policies (`.tr-section`)
6. General Manager contact & communication box (`.tr-contact-box`)

---

## 2. Reference Image Analysis & Sharp Measured Coordinates

Measured directly with `sharp` from raw image buffers in `raw_assets/reference_design/`:

### Image 1: `WhatsApp Image 2026-11-04 at 23.14.33 (1).jpeg` (720 x 1600)
- **Top Navigation Bar:**
  - Layout: Single row flex, centered brand name `"CINDER & DEW"` with interlocking loop logo glyph (`&`), nav links: `"Menu"`, `"Story"` (active with subtle curved underline), `"Rituals"`, `"Visit"`, `"Journal"`. Right: pill CTA button `"Reserve a Table"`.
  - Sampled: Reserve Button Olive: `x=650, y=235` -> `#1E201B`
- **Section 1: Hero Split ("Where Ritual Meets the Everyday.")**
  - Grid: 2 columns asymmetric (text left ~46%, image right ~54%).
  - Left column:
    - Headline: Display serif, ~48px font size, line-height 1.08, weight 500. Leaf flourish icon beside headline.
    - Sampled: Canvas background (top-left): `x=60, y=260` -> `#E4DCCF`
    - Sampled: Headline text color: `x=120, y=305` -> `#CCC9B6`
  - Right column:
    - Organic fluid wave/blob cut-out window frame (`border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%`). Photo shows barista pouring pour-over coffee.
- **Section 2: Quality Pillars ("Rooted in Quality. Guided by Ritual.")**
  - Section Header: Centered, flanked by symmetrical leaf flourishes, ~26px serif.
  - Container Card: Large elevated squircle surface, border-radius 36px, shadow `0 12px 32px rgba(36,45,28,0.06)`.
    - Sampled: Pillars container card cream: `x=360, y=600` -> `#E7E0CE`
  - Grid: 4 columns equal width, gap 16px. Four cards with top photo, circular badge icon top-left, serif title, and short caption.
- **Section 3: Process Stepper ("Our Ritual, Step by Step")**
  - Layout: 4 horizontal step units connected by thin horizontal arrows/lines: 01 Source -> 02 Roast -> 03 Pour -> 04 Share.
    - Sampled: Step connecting line: `x=310, y=840` -> `#D6CFBD`
- **Section 4: Bottom Split Cards**
  - Left Card: Dark forest olive surface, border-radius 24px, padding 28px. Serif quote: *"We believe the best moments aren’t rushed..."* with attribution.
    - Sampled: Dark quote card background: `x=202, y=980` -> `#4A4527`
  - Right Card: "Meet the Makers" staff card. **OMITTED** for Fursat per Rule 3 (no real staff photo exists).

### Image 2: `WhatsApp Image 2026-11-04 at 23.14.33.jpeg` (720 x 1600)
- **Section 1: Hero & Reservation Split ("Plan Your Visit")**
  - Grid: 2 columns asymmetric (left image frame ~45%, right form card ~55%).
  - Left: Arched organic wave window frame showing sunlit dining room with long wooden table.
  - Right:
    - Headline: `"Plan Your Visit"` (~46px serif) + leaf flourish.
    - Floating Reservation Form Card: Elevated cream surface, border-radius 28px, padding 28px.
      - Sampled: Form card cream surface: `x=600, y=480` -> `#DAD2C5`
      - Sampled: Form input border: `x=550, y=440` -> `#E8E2D4`
      - Sampled: "Reserve a Table" button olive: `x=500, y=530` -> `#393D1A`
- **Section 2: Three Feature Cards**
  - Grid: 3 equal columns, gap 20px. Rounded top corners (~20px), scooped bottom corners.
    - Sampled: Feature card cream surface: `x=200, y=770` -> `#E1DACA`
- **Section 3: Bottom Location, Hours & Map Card**
  - Container: Large squircle card, border-radius 32px, padding 32px.
    - Sampled: Bottom contact card surface: `x=360, y=960` -> `#DAD3C1`
    - Sampled: Map green pin: `x=435, y=920` -> `#363312`
    - Sampled: Map land beige: `x=480, y=920` -> `#E5DAC8`

### Image 3: `WhatsApp Image 2026-11-04 at 23.14.34 (1).jpeg` (720 x 1600)
- **Section 1: Hero ("Seasonal Sips & Slow Bakes.")**
  - Grid: 2 columns asymmetric (text left ~45%, image right ~55%).
    - Sampled: Canvas cream background: `x=60, y=260` -> `#D7CCB9`
- **Section 2: Category Filter Rail**
  - Layout: Horizontal pill button bar, centered.
    - Sampled: Active tab "Coffee" olive: `x=90, y=548` -> `#3B3A1B`
    - Sampled: Inactive tab cream: `x=270, y=555` -> `#D3CBBE`
- **Section 3: Product Grid (4 Columns Equal)**
  - Rounded top photos with overlaid circular icon pill, title, description, price, circle plus button `(+)`.
    - Sampled: Product card cream surface: `x=150, y=730` -> `#E1D9CC`
- **Section 4: Chef's Seasonal Tray & Bottom Banner**
  - Sampled: Chef Seasonal Tray dark olive card: `x=200, y=840` -> `#827553`
  - Sampled: Bottom purpose banner cream: `x=360, y=1035` -> `#D9D1BE`

### Image 4: `WhatsApp Image 2026-11-04 at 23.14.34.jpeg` (1024 x 1536)
- **Hero Split & Ask Companion Card:**
  - Sampled: Canvas cream background: `x=100, y=100` -> `#EEE9D5`
  - Sampled: Dark green wave curve backdrop: `x=172, y=230` -> `#19331A`
  - Sampled: Headline dark text ("What are you in the mood for?"): `x=184, y=140` -> `#34311E`
  - Sampled: Search card cream surface: `x=300, y=350` -> `#F4EDDD`
  - Sampled: Search arrow button terracotta/ochre: `x=780, y=414` -> `#C8824E`
  - Sampled: Pick card cream surface: `x=108, y=1150` -> `#F7F4E3`
  - Sampled: WhatsApp CTA button dark olive/green: `x=382, y=1456` -> `#303F2A`

---

## 3. Shared Design Tokens Proposal (Extending Existing `fk-*` Tokens)

Instead of introducing an isolated `rf-*` token set, we extend the existing `fk-*` tokens established in `src/styles/menu-tw.css` into a shared tokens definition in `src/styles/fk-tokens.css`:

```css
/* ==========================================================================
   Fursat Design Tokens (fk-*) — Extended from Reference Design Measurements
   Loaded without preflight so existing site CSS is untouched.
   ========================================================================== */

@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) important;

@theme {
  /* --- Colors from Sharp Pixel Samples & Existing fk-* Tokens --- */
  --color-fk-cream: #F2EEE4;       /* Base warm cream canvas */
  --color-fk-cream-light: #EEE9D5; /* Sampled light cream background */
  --color-fk-paper: #F4EDDD;       /* Sampled elevated card paper surface */
  --color-fk-paper-light: #F7F4E3; /* Sampled bright card surface */
  --color-fk-ink: #34311E;         /* Sampled dark forest ink headline text */
  --color-fk-muted: #5C644E;       /* Muted body / captions */
  --color-fk-olive: #393D1A;       /* Sampled olive buttons & active tabs */
  --color-fk-olive-dark: #242E1B;  /* Deep olive hover state */
  --color-fk-green: #19331A;       /* Sampled deep forest green backdrop */
  --color-fk-quote: #4A4527;       /* Sampled dark olive quote card */
  --color-fk-gold: #E0A63C;        /* Existing Fursat brand gold accent */
  --color-fk-terra: #C8824E;       /* Sampled terracotta/ochre accent button */
  --color-fk-line: #DCD5C3;        /* Sampled card border line */
  --color-fk-line-subtle: #D6CFBD; /* Sampled step connecting line */
  --color-fk-wa: #303F2A;          /* Sampled dark green WhatsApp CTA button */
  --color-fk-deep: #1A1608;        /* Deep charcoal shadow/base */

  /* --- Fonts (Using Existing Project Fonts) --- */
  --font-fk-serif: "Playfair Display", Georgia, serif;
  --font-fk-sans: "Manrope", system-ui, -apple-system, sans-serif;
  --font-fk-script: "Sacramento", cursive;

  /* --- Radii --- */
  --radius-fk-pill: 9999px;
  --radius-fk-sm: 12px;
  --radius-fk-md: 20px;
  --radius-fk-lg: 28px;
  --radius-fk-xl: 36px;
  --radius-fk-organic: 42% 58% 70% 30% / 45% 45% 55% 55%;
}
```

### Loading Strategy on Non-Home Pages:
- `fk-tokens.css` is imported directly in the Astro frontmatter of target pages (e.g., `import '../styles/fk-tokens.css';` in `src/pages/story.astro`).
- Neither `src/pages/index.astro` (home) nor `src/pages/ask.astro` imports `fk-tokens.css`.
- Because `@import "tailwindcss/preflight.css"` is omitted, no global tag resets affect existing pages.

---

## 4. Sight-Verified Photo Asset Inventory

Every photo assigned has been directly inspected with vision. Any slot without a sight-verified real asset is downgraded to `TODO(client)`.

### Sight-Verified Allowed Food Photos (Strict List of 7):
1. **`angaraa_chicken_tikka_.webp`:** Platter of charred orange-red spiced chicken tikka pieces garnished with microgreens and bell pepper/lemon salad on a dark crackle-glaze oval ceramic platter, served with green mint chutney in a grey bowl and wooden cutlery caddy on white marble table.
2. **`karvepaku_kodi_vepudu.webp`:** Dark green curry-leaf roasted chicken pieces on an oval dark mottled platter with red onion rings and lemon wedge, pepper shakers beside it on white table.
3. **`jamicon_jerk_chicken_with_fires.webp`:** Top-down view of grilled jerk chicken cutlets on banana leaf strip with a generous portion of seasoned orange fries and creamy herb dipping sauce on a round teal ceramic platter.
4. **`tandoori_prawns_.webp`:** Person in black suit holding a cocktail martini glass with jumbo spiced charred prawns hooked over the rim and herb salsa inside the glass, with green foliage in background.
5. **`onion_rings.webp`:** Golden-red panko-breaded crispy onion rings on an oval ceramic platter with yellow tartar sauce and lettuce, a waiter's arm holding a coupe cocktail with floral garnish on white marble table.
6. **`kothimiru_panner_vepudu.webp`:** Hand with fork lifting a cube of cilantro-tossed golden paneer from a speckled grey plate with banana leaf, raw onion and lemon; blue mocktail in jar behind it.
7. **`lotus_biscoff_.webp`:** Tall clear glass filled with caramel-swirled thick milkshake topped with whipped cream and an intact Biscoff biscuit standing upright, on a counter with warm bokeh lights behind.

### Banned Food Photos (Never to be used as dishes):
- `dsc05389` — BANNED as dish.
- `dsc08946` — BANNED as dish.
- `fursat_` — BANNED as dish.
- `fursat_1_` — BANNED as dish.
- `pandu_mirchi_kodi_kebab` — BANNED as dish.

### Sight-Verified Interior Photos:
- **`fursat_space_02.webp`:** Soft-lit lounge corner with peach/blush cushioned sofas, patterned cushions, round marble table with wooden condiment box, potted green trees, and black metal & glass architectural dividers.
- **`fursat_space_03.webp`:** Partitioned dining room featuring vertical decorative screens with woven rattan and geometric chevron/damask printed panels, indoor plants, and black-and-white geometric tiled floor.
- **`fursat_space_07.webp`:** Dining hall with dark wood tables, royal blue upholstered bucket armchairs, and floor-to-ceiling wooden screen dividers with ambient overhead lighting.
- **`fursat_space_13.webp`:** Wall signage showing the orange elephant mascot emblem above the green serif "FURSAT" lettering and white script "Café" on warm beige wall.
- **`fursat_space_16.webp`:** Cozy seating nook with two orange-and-houndstooth curved armchairs and a peach sofa around a round black table, in front of a grid of rattan and chevron screen partitions with a black dog/anubis sculpture.
- **`fursat_space_19.webp`:** Dining room with dark high tables and bar stools in front of a warm red backlit wall featuring the circular FURSAT KITCHEN | BAR elephant logo, with vintage Indian travel posters framed on the walls.

---

## 5. Route-by-Route Sight-Verified Asset & Slot Mapping

| Route | Slot / Component | Asset Assigned | Verification Notes |
| :--- | :--- | :--- | :--- |
| **`/story`** | Hero / Narrative wave frame | `public/assets/interior/fursat_space_02.webp` | Verified: Peach lounge seating, marble table, ficus tree |
| **`/story`** | Space gallery item 1 | `public/assets/interior/fursat_space_13.webp` | Verified: Fursat Café wall sign with orange elephant |
| **`/story`** | Space gallery item 2 | `public/assets/interior/fursat_space_16.webp` | Verified: Houndstooth chairs, screen dividers, dog sculpture |
| **`/story`** | Space gallery item 3 | `public/assets/interior/fursat_space_19.webp` | Verified: Fursat Kitchen \| Bar illuminated circular logo |
| **`/story`** | Space gallery item 4 | `public/assets/interior/fursat_space_07.webp` | Verified: Dining hall with royal blue velvet chairs |
| **`/story`** | Space gallery item 5 | `public/assets/interior/fursat_space_03.webp` | Verified: Rattan & damask partition screens |
| **`/story`** | "Meet the Makers" staff card | *None exists* | **OMITTED** per Rule 3 |
| **`/cafe`** | Hero wave frame | `public/assets/interior/fursat_space_11.webp` | Verified: Sunlit booth seating |
| **`/cafe`** | Ritual pillar 1 (Coffee) | *None in allowed list* | `TODO(client)` (No sight-verified coffee photo in allowed 7) |
| **`/cafe`** | Ritual pillar 2 (Matcha) | *None exists* | `TODO(client)` |
| **`/cafe`** | Ritual pillar 3 (House-Baked) | *None in allowed list* | `TODO(client)` |
| **`/cafe`** | Ritual pillar 4 (Shakes) | `public/assets/dishes/lotus_biscoff_.webp` | Verified: Lotus Biscoff milkshake with biscuit |
| **`/cafe`** | Menu card 1 | `public/assets/dishes/lotus_biscoff_.webp` | Verified: Lotus Biscoff milkshake |
| **`/cafe`** | Menu cards 2–4 | *None in allowed list* | `TODO(client)` |
| **`/catering`** | Service 1: Live Tandoor | `public/assets/dishes/angaraa_chicken_tikka_.webp` | Verified: Charred tikka platter |
| **`/catering`** | Service 2: Tandoori Prawns | `public/assets/dishes/tandoori_prawns_.webp` | Verified: Spiced prawns in cocktail glass |
| **`/catering`** | Service 3: Crispy Starters | `public/assets/dishes/onion_rings.webp` | Verified: Panko onion rings with dip |
| **`/catering`** | Service 4: Biryani Handis | *None in allowed list* | `TODO(client)` |
| **`/restaurant-bar`** | Hero split frame | `public/assets/interior/fursat_space_08.webp` | Verified: Bar counter interior |
| **`/restaurant-bar`** | Tandoor dish 1 | `public/assets/dishes/angaraa_chicken_tikka_.webp` | Verified: Angaraa chicken tikka |
| **`/restaurant-bar`** | Tandoor dish 2 | `public/assets/dishes/tandoori_prawns_.webp` | Verified: Tandoori prawns in glass |
| **`/restaurant-bar`** | Tandoor dish 3 | `public/assets/dishes/karvepaku_kodi_vepudu.webp` | Verified: Curry leaf roasted chicken |
| **`/restaurant-bar`** | Tandoor dish 4 | `public/assets/dishes/kothimiru_panner_vepudu.webp` | Verified: Cilantro paneer starter |
| **`/restaurant-bar`** | Signature cocktails (4 items) | *None in allowed list* | `TODO(client)` |
| **`/events`** | Occasion cards (4 items) | `fursat_space_17`, `02`, `11`, `08` | Verified interior photos |
| **`/banquet`** | Hero grand hall frame | `public/assets/interior/fursat_space_18.webp` | Verified: Grand Banquet Hall |
| **`/banquet`** | Gallery cards 1–3 | `fursat_space_17-720`, `02-720`, `14-720` | Verified banquet interior photos |
| **`/reserve`** | Arched dining frame | `public/assets/interior/fursat_space_01.webp` | Verified: Dining room with lush greenery |
| **`/reserve`** | Preview card | `public/assets/interior/fursat_space_08.webp` | Verified: Bar counter interior |
| **`/order`** | Mascot visual | `public/assets/ask-mascot-md.webp` | Verified: Mascot illustration |
| **`/order`** | Takeaway packaging | *None exists* | `TODO(client)` |
| **`/parties`** | Mascot illustration | `public/assets/ask-mascot-md.webp` | Verified |
| **`/party`** | Host stage poses | `ask-mascot-md.webp`, `ask-mascot-cheer-md.webp`| Verified |
| **`/terms`** | *No photo slots required* | N/A | N/A |

---

## 6. Execution Order & Quality Gates

Work will proceed strictly one route per commit, verified by automated screenshots and build confirmation:
- **Step 0:** Planning fixes & sight verification (`review/layout-plan.md`)
- **Step 1:** Restyle `/story` (`src/pages/story.astro`) to the reference layout
- **Step 2:** Playwright before/after screenshots + build verification + gzip reporting
- Subsequent routes executed sequentially per Section 7 of the layout plan with owner phone checks after every 3 routes.
