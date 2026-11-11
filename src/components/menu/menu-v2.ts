// /menu v2 client script: picks, side switching, 21+ notice, quick filters.
// Small on purpose: no framework, no animation library. M3 adds scroll-spy and the cursor reveal.
import { reducer, keyOf, money, total, count, waLink, type Line, type MenuItem } from './cart';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const main = $('.mv') as HTMLElement | null;
if (main) init(main);

function init(root: HTMLElement) {
  /* ── picks ─────────────────────────────────────────────── */
  const KEY = 'fursat_picks_v2';
  let lines: Line[] = [];
  try { lines = JSON.parse(sessionStorage.getItem(KEY) || '[]'); } catch { lines = []; }
  const cnt = $('#mv-cnt')!, sub = $('#mv-sub')!, wa = $<HTMLAnchorElement>('#mv-wa')!, listEl = $('#mv-picks-list')!;
  const panel = $('#mv-picks-panel')!, toggle = $('#mv-picks-toggle')!, bag = $('#mv-bag')!;

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  function render(pop = false) {
    cnt.textContent = String(count(lines));
    sub.textContent = money(total(lines));
    if (pop && !reduce) { cnt.classList.remove('mv-cnt-pop'); void cnt.offsetWidth; cnt.classList.add('mv-cnt-pop'); }
    const has = lines.length > 0;
    wa.setAttribute('aria-disabled', has ? 'false' : 'true');
    wa.href = has ? waLink(lines) : '#';
    wa.tabIndex = has ? 0 : -1;
    listEl.innerHTML = has
      ? lines.map((l) => `<li><span>${esc(l.item.n)}</span><span class="q"><button type="button" data-dec="${esc(l.key)}" aria-label="One less ${esc(l.item.n)}">−</button><b class="num">${l.qty}</b><button type="button" data-inc="${esc(l.key)}" aria-label="One more ${esc(l.item.n)}">+</button></span><b class="num">${money(l.item.p * l.qty)}</b></li>`).join('')
      : '<li style="grid-template-columns:1fr"><span>Nothing here yet. Tap Add to Picks on any dish or drink.</span></li>';
    try { sessionStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ }
  }
  render();

  const itemFrom = (b: HTMLElement): MenuItem => ({
    n: b.dataset.n || '', p: Number(b.dataset.p), c: b.dataset.c || '', k: (b.dataset.k as MenuItem['k']) || 'food',
    v: b.dataset.v, a: b.dataset.a === '1', img: b.dataset.img,
  });

  function fly(from: HTMLElement, item: MenuItem) {
    if (reduce) return;
    const r = from.getBoundingClientRect(), t = bag.getBoundingClientRect();
    if (!t.width) return;
    const el = document.createElement('div'); el.className = 'mv-fly';
    const dot = document.createElement('i');
    if (item.img) dot.style.backgroundImage = `url(${item.img})`; else dot.textContent = item.n.trim()[0] || '';
    el.appendChild(dot); document.body.appendChild(el);
    const sx = r.left + r.width / 2 - 22, sy = r.top + r.height / 2 - 22, ex = t.left + t.width / 2 - 22, ey = t.top + t.height / 2 - 22, D = 650;
    el.animate([{ transform: `translateX(${sx}px)` }, { transform: `translateX(${ex}px)` }], { duration: D, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
    dot.animate([
      { transform: `translateY(${sy}px) scale(1)`, opacity: 1 },
      { transform: `translateY(${Math.min(sy, ey) - 90}px) scale(.9)`, offset: 0.45 },
      { transform: `translateY(${ey}px) scale(.45)`, opacity: 0.9 },
    ], { duration: D, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
    setTimeout(() => el.remove(), D + 40);
  }

  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const add = t.closest<HTMLElement>('[data-add]');
    if (add && Number.isFinite(Number(add.dataset.p))) {
      const item = itemFrom(add);
      lines = reducer(lines, { t: 'add', item });
      fly(add, item);
      const delay = reduce ? 0 : 650;
      setTimeout(() => render(true), delay);
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hasAttribute('hidden')) { panel.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); } });
  document.addEventListener('click', (e) => {
    // composedPath survives the list re-render that detaches the clicked +/- button
    const inside = e.composedPath().includes($('#mv-picks')!) || e.composedPath().some((n) => n instanceof HTMLElement && n.hasAttribute('data-add'));
    if (!panel.hasAttribute('hidden') && !inside) { panel.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); }
  });
  wa.addEventListener('click', (e) => { if (wa.getAttribute('aria-disabled') === 'true') e.preventDefault(); });

  /* ── side, rail, chips, 21+ ───────────────────────────── */
  const AGE = 'fursat_age_ok';
  const ageOk = () => { try { return localStorage.getItem(AGE) === '1'; } catch { return false; } };
  const dlg = $<HTMLDialogElement>('#mv-age')!;
  let pending: (() => void) | null = null;

  function setSide(side: 'food' | 'drinks') {
    root.dataset.side = side;
    $$('[data-rail]').forEach((ul) => ul.toggleAttribute('hidden', ul.dataset.rail !== side));
  }
  function mark(id: string | null) {
    $$('.mv-rw').forEach((b) => b.classList.toggle('is-on', b.dataset.go === id));
    $$('.mv-chip').forEach((b) => b.classList.toggle('is-on', (b.dataset.chip === 'all' && !id) || b.dataset.chip === id));
  }
  function scrollTo(el: Element | null) {
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  function need21(side: 'food' | 'drinks', run: () => void) {
    if (side === 'drinks' && !ageOk()) { pending = run; if (!dlg.open) dlg.showModal(); return; }
    run();
  }
  function go(id: string | null, side?: 'food' | 'drinks') {
    const sd = side || (id && id.startsWith('d-') ? 'drinks' : id && id.startsWith('f-') ? 'food' : (root.dataset.side as 'food' | 'drinks'));
    need21(sd, () => { setSide(sd); mark(id); scrollTo(id ? document.getElementById('g-' + id) : $('#mv-list')); });
  }
  root.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const sgo = t.closest<HTMLElement>('[data-side-go]');
    if (sgo) { const s = sgo.dataset.sideGo as 'food' | 'drinks'; go(s === 'drinks' ? 'd-cocktails' : 'f-biryani', s); return; }
    const g = t.closest<HTMLElement>('[data-go]');
    if (g) { go(g.dataset.go!, g.dataset.sideOf as 'food' | 'drinks' | undefined); return; }
    const chip = t.closest<HTMLElement>('[data-chip]');
    if (chip) { const id = chip.dataset.chip!; go(id === 'all' ? null : id, (chip.dataset.sideOf as 'food' | 'drinks') || undefined); }
  });
  $('#mv-age-open')!.addEventListener('click', () => { pending = null; dlg.showModal(); });
  dlg.addEventListener('close', () => {
    if (dlg.returnValue === 'yes') { try { localStorage.setItem(AGE, '1'); } catch { /* ignore */ } const run = pending; pending = null; run?.(); }
    else if (dlg.returnValue === 'no') { pending = null; go('f-biryani', 'food'); }
    dlg.returnValue = '';
  });

  /* ── quick filters (search + diet) ────────────────────── */
  const q = $<HTMLInputElement>('#mv-q')!;
  const diets = new Set<string>();
  let scrolled = false;
  function filter() {
    const term = q.value.trim().toLowerCase();
    const active = !!term || diets.size > 0;
    let shown = 0;
    $$('[data-row]').forEach((li) => {
      const veg = li.dataset.veg === '1', spicy = li.dataset.spicy === '1';
      let ok = !term || (li.dataset.text || '').includes(term);
      if (ok && diets.has('veg') && !veg) ok = false;
      if (ok && diets.has('nonveg') && veg) ok = false;
      if (ok && diets.has('spicy') && !spicy) ok = false;
      li.toggleAttribute('hidden', !ok);
      if (ok) shown++;
    });
    $$('.mv-sec').forEach((s) => s.toggleAttribute('hidden', !s.querySelector('[data-row]:not([hidden])')));
    $$('.mv-grp').forEach((s) => s.toggleAttribute('hidden', !s.querySelector('[data-row]:not([hidden])')));
    $$('.mv-side').forEach((s) => s.toggleAttribute('hidden', !s.querySelector('[data-row]:not([hidden])')));
    $('#mv-empty')!.toggleAttribute('hidden', shown > 0 || !active);
    if (active && !scrolled) { scrolled = true; scrollTo($('#mv-list')); }
    if (!active) scrolled = false;
  }
  q.addEventListener('input', filter);
  q.closest('form')?.addEventListener('submit', (e) => e.preventDefault());
  $$('[data-diet]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.diet!; const on = !diets.has(k);
    on ? diets.add(k) : diets.delete(k);
    // Veg and Non-veg are exclusive
    if (on && k === 'veg') { diets.delete('nonveg'); $('[data-diet="nonveg"]')!.setAttribute('aria-pressed', 'false'); }
    if (on && k === 'nonveg') { diets.delete('veg'); $('[data-diet="veg"]')!.setAttribute('aria-pressed', 'false'); }
    b.setAttribute('aria-pressed', String(on));
    filter();
  }));

  /* ── one-time sheen on primary buttons ────────────────── */
  if (!reduce) setTimeout(() => $$('.mv-btn').forEach((b) => b.classList.add('is-sheen')), 700);
}
