/**
 * Organic shape paths for the Fursat restyle (handoff v18 §5.2).
 * All paths live in a 0 0 1 1 box so they work with clipPathUnits="objectBoundingBox"
 * (clip-path:url(#fk-<name>)) and as an <svg viewBox="0 0 1 1" preserveAspectRatio="none"> overlay.
 * Keep every organic shape here. Do not use random border-radius for photo frames or panels.
 */
export type OrganicName =
  | 'blobEntrance' | 'blobDining' | 'panelHero' | 'panelCraft'
  | 'waveTop' | 'waveBottom' | 'blobBooking';

export const organicPaths: Record<OrganicName, string> = {
  // Top-right photo. Right edge is straight so it can bleed off the viewport.
  blobEntrance:
    'M0.07 0.17 C0.11 0.05 0.27 0.01 0.45 0.02 C0.66 0.03 0.86 0.0 1 0.03 L1 0.86 ' +
    'C0.88 0.91 0.78 1.0 0.62 0.97 C0.47 0.95 0.40 0.83 0.30 0.71 ' +
    'C0.20 0.59 0.02 0.47 0.03 0.31 C0.03 0.25 0.05 0.20 0.07 0.17 Z',
  // Left photo. Left edge is straight so it can bleed off the viewport.
  blobDining:
    'M0 0.13 C0.15 0.03 0.40 0.0 0.60 0.03 C0.81 0.06 0.97 0.18 0.98 0.40 ' +
    'C0.99 0.60 0.88 0.72 0.78 0.84 C0.68 0.95 0.45 1.0 0.25 0.97 C0.12 0.95 0.04 0.90 0 0.88 Z',
  // Hero text panel. Bleeds off the left edge, flowing right edge.
  panelHero:
    'M0 0.03 C0.25 0.0 0.55 0.02 0.78 0.08 C0.97 0.14 1.0 0.30 0.93 0.45 ' +
    'C0.86 0.60 0.98 0.72 0.90 0.86 C0.80 1.0 0.50 0.99 0.25 0.98 C0.12 0.98 0.05 0.97 0 0.97 Z',
  // "Crafted for Good Times" panel. Bleeds off the right edge, wavy left edge.
  panelCraft:
    'M0.10 0.07 C0.14 0.02 0.28 0.0 0.45 0.0 L1 0.0 L1 1 L0.32 1 ' +
    'C0.14 1 0.04 0.93 0.02 0.80 C0.0 0.66 0.11 0.60 0.09 0.46 C0.07 0.32 0.14 0.22 0.10 0.07 Z',
  // Top edge of the green band. Sides and bottom sit outside the box so a stroke only shows the wave.
  waveTop:
    'M-0.02 0.55 C0.12 0.10 0.28 0.02 0.46 0.34 C0.62 0.62 0.80 0.52 1.02 0.0 L1.02 1.3 L-0.02 1.3 Z',
  // Mirror of waveTop for a green section that ends on cream.
  waveBottom:
    'M-0.02 -0.3 L1.02 -0.3 L1.02 0.45 C0.80 0.98 0.62 0.70 0.46 0.42 C0.28 0.08 0.12 0.90 -0.02 0.45 Z',
  // Reserved for P1 (home booking panel). Bleeds off the right edge, soft left waves.
  blobBooking:
    'M0.06 0.05 C0.10 0.01 0.30 0.0 0.55 0.0 L1 0.0 L1 1 L0.30 1 ' +
    'C0.10 1 0.05 0.90 0.07 0.78 C0.10 0.64 0.01 0.55 0.03 0.40 C0.05 0.28 0.02 0.12 0.06 0.05 Z',
};
