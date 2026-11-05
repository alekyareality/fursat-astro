// Usage: node scripts/lh-median.mjs http://localhost:4321/ 3 home
// Runs Lighthouse (mobile) N times and prints ONE line with the median. Never open the raw JSON.
import { execSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
const [,, url = 'http://localhost:4321/', runs = '3', tag = 'run'] = process.argv;
mkdirSync('review', { recursive: true });
const med = a => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const rows = [];
for (let i = 0; i < +runs; i++) {
  const out = `review/lh-${tag}-${i}.json`;
  execSync(`npx.cmd lighthouse ${url} --form-factor=mobile --only-categories=performance,accessibility,seo --output=json --output-path=${out} --chrome-flags="--headless=new" --quiet`, { stdio: 'ignore' });
  const j = JSON.parse(readFileSync(out, 'utf8'));
  const a = j.audits, c = j.categories;
  rows.push({
    perf: Math.round(c.performance.score * 100),
    a11y: Math.round(c.accessibility.score * 100),
    seo: Math.round(c.seo.score * 100),
    lcp: a['largest-contentful-paint'].numericValue,
    tbt: a['total-blocking-time'].numericValue,
    cls: a['cumulative-layout-shift'].numericValue,
  });
}
const m = k => med(rows.map(r => r[k]));
console.log(JSON.stringify({ url, runs: rows.length, perf: m('perf'), a11y: m('a11y'), seo: m('seo'), lcp_s: +(m('lcp') / 1000).toFixed(2), tbt_ms: Math.round(m('tbt')), cls: +m('cls').toFixed(3), all_perf: rows.map(r => r.perf) }));
