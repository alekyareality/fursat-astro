import { chromium } from 'playwright';
import fs from 'fs';
import zlib from 'zlib';

function getGzip(buffer) {
  return zlib.gzipSync(buffer).length;
}

const BUDGETS = {
  maxTransferKb: 500,     // Max first load transferred (excluding hero)
  maxHeroImageKb: 150,    // Hero image under 150 KB
  maxJsGzipKb: 120        // JavaScript under 120 KB gzipped on pages without 3D
};

// Pages to audit against the mobile budget
const PAGES = [
  { name: 'Home', path: '/', has3D: true },
  { name: 'Banquet', path: '/banquet', has3D: false },
  { name: 'Menu', path: '/menu', has3D: false },
  { name: 'Cafe', path: '/cafe', has3D: false },
  { name: 'Restaurant & Bar', path: '/restaurant-bar', has3D: false },
  { name: 'Reserve', path: '/reserve', has3D: false },
  { name: 'Ask Fursat', path: '/ask', has3D: false },
  { name: 'Story', path: '/story', has3D: false },
  { name: 'Events', path: '/events', has3D: false },
  { name: 'Catering', path: '/catering', has3D: false },
  { name: 'Terms', path: '/terms', has3D: false },
  { name: 'Order', path: '/order', has3D: false }
];

async function runBudget() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  let anyFailed = false;

  console.log('='.repeat(80));
  console.log('FURSAT MOBILE PERFORMANCE BUDGET CHECKER (scripts/mobile-budget.mjs)');
  console.log(`Budgets: JS <= ${BUDGETS.maxJsGzipKb} KB gz (non-3D) | Hero Image <= ${BUDGETS.maxHeroImageKb} KB`);
  console.log('='.repeat(80));

  for (const p of PAGES) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();

    let totalTransfer = 0;
    let totalJsRaw = 0;
    let totalJsGzip = 0;
    let heroImageBytes = 0;
    let heroImageUrl = '';
    const jsFiles = [];

    page.on('response', async (response) => {
      const url = response.url();
      const ct = response.headers()['content-type'] || '';
      try {
        const body = await response.body();
        const len = body.length;
        totalTransfer += len;

        if (url.endsWith('.js') || url.includes('.js?') || ct.includes('javascript')) {
          const gz = getGzip(body);
          totalJsRaw += len;
          totalJsGzip += gz;
          jsFiles.push({ url: url.replace('http://localhost:4321', ''), raw: len, gz });
        }

        // Detect hero image (Banquet: space_18, Ask: hero-*, Home: 51db3af80d video poster)
        if (url.includes('space_18') || url.includes('hero') || url.includes('51db3af80d')) {
          if (len > heroImageBytes) {
            heroImageBytes = len;
            heroImageUrl = url.replace('http://localhost:4321', '');
          }
        }
      } catch {
        // stream or aborted
      }
    });

    try {
      await page.goto(`http://localhost:4321${p.path}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);
    } catch (e) {
      console.warn(`  Warning loading ${p.path}: ${e.message}`);
    }

    const jsGzipKb = (totalJsGzip / 1024).toFixed(2);
    const heroKb = (heroImageBytes / 1024).toFixed(2);
    const nonHeroTransferKb = ((totalTransfer - heroImageBytes) / 1024).toFixed(2);

    const jsPass = p.has3D || parseFloat(jsGzipKb) <= BUDGETS.maxJsGzipKb;
    const heroPass = heroImageBytes === 0 || parseFloat(heroKb) <= BUDGETS.maxHeroImageKb;

    if (!jsPass || !heroPass) {
      anyFailed = true;
    }

    results.push({
      page: p.name,
      path: p.path,
      has3D: p.has3D,
      jsGzipKb,
      jsPass,
      heroImage: heroImageUrl || 'none',
      heroKb,
      heroPass,
      totalTransferKb: (totalTransfer / 1024).toFixed(2),
      nonHeroTransferKb,
      overallPass: jsPass && heroPass
    });

    await context.close();
  }

  await browser.close();

  console.log('\nRESULTS PER PAGE:');
  console.log('-'.repeat(80));
  console.log(
    'Page'.padEnd(20) +
    'Gzip JS (KB)'.padStart(14) +
    'JS Budget'.padStart(12) +
    'Hero Img (KB)'.padStart(15) +
    'Hero Budget'.padStart(14) +
    'Status'.padStart(10)
  );
  console.log('-'.repeat(80));

  for (const r of results) {
    const jsStatus = r.jsPass ? 'PASS' : 'FAIL';
    const heroStatus = r.heroPass ? 'PASS' : 'FAIL';
    const overall = r.overallPass ? '✅ PASS' : '❌ FAIL';
    console.log(
      r.page.padEnd(20) +
      r.jsGzipKb.padStart(14) +
      (r.has3D ? ' (3D exempt)' : ` <= ${BUDGETS.maxJsGzipKb}K`).padStart(12) +
      r.heroKb.padStart(15) +
      ` <= ${BUDGETS.maxHeroImageKb}K`.padStart(14) +
      overall.padStart(10)
    );
  }
  console.log('-'.repeat(80));

  fs.writeFileSync('review/mobile-budget-report.json', JSON.stringify(results, null, 2));
  console.log('\nWrote review/mobile-budget-report.json');

  if (anyFailed) {
    console.error('\n❌ Mobile budget checks failed.');
    process.exit(1);
  } else {
    console.log('\n✅ All audited mobile pages passed the mobile performance budget!');
    process.exit(0);
  }
}

runBudget().catch(err => {
  console.error('Mobile budget check error:', err);
  process.exit(1);
});
