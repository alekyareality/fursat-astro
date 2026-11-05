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
    lcpElement: a['largest-contentful-paint-element']?.details?.items?.[0]?.node?.snippet || a['largest-contentful-paint-element']?.displayValue
  };
}

const home = extractMetrics('review/lighthouse-home.json');
const banquet = extractMetrics('review/lighthouse-banquet.json');

console.log('='.repeat(60));
console.log('LIGHTHOUSE MOBILE AUDIT RESULTS');
console.log('='.repeat(60));
if (home) {
  console.log('Home (/):');
  console.log(`  Performance:   ${home.performance}/100`);
  console.log(`  Accessibility: ${home.accessibility}/100`);
  console.log(`  Best Practices:${home.bestPractices}/100`);
  console.log(`  SEO:           ${home.seo}/100`);
  console.log(`  LCP:           ${home.lcp}`);
  console.log(`  CLS:           ${home.cls}`);
  console.log(`  TBT:           ${home.tbt}`);
  console.log(`  FCP:           ${home.fcp}`);
  console.log(`  Speed Index:   ${home.speedIndex}`);
}
if (banquet) {
  console.log('\nBanquet (/banquet):');
  console.log(`  Performance:   ${banquet.performance}/100`);
  console.log(`  Accessibility: ${banquet.accessibility}/100`);
  console.log(`  Best Practices:${banquet.bestPractices}/100`);
  console.log(`  SEO:           ${banquet.seo}/100`);
  console.log(`  LCP:           ${banquet.lcp}`);
  console.log(`  CLS:           ${banquet.cls}`);
  console.log(`  TBT:           ${banquet.tbt}`);
  console.log(`  FCP:           ${banquet.fcp}`);
  console.log(`  Speed Index:   ${banquet.speedIndex}`);
}
