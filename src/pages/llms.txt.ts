// /llms.txt: a plain-text summary for AI search and answer engines. Facts come from site.json so the hours never go stale.
import site from '../data/site.json';
import ld from '../data/ld.json';
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const d = site.domain, r: any = (ld as any[])[0];
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
    `- [Menu](${d}/menu/): kitchen dishes and bar drinks`,
    `- [Reserve a table](${d}/reserve/): request a table by date, time and number of guests`,
    `- [Parties & Events](${d}/party/): birthdays, corporate gatherings, kitty parties and bar bashes; bar party, elite buffet and banquet packages`,
    '',
    '## More',
    `- [Restaurant & Bar](${d}/restaurant-bar/)`,
    `- [Café lounge](${d}/cafe/)`,
    `- [Banquet hall](${d}/banquet/)`,
    `- [Catering & buffets](${d}/catering/)`,
    `- [Order for takeaway](${d}/order/)`,
    `- [Ask Fursat: find dishes by mood](${d}/ask/)`,
    `- [Our story](${d}/story/)`,
    `- [Terms & conditions](${d}/terms/)`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
