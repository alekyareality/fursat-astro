// /llms.txt: a plain-text summary for AI search and answer engines. Facts come from site.json so the hours never go stale.
import site from '../data/site.json';
import ld from '../data/ld.json';
import type { APIRoute } from 'astro';

// Every page the site builds. The build stops if a page file is added or removed and this list is not updated.
const PAGES: Record<string, [slug: string, label: string, note?: string]> = {
  index: ['', 'Home', 'Fursat Kitchen | Bar: café, kitchen, bar and banquet space'],
  menu: ['menu', 'Menu', 'kitchen dishes and bar drinks'],
  reserve: ['reserve', 'Reserve a table', 'request a table by date, time and number of guests'],
  party: ['party', 'Parties & Events', 'birthdays, corporate gatherings, kitty parties and bar bashes; bar party, elite buffet and banquet packages'],
  'restaurant-bar': ['restaurant-bar', 'Restaurant & Bar'],
  cafe: ['cafe', 'Café lounge'],
  banquet: ['banquet', 'Banquet hall'],
  catering: ['catering', 'Catering & buffets'],
  order: ['order', 'Order for takeaway'],
  ask: ['ask', 'Ask Fursat: find dishes by mood'],
  story: ['story', 'Our story'],
  terms: ['terms', 'Terms & conditions'],
};
const built = Object.keys(import.meta.glob('./*.astro')).map((f) => f.replace(/^\.\//, '').replace(/\.astro$/, '')).filter((p) => p !== '404'); // 404 is not a page to list
const missing = built.filter((p) => !(p in PAGES));
const stale = Object.keys(PAGES).filter((p) => !built.includes(p));
if (missing.length || stale.length) throw new Error(`llms.txt page list out of sync. missing: ${missing.join(', ') || '-'} stale: ${stale.join(', ') || '-'}`);

export const GET: APIRoute = () => {
  const d = site.domain, r: any = (ld as any[]).find((n: any) => n['@type'] === 'Restaurant');
  const link = (key: string) => {
    const [slug, label, note] = PAGES[key];
    return `- [${label}](${d}/${slug ? slug + '/' : ''})${note ? ': ' + note : ''}`;
  };
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is a café, kitchen, bar and banquet space at Capital Park, Madhapur, Hyderabad, India.`,
    '',
    '## Key facts',
    `- Address: Capital Park, Madhapur, Hyderabad, Telangana ${site.address.pin}, India`,
    `- Hours: ${site.hours.display}`,
    `- Phone and WhatsApp: ${site.phone}`,
    `- Cuisine: ${r.servesCuisine.join(', ')}`,
    `- Reservations: guests send a table request on the reserve page. A request is not a booking: the team confirms by reply on WhatsApp.`,
    `- Map: ${r.hasMap}`,
    '',
    '## Main pages',
    ...['index', 'menu', 'reserve', 'party'].map(link),
    '',
    '## More',
    ...['restaurant-bar', 'cafe', 'banquet', 'catering', 'order', 'ask', 'story', 'terms'].map(link),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
