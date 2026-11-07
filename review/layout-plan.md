# Reference Design Layout Conversion Plan: Fursat Kitchen | Bar

> **Status:** APPROVED FOR PLANNING  
> **Target Branch:** `design/reference-layout` (branched from `integration/dev-port`)  
> **Source Material:** `raw_assets/reference_design/` (4 design reference images, Cinder & Dew editorial cafe/bar system)  
> **Scope:** Convert every route in `src/pages` to the reference layout **EXCEPT** `/` (home) and `/ask`.

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

## 2. Reference Image Analysis (`raw_assets/reference_design/`)

Detailed breakdown of all four reference design mockups viewed via vision inspection. Real hex values sampled directly from image pixels; any indiscernible text marked `UNREADABLE`.

### Image 1: `WhatsApp Image 2026-11-04 at 23.14.33 (1).jpeg` (Cinder & Dew Slide 3/5)
- **Top Navigation Bar:**
  - Layout: Single row flex, centered brand name `"CINDER & DEW"` (~18px serif uppercase) with interlocking loop logo glyph (`&`), nav links: `"Menu"`, `"Story"` (active with subtle curved underline), `"Rituals"`, `"Visit"`, `"Journal"`. Right: pill CTA button `"Reserve a Table"` with botanical leaf glyph.
- **Section 1: Hero Split ("Where Ritual Meets the Everyday.")**
  - Grid: 2 columns asymmetric (text left ~46%, image right ~54%).
  - Left column:
    - Headline: Display serif, ~48px-54px font size, line-height 1.08, weight 500, color `#242D1C` (Dark Forest Ink). Botanical leaf flourish icon next to headline (`#8A9678`).
    - Body text: ~14px-15px, line-height 1.6, color `#4A543E` (Muted Olive). Text: *"Cinder & Dew was born from slow mornings, quiet intentions, and a love for the small things that ground us..."*
  - Right column:
    - Organic fluid wave/blob cut-out window frame (`border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%`). Photo shows a woman barista pouring hot water from a gooseneck kettle into a pour-over dripper on a ceramic counter with rustic ceramic vessels and branches.
- **Section 2: Quality Pillars ("Rooted in Quality. Guided by Ritual.")**
  - Section Header: Centered, flanked by symmetrical leaf flourishes (`#8A9678`), font size ~26px-28px serif.
  - Container Card: Large elevated squircle surface, background `#F7F3EB` (Warm Sand/Paper), border-radius 36px, subtle soft shadow `0 12px 32px rgba(36,45,28,0.06)`.
  - Grid: 4 columns equal width, gap 16px.
  - Card 1: `"Responsibly Sourced Beans"` — top photo (bowl of roasted coffee beans), circular badge icon top-left (`#EAE4D5` circle with dark bean glyph), title ~15px medium serif, caption: *"We partner with growers who prioritize land, people, and flavor in every harvest."*
  - Card 2: `"Ceremonial Grade Matcha"` — top photo (bamboo whisk & matcha bowl), circular badge icon (leaf), caption: *"Stone-milled for purity and depth—never rushed, never compromised."*
  - Card 3: `"Oat Milk, Made for Us"` — top photo (ceramic pitcher of oat milk), circular badge icon (drop), caption: *"Silky, clean, and crafted to complement—not compete—with every sip."*
  - Card 4: `"House-Baked Daily"` — top photo (cinnamon rolls / swirls), circular badge icon (wheat), caption: *"Made in small batches with real ingredients and a whole lot of care."*
- **Section 3: Process Stepper ("Our Ritual, Step by Step")**
  - Layout: Centered header ~24px serif, followed by 4 horizontal step units connected by thin horizontal arrows/lines:
    - Step 01: `"Source"` (leaf icon in circle)
    - Step 02: `"Roast"` (flame icon in circle)
    - Step 03: `"Pour"` (dripper icon in circle)
    - Step 04: `"Share"` (hands icon in circle)
  - Descriptions beneath steps in ~11px-12px muted sans (`#5C644E`).
- **Section 4: Bottom Split Cards**
  - Left Card (~38% width): Dark forest olive surface `#3C472A`, border-radius 24px, padding 28px. Large serif quote mark `"“"`, text: *"We believe the best moments aren’t rushed. They’re crafted with care, shared with others, and remembered."* Attribution: *"— The Cinder & Dew Team"* with leaf flourish. Text color `#F4EFE6`.
  - Right Card (~62% width): Light cream surface `#EFE8DB`, border-radius 24px, padding 28px, flex row. Left: Headline `"Meet the Makers"`, caption: *"We’re a small team of dreamers, doers, and detail-lovers—united by a passion for ritual and community."*, pill link button `"Our Story ->"` (`#3C472A` outline). Right: Rounded horizontal photo of café staff in matching barista aprons smiling together.

### Image 2: `WhatsApp Image 2026-11-04 at 23.14.33.jpeg` (Cinder & Dew Slide 4/5)
- **Section 1: Hero & Reservation Split ("Plan Your Visit")**
  - Grid: 2 columns asymmetric (left image frame ~45%, right form card ~55%).
  - Left: Arched organic wave window frame showing sunlit communal dining room with long wooden trestle table, arched doorways, rattan pendant lights, and potted trees.
  - Right:
    - Headline: `"Plan Your Visit"` (~44px-48px serif) + leaf flourish.
    - Subtitle: *"A seat, a moment, a ritual—we’ll save it for you."* (~14px muted sans).
    - Floating Reservation Form Card: Elevated cream surface `#FAF7F0`, border 1px solid `#DCD5C3`, border-radius 28px, padding 28px, shadow `0 16px 40px rgba(36,45,28,0.08)`.
    - Form Grid: 2x2 grid with rounded-xl (12px) inputs:
      - Field 1: Date (calendar icon, `"May 18, 2025"`, chevron)
      - Field 2: Guests (people icon, `"2 Guests"`, chevron)
      - Field 3: Time (clock icon, `"10:00 AM"`, chevron)
      - Field 4: Occasion (Optional) (party horn icon, `"Birthday"`, chevron)
    - Submit Button: Full-width dark olive pill button (`#3E4A28`), font size 15px bold, text `"Reserve a Table"` + leaf icon.
    - Guarantee line: *"✓ No fees. Easy changes. Thoughtful hospitality."* (~12px muted sans).
- **Section 2: Three Feature Cards**
  - Grid: 3 equal columns, gap 20px.
  - Card 1: `"Private Gatherings"` — photo of intimate candlelit dinner table with wine glasses, circular badge icon (people), text: *"Host with intention. Our space is perfect for intimate celebrations and meaningful meetings."*, link `"Inquire Now ->"`.
  - Card 2: `"Journal & Events"` — photo of open notebook, pen and matcha bowl, circular badge icon (leaf), text: *"Discover seasonal events, workshops, and stories that bring our community together."*, link `"Explore Journal ->"`.
  - Card 3: `"The Chef’s Table"` — photo of gourmet plated dish with green garnish, circular badge icon (cloche), text: *"An intimate, multi-course experience crafted in real time. Limited seats available."*, link `"Learn More ->"`.
  - Card shape: Rounded top corners (~20px), scooped / gentle radius bottom corners, clean white/cream body `#FAF7F0`.
- **Section 3: Bottom Location, Hours & Map Card**
  - Container: Large squircle card `#FAF7F0`, border 1px solid `#DCD5C3`, border-radius 32px, padding 32px.
  - Grid: 3 columns:
    - Col 1 (`"Visit Us"`): Address `"123 Orchard Lane, Portland, OR 97214"`, blurb: *"Tucked into the heart of the city, surrounded by nature and intentional living."*, pill button `"Get Directions ->"`.
    - Col 2 (`"Hours"`): Mon–Fri 7:00 AM – 6:00 PM, Saturday 8:00 AM – 7:00 PM, Sunday 8:00 AM – 5:00 PM. Note: *"We’re closed on select holidays to rest, reflect, and recharge."*
    - Col 3 (Map & Socials): Illustrated light green map graphic (`#E2DDCE` ground, olive circle pin icon `#3E4A28` marked Hawthorne District / Laurelhurst Park). Right: Social icons (Instagram, Pinterest, Newsletter, `hello@cinderanddew.com`, `503-555-0198`).
  - Footer Bar: Three-part row: Left: *"Rooted in ritual. Made for slowing down."* | Center: *"© 2025 Cinder & Dew. All rights reserved."* | Right: Links `"Privacy Policy"` & `"Terms of Service"`.

### Image 3: `WhatsApp Image 2026-11-04 at 23.14.34 (1).jpeg` (Cinder & Dew Slide 2/5)
- **Section 1: Hero ("Seasonal Sips & Slow Bakes.")**
  - Grid: 2 columns asymmetric (text left ~45%, image right ~55%).
  - Left: Headline `"Seasonal Sips & Slow Bakes."` (~48px-52px serif) with leaf flourish. Copy: *"Inspired by the rhythm of the seasons, our menu celebrates honest ingredients, thoughtful craft, and the beauty of slowing down."*
  - Right: Large organic fluid frame containing angled shot of roasted pumpkin/squash on ceramic plate with fresh herbs, sourdough slices, and olive oil dip. Silk caramel ribbon flourish wrapping the frame border.
- **Section 2: Category Filter Rail**
  - Layout: Horizontal pill button bar, centered.
  - Active Tab: `"Coffee"` — dark olive `#364223`, white text `#FAF7F0`, rounded-full.
  - Inactive Tabs: `"Matcha"`, `"Pastries"`, `"Breakfast"`, `"Pantry"` — transparent/light cream, muted olive text `#5C644E`, thin border `#DCD5C3`.
- **Section 3: Product Grid (Row 1 — 4 Columns Equal)**
  - Card 1: `"Dew Cappuccino"` — rounded square photo of latte art in ceramic cup, badge icon top-left, caption: *"Silky microfoam, bright and balanced."*, price: `"$5.25"`, action: dark olive circle plus button `(+)` (`#364223`).
  - Card 2: `"Stone Matcha"` — photo of vibrant green matcha in ceramic bowl, badge icon, caption: *"Ceremonial grade matcha with oat creamer."*, price: `"$6.00"`, circle plus button `(+)`.
  - Card 3: `"Pistachio Crème Roll"` — photo of golden rolled pastry with chopped green pistachios, badge icon, caption: *"Buttery layers, pistachio crème, a hint of cardamom."*, price: `"$5.75"`, circle plus button `(+)`.
  - Card 4: `"Amber Cold Brew"` — photo of layered iced cold brew glass, badge icon, caption: *"Slow-steeped for clarity and depth."*, price: `"$5.50"`, circle plus button `(+)`.
- **Section 4: Asymmetric Product Grid (Row 2 — 3 Cards: 1 Wide + 2 Single)**
  - Card 1 (Wide Promo Tray, spans 2 columns): Dark olive green surface `#404C2E`, rounded-2xl (24px). Eyebrow: `"CHEF’S SEASONAL TRAY"`. Title: `"A Tasting of the Season."` (~22px serif in warm gold/cream `#E5C992`). Copy: *"A curated selection of sweet and savory favorites—crafted to share and savor."* Price: `"$28.00"`. Button: Pill button `"Add to Order +"` with cream background `#FAF7F0` and dark green text. Photo on right: Curated tray with teapot, sourdough, spreads and espresso.
  - Card 2: `"Herb & Goat Tart"` — photo of savory quiche/tart, badge icon, caption: *"Whipped chèvre, seasonal herbs, and honey."*, price: `"$6.75"`, plus button `(+)`.
  - Card 3: `"Cinnamon Knot"` — photo of twisted braided pastry knot, badge icon, caption: *"Warm spice, crisp edges, soft center."*, price: `"$4.50"`, plus button `(+)`.
- **Section 5: Footer Purpose Strip**
  - Full-width horizontal strip on `#EBE4D5`, padding 16px 24px, rounded-2xl. Left: Dark green circular tree icon badge. Center: Label `"Rooted in Purpose"` + Title: `"Ethically sourced. Sustainably minded."` + Copy: *"We partner with farmers and makers who share our values of care—for the earth, for people, and for craft."* Right: Link `"Our Ingredients ->"` beside etched botanical drawing.

### Image 4: `WhatsApp Image 2026-11-04 at 23.14.34.jpeg` (Fursat Ask Companion Adaptation)
- **Top Navigation Bar:**
  - Lotus/botanical gold/green mark + `"FURSAT"`, nav links: `"Menu"`, `"Story"`, `"Rituals"`, `"Visit"`, `"Journal"`, right pill CTA button: `"Reserve a Table ->"` (`#1F2E1B` dark olive green).
- **Hero Split ("What are you in the mood for?"):**
  - Eyebrow: `"GOOD FOOD • SLOW MOMENTS • TOGETHER"` (~11px tracking-widest uppercase).
  - Headline: `"What are you in the mood for?"` (~44px serif, dark ink `#1E2818`) with leaf flourish. Subtext: *"Tell Fursat how you feel and we will find the dish."*
  - Visual: Real high-resolution photo of Fursat's bar counter with glowing `"FURSAT Café & Bar"` neon signage and ambient ceiling lights, blended with the cute baby elephant mascot wearing sunglasses and gold crown resting chin on the polished granite counter.
- **Center Floating Companion Search Card:**
  - Card surface: Warm cream `#F6F2E9` set over organic dark green wave curve backdrop `#25361D`, rounded corners 32px.
  - Script Wordmark: Elegant cursive *ask* in ochre/terracotta (`#C4843A`) over bold serif `"FURSAT"` (`#1E2818`) + `"YOUR FOOD COMPANION"` subtitle.
  - Pill Search Input: Height 54px, background `#FFFDF7`, border 1px solid `#E5DFCE`, dish bowl icon on left, placeholder: `"Something spicy under 400"`, microphone icon, terracotta/gold circular arrow submit button (`#C4843A`).
  - Quick Mood Chips: Rounded-full pill chips: `"🍴 I'm hungry"`, `"🌧️ It's raining"`, `"🎉 Birthday with friends"`, dark green CTA pill `"Skip to main content ->"`, and active chip `"🌶️ Something spicy under 400"`.
  - Handwritten flourish: *Good food finds you* in fluid cursive script with hand-drawn botanical branch line art.
- **Recommendation Grid ("Picks for 'Something spicy under 400'"):**
  - Section Header: `"Picks for “Something spicy under 400”"` with leaf flourish icon (`#435C2B`).
  - Grid: 3 columns equal width, gap 20px.
  - Card 1: `"Peri Peri Cottage Cheese Sandwich"` — photo in rounded ceramic bowl, circular leaf badge top-left, categories: *"Sandwiches & burgers, Veg, Spicy - Spicy, Under ₹400"*, price: `"₹240"`.
  - Card 2: `"Schezwan Paneer Wet"` — photo of glossy paneer cubes in dark bowl with herbs, circular leaf badge, categories: *"Asian mains, Veg, Spicy - Spicy, Under ₹400"*, price: `"₹240"`.
  - Card 3: `"Chilli Chicken/ Fish/ Prawns"` — photo of golden flash-seared chicken and prawns with lemon slice on dark ceramic platter, circular leaf badge, categories: *"Asian mains, Non-veg, Spicy - Spicy, Under ₹400"*, price: `"₹400"`.
  - Card styling: Light cream card `#FAF7F0`, rounded 24px, subtle border `#E5DFCE`, dark ink title ~16px serif, muted tags ~12px sans, price ~16px bold.
- **Bottom Reservation CTA:**
  - Centered full-width pill button in dark forest green `#1F2E1B`, white text, WhatsApp brand icon: `"Reserve a table on WhatsApp ->"`.

---

## 3. Route-to-Reference Mapping & Change Matrix

Every route mapped to the reference design patterns. No route is left without an explicit pattern mapping.

| Route | Mapped Reference Pattern(s) | Markup Changes | CSS Changes | Script / Data Changes |
| :--- | :--- | :--- | :--- | :--- |
| **`/story`** | **Image 1** Hero Split + Image 1 Quality Pillars + Image 1 Bottom Quote/Team Card + Image 2 Info Card | Restructure hero into 2-col editorial split (headline left, organic wave photo right); convert pillars into 3 squircle cards with numeric tags; restyle quote box with large serif quote; reformat legal info as 3-column squircle card. | Replace dark `#17200F` with warm cream `#F4EFE6`; apply serif typography, leaf flourish borders, and `--color-rf-olive` badges. | **Nothing** |
| **`/cafe`** | **Image 3** Hero + Category Rail + 4-Col Menu Cards + Image 1 Quality Pillars | Polish hero wave frame to match Image 3; restructure menu cards to match 4-col product card pattern (image, title, caption, price, plus button); convert pillars to Image 1 icon cards. | Convert background to warm cream `#F4EFE6`; update category tabs to dark olive pills; apply reference borders. | **Nothing** |
| **`/reserve`** | **Image 2** "Plan Your Visit" Hero Split + Floating Form Card + 3-Col Feature Cards | Reorganize into 2-column split (Left: arched photo frame with communal dining photo; Right: floating reservation form card matching Image 2 2x2 grid); preserve ALL form fields, time chips, and scratch card widget. | Restyle form into elevated cream card `#FAF7F0`; style guest buttons & time chips as reference pills; dark olive WhatsApp submit button. | **Nothing** (All form logic, IDs `#res-date`, `#res-name`, `#res-phone`, etc. preserved) |
| **`/order`** | **Image 2 / Image 4** Central Floating Card & WhatsApp Action Bar | Wrap takeaway notice into large elevated squircle card matching Image 4 companion card; include mascot visual; add prominent WhatsApp ordering pill button. | Replace dark `#17200F` canvas with warm cream `#F2EEE4`; card border-radius 32px; pill button `#25D366`. | **Nothing** |
| **`/restaurant-bar`** | **Image 1 / Image 3** Evening/Bar Adaptation (Dark Forest Luxury) | Split hero with headline left & curved window frame right (`fursat_space_08.webp`); 4-column cocktail cards grid matching Image 3; 2-col kitchen split with 4-photo grid; weekend live music banner matching Image 1 quote card. | Deep forest green `#141C0F` and dark olive `#242E1B`; warm cream text `#F4EFE6`; gold accents `#E0A63C`. | **Nothing** |
| **`/events`** | **Image 1** Alternating Occasion Cards + Image 3 Category Tabs + Image 4 Bottom CTA | Reformat hero tabs into reference category pill tabs; convert 4 occasion cards into alternating large squircle cards with rounded photo, badge pill, and star/leaf bullet points; center WhatsApp CTA. | Background `#F4EFE6` or alternating dark/cream cards; reference card border-radius 28px; pill buttons. | **Nothing** |
| **`/banquet`** | **Image 2** Hero Split + Image 1 Step Metric Row + Image 3 Packages + Image 2 Form Card | Hero split (headline left, arched photo right `fursat_space_18.webp`); specs row as Image 1 horizontal metric cards; package cards styled as Image 3 Chef's Tray & Product cards; enquiry form styled as Image 2 floating form card. | Palette shift to reference tokens; elevated cream cards; dark olive CTA buttons. | **Nothing** (Form actions preserved) |
| **`/catering`** | **Image 1** Hero Split + 4-Col Service Cards + Step Metric Row + Image 2 Form Card | 2-col hero split; convert 4 services to Image 1 pillar cards with circular icon badges; convert guest scale to step metric cards; style quote form as Image 2 floating card. | Warm cream canvas; card radius 24px; olive pill buttons; gold highlights. | **Nothing** |
| **`/terms`** | **Image 2** Large Squircle Document Container | Wrap legal sections into a single elevated squircle document card matching Image 2 bottom info card; format sections with leaf bullets and clean dividers. | Canvas `#F4EFE6`, paper surface `#FFFDF6`, dark ink text `#2A2514`, thin borders `#D9D2BD`. | **Nothing** |
| **`/parties`** | **Image 4** Mascot Hero + Image 2 Slider Card + Image 3 Package Cards | Align occasion chips with Image 4 mood pills; restyle guest count slider panel into Image 2 form container; refine 3D card typography and conic glow to match token palette; floating dock styled with reference tokens. | Harmonize custom colors (`--pg`, `--pgold`, `--pcream`) with shared design tokens; retain 3D tilt effects. | **Nothing** (`parties.js` logic preserved) |
| **`/party`** | **Image 4** Host Stage + Image 3 Arched Package Cards + Image 2 Calculator | Restyle package type tabs as reference pill tabs; keep arched card shape (`border-radius: 165px 165px 24px 24px`) but update typography and color tokens; style calculator into Image 2 form card; style dish accordions with reference dividers. | Use shared token variables (`--color-rf-terra`, `--color-rf-olive`, `--color-rf-line`); refine button press states. | **Nothing** (`party.js` & `PartyStage` preserved) |
| **`/menu`** | **Image 3** Category Rail + 4-Col Food/Drinks Product Cards + Image 4 Showcase | Restyle category tabs into reference pill tabs; reformat food & drinks cards to match Image 3 product card layout (rounded image cap, dish name, description, price, veg dot); retain split container & bar parallax scene untouched. | Harmonize typography, borders, and card radius with tokens; maintain 3/4 & 1/4 toggle layout. | **Nothing** (Dish showcase, bar parallax, and Three.js hook preserved) |

---

## 4. Shared Design Tokens File Proposal (`src/styles/design-tokens.css`)

To ensure all pages derive from a single unified source of truth and leverage the Tailwind v4 engine already wired in `astro.config.mjs`, we propose `src/styles/design-tokens.css`:

```css
/* ==========================================================================
   Fursat Design Tokens (Derived from Cinder & Dew Reference Design)
   Tailwind v4 theme integration without preflight collision.
   ========================================================================== */

@layer theme, base, components, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities) important;

@theme {
  /* --- Colors sampled directly from reference mockups --- */
  --color-rf-cream: #F4EFE6;       /* Canvas warm cream / sand */
  --color-rf-paper: #FAF7F0;       /* Card surface / elevated paper */
  --color-rf-paper-light: #FFFDF7; /* Bright paper for inputs / cards */
  --color-rf-ink: #242D1C;         /* Primary text dark forest ink */
  --color-rf-muted: #5C644E;       /* Secondary body / captions */
  --color-rf-olive: #3E4A28;       /* Primary brand olive / buttons */
  --color-rf-olive-dark: #2A341B;  /* Olive hover / active state */
  --color-rf-forest: #17200F;      /* Deep forest surface (evening/bar) */
  --color-rf-forest-dark: #10160A; /* Deepest dark overlay */
  --color-rf-gold: #E0A63C;        /* Warm gold accent */
  --color-rf-gold-light: #F1D495;  /* Soft gold highlight */
  --color-rf-ochre: #C4843A;       /* Mascot ochre / terracotta */
  --color-rf-terra: #C2431A;       /* Spicy badge terracotta */
  --color-rf-line: #DCD5C3;        /* Subtle line / card border */
  --color-rf-line-dark: rgba(224, 166, 60, 0.25); /* Border on dark surfaces */
  --color-rf-wa: #25D366;          /* Official WhatsApp green */

  /* --- Typography --- */
  --font-rf-serif: "Playfair Display", Georgia, serif;
  --font-rf-sans: "Manrope", system-ui, -apple-system, sans-serif;
  --font-rf-script: "Sacramento", cursive;

  /* --- Radii --- */
  --radius-rf-pill: 9999px;
  --radius-rf-sm: 12px;
  --radius-rf-md: 20px;
  --radius-rf-lg: 28px;
  --radius-rf-xl: 36px;
  --radius-rf-organic: 42% 58% 70% 30% / 45% 45% 55% 55%;
}

/* Base custom classes to enforce reference consistency across all converted pages */
.rf-canvas-light {
  background-color: var(--color-rf-cream);
  color: var(--color-rf-ink);
  font-family: var(--font-rf-sans);
}

.rf-canvas-dark {
  background-color: var(--color-rf-forest);
  color: var(--color-rf-cream);
  font-family: var(--font-rf-sans);
}

.rf-card-paper {
  background-color: var(--color-rf-paper);
  border: 1px solid var(--color-rf-line);
  border-radius: var(--radius-rf-lg);
  box-shadow: 0 12px 32px rgba(36, 45, 28, 0.06);
}

.rf-btn-olive {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--radius-rf-pill);
  background-color: var(--color-rf-olive);
  color: var(--color-rf-paper);
  font-family: var(--font-rf-sans);
  font-weight: 700;
  font-size: 0.9375rem;
  text-decoration: none;
  transition: background-color 0.16s ease, transform 0.16s ease;
}
.rf-btn-olive:hover {
  background-color: var(--color-rf-olive-dark);
  transform: translateY(-2px);
}

.rf-wave-mask {
  border-radius: var(--radius-rf-organic);
  overflow: hidden;
  box-shadow: 0 20px 48px rgba(36, 45, 28, 0.15);
}
```

---

## 5. Real Photo Asset Mapping (`public/assets/`)

Strict adherence to real assets only. Zero AI-generated images, zero stock imagery, zero hand-made 3D assets.

| Route | Reference Layout Slot | Existing Real Photo Asset | Status / Fallback |
| :--- | :--- | :--- | :--- |
| **`/story`** | Hero / Narrative fluid wave window | `public/assets/interior/fursat_space_02.webp` | Available (real dining interior) |
| **`/story`** | Space gallery strip slot 1 | `public/assets/interior/fursat_space_13.webp` | Available |
| **`/story`** | Space gallery strip slot 2 | `public/assets/interior/fursat_space_16.webp` | Available |
| **`/story`** | Space gallery strip slot 3 | `public/assets/interior/fursat_space_19.webp` | Available |
| **`/story`** | Space gallery strip slot 4 | `public/assets/interior/fursat_space_07.webp` | Available |
| **`/story`** | Space gallery strip slot 5 | `public/assets/interior/fursat_space_03.webp` | Available |
| **`/story`** | "Meet the Makers" team portrait slot | *None exists in inventory* | **`TODO(client)`** (Client staff photo) |
| **`/cafe`** | Hero morphing fluid wave frame | `public/assets/interior/fursat_space_11.webp` | Available (sunlit booth seating) |
| **`/cafe`** | Ritual pillar 1 (Espresso) | `public/assets/dishes/dsc08774.webp` | Available (cold brew / coffee) |
| **`/cafe`** | Ritual pillar 2 (Matcha) | *None exists in inventory* | **`TODO(client)`** (Real Fursat matcha photo; vector icon used) |
| **`/cafe`** | Ritual pillar 3 (House-Baked) | `public/assets/dishes/dsc08852.webp` | Available (waffle / bakes) |
| **`/cafe`** | Ritual pillar 4 (Thick Shakes) | `public/assets/dishes/lotus_biscoff_.webp` | Available (Lotus Biscoff shake) |
| **`/cafe`** | Menu card: Lotus Biscoff Shake | `public/assets/dishes/lotus_biscoff_.webp` | Available |
| **`/cafe`** | Menu card: Amber Cold Brew | `public/assets/dishes/dsc08774.webp` | Available |
| **`/cafe`** | Menu card: Belgian Chocolate Waffle | `public/assets/dishes/dsc08852.webp` | Available |
| **`/cafe`** | Menu card: Smashed Avocado Toast | `public/assets/dishes/dsc08919.webp` | Available |
| **`/cafe`** | Atmosphere gallery large | `public/assets/interior/fursat_space_05.webp` | Available |
| **`/cafe`** | Atmosphere gallery item 2 | `public/assets/interior/fursat_space_06.webp` | Available |
| **`/cafe`** | Atmosphere gallery item 3 | `public/assets/interior/fursat_space_15.webp` | Available |
| **`/reserve`** | Hero split arched dining window | `public/assets/interior/fursat_space_01.webp` | Available |
| **`/reserve`** | Venue preview card | `public/assets/interior/fursat_space_08.webp` | Available |
| **`/order`** | Background blurred photo | `public/assets/interior/fursat_space_10.webp` | Available |
| **`/order`** | Mascot Companion visual | `public/assets/ask-mascot-md.webp` | Available |
| **`/order`** | Takeaway packaged bag photo slot | *None exists in inventory* | **`TODO(client)`** (Packaging photo) |
| **`/restaurant-bar`** | Hero split curved window frame | `public/assets/interior/fursat_space_08.webp` | Available (bar counter) |
| **`/restaurant-bar`** | Signature cocktail photos (4 items) | `public/assets/dishes/_n.webp` (1 item available) | 1 Available; **`TODO(client)`** for remaining 3 cocktails |
| **`/restaurant-bar`** | Tandoor gallery main photo | `public/assets/dishes/angaraa_chicken_tikka_.webp` | Available |
| **`/restaurant-bar`** | Tandoor gallery sub photo 1 | `public/assets/dishes/tandoori_prawns_.webp` | Available |
| **`/restaurant-bar`** | Tandoor gallery sub photo 2 | `public/assets/dishes/dsc03308.webp` | Available |
| **`/restaurant-bar`** | Tandoor gallery sub photo 3 | `public/assets/dishes/dsc05366.webp` | Available |
| **`/events`** | Hero background accent | `public/assets/interior/fursat_space_12.webp` | Available |
| **`/events`** | Birthday party setup card | `public/assets/interior/fursat_space_17.webp` | Available |
| **`/events`** | Corporate dining card | `public/assets/interior/fursat_space_02.webp` | Available |
| **`/events`** | Kitty party / ladies lounge card | `public/assets/interior/fursat_space_11.webp` | Available |
| **`/events`** | Bar bash cocktail lounge card | `public/assets/interior/fursat_space_08.webp` | Available |
| **`/banquet`** | Hero split grand hall window | `public/assets/interior/fursat_space_18.webp` (m480, m720, 1200w) | Available |
| **`/banquet`** | Gallery card 1 (Main Banquet Floor) | `public/assets/interior/fursat_space_17-720.webp` | Available |
| **`/banquet`** | Gallery card 2 (Grand Dinner Seating) | `public/assets/interior/fursat_space_02-720.webp` | Available |
| **`/banquet`** | Gallery card 3 (Private Bar Counter) | `public/assets/interior/fursat_space_14-720.webp` | Available |
| **`/catering`** | Hero split buffet photo | `public/assets/interior/fursat_space_14.webp` | Available |
| **`/catering`** | Service: Live Charcoal Tandoor | `public/assets/dishes/angaraa_chicken_tikka_.webp` | Available |
| **`/catering`** | Service: Dum Biryani Handis | `public/assets/dishes/dsc05154.webp` | Available |
| **`/catering`** | Service: Mocktail & Mixology Bar | `public/assets/dishes/_n.webp` | Available |
| **`/catering`** | Service: Live Chaat & Dessert | `public/assets/dishes/dsc08946.webp` | Available |
| **`/catering`** | Gallery items 1–3 | `fursat_space_02.webp`, `05.webp`, `10.webp` | Available |
| **`/menu`** | Bar counter parallax layers | `bar-back.webp`, `bar-front.webp`, `bar-logo.webp` | Available |
| **`/menu`** | Food & drinks dish cards | 28 mapped dish photos in `public/assets/dishes/` | Available; unmapped items marked **`TODO(client)`** |
| **`/parties`** | Mascot illustration | `public/assets/ask-mascot-md.webp` | Available |
| **`/party`** | Host mascot idle & cheer poses | `ask-mascot-md.webp`, `ask-mascot-cheer-md.webp` | Available |
| **`/party`** | Party stage 3D poster | `public/assets/party-stage-poster.webp` | Available |
| **`/terms`** | Legal policy document | *No photo assets required* | Not applicable |

---

## 6. Non-Negotiable Do-Not-Touch List

Under no circumstances will any of the following be modified during this layout migration:
1. **Home Route (`src/pages/index.astro`):** Strictly excluded from migration.
2. **Ask Fursat Route (`src/pages/ask.astro`):** Strictly excluded from migration.
3. **Hero & Intro Components:** `src/components/Hero.astro`, `IntroHeli.astro`, `IntroLogo.astro`, `IntroGate.astro`, `IntroCaption.astro` remain untouched.
4. **Reserve Form Logic:** The DOM IDs (`#res-form`, `#res-date`, `#res-name`, `#res-phone`, `#res-occasion`, `#res-submit-btn`), guest selector buttons (`.rs-guest-btn`), time slot chips (`.rs-time-chip`), and the scratch card reveal script (`#scratch-cover`, `#scratch-box`) must retain their exact functional behavior and WhatsApp message generation schema.
5. **Data Files (`src/data/*.json`):** `food.json`, `drinks.json`, `party.json`, and `ld.json` are read-only.
6. **Pricing & Numerical Integrity:** All item prices, package rates (₹925, ₹1,150, ₹1,450), cocktail prices, and promotional discount values (15% OFF, code `FURSAT15`) must never be modified or invented.

---

## 7. Order of Work & Quality Gates

Work will proceed strictly one route per commit, verified by automated screenshots and build confirmation.

### Execution Sequence:
- **Phase 0:** Setup shared design tokens (`src/styles/design-tokens.css`)
- **Route 1:** `/story` (`src/pages/story.astro`) — Direct 1:1 match with Reference Image 1
- **Route 2:** `/cafe` (`src/pages/cafe.astro`) — Match with Reference Image 3 & Image 1
- **Route 3:** `/reserve` (`src/pages/reserve.astro`) — Match with Reference Image 2 form & feature cards
  > 📱 **Quality Gate 1:** Request owner phone check for Routes 1–3 before proceeding.
- **Route 4:** `/order` (`src/pages/order.astro`) — Match with Reference Image 4 companion card
- **Route 5:** `/restaurant-bar` (`src/pages/restaurant-bar.astro`) — Dark luxury evening adaptation
- **Route 6:** `/events` (`src/pages/events.astro`) — Occasion cards matching Image 1
  > 📱 **Quality Gate 2:** Request owner phone check for Routes 4–6 before proceeding.
- **Route 7:** `/banquet` (`src/pages/banquet.astro`) — Royal banquet layout matching Image 2 & Image 3
- **Route 8:** `/catering` (`src/pages/catering.astro`) — Outdoor catering capabilities & quote form
- **Route 9:** `/terms` (`src/pages/terms.astro`) — Clean editorial document squircle
  > 📱 **Quality Gate 3:** Request owner phone check for Routes 7–9 before proceeding.
- **Route 10:** `/parties` (`src/pages/parties.astro`) — Interactive party package slider harmonized to tokens
- **Route 11:** `/party` (`src/pages/party.astro`) — Arched package cards & calculator harmonized to tokens
- **Route 12:** `/menu` (`src/pages/menu.astro`) — 4-column product grid and bar counter scene
  > 📱 **Quality Gate 4:** Final verification across all 14 pages.

### Per-Commit Verification Protocol:
1. `npm.cmd run build` must report `14 page(s) built` with zero errors.
2. Playwright screenshot capture at:
   - Mobile: `390px x 844px` (iPhone 14 viewport)
   - Desktop: `1440px x 900px` (MacBook / standard laptop viewport)
3. Confirm JS bundle impact remains within budget (< 120 KB gzip).

---

## 8. Technical Risks & Defenses

1. **Tailwind Preflight Effects:**
   - *Risk:* Enabling Tailwind's default preflight (`@import "tailwindcss/preflight.css"`) strips margins from headings, resets button appearances, and breaks legacy CSS throughout unlayered styles.
   - *Defense:* As established in `menu-tw.css`, we omit `preflight.css` entirely. We import only `@import "tailwindcss/theme.css" layer(theme);` and `@import "tailwindcss/utilities.css" layer(utilities) important;`.
2. **CSS Cascade Collisions with Legacy Files (`01.css`–`10.css`):**
   - *Risk:* Unlayered global CSS in `01.css`–`10.css` has higher specificity than standard utility classes in CSS layers.
   - *Defense:* The `important` keyword on `@import "tailwindcss/utilities.css"` ensures utility classes override unlayered global rules. Additionally, scoped styles inside Astro components (`<style>`) generate unique attribute hashes (`data-astro-cid-*`) that guarantee encapsulation without global leakage.
3. **Per-Page JavaScript Budget (120 KB gzip):**
   - *Risk:* Introducing complex animation libraries or client frameworks bloats bundle size and degrades mobile performance.
   - *Defense:* Zero new npm packages. No client-side frameworks added. All layout patterns are achieved with pure semantic HTML and modern CSS (fluid grids, aspect-ratio, border-radius, SVG masks, container queries). Static rendering via Astro keeps client-side JS unchanged.

---

## 9. Paste-Ready BUILD PROMPT for Route 1 (`/story`)

```markdown
Work in ..\fursat-port on branch design/reference-layout. AGENTS.md rules apply.
No deploy, no push, no force, no git gc.

GOAL: Convert Route 1 (/story — src/pages/story.astro) to the layout of raw_assets/reference_design/ WhatsApp Image 2026-11-04 at 23.14.33 (1).jpeg (Cinder & Dew editorial style).

1. Tokens setup:
   Create src/styles/design-tokens.css containing the @theme tokens defined in review/layout-plan.md Section 4 without preflight.
   Import it into src/pages/story.astro.

2. Restructure src/pages/story.astro:
   - Canvas: Light warm cream background (#F4EFE6) with dark forest ink text (#242D1C).
   - Hero Split: 2-column asymmetric grid. Left: eyebrow kicker "OUR ESSENCE", display serif headline "Where Ritual Meets the Everyday.", and italicized body copy explaining Fursat. Right: fluid organic wave frame (border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%) containing real photo /assets/interior/fursat_space_02.webp.
   - Narrative & Quote: 2-column section. Left: "Where Time Slows Down" Deccan hospitality copy. Right: dark forest green quote box (#3C472A) with warm cream serif quote and team attribution.
   - Core Values: 3-column card grid in elevated paper surface (#FAF7F0) with serif numeric badges (01, 02, 03).
   - Space Gallery: Horizontal scroll strip with rounded squircle photos (fursat_space_13, 16, 19, 07, 03).
   - Legal Disclosures: Large squircle card (#FAF7F0, border 1px solid #DCD5C3, border-radius 32px) formatting FSSAI, registered LLP entity, address, hours, and contact details.

3. Constraints:
   - Use existing real photos only (no stock, no generated images).
   - Do NOT touch index.astro, ask.astro, hero, or src/data/*.json.
   - Preserve all existing copy and Fursat facts.

4. Verification:
   - Run: npm.cmd run build (must confirm 14 page(s) built).
   - Run playwright to take screenshots of /story at 390px and 1440px width.

5. Commit:
   Commit changes with message: "feat(story): convert to reference editorial layout"

STOP and report:
- git --no-pager log --oneline -4
- git --no-pager status --short
- Screenshot file paths
```
