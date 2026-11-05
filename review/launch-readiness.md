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
| `/order` | `order.astro` | ⚠️ **COMING SOON** — banner reads "DIRECT ORDERING – COMING SOON" (line 23); only a WhatsApp takeaway link, no actual ordering |
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

**File:** `src/components/MascotOfferModal.astro` lines 606–618:

```js
// MascotOfferModal.astro lines 606–618
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const phone = phoneInput.value.trim();
  if (phone.length === 10 && /^\d+$/.test(phone)) {
    localStorage.setItem('fursat_offer_claimed', phone);  // ← stored locally only
    step1.hidden = true;
    step2.hidden = false;
  } else {
    alert('Please enter a valid 10-digit mobile number.');
  }
});
```

The phone number is **saved to `localStorage` only** (`fursat_offer_claimed`). It is **not sent anywhere** — no fetch, no beacon, no server endpoint, no WhatsApp message. The modal disclaimer says "No spam. We only send your reservation coupon via SMS/WhatsApp" but the code **does not send anything**. The number exists only in the visitor's own browser storage. The owner **never receives it**.

---

## 7. Verdict

**Can a customer today send a reservation that reaches the owner?**

**YES — conditionally.** The `/reserve` page opens a WhatsApp deep-link with a pre-filled message to `+91 90596 70033`. The reservation reaches the owner **only if** the customer completes two steps: (1) the WhatsApp tab opens successfully on their device (requires WhatsApp installed or WhatsApp Web logged in), and (2) the customer manually presses "Send" inside WhatsApp. There is no fallback if WhatsApp is unavailable, and there is no server-side record of any submission.

**Three blocking issues before launch:**

1. **Offer terms not client-confirmed.** `offers.json` has 6 `TODO(client)` flags on scope, timing, slot cap, and type. The offer is already displayed to visitors. Client must confirm every parameter before the domain goes live.
2. **Mascot modal collects phone numbers that go nowhere.** Visitors enter their number expecting "SMS/WhatsApp coupon delivery" but the number is silently dropped into their own localStorage. This is a broken promise and a potential consumer-protection issue.
3. **Legal / business data missing.** `site.json` has no legal entity name, GSTIN, FSSAI, or CIN — all legally required on an F&B website in India. The street address unit number is also missing.

**Smallest fix for #2 (phone number reaching owner):** Replace `localStorage.setItem(...)` with a `window.open('https://wa.me/919059670033?text=Hi+Fursat!+My+number+is+91'+phone+'...')` so the visitor's submission becomes a WhatsApp message the owner actually receives, consistent with every other CTA on the site. No backend needed.
