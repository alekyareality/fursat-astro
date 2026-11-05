import { useState, type PointerEvent } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

/*
  Ask page header (Framer Motion).
  - Transparent over the hero, turns into a frosted cream pill once you scroll.
  - Hides when scrolling down, comes back on any scroll up or keyboard focus.
  - Nav hover pill glides between links (shared layoutId, critically damped spring).
  - Server-renders as normal links, so it works before JS loads.
  Motion rules: transform + opacity only, strong ease-out, reduced motion = no movement.
*/

const LINKS: [string, string][] = [
  ["Menu", "/#menu"],
  ["Story", "/#story"],
  ["Rituals", "/#rituals"],
  ["Visit", "/#visit"],
  ["Journal", "/#journal"],
  ["Parties", "/parties"],
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export default function AskHeader({ wa }: { wa: string }) {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 28 });
  const sy = useSpring(my, { stiffness: 220, damping: 28 });

  // Magnetic pull on the Reserve button: mouse only, max 8px.
  const pull = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const k = (v: number, size: number) =>
      Math.max(-8, Math.min(8, (v / size) * 16));
    mx.set(k(e.clientX - (r.left + r.width / 2), r.width));
    my.set(k(e.clientY - (r.top + r.height / 2), r.height));
  };
  const rest = () => {
    mx.set(0);
    my.set(0);
  };
  const [hidden, setHidden] = useState(false);
  const [hot, setHot] = useState<string | null>(null);

  const bg = useTransform(scrollY, [0, 90], [0, 1]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 200 && y > prev);
  });

  return (
    <motion.header
      className="hd"
      initial={false}
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={reduce ? { duration: 0 } : { duration: 0.28, ease: EASE_OUT }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="hd-in">
        <motion.span className="hd-bg" style={{ opacity: bg }} aria-hidden="true" />
        <motion.span
          className="hd-prog"
          style={{ scaleX: scrollYProgress, opacity: bg }}
          aria-hidden="true"
        />

        <a className="hd-logo" href="/" aria-label="Fursat home">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <use href="#i-mark" />
          </svg>
          <span translate="no">FURSAT</span>
        </a>

        <nav
          className="hd-links"
          aria-label="Fursat"
          onPointerLeave={() => setHot(null)}
        >
          {LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHot(label)}
              onFocus={() => setHot(label)}
              onBlur={() => setHot(null)}
            >
              {hot === label && (
                <motion.span
                  layoutId="hd-pill"
                  className="hd-pill"
                  aria-hidden="true"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", duration: 0.35, bounce: 0 }
                  }
                />
              )}
              <span className="hd-t">{label}</span>
            </a>
          ))}
        </nav>

        <motion.a
          className="hd-cta"
          href={wa}
          target="_blank"
          rel="noopener"
          style={{ x: sx, y: sy }}
          onPointerMove={pull}
          onPointerLeave={rest}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
        >
          <span>Reserve a Table</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <use href="#i-arrow" />
          </svg>
        </motion.a>
      </div>
    </motion.header>
  );
}
