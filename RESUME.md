# Session Resume Checklist

Small-fixes session. Tick each item after committing.

- [x] FIX 1: Offer modal opens WhatsApp, honest disclaimer (`src/components/MascotOfferModal.astro`)
- [x] FIX 2: Hide unconfirmed offer terms (`src/data/offers.json` + display components)
- [x] FIX 3: `/order` page WhatsApp takeaway (`src/pages/order.astro`)
- [x] FINAL: Build (14 pages), update `review/launch-readiness.md`, commit "docs: update readiness"
- [x] FIX 4a events.astro
- [x] FIX 4b reserve.astro scratch card
- [x] FIX 4c report
- [x] FIX 5 unconfirmed claims
- HERO 0 Baseline: Median LCP = 10.59s (perf: 62, tbt: 309ms, cls: 0)
- [x] HERO 1 remove bot
- [-] HERO 2 parked: .on is never added, 10.6s LCP cause unknown
- [-] HERO 3 parked: .on is never added, 10.6s LCP cause unknown
- [x] MENU 1: Extract PDF menu data to food.json and drinks.json
- [x] MENU 2: Replace existing menu data on menu page
- [x] MENU 3: Food / Drinks split switch on menu page
- [x] MENU 4: Build once (14 pages), commit docs: menu done
- [x] MENU 5a: Capability check — can agent produce .glb files? Report only, no source changes.
- [x] MENU 5b: (after owner reply) Generate .glb files into public/models/, commit "feat: menu glb assets"
- [x] MENU 6: Rotating 3D table on /menu using StageCanvas Three.js, lazy-loaded, commit "feat: menu 3d table"
- [x] MENU 7: Floating dish photos with counter + select showing name/desc/price, commit "feat: menu dish select"
