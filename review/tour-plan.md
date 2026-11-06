# 3D Panoramic Tour Upgrade Plan: "The Amber Horizon Rotunda"
**Target Section**: Home Page — "Step inside Fursat" (`src/components/PanoramicViewer.astro`)  
**Status**: Approved Plan with Revisions  
**Author**: Antigravity Pair Programmer  
**Date**: November 2026  

---

## 1. Concept and User Journey

### The Experience: "The Amber Horizon Rotunda"
An interactive WebGL 3D cylindrical rotunda positioning the visitor at the center of Fursat's cafe and lounge spaces. High-resolution real photography of six distinct interior zones is mapped onto curved panels in an inward-facing amphitheater. A low-overhead custom `ShaderMaterial` applies kinetic velocity-coupled optical effects (chromatic aberration and ripple/bend distortion) directly per-panel without full-screen postprocessing passes.

### Detailed User Journey:
1. **Initial View & "Step Inside" Invitation**:
   - The section renders with the camera positioned slightly outside and above the rotunda, bathed in a deep dark-olive atmosphere via cheap `THREE.Fog` (`#0d1308`).
   - A prominent floating **"Step Inside Fursat"** button invites the user.
   - Clicking "Step Inside" triggers a cinematic camera fly-in (~1.6s eased tween) gliding from outside into the sweet-spot center of the cylinder.
2. **Space-Name Navigation Chips**:
   - Six quick-jump chips are docked above/below the stage: `Entrance`, `Bar`, `High tables`, `Lounge`, `Cafe`, `Booth`.
   - Clicking any chip smoothly rotates the rotunda and focuses that panel directly.
3. **Tactile Kinetic Drag / Touch Navigation**:
   - The rotunda rotates horizontally with fluid inertia and friction decay (`touch-action: pan-y` so vertical page scroll is never trapped).
   - **In-Material Velocity Effects**: As drag speed spikes, the panel's custom `ShaderMaterial` applies:
     - **RGB Split (Chromatic Aberration)**: Red and blue color channel offsets scaling proportionally with angular velocity $|v_{drag}|$.
     - **Ripple / Bend Distortion**: A subtle wave ripple displacement across UV coordinates responding to rotational momentum.
4. **Focused Panel Drift (Ken Burns)**:
   - When a space is centered and stationary, the focused panel initiates a slow, subtle Ken Burns scale/pan drift directly in the fragment shader, adding organic life.
5. **Mobile Gyroscope & iOS "Enable Motion"**:
   - Clamped look-around (±8° vertical pitch, ±15° yaw).
   - On iOS 13+ devices where `DeviceOrientationEvent.requestPermission` is required, a clean **"Enable Motion Look-Around"** pill appears. Once granted, device orientation smoothly steers the view.
6. **Space Details Drawer**:
   - Tapping the active panel opens an editorial details drawer displaying only visible factual elements (furniture, lighting fixtures, wall artwork).
   - Includes a direct button linking to plain `/reserve` (no query parameters, no auto-submission).
7. **Photosphere Skybox Support (`public/panos/`)**:
   - The engine checks for 360° equirectangular panoramas in `public/panos/`. If present, an optional 360° photosphere skybox mode is made available.

---

## 2. Effects List with Priorities & Shader Architecture

### In-Material Shader vs. EffectComposer Justification
Instead of loading `three/examples/jsm/postprocessing/EffectComposer.js`, `RenderPass.js`, and `ShaderPass.js` (which would add ~28 KB gzip and incur two additional full-screen framebuffer copy passes per frame), **all chromatic aberration, ripple distortion, and Ken Burns drift are implemented directly inside a single custom `THREE.ShaderMaterial` applied to the cylinder panels**.
- **Byte Savings**: Zero postprocessing bundle overhead (~0 KB added beyond core Three.js).
- **GPU Performance**: Zero full-screen blits; 60 FPS locked on low-power mobile devices.
- **Visual Parity**: Produces the identical Awwwards kinetic velocity feel.

| Priority | Feature / Effect | Implementation Details |
| :--- | :--- | :--- |
| **P0 (Core)** | **Curved Rotunda Panels** | Inward-facing segmented cylindrical geometry with anisotropic texture filtering. |
| **P0 (Core)** | **"Step Inside" Fly-In** | Camera tween from `z: 750, y: 120` to `z: 0, y: 0` (~1.6s `cubic-bezier(0.16, 1, 0.3, 1)`). |
| **P0 (Core)** | **In-Material RGB Split & Ripple** | GLSL fragment shader offsetting UVs by velocity vector with ripple sine wave. |
| **P0 (Core)** | **Cheap THREE.Fog** | `scene.fog = new THREE.FogExp2(0x0d1308, 0.0012)`. Atmospheric depth at negligible cost. |
| **P0 (Core)** | **Space-Name Chips** | Interactive UI pills (`Entrance`, `Bar`, `High tables`, `Lounge`, `Cafe`, `Booth`) with instant smooth focus. |
| **P0 (Core)** | **Ken Burns Drift** | In-shader subtle UV zoom/pan $(1.0 \to 1.05)$ on the active focused panel. |
| **P0 (Core)** | **iOS "Enable Motion" Button** | Clean permission trigger for iOS 13+; passive listener for Android. |
| **P0 (Core)** | **Plain `/reserve` Link** | Drawer CTA routes to `/reserve` only (no `?zone` parameter). |
| **P0 (Core)** | **CSS 3D Fallback** | Existing pure CSS 3D ring retained for non-WebGL environments or `prefers-reduced-motion`. |
| **P1 (Polish)** | **Ambient Gold Bokeh Motes** | Lightweight `THREE.Points` (40 particles) drifting slowly with additive blending. |
| **P1 (Polish)** | **`public/panos/` Support** | Automatic detection of equirectangular textures for full 360° skybox toggle. |
| **Optional** | **Bloom** | Optional; strictly disabled on mobile / low-end devices. Default omitted to keep bundle ultra-lean. |

---

## 3. Photo Selection & Prep with sharp

### Panel Framing Rationale: Spaced Panels vs. Continuous Edge-to-Edge
The 6 photos in `raw_assets/interior_named` are captured from different rooms and vantage points throughout Fursat (e.g. entrance foyer vs. bar shelves vs. dining lounge vs. private booth). They do not share a single nodal center point.
- **Why Spaced Panels are Chosen**: Placing mismatched architectural rooms edge-to-edge creates jarring discontinuities where ceiling lines, floor tiles, and perspectives clash as if they were a broken panoramic stitch. Symmetrically spaced curved panels (separated by dark gaps and atmospheric fog) frame each zone as a distinct, curated architectural portal.
- **Dimensions & Format**: 1050 × 1400 px WebP, quality 82, under 300 KB each.

### Factual Visible Photo Descriptions (Strict Truth in Advertising)
All descriptions are restricted to what is physically visible in the photos:
1. **Entrance**: Handcrafted elephant wall mural with warm wall sconce lighting and carved wooden doors. (`tour-entrance.webp`, 151 KB)
2. **Bar Counter**: Backlit liquor bottle shelving, illuminated circular Fursat wall sign, and dark bar counter top. (`tour-bar.webp`, 234 KB)
3. **High Tables**: High-top wooden tables with black-frame high bar stools and pendant lighting. (`tour-high-tables.webp`, 214 KB)
4. **Lounge**: Green patterned sofa seating, square tables, indoor potted plants, and partition screens. (`tour-lounge.webp`, 240 KB)
5. **Cafe Wall**: White wall with black Fursat lettering, track lighting, and dining tables. (`tour-cafe.webp`, 38 KB)
6. **Booth**: Red banquette booth seating with framed wall posters and hanging warm lamps. (`tour-booth.webp`, 224 KB)

---

## 4. Performance Budget

- **Bundle Size**:
  - Three.js core dynamically imported on intersection only.
  - Zero `EffectComposer` overhead.
  - Estimated Three.js chunk: **~125 KB gzip**.
  - Initial home page HTML/JS addition: **0 KB** blocking.
- **Texture Payloads**:
  - 6 interior panels: all under 250 KB (total ~1.1 MB), loaded lazily.
- **Runtime Performance**:
  - Locked 60 FPS on mobile.
  - Max pixel ratio: `Math.min(window.devicePixelRatio, 1.75)`.
  - Inactive tab / off-screen suspension: RAF loop stopped when `!isIntersecting`.

---

## 5. Fallbacks and Accessibility

- **CSS 3D Fallback**: If WebGL context creation fails, the component seamlessly keeps the existing CSS 3D ring.
- **`prefers-reduced-motion`**:
  - Bypasses camera fly-in, in-material velocity distortion, and Ken Burns drift.
  - Rotates instantly on space chip clicks without tweening.
- **Accessibility**:
  - Full keyboard control (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
  - Space chips have `role="tab"`, `aria-selected`, and `aria-controls`.
  - Non-blocking vertical scroll via `touch-action: pan-y`.

---

## 6. Risks and Limitations

1. **iOS Gyroscope Permissions**:
   - Safari on iOS 13+ requires user gesture to call `DeviceOrientationEvent.requestPermission()`. Handled via the dedicated "Enable Motion" button.
2. **Mobile GPU Thermal Management**:
   - Mitigated by omitting `EffectComposer` and capping pixel ratio at 1.75.

---

## 7. Alternative Concepts Considered

1. **Edge-to-Edge Continuous Photosphere Cylinder**:
   - *Why Skipped*: The 6 photos are from separate rooms with different lighting and camera heights. A continuous stitch produces disorienting visual seams.
2. **Infinite Architectural Tunnel**:
   - *Why Skipped*: Fursat is an expansive open cafe and lounge, not a corridor. An infinite tunnel distorts the true spatial layout.
3. **AI Monocular Depth 2.5D Extrusion**:
   - *Why Skipped*: No Python/depth models in environment; synthetic depth generates rubbery mesh warping.

---

## 8. Implementation Tasks and Commits

- **Task 1: WebGL rotunda engine & curved panels** (`feat: tour 3d webgl rotunda canvas engine`)
  - Three.js lazy import on intersection.
  - Curved cylinder geometry, spaced panels with `tour-*.webp`.
  - Cheap `THREE.FogExp2(0x0d1308, 0.0012)`.
  - "Step inside" button with ~1.6s fly-in camera tween.
  - Space-name chips (`Entrance`, `Bar`, `High tables`, `Lounge`, `Cafe`, `Booth`).
  - Inertia drag with `touch-action: pan-y`.

- **Task 2: Panel shader effects & particles** (`feat: tour panel shader effects and particles`)
  - Custom `ShaderMaterial` on panels combining texture sampling, velocity-coupled RGB split, and ripple distortion.
  - Ken Burns slow drift on centered panel.
  - Ambient gold dust motes (`THREE.Points`).

- **Task 3: Camera fly-to, space drawer, gyro & panos** (`feat: tour camera fly to, space drawer and panos`)
  - Camera zoom to active space.
  - Factual space details drawer with link to plain `/reserve`.
  - Clamped gyroscope look-around with iOS "Enable motion" button.
  - `public/panos/` equirectangular detection.

- **Task 4: Fallback & a11y hardening** (`feat: tour fallback and a11y hardening`)
  - Automatic fallback to CSS 3D ring if WebGL is unavailable.
  - `prefers-reduced-motion` compliance.
  - Keyboard navigation and ARIA synchronization.

- **Task 5: Documentation & verification** (`docs: tour 3d rotunda completed`)
  - Update `RESUME.md`.
  - Report gzip Three.js chunk size, home page JS delta, image sizes.
  - `npm.cmd run build` confirmation (14 pages).

---

## 9. Questions for the Client

1. **Panoramas**: Once full 360° camera captures are available, drop them into `public/panos/` to activate the skybox viewer.
2. **Soundscape**: An optional gentle acoustic ambient toggle can be integrated in future phases if desired.
