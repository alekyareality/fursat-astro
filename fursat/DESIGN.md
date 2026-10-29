# Fursat DESIGN.md

Astro, plain CSS/JS, Cloudflare Pages, fursatind.in. One goal: **reserve a table** (`data-open="book"` opens the booking dialog from any element).
Mode: Persuade. Dials: variance 6, motion 5, density 4. Focal motion: the masked reel reveal. Everything else is quiet feedback.
Skill order: bjnexus-design-rules > bjnexus-motion-rules > bjnexus-slop-audit > hallmark. House rules win on conflict.

## Colour (tokens at `:root` in `src/styles/10.css`; no literals elsewhere)
| Token | Value | Use |
|---|---|---|
| `--rl-bg` | #17200F | reels section field |
| `--rl-well` | #0D1308 | video/poster well |
| `--rl-ink` | #F4ECDA | text on dark (14.3:1 on bg) |
| `--rl-gold` | #E0A63C | primary action fill, focus ring on dark |
| `--rl-deep` | #1A1608 | text on gold/cream (8.3:1 on gold) |
| `--terracotta` | #C2431A | headings, flat (4.3:1 on cream: large text only) |
| `--pv-*` | ink #2A2514, ring #404517, hover #FFFDF6 | hero pause button |
Rules: no pure #000/#fff, no gradient text, tint neutrals toward olive/cream.

## Type
Fallback stacks: serif `"Playfair Display", Georgia, serif`; sans `"Manrope", system-ui, sans-serif`.
**OPEN: six families are loaded (Playfair, Manrope, Bricolage, Instrument Serif, Poppins, PF Embed). Owner must sign off which to keep; target is two.**
Headings: one face, one colour, no italic accent word, `text-wrap: balance`. Labels use the body face, sentence case, untracked.

## Spacing and layout
4px scale (8/12/16/24/32). Page gutter `--pad: clamp(20px, 5vw, 84px)`. Reel card width `--cw: min(70vw, min(74svh, 660px) * 9/16)`.
Check 360, 390, 768, 1280. No horizontal overflow.

## Motion
- Focal: reel reveal (clip-path inset + staggered heading words), expo-out `cubic-bezier(.16,1,.3,1)`. Leave the 0.5s card scale and progress bar alone.
- Feedback 100 to 150ms; every button `:active { transform: scale(.97) }`; transform and opacity only; never `transition: all`.
- Keyboard actions never animate (arrow keys jump instantly).
- Hovers only inside `@media (hover: hover)`. `touch-action: manipulation` on tappable media controls.
- Reduced motion: no autoplay, no spatial movement, opacity/colour feedback only.
- Content visible with JS off (hidden states scoped under `.js`; reels fall back to a poster list linking to Instagram).

## Reels
Order: Fursat Happened, Dynamite Prawns, Ustad Nalli Gosht Biryani (image), Veg Combo, Inside Fursat. No counter; the dish name shows position, `#rl-live` announces "Reel n of 5". One primary button under the strip (Reserve a table); Instagram link is secondary.

## Fixed, do not change
Header and logo. Hero video pause button behaviour (17.js until 10.js is supplied). `translate="no"` on FURSAT and dish names. noindex on pages.dev only.

## Open items
1. Font sign-off (above). 2. `width`/`height` on `#af-logo` (needs logo size). 3. Remove 4 `!important` gradient-text overrides in 10.css at their source (needs old CSS). 4. Replace 17.js `v.play` override with a paused flag (needs 10.js). 5. Hallmark stamp on line 1 of the first CSS file. 6. Real hero assets in `public/assets`.
