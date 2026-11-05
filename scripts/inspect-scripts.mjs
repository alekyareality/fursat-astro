import fs from 'fs';

const pages = ['menu', 'cafe', 'story'];
for (const p of pages) {
  const html = fs.readFileSync(`dist/${p}/index.html`, 'utf8');
  const matches = [...html.matchAll(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  const inlines = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)].length;
  console.log(`Page /${p}:`);
  console.log('  External scripts in HTML:', matches);
  console.log('  Inline script blocks:', inlines);
}
