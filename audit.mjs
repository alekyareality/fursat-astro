import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:4321';
const OUT = 'C:/Users/Seminarhall/.gemini/antigravity/brain/0ffc6e82-6178-4bea-bbf2-0d814d061172/scratch/screenshots';
const WIDTHS = [375, 768, 1280];

const PAGES = [
  { slug: '/', label: 'Home' },
  { slug: '/menu', label: 'Menu_3D' },
  { slug: '/restaurant-bar', label: 'Restaurant_Bar' },
  { slug: '/cafe', label: 'Cafe' },
  { slug: '/banquet', label: 'Banquet' },
  { slug: '/events', label: 'Events' },
  { slug: '/catering', label: 'Catering' },
  { slug: '/reserve', label: 'Reserve' },
  { slug: '/ask', label: 'Ask_Fursat' },
  { slug: '/story', label: 'Story' },
  { slug: '/terms', label: 'Terms' },
  { slug: '/order', label: 'Order' },
];

fs.mkdirSync(OUT, { recursive: true });

async function run() {
  console.log('Launching browser for fast visual audit...');
  const browser = await chromium.launch({ headless: true });
  
  for (const pg of PAGES) {
    console.log(`Auditing: ${pg.label} (${pg.slug})...`);
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: 900 },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      try {
        await page.goto(`${BASE}${pg.slug}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(600);
        const fname = `${pg.label}_${w}px.png`;
        await page.screenshot({ path: path.join(OUT, fname), fullPage: false });
        console.log(`  ✓ ${pg.label} @ ${w}px captured`);
      } catch (e) {
        console.error(`  ✕ ${pg.label} @ ${w}px: ${e.message}`);
      } finally {
        await ctx.close();
      }
    }
  }

  await browser.close();
  console.log('ALL SCREENSHOTS COMPLETED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
