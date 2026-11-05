import { chromium } from 'playwright';
const URL = process.env.URL || 'http://localhost:4321/';
const expect = [[3.5,'Ustad Nalli Gosht Biryani'],[6,'Life Fursat Bhai'],[9.5,'Death By Chocolate'],[13,'Life Fursat Bhai'],[17,'Fursat Rahasyam'],[21,'Iced Latte'],[25,'Cafe Latte'],[30,'Hot Cappuccino'],[33,'(hidden)']];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1536, height: 900 } });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type()==='error' && errs.push(m.text()));
await p.addInitScript(() => { try { sessionStorage.setItem('fz_seen','1') } catch {} });
await p.goto(URL, { waitUntil: 'load' }); await p.waitForTimeout(2000);
let bad = 0;
for (const [t, want] of expect) {
  await p.evaluate(t => new Promise(r => { const v = document.getElementById('fxplv'); v.pause(); v.addEventListener('seeked', () => r(), { once: true }); v.currentTime = t; }), t);
  await p.waitForTimeout(900);
  const got = await p.evaluate(() => { const d = document.getElementById('fxdn'); return d.hidden ? '(hidden)' : [...d.querySelectorAll('#fxdn-n span')].map(s => s.textContent).join(' '); });
  const ok = got === want; if (!ok) bad++;
  console.log((ok ? 'PASS' : 'FAIL'), `t=${t}s`, 'label:', got, ok ? '' : `(expected ${want})`);
  if ([3.5,25,30].includes(t)) await p.screenshot({ path: `hero-t${t}.png`, clip: { x: 0, y: 0, width: 1536, height: 700 } });
}
console.log('page errors:', errs.length ? errs : 'none');
const m = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await m.newPage(); await mp.addInitScript(() => { try { sessionStorage.setItem('fz_seen','1') } catch {} });
await mp.goto(URL, { waitUntil: 'load' }); await mp.waitForTimeout(1500);
console.log('phone: video =', await mp.evaluate(() => document.getElementById('fxplv').currentSrc.split('/').pop()), '| Ask input font-size =', await mp.evaluate(() => getComputedStyle(document.querySelector('.af-input')).fontSize), '(want 16px)');
await b.close(); process.exit(bad ? 1 : 0);
