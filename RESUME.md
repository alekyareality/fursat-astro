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
- [x] TASK E: /menu Drinks side = "Fursat bar counter" scene, commit "feat: menu drinks bar counter scene"
- [x] TASK F0: Housekeeping — delete FURSAT_HANDOFF_v9.md, create AGENTS.md, commit "docs: agent rules and remove v9 handoff"
- [x] TASK F: Home panoramic tour "Step inside Fursat", commit "feat: home panoramic tour"
- [x] TASK F1: WebGL rotunda engine & curved panels (`feat: tour 3d webgl rotunda canvas engine`)
- [x] TASK F2: Panel shader effects & particles (`feat: tour panel shader effects and particles`)
- [x] TASK F3: Camera fly-to, space drawer, gyro & panos (`feat: tour camera fly to, space drawer and panos`)
- [x] TASK F4: Fallback & a11y hardening (`feat: tour fallback and a11y hardening`)
- [x] TASK F5: Documentation & verification (`docs: tour 3d rotunda completed`)
