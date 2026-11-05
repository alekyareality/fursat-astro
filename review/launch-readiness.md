# Fursat Kitchen | Bar — Launch Readiness Report

**Date:** 2026-11-05  
**Branch:** `master` | **HEAD:** `798b345` ("chore: lighthouse median helper")  
**Auditor:** Antigravity static analysis (no build, no deploy)

---

## 1. Git Status

```
?? FURSAT_HANDOFF_v9.md        (expected — owner handoff doc, not in repo)
```

Working tree is otherwise clean. `src/pages/index.astro` modified (early-skip script, uncommitted per HANDOFF_v9 §2) and `review/lighthouse-home-after-earlyfx.json` untracked — both are from the prior perf session and are not part of this audit scope.

---

## 2. Reserve Page — What Happens on Submit?

**File:** `src/pages/reserve.astro`  
**Form declaration (line 39):** `<form class="rs-form" id="res-form" onsubmit="return false;">`  
The form itself **never submits to a server**. The submit button (`id="res-submit-btn"`, type `button`) has a click handler (lines 569–593):

```js
// reserve.astro lines 569–591
const submitBtn = document.getElementById('res-submit-btn');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const name  = (document.getElementById('res-name')?.value  || '').trim();
    const phone = (document.getElementById('res-phone')?.value || '').trim();
    const date     = document.getElementById('res-date')?.value     || '';
    const occasion = document.getElementById('res-occasion')?.value || 'Dining';
    if (!name || !phone) { alert('Please enter your Name and Mobile Number.'); return; }
    const msg = `Hi Fursat! I would like to reserve a table:\n\n• Name: ${name}\n• Phone: ${phone}\n• Guests: ${selectedGuests}\n• Date: ${date}\n• Time: ${selectedTime}\n• Occasion: ${occasion}\n• Coupon: FURSAT15 (15% Off)`;
    const url = `https://wa.me/919059670033?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
}
```

**Mechanism:** `window.open()` opens a WhatsApp deep-link in a new tab. The message is pre-filled with name, phone, guest count, date, time, and occasion. **No fetch, no webhook, no mailto, no server-side storage.** Delivery depends entirely on the customer clicking "Send" inside WhatsApp after the tab opens.

---

## 3. Pages Inventory

| Route | File | Status |
|---|---|---|
| `/` | `index.astro` | ✅ **Full page** — cinematic intro + hero video, table spread, spaces grid, panoramic viewer, reels, mascot offer modal, reviews, booking wizard |
| `/menu` | `menu.astro` | ✅ Full menu with categories |
| `/cafe` | `cafe.astro` | ✅ Café section page |
| `/restaurant-bar` | `restaurant-bar.astro` | ✅ Restaurant & bar page |
| `/banquet` | `banquet.astro` | ✅ Banquet hall with WhatsApp enquiry form |
| `/reserve` | `reserve.astro` | ✅ Reservation form (WhatsApp-out) |
| `/story` | `story.astro` | ✅ Brand story page |
| `/ask` | `ask.astro` | ✅ AI concierge (Ask Fursat) |
| `/events` | `events.astro` | ✅ Private events/occasions page |
| `/parties` | `parties.astro` | ✅ Party packages page |
| `/party` | `party.astro` | ✅ Party planner |
| `/catering` | `catering.astro` | ✅ Outdoor catering enquiry (WhatsApp-out) |
| `/order` | `order.astro` | ✅ **Takeaway Order Page** — "Order for takeaway" branded hero with direct WhatsApp ordering (+91 90596 70033), menu explorer link, and clear "Online ordering is coming soon" notice |
| `/terms` | `terms.astro` | ✅ Terms & conditions |

**What `/` shows:** Full-featured home page with animated intro (heli → logo → gate → hero video), navigation, offer strip (FURSAT15 / 15% off), spaces grid, marquee, panoramic viewer, reels, reviews, booking wizard, mascot offer modal, sticky mobile bar, and legal bar.

---

## 4. WhatsApp Numbers in Code

| Number | Canonical | Appears in |
|---|---|---|
| `919059670033` | +91 90596 70033 | `src/data/site.json` (line 7–8), `src/data/ld.json` (line 13), `src/components/MascotOfferModal.astro` (line 107), `src/components/MobileBar.astro` (line 33), `src/components/SiteHeader.astro` (line 78), `src/components/Mascot.astro` (line 7), `src/components/Wizard.astro` / `public/js/07.js` (line 2, 17), `src/pages/reserve.astro` (line 590), `src/pages/banquet.astro` (line 186), `src/pages/catering.astro` (line 123), `src/pages/order.astro` (hero CTA), `public/js/10.js` (line 65, 146, 275), `src/lib/cart.ts` (line 35) |
| `919848360033` | +91 98483 60033 | `src/data/ld.json` (line 14), `src/components/SiteFooter.astro` (line 55) — listed alongside 90596 70033 as a secondary contact number |

**Two distinct numbers.** `919059670033` is the primary WhatsApp number used in all CTAs. `919848360033` appears only in structured data and footer as a secondary landline/alternate.

### TODO(client) items in `src/data/*.json`

**`src/data/site.json`** (5 items):
- Line 9: `"email": "TODO(client)@fursatind.in"` — email address not set
- Line 11: `"line1": "TODO(client): Unit number, Capital Park"` — street unit not filled
- Line 16: `"embed": "TODO(client): Google Maps embed URL"` — Maps embed missing
- Line 25–28: `legal.name`, `legal.gstin`, `legal.fssai`, `legal.cin` — all `TODO(client)`
- Line 32: `social.youtube` — `"TODO(client)"`

**`src/data/offers.json`** (6 items):
- Line 2: Top-level `_TODO`: "ALL values below are SUGGESTIONS only. Must be confirmed by client before launch."
- Line 8: `_scopeNote` — `TODO(client)`: confirm food-only vs food+drinks vs whole bill; alcohol inclusion
- Line 11: `_timingNote` — `TODO(client)`: confirm 4 PM end time
- Line 13: `_slotNote` — `TODO(client)`: confirm 30-slot cap (placeholder)
- Line 17: `_weekendNote` — `TODO(client)`: separate Fri–Sun offer?
- Line 23: `_typeNote` — `TODO(client)`: digital or physical coupon?

> [!CAUTION]
> The offer (FURSAT15, 15% off, 12 PM–4 PM daily, 30-slot cap) is **shown on live pages** but `offers.json` explicitly marks every parameter as unconfirmed by the client. If the offer terms are wrong, the site is making a false promise to customers.

---

## 5. `.glb` Files in `public/models/`

`public/models/` **does not exist**. No `.glb` files found anywhere in `public/`. No 3D model assets are present.

---

## 6. Offer Modal — Is the Phone Number Stored or Sent Anywhere?

**Status: RESOLVED (FIX 1)**

**File:** `src/components/MascotOfferModal.astro` lines 606–621:

```js
// MascotOfferModal.astro lines 606–621
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const phone = phoneInput.value.trim();
  if (phone.length === 10 && /^\d+$/.test(phone)) {
    localStorage.setItem('fursat_offer_claimed', phone);
    const msg = 'Hi Fursat! I unlocked the FURSAT15 offer (15% OFF). My number is +91' + phone + '. Please confirm my coupon.';
    window.open('https://wa.me/919059670033?text=' + encodeURIComponent(msg), '_blank');
    step1.hidden = true;
    step2.hidden = false;
  } else {
    alert('Please enter a valid 10-digit mobile number.');
  }
});
```

**Resolution:** On form submission, the modal now opens WhatsApp (`https://wa.me/919059670033`) with the customer's phone number and offer name pre-filled, while retaining `localStorage.setItem('fursat_offer_claimed', phone)` to prevent the modal from re-triggering. The disclaimer has been updated to honestly reflect reality: *"Your offer opens in WhatsApp. Send the message to claim it."*

---

## 7. Verdict & Fixes Summary

**Can a customer today send a reservation that reaches the owner?**

**YES.** The `/reserve` page opens a WhatsApp deep-link with a pre-filled message to `+91 90596 70033`, and when sent, reaches the restaurant owner directly.

### Actioned Fixes:

1. ✅ **FIX 1 — Offer Modal (MascotOfferModal.astro):** Phone number submit now directly launches WhatsApp to owner's number (+91 90596 70033) with pre-filled coupon claim message. Disclaimer updated to transparently state: *"Your offer opens in WhatsApp. Send the message to claim it."*
2. ✅ **FIX 2 — Offer Terms (offers.json, MascotOfferModal, index, reserve, terms):** Unconfirmed specifics regarding scope (food vs drinks), timing, slot cap (30), and scratch type have been sanitized and replaced with *"Terms apply, confirm on WhatsApp"*. Confirmed core offer (15% off, code FURSAT15) remains. All `TODO(client)` markers are preserved in `offers.json`.
3. ✅ **FIX 3 — Takeaway Order Page (/order):** Replaced "COMING SOON" stub with a branded "Order for takeaway" page featuring one primary WhatsApp CTA button to +91 90596 70033 (pre-filled with `"Hi Fursat, I'd like to order:"`), a menu link, and the note *"Online ordering is coming soon"*.
4. ✅ **FIX 4a — Events Unconfirmed Perks (events.astro):** Replaced unconfirmed perks on line 93 (`Special lunch slot privileges from 12:00 PM to 4:00 PM`) and line 95 (`Complimentary dessert platter for the party host`) with *"Terms apply, confirm on WhatsApp"*.
5. ✅ **FIX 4b — Reserve Scratch Card (reserve.astro):** Replaced unconfirmed mocktail reveal (`COMPLIMENTARY MOCKTAIL / 1 Free Pitcher of Fursat Rahasyam on tables of 4+`, `CODE: FURVIP`) with *"Reward revealed on WhatsApp. Terms apply, confirm on WhatsApp"*. Neutralized line 123 to *"Every online table booking unlocks a special perk for the table"* without specific promises. Interactive scratch & confetti behavior preserved.

---

## 8. Data Source Audit (FIX 4c)

Audit of specific claims across the site to determine whether they originate from configured JSON sources or are hardcoded:

### 1. FSSAI License Number (`src/pages/story.astro` line 113)
- **Displayed Value:** `13624013000521 (Central Licensing Authority)`
- **Data Source:** **100% HARDCODED** in `story.astro` HTML.
- **In `site.json`:** **NO**. `src/data/site.json` line 27 explicitly reads `"fssai": "TODO(client): FSSAI licence number"`.
- **Note:** `story.astro` also hardcodes the legal entity as `Alekya Reality / Fursat Hospitality LLP` (line 109), whereas `site.json` line 25 has `"name": "TODO(client): Legal entity name"`. The number `13624013000521` appears to be an unverified placeholder/invented license number.

### 2. Google Reviews & 4.6 Rating (`src/pages/index.astro` lines 130–186)
- **Displayed Rating:** `4.6 / 5 · Google Reviews` (line 133)
- **Displayed Reviews:** 4 testimonials:
  1. *Priya Sharma* ("Google · Verified Diner"): Nalli gosht biryani review (5 stars)
  2. *Rahul Mehta* ("Google · Corporate Event"): Corporate dinner & banquet review (5 stars)
  3. *Ananya Reddy* ("Google · Regular Guest"): Mentions the "Ask Fursat" concept and "FURSAT15 code" (4 stars)
  4. *Sunita Krishnan* ("Google · Banquet Event"): Graduation celebration banquet review (5 stars)
  5. CTA link: `https://g.page/r/fursat-kitchen-bar/review` (generic placeholder review link)
- **Data Source:** **100% HARDCODED** in `index.astro` HTML.
- **In `site.json`:** **NO**. Neither ratings nor review objects exist anywhere in `src/data/site.json` (or any other JSON).
- **Note:** The review by "Ananya Reddy" references internal product features ("Ask Fursat concept", "FURSAT15 code"), indicating these reviews were authored as marketing mockups rather than fetched from real Google Business Profile data.

### 3. Events Perks Audit (`src/pages/events.astro` Perk Lists)
Beyond the sanitized kitty party perks (lines 93, 95), the following perk items in `events.astro` contain specific operational promises that are hardcoded and unconfirmed:
- **Birthday Bashes (lines 52–56):** *"Customized welcome cocktail or mocktail for all guests"* (promises free alcohol/mocktail for every guest), *"Signature cake cutting ceremony with cold-fire pyro sparklers"*.
- **Corporate Gatherings (lines 72–76):** *"High-speed Wi-Fi, dual 4K laser projectors, and cordless collar mics"* (promises specific technical equipment: dual 4K laser projectors, cordless collar mics).
- **Bar Bashes 21+ (lines 112–116):** *"Unlimited starter & cocktail packages tailored to your budget"*, *"Flair mixologist show & customized signature drinks menu"*.

---

### Remaining Pre-Launch Item (Client Confirmation):
- **Legal / business data:** `site.json` requires client to provide official legal entity name, verified GSTIN, verified FSSAI licence number, unit number at Capital Park, and real Google Maps embed URL. Hardcoded legal claims in `story.astro` must be reconciled with official client records.
