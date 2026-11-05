/**
 * src/lib/device.ts — Fursat Kitchen | Bar Device Capability Gate
 *
 * Classifies client hardware and network conditions into:
 * - 'lite': Phones/low-end devices (< 4GB RAM, < 4 cores, slow 2G/3G, saveData active, or reduced-motion).
 *           Receives static posters, no heavy 3D canvas, no tour WebGL, no autoplay video.
 * - 'full': High-end desktop / modern mobile capable of 60fps WebGL, video autoplay, and full canvas scenes.
 */

export type DeviceTier = 'lite' | 'full';

export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'full';

  try {
    // 1. Reduced motion preference -> lite
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'lite';
    }

    // 2. Data Saver or slow network connection -> lite
    const nav = navigator as any;
    if (nav.connection) {
      if (nav.connection.saveData) return 'lite';
      const et = nav.connection.effectiveType;
      if (et === 'slow-2g' || et === '2g' || et === '3g') return 'lite';
    }

    // 3. Device Memory: < 4 GB -> lite
    if (nav.deviceMemory && nav.deviceMemory < 4) {
      return 'lite';
    }

    // 4. Hardware concurrency (CPU cores): < 4 -> lite
    if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) {
      return 'lite';
    }

    return 'full';
  } catch {
    return 'full';
  }
}

export function isLiteTier(): boolean {
  return getDeviceTier() === 'lite';
}
