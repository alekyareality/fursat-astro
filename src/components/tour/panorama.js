// "Step inside Fursat" panorama, reference layout (9 Nov 2026).
// A wide glowing window shows the 12 real photos as one continuous curved strip (feathered seams),
// with the approved story mode, step-through transitions, real clips, neon, lights, sound, POV and elephant hunt.
// Phone upgrades (9 Nov): opening pan, tilt to look, landscape collage, one-screen fit.
// Root state classes: pv-js, is-seen, is-inside, is-focus, is-pov, is-end, is-paused, is-vid, is-nogl, is-lite, is-360, is-imm, is-dragged.
import { SPACES as S, IMGS, smallImg, EMI, CLIPS, HOT, PAL, POV, MUSIC, ZONES } from './spaces.js';

export function initTour(root, opts = {}) { // opts.auto === false: no auto-enter into the story walk (used by the /reserve Pick-your-spot embed)
  if (!root || root.dataset.pvInit) return;
  root.dataset.pvInit = '1';
  root.classList.remove('pv-nojs');
  root.classList.add('pv-js');

  const N = S.length, STEP = Math.PI * 2 / N;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (id) => document.getElementById('pv-' + id);
  const has = (c) => root.classList.contains('is-' + c);
  const cls = (c, on) => root.classList.toggle('is-' + c, on);
  const win = $('win'), canvas = $('gl');
  let PANOS = [];
  try { PANOS = JSON.parse(($('panos') || {}).textContent || '[]'); } catch (e) {}

  /* ---------- zones (header row, thumbnails, pins) ---------- */
  const zoneOf = S.map((s) => ZONES.findIndex((z) => z.spaces.includes(s.id)));
  const anchor = ZONES.map((z) => S.findIndex((s) => s.id === z.pin));
  const pinsEl = $('pins');
  ZONES.forEach((z, k) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pv-pin'; b.dataset.z = k; b.setAttribute('aria-label', 'Go to ' + z.name);
    b.innerHTML = '<i></i><span>' + z.name.replace(/^The /, 'The ') + '</span>';
    pinsEl.appendChild(b);
  });
  const zoneEls = [...root.querySelectorAll('[data-z]')];
  const thumbBars = ZONES.map((_, k) => root.querySelector('.pv-thumb[data-z="' + k + '"] .pv-tbar b'));
  let activeZone = -2;
  function setZone(z) {
    if (z === activeZone) return; activeZone = z;
    zoneEls.forEach((el) => { const on = +el.dataset.z === z; el.classList.toggle('is-active', on); if (el.matches('.pv-thumb,.pv-zone')) el.setAttribute('aria-current', on ? 'true' : 'false'); });
    thumbBars.forEach((b, k) => { if (b && k !== z) b.style.transform = 'scaleX(0)'; });
  }

  let current = 0;
  function setCaption(i, instant) {
    const s = S[i]; $('capK').textContent = s.k; $('capD').textContent = s.d;
    const t = $('capT');
    if (instant || reduce) t.textContent = s.t;
    else {
      t.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-105%)', opacity: 0 }], { duration: 220, easing: 'cubic-bezier(0.7,0,0.84,0)' }).onfinish = () => {
        t.textContent = s.t;
        t.animate([{ transform: 'translateY(105%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, easing: 'cubic-bezier(0.16,1,0.3,1)' });
      };
      $('capD').animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 120, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'backwards' });
    }
    setZone(zoneOf[i]);
  }
  setCaption(0, true);

  /* ---------- loader / fallback ---------- */
  const lp = $('lp'); let loaded = 0, shown = false;
  function progress() { loaded++; lp.style.transition = 'stroke-dashoffset .6s cubic-bezier(0.16,1,0.3,1)'; lp.style.strokeDashoffset = 339.3 * (1 - Math.min(1, loaded / 4)); }
  function finishLoad() { if (shown) return; shown = true; setTimeout(() => { $('loader').classList.add('done'); maybeAutoEnter(); }, 350); }
  function fallback() { cls('nogl', true); $('loader').classList.add('done'); }

  /* ---------- background music (off by default; browsers block autoplay with sound) ---------- */
  let ratio = 0, visible = false;
  const sound = (() => {
    const btn = $('sound'); let on = false, ctx = null, gain = null, src = null, buf = null, loading = null, el = null;
    const label = () => { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? 'Sound off' : 'Sound on'); btn.title = on ? 'Sound off' : 'Sound on'; };
    const load = () => loading || (loading = fetch(MUSIC).then((r) => { if (!r.ok) throw new Error('music ' + r.status); return r.arrayBuffer(); }).then((a) => new Promise((res, rej) => ctx.decodeAudioData(a, res, rej))).then((b) => { buf = b; return b; }));
    const wantPlay = () => on && ratio > 0.15 && !document.hidden;
    function fade(to, sec) { const t = ctx.currentTime; gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t); gain.gain.linearRampToValueAtTime(to, t + sec); }
    async function start() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { el = el || Object.assign(new Audio(MUSIC), { loop: true, volume: 0.5 }); el.play().catch(() => { on = false; label(); }); return; }
      if (!ctx) { ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination); }
      if (ctx.state === 'suspended') await ctx.resume();
      await load();
      if (!on) return;
      if (!src) { nextAt = ctx.currentTime + 0.05; pump(); }
      fade(0.55, 1.2);
    }
    /* smooth loop: each pass of the track fades in over XF s and, XF s before its end, the next pass starts and fades in
       while this one fades out, so the end flows back into the start with no jump or silence */
    const XF = 2.5; let nextAt = 0;
    function pass(at) {
      const d = buf.duration, s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = buf; s.connect(g); g.connect(gain);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(1, at + XF);
      g.gain.setValueAtTime(1, at + d - XF); g.gain.linearRampToValueAtTime(0, at + d);
      s.start(at); s.stop(at + d + 0.05); src = s; nextAt = at + d - XF;
    }
    function pump() { if (!ctx || !buf) return; while (nextAt - ctx.currentTime < 6) pass(nextAt); setTimeout(pump, 1500); }
    function stop() {
      if (el) { el.pause(); return; }
      if (!ctx) return; fade(0, 0.6);
      setTimeout(() => { if (!on && ctx.state === 'running') ctx.suspend(); }, 650);
    }
    function sync() {
      if (el) { if (wantPlay()) el.play().catch(() => {}); else el.pause(); return; }
      if (!ctx || !src) return;
      if (wantPlay()) ctx.resume().then(() => fade(0.55, 0.8));
      else { fade(0, 0.3); setTimeout(() => { if (!wantPlay() && ctx.state === 'running') ctx.suspend(); }, 350); }
    }
    btn.addEventListener('click', () => { on = !on; label(); if (on) start().catch(() => { on = false; label(); }); else stop(); });
    document.addEventListener('visibilitychange', sync);
    return { sync };
  })();

  /* ---------- visibility: header reveal, lazy start, render pause, auto step-inside ---------- */
  let started = false, autoTimer = 0, enterFn = null, pauseVids = null, stopTilt = null, immersive = false;
  function maybeAutoEnter() {
    clearTimeout(autoTimer);
    if (opts.auto === false) return;
    if (!shown || !enterFn || has('inside') || ratio < 0.55) return;
    autoTimer = setTimeout(() => { if (ratio >= 0.55 && enterFn) enterFn(); }, reduce ? 200 : 700);
  }
  new IntersectionObserver((es) => { if (es[es.length - 1].isIntersecting) cls('seen', true); }, { threshold: 0.12 }).observe(root);
  new IntersectionObserver((es) => {
    const e = es[es.length - 1];
    visible = e.isIntersecting || immersive; ratio = immersive ? 1 : e.intersectionRatio;
    if (!visible && pauseVids) pauseVids();
    if (!visible && stopTilt) stopTilt();
    sound.sync(); maybeAutoEnter();
  }, { threshold: [0, 0.15, 0.3, 0.55, 0.8, 1] }).observe(win);
  new IntersectionObserver((es) => {
    if (started || !es[es.length - 1].isIntersecting) return;
    started = true;
    import('./three-lite.js').then((T) => init(T)).catch(fallback);
  }, { rootMargin: '900px 0px' }).observe(root);

  /* ---------- WebGL ---------- */
  function init(THREE) {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch (e) { fallback(); return; }
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || innerWidth < 768;
    let dprCap = lowEnd ? 1.25 : 1.75; renderer.setPixelRatio(Math.min(devicePixelRatio, dprCap));
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    // Photos are 3:4. Neighbours overlap by OV of a step on each side and cross-fade, so the ring reads as one strip.
    const H = 8, W = H * 0.75, OV = 0.14, ARC = STEP * (1 + 2 * OV), R = W / ARC, EDGE = OV / (1 + 2 * OV);
    const room = new THREE.Group(); scene.add(room);

    const U = { uTime: { value: 0 }, uVel: { value: 0 }, uDwell: { value: 0 }, uRZ: { value: 1 }, uNight: { value: 0 }, uRgb: { value: 1 }, uCyl: { value: 0 }, uHalfH: { value: 1 }, uTanV: { value: 0.3 } };
    const blackTex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); blackTex.needsUpdate = true;
    const TH = { uTint: { value: new THREE.Vector3() }, uBack: { value: new THREE.Vector3() }, uGold: { value: new THREE.Vector3() } };
    const mixPal = (a, b, k, key) => { const A = PAL[S[a].id][key], B = PAL[S[b].id][key]; return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k]; };
    function applyPalette(p) {
      const i0 = ((Math.floor(p) % N) + N) % N, i1 = (i0 + 1) % N; let k = p - Math.floor(p); k = k * k * (3 - 2 * k);
      TH.uGold.value.set(...mixPal(i0, i1, k, 'gold')); TH.uTint.value.set(...mixPal(i0, i1, k, 'tint')); TH.uBack.value.set(...mixPal(i0, i1, k, 'back'));
    }
    applyPalette(0);

    const vert = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
    // Photos: perspective (curved 3D look) blended with a cylindrical panorama projection (uCyl=1). In the panorama
    // projection horizontal angle maps straight to screen x, so every photo gets an equal share of the window,
    // like the reference collage, and dragging pans a true 360.
    const vertPanel = `uniform float uCyl,uHalfH,uTanV;varying vec2 vUv;void main(){vUv=uv;vec4 mv=modelViewMatrix*vec4(position,1.);vec4 p=projectionMatrix*mv;
  if(uCyl>.001){float d=max(length(mv.xz),1e-4);vec2 c=vec2(atan(mv.x,-mv.z)/uHalfH,mv.y/d/uTanV);p.xy=mix(p.xy,c*p.w,uCyl);}gl_Position=p;}`;
    const frag = `
uniform sampler2D uTex;uniform float uTime,uVel,uFocus,uSweep,uHover,uOpen,uRgb,uFeL,uFeR,uEdge,uSat;uniform vec3 uTint,uBack,uGold;uniform vec2 uFP;uniform float uDwell,uRZ,uNeon,uNight;uniform vec3 uTorch,uRing;uniform sampler2D uEmi,uVid;uniform float uVidMix;varying vec2 vUv;
float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  float alpha=mix(1.,smoothstep(0.,uEdge,vUv.x),uFeL)*mix(1.,smoothstep(0.,uEdge,1.-vUv.x),uFeR);
  if(alpha<.01)discard;
  if(gl_FrontFacing){gl_FragColor=vec4(uBack*.9,alpha);return;}
  vec2 uv=vec2(1.-vUv.x,vUv.y);
  float f=uFocus;
  float breathe=.5+.5*sin(uTime*.22);
  float rz=uRZ*uRZ*(3.-2.*uRZ);
  float kb=1.+f*(.5*rz+.025*breathe+.06*uDwell+.26*uOpen);
  vec2 p=uFP+(uv-uFP)/kb+vec2(sin(uTime*.11),cos(uTime*.09))*.005*f*(1.-uOpen);
  float v=uVel;
  p.y+=sin(p.x*16.+uTime*6.)*.008*abs(v);
  p.x+=sin(p.y*3.14159)*.04*v;
  vec2 off=vec2(.016*v,.004*v)*uRgb;
  vec3 col=vec3(texture2D(uTex,p+off).r,texture2D(uTex,p).g,texture2D(uTex,p-off).b);
  if(uVidMix>.001){vec3 vc=texture2D(uVid,p).rgb;col=mix(col,vc,uVidMix);}
  vec3 full=col;
  col*=.9+.1*f;
  float td=length((uv-uTorch.xy)*vec2(.75,1.));
  col=mix(col,full*1.1+vec3(.05,.03,.0),smoothstep(.26,.0,td)*uTorch.z*(1.-.75*f));
  float spot=.32+.9*smoothstep(.62,.0,length((uv-uFP)*vec2(.75,1.)));
  col=mix(col,col*mix(col,vec3(1.),.35)*1.18*vec3(1.,.86,.7)*spot,uNight*.8);
  col=pow(col,vec3(.95))*(1.03+.12*uHover);
  col+=texture2D(uEmi,p).rgb*uNeon*(1.05+.85*uNight)*(1.-uVidMix);
  float ra=uTime-uRing.z;
  if(ra>0.&&ra<1.6){float rr=length((uv-uRing.xy)*vec2(.75,1.));float ring=smoothstep(.014,0.,abs(rr-ra*.32))*(1.-ra/1.6);col+=uGold*ring*1.8+uGold*smoothstep(.06,0.,rr)*(1.-ra/1.6)*.6;}
  float band=smoothstep(.1,0.,abs(uv.x*.75+uv.y*.45-(uSweep*1.9-.45)));
  col+=vec3(1.,.82,.58)*band*.36*f;
  // warm golden grade (real photos, colour only): saturation, warm balance, glowing highlights, gentle contrast
  float lg=luma(col);
  col=mix(vec3(lg),col,mix(uSat,1.12,uNight));
  col*=mix(vec3(1.06,1.,.89),vec3(1.02,1.,.95),uNight);
  col=pow(max(col,0.),vec3(1.2));
  col+=smoothstep(.5,1.,lg)*vec3(.08,.045,.0);
  col=(col-.4)*1.1+.4;
  col+=(hash(uv*900.+uTime)-.5)*.02;
  gl_FragColor=vec4(max(col,0.),alpha);
}`;

    const loaderT = new THREE.TextureLoader();
    const panels = [], vids = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const small = Math.min(innerWidth, innerHeight) < 720;
    function loadTex(i) {
      const src = small ? smallImg(IMGS[S[i].id]) : IMGS[S[i].id];
      loaderT.load(src, (tx) => {
        tx.anisotropy = maxAniso; tx.minFilter = THREE.LinearMipmapLinearFilter; tx.generateMipmaps = true;
        panels[i].material.uniforms.uTex.value = tx; progress();
        if (loaded >= 4) finishLoad();
      }, undefined, () => { progress(); });
    }
    S.forEach((s, i) => {
      const emi = EMI[s.id] ? loaderT.load(EMI[s.id]) : blackTex;
      let vtex = blackTex;
      if (CLIPS[s.id]) {
        const v = document.createElement('video');
        v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'none';
        v.addEventListener('error', () => { v._err = true; });
        vtex = new THREE.VideoTexture(v); vids[i] = v;
      }
      // Panel i fades its edge over panel i-1 and is drawn after it, a hair closer to the camera, so seams cross-fade cleanly.
      // The last panel also fades over panel 0 to close the ring.
      const r = R * (1 - i * 0.001);
      const geo = new THREE.CylinderGeometry(r, r, H, 48, 1, true, -i * STEP - ARC / 2, ARC);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: blackTex }, uEmi: { value: emi }, uVid: { value: vtex }, uVidMix: { value: 0 }, uRing: { value: new THREE.Vector3(0, 0, -9) },
          uNeon: { value: 0 }, uNight: U.uNight, uTorch: { value: new THREE.Vector3(0.5, 0.5, 0) }, uRZ: U.uRZ, uRgb: U.uRgb,
          uFP: { value: new THREE.Vector2(...PAL[s.id].fp) }, uDwell: U.uDwell, uTime: U.uTime, uVel: U.uVel,
          uTint: TH.uTint, uBack: TH.uBack, uGold: TH.uGold, uFocus: { value: 0 }, uSweep: { value: 2 }, uHover: { value: 0 }, uOpen: { value: 0 },
          uFeR: { value: i > 0 ? 1 : 0 }, uFeL: { value: i === N - 1 ? 1 : 0 }, uEdge: { value: EDGE }, uSat: { value: 1.55 },
          uCyl: U.uCyl, uHalfH: U.uHalfH, uTanV: U.uTanV,
        },
        vertexShader: vertPanel, fragmentShader: frag, transparent: true, side: THREE.DoubleSide, depthWrite: true,
      });
      const m = new THREE.Mesh(geo, mat); m.userData.i = i; m.renderOrder = i; room.add(m); panels.push(m);
    });
    pauseVids = () => vids.forEach((v) => { if (v && !v.paused) v.pause(); });

    // load order: first space and its neighbours, then the rest when the browser is idle
    {
      const order = [0, 1, N - 1, 2, N - 2]; for (let k = 3; k < N - 2; k++) order.push(k);
      order.slice(0, 4).forEach(loadTex);
      const rest = order.slice(4);
      const idle = window.requestIdleCallback ? (f) => window.requestIdleCallback(f, { timeout: 700 }) : (f) => setTimeout(f, 120);
      const next = () => { const i = rest.shift(); if (i === undefined) return; loadTex(i); idle(next); };
      setTimeout(next, 400);
    }

    // gold motes floating in front of the photos
    const MC = lowEnd ? 90 : (fine ? 260 : 140), mp = new Float32Array(MC * 3), ms = new Float32Array(MC);
    for (let i = 0; i < MC; i++) { const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * R * 0.9; mp[i * 3] = Math.cos(a) * rr; mp[i * 3 + 1] = (Math.random() - 0.5) * H * 1.2; mp[i * 3 + 2] = Math.sin(a) * rr; ms[i] = Math.random(); }
    const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(mp, 3)); mg.setAttribute('aSeed', new THREE.BufferAttribute(ms, 1));
    const motes = new THREE.Points(mg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uPR: { value: renderer.getPixelRatio() }, uVel: U.uVel },
      vertexShader: `uniform float uTime,uPR,uVel;attribute float aSeed;varying float vS;void main(){vS=aSeed;vec3 p=position;
    p.y=mod(p.y+uTime*(.15+aSeed*.35)+${(H * 0.6).toFixed(1)},${(H * 1.2).toFixed(1)})-${(H * 0.6).toFixed(1)};
    p.x+=sin(uTime*.4+aSeed*20.)*.3;p.z+=cos(uTime*.3+aSeed*13.)*.3;
    float ang=uVel*.25*(.5+aSeed);float c=cos(ang),s=sin(ang);p.xz=mat2(c,-s,s,c)*p.xz;
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(1.2+aSeed*3.6)*uPR*(16./-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform float uTime;varying float vS;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);a*=.3+.6*(.5+.5*sin(uTime*2.+vS*40.));
    vec3 c=mix(vec3(1.,.8,.48),vec3(.95,.5,.3),step(.85,vS));gl_FragColor=vec4(c*a,a);}`,
    }));
    motes.renderOrder = 50; scene.add(motes);

    // optional real 360 photo (public/panos/), kept from commit d2f7515
    let is360 = false, sphere = null, lon = 0, lat = 0, tLon = 0, tLat = 0;
    if (PANOS.length) {
      const tex = loaderT.load(PANOS[0]); tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
      const sg = new THREE.SphereGeometry(60, 60, 40); sg.scale(-1, 1, 1);
      sphere = new THREE.Mesh(sg, new THREE.MeshBasicMaterial({ map: tex })); sphere.visible = false; scene.add(sphere);
    }
    function toggle360(on) {
      if (!sphere) return;
      is360 = on === undefined ? !is360 : on;
      cls('360', is360); const b = $('b360'); if (b) b.setAttribute('aria-pressed', is360 ? 'true' : 'false');
      room.visible = motes.visible = !is360; sphere.visible = is360;
      if (is360) { tiltStop(true); closeDetail(); storyT = 0; }
    }

    /* ---------- state ---------- */
    let pos = 0.5, vel = 0, target = null, dragging = false, inside = false, flyT = 0, flying = false, openAmt = 0, openTarget = 0, smoothVel = 0;
    let mx = 0, my = 0, cmx = 0, cmy = 0, hoverI = -1, litIdx = -1; const age = new Array(N).fill(99);
    const focusVals = new Array(N).fill(0), sweep = new Array(N).fill(2);
    const wrap = (i) => ((i % N) + N) % N;
    let sw = 1, shh = 1;
    // phone upgrades: opening pan, tilt to look, landscape collage
    const coarse = matchMedia('(pointer:coarse)').matches;
    const isPhone = coarse && Math.min(screen.width, screen.height) < 600;
    let pan = null, sweepPlanned = false, overviewRan = false, overviewMax = 9, rotShown = false, fsOn = false, lockedLandscape = false;
    const tilt = { on: false, busy: false, got: false, raw: 0, f: 0, hLast: null, p0: null, pr: 0, pf: 0, base: 0, lastPos: 0, y: 0, to: 0 };
    const pinW = [], pinD = [];

    function size() {
      sw = win.clientWidth || 1; shh = win.clientHeight || 1;
      renderer.setSize(sw, shh, false); camera.aspect = sw / shh; camera.updateProjectionMatrix();
    }
    // Camera fit: pick a horizontal field of view for the window shape. Stand at the ring centre (every photo the same size)
    // when the photos already fill the height; otherwise step forward until they do, so the sides curve away (phone, full screen).
    const fit = { fov: 40, d: 10 };
    function computeFit() {
      const a = camera.aspect, hz = a >= 2.4 ? 88 : a >= 1.3 ? 92 : 64;
      const v = Math.min(84, Math.max(20, 2 * Math.atan(Math.tan(hz * Math.PI / 360) / a) * 180 / Math.PI));
      fit.fov = v; fit.d = Math.min((H / 2) * 1.03 / Math.tan(v * Math.PI / 360), R);
    }
    // Wide window (desktop): panorama projection, each photo ~0.95 as wide as the window is tall, so about four photos
    // show side by side. Phone and full screen keep the curved perspective look.
    // A phone turned sideways (aspect about 2.0 to 2.4) uses it too, with the photos filling the height so about four sit side by side.
    const pano = () => camera.aspect >= 2.0;
    function computePano() {
      const a = camera.aspect, std = a * STEP / 1.9, fitHH = (H / 2) / R * a;
      const k = a <= 2.45 ? 1 : a >= 2.6 ? 0 : (2.6 - a) / 0.15;
      const hh = Math.min(70 * Math.PI / 180, std + (fitHH - std) * k);
      U.uHalfH.value = hh; U.uTanV.value = hh / a;
    }
    new ResizeObserver(() => { size(); computeFit(); computePano(); pinW.length = 0; pinD.length = 0; viewChanged(); }).observe(win); size(); computeFit(); computePano();

    function goTo(i) { target = Math.round(pos) + (((i - wrap(Math.round(pos))) % N + N + N / 2) % N - N / 2); storyT = 0; }
    function navTo(i, isPin) {
      toggle360(false); if (!inside) { enter(); return; }
      if (overview) { endOverview(true); goTo(i); cls('dragged', true); return; }
      if (isPin && i === wrap(Math.round(target ?? pos)) && !has('focus')) { openDetail(i); return; }
      closeDetail(); goTo(i); cls('dragged', true);
    }
    zoneEls.forEach((el) => el.addEventListener('click', () => navTo(anchor[+el.dataset.z], el.classList.contains('pv-pin'))));
    $('prev').onclick = () => { closeDetail(); endOverview(true); goTo(wrap(Math.round(target ?? pos) - 1)); };
    $('next').onclick = () => { closeDetail(); endOverview(true); goTo(wrap(Math.round(target ?? pos) + 1)); };

    // ---------- story mode ----------
    let storyT = 0, paused = false, portal = null, portalAmt = 0, held = false, holdTimer = null;
    const storyEl = $('stories');
    S.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to ' + s.t); b.innerHTML = '<i><b></b></i>'; b.onclick = () => { closeDetail(); jump(i); }; storyEl.appendChild(b); });
    const storyBars = [...storyEl.querySelectorAll('b')];
    const storyDur = (i) => (CLIPS[S[i].id] ? 10 : 7);
    function jump(i) { const c = wrap(Math.round(pos)); if (i === c) return; if (reduce) goTo(i); else startPortal(i); }
    function advance(d) { jump(wrap(Math.round(target ?? pos) + d)); }
    function startPortal(to) { if (portal || !inside) return; if (reduce || pano()) { goTo(to); storyT = 0; return; } portal = { t: 0, to, sw: false }; storyT = 0; }
    // Overview: after stepping inside, the wide window rests on Bar | Dining | Lounge | Café with all four pins,
    // like the reference. The story starts after a few seconds or as soon as the visitor does anything.
    let overview = false, overviewT = 0;
    // A visitor touch, tilt or button press during the opening pan keeps the view where it is (settles on the nearest space).
    function endOverview(keep) {
      sweepPlanned = false;
      if (!overview) return; overview = false; cls('overview', false); overviewT = 0; storyT = 0;
      if (pan) { pan = null; vel = 0; target = Math.round(pos); }
      else if (!keep) goTo(0);
      current = -1;
    }
    // Phone, portrait: after the fly-in the camera sweeps bar -> garden window (whole venue), then the story starts at the Entrance.
    function beginSweep() { pan = { t: 0, from: pos, to: pos + 3 }; target = null; vel = 0; storyT = 0; overviewT = 0; }
    // Phone, landscape full screen: rest on Bar | Dining | Lounge | Café once, like the desktop window.
    function startCollage() {
      tiltStop(true); overviewRan = true; overview = true; cls('overview', true); overviewT = 0; overviewMax = 6; storyT = 0; closeDetail();
      target = 2.5 + N * Math.round((pos - 2.5) / N); vel = 0; setZone(0);
    }
    function viewChanged() {
      if (!immersive) { hideRotate(); return; }
      if (pano()) { hideRotate(); if (inside && !flying && !overview && !overviewRan && !portal && !has('pov') && !has('focus') && !is360) startCollage(); }
      else if (isPhone && camera.aspect < 1) showRotateSoon();
    }
    function toast(msg, ms) { const el = $('toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), ms || 3200); }
    function buzz(ms) { try { navigator.vibrate && navigator.userActivation && navigator.userActivation.hasBeenActive && navigator.vibrate(ms); } catch (e) {} }

    // ---------- elephant hunt ----------
    let found = new Set(); try { found = new Set(JSON.parse(localStorage.getItem('fursat-ele') || '[]')); } catch (e) {}
    const huntDots = $('huntDots'); HOT.forEach(() => huntDots.appendChild(document.createElement('i')));
    function drawHunt() { [...huntDots.children].forEach((d, i) => d.classList.toggle('on', found.has(i))); $('huntN').textContent = found.size + '/' + HOT.length; }
    drawHunt();
    const allFound = 'All six found. The real ones are waiting at Capital Park.';
    $('hunt').onclick = () => toast(found.size === HOT.length ? allFound : 'Six Fursat elephants are hidden in these rooms. Tap one when you spot it.', 3800);
    function checkElephant(i, uvx, uvy) {
      for (let k = 0; k < HOT.length; k++) {
        const h = HOT[k]; if (S[i].id !== h.s) continue;
        if (Math.hypot((uvx - h.x) * 0.75, uvy - (1 - h.y)) < h.r) {
          panels[i].material.uniforms.uRing.value.set(h.x, 1 - h.y, U.uTime.value);
          if (!found.has(k)) {
            found.add(k); try { localStorage.setItem('fursat-ele', JSON.stringify([...found])); } catch (e) {}
            drawHunt(); buzz([12, 40, 12]);
            toast(found.size === HOT.length ? allFound : 'You found an elephant at ' + S[i].t + ' · ' + found.size + ' of ' + HOT.length, 3000);
          } else toast('Already found this one · ' + found.size + ' of ' + HOT.length, 1800);
          return true;
        }
      }
      return false;
    }

    // ---------- full-screen "Explore the Space" ----------
    let lastFocus = null;
    function setImmersive(on) {
      if (on === immersive) return;
      immersive = on; cls('imm', on); document.documentElement.classList.toggle('pv-lock', on);
      $('explore').setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) { lastFocus = document.activeElement; visible = true; ratio = 1; setTimeout(() => $('closeImm').focus({ preventScroll: true }), 50); }
      else if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      if (!on) { hideRotate(); leaveLandscape(); }
      sound.sync();
    }
    // Android Chrome: real full screen, then lock to landscape (iOS cannot lock, so it gets the rotate hint instead)
    async function goLandscape() {
      const w = $('wrap');
      if (!isPhone || !w.requestFullscreen || !(screen.orientation && screen.orientation.lock)) return;
      try { await w.requestFullscreen({ navigationUI: 'hide' }); fsOn = true; await screen.orientation.lock('landscape'); lockedLandscape = true; hideRotate(); } catch (e) {}
    }
    function leaveLandscape() {
      lockedLandscape = false;
      try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) {}
      if (fsOn) { fsOn = false; try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) {} }
    }
    document.addEventListener('fullscreenchange', () => { if (fsOn && !document.fullscreenElement) { fsOn = false; if (immersive) { if (has('pov')) povEnd(); setImmersive(false); } } });
    // one-time hint (per session) when full screen is opened upright on a phone
    const rotEl = $('rotate'); let rotT = 0, rotWait = 0;
    function hideRotate() { clearTimeout(rotT); clearTimeout(rotWait); if (rotEl) { rotEl.classList.remove('on'); rotEl.setAttribute('aria-hidden', 'true'); } }
    function showRotateSoon() {
      if (!rotEl || rotShown || lockedLandscape) return; clearTimeout(rotWait);
      rotWait = setTimeout(() => {
        if (!immersive || pano() || camera.aspect >= 1 || lockedLandscape) return;
        let seen = false; try { seen = sessionStorage.getItem('fursat-rot') === '1'; sessionStorage.setItem('fursat-rot', '1'); } catch (e) {}
        rotShown = true; if (seen) return;
        rotEl.classList.add('on'); rotEl.setAttribute('aria-hidden', 'false'); rotT = setTimeout(hideRotate, 4000);
      }, 500);
    }
    $('explore').onclick = () => { if (!inside && !flying) enter(); else endOverview(true); setImmersive(true); goLandscape(); };
    $('closeImm').onclick = () => { if (has('pov')) povEnd(); setImmersive(false); };

    // ---------- POV walk-through (plays full screen) ----------
    let povStep = -1, povAt = 0, povLock = 0, povWasImm = false;
    function povShow(lines) {
      const L = $('povlayer'); L.innerHTML = ''; let n = 0;
      lines.forEach((line) => {
        const w = document.createElement('div'); w.className = 'pv-w'; const words = line.split(' ');
        words.forEach((word, j) => {
          const s = document.createElement('span'); s.textContent = word + (j < words.length - 1 ? ' ' : ''); w.appendChild(s);
          s.animate([{ opacity: 0, transform: 'translateY(40%) scale(.95)' }, { opacity: 1, transform: 'none' }], { duration: reduce ? 1 : 520, delay: reduce ? 0 : n * 110, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }); n++;
        });
        L.appendChild(w);
      });
    }
    function povNext() {
      if (performance.now() < povLock) return; povLock = performance.now() + 900; povStep++; $('povlayer').innerHTML = '';
      if (povStep >= POV.length) { cls('end', true); return; }
      const st = POV[povStep], si = Math.max(0, S.findIndex((x) => x.id === st.s)); const c = wrap(Math.round(pos)); if (si !== c) startPortal(si);
      setTimeout(() => { if (has('pov')) povShow(st.l); }, reduce ? 0 : (si !== c ? 900 : 200)); povAt = performance.now();
    }
    function povStart() { if (!inside) return; tiltStop(true); endOverview(true); toggle360(false); closeDetail(); povWasImm = immersive; setImmersive(true); cls('pov', true); cls('end', false); povStep = -1; povLock = 0; povNext(); }
    function povEnd() { cls('pov', false); cls('end', false); $('povlayer').innerHTML = ''; storyT = 0; if (!povWasImm) setImmersive(false); }
    $('povBtn').onclick = povStart; $('povExit').onclick = povEnd; $('endBack').onclick = povEnd;
    const povActive = () => has('pov') && !has('end');
    win.addEventListener('wheel', (e) => { if (povActive() && Math.abs(e.deltaY) > 14) { e.preventDefault(); povNext(); } }, { passive: false });
    win.addEventListener('touchend', (e) => { if (povActive() && !e.target.closest('button,a')) povNext(); }, { passive: true });
    win.addEventListener('click', (e) => { if (povActive() && !e.target.closest('button,a') && !('ontouchstart' in window)) povNext(); });
    root.addEventListener('keydown', (e) => {
      if (!inside) return;
      if (e.key.startsWith('Arrow')) endOverview(true);
      if (has('pov')) {
        if (e.key === 'Escape') povEnd();
        else if (['ArrowRight', 'ArrowDown', ' ', 'Enter'].includes(e.key) && !has('end')) { e.preventDefault(); povNext(); }
        return;
      }
      if (e.target.closest && e.target.closest('a,button') && (e.key === ' ' || e.key === 'Enter')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); $('next').click(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); $('prev').click(); }
      else if (e.key === ' ' && immersive) { e.preventDefault(); paused = !paused; cls('paused', paused); }
      else if (e.key === 'Escape') { if (has('focus')) closeDetail(); else if (is360) toggle360(false); else if (immersive) setImmersive(false); }
    });

    // ---------- step inside ----------
    const hr = new Date().getHours(); const evening = hr >= 18 || hr < 6;
    let p0 = 0, flyEnd = -N;
    function enter() {
      if (inside || flying) return; clearTimeout(autoTimer);
      setTimeout(() => toast(evening ? 'Evening at Fursat, so the lights are down. Drag, or tap the sides to move.' : 'Drag to look around, tap a photo to open it. Six elephants are hidden in here.', 4200), 2400);
      flying = true; flyT = reduce ? 1 : 0; p0 = pos; cls('inside', true); target = null; vel = 0;
      const wide = pano(); sweepPlanned = !wide && !reduce;
      flyEnd = -N + (wide ? 2.5 : sweepPlanned ? 1 : 0); overview = wide || sweepPlanned; cls('overview', overview);
      if (wide) { overviewRan = true; overviewMax = 9; }
      if (overview) setZone(0); else setCaption(0, true);
    }
    enterFn = enter;
    let nightT = 0;
    function setLights(v) { nightT = v; const b = $('lights'); b.setAttribute('aria-pressed', v ? 'true' : 'false'); b.setAttribute('aria-label', v ? 'Lights up' : 'Lights down'); b.title = v ? 'Lights up' : 'Lights down'; }
    if (evening) setLights(1);
    $('lights').onclick = () => setLights(nightT ? 0 : 1);
    if ($('b360')) $('b360').onclick = () => toggle360();

    // ---------- tilt to look (gyroscope) ----------
    // The phone is a window onto the room: turning it turns the view (30 degrees = one space). The heading comes from where the back of
    // the phone points (the full rotation, so it also works when the phone is held upright, where alpha alone is unreliable),
    // falling back to the top edge of the screen when the phone lies flat. Everything is relative to the moment of switching on.
    const tiltBtn = $('tilt'), D2R = Math.PI / 180;
    if (tiltBtn && 'DeviceOrientationEvent' in window && coarse) tiltBtn.hidden = false;
    const smooth01 = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    function onTilt(e) {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      const a = e.alpha * D2R, b = e.beta * D2R, g = e.gamma * D2R;
      const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b), cG = Math.cos(g), sG = Math.sin(g);
      const bx = -(cA * sG + cG * sA * sB), by = -(sA * sG - cA * cG * sB), bz = -cB * cG;   // where the back of the phone points
      const xX = cA * cG - sA * sB * sG, xY = cG * sA + cA * sB * sG, yX = -cB * sA, yY = cA * cB;   // right and top edges
      const ang = screen.orientation && typeof screen.orientation.angle === 'number' ? screen.orientation.angle : (window.orientation || 0);
      const q = ((Math.round(ang / 90) % 4) + 4) % 4;
      const ux = q === 0 ? yX : q === 1 ? xX : q === 2 ? -yX : -xX, uy = q === 0 ? yY : q === 1 ? xY : q === 2 ? -yY : -xY;   // top of the screen
      const mb = Math.hypot(bx, by), mu = Math.hypot(ux, uy), wB = smooth01(0.2, 0.5, mb);
      const hx = (mb > 1e-4 ? bx / mb : 0) * wB + (mu > 1e-4 ? ux / mu : 0) * (1 - wB);
      const hy = (mb > 1e-4 ? by / mb : 0) * wB + (mu > 1e-4 ? uy / mu : 0) * (1 - wB);
      if (Math.abs(hx) + Math.abs(hy) < 1e-4) return;
      const heading = Math.atan2(hx, hy) / D2R, pitch = Math.asin(Math.max(-1, Math.min(1, bz))) / D2R;
      if (tilt.hLast === null) { tilt.hLast = heading; tilt.p0 = pitch; }
      let d = heading - tilt.hLast; d -= 360 * Math.round(d / 360);   // unwrap across 0/360
      tilt.raw += d; tilt.hLast = heading; tilt.pr = Math.max(-25, Math.min(25, pitch - tilt.p0)); tilt.got = true;
    }
    const tiltFail = () => toast("Tilt isn't available on this device", 3200);
    async function tiltStart() {
      if (tilt.on || tilt.busy || !inside || flying) return;
      tilt.busy = true;
      try {
        // iOS: the permission prompt must be raised straight from the tap
        if (typeof DeviceOrientationEvent.requestPermission === 'function' && (await DeviceOrientationEvent.requestPermission()) !== 'granted') throw new Error('denied');
      } catch (e) { tilt.busy = false; tiltFail(); return; }
      tilt.busy = false;
      if (!inside || has('pov')) return;
      if (is360) toggle360(false);
      endOverview(true); closeDetail();
      tilt.on = true; tilt.got = false; tilt.hLast = null; tilt.raw = tilt.f = tilt.pr = tilt.pf = 0;
      tilt.base = pos; tilt.lastPos = pos; target = null; vel = 0; storyT = 0;
      tiltBtn.setAttribute('aria-pressed', 'true');
      window.addEventListener('deviceorientation', onTilt);
      clearTimeout(tilt.to); tilt.to = setTimeout(() => { if (tilt.on && !tilt.got) { tiltStop(true); tiltFail(); } }, 1500);
    }
    function tiltStop() {
      if (!tilt.on) return; tilt.on = false; clearTimeout(tilt.to); window.removeEventListener('deviceorientation', onTilt);
      tiltBtn.setAttribute('aria-pressed', 'false'); vel = 0; target = Math.round(pos); storyT = 0;
    }
    stopTilt = tiltStop;
    if (tiltBtn) tiltBtn.onclick = () => (tilt.on ? tiltStop() : tiltStart());
    document.addEventListener('visibilitychange', () => { if (document.hidden) tiltStop(); });

    // ---------- detail panel ----------
    function openDetail(i) { goTo(i); vel = 0; const s = S[i]; $('dK').textContent = s.k; $('dT').textContent = s.t; $('dD').textContent = s.d; cls('focus', true); $('drawer').setAttribute('aria-hidden', 'false'); $('drawer').inert = false; openTarget = 1; setTimeout(() => $('back').focus({ preventScroll: true }), 400); }
    function closeDetail() { if (!has('focus')) return; cls('focus', false); $('drawer').setAttribute('aria-hidden', 'true'); $('drawer').inert = true; openTarget = 0; }
    $('close').onclick = closeDetail; $('back').onclick = closeDetail;

    // ---------- pointer / drag ----------
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), rayDir = new THREE.Vector3();
    let downX = 0, downY = 0, lastX = 0, lastY = 0, lastT = 0, moved = 0, axis = null;
    let torchI = -1; const torchUV = new THREE.Vector2();
    const rel = (e) => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    const edgeA = (m, u) => { const q = m.material.uniforms; return (q.uFeL.value ? Math.min(1, u / EDGE) : 1) * (q.uFeR.value ? Math.min(1, (1 - u) / EDGE) : 1); };
    function pick(e, withUV) {
      const [x, y] = rel(e); ndc.set(x * 2 - 1, -y * 2 + 1); ray.setFromCamera(ndc, camera);
      if (U.uCyl.value > 0.5) {
        const th = ndc.x * U.uHalfH.value;
        rayDir.set(Math.sin(th), ndc.y * U.uTanV.value, -Math.cos(th)).normalize().transformDirection(camera.matrixWorld);
        ray.set(camera.position, rayDir);
      }
      // in a cross-fade seam take the photo that is more visible there
      const h = ray.intersectObjects(panels, false).find((hit) => !hit.uv || edgeA(hit.object, hit.uv.x) > 0.5);
      if (withUV) { torchI = h ? h.object.userData.i : -1; if (h && h.uv) torchUV.set(1 - h.uv.x, h.uv.y); }
      return h ? h.object.userData.i : -1;
    }
    canvas.addEventListener('pointerdown', (e) => {
      if (!inside || has('pov')) return;
      tapCancel = !!pan;
      endOverview(true);
      clearTimeout(holdTimer); held = false;
      if (!is360) holdTimer = setTimeout(() => { if (moved < 6 && axis !== 'x') { held = true; paused = true; cls('paused', true); } }, 260);
      dragging = true; axis = null; moved = 0; downX = lastX = e.clientX; downY = lastY = e.clientY; lastT = performance.now();
      if (!is360) target = null; canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      const [rx, ry] = rel(e); mx = rx - 0.5; my = ry - 0.5;
      if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY, far = Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 8;
        if (far) clearTimeout(holdTimer);
        if (axis === null && far) axis = Math.abs(e.clientX - downX) > Math.abs(e.clientY - downY) ? 'x' : 'y';
        if (is360) { if (axis === 'x' || (axis === 'y' && e.pointerType !== 'touch')) { tLon -= dx * 0.15; tLat = Math.max(-80, Math.min(80, tLat + dy * 0.12)); canvas.classList.add('drag'); } moved += Math.abs(dx); }
        else if (axis === 'x') {
          canvas.classList.add('drag'); cur.classList.add('drag'); cls('dragged', true);
          const k = 1 / (sw * 0.3); pos -= dx * k; const now = performance.now(), dt = Math.max(1, now - lastT);
          vel = -dx * k / (dt / 1000) * 0.9; lastT = now; moved += Math.abs(dx);
        }
        lastX = e.clientX; lastY = e.clientY;
      } else if (inside && fine && !is360) { hoverI = pick(e, true); }
    });
    const settle = () => { if (!tilt.on) target = Math.round(pos); };
    let tapCancel = false;   // a tap that stops the opening pan only stops it (no detail panel)
    function up(e) {
      clearTimeout(holdTimer); if (!dragging) return; dragging = false; canvas.classList.remove('drag'); cur.classList.remove('drag');
      if (is360) return;
      if (held) { held = false; paused = false; cls('paused', false); settle(); return; }
      if (tapCancel) { tapCancel = false; if (moved < 6) { settle(); return; } }
      if (moved < 6 && axis !== 'y') {
        const i = pick(e, true), c = wrap(Math.round(pos)), x = rel(e)[0];
        if (i >= 0 && checkElephant(i, torchUV.x, torchUV.y)) { settle(); return; }
        if (has('focus')) { closeDetail(); settle(); return; }
        if (i >= 0) { if (i === c) openDetail(i); else goTo(i); }
        else if (x < 0.2) goTo(wrap(c - 1)); else if (x > 0.8) goTo(wrap(c + 1)); else settle();
      } else if (moved > 6) { closeDetail(); storyT = 0; }
      else settle();
    }
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', () => { torchI = -1; hoverI = -1; });
    canvas.addEventListener('wheel', (e) => {
      if (!inside || is360) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) { e.preventDefault(); endOverview(true); pos += (e.deltaX || e.deltaY) * 0.0022; vel = 0; target = null; cls('dragged', true); }
    }, { passive: false });

    // custom cursor (fine pointers only)
    const cur = $('cursor'); let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    if (fine) root.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.toggle('on', e.target === canvas && inside && !is360 && !has('pov')); });
    root.addEventListener('pointerleave', () => cur.classList.remove('on'));

    /* ---------- loop ---------- */
    let fpsN = 0, fpsT = 0, prevT = performance.now() / 1000, elapsed = 0;
    const flashEl = $('flash');
    const start = new THREE.Vector3(0, R * 0.7, R * 2.6), lookStart = new THREE.Vector3(0, -1.5, 0), lookIn = new THREE.Vector3(0, 0, -10);
    const look = new THREE.Vector3(), pinC = new THREE.Vector3(), pinV = new THREE.Vector3(), camDir = new THREE.Vector3(), toPin = new THREE.Vector3();
    const pinEls = [...pinsEl.children];
    const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    camera.position.copy(start); camera.lookAt(lookStart);

    function tick() {
      requestAnimationFrame(tick);
      const nowS = performance.now() / 1000; const rawDt = nowS - prevT; prevT = nowS;
      if (!visible || document.hidden) return;
      const dt = Math.min(rawDt, 0.05); elapsed += dt; const t = elapsed; U.uTime.value = t;

      // FPS guard: drop pixel ratio when slow; on phones also switch off the RGB split below 50 fps (d2f7515)
      if (inside) {
        fpsN++; fpsT += dt;
        if (fpsT > 2.5) {
          const fps = fpsN / fpsT;
          if (dprCap > 1 && fps < 38) { dprCap = 1; renderer.setPixelRatio(1); size(); cls('lite', true); }
          if (isMobile && fps < 50 && U.uRgb.value > 0) U.uRgb.value = 0;
          fpsN = 0; fpsT = 0;
        }
      }

      // portal: dive into the photo, swap, come out of the next one
      if (portal) {
        portal.t = Math.min(1, portal.t + dt / 1.15); const pt = portal.t;
        portalAmt = pt < 0.45 ? Math.pow(pt / 0.45, 2.2) : 1 - (1 - Math.pow(1 - (pt - 0.45) / 0.55, 3));
        if (!portal.sw && pt >= 0.45) { const c = wrap(Math.round(pos)); const d = ((portal.to - c) % N + N + N / 2) % N - N / 2; pos = Math.round(pos) + d; target = pos; vel = 0; portal.sw = true; U.uRZ.value = 1; }
        flashEl.style.opacity = Math.max(0, 1 - Math.abs(pt - 0.45) / 0.12).toFixed(3);
        if (pt >= 1) { portal = null; portalAmt = 0; flashEl.style.opacity = 0; }
      }

      // physics
      let drove = false;
      if (tilt.on) { const kk = 1 - Math.exp(-dt * 10); tilt.f += (tilt.raw - tilt.f) * kk; tilt.pf += (tilt.pr - tilt.pf) * kk; }
      tilt.y += ((tilt.on ? Math.max(-1, Math.min(1, tilt.pf / 25)) : 0) - tilt.y) * Math.min(1, dt * 6);
      if (flying) { const e = flyT < 0.5 ? 4 * flyT ** 3 : 1 - Math.pow(-2 * flyT + 2, 3) / 2; const np = p0 + (flyEnd - p0) * e; vel = (np - pos) / Math.max(dt, 0.001); pos = np; if (flyT >= 1) { pos = flyEnd; vel = 0; target = flyEnd; } }
      else if (pan) {
        pan.t = Math.min(1, pan.t + dt / 4.5); const q = pan.t, e = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
        const np = pan.from + (pan.to - pan.from) * e; vel = (np - pos) / Math.max(dt, 0.001); pos = np; setZone(zoneOf[wrap(Math.round(pos))]);
      }
      else if (tilt.on && !is360 && target === null && !has('focus') && !portal) {
        const ext = pos - tilt.lastPos; if (ext !== 0) tilt.base += ext;   // a drag, wheel or jump moves the base, so it adds to the tilt
        const np = tilt.base + tilt.f / 30; if (!dragging) vel = Math.max(-6, Math.min(6, (np - pos) / Math.max(dt, 0.001)));
        pos = np; tilt.lastPos = pos; drove = true;
      }
      else if (!dragging || is360) {
        if (tilt.on && target !== null && pos === target) target = null;
        if (target !== null) { const d = target - pos; vel += (d * 38 - vel * 11) * dt; if (Math.abs(d) < 0.0005 && Math.abs(vel) < 0.01) { pos = target; vel = 0; } }
        else { pos += vel * dt; vel *= Math.exp(-dt * 3.2); if (Math.abs(vel) < 0.6) target = Math.round(pos); }
        if (target !== null) pos += vel * dt;
      }
      if (tilt.on && !drove) { tilt.base = pos - tilt.f / 30; tilt.lastPos = pos; }
      if (pan && pan.t >= 1) { pan = null; overview = false; cls('overview', false); overviewT = 0; storyT = 0; vel = 0; target = Math.round(pos); current = -1; startPortal(0); }
      if (!inside && !flying) { pos = 0.5 + Math.sin(t * 0.15) * 0.25; vel = 0; }
      smoothVel += ((reduce ? 0 : Math.max(-1, Math.min(1, vel * 0.32))) - smoothVel) * Math.min(1, dt * 8);
      U.uVel.value = reduce ? 0 : Math.max(smoothVel, portalAmt * 0.6);
      room.rotation.y = Math.PI + pos * STEP;
      applyPalette(((pos % N) + N) % N);
      const still = !dragging && !flying && inside && Math.abs(vel) < 0.05;
      // reverse zoom: zoomed into the detail while travelling, pulls back to the full photo once settled
      const rzT = reduce ? 0 : ((flying || portal || (inside && !pan && Math.abs(vel) > 0.25) || dragging) ? 1 : 0);
      U.uRZ.value += (rzT - U.uRZ.value) * Math.min(1, dt * (rzT > U.uRZ.value ? 3 : 1));
      U.uDwell.value = Math.max(0, Math.min(1, U.uDwell.value + ((still && U.uRZ.value < 0.1) ? dt / 4 : -dt * 3)));
      // neon ignition when a space settles
      const cs = wrap(Math.round(pos));
      if (still && cs !== litIdx) { litIdx = cs; age[cs] = 0; buzz(8); }
      // story timer (runs while the window is on screen and nobody is interacting)
      if (overview && !pan && !flying && still && ratio > 0.5 && !has('focus')) { overviewT += dt; if (overviewT > overviewMax) endOverview(false); }
      if (overview && !pan && !flying && !sweepPlanned && !pano()) endOverview(false);
      const storyOn = inside && !overview && !is360 && !has('focus') && !has('pov') && !paused && !portal && !dragging && !tilt.on && ratio > 0.5;
      if (storyOn && still) storyT += dt;
      if (storyOn && storyT >= storyDur(cs)) { storyT = 0; advance(1); }
      const sp = Math.min(1, storyT / storyDur(cs));
      for (let i = 0; i < N; i++) storyBars[i].style.transform = 'scaleX(' + (i < cs ? 1 : i === cs ? sp : 0).toFixed(3) + ')';
      if (!overview) { const z = zoneOf[cs]; if (z >= 0 && thumbBars[z]) { const L = ZONES[z].spaces; thumbBars[z].style.transform = 'scaleX(' + ((L.indexOf(S[cs].id) + sp) / L.length).toFixed(3) + ')'; } }
      // POV auto-advance
      if (povActive() && !portal && performance.now() - povAt > 4300) povNext();
      // living photos: real footage takes over the settled space after the pull-back.
      // Only mixed in once the clip has frames, so a missing clip can never fade a photo to black.
      for (let i = 0; i < N; i++) {
        const v = vids[i]; if (!v) continue; const u = panels[i].material.uniforms;
        { let dd = Math.abs(i - cs); dd = Math.min(dd, N - dd); if (dd <= 1 && !v._src && inside) { v._src = 1; v.src = CLIPS[S[i].id].src; v.preload = 'auto'; v.load(); } }
        const want = i === cs && still && !overview && !is360 && U.uRZ.value < 0.2 && !portal && !flying && age[i] > 1.4 && !v._done && !v._err;
        if (want && v.paused && v._src) { v.currentTime = 0; v.play().catch(() => { v._err = true; }); v._start = t; }
        if (want && v._start != null && t - v._start > Math.max(5.5, (v.duration || 3) * 2)) v._done = true;
        if (i !== cs) { if (!v.paused) v.pause(); v._done = false; v._start = null; }
        const ready = v.readyState >= 2 && !v.paused && !v._err;
        const tm = want && ready ? 1 : 0; u.uVidMix.value += (tm - u.uVidMix.value) * Math.min(1, dt * (tm ? 2.2 : 1.6));
        if (i === cs) { const on = u.uVidMix.value > 0.5; if (on !== has('vid')) { cls('vid', on); if (on) $('capLive').textContent = 'Real footage · ' + CLIPS[S[i].id].tag; } }
        if (!want && !v.paused && u.uVidMix.value < 0.01) v.pause();
      }
      if (!vids[cs] && has('vid')) cls('vid', false);
      for (let i = 0; i < N; i++) age[i] += dt;

      const ci = wrap(Math.round(pos));
      if (ci !== current && inside && !flying && !overview) { current = ci; setCaption(ci, current === -1); sweep[ci] = 0; }
      for (let i = 0; i < N; i++) {
        let dd = Math.abs(((pos - i) % N + N) % N); dd = Math.min(dd, N - dd);
        const fv = inside && !overview ? Math.max(0, 1 - dd * 0.9) : 0.6;
        focusVals[i] += (fv - focusVals[i]) * Math.min(1, dt * 6);
        sweep[i] = Math.min(2, sweep[i] + dt * 0.9);
        let nv = 0.12 * focusVals[i];
        if (i === litIdx) { const a = age[i]; nv = a < 1.1 && !reduce ? (a < 0.9 ? (Math.sin(a * 37) * Math.sin(a * 91) > 0.05 ? 1 : 0.12) * Math.min(1, a * 2.2 + 0.25) : 1) : (0.82 + 0.18 * Math.sin(t * 2.3 + i)); }
        const u = panels[i].material.uniforms, tz = u.uTorch.value, on = (fine && i === torchI && !dragging) ? 1 : 0;
        if (on) { tz.x += (torchUV.x - tz.x) * Math.min(1, dt * 10); tz.y += (torchUV.y - tz.y) * Math.min(1, dt * 10); }
        tz.z += (on - tz.z) * Math.min(1, dt * 5);
        u.uNeon.value = nv; u.uFocus.value = focusVals[i]; u.uSweep.value = reduce ? 2 : sweep[i];
        u.uHover.value += ((i === hoverI ? 1 : 0) - u.uHover.value) * Math.min(1, dt * 8); u.uOpen.value = openAmt;
      }

      // camera
      openAmt += (openTarget - openAmt) * Math.min(1, dt * (reduce ? 60 : 3.5));
      U.uNight.value += (nightT - U.uNight.value) * Math.min(1, dt * (reduce ? 60 : 1.6));
      cmx += (mx - cmx) * Math.min(1, dt * 3); cmy += (my - cmy) * Math.min(1, dt * 3);
      if (flying) { flyT = Math.min(1, flyT + dt / 2.2); if (flyT >= 1) { flying = false; inside = true; pos = flyEnd; target = flyEnd; vel = 0; if (sweepPlanned) { sweepPlanned = false; if (pano()) startCollage(); else beginSweep(); } } }
      const cylT = pano() && inside && !flying && !portal && !is360 ? 1 : 0;
      U.uCyl.value += (cylT - U.uCyl.value) * Math.min(1, dt * (reduce ? 60 : 2.5));
      const zIn = (fit.d - R) * (1 - U.uCyl.value);
      if (is360) {
        lon += (tLon - lon) * Math.min(1, dt * 6); lat += (tLat - lat) * Math.min(1, dt * 6);
        const ph = (90 - lat) * Math.PI / 180, th = lon * Math.PI / 180;
        camera.position.set(0, 0, 0); look.set(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th));
        camera.fov = camera.aspect < 1 ? 80 : 70;
      } else if (flying || !inside) {
        const e = expoOut(flyT);
        camera.position.set(0, start.y * (1 - e) + Math.sin(e * Math.PI) * 1.0, start.z + (zIn - start.z) * e);
        look.lerpVectors(lookStart, lookIn, e);
        camera.fov = 40 + (fit.fov - 40) * e;
        if (!flying && !inside) { camera.position.x = Math.sin(t * 0.2) * 1.5 + cmx * 3; camera.position.y = start.y + cmy * -2; }
      } else {
        const wide = camera.aspect > 1.3;
        const fwd = -openAmt * Math.min(2.6, fit.d * 0.35) - (reduce ? 0 : U.uDwell.value * (1 - openAmt) * 0.5) - portalAmt * Math.max(0, fit.d - 1.2);
        const par = 1 - U.uCyl.value * 0.8;
        // tilt pitch: perspective looks up/down a little; the panorama slides the whole view (the cylinder must stay upright)
        const yS = U.uCyl.value * tilt.y * Math.max(0, H / 2 - U.uTanV.value * R) * 0.9;
        camera.position.set((cmx * 0.45 * (fine ? 1 : 0)) * par + (wide ? openAmt * 1.1 : 0), -cmy * 0.3 * par + yS, zIn + fwd);
        look.set(cmx * 2.4 * par + (wide ? openAmt * 3.4 : 0), -cmy * 1.2 * par + (wide ? 0 : -openAmt * 0.9) + (1 - U.uCyl.value) * tilt.y * 1.2 + yS, -10);
        camera.fov = fit.fov - openAmt * 4 - portalAmt * 10;
      }
      camera.lookAt(look); camera.updateProjectionMatrix();
      motes.rotation.y += dt * 0.02;

      // pins follow their photo; they fade out near the window edges and while a panel, POV or 360 view is open
      room.updateMatrixWorld(true); camera.updateMatrixWorld(); camera.getWorldDirection(camDir);
      const showPins = inside && !flying && !is360 && !has('focus') && !has('pov') && !portal;
      for (let k = 0; k < pinEls.length; k++) {
        const el = pinEls[k], th = -anchor[k] * STEP;
        pinV.set(Math.sin(th) * R * 0.98, H * (ZONES[k].py ?? 0.07), Math.cos(th) * R * 0.98).applyMatrix4(room.matrixWorld);
        const front = toPin.subVectors(pinV, camera.position).dot(camDir) > 0;
        pinC.copy(pinV).applyMatrix4(camera.matrixWorldInverse);
        pinV.project(camera);
        if (U.uCyl.value > 0.001) {
          const k = U.uCyl.value, dd2 = Math.max(Math.hypot(pinC.x, pinC.z), 1e-4);
          pinV.x += (Math.atan2(pinC.x, -pinC.z) / U.uHalfH.value - pinV.x) * k; pinV.y += (pinC.y / dd2 / U.uTanV.value - pinV.y) * k;
        }
        const ax = Math.abs(pinV.x), op = showPins && front && ax < 0.96 && Math.abs(pinV.y) < 0.85 ? Math.min(1, (0.96 - ax) / 0.12) : 0;
        el.style.opacity = op.toFixed(2); el.style.pointerEvents = op > 0.4 ? 'auto' : 'none'; el.tabIndex = op > 0.4 ? 0 : -1;
        if (op > 0) {
          let px = (pinV.x * 0.5 + 0.5) * sw;
          if (sw < 900 && U.uCyl.value > 0.5) {   // narrow panorama (phone sideways): a label that would run off the right edge sits left of its dot
            const w = pinW[k] || (pinW[k] = el.offsetWidth), d = pinD[k] || (pinD[k] = el.firstChild.offsetWidth), over = px - d / 2 + w - (sw - 8);
            if (over > 0) el._f = 1; else if (over < -28) el._f = 0;
            el.classList.toggle('is-flip', !!el._f); if (el._f) px -= w - d;
          } else if (el._f) { el._f = 0; el.classList.remove('is-flip'); }
          el.style.transform = `translate3d(${px.toFixed(1)}px,${((-pinV.y * 0.5 + 0.5) * shh).toFixed(1)}px,0)`;
        }
      }

      // custom cursor
      if (fine) {
        cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
        cur.classList.toggle('big', inside && hoverI >= 0 && !dragging);
        const lab = dragging ? '' : (hoverI >= 0 ? (hoverI === ci ? 'Open' : 'Go') : (inside ? 'Drag' : ''));
        if (cur.textContent !== lab) cur.textContent = lab;
      }

      renderer.render(scene, camera);
    }
    tick();
    // safety: if textures never load, still reveal
    setTimeout(finishLoad, 6000);
  }
}
