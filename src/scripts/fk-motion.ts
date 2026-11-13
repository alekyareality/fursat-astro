/**
 * fk-motion — shared motion layer for the FURSAT hybrid pages (background image + live HTML).
 *
 * Anime.js v4  → hero entrance timeline, headline word stagger, gold divider line draw,
 *                price counters, staggered badge/ring pop-ins.
 * Motion       → in-view reveals, scroll-linked photo parallax inside the carved frames,
 *                spring tilt on cards and plates, gentle hover lift.
 *
 * Markup hooks (all optional, any page):
 *   [data-fx-hero]        container whose children with [data-fx-step] play in order
 *   [data-fx-words]       heading split into words that rise in with a stagger
 *   [data-fx-draw] svg    paths drawn like a gold pen
 *   [data-fx-count]       number counted up when it enters the screen (keeps ₹ and commas)
 *   [data-fx-pop]         group whose children pop in with a stagger when in view
 *   [data-fx-reveal]      fades/rises in when in view
 *   [data-fx-par]         photo inside a frame: drifts slowly with scroll (depth)
 *   [data-fx-tilt]        card/plate that tilts toward the pointer with a spring
 * v4.5 (no markup needed, keyed off shared classes):
 *   section titles        .xp-sec-h .pa-sec-h .rs-title h2 .hy-h2[data-fx-reveal] → masked word rise in view
 *   photo frames          .hy-win img → settle from a deeper zoom and darker tone the first time they show
 *   magnetic actions      green main buttons drift toward the pointer with a spring
 *   card spotlight        .fk-card gets --mx/--my so a soft cream light follows the pointer
 *   scroll progress       gold hairline under the plaster header fills with page scroll
 * Everything is skipped under prefers-reduced-motion (content is visible by default).
 */
import { animate as aAnimate, createTimeline, stagger, svg } from 'animejs';
import { inView, scroll, animate as mAnimate, hover } from 'motion';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const ease = 'outExpo';

function splitWords(el: HTMLElement) {
  if (el.dataset.fxSplit) return;
  el.dataset.fxSplit = '1';
  const walk = (node: Node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent || '').split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.append(t); return; }
          const w = document.createElement('span');
          w.className = 'fx-w';
          const i = document.createElement('span');
          i.className = 'fx-wi';
          i.textContent = t;
          w.append(i);
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !(n as HTMLElement).classList.contains('fx-w')) {
        walk(n);
      }
    });
  };
  walk(el);
}

function heroes() {
  document.querySelectorAll<HTMLElement>('[data-fx-hero]').forEach((hero) => {
    const steps = [...hero.querySelectorAll<HTMLElement>('[data-fx-step]')];
    const tl = createTimeline({ defaults: { ease, duration: 900 } });
    steps.forEach((el, i) => {
      const at = i === 0 ? 0 : '-=650';
      if (el.hasAttribute('data-fx-words')) {
        splitWords(el);
        el.style.opacity = '1';
        tl.add(el.querySelectorAll('.fx-wi'), { y: ['110%', '0%'], rotate: [4, 0], duration: 1100, delay: stagger(70) }, at);
      } else if (el.matches('svg[data-fx-draw]') || el.querySelector('[data-fx-draw]')) {
        const s = el.matches('svg') ? el : el.querySelector('svg')!;
        el.style.opacity = '1';
        tl.add(svg.createDrawable(s.querySelectorAll('path, line')), { draw: ['0 0', '0 1'], duration: 1200, ease: 'inOutQuad' }, at);
      } else {
        tl.add(el, { opacity: [0, 1], y: [22, 0], filter: ['blur(6px)', 'blur(0px)'] }, at);
      }
    });
  });
}

function draws() {
  document.querySelectorAll<SVGSVGElement>('svg[data-fx-draw]:not([data-fx-step])').forEach((s) => {
    const parts = svg.createDrawable(s.querySelectorAll('path, line'));
    aAnimate(parts, { draw: '0 0', duration: 0 });
    inView(s, () => { aAnimate(parts, { draw: ['0 0', '0 1'], duration: 1400, ease: 'inOutQuad' }); }, { margin: '0px 0px -10% 0px' });
  });
}

function counters() {
  document.querySelectorAll<HTMLElement>('[data-fx-count]').forEach((el) => {
    const raw = el.textContent || '';
    const m = raw.match(/[\d,]+/);
    if (!m) return;
    const end = parseInt(m[0].replace(/,/g, ''), 10);
    const fmt = (n: number) => raw.replace(m[0], Math.round(n).toLocaleString('en-IN'));
    const o = { v: 0 };
    el.textContent = fmt(0);
    inView(el, () => {
      aAnimate(o, { v: end, duration: 1400, ease: 'outQuart', onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = raw; } });
    }, { margin: '0px 0px -8% 0px' });
  });
}

function pops() {
  document.querySelectorAll<HTMLElement>('[data-fx-pop]').forEach((g) => {
    const kids = [...g.children] as HTMLElement[];
    kids.forEach((k) => { k.style.opacity = '0'; });
    inView(g, () => {
      aAnimate(kids, { opacity: [0, 1], scale: [0.86, 1], y: [18, 0], duration: 900, delay: stagger(90), ease: 'outBack(1.4)' });
    }, { margin: '0px 0px -10% 0px' });
  });
}

function reveals() {
  document.querySelectorAll<HTMLElement>('[data-fx-reveal]').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    inView(el, () => {
      mAnimate(el, { opacity: 1, transform: 'translateY(0px)' }, { duration: 0.8, ease: [0.22, 1, 0.36, 1] });
    }, { margin: '0px 0px -8% 0px' });
  });
}

function parallax() {
  document.querySelectorAll<HTMLElement>('[data-fx-par]').forEach((img) => {
    const frame = img.parentElement!;
    img.style.scale = '1.14';
    scroll(mAnimate(img, { y: ['-5%', '5%'] }, { ease: 'linear' }), { target: frame, offset: ['start end', 'end start'] });
  });
}

function tilts() {
  if (!fine) return;
  document.querySelectorAll<HTMLElement>('[data-fx-tilt]').forEach((el) => {
    el.style.transformStyle = 'preserve-3d';
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      mAnimate(el, { rotateX: -y * 7, rotateY: x * 9, y: -6 }, { type: 'spring', stiffness: 220, damping: 18 });
    };
    hover(el, () => {
      el.addEventListener('pointermove', move);
      return () => {
        el.removeEventListener('pointermove', move);
        mAnimate(el, { rotateX: 0, rotateY: 0, y: 0 }, { type: 'spring', stiffness: 200, damping: 20 });
      };
    });
  });
}

const TITLE_SEL = '.xp-sec-h, .pa-sec-h, .rs-title h2, .st-vh, .hy-h2[data-fx-reveal]';
function titles() {
  document.querySelectorAll<HTMLElement>(TITLE_SEL).forEach((el) => {
    if (el.closest('[data-fx-hero]')) return;
    el.removeAttribute('data-fx-reveal');
    el.style.opacity = '1'; el.style.transform = '';
    splitWords(el);
    const words = el.querySelectorAll<HTMLElement>('.fx-wi');
    aAnimate(words, { y: '110%', duration: 0 });
    inView(el, () => {
      aAnimate(words, { y: ['110%', '0%'], rotate: [3, 0], duration: 1000, delay: stagger(60), ease: 'outExpo' });
    }, { margin: '0px 0px -12% 0px' });
  });
}

function frames() {
  document.querySelectorAll<HTMLImageElement>('.hy-win img').forEach((img) => {
    const from = img.hasAttribute('data-fx-par') ? '1.34' : '1.2';
    const to = img.hasAttribute('data-fx-par') ? '1.14' : '1';
    img.style.scale = from;
    img.style.filter = 'brightness(.72) saturate(.85)';
    inView(img.parentElement!, () => {
      img.animate([{ scale: from, filter: 'brightness(.72) saturate(.85)' }, { scale: to, filter: 'brightness(1) saturate(1)' }],
        { duration: 1500, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
      setTimeout(() => { img.style.scale = to; img.style.filter = ''; }, 1520);
    }, { margin: '0px 0px -6% 0px' });
  });
}

const MAG_SEL = '.sh-plaster .sh-reserve-btn, .fk-btn--solid, .rs-submit, .pa .pa-wa';
function magnets() {
  if (!fine) return;
  document.querySelectorAll<HTMLElement>(MAG_SEL).forEach((el) => {
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      mAnimate(el, { x: x * 10, y: y * 8 }, { type: 'spring', stiffness: 260, damping: 18 });
    };
    hover(el, () => {
      el.addEventListener('pointermove', move);
      return () => { el.removeEventListener('pointermove', move); mAnimate(el, { x: 0, y: 0 }, { type: 'spring', stiffness: 220, damping: 16 }); };
    });
  });
}

function spotlights() {
  if (!fine) return;
  document.querySelectorAll<HTMLElement>('.fk-card').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  });
}

function progress() {
  const header = document.querySelector<HTMLElement>('.sh-plaster');
  if (!header) return;
  const bar = document.createElement('i');
  bar.className = 'fk-progress';
  bar.setAttribute('aria-hidden', 'true');
  header.append(bar);
  scroll(mAnimate(bar, { scaleX: [0, 1] }, { ease: 'linear' }));
}

function boot() {
  const root = document.documentElement;
  root.classList.add('fx-on');
  if (reduce) { root.classList.add('fx-reduce'); root.classList.remove('fx-pre'); return; }
  // each effect is independent: one failing never blocks the rest or hides content
  for (const fn of [heroes, titles, draws, counters, pops, reveals, frames, parallax, tilts, magnets, spotlights, progress]) {
    try { fn(); } catch (e) { console.warn('[fk-motion]', fn.name, e); }
  }
  // hero steps start hidden (.fx-pre); always reveal them, even if a timeline failed
  setTimeout(() => {
    root.classList.remove('fx-pre');
    document.querySelectorAll<HTMLElement>('[data-fx-step]').forEach((el) => { if (getComputedStyle(el).opacity === '0') el.style.opacity = '1'; });
  }, 2200);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
