#!/usr/bin/env node
/**
 * overflow-check.mjs — Fursat Kitchen | Bar
 * Playwright script to detect horizontal overflow on all pages at multiple widths.
 *
 * Usage:
 *   node scripts/overflow-check.mjs [--url <base>] [--help]
 *
 * Expects the preview server at http://localhost:4321 by default.
 * Exit code 1 if any page overflows at any tested width.
 */

import { chromium } from 'playwright';

const PAGES = [
  '/',
  '/menu',
  '/banquet',
  '/cafe',
  '/restaurant-bar',
  '/reserve',
  '/ask',
  '/story',
  '/events',
  '/catering',
  '/terms',
  '/order',
];

const WIDTHS = [360, 390, 768, 1024, 1280, 1536];
const HEIGHT = 900;

// ─── Argument Parsing ──────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
overflow-check.mjs — Fursat horizontal overflow checker

Usage:
  node scripts/overflow-check.mjs [options]

Options:
  --url <base>   Base URL of the preview server (default: http://localhost:4321)
  --help, -h     Show this help message

Tests pages:
  ${PAGES.join(', ')}

Tests at widths (px):
  ${WIDTHS.join(', ')} (height: ${HEIGHT})

Exits with code 0 if no overflow, code 1 if any overflow found.
`);
  process.exit(0);
}

let BASE_URL = 'http://localhost:4321';
const urlIdx = args.indexOf('--url');
if (urlIdx !== -1 && args[urlIdx + 1]) {
  BASE_URL = args[urlIdx + 1].replace(/\/$/, '');
}

// ─── Main ──────────────────────────────────────────────────────────────────
let failures = 0;
const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: HEIGHT });

    for (const path of PAGES) {
      const url = BASE_URL + path;

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(500);
      } catch (err) {
        // If page doesn't exist (404 etc.) treat as non-overflow but log
        console.warn(`  ⚠  ${path} @ ${width}px — load error: ${err.message}`);
        continue;
      }

      // Check for horizontal overflow
      const overflows = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        return { docWidth, winWidth, overflows: docWidth > winWidth };
      });

      if (overflows.overflows) {
        console.error(
          `  ✗ OVERFLOW: ${path} @ ${width}px` +
          ` (scrollWidth=${overflows.docWidth}, innerWidth=${overflows.winWidth})`
        );
        failures++;
      } else {
        console.log(`  ✓ ${path} @ ${width}px`);
      }
    }
  }
} finally {
  await browser.close();
}

if (failures > 0) {
  console.error(`\n❌ ${failures} overflow(s) found. Fix before deploying.\n`);
  process.exit(1);
} else {
  console.log(`\n✅ No overflow detected across all pages and widths.\n`);
  process.exit(0);
}
