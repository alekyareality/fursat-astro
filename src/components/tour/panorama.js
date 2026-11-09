// "Step inside Fursat" panorama (approved 12-space prototype, 9 Nov 2026), ported to a home-page section.
// Everything is scoped to the section root: no page-wide scroll, key or click capture.
// Root state classes: is-inside, is-focus, is-pov, is-end, is-paused, is-vid, is-nogl, is-lite, is-360.
import { SPACES as S, IMGS, smallImg, EMI, CLIPS, HOT, PAL, POV, MUSIC } from './spaces.js';

export function initTour(root) {
  if (!root || root.dataset.pvInit) return;
  root.dataset.pvInit = '1';
  root.classList.remove('pv-nojs');

  const N = S.length, STEP = Math.PI * 2 / N;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (id) => document.getElementById('pv-' + id);
  const has = (c) => root.classList.contains('is-' + c);
  const cls = (c, on) => root.classList.toggle('is-' + c, on);
  const stage = $('stage'), canvas = $('gl');
  let PANOS = [];
  try { PANOS = JSON.parse(($('panos') || {}).textContent || '[]'); } catch (e) {}

  /* ---------- static UI (works without WebGL) ---------- */
  const rail = $('rail'), pill = $('pill');
  S.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pv-chip'; b.setAttribute('role', 'tab');
    b.textContent = s.t.replace(/^The /, ''); b.dataset.i = i; rail.appendChild(b);
  });
  const chips = [...rail.querySelectorAll('.pv-chip')];
  const ticks = $('ticks');
  for (let i = 0; i < N; i++) {
    const a = i * STEP, l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', 37 + Math.sin(a) * 29); l.setAttribute('y1', 37 - Math.cos(a) * 29);
    l.setAttribute('x2', 37 + Math.sin(a) * 33); l.setAttribute('y2', 37 - Math.cos(a) * 33);
    l.setAttribute('stroke', '#d9ae6f'); l.setAttribute('stroke-width', '1.5'); ticks.appendChild(l);
  }

  // split title into characters for the reveal
  root.querySelectorAll('.pv-title .pv-line').forEach((line) => {
    const walk = (n) => {
      [...n.childNodes].forEach((c) => {
        if (c.nodeName === 'EM') return;
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...c.textContent].forEach((ch) => {
            const s = document.createElement('span'); s.className = 'pv-ch';
            s.textContent = ch === ' ' ? ' ' : ch; frag.appendChild(s);
          });
          c.replaceWith(frag);
        } else walk(c);
      });
    };
    walk(line);
  });
  let titleShown = false;
  function revealTitle() {
    if (titleShown) return; titleShown = true;
    root.querySelectorAll('.pv-title .pv-ch, .pv-title em').forEach((c, i) => {
      c.animate([{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'none', opacity: 1 }],
        { duration: reduce ? 1 : 1100, delay: reduce ? 0 : 200 + i * 45, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' });
    });
  }

  let current = 0;
  function setCaption(i, instant) {
    const s = S[i]; $('capK').textContent = s.k; $('capD').textContent = s.d;
    const t = $('capT');
    if (instant || reduce) { t.textContent = s.t; }
    else {
      t.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-105%)', opacity: 0 }], { duration: 220, easing: 'cubic-bezier(0.7,0,0.84,0)' }).onfinish = () => {
        t.textContent = s.t;
        t.animate([{ transform: 'translateY(105%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 700, easing: 'cubic-bezier(0.16,1,0.3,1)' });
      };
      $('capD').animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 120, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'backwards' });
    }
    chips.forEach((c, j) => c.setAttribute('aria-selected', j === i ? 'true' : 'false'));
    const c = chips[i]; pill.style.width = c.offsetWidth + 'px'; pill.style.transform = `translateX(${c.offsetLeft - 6}px)`;
    rail.scrollTo({ left: c.offsetLeft - rail.clientWidth / 2 + c.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    $('bgword').innerHTML = Array(6).fill(`${s.t} <b>·</b> `).join('');
  }
  setCaption(0, true);

  /* ---------- loader / fallback ---------- */
  const lp = $('lp'); let loaded = 0, shown = false;
  function progress() { loaded++; lp.style.transition = 'stroke-dashoffset .6s cubic-bezier(0.16,1,0.3,1)'; lp.style.strokeDashoffset = 339.3 * (1 - Math.min(1, loaded / 4)); }
  function finishLoad() { if (shown) return; shown = true; setTimeout(() => { $('loader').classList.add('done'); revealTitle(); maybeAutoEnter(); }, 350); }
  function fallback() { cls('nogl', true); $('loader').classList.add('done'); revealTitle(); }

  /* ---------- background music (off by default; browsers block autoplay with sound) ---------- */
  const sound = (() => {
    const btn = $('sound'); let on = false, ctx = null, gain = null, src = null, buf = null, loading = null, el = null;
    const label = () => { if (!btn) return; btn.setAttribute('aria-pressed', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? 'Sound off' : 'Sound on'); btn.querySelector('span').textContent = on ? 'Sound on' : 'Sound'; };
    const load = () => loading || (loading = fetch(MUSIC).then((r) => { if (!r.ok) throw new Error('music ' + r.status); return r.arrayBuffer(); }).then((a) => new Promise((res, rej) => ctx.decodeAudioData(a, res, rej))).then((b) => { buf = b; return b; }));
    function fade(to, sec) { const t = ctx.currentTime; gain.gain.cancelScheduledValues(t); gain.gain.setValueAtTime(gain.gain.value, t); gain.gain.linearRampToValueAtTime(to, t + sec); }
    async function start() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { el = el || Object.assign(new Audio(MUSIC), { loop: true, volume: 0.5 }); el.play().catch(() => { on = false; label(); }); return; }
      if (!ctx) { ctx = new AC(); gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination); }
      if (ctx.state === 'suspended') await ctx.resume();
      await load();
      if (!on) return;
      if (!src) { src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(gain); src.start(); }
      fade(0.55, 1.2);
    }
    function stop() {
      if (el) { el.pause(); return; }
      if (!ctx) return; fade(0, 0.6);
      setTimeout(() => { if (!on && ctx.state === 'running') ctx.suspend(); }, 650);
    }
    function sync() {
      const want = on && ratio > 0.15 && !document.hidden;
      if (el) { if (want) el.play().catch(() => {}); else el.pause(); return; }
      if (!ctx || !src) return;
      if (want) { ctx.resume().then(() => fade(0.55, 0.8)); } else { fade(0, 0.3); setTimeout(() => { if (!(on && ratio > 0.15 && !document.hidden) && ctx.state === 'running') ctx.suspend(); }, 350); }
    }
    if (btn) btn.addEventListener('click', () => {
      on = !on; label();
      if (on) start().catch(() => { on = false; label(); }); else stop();
    });
    document.addEventListener('visibilitychange', sync);
    return { sync };
  })();

  // section visibility drives: lazy start, render pause, auto step-inside
  let visible = false, ratio = 0, started = false, autoTimer = 0, enterFn = null;
  function maybeAutoEnter() {
    clearTimeout(autoTimer);
    if (!shown || !enterFn || has('inside') || ratio < 0.8) return;
    autoTimer = setTimeout(() => { if (ratio >= 0.8 && enterFn) enterFn(); }, reduce ? 300 : 1500);
  }
  new IntersectionObserver((es) => {
    const e = es[es.length - 1]; visible = e.isIntersecting; ratio = e.intersectionRatio;
    if (!visible && pauseVids) pauseVids();
    sound.sync();
    maybeAutoEnter();
  }, { threshold: [0, 0.2, 0.5, 0.8, 1] }).observe(root);
  new IntersectionObserver((es) => {
    if (started || !es[es.length - 1].isIntersecting) return;
    started = true;
    import('./three-lite.js').then((T) => init(T)).catch(fallback);
  }, { rootMargin: '900px 0px' }).observe(root);
  let pauseVids = null;

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
    const H = 8, W = H * 0.75, R = N * W * 1.1 / (Math.PI * 2), ARC = W / R; // panel arc matches the 3:4 photo
    const room = new THREE.Group(); scene.add(room);

    const U = { uTime: { value: 0 }, uVel: { value: 0 }, uDwell: { value: 0 }, uRZ: { value: 1 }, uNight: { value: 0 }, uRgb: { value: 1 } };
    const blackTex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1); blackTex.needsUpdate = true;
    const TH = { uTint: { value: new THREE.Vector3() }, uBack: { value: new THREE.Vector3() }, uFloorA: { value: new THREE.Vector3() }, uFloorB: { value: new THREE.Vector3() }, uGold: { value: new THREE.Vector3() } };
    let lastCss = '';
    const mixPal = (a, b, k, key) => { const A = PAL[S[a].id][key], B = PAL[S[b].id][key]; return [A[0] + (B[0] - A[0]) * k, A[1] + (B[1] - A[1]) * k, A[2] + (B[2] - A[2]) * k]; };
    const css3 = (v) => `rgb(${Math.round(v[0] * 255)},${Math.round(v[1] * 255)},${Math.round(v[2] * 255)})`;
    const cssA = (v, a) => `rgba(${Math.round(v[0] * 255)},${Math.round(v[1] * 255)},${Math.round(v[2] * 255)},${a})`;
    function applyPalette(p) {
      const i0 = ((Math.floor(p) % N) + N) % N, i1 = (i0 + 1) % N; let k = p - Math.floor(p); k = k * k * (3 - 2 * k);
      const g = mixPal(i0, i1, k, 'gold');
      TH.uGold.value.set(...g); TH.uTint.value.set(...mixPal(i0, i1, k, 'tint'));
      TH.uFloorA.value.set(...mixPal(i0, i1, k, 'fa')); TH.uFloorB.value.set(...mixPal(i0, i1, k, 'fb')); TH.uBack.value.set(...mixPal(i0, i1, k, 'back'));
      const b1 = mixPal(i0, i1, k, 'bg1'), b2 = mixPal(i0, i1, k, 'bg2'), gB = mixPal(i0, i1, k, 'glowB'), gT = mixPal(i0, i1, k, 'glowT');
      const key = [b1, gB, gT].flat().map((x) => Math.round(x * 120)).join(',');
      if (key !== lastCss) {
        lastCss = key; const st = root.style;
        st.setProperty('--bg1', css3(b1)); st.setProperty('--bg2', css3(b2)); st.setProperty('--glowB', css3(gB)); st.setProperty('--glowT', css3(gT));
        st.setProperty('--aura1', cssA(gB, 0.42)); st.setProperty('--aura2', cssA(g, 0.14)); st.setProperty('--ink', css3(b2));
        st.setProperty('--panel', cssA(b2, 0.8)); st.setProperty('--drawerA', cssA(b1, 0.97)); st.setProperty('--drawerB', cssA(b2, 0.99)); st.setProperty('--wordc', cssA(g, 0.10));
      }
    }
    applyPalette(0);

    const vert = 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
    const frag = `
uniform sampler2D uTex;uniform float uTime,uVel,uFocus,uSweep,uReflect,uHover,uOpen,uRgb;uniform vec3 uTint,uBack,uGold;uniform vec2 uFP;uniform float uDwell,uRZ,uNeon,uNight;uniform vec3 uTorch,uRing;uniform sampler2D uEmi,uVid;uniform float uVidMix;varying vec2 vUv;
float luma(vec3 c){return dot(c,vec3(.299,.587,.114));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=vec2(1.-vUv.x,vUv.y);
  float f=uFocus;
  float breathe=.5+.5*sin(uTime*.22);
  float rz=uRZ*uRZ*(3.-2.*uRZ);
  float kb=1.+f*(.62*rz+.03*breathe+.07*uDwell+.26*uOpen);
  vec2 p=uFP+(uv-uFP)/kb+vec2(sin(uTime*.11),cos(uTime*.09))*.006*f*(1.-uOpen);
  float v=uVel;
  p.y+=sin(p.x*16.+uTime*6.)*.009*abs(v);
  p.x+=sin(p.y*3.14159)*.045*v;
  vec2 off=vec2(.018*v,.004*v)*uRgb;
  vec3 col=vec3(texture2D(uTex,p+off).r,texture2D(uTex,p).g,texture2D(uTex,p-off).b);
  if(uVidMix>.001){vec3 vc=texture2D(uVid,p).rgb;col=mix(col,vc,uVidMix);}
  vec3 full=col;
  vec3 tint=vec3(luma(col))*uTint;
  col=mix(tint*.62,col,.3+.7*f);
  float td=length((uv-uTorch.xy)*vec2(.75,1.));
  float torch=smoothstep(.26,.0,td)*uTorch.z;
  col=mix(col,full*1.1+vec3(.05,.03,.0),torch*(1.-.75*f));
  float spot=.28+.95*smoothstep(.62,.0,length((uv-uFP)*vec2(.75,1.)));
  vec3 night=col*col*1.25*vec3(1.,.82,.62)*spot;
  col=mix(col,night,uNight*.85);
  col=pow(col,vec3(.95))*(1.04+.14*uHover);
  vec3 em=texture2D(uEmi,p).rgb;
  col+=em*uNeon*(1.05+.85*uNight)*(1.-uVidMix);
  float ra=uTime-uRing.z;
  if(ra>0.&&ra<1.6){float rr=length((uv-uRing.xy)*vec2(.75,1.));float ring=smoothstep(.014,0.,abs(rr-ra*.32))*(1.-ra/1.6);col+=uGold*ring*1.8+uGold*smoothstep(.06,0.,rr)*(1.-ra/1.6)*.6;}
  float s=uv.x*.75+uv.y*.45;
  float band=smoothstep(.1,0.,abs(s-(uSweep*1.9-.45)));
  col+=vec3(1.,.82,.58)*band*.42*f;
  vec2 q=(uv-.5)*vec2(.75,1.);
  vec2 h=vec2(.375,.5);float r=.03;
  float d=length(max(abs(q)-h+r,0.))-r;
  float alpha=1.-smoothstep(-.002,.002,d);
  float rim=smoothstep(.014,0.,abs(d+.008));
  float run=.5+.5*sin(atan(q.y,q.x)*2.-uTime*1.6);
  col+=uGold*rim*(.25+.9*f*(.4+.6*run));
  col*=mix(.7,1.,smoothstep(.8,.25,length(uv-.5)));
  col+=(hash(uv*900.+uTime)-.5)*.035;
  if(uReflect>.5){
    float fade=smoothstep(.6,0.,vUv.y);
    col*=.5+.25*uNight;alpha*=fade*(.42+.18*uNight);
  }else if(gl_FrontFacing){
    col=uBack+uGold*.9*rim*1.2;
  }
  if(alpha<.01)discard;
  gl_FragColor=vec4(col,alpha);
}`;

    const loaderT = new THREE.TextureLoader();
    const panels = [], reflections = [], vids = [];
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const small = Math.min(innerWidth, innerHeight) < 720;
    function loadTex(i) {
      const src = small ? smallImg(IMGS[S[i].id]) : IMGS[S[i].id];
      loaderT.load(src, (tx) => {
        tx.anisotropy = maxAniso; tx.minFilter = THREE.LinearMipmapLinearFilter; tx.generateMipmaps = true;
        panels[i].material.uniforms.uTex.value = tx; reflections[i].material.uniforms.uTex.value = tx; progress();
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
      const geo = new THREE.CylinderGeometry(R, R, H, 64, 1, true, -i * STEP - ARC / 2, ARC);
      const mk = (refl) => new THREE.ShaderMaterial({
        uniforms: {
          uTex: { value: blackTex }, uEmi: { value: emi }, uVid: { value: vtex }, uVidMix: { value: 0 }, uRing: { value: new THREE.Vector3(0, 0, -9) },
          uNeon: { value: 0 }, uNight: U.uNight, uTorch: { value: new THREE.Vector3(0.5, 0.5, 0) }, uRZ: U.uRZ, uRgb: U.uRgb,
          uFP: { value: new THREE.Vector2(...PAL[s.id].fp) }, uDwell: U.uDwell, uTime: U.uTime, uVel: U.uVel,
          uTint: TH.uTint, uBack: TH.uBack, uGold: TH.uGold, uFocus: { value: 0 }, uSweep: { value: 2 }, uReflect: { value: refl }, uHover: { value: 0 }, uOpen: { value: 0 },
        },
        vertexShader: vert, fragmentShader: frag, transparent: true, side: THREE.DoubleSide, depthWrite: !refl,
      });
      const m = new THREE.Mesh(geo, mk(0)); m.userData.i = i; room.add(m); panels.push(m);
      const rm = new THREE.Mesh(geo, mk(1)); rm.scale.y = -1; rm.position.y = -H - 0.06; rm.renderOrder = -1; room.add(rm); reflections.push(rm);
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

    // glossy floor
    const floor = new THREE.Mesh(new THREE.CircleGeometry(R * 2.4, 128), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { uTime: U.uTime, uFloorA: TH.uFloorA, uFloorB: TH.uFloorB, uGold: TH.uGold },
      vertexShader: 'varying vec2 vP;void main(){vP=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: `uniform float uTime;uniform vec3 uFloorA,uFloorB,uGold;varying vec2 vP;void main(){float r=length(vP);
    float rings=smoothstep(.04,0.,abs(fract(r*.5-uTime*.04)-.5))*.05*smoothstep(${(R * 2.2).toFixed(1)},2.,r);
    float a=mix(.35,.97,smoothstep(1.,${(R * 2.2).toFixed(1)},r));
    vec3 c=mix(uFloorA,uFloorB,smoothstep(0.,${(R * 2).toFixed(1)},r))+uGold*.9*rings;
    gl_FragColor=vec4(c,a);}`,
    }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -H / 2 - 0.03; floor.renderOrder = 0; scene.add(floor);

    // shadow pools under each photo, with the space name written in light inside them
    const floorTxt = [], shadows = [];
    const shadowTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
      const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,.6)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
    })();
    function nameTex(s) {
      const c = document.createElement('canvas'); c.width = 1024; c.height = 300; const g = c.getContext('2d');
      const gr = g.createLinearGradient(160, 0, 864, 0); gr.addColorStop(0, '#e2694f'); gr.addColorStop(0.5, '#f3c58a'); gr.addColorStop(1, '#d9ae6f');
      g.fillStyle = gr; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = 'rgba(240,170,100,.55)'; g.shadowBlur = 26;
      g.font = "italic 400 128px 'Playfair Display', Georgia, serif"; g.fillText(s.t, 512, 120);
      g.shadowBlur = 0; g.fillStyle = 'rgba(236,222,200,.72)'; g.font = '500 30px Poppins, sans-serif';
      g.fillText(s.k.toUpperCase().split('').join(String.fromCharCode(8202)), 512, 236);
      g.fillStyle = 'rgba(217,174,111,.55)'; g.fillRect(392, 198, 240, 2);
      const tx = new THREE.CanvasTexture(c); tx.anisotropy = maxAniso; return tx;
    }
    function buildFloorWriting() {
      if (floorTxt.length) return;
      S.forEach((s, i) => {
        const th = -i * STEP;
        const sh = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.9, W * 1.1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.5 }));
        const gs = new THREE.Group(); gs.rotation.y = th + Math.PI; gs.position.set(Math.sin(th) * (R - 1.6), -H / 2 - 0.02, Math.cos(th) * (R - 1.6));
        sh.rotation.x = -Math.PI / 2; sh.renderOrder = 1; gs.add(sh); room.add(gs); shadows[i] = sh;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.25, W * 1.25 * 300 / 1024), new THREE.MeshBasicMaterial({ map: nameTex(s), transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending }));
        const g = new THREE.Group(); g.rotation.y = th + Math.PI; g.position.set(Math.sin(th) * (R - 2.1), -H / 2 - 0.01, Math.cos(th) * (R - 2.1));
        m.rotation.x = -Math.PI / 2; m.renderOrder = 2; g.add(m); room.add(g); floorTxt[i] = m;
      });
    }
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(buildFloorWriting, buildFloorWriting);

    // gold light rings top and bottom with travelling light
    const ringMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uGold: TH.uGold },
      vertexShader: vert,
      fragmentShader: 'uniform float uTime;uniform vec3 uGold;varying vec2 vUv;void main(){float g=.25+pow(.5+.5*sin(vUv.x*6.2832*3.-uTime*.9),10.)*1.6;gl_FragColor=vec4(uGold*g,1.);}',
    });
    [H / 2 + 0.55, -H / 2 - 0.02].forEach((y) => { const t = new THREE.Mesh(new THREE.TorusGeometry(R * 1.02, 0.025, 8, 256), ringMat); t.rotation.x = Math.PI / 2; t.position.y = y; room.add(t); });

    // gold motes
    const MC = lowEnd ? 120 : (fine ? 380 : 200), mp = new Float32Array(MC * 3), ms = new Float32Array(MC);
    for (let i = 0; i < MC; i++) { const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * R * 1.4; mp[i * 3] = Math.cos(a) * r; mp[i * 3 + 1] = (Math.random() - 0.5) * H * 1.6; mp[i * 3 + 2] = Math.sin(a) * r; ms[i] = Math.random(); }
    const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(mp, 3)); mg.setAttribute('aSeed', new THREE.BufferAttribute(ms, 1));
    const motes = new THREE.Points(mg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: U.uTime, uPR: { value: renderer.getPixelRatio() }, uVel: U.uVel },
      vertexShader: `uniform float uTime,uPR,uVel;attribute float aSeed;varying float vS;void main(){vS=aSeed;vec3 p=position;
    p.y=mod(p.y+uTime*(.15+aSeed*.35)+${(H * 0.8).toFixed(1)},${(H * 1.6).toFixed(1)})-${(H * 0.8).toFixed(1)};
    p.x+=sin(uTime*.4+aSeed*20.)*.35;p.z+=cos(uTime*.3+aSeed*13.)*.35;
    float ang=uVel*.25*(.5+aSeed);float c=cos(ang),s=sin(ang);p.xz=mat2(c,-s,s,c)*p.xz;
    vec4 mv=modelViewMatrix*vec4(p,1.);gl_PointSize=(1.5+aSeed*4.5)*uPR*(20./-mv.z);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform float uTime;varying float vS;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);a*=.35+.65*(.5+.5*sin(uTime*2.+vS*40.));
    vec3 c=mix(vec3(1.,.78,.45),vec3(.95,.42,.3),step(.82,vS));gl_FragColor=vec4(c*a,a);}`,
    }));
    scene.add(motes);

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
      room.visible = floor.visible = motes.visible = !is360; sphere.visible = is360;
      if (is360) { closeDetail(); storyT = 0; }
    }

    /* ---------- state ---------- */
    let pos = 0.5, vel = 0, target = null, dragging = false, inside = false, flyT = 0, flying = false, openAmt = 0, openTarget = 0, smoothVel = 0;
    let mx = 0, my = 0, cmx = 0, cmy = 0, hoverI = -1, litIdx = -1; const age = new Array(N).fill(99);
    const focusVals = new Array(N).fill(0), sweep = new Array(N).fill(2);
    const wrap = (i) => ((i % N) + N) % N;
    let sw = 1, shh = 1;

    function size() {
      sw = stage.clientWidth || innerWidth; shh = stage.clientHeight || innerHeight;
      renderer.setSize(sw, shh, false); camera.aspect = sw / shh; camera.updateProjectionMatrix();
    }
    function fovInside() { const a = camera.aspect; const hz = a < 1 ? 52 : 88; const v = 2 * Math.atan(Math.tan(hz * Math.PI / 360) / a) * 180 / Math.PI; return Math.min(92, Math.max(36, v)); }
    const narrow = () => sw < 720;
    const CAMBACK = () => R * (narrow() ? 0.2 : 0.3);
    new ResizeObserver(() => { size(); setCaption(current, true); }).observe(stage); size();

    function goTo(i) { target = Math.round(pos) + (((i - wrap(Math.round(pos))) % N + N + N / 2) % N - N / 2); }
    chips.forEach((c) => c.addEventListener('click', () => { toggle360(false); closeDetail(); goTo(+c.dataset.i); }));
    $('prev').onclick = () => { closeDetail(); advance(-1); };
    $('next').onclick = () => { closeDetail(); advance(1); };

    // ---------- story mode ----------
    let storyT = 0, paused = false, portal = null, portalAmt = 0, held = false, holdTimer = null;
    const storyEl = $('stories');
    S.forEach((s, i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Go to ' + s.t); b.innerHTML = '<i><b></b></i>'; b.onclick = () => { closeDetail(); jump(i); }; storyEl.appendChild(b); });
    const storyBars = [...storyEl.querySelectorAll('b')];
    const storyDur = (i) => (CLIPS[S[i].id] ? 10 : 7);
    function jump(i) { const c = wrap(Math.round(pos)); if (i === c) return; if (reduce) goTo(i); else startPortal(i); }
    function advance(d) { jump(wrap(Math.round(target ?? pos) + d)); }
    function startPortal(to) { if (portal || !inside) return; if (reduce) { goTo(to); storyT = 0; return; } portal = { t: 0, to, sw: false }; storyT = 0; }
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
          for (const m of [panels[i], reflections[i]]) m.material.uniforms.uRing.value.set(h.x, 1 - h.y, U.uTime.value);
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

    // ---------- POV walk-through ----------
    let povStep = -1, povAt = 0, povLock = 0;
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
      const st = POV[povStep]; const c = wrap(Math.round(pos)); if (st.i !== c) startPortal(st.i);
      setTimeout(() => { if (has('pov')) povShow(st.l); }, reduce ? 0 : (st.i !== c ? 900 : 200)); povAt = performance.now();
    }
    function povStart() { if (!inside) return; toggle360(false); closeDetail(); cls('pov', true); cls('end', false); povStep = -1; povLock = 0; povNext(); }
    function povEnd() { cls('pov', false); cls('end', false); $('povlayer').innerHTML = ''; storyT = 0; }
    $('povBtn').onclick = povStart; $('povExit').onclick = povEnd; $('endBack').onclick = povEnd;
    const povActive = () => has('pov') && !has('end');
    root.addEventListener('wheel', (e) => { if (povActive() && Math.abs(e.deltaY) > 14) { e.preventDefault(); povNext(); } }, { passive: false });
    root.addEventListener('touchend', (e) => { if (povActive() && !e.target.closest('button,a')) povNext(); }, { passive: true });
    root.addEventListener('click', (e) => { if (povActive() && !e.target.closest('button,a') && !('ontouchstart' in window)) povNext(); });
    root.addEventListener('keydown', (e) => {
      if (!inside) {
        if (e.key === 'Enter' && e.target === root) { e.preventDefault(); enter(); }
        return;
      }
      if (has('pov')) {
        if (e.key === 'Escape') povEnd();
        else if (['ArrowRight', 'ArrowDown', ' ', 'Enter'].includes(e.key) && !has('end')) { e.preventDefault(); povNext(); }
        return;
      }
      if (e.target.closest && e.target.closest('a,button') && (e.key === ' ' || e.key === 'Enter')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); $('next').click(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); $('prev').click(); }
      else if (e.key === ' ') { e.preventDefault(); paused = !paused; cls('paused', paused); }
      else if (e.key === 'Escape') { if (is360) toggle360(false); else closeDetail(); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
    });

    // ---------- step inside ----------
    const hr = new Date().getHours(); const evening = hr >= 18 || hr < 6;
    let p0 = 0;
    function enter() {
      if (inside || flying) return; clearTimeout(autoTimer);
      setTimeout(() => toast(evening ? 'It is evening, so the lights are down at Fursat. Tap or hold the sides to move.' : 'Tap the sides to move, hold to pause. Six elephants are hidden in here.', 4200), 2600);
      flying = true; flyT = reduce ? 1 : 0; p0 = pos; cls('inside', true); target = null; vel = 0; setCaption(0, true);
    }
    enterFn = enter;
    $('enterBtn').onclick = () => { enter(); root.focus({ preventScroll: true }); };
    let nightT = 0;
    function setLights(v) { nightT = v; const b = $('lights'); b.setAttribute('aria-pressed', v ? 'true' : 'false'); b.querySelector('span').textContent = v ? 'Lights up' : 'Lights down'; b.setAttribute('aria-label', v ? 'Lights up' : 'Lights down'); }
    if (evening) setLights(1);
    $('lights').onclick = () => setLights(nightT ? 0 : 1);
    if ($('b360')) $('b360').onclick = () => toggle360();
    // magnetic CTA
    if (fine) { const b = $('enterBtn'); b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`; }); b.addEventListener('pointerleave', () => { b.style.transform = ''; }); }

    // ---------- detail drawer ----------
    function openDetail(i) { goTo(i); vel = 0; const s = S[i]; $('dK').textContent = s.k; $('dT').textContent = s.t; $('dD').textContent = s.d; cls('focus', true); $('drawer').setAttribute('aria-hidden', 'false'); $('drawer').inert = false; openTarget = 1; setTimeout(() => $('back').focus({ preventScroll: true }), 400); }
    function closeDetail() { if (!has('focus')) return; cls('focus', false); $('drawer').setAttribute('aria-hidden', 'true'); $('drawer').inert = true; openTarget = 0; }
    $('close').onclick = closeDetail; $('back').onclick = closeDetail;

    // ---------- pointer / drag ----------
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let downX = 0, downY = 0, lastX = 0, lastY = 0, lastT = 0, moved = 0, axis = null;
    let torchI = -1; const torchUV = new THREE.Vector2();
    const rel = (e) => { const r = canvas.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
    function pick(e, withUV) {
      const [x, y] = rel(e); ndc.set(x * 2 - 1, -y * 2 + 1); ray.setFromCamera(ndc, camera);
      const h = ray.intersectObjects(panels, false)[0];
      if (withUV) { torchI = h ? h.object.userData.i : -1; if (h && h.uv) torchUV.set(1 - h.uv.x, h.uv.y); }
      return h ? h.object.userData.i : -1;
    }
    canvas.addEventListener('pointerdown', (e) => {
      if (!inside || has('pov')) return;
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
          canvas.classList.add('drag'); cur.classList.add('drag');
          const k = 1 / (sw * 0.38); pos -= dx * k; const now = performance.now(), dt = Math.max(1, now - lastT);
          vel = -dx * k / (dt / 1000) * 0.9; lastT = now; moved += Math.abs(dx);
        }
        lastX = e.clientX; lastY = e.clientY;
      } else if (inside && fine && !is360) { hoverI = pick(e, true); }
    });
    function up(e) {
      clearTimeout(holdTimer); if (!dragging) return; dragging = false; canvas.classList.remove('drag'); cur.classList.remove('drag');
      if (is360) return;
      if (held) { held = false; paused = false; cls('paused', false); target = Math.round(pos); return; }
      if (moved < 6 && axis !== 'y') {
        const i = pick(e, true), c = wrap(Math.round(pos)), x = rel(e)[0];
        if (i >= 0 && checkElephant(i, torchUV.x, torchUV.y)) { target = Math.round(pos); return; }
        if (has('focus')) { closeDetail(); target = Math.round(pos); return; }
        if (x < 0.22) { advance(-1); return; }
        if (x > 0.78) { advance(1); return; }
        if (i >= 0) { if (i === c) openDetail(i); else jump(i); } else target = Math.round(pos);
      } else if (moved > 6) { closeDetail(); storyT = 0; }
      else target = Math.round(pos);
    }
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', () => { torchI = -1; hoverI = -1; });
    canvas.addEventListener('wheel', (e) => {
      if (!inside || is360) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) { e.preventDefault(); pos += (e.deltaX || e.deltaY) * 0.0022; vel = 0; target = null; }
    }, { passive: false });

    // custom cursor (fine pointers only)
    const cur = $('cursor'); let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    if (fine) root.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cur.classList.toggle('on', e.target === canvas && !is360); });
    root.addEventListener('pointerleave', () => cur.classList.remove('on'));

    /* ---------- loop ---------- */
    let fpsN = 0, fpsT = 0, prevT = performance.now() / 1000, elapsed = 0;
    const flashEl = $('flash'), auraEl = root.querySelector('.pv-aura');
    const start = new THREE.Vector3(0, R * 0.62, R * 2.35), lookStart = new THREE.Vector3(0, -1.5, 0), lookIn = new THREE.Vector3(0, 0, -10);
    const look = new THREE.Vector3();
    const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    camera.position.copy(start); camera.lookAt(lookStart);
    let lastNight = -1;

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
      if (flying) { const e = flyT < 0.5 ? 4 * flyT ** 3 : 1 - Math.pow(-2 * flyT + 2, 3) / 2; const np = p0 + (-N - p0) * e; vel = (np - pos) / Math.max(dt, 0.001); pos = np; if (flyT >= 1) { pos = -N; vel = 0; target = -N; } }
      else if (!dragging || is360) {
        if (target !== null) { const d = target - pos; vel += (d * 38 - vel * 11) * dt; if (Math.abs(d) < 0.0005 && Math.abs(vel) < 0.01) { pos = target; vel = 0; } }
        else { pos += vel * dt; vel *= Math.exp(-dt * 3.2); if (Math.abs(vel) < 0.6) target = Math.round(pos); }
        if (target !== null) pos += vel * dt;
      }
      if (!inside && !flying) { pos = 0.5 + Math.sin(t * 0.15) * 0.25; vel = 0; }
      smoothVel += ((reduce ? 0 : Math.max(-1, Math.min(1, vel * 0.32))) - smoothVel) * Math.min(1, dt * 8);
      U.uVel.value = reduce ? 0 : Math.max(smoothVel, portalAmt * 0.6);
      room.rotation.y = Math.PI + pos * STEP;
      applyPalette(((pos % N) + N) % N);
      if (Math.abs(U.uNight.value - lastNight) > 0.01) { lastNight = U.uNight.value; if (auraEl) auraEl.style.opacity = 1 - U.uNight.value * 0.55; }
      const still = !dragging && !flying && inside && Math.abs(vel) < 0.05;
      // reverse zoom: zoomed into the detail while travelling, pulls back to the full photo once settled
      const rzT = reduce ? 0 : ((flying || portal || (inside && Math.abs(vel) > 0.25) || dragging) ? 1 : 0);
      U.uRZ.value += (rzT - U.uRZ.value) * Math.min(1, dt * (rzT > U.uRZ.value ? 3 : 1));
      U.uDwell.value = Math.max(0, Math.min(1, U.uDwell.value + ((still && U.uRZ.value < 0.1) ? dt / 4 : -dt * 3)));
      // neon ignition when a space settles
      const cs = wrap(Math.round(pos));
      if (still && cs !== litIdx) { litIdx = cs; age[cs] = 0; buzz(8); }
      // story timer
      const storyOn = inside && !is360 && !has('focus') && !has('pov') && !paused && !portal && !dragging;
      if (storyOn && still) storyT += dt;
      if (storyOn && storyT >= storyDur(cs)) { storyT = 0; advance(1); }
      for (let i = 0; i < N; i++) storyBars[i].style.transform = 'scaleX(' + (i < cs ? 1 : i === cs ? Math.min(1, storyT / storyDur(cs)) : 0).toFixed(3) + ')';
      // POV auto-advance
      if (povActive() && !portal && performance.now() - povAt > 4300) povNext();
      // living photos: real footage takes over the settled space after the pull-back.
      // Only mixed in once the clip has frames, so a missing clip can never fade a photo to black.
      for (let i = 0; i < N; i++) {
        const v = vids[i]; if (!v) continue; const u = panels[i].material.uniforms;
        { let dd = Math.abs(i - cs); dd = Math.min(dd, N - dd); if (dd <= 1 && !v._src && inside) { v._src = 1; v.src = CLIPS[S[i].id].src; v.preload = 'auto'; v.load(); } }
        const want = i === cs && still && !is360 && U.uRZ.value < 0.2 && !portal && !flying && age[i] > 1.4 && !v._done && !v._err;
        if (want && v.paused && v._src) { v.currentTime = 0; v.play().catch(() => { v._err = true; }); v._start = t; }
        if (want && v._start != null && t - v._start > Math.max(5.5, (v.duration || 3) * 2)) v._done = true;
        if (i !== cs) { if (!v.paused) v.pause(); v._done = false; v._start = null; }
        const ready = v.readyState >= 2 && !v.paused && !v._err;
        const tm = want && ready ? 1 : 0; u.uVidMix.value += (tm - u.uVidMix.value) * Math.min(1, dt * (tm ? 2.2 : 1.6));
        reflections[i].material.uniforms.uVidMix.value = u.uVidMix.value;
        if (i === cs) { const on = u.uVidMix.value > 0.5; if (on !== has('vid')) { cls('vid', on); if (on) $('capLive').textContent = 'Real footage · ' + CLIPS[S[i].id].tag; } }
        if (!want && !v.paused && u.uVidMix.value < 0.01) v.pause();
      }
      if (!vids[cs] && has('vid')) cls('vid', false);
      for (let i = 0; i < N; i++) age[i] += dt;

      const ci = wrap(Math.round(pos));
      if (ci !== current && inside) { current = ci; setCaption(ci); sweep[ci] = 0; }
      for (let i = 0; i < N; i++) {
        let dd = Math.abs(((pos - i) % N + N) % N); dd = Math.min(dd, N - dd);
        const fv = inside ? Math.max(0, 1 - dd * 1.15) : 0.55;
        focusVals[i] += (fv - focusVals[i]) * Math.min(1, dt * 6);
        sweep[i] = Math.min(2, sweep[i] + dt * 0.9);
        const hv = i === hoverI ? 1 : 0;
        let nv = 0.12 * focusVals[i];
        if (i === litIdx) { const a = age[i]; nv = a < 1.1 && !reduce ? (a < 0.9 ? (Math.sin(a * 37) * Math.sin(a * 91) > 0.05 ? 1 : 0.12) * Math.min(1, a * 2.2 + 0.25) : 1) : (0.82 + 0.18 * Math.sin(t * 2.3 + i)); }
        if (floorTxt[i]) { floorTxt[i].material.opacity = focusVals[i] * (1 - U.uRZ.value) * 0.95; shadows[i].material.opacity = 0.35 + 0.4 * focusVals[i]; }
        const tz = panels[i].material.uniforms.uTorch.value; const on = (fine && i === torchI && !dragging) ? 1 : 0;
        if (on) { tz.x += (torchUV.x - tz.x) * Math.min(1, dt * 10); tz.y += (torchUV.y - tz.y) * Math.min(1, dt * 10); }
        tz.z += (on - tz.z) * Math.min(1, dt * 5);
        for (const m of [panels[i], reflections[i]]) {
          const u = m.material.uniforms; u.uNeon.value = nv; if (m !== panels[i]) u.uTorch.value.copy(tz);
          u.uFocus.value = focusVals[i]; u.uSweep.value = reduce ? 2 : sweep[i]; u.uHover.value += (hv - u.uHover.value) * Math.min(1, dt * 8); u.uOpen.value = openAmt;
        }
      }

      // camera
      openAmt += (openTarget - openAmt) * Math.min(1, dt * (reduce ? 60 : 3.5));
      U.uNight.value += (nightT - U.uNight.value) * Math.min(1, dt * (reduce ? 60 : 1.6));
      cmx += (mx - cmx) * Math.min(1, dt * 3); cmy += (my - cmy) * Math.min(1, dt * 3);
      if (flying) { flyT = Math.min(1, flyT + dt / 2.4); if (flyT >= 1) { flying = false; inside = true; } }
      if (is360) {
        lon += (tLon - lon) * Math.min(1, dt * 6); lat += (tLat - lat) * Math.min(1, dt * 6);
        const ph = (90 - lat) * Math.PI / 180, th = lon * Math.PI / 180;
        camera.position.set(0, 0, 0); look.set(Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th));
        camera.fov = narrow() ? 80 : 70;
      } else if (flying || !inside) {
        const e = expoOut(flyT);
        camera.position.set(0, start.y * (1 - e) + Math.sin(e * Math.PI) * 1.2, start.z * (1 - e));
        look.lerpVectors(lookStart, lookIn, e);
        camera.fov = 40 + (fovInside() - 40) * e;
        if (!flying && !inside) { camera.position.x = Math.sin(t * 0.2) * 1.5 + cmx * 3; camera.position.y = start.y + cmy * -2; }
      } else {
        const n = narrow();
        const fwd = -openAmt * (n ? 4.2 : 2.6) - (reduce ? 0 : U.uDwell.value * (1 - openAmt) * 0.7) - portalAmt * R * 0.82;
        camera.position.set(cmx * 0.5 * (fine ? 1 : 0) + (!n ? openAmt * 1.1 : 0), -cmy * 0.35, fwd + CAMBACK() * (1 - openAmt * 0.6));
        look.set(cmx * 3 + (!n ? openAmt * 3.4 : 0), -cmy * 1.6 + (n ? -1.6 - openAmt * 0.9 : 0), -10);
        camera.fov = fovInside() - openAmt * 5 - portalAmt * 12;
      }
      camera.lookAt(look); camera.updateProjectionMatrix();
      motes.rotation.y += dt * 0.02;

      // HUD sync
      $('needle').style.transform = `rotate(${pos / N * 360}deg)`;
      $('bgword').style.transform = `translate3d(${(-((pos * 28) % (28 * N)) - 10)}vw,0,0) skewX(${smoothVel * -12}deg)`;
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
