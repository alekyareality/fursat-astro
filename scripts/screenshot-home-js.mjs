import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('review/shots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await chromium.launch({ headless: true });

  // 1. With JavaScript ON
  console.log('Capturing Home at 390px with JS ON...');
  const ctxOn = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: true
  });
  const pageOn = await ctxOn.newPage();
  await pageOn.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pageOn.waitForTimeout(2000);

  // Check TableSpread section
  const tsOn = await pageOn.$('.ts-section');
  const tsMobCardsOn = await pageOn.$$('.ts-mob-card');
  const tsTitleOn = await pageOn.$eval('.ts-title', el => el.textContent.trim()).catch(() => 'NOT FOUND');
  console.log(`JS ON - TableSpread Title: "${tsTitleOn}", Mobile Cards count: ${tsMobCardsOn.length}`);

  await pageOn.screenshot({ path: path.join(OUT_DIR, 'home-390-json-viewport.png'), fullPage: false });
  // Scroll to TableSpread
  if (tsOn) {
    await tsOn.scrollIntoViewIfNeeded();
    await pageOn.waitForTimeout(800);
    await pageOn.screenshot({ path: path.join(OUT_DIR, 'home-390-json-tablespread.png'), fullPage: false });
  }
  await pageOn.screenshot({ path: path.join(OUT_DIR, 'home-390-json-full.png'), fullPage: true });
  await ctxOn.close();

  // 2. With JavaScript OFF
  console.log('Capturing Home at 390px with JS OFF...');
  const ctxOff = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: false
  });
  const pageOff = await ctxOff.newPage();
  await pageOff.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pageOff.waitForTimeout(1000);

  const tsOff = await pageOff.$('.ts-section');
  const tsMobCardsOff = await pageOff.$$('.ts-mob-card');
  const tsTitleOff = await pageOff.$eval('.ts-title', el => el.textContent.trim()).catch(() => 'NOT FOUND');
  console.log(`JS OFF - TableSpread Title: "${tsTitleOff}", Mobile Cards count: ${tsMobCardsOff.length}`);

  await pageOff.screenshot({ path: path.join(OUT_DIR, 'home-390-jsoff-viewport.png'), fullPage: false });
  if (tsOff) {
    await tsOff.scrollIntoViewIfNeeded();
    await pageOff.waitForTimeout(500);
    await pageOff.screenshot({ path: path.join(OUT_DIR, 'home-390-jsoff-tablespread.png'), fullPage: false });
  }
  await pageOff.screenshot({ path: path.join(OUT_DIR, 'home-390-jsoff-full.png'), fullPage: true });
  await ctxOff.close();

  await browser.close();
  console.log('Done capturing screenshots!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
