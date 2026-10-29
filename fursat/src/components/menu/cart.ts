export type Kind = 'food' | 'drink' | 'sree';
export interface MenuItem { n: string; p: number; c: string; k: Kind; v?: string; a?: boolean; d?: string; img?: string }
export type Line = { key: string; item: MenuItem; qty: number };
export type Action =
  | { t: 'add'; item: MenuItem }
  | { t: 'dec'; key: string }
  | { t: 'clear' };

export const keyOf = (i: MenuItem) => `${i.k}|${i.c}|${i.n}`;

export function reducer(s: Line[], a: Action): Line[] {
  switch (a.t) {
    case 'add': {
      const key = keyOf(a.item);
      const hit = s.find((l) => l.key === key);
      return hit ? s.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 99) } : l)) : [...s, { key, item: a.item, qty: 1 }];
    }
    case 'dec':
      return s.flatMap((l) => (l.key !== a.key ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []));
    case 'clear':
      return [];
  }
}

// Manual en-IN grouping: Intl output differs between Node and browsers and breaks hydration.
export const money = (n: number) => {
  const s = String(Math.round(Math.abs(n)));
  const last3 = s.slice(-3), rest = s.slice(0, -3);
  const g = rest ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3 : last3;
  return (n < 0 ? '-' : '') + '\u20B9' + g;
};
export const total = (s: Line[]) => s.reduce((t, l) => t + l.item.p * l.qty, 0);
export const count = (s: Line[]) => s.reduce((t, l) => t + l.qty, 0);

export const WA = '919059670033';
export function waLink(s: Line[]) {
  const rows = s.map((l) => `${l.qty} x ${l.item.n} (${money(l.item.p * l.qty)})`).join('\n');
  const msg = `Hi Fursat! I would like to order:\n${rows}\n\nSubtotal: ${money(total(s))} (taxes extra)`;
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
}
