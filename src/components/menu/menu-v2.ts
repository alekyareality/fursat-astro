// /menu client script: picks, side switching, 21+ notice, search + filters, scroll-spy,
// sticky chips, scroll entrance, cursor photo reveal. No framework, no animation library.
import { reducer, money, total, count, waLink, type Line, type MenuItem } from './cart';

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
  const cnt = $('#mv-cnt')!, sub = $('#mv-sub')!, wa = $<HTMLAnchorElement>('#mv-wa')!, listEl = $('#mv-picks-list')!;
  const panel = $('#mv-picks-panel')!, toggle = $('#mv-picks-toggle')!, bag = $('#mv-bag')!, picksEl = $('#mv-picks')!;

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  function render(pop = false) {
    cnt.textContent = String(count(lines));
    sub.textContent = money(total(lines));
    if (pop && !reduce) { cnt.classList.add('is-pop'); setTimeout(() => cnt.classList.remove('is-pop'), 90); }
    const has = lines.length > 0;
    wa.setAttribute('aria-disabled', has ? 'false' : 'true');
    wa.href = has ? waLink(lines) : '#';
    wa.tabIndex = has ? 0 : -1;
    listEl.innerHTML = has
      ? lines.map((l) => `<li><span>${esc(l.item.n)}</span><span class="q"><button type="button" data-dec="${esc(l.key)}" aria-label="One less ${esc(l.item.n)}">−</button><b class="num">${l.qty}</b><button type="button" data-inc="${esc(l.key)}" aria-label="One more ${esc(l.item.n)}">+</button></span><b class="num">${money(l.item.p * l.qty)}</b></li>`).join('')
      : '<li style="grid-template-columns:1fr"><span>Nothing here yet. Tap + on any dish or drink.</span></li>';
    try { sessionStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
  }
  render();

  const itemFrom = (b: HTMLElement): MenuItem => ({
    n: b.dataset.n || '', p: Number(b.dataset.p), c: b.dataset.c || '', k: (b.dataset.k as MenuItem['k']) || 'food',
    v: b.dataset.v, a: b.dataset.a === '1', img: b.dataset.img,
  });

  const FLY = 450;
  function fly(from: HTMLElement, item: MenuItem) {
    if (reduce) return;
    const r = from.getBoundingClientRect(), t = bag.getBoundingClientRect();
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
  }
  function centerIn(btn: HTMLElement | null) {
    const box = btn?.parentElement;
    if (!btn || !box || box.scrollWidth <= box.clientWidth) return;
    box.scrollTo({ left: btn.offsetLeft - box.clientWidth / 2 + btn.offsetWidth / 2 - box.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
  }
  function mark(id: string | null) {
    $$('.mv-rw').forEach((b) => b.classList.toggle('is-on', b.dataset.go === id));
    $$('.mv-chip').forEach((b) => b.classList.toggle('is-on', (b.dataset.chip === 'all' && !id) || b.dataset.chip === id));
    $$('.mv-schip').forEach((b) => { const on = b.dataset.go === id; b.classList.toggle('is-on', on); if (on && b.offsetParent) centerIn(b); });
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

  /* ── cursor photo reveal (fine pointers, rows with a real photo) ── */
  const rev = $('#mv-reveal');
  const revImg = rev?.querySelector('img');
  if (rev && revImg && finePointer && !reduce) {
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, raf = 0, on = false;
    const W = 220, H = 160;
    const place = () => {
      x += (tx - x) * 0.15; y += (ty - y) * 0.15;
      const tilt = Math.max(-8, Math.min(8, vx * 0.35)); vx *= 0.85;
      rev.style.transform = `translate(${x}px,${y}px) rotate(${tilt}deg)`;
      raf = on ? requestAnimationFrame(place) : 0;
    };
    const aim = (e: PointerEvent) => {
      const nx = e.clientX + 28 + W > innerWidth ? e.clientX - 28 - W : e.clientX + 28;
      vx = e.movementX; tx = nx; ty = Math.min(innerHeight - H - 12, Math.max(12, e.clientY - H / 2));
    };
    const show = (e: PointerEvent, src: string) => {
      if (revImg.getAttribute('src') !== src) revImg.setAttribute('src', src);
      aim(e); if (!on) { x = tx; y = ty; }
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

  /* ── one-time sheen on primary buttons (a transition, removed after it plays) ── */
  if (!reduce) setTimeout(() => {
    const bs = $$('.mv-btn'); bs.forEach((b) => b.classList.add('is-sheen'));
    setTimeout(() => bs.forEach((b) => b.classList.remove('is-sheen')), 1000);
  }, 700);
}
