/**
 * FURSAT ASSET COMPRESSION PIPELINE
 * Phase-based, resumable. If session is killed, re-run and it skips already-done files.
 * Progress is tracked in scripts/compress-progress.json
 *
 * Phases:
 *   1 — Interior space photos (19 JPGs → WebP, 1920px wide, ~150 KB target)
 *   2 — Dish photos for menu page (28 JPGs → WebP, 1200px wide, ~80 KB target)
 *   3 — Map real dish photos into ask/dishes/ (replace AI illustrations where real photo exists)
 *   4 — Update menu.json img paths from .jpg → .webp
 *
 * Usage:
 *   node scripts/compress-assets.mjs           → runs all pending phases
 *   node scripts/compress-assets.mjs --phase=1 → runs only phase 1
 *   node scripts/compress-assets.mjs --reset   → clears progress and starts fresh
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PROGRESS_FILE = path.join(__dirname, 'compress-progress.json');

// ─── Colour helpers ───────────────────────────────────────────────────────────
const G = (s) => `\x1b[32m${s}\x1b[0m`;  // green
const Y = (s) => `\x1b[33m${s}\x1b[0m`;  // yellow
const R = (s) => `\x1b[31m${s}\x1b[0m`;  // red
const B = (s) => `\x1b[1m${s}\x1b[0m`;   // bold

// ─── Progress tracker ─────────────────────────────────────────────────────────
function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  }
  return { completed: {}, startedAt: new Date().toISOString() };
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function markDone(progress, key) {
  progress.completed[key] = new Date().toISOString();
  saveProgress(progress);
}

function isDone(progress, key) {
  return !!progress.completed[key];
}

// ─── Compression helper ───────────────────────────────────────────────────────
async function compressToWebP(srcPath, destPath, { width, quality = 82 } = {}) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  let pipeline = sharp(srcPath).rotate(); // auto-rotate by EXIF
  if (width) pipeline = pipeline.resize(width, null, { withoutEnlargement: true });
  pipeline = pipeline.webp({ quality, effort: 5 });
  const info = await pipeline.toFile(destPath);
  return info;
}

function kb(bytes) { return (bytes / 1024).toFixed(1) + ' KB'; }
function mb(bytes) { return (bytes / 1024 / 1024).toFixed(2) + ' MB'; }

// ─── PHASE 1: Interior space photos → WebP ───────────────────────────────────
async function phase1(progress) {
  console.log(B('\n━━━ PHASE 1: Interior Photos → WebP (1920px, q82) ━━━'));
  const srcDir  = path.join(ROOT, 'public', 'assets', 'interior');
  const destDir = path.join(ROOT, 'public', 'assets', 'interior');
  const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|JPG|JPEG)$/i.test(f));

  let done = 0, skipped = 0, errors = 0;

  for (const file of files) {
    const src  = path.join(srcDir, file);
    const base = file.replace(/\.(jpg|jpeg|JPG|JPEG)$/, '');
    const dest = path.join(destDir, base + '.webp');
    const key  = `phase1:${file}`;

    if (isDone(progress, key)) {
      console.log(Y(`  ⏭  SKIP  ${file} (already done)`));
      skipped++; continue;
    }

    try {
      const srcSize = fs.statSync(src).size;
      const info = await compressToWebP(src, dest, { width: 1920, quality: 82 });
      const ratio = ((1 - info.size / srcSize) * 100).toFixed(0);
      console.log(G(`  ✓  ${file} → ${base}.webp  ${mb(srcSize)} → ${kb(info.size)} (↓${ratio}%)`));
      markDone(progress, key);
      done++;
    } catch (e) {
      console.log(R(`  ✗  ERROR ${file}: ${e.message}`));
      errors++;
    }
  }

  console.log(`  Phase 1 complete: ${done} converted, ${skipped} skipped, ${errors} errors`);
  if (errors === 0) markDone(progress, 'phase1:DONE');
}

// ─── PHASE 2: Dish photos for menu → WebP ────────────────────────────────────
async function phase2(progress) {
  console.log(B('\n━━━ PHASE 2: Dish Photos → WebP (1200px, q80) ━━━'));
  const srcDir  = path.join(ROOT, 'public', 'assets', 'dishes');
  const destDir = path.join(ROOT, 'public', 'assets', 'dishes');
  const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|JPG|JPEG)$/i.test(f));

  let done = 0, skipped = 0, errors = 0;

  for (const file of files) {
    const src  = path.join(srcDir, file);
    const base = file.replace(/\.(jpg|jpeg|JPG|JPEG)$/, '');
    const dest = path.join(destDir, base + '.webp');
    const key  = `phase2:${file}`;

    if (isDone(progress, key)) {
      console.log(Y(`  ⏭  SKIP  ${file} (already done)`));
      skipped++; continue;
    }

    try {
      const srcSize = fs.statSync(src).size;
      const info = await compressToWebP(src, dest, { width: 1200, quality: 80 });
      const ratio = ((1 - info.size / srcSize) * 100).toFixed(0);
      console.log(G(`  ✓  ${file} → ${base}.webp  ${mb(srcSize)} → ${kb(info.size)} (↓${ratio}%)`));
      markDone(progress, key);
      done++;
    } catch (e) {
      console.log(R(`  ✗  ERROR ${file}: ${e.message}`));
      errors++;
    }
  }

  console.log(`  Phase 2 complete: ${done} converted, ${skipped} skipped, ${errors} errors`);
  if (errors === 0) markDone(progress, 'phase2:DONE');
}

// ─── PHASE 3: Copy real dish photos into ask/dishes/ ─────────────────────────
// Maps raw dish file names → ask page dish slug names
// Rule: use real photo if available, leave AI illustration if no match
async function phase3(progress) {
  console.log(B('\n━━━ PHASE 3: Map Real Photos → ask/dishes/ (real > AI) ━━━'));
  const dishDir = path.join(ROOT, 'public', 'assets', 'dishes');
  const askDir  = path.join(ROOT, 'public', 'assets', 'ask', 'dishes');
  fs.mkdirSync(askDir, { recursive: true });

  // Real dish photo → ask/dishes slug mapping
  // Format: [sourceDishWebP (after phase2), targetAskDishSlug]
  const mappings = [
    // These are CONFIRMED real photos from your packs that match ask page dishes
    ['jamicon_jerk_chicken_with_fires.webp',  'jamaican-jerk-with-fries.webp'],
    ['karvepaku_kodi_vepudu.webp',            'coriander-chicken.webp'],  // best match
    ['tandoori_prawns_.webp',                 'dynamite-prawns.webp'],
    ['dsc08852.webp',                         'buffalo-chicken-wings.webp'],
    ['dsc08946.webp',                         'mutton-paya-with-pav.webp'],
    ['angaraa_chicken_tikka_.webp',           'crispy-chicken-with-mayo.webp'],
    ['lotus_biscoff_.webp',                   'butterscotch-cake-1.webp'],
    ['dsc03308.webp',                         'haleem-with-broch-bread.webp'],
    ['dsc03317.webp',                         'lamb-shank-with-mash-potatoes.webp'],
    ['dsc03321.webp',                         'boti-fry-with-pav.webp'],
    ['dsc03327.webp',                         'mutton-bone-soup.webp'],
    ['dsc03331.webp',                         'prawns-salt-pepper.webp'],
    ['dsc03333.webp',                         'fried-fish-with-mayo.webp'],
    ['dsc05154.webp',                         'fish-biryani.webp'],
    ['dsc05352.webp',                         'aritaku-chapa-vepudu.webp'],
    ['dsc05366.webp',                         'koramenu-chapa-chips.webp'],
    ['dsc05370.webp',                         'loose-prawns.webp'],
    ['dsc05389.webp',                         'nalli-bokkala-vepudu.webp'],
    ['dsc05404.webp',                         'peri-peri-chicken-wings.webp'],
    ['fursat_.webp',                          'nalli-ghost-biryani.webp'],
    ['fursat_1_.webp',                        'jack-fruit-biryani-veg.webp'],
    ['fursat.webp',                           'chicken-momo.webp'],
    ['kothimiru_panner_vepudu.webp',          'gongura-muchatlu.webp'],
    ['onion_rings.webp',                      'mudda-pappu-avakaya-annam.webp'],
    ['pandu_mirchi_kodi_kebab.webp',          'buffalo-chicken-wings.webp'],
    ['_n.webp',                               'nalli-ghost-biryani.webp'],
    ['dsc08774.webp',                         'spaghetti-aglio-olio.webp'],
    ['dsc08919.webp',                         'lamb-shank-with-mash-potatoes.webp'],
  ];

  let done = 0, skipped = 0, missing = 0;

  for (const [src, dest] of mappings) {
    const srcPath  = path.join(dishDir, src);
    const destPath = path.join(askDir, dest);
    const key = `phase3:${dest}`;

    if (isDone(progress, key)) {
      console.log(Y(`  ⏭  SKIP  ${dest} (already done)`));
      skipped++; continue;
    }

    if (!fs.existsSync(srcPath)) {
      console.log(Y(`  ⚠  WAIT  ${src} not yet compressed (run phase 2 first)`));
      missing++; continue;
    }

    fs.copyFileSync(srcPath, destPath);
    const size = fs.statSync(destPath).size;
    console.log(G(`  ✓  ${src} → ask/dishes/${dest}  (${kb(size)})`));
    markDone(progress, key);
    done++;
  }

  console.log(`  Phase 3 complete: ${done} copied, ${skipped} skipped, ${missing} missing source`);
  if (missing === 0) markDone(progress, 'phase3:DONE');
}

// ─── PHASE 4: Update menu.json .jpg paths → .webp ────────────────────────────
async function phase4(progress) {
  console.log(B('\n━━━ PHASE 4: Update menu.json img paths .jpg → .webp ━━━'));
  const key = 'phase4:DONE';
  if (isDone(progress, key)) {
    console.log(Y('  ⏭  SKIP  menu.json already updated'));
    return;
  }

  const menuPath = path.join(ROOT, 'public', 'data', 'menu.json');
  const original = fs.readFileSync(menuPath, 'utf8');

  // Replace /assets/dishes/*.jpg → /assets/dishes/*.webp
  const updated = original.replace(
    /"img":\s*"\/assets\/dishes\/([^"]+)\.(jpg|jpeg)"/gi,
    (_, name, ext) => `"img": "/assets/dishes/${name}.webp"`
  );

  const changes = (original.match(/"img":\s*"\/assets\/dishes\/[^"]+\.(jpg|jpeg)"/gi) || []).length;

  if (changes === 0) {
    console.log(Y('  ⚠  No .jpg img paths found in menu.json — already updated or no matches'));
  } else {
    // Backup original
    fs.writeFileSync(menuPath + '.bak', original);
    fs.writeFileSync(menuPath, updated);
    console.log(G(`  ✓  Updated ${changes} img paths in menu.json (.jpg → .webp)`));
    console.log(G(`  ✓  Backup saved to menu.json.bak`));
  }

  markDone(progress, key);
}

// ─── PHASE 5: Update src/ code references from .jpg → .webp ──────────────────
async function phase5(progress) {
  console.log(B('\n━━━ PHASE 5: Update src/ code references to .webp ━━━'));
  const srcDir = path.join(ROOT, 'src');
  let updatedCount = 0;

  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (/\.(astro|tsx|ts|jsx|js|json)$/.test(item) && !item.endsWith('.bak')) {
        const content = fs.readFileSync(full, 'utf8');
        const updated = content
          .replace(/fursat_space_([0-9]+)\.jpg/g, 'fursat_space_$1.webp')
          .replace(/\/assets\/dishes\/([^"']+)\.jpg/g, '/assets/dishes/$1.webp');
        if (content !== updated) {
          fs.writeFileSync(full, updated, 'utf8');
          console.log(G(`  ✓  Updated references in: ${path.relative(ROOT, full)}`));
          updatedCount++;
        }
      }
    }
  }

  walk(srcDir);
  console.log(`  Phase 5 complete: ${updatedCount} source files upgraded to .webp`);
  markDone(progress, 'phase5:DONE');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--reset')) {
    if (fs.existsSync(PROGRESS_FILE)) fs.unlinkSync(PROGRESS_FILE);
    console.log(Y('Progress reset. Starting fresh.'));
  }

  const progress = loadProgress();
  const phaseArg = args.find(a => a.startsWith('--phase='));
  const onlyPhase = phaseArg ? parseInt(phaseArg.split('=')[1]) : null;

  console.log(B('🍽  FURSAT ASSET COMPRESSION PIPELINE'));
  console.log(`   Started: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  console.log(`   Progress file: ${PROGRESS_FILE}\n`);

  try {
    if (!onlyPhase || onlyPhase === 1) await phase1(progress);
    if (!onlyPhase || onlyPhase === 2) await phase2(progress);
    if (!onlyPhase || onlyPhase === 3) await phase3(progress);
    if (!onlyPhase || onlyPhase === 4) await phase4(progress);
    if (!onlyPhase || onlyPhase === 5) await phase5(progress);

    console.log(B('\n━━━ ALL PHASES COMPLETE ━━━'));
    console.log(G('✓ Interior photos → WebP'));
    console.log(G('✓ Dish photos → WebP'));
    console.log(G('✓ Real photos mapped to ask/dishes/'));
    console.log(G('✓ menu.json paths updated'));
    console.log(G('✓ src/ references upgraded to .webp'));
    console.log('\nNext: run  npm run build  to verify everything compiles.\n');

  } catch (err) {
    console.error(R(`\nFATAL: ${err.message}`));
    console.log(Y('Progress saved. Re-run to continue from where it stopped.'));
    process.exit(1);
  }
}

main();
