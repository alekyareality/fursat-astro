import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  if (!fs.existsSync('review/shots')) {
    fs.mkdirSync('review/shots', { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  console.log('='.repeat(70));
  console.log('CHECKING #GATE VS MOBILE BOTTOM BAR & ENTRY PAGES');
  console.log('='.repeat(70));

  // --- 1. Fresh Entry on Home (/) ---
  console.log('\n1. Navigating to Home (/) with clean session...');
  await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const homeGateInfo = await page.evaluate(() => {
    const gate = document.getElementById('gate');
    const bar = document.querySelector('.mb-bar');
    
    let gateZ = gate ? window.getComputedStyle(gate).zIndex : 'none';
    let barZ = bar ? window.getComputedStyle(bar).zIndex : 'none';
    let gateVisible = gate ? window.getComputedStyle(gate).display !== 'none' && window.getComputedStyle(gate).opacity !== '0' : false;
    let gateClasses = gate ? gate.className : '';

    // Test elementFromPoint at the bottom center of the screen (where mobile bar sits)
    const hitElement = document.elementFromPoint(195, 810);
    const hitSelector = hitElement ? `${hitElement.tagName.toLowerCase()}.${hitElement.className}` : 'none';
    const hitInsideBar = bar ? bar.contains(hitElement) : false;
    const hitInsideGate = gate ? gate.contains(hitElement) : false;

    return {
      gatePresent: !!gate,
      gateClasses,
      gateZ,
      gateVisible,
      barPresent: !!bar,
      barZ,
      hitElement: hitSelector,
      hitInsideBar,
      hitInsideGate
    };
  });

  console.log('Home Gate & Mobile Bar Status:', JSON.stringify(homeGateInfo, null, 2));

  await page.screenshot({ path: 'review/shots/gate-390-home.png', fullPage: false });
  console.log('Saved screenshot: review/shots/gate-390-home.png');

  // --- 2. Fresh Entry on Non-Home Page (/banquet) ---
  console.log('\n2. Navigating to Banquet (/banquet) directly with clean session...');
  const page2 = await context.newPage();
  await page2.goto('http://localhost:4321/banquet', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1000);

  const banquetGateInfo = await page2.evaluate(() => {
    const gate = document.getElementById('gate');
    const bar = document.querySelector('.mb-bar');
    return {
      gatePresent: !!gate,
      barPresent: !!bar,
      barZ: bar ? window.getComputedStyle(bar).zIndex : 'none'
    };
  });

  console.log('Banquet Gate Status:', JSON.stringify(banquetGateInfo, null, 2));

  await page2.screenshot({ path: 'review/shots/gate-390-banquet.png', fullPage: false });
  console.log('Saved screenshot: review/shots/gate-390-banquet.png');

  await browser.close();

  fs.writeFileSync('review/gate-check-results.json', JSON.stringify({
    home: homeGateInfo,
    banquet: banquetGateInfo
  }, null, 2));
  console.log('\nWrote review/gate-check-results.json');
}

run().catch(err => {
  console.error('Error running gate check:', err);
  process.exit(1);
});
