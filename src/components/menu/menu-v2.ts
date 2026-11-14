// /menu client script: picks, side switching, 21+ notice, search + filters, scroll-spy,
// sticky chips, scroll entrance, cursor photo reveal, phone dish sheet, sliding active pill.
// No framework, no animation library.
import { reducer, keyOf, money, total, count, waLink, type Line, type MenuItem } from './cart';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
type Side = 'food' | 'drinks';

const root = $('.mv');
if (root) init(root);

function init(root: HTMLElement) {
  const stage = $('.mv-stage')!;

  /* ── picks ─────────────────────────────────────────────── */
  const KEY = 'fursat_picks_v2';
  let lines: Line[] = [];
  try { lines = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch { lines = []; }
  // spoken status for the picks: "2 items in Picks, subtotal ₹..." after every add / remove (the open dish card has its own status)
  const live = document.createElement('p');
  live.className = 'mv-sr'; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
  root.append(live);
  let lastN = count(lines), ready = false;
  const cnt = $('#mv-cnt')!, sub = $('#mv-sub')!, wa = $<HTMLAnchorElement>('#mv-wa')!, listEl = $('#mv-picks-list')!;
  const panel = $('#mv-picks-panel')!, toggle = $('#mv-picks-toggle')!, bag = $('#mv-bag')!, picksEl = $('#mv-picks')!;
  const cntMini = $('#mv-cnt-mini')!, bagMini = $('#mv-bag-mini')!;

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  function render(pop = false) {
    cnt.textContent = cntMini.textContent = picksEl.dataset.count = String(count(lines));
    sub.textContent = money(total(lines));
    if (pop && !reduce) { [cnt, cntMini].forEach((c) => c.classList.add('is-pop')); setTimeout(() => [cnt, cntMini].forEach((c) => c.classList.remove('is-pop')), 90); }
    const has = lines.length > 0;
    wa.setAttribute('aria-disabled', has ? 'false' : 'true');
    wa.href = has ? waLink(lines) : '#';
    wa.tabIndex = has ? 0 : -1;
    listEl.innerHTML = has
      ? lines.map((l) => `<li><span>${esc(l.item.n)}</span><span class="q"><button type="button" data-dec="${esc(l.key)}" aria-label="One less ${esc(l.item.n)}">−</button><b class="num">${l.qty}</b><button type="button" data-inc="${esc(l.key)}" aria-label="One more ${esc(l.item.n)}">+</button></span><b class="num">${money(l.item.p * l.qty)}</b></li>`).join('')
      : '<li style="grid-template-columns:1fr"><span>Nothing here yet. Tap + on any dish or drink.</span></li>';
    try { sessionStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
    root.dispatchEvent(new CustomEvent('mv:picks'));
    const n = count(lines);
    if (ready && n !== lastN && !($<HTMLDialogElement>('#mv-sheet')?.open)) live.textContent = n ? `${n} ${n === 1 ? 'item' : 'items'} in Picks, subtotal ${money(total(lines))}` : 'Picks are empty';
    lastN = n;
  }
  render();
  ready = true;

  const itemFrom = (b: HTMLElement): MenuItem => ({
    n: b.dataset.n || '', p: Number(b.dataset.p), c: b.dataset.c || '', k: (b.dataset.k as MenuItem['k']) || 'food',
    v: b.dataset.v, a: b.dataset.a === '1', img: b.dataset.img,
  });

  const FLY = 450;
  function fly(from: HTMLElement, item: MenuItem) {
    if (reduce) return;
    const r = from.getBoundingClientRect(), t = (picksEl.classList.contains('is-compact') ? bagMini : bag).getBoundingClientRect();
    if (!t.width) return;
    const el = document.createElement('div'); el.className = 'mv-fly';
    const dot = document.createElement('i');
    if (item.img) dot.style.backgroundImage = `url(${item.img})`; else dot.textContent = item.n.trim()[0] || '';
    el.appendChild(dot); document.body.appendChild(el);
    const sx = r.left + r.width / 2 - 22, sy = r.top + r.height / 2 - 22, ex = t.left + t.width / 2 - 22, ey = t.top + t.height / 2 - 22;
    el.animate([{ transform: `translateX(${sx}px)` }, { transform: `translateX(${ex}px)` }], { duration: FLY, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
    dot.animate([
      { transform: `translateY(${sy}px) scale(1)`, opacity: 1 },
      { transform: `translateY(${Math.min(sy, ey) - 90}px) scale(.9)`, offset: 0.45 },
      { transform: `translateY(${ey}px) scale(.45)`, opacity: 0.9 },
    ], { duration: FLY, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    setTimeout(() => el.remove(), FLY + 40);
  }

  const closePanel = () => { panel.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); };
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const add = t.closest<HTMLElement>('[data-add]');
    if (add && Number.isFinite(Number(add.dataset.p))) {
      const item = itemFrom(add);
      lines = reducer(lines, { t: 'add', item });
      if (add.hasAttribute('data-nofly')) { render(true); return; } // the phone sheet sits above the bag: no flight
      fly(add, item);
      setTimeout(() => render(true), reduce ? 0 : FLY);
      return;
    }
    const inc = t.closest<HTMLElement>('[data-inc]'), dec = t.closest<HTMLElement>('[data-dec]');
    if (inc) { const l = lines.find((x) => x.key === inc.dataset.inc); if (l) lines = reducer(lines, { t: 'add', item: l.item }); render(); }
    if (dec) { lines = reducer(lines, { t: 'dec', key: dec.dataset.dec! }); render(); }
    if (t.closest('#mv-clear')) { lines = reducer(lines, { t: 'clear' }); render(); }
  });
  toggle.addEventListener('click', () => {
    const open = panel.hasAttribute('hidden');
    panel.toggleAttribute('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hasAttribute('hidden')) { closePanel(); toggle.focus(); } });
  document.addEventListener('click', (e) => {
    // composedPath survives the list re-render that detaches the clicked +/- button
    const path = e.composedPath();
    const inside = path.includes(picksEl) || path.some((n) => n instanceof HTMLElement && n.hasAttribute('data-add'));
    if (!panel.hasAttribute('hidden') && !inside) closePanel();
  });
  wa.addEventListener('click', (e) => { if (wa.getAttribute('aria-disabled') === 'true') e.preventDefault(); });

  // Collapse the pill to bag + count while the page scrolls; expand 700ms after it stops.
  // Never while the list panel is open or focus is inside the pill (keyboard users keep the full bar).
  let compactTimer = 0, lastY = scrollY, holdUntil = 0;
  const expand = () => picksEl.classList.remove('is-compact');
  addEventListener('scroll', () => {
    if (Math.abs(scrollY - lastY) < 6) return;
    lastY = scrollY;
    if (performance.now() > holdUntil && panel.hasAttribute('hidden') && !picksEl.matches(':focus-within')) picksEl.classList.add('is-compact');
    clearTimeout(compactTimer); compactTimer = window.setTimeout(expand, 700);
  }, { passive: true });
  picksEl.addEventListener('focusin', expand);
  $('#mv-picks-mini')!.addEventListener('click', () => { holdUntil = performance.now() + 1500; expand(); });

  // The picks pill is fixed to the viewport; fade it out while the footer is on screen.
  const footer = $('footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => picksEl.classList.toggle('is-hidden', en.isIntersecting), { threshold: 0.05 }).observe(footer);
  }

  /* ── side, rail, chips, 21+ ───────────────────────────── */
  const AGE = 'fursat_age_ok';
  const ageOk = () => { try { return localStorage.getItem(AGE) === '1'; } catch { return false; } };
  const dlg = $<HTMLDialogElement>('#mv-age')!;
  let pending: (() => void) | null = null;

  function setSide(side: Side) {
    root.dataset.side = side;
    $$('[data-rail]').forEach((ul) => ul.toggleAttribute('hidden', ul.dataset.rail !== side));
    $$('[data-schips]').forEach((d) => d.toggleAttribute('hidden', d.dataset.schips !== side));
    $$('[data-seg]').forEach((b) => b.classList.toggle('is-on', b.dataset.seg === side));
    placeSlides(true);
  }
  function centerIn(btn: HTMLElement | null) {
    const box = btn?.parentElement;
    if (!btn || !box || box.scrollWidth <= box.clientWidth) return;
    const left = btn.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft - box.clientWidth / 2 + btn.offsetWidth / 2;
    box.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }
  function mark(id: string | null) {
    $$('.mv-rw').forEach((b) => b.classList.toggle('is-on', b.dataset.go === id));
    $$('.mv-chip').forEach((b) => b.classList.toggle('is-on', (b.dataset.chip === 'all' && !id) || b.dataset.chip === id));
    $$('.mv-schip').forEach((b) => { const on = b.dataset.go === id; b.classList.toggle('is-on', on); if (on && b.offsetParent) centerIn(b); });
    placeSlides(true);
  }
  const scrollTo = (el: Element | null) => el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  function need21(side: Side, run: () => void) {
    if (side === 'drinks' && !ageOk()) { pending = run; if (!dlg.open) dlg.showModal(); return; }
    run();
  }
  function go(id: string | null, side?: Side) {
    const sd = side || (id && id.startsWith('d-') ? 'drinks' : id && id.startsWith('f-') ? 'food' : (root.dataset.side as Side));
    need21(sd, () => { setSide(sd); mark(id); scrollTo(id ? document.getElementById('g-' + id) : $('#mv-list')); });
  }
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const sgo = t.closest<HTMLElement>('[data-side-go]');
    if (sgo) { const s = sgo.dataset.sideGo as Side; go(s === 'drinks' ? 'd-cocktails' : 'f-biryani', s); return; }
    const g = t.closest<HTMLElement>('[data-go]');
    if (g) { go(g.dataset.go!, g.dataset.sideOf as Side | undefined); return; }
    const chip = t.closest<HTMLElement>('[data-chip]');
    if (chip) { const id = chip.dataset.chip!; go(id === 'all' ? null : id, (chip.dataset.sideOf as Side) || undefined); }
  });
  $('#mv-age-open')!.addEventListener('click', () => { pending = null; dlg.showModal(); });
  dlg.addEventListener('close', () => {
    if (dlg.returnValue === 'yes') { try { localStorage.setItem(AGE, '1'); } catch { /* ignore */ } const run = pending; pending = null; run?.(); }
    else if (dlg.returnValue === 'no') { pending = null; go('f-biryani', 'food'); }
    dlg.returnValue = '';
  });

  /* ── sliding active pill (rail, chips, toggle): one clipped fill moves under the labels ── */
  type Slide = { box: HTMLElement; el: HTMLElement; sel: string; placed: boolean };
  const slides: Slide[] = [];
  function placeSlides(animate: boolean) {
    slides.forEach((sl) => {
      const { box, el } = sl;
      if (!box.offsetWidth) { sl.placed = false; return; } // hidden side: place when it shows
      const on = box.querySelector<HTMLElement>(sl.sel + '.is-on');
      if (!on) { el.style.clipPath = 'inset(0 100% 100% 0)'; return; }
      const W = box.scrollWidth, H = box.scrollHeight, b = box.getBoundingClientRect(), r = on.getBoundingClientRect();
      const l = r.left - b.left + box.scrollLeft - box.clientLeft, t = r.top - b.top + box.scrollTop - box.clientTop;
      const rad = Math.min(parseFloat(getComputedStyle(on).borderTopLeftRadius) || 0, r.height / 2);
      el.style.width = W + 'px'; el.style.height = H + 'px';
      el.classList.toggle('no-anim', !animate || !sl.placed);
      el.style.clipPath = `inset(${t}px ${W - l - r.width}px ${H - t - r.height}px ${l}px round ${rad}px)`;
      sl.placed = true;
    });
  }
  if (!reduce) { // reduced motion keeps the plain colour change on the chip itself
    [['.mv-rail-list', '.mv-rw', false], ['.mv-chips', '.mv-chip', false], ['.mv-schips', '.mv-schip', true], ['.mv-seg', '.mv-seg-b', false]].forEach(([bs, sel, tint]) => {
      $$(bs as string).forEach((box) => {
        const el = document.createElement('span');
        el.className = 'mv-slide' + (tint ? ' mv-slide--tint' : ''); el.setAttribute('aria-hidden', 'true');
        box.prepend(el); box.classList.add('has-slide');
        slides.push({ box, el, sel: sel as string, placed: false });
        if ('ResizeObserver' in window) new ResizeObserver(() => placeSlides(false)).observe(box);
      });
    });
    requestAnimationFrame(() => placeSlides(false));
    document.fonts?.ready.then(() => placeSlides(false));
  }

  /* ── edge fades on the two chip rows (no hard cut against the toggle or the screen edge) ── */
  $$('.mv-chips, .mv-schips').forEach((el) => {
    const upd = () => {
      el.style.setProperty('--fl', el.scrollLeft > 4 ? '22px' : '0px');
      el.style.setProperty('--fr', el.scrollLeft + el.clientWidth < el.scrollWidth - 4 ? '22px' : '0px');
    };
    el.addEventListener('scroll', upd, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(upd).observe(el);
    upd();
  });

  /* ── scroll-spy: keeps rail, chips and sticky chips on the group in view ── */
  const groups = $$('.mv-grp');
  const seen = new Set<Element>();
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
      if (window.scrollY < stage.offsetHeight * 0.5) return; // stage still in charge
      // the group whose top has passed the sticky offset (largest top <= 200px); else the first one in view
      const inView = groups.filter((g) => seen.has(g)).map((g) => [g, g.getBoundingClientRect().top] as const);
      const passed = inView.filter(([, t]) => t <= 200).sort((a, b) => b[1] - a[1])[0];
      const top = (passed || inView[0])?.[0];
      if (!top) return;
      const id = top.getAttribute('data-group')!;
      setSide(id.startsWith('d-') ? 'drinks' : 'food');
      mark(id);
    }, { rootMargin: '-140px 0px -62% 0px' });
    groups.forEach((g) => spy.observe(g));
  }

  /* ── search (highlight) + diet filters ────────────────── */
  const q = $<HTMLInputElement>('#mv-q')!, countEl = $('#mv-count')!, emptyEl = $('#mv-empty')!;
  const rows = $$('[data-row]');
  const names = new Map(rows.map((r) => [r, $('.mv-iname', r)!]));
  const descs = new Map(rows.map((r) => [r, $('.mv-idesc', r)]));
  const orig = new Map<Element, string>();
  names.forEach((el) => orig.set(el, el.textContent || ''));
  descs.forEach((el) => el && orig.set(el, el.textContent || ''));
  const diets = new Set<string>();
  let jumped = false, timer = 0;
  const reEsc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function hl(el: Element, text: string, toks: string[]) {
    if (!toks.length) { el.textContent = text; return; }
    const re = new RegExp('(' + toks.map(reEsc).join('|') + ')', 'ig');
    el.innerHTML = esc(text).replace(re, '<mark>$1</mark>');
  }
  function filter() {
    const toks = q.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const active = toks.length > 0 || diets.size > 0;
    let shown = 0;
    rows.forEach((li) => {
      const veg = li.dataset.veg === '1', spicy = li.dataset.spicy === '1', text = li.dataset.text || '';
      let ok = toks.every((tk) => text.includes(tk));
      if (ok && diets.has('veg') && !veg) ok = false;
      if (ok && diets.has('nonveg') && veg) ok = false;
      if (ok && diets.has('spicy') && !spicy) ok = false;
      li.toggleAttribute('hidden', !ok);
      if (ok) { shown++; hl(names.get(li)!, orig.get(names.get(li)!)!, toks); const d = descs.get(li); if (d) hl(d, orig.get(d)!, toks); }
    });
    ['.mv-sec', '.mv-grp', '.mv-side'].forEach((sel) => $$(sel).forEach((s) => s.toggleAttribute('hidden', !s.querySelector('[data-row]:not([hidden])'))));
    emptyEl.toggleAttribute('hidden', shown > 0 || !active);
    countEl.textContent = active ? (shown ? `${shown} item${shown === 1 ? '' : 's'}` : 'No matches') : '';
    if (active && !jumped) { jumped = true; scrollTo($('#mv-list')); }
    if (!active) jumped = false;
  }
  q.addEventListener('input', () => { clearTimeout(timer); timer = window.setTimeout(filter, 120); });
  q.closest('form')?.addEventListener('submit', (e) => e.preventDefault());
  $$('[data-diet]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.diet!; const on = !diets.has(k);
    on ? diets.add(k) : diets.delete(k);
    if (on && k === 'veg') { diets.delete('nonveg'); $('[data-diet="nonveg"]')!.setAttribute('aria-pressed', 'false'); }
    if (on && k === 'nonveg') { diets.delete('veg'); $('[data-diet="veg"]')!.setAttribute('aria-pressed', 'false'); }
    b.setAttribute('aria-pressed', String(on));
    filter();
  }));

  /* ── scroll entrance: rows below the fold fade + rise 8px once (30ms stagger, first 6 of a batch) ── */
  if (!reduce && 'IntersectionObserver' in window) {
    const below = rows.filter((r) => r.getBoundingClientRect().top > innerHeight);
    below.forEach((r) => r.classList.add('mv-pre'));
    const io = new IntersectionObserver((entries) => {
      let k = 0;
      entries.filter((en) => en.isIntersecting).forEach((en) => {
        const el = en.target as HTMLElement;
        el.style.transitionDelay = `${Math.min(k++, 6) * 30}ms`;
        el.classList.add('is-in'); io.unobserve(el);
        setTimeout(() => { el.classList.remove('mv-pre', 'is-in'); el.style.transitionDelay = ''; }, 500);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    below.forEach((r) => io.observe(r));
  }

  /* ── cursor photo reveal (fine pointers, ≥1280px, rows with a real photo) ──
     The photo sits in a gutter right of the list and follows the cursor's height only,
     so it never covers a name, a price or a + button. */
  const rev = $('#mv-reveal');
  const revImg = rev?.querySelector('img');
  const wide = matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
  if (rev && revImg && finePointer && !reduce) {
    let ty = 0, y = 0, vy = 0, gx = 0, raf = 0, on = false;
    const W = 220, H = 160;
    const listIn = $('.mv-list-in')!, sticky = $('#mv-sticky')!;
    const place = () => {
      y += (ty - y) * 0.15;
      const tilt = Math.max(-4, Math.min(4, vy * 0.2)); vy *= 0.85;
      rev.style.transform = `translate(${gx}px,${y}px) rotate(${tilt}deg)`;
      raf = on ? requestAnimationFrame(place) : 0;
    };
    const aim = (e: PointerEvent) => {
      const r = listIn.getBoundingClientRect();
      gx = Math.round(r.right - parseFloat(getComputedStyle(listIn).paddingRight) + 24);
      const pill = picksEl.getBoundingClientRect();
      const floor = Math.min(innerHeight - H - 12, (pill.width && !picksEl.classList.contains('is-hidden') ? pill.top : innerHeight) - H - 12);
      const ceil = sticky.getBoundingClientRect().bottom + 12;
      vy = e.movementY; ty = Math.max(ceil, Math.min(floor, e.clientY - H / 2));
    };
    const show = (e: PointerEvent, src: string) => {
      if (!wide.matches) return;
      if (revImg.getAttribute('src') !== src) revImg.setAttribute('src', src);
      aim(e); if (!on) y = ty;
      on = true; rev.classList.add('is-on'); if (!raf) raf = requestAnimationFrame(place);
    };
    const hide = () => { on = false; rev.classList.remove('is-on'); };
    rows.filter((r) => r.dataset.img).forEach((r) => {
      r.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(e, r.dataset.img!); });
      r.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') show(e, r.dataset.img!); });
      r.addEventListener('pointerleave', hide);
    });
    addEventListener('scroll', hide, { passive: true });
  }

  /* ── sticky chips follow the site header (it slides away on scroll down) ── */
  const header = $('.sh-header');
  if (header) {
    const sync = () => root.style.setProperty('--mv-top', Math.max(0, Math.round(header.getBoundingClientRect().bottom)) + 'px');
    let until = 0, ticking = false;
    const loop = () => { sync(); ticking = performance.now() < until; if (ticking) requestAnimationFrame(loop); };
    const kick = (ms: number) => { until = performance.now() + ms; if (!ticking) { ticking = true; requestAnimationFrame(loop); } };
    new MutationObserver(() => kick(500)).observe(header, { attributes: true, attributeFilter: ['class'] });
    addEventListener('scroll', () => kick(80), { passive: true });
    sync();
  }

  /* ── dish detail sheet (phones): tap a dish, drag down / Esc / back / X to close ── */
  const sheet = $<HTMLDialogElement>('#mv-sheet');
  if (sheet) {
    const phone = matchMedia('(max-width: 720px)');
    const panelEl = $('#mv-sheet-panel')!, dragEl = $('#mv-sheet-drag')!, phEl = $('#mv-sheet-ph')!;
    const secEl = $('#mv-sheet-sec')!, nameEl = $('#mv-sheet-name')!, tagsEl = $('#mv-sheet-tags')!, descEl = $('#mv-sheet-desc')!;
    const noteEl = $('#mv-sheet-note')!, priceEl = $('#mv-sheet-price')!, statEl = $('#mv-sheet-status')!;
    const addBtn = $<HTMLButtonElement>('#mv-sheet-add')!, xBtn = $('#mv-sheet-x')!;
    const opens = $$<HTMLButtonElement>('.mv-open');
    const syncInert = () => opens.forEach((b) => b.toggleAttribute('inert', !phone.matches));
    syncInert();
    let opener: HTMLElement | null = null, pushed = false, closing = false, flashing = false, flashT = 0, closeT = 0;

    const el = (tag: string, cls: string, text = '') => { const n = document.createElement(tag); n.className = cls; if (text) n.textContent = text; return n; };
    function status() {
      const key = keyOf(itemFrom(addBtn)); const q = lines.find((l) => l.key === key)?.qty || 0;
      statEl.textContent = q ? `${flashing ? 'Added · ' : ''}${q} in Picks` : '';
    }
    function fill(li: HTMLElement) {
      const row = $<HTMLElement>('[data-add]', li);
      const nm = orig.get(names.get(li)!) || '', ds = descs.get(li) ? orig.get(descs.get(li)!)! : '';
      secEl.textContent = li.dataset.sec || '';
      nameEl.textContent = nm; descEl.textContent = ds; noteEl.textContent = $('.mv-note', li)?.textContent || '';
      // photo, or a typographic card (real photos only: no stand-in food images)
      phEl.replaceChildren();
      if (li.dataset.img) {
        const im = document.createElement('img'); im.src = li.dataset.img; im.alt = `Photo of ${nm}`; im.decoding = 'async'; im.draggable = false; phEl.appendChild(im);
      } else {
        const c = el('div', 'mv-sheet-card'); c.setAttribute('aria-hidden', 'true');
        const g = el('span', 'mv-ghost', nm.trim()[0] || ''); const o = el('span', 'mv-orn'); o.appendChild(document.createElement('b'));
        c.append(g, o); phEl.appendChild(c);
      }
      // tags: veg mark + label, chef's special, spicy
      const vm = $('.mv-vm', li)?.cloneNode(true) as HTMLElement | undefined;
      tagsEl.replaceChildren(...[vm, document.createTextNode(li.dataset.veg === '1' ? 'Vegetarian' : 'Non-vegetarian'), $('.mv-chefmark', li)?.cloneNode(true), $('.mv-spice', li)?.cloneNode(true)].filter(Boolean) as Node[]);
      // price(s) exactly as in the list
      const pr = $('.mv-item-price', li);
      priceEl.innerHTML = pr && row ? pr.innerHTML : '';
      // Add to Picks carries the row's own data (same item, same price, same message line)
      ['n', 'p', 'c', 'k', 'v', 'a'].forEach((k) => { if (row?.dataset[k] != null) addBtn.dataset[k] = row.dataset[k]; else delete addBtn.dataset[k]; });
      if (li.dataset.img) addBtn.dataset.img = li.dataset.img; else delete addBtn.dataset.img;
      addBtn.hidden = !row; addBtn.setAttribute('aria-label', `Add ${row?.dataset.n || nm} to Picks`);
      addBtn.classList.remove('is-added'); flashing = false; status();
    }
    function openSheet(li: HTMLElement) {
      if (sheet!.open || closing) return;
      // focus returns to whatever opened the card: its "See dish" / row button, else the row's own button
      const ae = document.activeElement as HTMLElement | null;
      opener = ae && ae !== document.body && !ae.closest('[inert]') && !sheet!.contains(ae) ? ae : $('.mv-open', li);
      fill(li);
      $('.mv-sheet-scroll', sheet!)!.scrollTop = 0;
      panelEl.style.transform = ''; panelEl.classList.remove('is-drag');
      history.pushState({ mvSheet: 1 }, ''); pushed = true;
      sheet!.showModal(); void panelEl.offsetHeight; sheet!.classList.add('is-in');
      xBtn.focus({ preventScroll: true }); // focus moves into the card (the page behind is inert)
    }
    function closeSheet(fromPop = false) {
      if (!sheet!.open || closing) return;
      closing = true;
      panelEl.classList.remove('is-drag'); panelEl.style.transform = ''; sheet!.classList.remove('is-in');
      const done = () => {
        clearTimeout(closeT); panelEl.removeEventListener('transitionend', onEnd);
        sheet!.close(); closing = false;
        opener?.focus({ preventScroll: true });
        const back = pushed && !fromPop; pushed = false;
        if (back && history.state?.mvSheet) history.back();
      };
      const onEnd = (e: TransitionEvent) => { if (e.target === panelEl) done(); };
      panelEl.addEventListener('transitionend', onEnd);
      closeT = window.setTimeout(done, 320);
    }

    $('#mv-list')?.addEventListener('click', (e) => {
      if (!phone.matches) return;
      const t = e.target as HTMLElement;
      if (t.closest('[data-add]') || getSelection()?.toString()) return;
      const li = t.closest<HTMLElement>('[data-row]'); if (li) openSheet(li);
    });
    // the rotating table (menu-doors.ts) opens a dish's sheet by its exact menu name, on any screen
    document.addEventListener('mv:open', (e) => {
      const name = (e as CustomEvent<string>).detail;
      const li = $$<HTMLElement>('[data-row]').find((r) => $<HTMLElement>('[data-add]', r)?.dataset.n === name);
      if (li) openSheet(li);
    });
    // deep link: /menu#dish=<menu name, URL-encoded> opens that dish card (same mv:open as "See dish"); unknown name = nothing
    const openFromHash = () => {
      const m = /^#dish=(.+)$/.exec(location.hash);
      if (!m) return;
      let want = '';
      try { want = decodeURIComponent(m[1]).trim().toLowerCase(); } catch { return; }
      const ns = $$<HTMLElement>('[data-row]').map((r) => $<HTMLElement>('[data-add]', r)?.dataset.n ?? '');
      const hit = ns.find((n) => n.toLowerCase() === want) ?? ns.find((n) => n.replace(/ \([^)]*\)$/, '').toLowerCase() === want);
      if (hit) document.dispatchEvent(new CustomEvent('mv:open', { detail: hit }));
    };
    openFromHash();
    addEventListener('hashchange', openFromHash);
    dragEl.addEventListener('dragstart', (e) => e.preventDefault()); // a native image drag would cancel our pointer drag
    // explicit focus trap: Tab cycles X <-> Add to Picks instead of leaving for browser chrome
    sheet.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [xBtn, addBtn].filter((b) => !b.hidden);
      const first = f[0], last = f[f.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === first || !f.includes(cur as HTMLButtonElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (cur === last || !f.includes(cur as HTMLButtonElement))) { e.preventDefault(); first.focus(); }
    });
    xBtn.addEventListener('click', () => closeSheet());
    sheet.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(); }); // Escape
    sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); }); // outside the panel
    addEventListener('popstate', () => { if (sheet.open) closeSheet(true); });      // back button / swipe-back
    phone.addEventListener('change', () => { syncInert(); if (!phone.matches && sheet.open) closeSheet(); });
    root.addEventListener('mv:picks', () => { if (sheet.open) status(); });
    addBtn.addEventListener('click', () => {
      flashing = true; addBtn.classList.add('is-added'); clearTimeout(flashT);
      flashT = window.setTimeout(() => { flashing = false; addBtn.classList.remove('is-added'); status(); }, 1400);
    });

    // drag down from the grabber or the photo; a flick (> 0.11 px/ms) is enough
    let sy = 0, dy = 0, pid = -1, dragging = false, trail: [number, number][] = [];
    dragEl.addEventListener('pointerdown', (e) => {
      if (dragging || (e.pointerType === 'mouse' && e.button !== 0) || !phone.matches) return; // drag-to-close is a phone gesture
      dragging = true; pid = e.pointerId; sy = e.clientY; dy = 0; trail = [[e.timeStamp, e.clientY]];
      dragEl.setPointerCapture(pid); panelEl.classList.add('is-drag');
    });
    dragEl.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== pid) return;
      const raw = e.clientY - sy; dy = raw > 0 ? raw : Math.max(raw / 8, -24); // friction above the resting edge
      panelEl.style.transform = `translateY(${dy}px)`;
      trail.push([e.timeStamp, e.clientY]); while (trail.length > 2 && e.timeStamp - trail[0][0] > 100) trail.shift();
    });
    const endDrag = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pid) return;
      dragging = false; try { dragEl.releasePointerCapture(pid); } catch { /* already released */ }
      const a = trail[0], b = trail[trail.length - 1], v = b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0;
      if (e.type !== 'pointercancel' && (dy > panelEl.offsetHeight * 0.3 || (v > 0.11 && dy > 8))) closeSheet();
      else { panelEl.classList.remove('is-drag'); panelEl.style.transform = ''; }
    };
    dragEl.addEventListener('pointerup', endDrag);
    dragEl.addEventListener('pointercancel', endDrag);
  }

  /* ── one-time sheen on primary buttons (a transition, removed after it plays) ── */
  if (!reduce) setTimeout(() => {
    const bs = $$('.mv-btn'); bs.forEach((b) => b.classList.add('is-sheen'));
    setTimeout(() => bs.forEach((b) => b.classList.remove('is-sheen')), 1000);
  }, 700);
}
