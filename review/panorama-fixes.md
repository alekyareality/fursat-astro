# Fursat Home 3D Panorama: Bug Audit & Remediation Plan

This document identifies all architectural, mathematical, visual, and UX bugs in `src/components/PanoramicViewer.astro` and details the exact fixes implemented to achieve a 60 fps 3D rotunda walkthrough.

---

## 1. Visual & Rendering Bugs

### Bug 1.1: Aspect Ratio Mismatch & Severe Vertical Stretching
- **Observed**: All 6 interior tour assets (`tour-entrance.webp`, `tour-bar.webp`, `tour-high-tables.webp`, `tour-lounge.webp`, `tour-cafe.webp`, `tour-booth.webp`) have raw dimensions of `1050 × 1400 px`—a strict **3:4 aspect ratio (0.750)**.
- **Root Cause**: The cylinder geometry was constructed with:
  ```ts
  var radius = 350;
  var panelHeight = 350;
  var thetaLength = 0.58; // arc width = radius * thetaLength = 203.0
  ```
  The physical panel aspect ratio in 3D space was `203 / 350 ≈ 0.58` (1 : 1.724). When Three.js mapped the 3:4 texture coordinates across UV (0..1), the photos were compressed horizontally by ~29% (or stretched vertically), distorting architectural doorframes, lamps, and furniture.
- **Fix**: Re-dimension panels to preserve their true 3:4 aspect ratio. For `panelHeight = 340`, arc width is `340 * 0.75 = 255`. With `radius = 360`, the panel arc is `thetaLength = 255 / 360 = 0.7083 rad` (~40.58°). UVs and curved panels now precisely match the photos' native proportions.

### Bug 1.2: Blurry Textures at Oblique Angles (Missing Anisotropy)
- **Observed**: When side panels rotate into peripheral views, text (such as "FURSAT" bar signs) and fine details (mural carving, bottle shelving) become muddy and blurry.
- **Root Cause**: `THREE.TextureLoader` was configured with `texture.minFilter = THREE.LinearMipmapLinearFilter`, but `texture.anisotropy` was never set. By default, WebGL anisotropy is 1 (isotropic). Steep angle perspectives blur texture mipmaps.
- **Fix**: Set `texture.anisotropy = renderer.capabilities.getMaxAnisotropy()` (typically 8x–16x on modern GPUs/phones). Set `texture.colorSpace = THREE.SRGBColorSpace` with calibrated tonemapping.

### Bug 1.3: Unnatural Texture Distortions (Wavy Ripple & Chromatic Aberration)
- **Observed**: During drag/spin, the previous custom shader applied artificial wave displacement (`rippleAmp * sin(...)`) and chromatic aberration (`rgbSplit * dir`). This warped architectural lines and produced visual noise that undermined the restaurant's premium ambiance.
- **Root Cause**: Over-engineered shader gimmicks designed for music visualizers rather than architectural hospitality spaces.
- **Fix**: Remove synthetic ripple and chromatic aberration. Replace with smooth geometry-level curved panel rotation, true color reproduction, and subtle edge vignette shading.

### Bug 1.4: Hard Panel Edges & Seams
- **Observed**: Curved panels abruptly terminated at polygonal borders without soft falloff, looking like cardboard placards.
- **Root Cause**: No border alpha falloff or vignette in shader or material.
- **Fix**: Introduce a soft edge vignette in the panel fragment shader that gently fades panel edges into the ambient dark background (`#0d1308`), framing each photograph naturally while maintaining distinct separation gaps between spaces.

---

## 2. Interaction & Physics Bugs

### Bug 2.1: Jank & Frame Stuttering During Drag
- **Observed**: Pointer dragging exhibited stutter and fight between manual drag positions and lerp interpolation.
- **Root Cause**: In `pointermove`, `currentRotY` was mutated directly while `targetRotY` was overwritten on every raw mouse/touch event, conflicting with the continuous interpolation loop in `requestAnimationFrame`.
- **Fix**: Decouple drag physics into velocity-based accumulator. Track pointer delta (`dx`), apply direct rotunda rotation while dragging, and upon release compute release velocity into an inertial spring-decay with ease-out settling to the nearest space center (`targetIndex * stepAngle`).

### Bug 2.2: Mobile Drag Prematurely Interrupted by Vertical Scroll
- **Observed**: Swiping horizontally on mobile screens frequently aborted if the finger moved vertically by more than 10px before crossing 6px horizontally (`dy > 10` cancel rule).
- **Root Cause**: Strict vertical scroll threshold killed dragging on natural diagonal thumb swipes.
- **Fix**: Use standard Pointer Events with explicit horizontal intent detection and touch-action pan-y, ensuring diagonal gestures lock into horizontal rotation once horizontal motion dominates.

### Bug 2.3: Broken Auto-Rotate & Pausing
- **Observed**: Auto-rotate was disabled until a "Step Inside" button was pressed, meaning first-time visitors saw a completely static rotunda.
- **Root Cause**: `if (!isPointerOver && hasSteppedInside && !isZoomed)` guarded auto-rotate behind `hasSteppedInside = true`.
- **Fix**: Enable gentle, continuous auto-rotation (0.0004 rad/frame) immediately upon mount. Pause auto-rotate whenever the user touches, drags, or opens the details drawer. Resume gracefully after 3 seconds of inactivity.

### Bug 2.4: Tap-to-Zoom Raycasting Misses
- **Observed**: Clicking any visible panel always zoomed into the active center panel index (`targetIndex`), rather than the panel the user actually clicked.
- **Root Cause**: No Raycaster was used to test intersections with the 6 panel meshes.
- **Fix**: Implement `THREE.Raycaster` on tap/click. Project pointer coordinates `(ndcX, ndcY)` through camera; if a specific panel mesh is struck, smoothly rotate to bring that panel to the front and fly the camera in to inspect that space.

---

## 3. UI Synchronization & Accessibility Bugs

### Bug 3.1: Desynchronization of Chips, Dots, and Arrows
- **Observed**: Rapid swipes could cause navigation chips and pagination dots to lag or jump out of order.
- **Root Cause**: UI state updates were coupled to `Math.round(currentRotY / stepAngle)` which oscillates during bounce/snap.
- **Fix**: Centralize active index computation with normalized modulo indexing `((rawIdx % N) + N) % N`. Emit UI updates when target space is determined and update chip/dot active classes synchronously.

### Bug 3.2: Details Drawer Fly-In & Escape/Back
- **Observed**: Zooming in moved camera to a hardcoded offset `(0, 0, -110)` that sometimes clipped through meshes or rotated away from the selected space.
- **Root Cause**: Camera target position did not align with the rotunda's active panel normal.
- **Fix**: Frame camera at an optimal inspection distance (`z ≈ 40`), tilt slightly down, and display the details drawer with space title, architectural kicker, description, and "Reserve a Table" CTA. Esc key and back button cleanly fly camera out to overview (`z = 175`).

### Bug 3.3: Fake Web Audio Oscillator "Ambience"
- **Observed**: An "Ambience" toggle played synthesized pink noise and sine-wave chimes using Web Audio oscillators.
- **Root Cause**: A placeholder synthetic audio generator that sounded artificial and unrecorded.
- **Fix**: Removed the entire synthetic oscillator engine and audio toggle button as instructed. (No interior recorded audio file exists in `public/assets/`).

---

## 4. Performance & Loading Bugs

### Bug 4.1: Blank Black Canvas on Load
- **Observed**: Before Three.js finishes importing and loading textures, the canvas area was a pitch-black box (`#0d1308`).
- **Root Cause**: No poster placeholder or loading state existed while Three.js loaded asynchronously.
- **Fix**: Add a high-resolution poster image (`tour-entrance.webp`) with blurred background and graceful crossfade opacity when WebGL finishes compiling and renders its first frame.

### Bug 4.2: Mid-Range Phone 60 fps Budget
- **Observed**: Heavy shader uniforms and unbounded motes can degrade mobile frame rates.
- **Root Cause**: Particle motes buffer updates in CPU memory each frame; high resolution rendering without pixel ratio clamping.
- **Fix**: Clamp `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))` on mobile. Simplify motes or ambient lighting to GPU-efficient Three.js native objects. Ensure all UI drawers and overlays animate strictly via `transform` and `opacity`.

### Bug 4.3: Fallback Gallery Preservation
- **Requirement**: Maintain the horizontal scroll-snap gallery fallback for browsers without WebGL and users with `prefers-reduced-motion: reduce`.
- **Fix**: Fallback gallery remains intact with semantic markup, real photos, tags, and zero-JS accessibility.
