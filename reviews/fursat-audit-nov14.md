# FURSAT audit — 14 Nov 2026 (S3b, v5.13b)

Branch `design/reference-layout`, HEAD f8d0db8 + S3b changes. Build: **12 page(s) built**, same as the repo before.

How this was run: production build served locally, Lighthouse 13.6 (mobile emulation, defaults), Playwright + Chrome for keyboard and size checks, plus a read of the built HTML.
`audit-suite:full-audit` and `ux-ui-audit` are not available in this account, so this is a manual audit using the same areas (SEO, performance, accessibility, keyboard, UX). Nothing below is invented: every number comes from a run.

## Lighthouse mobile

| Page | Perf | A11y | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Home `/` | 70 | 100 | 96 | 100 | 3.0 s | 6.6 s | 120 ms | 0.003 |
| Menu `/menu/` | 62 | 98 | 96 | 100 | 4.7 s | 8.3 s | 70 ms | 0.075 |
| Reserve `/reserve/` | 72 | 100 | 96 | 100 | 3.3 s | 5.8 s | 70 ms | 0.001 |
| Party `/party/` | 71 | 100 | 96 | 100 | 2.9 s | 7.6 s | 20 ms | 0.001 |

Read these as relative, not absolute. The local server has no compression and no cache headers, so the "cache" (0.9–3.8 MB) and "document latency" items are test-server artifacts. Cloudflare Pages applies `_headers` and Brotli. The single "console error" on every page is the sandbox blocking Google Fonts (`ERR_TUNNEL_CONNECTION_FAILED`), not a site bug. Re-run on the deployed preview for final numbers.

## What S3b changed

- **Header** (`SiteHeader.astro`): Manrope removed (Poppins + Playfair only, verified on computed styles). Closed dropdown items take no Tab stops (`visibility:hidden`). Esc closes and returns focus to the button. ArrowDown/ArrowUp move through items. Tab out or an outside click closes. Phone menu moves focus in on open, wraps Tab inside, and Esc, the burger or widening the window returns focus to the burger. Visible focus ring added (the nav links used `all:unset`, which removed it). The phone panel now scrolls and clears the bottom bar (the last lines were unreachable on small phones). A stray extra `</script>` removed.
- **Skip link on /menu** (`menu.astro`): first Tab stop, 44 px tall, lands on `<main id="main" tabindex="-1">`.
- **SEO** (`Base.astro`, `ld.json`, `llms.txt.ts`): see "SEO fixed" below.
- **/ask Canned Juice** (`ask.astro`): ₹99 now matches. Cause: `CANNED JUICE` exists twice in drinks.json (₹99 Soft Drinks, ₹119 Tea) and the matcher kept only the last row.

### SEO fixed

- **7 pages had a broken og:image (404)**: home, cafe, catering, menu, order, reserve, restaurant-bar pointed at `/assets/fursat_space_NN.webp`, but the photos are in `/assets/interior/`. Base now resolves each image to a real file, and falls back to `/og-image.jpg` with a build warning if one is missing.
- **og:image width/height were hard-coded 1200×630** for every image. Now read from the file.
- **og:image alt**: pages that used `og-image.jpg` (party, terms, ask) said "a baby elephant sipping a pink Fursat cocktail". The photo is a brass bowl of biryani. The alt now describes the photo.
- **Canonical** now defaults to the page's own URL (it used to default to the home page).
- **JSON-LD**: one Restaurant node on every page (it was only home and reserve), built from site.json (name, phone, PIN, state, hours, menu URL). Its `image` and `logo` pointed at a 404 and at a food photo; they now point to a real photo and the real logo. The build stops if any TODO value reaches the JSON-LD.
- **llms.txt** now lists all 12 pages (Home was missing) and the build fails if a page file is added or removed without updating it.
- Verified on the built output: every page has a title, description, canonical, a working og:image and exactly one h1.

## Remaining issues

### High
1. **Visible TODO on /menu**: Sula Brut shows "TODO(client): Bottle only on menu; glass served as null" (`drinks.json`, `note` field, rendered as `.mv-note`). Breaks owner rule 2. Fix: remove the `note` (or set a real client-confirmed one).
2. **LCP is slow on mobile on all four pages (5.8–8.3 s, test-server conditions)**. Render-blocking CSS costs about 1.7–2.0 s on every page (11 stylesheets, `01.css`–`10.css` + `motion.css`, all loaded by Base). Menu is worst (LCP 8.3 s, CLS 0.075). Home's LCP element is the `fx-pl-rv` video. Party and Menu LCP are images with no preload/priority.

### Medium
3. **Manrope is still in use outside the header**: `01.css`, `07.css`, `SiteFooter`, `MobileBar`, `MascotOfferModal`, `Mascot`, `MarqueeStrip`, `ScrollStoryHome`, `index.astro`. Rule says Playfair + Poppins only. Base also still loads Cormorant Garamond from Google (`--fk-script` and `07.css` reference it). Owner decision.
4. **/ask hides two items on a data conflict**: `Ustad Special Nalli Gosht Biryani` is ₹599 in `public/data/menu.json` but ₹999 in `food.json`; `Cortado ₹229` is in `menu.json` but not in `drinks.json`. The matcher is right to hide them (rule 3). Client must confirm the price and whether Cortado exists.
5. **`CANNED JUICE ₹119` sits in the "Tea" section** of `drinks.json`. Probably a data entry error; check against client menu 7.
6. **Social cards will crop**: every og photo is portrait (3:4), cards want about 1.91:1. The JPG originals are 3–5 MB, so the webp is used. Best fix is 1200×630 crops per page (new files). `/og-image.jpg` is the fallback for party, terms and ask; please confirm it is a real Fursat photo.
7. **Social profile data disagrees**: `site.json` has `instagram.com/fursat.hyd`; `ld.json` and the footer use `fursatind.in`, `fursat_bitesandbuffet`, `fursatbanquets` (the footer also has `fursatsocialclub`). JSON-LD `sameAs` still uses the footer handles (the ones live on the site); `fursat.hyd` appears nowhere else. The second phone (+91 98483 60033) is in the footer and `ld.json` but not `site.json`.
8. **Party meta description is 182 characters**; Google cuts at about 155–160. Shorten in `party.astro`.
9. **Menu a11y 98**: heading order skips (an `h3` follows the h1 with no `h2`).
10. **Home a11y**: two buttons have visible text that does not match their accessible name (`label-content-name-mismatch`).

### Low
11. Unused CSS 160–260 KB per page; unused JS 525 KB on Home (three.js).
12. `public/data/menu.json.bak` ships to production (dead file, rule 4).
13. `site.json` `og.image` is `/og-home.jpg`, which does not exist and is not used.
14. `AGENTS.md` says "14 pages built" and Windows PowerShell; the build gives 12 and the Codespace shell is bash. Update it so the next session does not chase a false mismatch.
15. `site.json` still has `TODO(client)` for email, address line 1, map embed, legal entity, GSTIN, FSSAI, CIN, YouTube. None reach the built pages today (checked), and the JSON-LD gate keeps it that way.

## Tested

Keyboard (Chrome, 1366×634 and 390×844): closed dropdown has 0 Tab stops inside it; Enter opens; ArrowDown → first item; Esc closes and focus returns to the Menu button; Tab out closes; opening one closes the other; outside click closes; phone menu focus in/out/wrap all pass. No sideways scroll at 320, 390 and 768 with the phone menu open; burger is 44×44. Skip link on /menu: first Tab stop, 44 px, focus lands in `main`.
