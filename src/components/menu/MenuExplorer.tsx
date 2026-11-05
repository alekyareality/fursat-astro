import { useCallback, useId, useMemo, useReducer, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react';
import CartDrawer from './CartDrawer';
import { type Kind, type MenuItem, count, money, reducer, total, keyOf } from './cart';
import { EASE, SPRING, T_IN, T_OUT } from './motion';

type Mode = 'food' | 'drinks' | 'sree';
const MODES: { id: Mode; label: string }[] = [
  { id: 'food', label: 'Food' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'sree', label: 'Sreemukhi’s Special' },
];
const inMode = (m: Mode, i: MenuItem) => (m === 'food' ? i.k === 'food' : m === 'drinks' ? i.k === 'drink' && !i.a : i.k === ('sree' as Kind));

export default function MenuExplorer({ items }: { items: MenuItem[] }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [mode, setMode] = useState<Mode>('food');
  const [cat, setCat] = useState<string>('All');
  const [lines, dispatch] = useReducer(reducer, []);
  const [open, setOpen] = useState(false);
  const cartBtn = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  const pool = useMemo(() => items.filter((i) => inMode(mode, i)), [items, mode]);
  const cats = useMemo(() => ['All', ...Array.from(new Set(pool.map((i) => i.c)))], [pool]);
  const shown = useMemo(() => (cat === 'All' ? pool : pool.filter((i) => i.c === cat)), [pool, cat]);
  const qtyOf = (i: MenuItem) => lines.find((l) => l.key === keyOf(i))?.qty ?? 0;
  const n = count(lines);

  const pickMode = (m: Mode) => { setMode(m); setCat('All'); };
  const pillT = reduce ? { duration: 0.01 } : SPRING;

  return (
    <LayoutGroup id={uid}>
      <div data-menu className="font-fk-sans text-fk-ink">
        {/* Mode tabs */}
        <motion.div layoutScroll role="group" aria-label="Menu section" className="mx-auto mb-3 flex max-w-5xl gap-2 overflow-x-auto px-5 no-scrollbar">
          {MODES.map((m) => (
            <Pill key={m.id} active={mode === m.id} pressed onClick={() => pickMode(m.id)} lid="mode" t={pillT}>{m.label}</Pill>
          ))}
        </motion.div>

        {/* Category pills */}
        <div className="sticky top-0 z-20 -mt-px border-b border-fk-line/70 bg-fk-cream py-3">
          <motion.div layoutScroll className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 no-scrollbar" role="group" aria-label="Categories">
            {cats.map((c) => (
              <Pill key={c} active={cat === c} pressed onClick={() => setCat(c)} lid="cat" t={pillT} small>{c}</Pill>
            ))}
          </motion.div>
        </div>

        {/* Grid: fixed card structure so long data never shifts neighbours */}
        <section aria-label="Menu items" className="mx-auto max-w-5xl px-5 pb-32 pt-6">
          <p className="mb-4 text-sm text-fk-olive" aria-live="polite">{`${shown.length} ${shown.length === 1 ? 'item' : 'items'}`}</p>
          <ul className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((it) => <Card key={keyOf(it)} it={it} qty={qtyOf(it)} showCat={cat === 'All'} onAdd={() => dispatch({ t: 'add', item: it })} />)}
          </ul>
          <p className="mt-8 text-xs leading-relaxed text-fk-olive">Prices from the Fursat printed menu. Taxes extra.{mode === 'sree' && ' Alcohol is served to guests aged 21 and above only.'}</p>
        </section>

        {/* Bottom cart bar */}
        <AnimatePresence>
          {n > 0 && !open && (
            <motion.div
              key="bar"
              className="fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
              initial={reduce ? { opacity: 0 } : { y: 96 }} animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0, transition: T_OUT } : { y: 96, transition: T_OUT }}
              transition={reduce ? T_IN : SPRING}
            >
              <button ref={cartBtn} onClick={() => setOpen(true)}
                className="on-dark flex min-h-14 w-full max-w-xl items-center justify-between gap-4 rounded-full bg-fk-green px-6 text-fk-cream shadow-[0_10px_30px_-10px_rgba(13,19,8,.6)] transition-transform duration-150 active:scale-[.97]">
                <span className="font-semibold tabular-nums">View order · {n}</span>
                <span className="font-bold tabular-nums whitespace-nowrap">{money(total(lines))}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <CartDrawer open={open} lines={lines} dispatch={dispatch} onClose={close} />
      </div>
    </LayoutGroup>
  );
}

function Pill({ active, onClick, children, lid, t, small, pressed }: {
  active: boolean; onClick: () => void; children: React.ReactNode; lid: string; t: object; small?: boolean; pressed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      {...(pressed ? { 'aria-pressed': active } : {})}
      className={`relative shrink-0 whitespace-nowrap rounded-full ${small ? 'min-h-10 px-4 text-sm' : 'min-h-11 px-5 text-[15px]'} font-semibold transition-[transform,color] duration-150 active:scale-[.97] ${active ? 'text-fk-deep' : 'text-fk-ink hover:bg-fk-paper'} ring-1 ring-inset ring-fk-line`}
    >
      {active && <motion.span layoutId={lid} transition={t} style={{ borderRadius: 9999 }} className="absolute inset-0 bg-fk-gold" aria-hidden="true" />}
      <span className="relative">{children}</span>
    </button>
  );
}

function Card({ it, qty, showCat, onAdd }: { it: MenuItem; qty: number; showCat: boolean; onAdd: () => void }) {
  const dot = it.v === 'veg' ? 'bg-[#3F7D2A]' : it.v ? 'bg-fk-terra' : null;
  return (
    <li className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-fk-line bg-fk-paper">
      {it.img && (
        <div className="aspect-[4/3] overflow-hidden bg-fk-cream">
          <img src={it.img} alt="" loading="lazy" decoding="async" width="640" height="480"
            className="size-full object-cover transition-transform duration-[220ms] ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.04]" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 translate="no" className="line-clamp-2 min-h-[2.75rem] min-w-0 break-words font-fk-serif text-[17px] leading-[1.35] text-fk-ink [text-wrap:balance]">
            {dot && <span className={`mr-2 inline-block size-2.5 translate-y-[-1px] rounded-full ${dot}`} aria-label={it.v === 'veg' ? 'Vegetarian' : 'Non-vegetarian'} role="img" />}
            {it.n}
          </h3>
          <p className="shrink-0 pt-0.5 text-[15px] font-bold tabular-nums whitespace-nowrap">{money(it.p)}</p>
        </div>
        {it.d && <p className="line-clamp-3 break-words text-sm leading-snug text-fk-olive">{it.d}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="min-w-0 truncate text-xs text-fk-olive">{showCat ? it.c : null}</span>
          <button onClick={onAdd} aria-label={`Add ${it.n}${qty ? `, ${qty} in order` : ''}`}
            className="min-h-11 shrink-0 rounded-full bg-fk-green px-5 text-sm font-semibold text-fk-cream transition-[transform,opacity] duration-150 active:scale-[.97] hover:opacity-90">
            {qty ? `Add · ${qty}` : 'Add'}
          </button>
        </div>
      </div>
    </li>
  );
}
