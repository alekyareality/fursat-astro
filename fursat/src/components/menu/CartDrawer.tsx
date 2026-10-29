import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type Line, type Action, money, total, count, waLink } from './cart';
import { SPRING, T_IN, T_OUT } from './motion';

interface Props { open: boolean; lines: Line[]; dispatch: (a: Action) => void; onClose: () => void; }

export default function CartDrawer({ open, lines, dispatch, onClose }: Props) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const prev = useRef<HTMLElement | null>(null);
  const alc = lines.some((l) => l.item.a);

  useEffect(() => {
    if (!open) return;
    prev.current = document.activeElement as HTMLElement;
    const html = document.documentElement;
    const was = html.style.overflow;
    html.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); html.style.overflow = was; prev.current?.focus(); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div key="cart" className="fixed inset-0 z-[80] flex items-end justify-center" data-menu>
          <motion.div
            className="absolute inset-0 bg-fk-deep/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0.01 } : T_IN} onClick={onClose} aria-hidden="true"
          />
          <motion.div
            ref={panel} role="dialog" aria-modal="true" aria-labelledby="cart-h"
            className="relative flex max-h-[min(86svh,720px)] w-full max-w-xl flex-col rounded-t-3xl bg-fk-paper text-fk-ink shadow-[0_-12px_40px_-12px_rgba(26,22,8,.35)]"
            initial={reduce ? { opacity: 0 } : { y: 760 }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0, transition: T_OUT } : { y: 760, transition: T_OUT }}
            transition={reduce ? T_IN : SPRING}
          >
            <header className="flex items-center justify-between gap-4 border-b border-fk-line px-5 py-4">
              <h2 id="cart-h" className="font-fk-serif text-xl leading-tight text-fk-ink">Your order <span className="font-fk-sans text-sm text-fk-olive tabular-nums">({count(lines)})</span></h2>
              <button ref={closeBtn} onClick={onClose} aria-label="Close order"
                className="grid size-11 place-items-center rounded-full text-fk-ink transition-[transform,opacity] duration-150 active:scale-[.97] hover:opacity-70">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </header>

            <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5" aria-live="polite">
              {lines.length === 0 && <li className="py-10 text-center text-fk-olive">Nothing here yet. Add a dish to start.</li>}
              {lines.map((l) => (
                <li key={l.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-fk-line/70 py-3 last:border-0">
                  <p translate="no" className="line-clamp-2 break-words text-[15px] font-semibold leading-snug">{l.item.n}</p>
                  <p className="row-span-2 text-right text-[15px] font-semibold tabular-nums whitespace-nowrap">{money(l.item.p * l.qty)}</p>
                  <div className="flex items-center gap-1">
                    <Step label={`Remove one ${l.item.n}`} onClick={() => dispatch({ t: 'dec', key: l.key })}>−</Step>
                    <span className="min-w-8 text-center text-[15px] tabular-nums" aria-label={`Quantity ${l.qty}`}>{l.qty}</span>
                    <Step label={`Add one ${l.item.n}`} onClick={() => dispatch({ t: 'add', item: l.item })}>+</Step>
                    <span className="ml-2 text-xs text-fk-olive tabular-nums whitespace-nowrap">{money(l.item.p)} each</span>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-fk-line px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
              <div className="mb-1 flex items-baseline justify-between gap-4">
                <span className="text-fk-olive">Subtotal</span>
                <span className="text-lg font-bold tabular-nums whitespace-nowrap">{money(total(lines))}</span>
              </div>
              <p className="mb-3 text-xs leading-snug text-fk-olive">Taxes extra. {alc && 'Alcohol is served to guests aged 21 and above only. '}Your order is confirmed by the team on WhatsApp.</p>
              <div className="flex gap-3">
                <button onClick={() => dispatch({ t: 'clear' })} disabled={!lines.length}
                  className="min-h-12 rounded-full border border-fk-line px-5 text-[15px] font-semibold transition-[transform,opacity] duration-150 active:scale-[.97] disabled:opacity-40">Clear</button>
                <a href={lines.length ? waLink(lines) : undefined} target="_blank" rel="noopener" aria-disabled={!lines.length}
                  className={'grid min-h-12 flex-1 place-items-center rounded-full no-underline bg-fk-gold px-5 text-[15px] font-bold text-fk-deep transition-[transform,opacity] duration-150 active:scale-[.97] ' + (lines.length ? '' : 'pointer-events-none opacity-40')}>
                  Send order on WhatsApp
                </a>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Step({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label}
      className="grid size-11 place-items-center rounded-full bg-fk-cream text-lg font-semibold transition-[transform,opacity] duration-150 active:scale-[.97] hover:opacity-80">{children}</button>
  );
}
