/**
 * motion.ts — Fursat Kitchen | Bar
 * Shared motion constants, helpers, and GSAP-based animation utilities.
 * All effects guard for prefers-reduced-motion.
 * Only animate: transform, opacity, clip-path.
 */

// ─── Easing Constants ────────────────────────────────────────────────────────

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  spring: 'elastic.out(1, 0.5)',
  silk: 'expo.out',
  swift: 'circ.out',
} as const;

export const SPRING = {
  stiffness: 200,
  damping: 24,
  mass: 1,
} as const;

// ─── Reduced Motion Helper ───────────────────────────────────────────────────

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── GSAP Dynamic Loader ─────────────────────────────────────────────────────

let _gsap: typeof import('gsap').gsap | null = null;

export async function initGSAP() {
  if (_gsap) return _gsap;
  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  const { SplitText } = await import('gsap/SplitText');
  gsap.registerPlugin(ScrollTrigger, SplitText);
  _gsap = gsap;
  return gsap;
}

// ─── splitReveal ─────────────────────────────────────────────────────────────
/**
 * GSAP SplitText word/line reveal animation.
 * Words slide up from translateY(40px) with stagger.
 */
export async function splitReveal(el: Element, stagger = 0.08) {
  if (prefersReducedMotion()) return;
  const gsap = await initGSAP();
  const { SplitText } = await import('gsap/SplitText');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  const split = new SplitText(el, { type: 'words,lines' });
  gsap.set(split.words, { overflow: 'hidden' });

  gsap.from(split.words, {
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger,
    ease: EASE.silk,
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
    onComplete: () => split.revert(),
  });
}

// ─── leafWipe ─────────────────────────────────────────────────────────────────
/**
 * clip-path leaf cut wipe reveal. Animates from a collapsed leaf shape
 * to full visibility.
 */
export async function leafWipe(el: Element) {
  if (prefersReducedMotion()) return;
  const gsap = await initGSAP();
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  gsap.from(el, {
    clipPath: 'inset(0 50% 0 50% round 50%)',
    opacity: 0,
    duration: 0.9,
    ease: EASE.silk,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

// ─── magneticButton ───────────────────────────────────────────────────────────
/**
 * Magnetic hover effect on button elements.
 * Only activates for fine-pointer (mouse) devices.
 */
export async function magneticButton(el: HTMLElement) {
  if (prefersReducedMotion()) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  const gsap = await initGSAP();

  const handleMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: EASE.out });
  };

  const handleLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: EASE.spring });
  };

  el.addEventListener('mousemove', handleMove);
  el.addEventListener('mouseleave', handleLeave);
}

// ─── cursorLitCard ────────────────────────────────────────────────────────────
/**
 * Cursor-following radial glow on cards.
 * Only activates for fine-pointer (mouse) devices.
 */
export function cursorLitCard(el: HTMLElement) {
  if (prefersReducedMotion()) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const handleMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--glow-x', `${x}px`);
    el.style.setProperty('--glow-y', `${y}px`);
    el.style.setProperty('--glow-opacity', '1');
  };

  const handleLeave = () => {
    el.style.setProperty('--glow-opacity', '0');
  };

  el.addEventListener('mousemove', handleMove);
  el.addEventListener('mouseleave', handleLeave);

  // Inject glow CSS once
  if (!el.classList.contains('mot-glow-ready')) {
    el.classList.add('mot-glow-ready');
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:absolute;inset:0;pointer-events:none;border-radius:inherit;
      background:radial-gradient(300px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(224,166,60,0.12) 0%, transparent 70%);
      opacity:var(--glow-opacity,0);transition:opacity 0.3s ease;z-index:1;
    `;
    el.appendChild(glow);
  }
}

// ─── counterUp ────────────────────────────────────────────────────────────────
/**
 * Animates a numeric counter from 0 to target on scroll-enter.
 */
export async function counterUp(el: Element, target: number) {
  if (prefersReducedMotion()) {
    el.textContent = String(target);
    return;
  }
  const gsap = await initGSAP();
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 1.6,
    ease: EASE.out,
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      el.textContent = Math.round(obj.val).toLocaleString();
    },
    onComplete: () => {
      el.textContent = target.toLocaleString();
    },
  });
}

// ─── initScrollStory ──────────────────────────────────────────────────────────
/**
 * Page-specific scroll storytelling initializer.
 * Uses GSAP ScrollTrigger for pinned scenes.
 */
export async function initScrollStory(pageKey: string) {
  if (prefersReducedMotion()) return;
  const gsap = await initGSAP();
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  if (pageKey === 'home') {
    // ScrollStoryHome uses CSS scroll-driven animations as primary.
    // This provides a ScrollTrigger fallback for browsers without animation-timeline support.
    const scene = document.querySelector('.ss-scene');
    if (!scene) return;

    const dishes = scene.querySelectorAll<HTMLElement>('.ss-dish');
    const paras = scene.querySelectorAll<HTMLElement>('.ss-para');

    // Check for native scroll-driven animation support
    const hasNativeScrollDriven =
      CSS.supports('animation-timeline', 'view()') ||
      CSS.supports('animation-timeline', 'scroll()');

    if (!hasNativeScrollDriven) {
      // GSAP ScrollTrigger fallback
      gsap.from(dishes, {
        opacity: 0,
        scale: 0.8,
        y: 30,
        stagger: 0.15,
        duration: 0.7,
        ease: EASE.out,
        scrollTrigger: {
          trigger: scene,
          start: 'top 70%',
          end: 'bottom 30%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(paras, {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.6,
        ease: EASE.out,
        scrollTrigger: {
          trigger: scene,
          start: 'top 60%',
          toggleActions: 'play none none none',
        },
      });
    }
  }
}
