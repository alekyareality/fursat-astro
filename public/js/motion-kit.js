/**
 * motion-kit.js — Fursat Kitchen | Bar
 * Self-contained vanilla JS motion kit. No ES imports.
 * Loads GSAP dynamically from /js/gsap.min.js only when animated elements exist.
 *
 * Classes consumed:
 *   .mot-headline        — H1/H2 word/line split-reveal
 *   .mot-reveal-img      — clip-path leaf-wipe reveal
 *   .mot-magnetic        — magnetic button (fine pointer only)
 *   .mot-card-lit        — cursor-following glow on cards
 *   .mot-counter         — number counter (data-target="N")
 *   .mot-marquee         — CSS marquee, pauses on hover/focus-within
 *   .mot-parallax-frame  — scroll-driven parallax (image inside moves slower)
 */
(function () {
  'use strict';

  // ─── Reduced Motion & Pointer Guards ──────────────────────────────────────
  function isReduced() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function isFinePointer() {
    return window.matchMedia('(pointer: fine)').matches;
  }

  // ─── GSAP Loader ──────────────────────────────────────────────────────────
  var _gsap = null;
  var _ST = null;
  var _Split = null;
  var _gsapReady = false;
  var _gsapCallbacks = [];

  function loadGSAP(cb) {
    if (_gsapReady) { cb(_gsap, _ST, _Split); return; }
    _gsapCallbacks.push(cb);
    if (_gsapCallbacks.length > 1) return; // already loading

    var script = document.createElement('script');
    script.src = '/js/gsap.min.js';
    script.onload = function () {
      _gsap = window.gsap;
      if (!_gsap) { console.warn('[motion-kit] GSAP not found on window'); return; }

      // ScrollTrigger is bundled in GSAP 3.13+
      if (window.ScrollTrigger) {
        _ST = window.ScrollTrigger;
        _gsap.registerPlugin(_ST);
      }
      // SplitText is bundled in GSAP 3.13+ (now free)
      if (window.SplitText) {
        _Split = window.SplitText;
        _gsap.registerPlugin(_Split);
      }

      _gsapReady = true;
      _gsapCallbacks.forEach(function (fn) { fn(_gsap, _ST, _Split); });
      _gsapCallbacks = [];
    };
    script.onerror = function () {
      console.warn('[motion-kit] Failed to load GSAP from /js/gsap.min.js');
    };
    document.head.appendChild(script);
  }

  // ─── Headline Reveal ──────────────────────────────────────────────────────
  function initHeadlines() {
    var els = document.querySelectorAll('.mot-headline:not([data-headline-ready])');
    if (!els.length) return;

    if (isReduced()) {
      els.forEach(function (el) { el.dataset.headlineReady = '1'; });
      return;
    }

    loadGSAP(function (gsap, ST, Split) {
      if (!Split) {
        els.forEach(function (el) {
          if (el.dataset.headlineReady) return;
          el.dataset.headlineReady = '1';
          gsap.from(el, {
            opacity: 0, y: 32, duration: 0.7, ease: 'expo.out',
            scrollTrigger: ST ? { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } : null
          });
        });
        return;
      }

      els.forEach(function (el) {
        if (el.dataset.headlineReady) return;
        el.dataset.headlineReady = '1';
        var split = new Split(el, { type: 'words,lines' });

        gsap.from(split.words, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: ST ? {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          } : null,
          onComplete: function () { split.revert(); }
        });
      });
    });
  }

  // ─── Image Wipe Reveal ────────────────────────────────────────────────────
  function initRevealImgs() {
    var els = document.querySelectorAll('.mot-reveal-img:not([data-reveal-ready])');
    if (!els.length || isReduced()) return;

    loadGSAP(function (gsap, ST) {
      els.forEach(function (el) {
        if (el.dataset.revealReady) return;
        el.dataset.revealReady = '1';
        gsap.from(el, {
          clipPath: 'inset(0 50% 0 50% round 50%)',
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: ST ? {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          } : null
        });
      });
    });
  }

  // ─── Magnetic Buttons ─────────────────────────────────────────────────────
  function initMagnetic() {
    if (isReduced() || !isFinePointer()) return;
    var els = document.querySelectorAll('.mot-magnetic:not([data-magnetic-ready])');
    if (!els.length) return;

    loadGSAP(function (gsap) {
      els.forEach(function (el) {
        if (el.dataset.magneticReady) return;
        el.dataset.magneticReady = '1';

        el.addEventListener('mousemove', function (e) {
          var rect = el.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top + rect.height / 2;
          var dx = (e.clientX - cx) * 0.35;
          var dy = (e.clientY - cy) * 0.35;
          gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
        });
      });
    });
  }

  // ─── Cursor-Lit Cards ─────────────────────────────────────────────────────
  function initCardLit() {
    if (isReduced() || !isFinePointer()) return;
    var els = document.querySelectorAll('.mot-card-lit:not([data-glow-ready])');
    if (!els.length) return;

    els.forEach(function (el) {
      el.dataset.glowReady = '1';
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      var glow = document.createElement('div');
      glow.setAttribute('aria-hidden', 'true');
      glow.style.cssText = [
        'position:absolute',
        'inset:0',
        'pointer-events:none',
        'border-radius:inherit',
        'background:radial-gradient(300px circle at var(--glow-x,50%) var(--glow-y,50%), rgba(224,166,60,0.13) 0%, transparent 70%)',
        'opacity:var(--glow-opacity,0)',
        'transition:opacity 0.3s ease',
        'z-index:1'
      ].join(';');
      el.appendChild(glow);

      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        el.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
        el.style.setProperty('--glow-opacity', '1');
      });
      el.addEventListener('mouseleave', function () {
        el.style.setProperty('--glow-opacity', '0');
      });
    });
  }

  // ─── Number Counters ──────────────────────────────────────────────────────
  function initCounters() {
    var els = document.querySelectorAll('.mot-counter[data-target]:not([data-counter-ready])');
    if (!els.length) return;

    if (isReduced()) {
      els.forEach(function (el) {
        el.dataset.counterReady = '1';
        el.textContent = el.dataset.target;
      });
      return;
    }

    loadGSAP(function (gsap, ST) {
      els.forEach(function (el) {
        if (el.dataset.counterReady) return;
        el.dataset.counterReady = '1';
        var target = parseFloat(el.dataset.target) || 0;
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: ST ? {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          } : null,
          onUpdate: function () {
            el.textContent = Math.round(obj.val).toLocaleString();
          },
          onComplete: function () {
            el.textContent = target.toLocaleString();
          }
        });
      });
    });
  }

  // ─── Marquee (CSS-driven, JS only pauses on focus) ────────────────────────
  function initMarquees() {
    var els = document.querySelectorAll('.mot-marquee:not([data-marquee-ready])');
    els.forEach(function (el) {
      el.dataset.marqueeReady = '1';
      el.addEventListener('focusin', function () {
        el.style.animationPlayState = 'paused';
        var inner = el.querySelector('.mq-track');
        if (inner) inner.style.animationPlayState = 'paused';
      });
      el.addEventListener('focusout', function () {
        el.style.animationPlayState = '';
        var inner = el.querySelector('.mq-track');
        if (inner) inner.style.animationPlayState = '';
      });
    });
  }

  // ─── Parallax Frames ─────────────────────────────────────────────────────
  function initParallax() {
    if (isReduced()) return;
    var frames = document.querySelectorAll('.mot-parallax-frame:not([data-parallax-ready])');
    if (!frames.length) return;

    loadGSAP(function (gsap, ST) {
      if (!ST) return;
      frames.forEach(function (frame) {
        if (frame.dataset.parallaxReady) return;
        frame.dataset.parallaxReady = '1';
        var img = frame.querySelector('img');
        if (!img) return;
        gsap.to(img, {
          y: '20%',
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    });
  }

  // ─── Init lifecycle ───────────────────────────────────────────────────────
  function init() {
    initHeadlines();
    initRevealImgs();
    initMagnetic();
    initCardLit();
    initCounters();
    initMarquees();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialise after every Astro client-side View Transition navigation
  document.addEventListener('astro:page-load', init);
})();
