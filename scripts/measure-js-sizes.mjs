import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function getGzipSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath);
  return zlib.gzipSync(content).length;
}

function getRawSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  return fs.statSync(filePath).size;
}

const pages = [
  { name: 'Home', file: 'index.html' },
  { name: 'Banquet', file: 'banquet/index.html' },
  { name: 'Menu', file: 'menu/index.html' },
  { name: 'Cafe', file: 'cafe/index.html' }
];

console.log('='.repeat(80));
console.log('REAL GZIPPED JS SIZE PER PAGE VS 120 KB BUDGET');
console.log('='.repeat(80));

const results = [];

for (const p of pages) {
  const fullPath = path.join('dist', p.file);
  const html = fs.readFileSync(fullPath, 'utf-8');

  // match script tags
  const scriptRegex = /<script[^>]*src="([^"]+)"/g;
  let m;
  const scripts = [];
  while ((m = scriptRegex.exec(html)) !== null) {
    scripts.push(m[1]);
  }

  // check if GSAP is loaded dynamically via motion-kit
  const hasMotHeadline = html.includes('mot-headline');
  const hasMotRevealImg = html.includes('mot-reveal-img');
  const hasMotMagnetic = html.includes('mot-magnetic');
  const hasMotCounter = html.includes('mot-counter');
  const hasMotParallax = html.includes('mot-parallax-frame');
  const loadsGSAP = hasMotHeadline || hasMotRevealImg || hasMotMagnetic || hasMotCounter || hasMotParallax;

  const pageScripts = [...scripts];
  if (loadsGSAP && !pageScripts.includes('/js/gsap.min.js')) {
    pageScripts.push('/js/gsap.min.js');
  }

  let totalRaw = 0;
  let totalGzip = 0;
  const scriptDetails = [];

  for (const s of pageScripts) {
    let diskPath;
    if (s.startsWith('/_astro/')) {
      diskPath = path.join('dist', s.slice(1));
    } else {
      diskPath = path.join('dist', s.slice(1));
      if (!fs.existsSync(diskPath)) {
        diskPath = path.join('public', s.slice(1));
      }
    }
    const raw = getRawSize(diskPath);
    const gz = getGzipSize(diskPath);
    totalRaw += raw;
    totalGzip += gz;
    scriptDetails.push({
      path: s,
      rawKb: (raw / 1024).toFixed(2),
      gzipKb: (gz / 1024).toFixed(2)
    });
  }

  results.push({
    page: p.name,
    loadsGSAP,
    scripts: scriptDetails,
    totalRawKb: (totalRaw / 1024).toFixed(2),
    totalGzipKb: (totalGzip / 1024).toFixed(2),
    budgetKb: 120,
    withinBudget: (totalGzip / 1024) <= 120
  });
}

for (const r of results) {
  console.log(`\nPage: ${r.page}`);
  console.log(`Loads GSAP: ${r.loadsGSAP ? 'Yes (on-demand via motion-kit)' : 'No'}`);
  console.log('Scripts loaded:');
  r.scripts.forEach(s => {
    console.log(`  - ${s.path.padEnd(50)} Raw: ${s.rawKb.padStart(7)} KB | Gzip: ${s.gzipKb.padStart(6)} KB`);
  });
  console.log(`TOTAL JS: Raw ${r.totalRawKb} KB | Gzip ${r.totalGzipKb} KB | Budget: 120 KB | Status: ${r.withinBudget ? 'PASS (Under Budget)' : 'FAIL (Exceeds Budget)'}`);
}

fs.writeFileSync('review/js-budget-report.json', JSON.stringify(results, null, 2));
console.log('\nWrote review/js-budget-report.json');
