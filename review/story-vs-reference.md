# Story Page vs. Reference Design Comparative Audit

> **Target File:** `src/pages/story.astro`  
> **Reference Material:** `review/reference/WhatsApp Image 2026-11-04 at 23.14.33 (1).webp` (Slide 1: Story & Rituals) and `WhatsApp Image 2026-11-04 at 23.14.33.webp` (Slide 2: Visit & Governance)  
> **Viewports Audited:** 1440px (Desktop) & 390px (Mobile)  
> **Token Source:** `src/styles/fk-tokens.css`

---

## 1. Executive Section Order & Structure Comparison

| Section # | Reference Design (Slide 1 & 2) | Current `/story` (Initial Port) | Required Target Architecture |
| :--- | :--- | :--- | :--- |
| **0. Nav** | Minimalist header with active pill and script details | Standard `SiteHeader` with `active="story"` | Keep `SiteHeader` with seamless cream palette integration. |
| **1. Hero** | Asymmetric 2-column: Left serif headline with leaf flourish, narrative paragraph, dual buttons; Right fluid organic wave frame | 2-column grid, but lacked decorative divider, slightly mismatched type scale and spacing | Refined asymmetric 1.15fr : 1fr grid, exact font sizes, leaf flourish, divider line, organic wave frame. |
| **2. Pillars & Rituals** | Enclosed in one massive elevated squircle container (`#E7E0CE`/`#F4EDDD`): Centered title flanked by `❧`, 4 pillar cards, plus 4-step horizontal connecting stepper | Section was flat full-width stripe (`#ECE5D5`) with 3 cards, followed immediately by separate sections; missing the container card and stepper | Enclose both Pillars and Stepper inside an elevated squircle container card (`border-radius: 36px`), centered title flanked by `❧`, 3 Fursat pillars, and 4-step Deccan culinary ritual. |
| **3. Narrative & Quote** | Left: Dark forest quote card (`#4A4527`), deep rounded corners, gold quote mark, italic serif text; Right: "Meet the Makers" | Narrative text split 50/50 with dark quote card, placed *above* pillars rather than integrated below | Position Split Narrative & Dark Quote Box naturally. Omit "Meet the Makers" per Rule 3 (no verified staff photo exists). |
| **4. Atmosphere Gallery** | Horizontal gallery strip with curved frames | Flat horizontal scroll strip with standard rectangular rounded corners | Implement **Curved Horizon Gallery (#10 from effects-plan.md)** with 3D cylindrical perspective, touch drag, and snap fallback. |
| **5. Legal & Governance** | Derived from Slide 2 bottom contact & hours card (`border-radius: 32px-36px`) | Squircle card with 2-column info grid | Retain squircle card, match reference padding, borders, and typography. FSSAI marked `TODO(client)`. |

---

## 2. Granular Section-by-Section Difference Analysis

### Section 1: Hero Split
- **Grid & Column Count:**
  - *Reference:* Desktop 2-column asymmetric (~46% text, ~54% image), mobile 1-column stacked.
  - *Current /story:* Grid was 1.1fr : 1fr. Needs slight adjustment to 1.15fr : 1fr so the organic frame gets generous breathing room.
- **Spacing:**
  - *Reference:* Top padding `clamp(70px, 9vw, 120px)`, bottom padding `clamp(40px, 6vw, 70px)`. Text elements separated by `16px` to `28px`.
  - *Current /story:* Padding was slightly compressed on mobile; button margin needed more separation from body text.
- **Type Sizes & Weights:**
  - *Reference:* Display serif headline `clamp(2.5rem, 5vw, 4.25rem)`, weight 500–600, line-height 1.08. Leaf flourish icon beside title. Muted narrative body `clamp(1.05rem, 1.8vw, 1.25rem)`, line-height 1.65.
  - *Current /story:* Headline size matched well; added decorative inline divider (`-- ❧ --`) below headline to match reference slide.
- **Image Shapes & Crops:**
  - *Reference:* Organic fluid wave / blob frame (`border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%`), 2px border `#DCD5C3`, soft depth shadow.
  - *Current /story:* Wave shape present, photo `fursat_space_02.webp` verified. Needs entrance scale-in animation.
- **Buttons:**
  - *Reference:* Primary pill button in deep olive (`#393D1A`), cream text (`#FAF7F0`), pill radius (`9999px`), subtle shadow; Secondary ghost button with thin line (`#DCD5C3`).
  - *Current /story:* Buttons match reference styling.

---

### Section 2: Pillars Container & Ritual Stepper
- **Grid & Column Count:**
  - *Reference:* Contained in a single giant elevated squircle container surface. Inside: centered section header, 4 cards in a 4-column row (responsive 1-column on mobile), followed by a 4-step horizontal stepper.
  - *Current /story:* Was full-width flat background stripe across the viewport with 3 text cards; lacked container squircle geometry and the ritual stepper.
- **Geometry & Background:**
  - *Reference:* Container background `#F4EDDD` (`--color-fk-paper`), border `1px solid #DCD5C3` (`--color-fk-line`), border-radius `36px` (`--radius-fk-xl`), box-shadow `0 16px 40px rgba(36, 45, 28, 0.06)`.
  - *Current /story:* Needs to be wrapped inside this elevated squircle card container on the cream canvas.
- **Pillar Cards:**
  - *Reference:* Top badge, pill tag (`Pillar One`), serif title, muted body.
  - *Fursat Content:*
    - 01 / Pillar One: **Patience Over Pace** (Slow marinations, whole-spice reductions, slow-simmered curries).
    - 02 / Pillar Two: **Thoughtful Ingredients** (Cold-pressed oils, single-estate Arabica coffee, pure ghee).
    - 03 / Pillar Three: **Spaces for Every Mood** (Sunlit café, high-energy bar, royal banquet enclaves).
- **Ritual Stepper ("Our Ritual, Step by Step"):**
  - *Reference:* Centered header, 4 horizontal steps connected by a thin connecting line (`#D6CFBD`):
    - 01 Source -> 02 Roast -> 03 Pour -> 04 Share.
  - *Fursat Real Culinary Adaptation:*
    - 01 Source: Locally harvested produce & hand-selected Deccan spices.
    - 02 Marinate: 24-hour slow herb infusions & stone-ground masalas.
    - 03 Craft: Live charcoal tandoor roasting & slow earthen dum.
    - 04 Savor: Unhurried dining, curated pours & shared memories.

---

### Section 3: Split Narrative & Dark Quote Box
- **Grid & Column Count:**
  - *Reference:* Left card is a dark olive/forest quote surface (`#4A4527`), right card was "Meet the Makers".
  - *Current /story:* Left was text narrative, right was dark quote card.
  - *Adjustment:* Integrate narrative storytelling seamlessly. The dark quote card features large quotation mark `“` in gold (`#E0A63C`), italic serif body ("We don't just serve meals; we protect your moments of pause."), author footer with leaf flourish.
- **Colours & Shapes:**
  - Dark quote background: `--color-fk-quote: #4A4527`.
  - Corner radius: `--radius-fk-lg: 28px`.
  - Text: `--color-fk-paper-light: #F7F4E3`.

---

### Section 4: Atmosphere & Space Gallery (Curved Horizon #10)
- **Reference:**
  - Horizontal gallery strip displaying ambient venue spaces.
- **Current /story vs Requirement:**
  - Current `/story` had a basic flat `overflow-x: auto` scrollbar.
  - *Requirement:* Implement **Curved Horizon Gallery (#10 from effects-plan.md)**:
    - 5 verified interior photos:
      1. `fursat_space_13.webp` (Café Lounge & elephant emblem)
      2. `fursat_space_16.webp` (Houndstooth armchairs & acoustic nooks)
      3. `fursat_space_19.webp` (Craft Bar illuminated circular logo)
      4. `fursat_space_07.webp` (Main Dining Hall & royal blue armchairs)
      5. `fursat_space_03.webp` (Heritage Enclaves & chevron partitions)
    - Architecture: 3D perspective viewport (`perspective: 1200px`), rotating cylindrical horizon (`rotateY(calc(var(--angle))) translateZ(480px)`), interactive pointer/touch drag with velocity inertia.
    - Responsive & Accessibility Fallback: On `prefers-reduced-motion` or mobile touch fallbacks, provide a smooth horizontal scroll-snap gallery (`scroll-snap-type: x mandatory`).

---

### Section 5: Legal & Business Governance Box
- **Reference:**
  - Derived from Reference Slide 2 bottom card (`border-radius: 32px-36px`, background `#F4EDDD`, border `1px solid #DCD5C3`).
- **Current /story:**
  - Box structure matches well. Ensure 2-column desktop grid and 1-column mobile stack.
  - All regulatory details preserved verbatim:
    - Operating Brand: Fursat Kitchen | Bar (Café, Bar & Banquets)
    - Registered Entity: Alekya Reality / Fursat Hospitality LLP
    - FSSAI License: Marked `TODO(client)` (Pending official release)
    - Address: Level 3, Capital Park Building, Image Gardens Road, VIP Hills, Silicon Valley, Madhapur, Hyderabad, Telangana 500081
    - Hours: Open 7 Days a Week: 12:00 PM – 11:30 PM
    - Contact: +91 90596 70033 / +91 98483 60033 · hello@fursatind.in

---

## 3. Motion & Entrance Animation Architecture

Each section receives a distinct entrance animation executed exclusively on compositor layers (`transform` and `opacity` only):
1. **Hero Headline & Text:** Rise & fade (`translateY(24px) → translateY(0)`, `opacity: 0 → 1`).
2. **Hero Wave Frame:** Soft organic scale & reveal (`scale(0.94) → scale(1)`, `opacity: 0 → 1`).
3. **Split Narrative & Quote:** Clip wipe / slide reveal from opposite horizontal axes (`translateX(±20px) → 0`).
4. **Pillars Container:** Elevation rise & staggered card entrance (`translateY(30px) → 0`).
5. **Ritual Stepper:** Connecting line clip-path wipe (`inset(0 100% 0 0) → inset(0 0 0 0)`) and node pop.
6. **Curved Horizon Gallery:** 3D perspective entrance with subtle rotational settle.
7. **Legal Disclosure Box:** Soft upward settling transition.
8. **Accessibility:** Under `@media (prefers-reduced-motion: reduce)`, all transitions and keyframe animations are suppressed (`transition: none !important; animation: none !important; opacity: 1 !important; transform: none !important;`).
