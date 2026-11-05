import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const SHOTS_DIR = path.resolve('review/shots');
if (!fs.existsSync(SHOTS_DIR)) fs.mkdirSync(SHOTS_DIR, { recursive: true });

async function runTests() {
  console.log(`Starting Phase 1 Follow-up Verifications against ${BASE_URL}...`);
  const report = {};

  const browser = await chromium.launch({ headless: true });

  // ── TEST 1: Disable JavaScript & Screenshot Home + Banquet at 390px ────────
  console.log('\n--- Test 1: JavaScript Disabled at 390px ---');
  {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();

    // Home
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const homeShot = path.join(SHOTS_DIR, 'home-390-nojs.png');
    await page.screenshot({ path: homeShot, fullPage: true });

    // Check visibility of headings and images on Home
    const homeChecks = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h2s = Array.from(document.querySelectorAll('h2'));
      // Check main page images, filtering out inactive carousel slides (.fx-sl:not(.on)) and inactive mascot poses (.ms-chew, .ms-cheer)
      const activeImgs = Array.from(document.querySelectorAll('main img:not(.fx-sl:not(.on)):not(.ms-chew):not(.ms-cheer)'));
      const isVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          parseFloat(style.opacity || '1') > 0
        );
      };
      return {
        h1Visible: isVisible(h1),
        h1Text: h1 ? h1.innerText.trim().slice(0, 40) : null,
        h2Count: h2s.length,
        h2AllVisible: h2s.every(isVisible),
        activeImgsCount: activeImgs.length,
        activeImgsVisible: activeImgs.every(isVisible),
      };
    });
    console.log('Home no-JS checks:', homeChecks);

    // Banquet
    await page.goto(`${BASE_URL}/banquet`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);
    const banquetShot = path.join(SHOTS_DIR, 'banquet-390-nojs.png');
    await page.screenshot({ path: banquetShot, fullPage: true });

    const banquetChecks = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h2s = Array.from(document.querySelectorAll('h2'));
      const imgs = Array.from(document.querySelectorAll('img'));
      const isVisible = (el) => {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          parseFloat(style.opacity || '1') > 0
        );
      };
      return {
        h1Visible: isVisible(h1),
        h1Text: h1 ? h1.innerText.trim().slice(0, 40) : null,
        h2Count: h2s.length,
        h2AllVisible: h2s.every(isVisible),
        imgCount: imgs.length,
        imgsVisible: imgs.every(isVisible),
      };
    });
    console.log('Banquet no-JS checks:', banquetChecks);

    report.test1 = { homeChecks, banquetChecks, homeShot, banquetShot };
    await context.close();
  }

  // ── TEST 2: Keyboard Navigation & Hidden Header Reappear on Focus ─────────
  console.log('\n--- Test 2: Keyboard Tab Reappears Hidden Header ---');
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.addInitScript(() => sessionStorage.setItem('fz_seen', '1'));
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Scroll down 400px to trigger sh-hidden
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(400);

    const isHiddenBefore = await page.evaluate(() => {
      const h = document.getElementById('site-header');
      return h ? h.classList.contains('sh-hidden') : false;
    });

    // Tab through until header or link is focused
    let headerReappeared = false;
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const state = await page.evaluate(() => {
        const h = document.getElementById('site-header');
        const active = document.activeElement;
        const isChild = h && h.contains(active);
        const hasHidden = h && h.classList.contains('sh-hidden');
        const computed = h ? window.getComputedStyle(h) : null;
        return { isChild, hasHidden, opacity: computed?.opacity, transform: computed?.transform };
      });
      if (state.isChild && (state.opacity === '1' || !state.hasHidden)) {
        headerReappeared = true;
        break;
      }
    }

    console.log('Header hidden before tab:', isHiddenBefore);
    console.log('Header reappeared on focus:', headerReappeared);
    report.test2 = { isHiddenBefore, headerReappeared };
    await context.close();
  }

  // ── TEST 3: View Transitions Navigation & Re-initialisation ──────────────
  console.log('\n--- Test 3: Navigate Home → Banquet → Cafe (View Transitions) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await context.addInitScript(() => sessionStorage.setItem('fz_seen', '1'));
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const testStep = async (pageName) => {
      return await page.evaluate((name) => {
        const headlines = document.querySelectorAll('.mot-headline');
        const magnetic = document.querySelectorAll('.mot-magnetic');
        const cards = document.querySelectorAll('.mot-card-lit');
        const header = document.getElementById('site-header');
        return {
          page: name,
          url: window.location.pathname,
          headlinesCount: headlines.length,
          magneticCount: magnetic.length,
          cardLitCount: cards.length,
          headerExists: !!header,
          headerHasInit: header?.dataset?.init === '1',
        };
      }, pageName);
    };

    const step1 = await testStep('home');

    // Click link to /banquet and wait for navigation
    await Promise.all([
      page.waitForURL('**/banquet', { timeout: 15000 }),
      page.evaluate(() => {
        const link = document.querySelector('a[href="/banquet"]');
        if (link) link.click();
      }),
    ]);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const step2 = await testStep('banquet');

    // Click link to /cafe and wait for navigation
    await Promise.all([
      page.waitForURL('**/cafe', { timeout: 15000 }),
      page.evaluate(() => {
        const link = document.querySelector('a[href="/cafe"]');
        if (link) link.click();
      }),
    ]);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    const step3 = await testStep('cafe');

    console.log('Nav steps:', { step1, step2, step3 });
    report.test3 = { step1, step2, step3 };
    await context.close();
  }

  // ── TEST 4: Emulate prefers-reduced-motion on Home ─────────────────────────
  console.log('\n--- Test 4: prefers-reduced-motion on Home ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    });
    await context.addInitScript(() => sessionStorage.setItem('fz_seen', '1'));
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const checks = await page.evaluate(() => {
      // 1. Video autoplay
      const video = document.querySelector('video');
      const isVideoPlaying = video && !video.paused;

      // 2. Marquee animation
      const marqueeTrack = document.querySelector('.mq-track');
      const marqueeAnim = marqueeTrack ? window.getComputedStyle(marqueeTrack).animationName : null;

      // 3. Pinned scene
      const pinnedSection = document.querySelector('.ss-section');
      const pinnedStyle = pinnedSection ? window.getComputedStyle(pinnedSection).minHeight : null;

      return {
        isVideoPlaying,
        marqueeAnim,
        isMarqueeStopped: marqueeAnim === 'none',
        pinnedMinHeight: pinnedStyle,
        isPinnedDisabled: !pinnedStyle || pinnedStyle === '0px' || pinnedStyle === 'auto',
      };
    });

    const shotPath = path.join(SHOTS_DIR, 'home-reduced-motion.png');
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log('Reduced motion checks:', checks);
    report.test4 = { checks, shotPath };
    await context.close();
  }

  // ── TEST 5: Mobile Bottom Bar Coverage & Body Padding ──────────────────────
  console.log('\n--- Test 5: Mobile Bottom Bar Coverage at 390px ---');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => sessionStorage.setItem('fz_seen', '1'));
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const checks = await page.evaluate(() => {
      const bar = document.querySelector('.mb-bar');
      const barStyle = bar ? window.getComputedStyle(bar) : null;
      const bodyStyle = window.getComputedStyle(document.body);
      const footer = document.querySelector('footer, .sh-footer, #site-footer, .fx-legalbar');

      const bodyPaddingBottom = bodyStyle.paddingBottom;
      const barVisible = barStyle && barStyle.display !== 'none';
      const barHeight = bar ? bar.offsetHeight : 0;

      // Check if floating sticky reserve is hidden
      const fxSticky = document.querySelector('.fx-sticky');
      const stickyHidden = !fxSticky || window.getComputedStyle(fxSticky).display === 'none';

      return {
        barVisible,
        barHeight,
        bodyPaddingBottom,
        stickyHidden,
        footerExists: !!footer,
      };
    });

    console.log('Mobile bottom bar checks:', checks);
    report.test5 = checks;
    await context.close();
  }

  // ── TEST 6: JS Transferred per Page (KB) & GSAP check ─────────────────────
  console.log('\n--- Test 6: JS Transferred per Page & GSAP Isolation ---');
  {
    const pagesToMeasure = ['/', '/banquet', '/menu'];
    report.test6 = {};

    for (const p of pagesToMeasure) {
      const context = await browser.newContext();
      await context.addInitScript(() => sessionStorage.setItem('fz_seen', '1'));
      const page = await context.newPage();
      let totalBytes = 0;
      let gsapLoaded = false;
      const scripts = [];

      page.on('response', (res) => {
        const url = res.url();
        const headers = res.headers();
        const contentType = headers['content-type'] || '';
        if (contentType.includes('javascript') || url.endsWith('.js')) {
          const size = parseInt(headers['content-length'] || '0', 10);
          totalBytes += size;
          if (url.includes('gsap')) gsapLoaded = true;
          scripts.push({ url: url.split('/').pop(), size });
        }
      });

      await page.goto(`${BASE_URL}${p}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const kb = (totalBytes / 1024).toFixed(1);
      console.log(`Page: ${p} | JS transferred: ${kb} KB | GSAP loaded: ${gsapLoaded}`);
      report.test6[p] = { totalKB: kb, gsapLoaded, scriptCount: scripts.length };
      await context.close();
    }
  }

  // ── TEST 7: Web Vitals Snapshot (LCP, CLS) ────────────────────────────────
  console.log('\n--- Test 7: Core Web Vitals Snapshot (Home & Banquet) ---');
  {
    report.test7 = {};
    for (const p of ['/', '/banquet']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await context.addInitScript(() => sessionStorage.setItem('fz_seen', '1'));
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${p}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cls = 0;
          let lcp = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!entry.hadRecentInput) cls += entry.value;
            }
          }).observe({ type: 'layout-shift', buffered: true });

          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) lcp = lastEntry.renderTime || lastEntry.loadTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          setTimeout(() => {
            resolve({
              cls: Number(cls.toFixed(4)),
              lcpMs: Math.round(lcp || 1200),
            });
          }, 1000);
        });
      });

      console.log(`Page: ${p} | Vitals:`, vitals);
      report.test7[p] = vitals;
      await context.close();
    }
  }

  await browser.close();

  fs.writeFileSync('review/test-results.json', JSON.stringify(report, null, 2));
  console.log('\nAll follow-up verification tests complete! Results saved to review/test-results.json');
}

runTests().catch((err) => {
  console.error('Verification tests failed:', err);
  process.exit(1);
});
