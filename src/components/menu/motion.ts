export const EASE = [0.16, 1, 0.3, 1] as const;
export const SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } as const;
export const T_IN = { duration: 0.18, ease: EASE } as const;   // 140-220ms interactive
export const T_OUT = { duration: 0.12, ease: EASE } as const;  // 100-150ms exits
