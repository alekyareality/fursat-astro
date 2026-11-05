import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('review/shots');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';
const WIDTHS = [360, 390, 768, 1280];
const HEIGHT = 900;

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'banquet', path: '/banquet' },
];

async function main() {
  console.log(`Taking screenshots against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const p of PAGES) {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: HEIGHT });
      const url = `${BASE_URL}${p.path}`;
      console.log(`Navigating to ${url} @ ${w}px...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // small delay for layout and fonts to settle
      await page.waitForTimeout(1500);

      const filePath = path.join(OUT_DIR, `${p.name}-${w}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${filePath}`);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
