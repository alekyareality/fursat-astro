import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function getGzip(buffer) {
  return zlib.gzipSync(buffer).length;
}

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Banquet', path: '/banquet' },
  { name: 'Menu', path: '/menu' },
  { name: 'Cafe', path: '/cafe' },
  { name: 'Party', path: '/party' }
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const p of PAGES) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    const jsRequests = [];
    let loadsGsap = false;

    page.on('response', async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      if (url.endsWith('.js') || url.includes('.js?') || contentType.includes('javascript')) {
        let size = 0;
        let gzSize = 0;
        try {
          const body = await response.body();
          size = body.length;
          gzSize = getGzip(body);
        } catch {
          // If body reading fails
        }
        const isGsap = url.includes('gsap.min.js');
        if (isGsap) loadsGsap = true;

        jsRequests.push({
          url: url.replace('http://localhost:4321', ''),
          status: response.status(),
          rawBytes: size,
          rawKb: (size / 1024).toFixed(2),
          gzipBytes: gzSize,
          gzipKb: (gzSize / 1024).toFixed(2),
          isGsap
        });
      }
    });

    console.log(`\nNavigating to ${p.name} (${p.path})...`);
    await page.goto(`http://localhost:4321${p.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Also extract inline script sizes directly from the DOM
    const inlineScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts
        .filter(s => !s.src && s.type !== 'application/ld+json')
        .map((s, i) => ({
          index: i + 1,
          length: s.textContent.length,
          snippet: s.textContent.trim().slice(0, 60)
        }));
    });

    const totalInlineChars = inlineScripts.reduce((acc, s) => acc + s.length, 0);
    const totalNetworkRawBytes = jsRequests.reduce((acc, r) => acc + r.rawBytes, 0);
    const totalNetworkGzipBytes = jsRequests.reduce((acc, r) => acc + r.gzipBytes, 0);

    results.push({
      page: p.name,
      path: p.path,
      loadsGsapOverNetwork: loadsGsap,
      networkJsCount: jsRequests.length,
      networkJs: jsRequests,
      inlineScriptCount: inlineScripts.length,
      inlineScriptDetails: inlineScripts,
      totalInlineChars,
      totalNetworkRawKb: (totalNetworkRawBytes / 1024).toFixed(2),
      totalNetworkGzipKb: (totalNetworkGzipBytes / 1024).toFixed(2)
    });

    await context.close();
  }

  await browser.close();

  console.log('\n' + '='.repeat(80));
  console.log('REAL NETWORK CAPTURE JS REPORT');
  console.log('='.repeat(80));

  for (const r of results) {
    console.log(`\nPage: ${r.page} (${r.path})`);
    console.log(`  Loads GSAP over network: ${r.loadsGsapOverNetwork ? 'YES (gsap.min.js fetched)' : 'NO'}`);
    console.log(`  External network JS requests (${r.networkJsCount}):`);
    for (const req of r.networkJs) {
      console.log(`    - [${req.status}] ${req.url.padEnd(55)} Raw: ${req.rawKb.padStart(7)} KB | Gzip: ${req.gzipKb.padStart(6)} KB`);
    }
    console.log(`  Inline scripts: ${r.inlineScriptCount} (${r.totalInlineChars} chars / ~${(r.totalInlineChars/1024).toFixed(2)} KB)`);
    console.log(`  TOTAL NETWORK JS: Raw ${r.totalNetworkRawKb} KB | Gzip ${r.totalNetworkGzipKb} KB (Budget: 120 KB)`);
  }

  fs.writeFileSync('review/network-js-report.json', JSON.stringify(results, null, 2));
  console.log('\nWrote review/network-js-report.json');
}

capture().catch(err => {
  console.error('Network capture error:', err);
  process.exit(1);
});
