import fs from 'fs';
import path from 'path';

const pages = [
  { name: 'Home', file: 'dist/index.html' },
  { name: 'Banquet', file: 'dist/banquet/index.html' },
  { name: 'Menu', file: 'dist/menu/index.html' },
  { name: 'Cafe', file: 'dist/cafe/index.html' },
  { name: 'Party', file: 'dist/party/index.html' }
];

for (const p of pages) {
  const html = fs.readFileSync(p.file, 'utf-8');
  console.log(`\n=================== ${p.name} (${p.file}) ===================`);
  
  // match script tags
  const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  let idx = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    idx++;
    const attrs = match[1];
    const body = match[2].trim();
    const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
    const typeMatch = attrs.match(/type=["']([^"']+)["']/i);
    if (srcMatch) {
      console.log(`  [Script #${idx}] SRC: ${srcMatch[1]} (type: ${typeMatch ? typeMatch[1] : 'text/javascript'})`);
    } else {
      const type = typeMatch ? typeMatch[1] : 'inline';
      if (type === 'application/ld+json') {
        console.log(`  [Script #${idx}] JSON-LD Schema (length: ${body.length} chars)`);
      } else {
        console.log(`  [Script #${idx}] INLINE (length: ${body.length} chars, snippet: ${body.slice(0, 80).replace(/\n/g, ' ')}...)`);
      }
    }
  }
}
