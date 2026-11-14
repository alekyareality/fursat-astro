// /menu first screen (Plan B): 50/50 Drinks | Food, tapped side opens to 75/25.
// Drinks: hexagon hotspots glow, the bar zooms toward the shelf, then its drink group opens
// (the hotspot keeps data-go, so menu-v2 still owns the jump and the 21+ notice).
// Food: a half-visible rotating table. Drag or swipe turns it with momentum and a spring snap,
// the front dish grows, tapping it opens the dish sheet. Dishes hang above the table and fall onto it as
// the page scrolls (prototype 02). Motion = springs, in-view, the landing tween; Anime.js = the hotspot glow.
import { animate as mAnimate, inView } from 'motion';
import { animate as aAnimate } from 'animejs';

type Side = 'food' | 'drinks';
const md = document.getElementById('md');
if (md) init(md);

function init(md: HTMLElement) {
  const root = (md.closest('.mv') as HTMLElement) || document.body;
  md.classList.add('md--js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const narrow = matchMedia('(max-width: 820px)');
  const xBtn = document.getElementById('md-x') as HTMLButtonElement;

  /* doors in view: menu-v2 keeps an empty picks pill out of the way */
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => root.classList.toggle('md-in', en.isIntersecting), { threshold: 0.35 }).observe(md);

  /* ── the split: one spring value drives --split (Motion) ── */
  let split = 50;
  let splitAnim: { stop: () => void } | null = null;
  const paint = () => md.style.setProperty('--split', split.toFixed(2) + '%');
  const springTo = (to: number, stiffness = 120, damping = 22) => {
    splitAnim?.stop();
    if (reduce) { split = to; paint(); relayout(); return; }
    splitAnim = mAnimate(split, to, { type: 'spring', stiffness, damping, onUpdate: (v: number) => { split = v; paint(); relayout(); } });
  };
  let open: Side | null = null;
  let landAll = () => {}; // set once the table exists
  let dragged = 0; // time of the last table drag: a click right after it is not a tap
  const setOpen = (side: Side | null, px?: number, py?: number) => {
    open = side;
    if (side) md.dataset.open = side; else delete md.dataset.open;
    xBtn.hidden = !side;
    springTo(side === 'drinks' ? 75 : side === 'food' ? 25 : 50);
    if (side && px != null && py != null && !reduce) flash(px, py);
    if (side === 'food') { wake(); landAll(); }
  };
  // a small gold ring where the guest tapped, as the side opens
  function flash(x: number, y: number) {
    const r = document.createElement('span'); r.className = 'md-ring';
    Object.assign(r.style, { left: x + 'px', top: y + 'px' });
    root.append(r);
    r.animate([{ opacity: 1, transform: 'scale(.4)' }, { opacity: 0, transform: 'scale(14)' }], { duration: 750, easing: 'cubic-bezier(.23,1,.32,1)' }).finished.then(() => r.remove());
  }
  xBtn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(null); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && open && !document.querySelector('dialog[open]')) setOpen(null); });

  // desktop: the seam follows the pointer on a spring, as in the Richmond reference (only while nothing is open)
  md.addEventListener('pointermove', (e) => {
    if (open || reduce || !fine.matches || narrow.matches) return;
    const r = md.getBoundingClientRect();
    springTo(Math.min(68, Math.max(32, ((e.clientX - r.left) / r.width) * 100)));
  });
  md.addEventListener('pointerleave', () => { if (!open && fine.matches && !narrow.matches) springTo(50, 90, 20); });

  // a tap on a closed (or the narrow) side opens it; the buttons inside keep their own jobs
  md.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const door = t.closest<HTMLElement>('[data-door]');
    if (!door || t.closest('[data-side-go], #md-x') || performance.now() - dragged < 350) return;
    const side = door.dataset.door as Side;
    if (open !== side) {
      e.stopPropagation(); e.preventDefault();
      setOpen(side, e.clientX || undefined, e.clientY || undefined);
    }
  }, true);

  /* ── DRINKS: hotspots over the bar image (cover math matches object-fit + object-position) ── */
  const ph = document.getElementById('md-ph-bar')!;
  const spots = document.getElementById('mb-spots')!;
  const BW = +md.dataset.barW!, BH = +md.dataset.barH!, BY = +md.dataset.barY!;
  const placeSpots = () => {
    const W = ph.clientWidth, H = ph.clientHeight, s = Math.max(W / BW, H / BH), w = BW * s, h = BH * s;
    spots.style.cssText = `left:${(W - w) / 2}px;top:${(H - h) * BY}px;width:${w}px;height:${h}px`;
    // labels near the screen edge open inward
    const mr = md.getBoundingClientRect();
    spots.querySelectorAll<HTMLElement>('.mb-spot').forEach((sp) => {
      const r = sp.getBoundingClientRect(), c = (r.left + r.width / 2 - mr.left) / mr.width;
      sp.hidden = c < 0.03 || c > 0.97; // a shelf cropped off this screen has no hotspot
      if (c > 0.72) sp.dataset.edge = 'r'; else if (c < 0.28) sp.dataset.edge = 'l'; else delete sp.dataset.edge;
    });
  };
  placeSpots();
  if ('ResizeObserver' in window) new ResizeObserver(placeSpots).observe(ph);

  let passing = false;
  spots.addEventListener('click', (e) => {
    if (passing) return;
    const spot = (e.target as HTMLElement).closest<HTMLElement>('.mb-spot');
    if (!spot || open !== 'drinks') return; // first tap opens the side (handled above)
    e.stopPropagation();
    const go = () => { passing = true; spot.click(); passing = false; };
    if (reduce) { go(); return; }
    spot.classList.add('is-hot');
    // zoom the bar toward this shelf, then open its group
    const sr = spot.getBoundingClientRect(), pr = ph.getBoundingClientRect();
    ph.style.setProperty('--zx', ((sr.left + sr.width / 2 - pr.left) / pr.width) * 100 + '%');
    ph.style.setProperty('--zy', ((sr.top + sr.height / 2 - pr.top) / pr.height) * 100 + '%');
    aAnimate(spot.querySelector('.mb-hex')!, { scale: [1.1, 1.35, 1.15], duration: 520, ease: 'outQuad' });
    const z = ph.animate([{ scale: '1' }, { scale: '1.28' }], { duration: 560, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
    z.finished.then(() => {
      go();
      setTimeout(() => { z.cancel(); spot.classList.remove('is-hot'); }, 700);
    });
  });

  /* ── FOOD: the rotating table ── */
  const mt = document.getElementById('mt')!;
  const ring = document.getElementById('mt-ring')!;
  const dishes = [...ring.querySelectorAll<HTMLElement>('.mt-dish')];
  const N = dishes.length, STEP = 360 / N;
  const lab = document.getElementById('mt-l')!, nm = document.getElementById('mt-n')!, pr = document.getElementById('mt-p')!;
  let angle = 0; // degrees; dish i is in front when angle = i * STEP
  let geo = { W: 0, H: 0, cx: 0, cy: 0, rx: 0, ry: 0, D: 0 };
  let front = -1;
  // 0 = dishes hang above the table, 1 = all landed. Driven by the scroll; opening Food lands them too.
  let fallP = reduce ? 1 : 0, autoP = reduce ? 1 : 0;

  function measure() {
    const W = mt.clientWidth, H = mt.clientHeight;
    const ph = narrow.matches;
    const D = Math.max(56, Math.min(W * (ph ? 0.27 : 0.19), H * (ph ? 0.34 : 0.24)));
    const rx = W * (ph ? 0.38 : 0.41), ry = Math.min(H * (ph ? 0.13 : 0.14), rx * 0.3);
    // keep the front dish, its name (~50px) and the arrows (~70px) inside the panel
    const cy = Math.min(H * (ph ? 0.36 : 0.56), H - (ph ? 114 : 138) - ry - D * 0.32);
    geo = { W, H, cx: W / 2, cy, rx, ry, D };
    mt.style.setProperty('--d', D + 'px');
    mt.style.setProperty('--cy', (cy / H) * 100 + '%');
    mt.style.setProperty('--tw', ((rx * 2 + D * 1.1) / W) * 100 + '%');
    mt.style.setProperty('--th', ((ry * 2 + D * 0.9) / H) * 100 + '%');
    // the front dish's name sits just under it
    mt.style.setProperty('--fy', Math.round(cy + ry - D * 0.18 + D / 2 + 10) + 'px');
  }
  function layout() {
    const { cx, cy, rx, ry, D } = geo;
    let best = 0, bestD = -2;
    dishes.forEach((d, i) => {
      const th = ((i * STEP - angle) * Math.PI) / 180;
      const depth = Math.cos(th); // 1 = front, -1 = back
      const k = (depth + 1) / 2;
      const s = 0.4 + 0.6 * Math.pow(k, 1.6);
      const x = cx + rx * Math.sin(th), y = cy + ry * depth;
      // falling onto the table (prototype 02): each dish lags a little behind the one before
      const q = Math.min(1, Math.max(0, (fallP - i * 0.05) / (1 - (N - 1) * 0.05)));
      const e = q * q; // gravity: slow at the top, fast at the table
      const lift = (1 - e) * geo.H * (narrow.matches ? 0.22 : 0.26);
      const rot = (1 - e) * (i % 2 ? 14 : -14);
      if (q >= 1 && !d.dataset.landed) { d.dataset.landed = '1'; if (!reduce) d.querySelector('.mt-drop')!.animate({ scale: ['1 .86', '1 1.05', '1 1'] }, { duration: 460, easing: 'cubic-bezier(.23,1,.32,1)' }); }
      else if (q < 0.98) delete d.dataset.landed;
      d.style.transform = `translate(${(x - D / 2).toFixed(1)}px,${(y - D / 2 - D * 0.18 * k - lift).toFixed(1)}px) scale(${s.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`;
      d.style.zIndex = String(Math.round(k * 100));
      d.style.opacity = (0.35 + 0.65 * k).toFixed(2);
      d.style.filter = k < 0.55 ? `brightness(${(0.6 + 0.5 * k).toFixed(2)})` : '';
      if (depth > bestD) { bestD = depth; best = i; }
    });
    if (best !== front) setFront(best);
  }
  function relayout() { measure(); layout(); }
  function setFront(i: number) {
    dishes[front]?.classList.remove('is-front');
    dishes[front]?.querySelector('video')?.remove();
    front = i;
    const d = dishes[i];
    d.classList.add('is-front');
    lab.textContent = d.dataset.label!; nm.textContent = d.dataset.title!; pr.textContent = d.dataset.price!;
    dishes.forEach((x, j) => x.querySelector('.mt-plate')!.setAttribute('aria-current', String(j === i)));
    // spin clip: plays on the front dish only, when the clip exists
    const clip = d.dataset.clip;
    if (clip && !reduce) {
      const v = Object.assign(document.createElement('video'), { src: clip, muted: true, loop: true, playsInline: true, autoplay: true });
      v.setAttribute('aria-hidden', 'true');
      v.addEventListener('playing', () => d.querySelector('.mt-drop img')?.setAttribute('hidden', ''), { once: true });
      v.addEventListener('error', () => v.remove(), { once: true });
      d.querySelector('.mt-drop')!.append(v);
      d.querySelector('.mt-drop img')?.removeAttribute('hidden');
    }
  }
  let spin: { stop: () => void } | null = null;
  const norm = (a: number) => Math.round(a / STEP) * STEP;
  function spinTo(target: number, velocity = 0) {
    spin?.stop();
    if (reduce) { angle = target; layout(); return; }
    spin = mAnimate(angle, target, { type: 'spring', stiffness: 150, damping: 22, velocity, onUpdate: (v: number) => { angle = v; layout(); } });
  }
  const goBy = (n: number) => { interacted(); spinTo(norm(angle) + n * STEP); };
  document.getElementById('mt-prev')!.addEventListener('click', (e) => { e.stopPropagation(); goBy(-1); });
  document.getElementById('mt-next')!.addEventListener('click', (e) => { e.stopPropagation(); goBy(1); });
  document.getElementById('mt-see')!.addEventListener('click', (e) => { e.stopPropagation(); interacted(); openDish(front); });
  mt.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goBy(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goBy(1); }
  });
  function openDish(i: number) {
    if (i < 0) return;
    document.dispatchEvent(new CustomEvent('mv:open', { detail: dishes[i].dataset.dn }));
  }

  // drag / swipe with momentum, then a spring snap to the nearest dish
  let drag: { id: number; x: number; a: number; t: number; v: number; moved: boolean } | null = null;
  mt.addEventListener('pointerdown', (e) => {
    if (open === 'drinks' || (e.target as HTMLElement).closest('.mt-nav')) return;
    spin?.stop();
    drag = { id: e.pointerId, x: e.clientX, a: angle, t: performance.now(), v: 0, moved: false };
  });
  mt.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; mt.setPointerCapture(e.pointerId); interacted(); }
    if (!drag.moved) return;
    const degPerPx = STEP / Math.max(60, geo.rx * 0.6);
    const now = performance.now(), na = drag.a - dx * degPerPx;
    drag.v = ((na - angle) / Math.max(1, now - drag.t)) * 1000; drag.t = now;
    angle = na; layout();
  });
  const end = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.moved) { dragged = performance.now(); spinTo(norm(angle + d.v * 0.18), d.v); return; }
    // a tap: the front dish opens; another dish turns to the front
    const li = (e.target as HTMLElement).closest<HTMLElement>('.mt-dish');
    if (!li || open !== 'food') return; // a closed side opens first (capture click handler)
    interacted();
    const i = +li.dataset.i!;
    if (i === front) openDish(i);
    else { const delta = ((((i * STEP - angle) % 360) + 540) % 360) - 180; spinTo(norm(angle + delta)); }
  };
  mt.addEventListener('pointerup', end);
  mt.addEventListener('pointercancel', () => { drag = null; });
  mt.addEventListener('dragstart', (e) => e.preventDefault());

  // gentle turn every 4.5 s until the guest touches the table
  let auto = 0, touched = false, visible = false;
  function interacted() { touched = true; clearInterval(auto); landAll(); }
  function wake() {
    if (reduce || touched || auto) return;
    auto = window.setInterval(() => { if (visible && !drag && !document.hidden && open !== 'drinks') spinTo(norm(angle) + STEP); }, 4500);
  }

  relayout();
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(mt);

  // the dishes fall onto the table as the page scrolls (land by 30% of this screen);
  // opening the Food side, or touching the table, lands them without scrolling
  const fall = () => {
    const sp = Math.min(1, Math.max(0, window.scrollY / (md.offsetHeight * 0.3)));
    fallP = Math.max(sp, autoP);
    md.toggleAttribute('data-float', fallP < 0.02);
    layout();
  };
  let fallRaf = 0;
  addEventListener('scroll', () => { if (!fallRaf) fallRaf = requestAnimationFrame(() => { fallRaf = 0; fall(); }); }, { passive: true });
  landAll = () => {
    if (autoP >= 1) return;
    if (reduce) { autoP = 1; fall(); return; }
    mAnimate(autoP, 1, { duration: 1.1, ease: [0.55, 0, 1, 0.45], onUpdate: (v: number) => { autoP = v; fall(); } });
  };
  fall();
  inView(mt, () => { visible = true; wake(); return () => { visible = false; }; }, { amount: 0.3 });
}
