import fs from 'fs';

function extractMetrics(file) {
  if (!fs.existsSync(file)) return null;
  const lh = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const c = lh.categories;
  const a = lh.audits;
  return {
    performance: Math.round((c.performance?.score || 0) * 100),
    accessibility: Math.round((c.accessibility?.score || 0) * 100),
    bestPractices: Math.round((c['best-practices']?.score || 0) * 100),
    seo: Math.round((c.seo?.score || 0) * 100),
    fcp: a['first-contentful-paint']?.displayValue,
    lcp: a['largest-contentful-paint']?.displayValue,
    tbt: a['total-blocking-time']?.displayValue,
    cls: a['cumulative-layout-shift']?.displayValue,
    speedIndex: a['speed-index']?.displayValue,
    lcpElement: a['lcp-breakdown-insight']?.details?.items?.find(i => i.type === 'node')?.snippet ||
                a['largest-contentful-paint-element']?.details?.items?.[0]?.node?.snippet ||
                a['largest-contentful-paint-element']?.displayValue
  };
}

const homeBefore = extractMetrics('review/lighthouse-home.json');
const banquetBefore = extractMetrics('review/lighthouse-banquet.json');
const homeAfter = extractMetrics('review/lighthouse-home-after.json');
const banquetAfter = extractMetrics('review/lighthouse-banquet-after.json');

console.log('='.repeat(80));
console.log('LIGHTHOUSE MOBILE AUDIT COMPARISON: BEFORE VS AFTER STEP 3');
console.log('='.repeat(80));

function printComparison(name, before, after) {
  console.log(`\n${name}:`);
  console.log(`  Metric                 Before          After           Target / Change`);
  console.log(`  ----------------------------------------------------------------------`);
  if (before && after) {
    console.log(`  Performance:           ${String(before.performance).padEnd(16)}${String(after.performance).padEnd(16)}${after.performance >= 90 ? '✅ 90+' : '⚠️ ' + (after.performance - before.performance > 0 ? '+' : '') + (after.performance - before.performance)}`);
    console.log(`  Accessibility:         ${String(before.accessibility).padEnd(16)}${String(after.accessibility).padEnd(16)}${after.accessibility >= 95 ? '✅ 95+' : '⚠️ '}`);
    console.log(`  Best Practices:        ${String(before.bestPractices).padEnd(16)}${String(after.bestPractices).padEnd(16)}`);
    console.log(`  SEO:                   ${String(before.seo).padEnd(16)}${String(after.seo).padEnd(16)}`);
    console.log(`  LCP:                   ${String(before.lcp).padEnd(16)}${String(after.lcp).padEnd(16)}${parseFloat(after.lcp) <= 2.5 ? '✅ < 2.5s' : '⚠️ '}`);
    console.log(`  CLS:                   ${String(before.cls).padEnd(16)}${String(after.cls).padEnd(16)}`);
    console.log(`  TBT:                   ${String(before.tbt).padEnd(16)}${String(after.tbt).padEnd(16)}`);
    console.log(`  FCP:                   ${String(before.fcp).padEnd(16)}${String(after.fcp).padEnd(16)}`);
  } else if (before) {
    console.log(`  Performance:           ${before.performance}`);
    console.log(`  Accessibility:         ${before.accessibility}`);
    console.log(`  LCP:                   ${before.lcp}`);
  }
}

printComparison('Banquet (/banquet)', banquetBefore, banquetAfter);
printComparison('Home (/)', homeBefore, homeAfter);

