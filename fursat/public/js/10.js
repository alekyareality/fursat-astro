/* ===================== FURSAT · reference landing (fx) ===================== */
(function(){"use strict";
var $=function(i){return document.getElementById(i)},cl=function(v,a,b){return Math.max(a,Math.min(b,v))};
var root=document.documentElement,hero=$("top"),WA="919059670033";
var calm=matchMedia("(prefers-reduced-motion:reduce)").matches;

/* ---------- 1. fit the 1536x1024 design frame to the screen ---------- */
var wrap=$("fxartwrap");
function fit(){
  var w=root.clientWidth||innerWidth,h=innerHeight,u;
  if(w>=900){u=cl(Math.min(w/1536,(h-30)/1024),.4,1.5)}else{u=.9}
  root.style.setProperty("--u",u.toFixed(4));root.style.setProperty("--ex",w>=900?Math.round(cl(w/u-1536,0,520)):0);var sp=h-30-1024*u;root.style.setProperty("--gap",(w>=900&&sp>140?Math.round(sp/2-15):0)+"px");
  if(wrap&&w<900){root.style.setProperty("--au",(wrap.clientWidth/876).toFixed(4))}else root.style.removeProperty("--au");
}
fit();addEventListener("resize",fit);addEventListener("orientationchange",fit);
if(window.ResizeObserver&&wrap)new ResizeObserver(fit).observe(wrap);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);

/* ---------- 2. action wiring: every [data-open] hits the existing features ---------- */
document.addEventListener("click",function(e){
  var t=e.target.closest&&e.target.closest("[data-open]");if(!t)return;
  var k=t.getAttribute("data-open"),pick=t.getAttribute("data-pick");
  closeMenu();
  if(k==="chat"){e.preventDefault();window.openFursatChat&&window.openFursatChat(pick?[pick]:["Kitchen"])}
  else if(k==="packages"){e.preventDefault();if(window.FursatPackages)window.FursatPackages.open({tab:"party"});else window.openFursatChat&&window.openFursatChat(["Banquets"])}
  else if(k.indexOf("cc:")===0){e.preventDefault();window.FursatConcierge&&window.FursatConcierge.open(k.slice(3))}
  else if(k==="packages-menu"){e.preventDefault();if(window.FursatPackages)window.FursatPackages.open({tab:"menu"});else location.hash="#spaces"}
});

document.addEventListener("keydown",function(e){if(e.key!=="Escape")return;var p=document.querySelector(".pk-sh"),x=p&&p.offsetParent!==null&&p.querySelector(".pk-x");if(x)setTimeout(function(){if(p.offsetParent!==null)x.click()},30)});
/* legal dialog */
(function(){var d=$("fxlegal"),o=$("lbopen"),x=$("fxlegal-x");if(!d||!o)return;
 o.addEventListener("click",function(){if(d.showModal)d.showModal();else d.setAttribute("open","")});
 x&&x.addEventListener("click",function(){d.close?d.close():d.removeAttribute("open")});
 d.addEventListener("click",function(e){if(e.target===d)d.close&&d.close()})})();

/* ---------- 3. hamburger menu ---------- */
var menu=$("fxmenu"),burger=$("fxburger");
function openMenu(){if(!menu)return;menu.hidden=false;burger.setAttribute("aria-expanded","true");root.style.overflow="hidden";var a=menu.querySelector("a");a&&a.focus({preventScroll:true})}
function closeMenu(){if(!menu||menu.hidden)return;menu.hidden=true;burger.setAttribute("aria-expanded","false");root.style.overflow="";}
if(burger)burger.addEventListener("click",openMenu);
if($("fxmenu-x"))$("fxmenu-x").addEventListener("click",closeMenu);
document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu()});
if(menu)menu.addEventListener("click",function(e){if(e.target.closest("a"))closeMenu()});

/* nav highlight follows the section in view */
(function(){var links=[].slice.call(document.querySelectorAll(".fx-nav a"));if(!links.length||!("IntersectionObserver"in window))return;
  var map={top:0,fxcards:1,spaces:2,banquets:3,gallery:4,visit:5};
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting&&map[en.target.id]!==undefined){links.forEach(function(a){a.classList.remove("on")});var i=map[en.target.id];if(i===3)i=2;links[i]&&links[i].classList.add("on")}})},{rootMargin:"-45% 0px -50% 0px"});
  ["top","fxcards","spaces","gallery","visit"].forEach(function(id){var el=$(id);el&&io.observe(el)})})();

/* ---------- 4. "+" picks tray -> WhatsApp ---------- */
(function(){var tray=$("fxtray"),tt=$("fxtray-t"),picks=[];
  function ui(){if(!tray)return;tray.hidden=!picks.length;tt.textContent=picks.length+(picks.length===1?" pick":" picks")}
  document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".fx-add");if(!b)return;
    var c=b.closest(".fx-card"),n=c.getAttribute("data-name"),p=c.getAttribute("data-price"),i=-1;
    picks.forEach(function(x,k){if(x.n===n)i=k});
    if(i>-1){picks.splice(i,1);b.setAttribute("aria-pressed","false")}else{picks.push({n:n,p:p});b.setAttribute("aria-pressed","true");try{navigator.vibrate&&navigator.vibrate(12)}catch(_){}}
    ui()});
  if($("fxtray-x"))$("fxtray-x").addEventListener("click",function(){picks=[];[].forEach.call(document.querySelectorAll(".fx-add"),function(b){b.setAttribute("aria-pressed","false")});ui()});
  if($("fxtray-go"))$("fxtray-go").addEventListener("click",function(){
    var lines=["Hi Fursat! 👋 I’d love to try:"].concat(picks.map(function(x){return"• "+x.n+" (Rs "+x.p+")"}));
    var sn;try{sn=localStorage.getItem("fz_n")}catch(_){}
    if(sn)lines.push("— "+sn);
    var a=document.createElement("a");a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(lines.join("\n"));a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()});
})();

/* ---------- 5. helicopter reveal, then the lens intro takes over ---------- */
(function(){var H=$("heli"),v=$("helivid"),skip=$("heliskip");if(!H||!v)return;
  if(calm||!window.__fzGo){H.remove();return}
  var orig=window.__fzGo,started=false,handed=false,t1=0;
  function hand(){if(handed)return;handed=true;clearTimeout(t1);
    H.classList.add("zoom");
    setTimeout(function(){orig()},420);                /* lens intro starts underneath */
    setTimeout(function(){H.classList.add("out")},620);/* helicopter scene dissolves */
    setTimeout(function(){H.remove()},1900)}
  window.__fzGo=function(){if(started)return;started=true;H.classList.add("playing");
    v.muted=false;v.volume=.9;
    var p=v.play();
    if(p&&p.catch)p.catch(function(){v.muted=true;var q=v.play();if(q&&q.catch)q.catch(hand)});
    v.addEventListener("timeupdate",function(){if(v.duration&&v.currentTime>=v.duration-1.05)hand()});
    v.addEventListener("ended",hand);v.addEventListener("error",hand);
    t1=setTimeout(hand,8000)};
  if(skip)skip.addEventListener("click",hand);
  /* the lens intro should wait for the clip: keep the original untouched, just delay it */
})();

/* ---------- 7. 3D tilt for the below-the-fold cards ---------- */
(function(){if(calm||!matchMedia("(pointer:fine)").matches)return;
  document.addEventListener("pointermove",function(e){var c=e.target.closest&&e.target.closest(".fx-space,.fx-gal figure");if(!c)return;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    c.style.transform="perspective(900px) rotateY("+(x*9).toFixed(2)+"deg) rotateX("+(-y*7).toFixed(2)+"deg) translateY(-6px)"});
  document.addEventListener("pointerout",function(e){var c=e.target.closest&&e.target.closest(".fx-space,.fx-gal figure");if(c&&!c.contains(e.relatedTarget))c.style.transform=""});
})();
})();

(function(){"use strict";var $=function(i){return document.getElementById(i)},hero=$("top"),WA="919059670033";
/* ======================= 10. scroll depth, journey, sticky bar ======================= */
(function(){var ticking=false,jr=$("journey"),scenes=jr?[].slice.call(jr.querySelectorAll(".jr-scene")):[],dots=jr?[].slice.call(jr.querySelectorAll(".jr-dots button")):[],st=$("fxsticky"),cur=-1;
  function upd(){ticking=false;var y=window.pageYOffset||0,vh=innerHeight;
    if(hero)hero.style.setProperty("--sy",Math.min(1,y/(vh*.85)).toFixed(3));
    if(st)st.classList.toggle("on",y>380);
    if(jr&&jr.offsetParent!==null){var r=jr.getBoundingClientRect(),tot=r.height-Math.min(vh,960);if(tot>0){var p=Math.max(0,Math.min(.9999,-r.top/tot)),i=Math.floor(p*scenes.length),loc=p*scenes.length-i;
      if(i!==cur){cur=i;scenes.forEach(function(s,k){s.classList.toggle("on",k===i)});dots.forEach(function(d,k){d.classList.toggle("on",k===i)})}
      scenes[i].style.setProperty("--jp",loc.toFixed(3))}}}
  function req(){if(!ticking){ticking=true;requestAnimationFrame(upd)}}
  addEventListener("scroll",req,{passive:true});addEventListener("resize",req);upd();
  dots.forEach(function(d){d.addEventListener("click",function(){var r=jr.getBoundingClientRect(),tot=r.height-Math.min(innerHeight,960),i=+d.getAttribute("data-i");scrollTo({top:window.pageYOffset+r.top+tot*((i+.5)/scenes.length),behavior:"smooth"})})});
})();

/* ======================= 11. sparkle trail + elephant toot ======================= */
(function(){var cv=$("fxsparks");if(!cv)return;var cx=cv.getContext("2d"),P=[],W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1),reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,fine=matchMedia("(pointer:fine)").matches,run=false;
  function rs(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener("resize",rs);
  function add(x,y,n,sp){for(var i=0;i<n;i++){var a=Math.random()*6.283,s=(Math.random()*.9+.2)*sp;P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.3,l:1,r:Math.random()*2.2+1})}go()}
  function go(){if(!run){run=true;requestAnimationFrame(tick)}}
  function tick(){cx.clearRect(0,0,W,H);var night=document.documentElement.classList.contains("night");cx.globalCompositeOperation="lighter";
    for(var i=P.length-1;i>=0;i--){var p=P[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.012;p.l-=.022;if(p.l<=0){P.splice(i,1);continue}
      var g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*3.2);g.addColorStop(0,"rgba(255,246,214,"+p.l+")");g.addColorStop(.4,(night?"rgba(255,170,60,":"rgba(230,160,50,")+p.l*.7+")");g.addColorStop(1,"rgba(255,160,40,0)");cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r*3.2,0,6.283);cx.fill()}
    if(P.length)requestAnimationFrame(tick);else{run=false;cx.clearRect(0,0,W,H)}}
  var lx=0,ly=0;
  if(!reduce&&fine)addEventListener("pointermove",function(e){var d=Math.abs(e.clientX-lx)+Math.abs(e.clientY-ly);if(d<14)return;lx=e.clientX;ly=e.clientY;add(lx,ly,2,.9)},{passive:true});
  var ele=document.querySelector(".fx-ele"),ac=null;
  function toot(){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator(),f=ac.createBiquadFilter(),g=ac.createGain(),t=ac.currentTime;o.type="sawtooth";o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(520,t+.16);o.frequency.exponentialRampToValueAtTime(300,t+.5);f.type="lowpass";f.frequency.value=1400;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.16,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+.55);o.connect(f);f.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+.6)}catch(_){}}
  if(ele)ele.addEventListener("click",function(e){ele.classList.remove("toot");void ele.offsetWidth;ele.classList.add("toot");toot();var r=ele.getBoundingClientRect();add(r.left+r.width*.5,r.top+r.height*.3,34,3.2);try{navigator.vibrate&&navigator.vibrate(18)}catch(_){}});
  window.__fxSparks=add;
})();

/* ======================= 12. dish flies into the picks tray ======================= */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".fx-add");if(!b||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  setTimeout(function(){if(b.getAttribute("aria-pressed")!=="true")return;var im=b.closest(".fx-card").querySelector(".fx-card-img img"),tr=$("fxtray");if(!im||!Element.prototype.animate)return;
    var a=im.getBoundingClientRect(),t=tr&&!tr.hidden?tr.getBoundingClientRect():{left:innerWidth/2-20,top:innerHeight-60,width:40,height:40},c=document.createElement("img");c.className="fx-fly";c.src=im.currentSrc||im.src;c.alt="";document.body.appendChild(c);
    var sx=a.left+a.width/2-32,sy=a.top+a.height/2-32,ex=t.left+t.width/2-32,ey=t.top+t.height/2-32;
    c.animate([{transform:"translate("+sx+"px,"+sy+"px) scale(1.2)",opacity:1},{transform:"translate("+((sx+ex)/2)+"px,"+(Math.min(sy,ey)-80)+"px) scale(.9)",opacity:1,offset:.5},{transform:"translate("+ex+"px,"+ey+"px) scale(.2)",opacity:.2}],{duration:750,easing:"cubic-bezier(.5,0,.3,1)"}).onfinish=function(){c.remove();window.__fxSparks&&window.__fxSparks(ex+32,ey+32,14,2)};c.style.left="0";c.style.top="0"},30)});

/* ======================= 13. two-tap table booking -> WhatsApp ======================= */
(function(){var dlg=$("fxbook");if(!dlg)return;var n=$("bk-n"),d=$("bk-d"),t=$("bk-t"),z=$("bk-z"),c=$("bk-c"),g=2;
  var today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());var iso=today.toISOString().slice(0,10);d.min=iso;d.value=iso;
  try{var sn=localStorage.getItem("fz_n");if(sn)n.value=sn}catch(_){}
  function open(zone){if(zone)z.value=zone;if(typeof dlg.showModal==="function")dlg.showModal();else dlg.setAttribute("open","")}
  document.addEventListener("click",function(e){var el=e.target.closest&&e.target.closest('[data-open="book"]');if(!el)return;e.preventDefault();var m=$("fxmenu");if(m&&!m.hidden)m.hidden=true;open(el.getAttribute("data-pick"))},true);
  $("bk-m").addEventListener("click",function(){g=Math.max(1,g-1);c.textContent=g});$("bk-p").addEventListener("click",function(){g=Math.min(60,g+1);c.textContent=g});
  $("fxbook-x").addEventListener("click",function(){dlg.close?dlg.close():dlg.removeAttribute("open")});
  dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close&&dlg.close()});
  $("fxbook-f").addEventListener("submit",function(e){e.preventDefault();var nm=n.value.trim();try{nm&&localStorage.setItem("fz_n",nm)}catch(_){}
    var dt=d.value?new Date(d.value+"T00:00").toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"}):"";
    var msg="Hi Fursat! 👋 I'd like to reserve a table.\n• Zone: "+z.value+"\n• Date: "+dt+"\n• Time: "+t.value+"\n• Guests: "+g+(nm?"\n— "+nm:"");
    var a=document.createElement("a");a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(msg);a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();dlg.close&&dlg.close()});
})();

/* ======================= 14. glass ribbon (WebGL) ======================= */
(function(){var box=document.getElementById("fxrib"),cv=document.getElementById("fxribgl");if(!box||!cv)return;
  var m=/url\(["']?([^"')]+)["']?\)/.exec(getComputedStyle(box).getPropertyValue("--rib")||"");if(!m)return;
  var gl=cv.getContext("webgl",{premultipliedAlpha:true,alpha:true,antialias:false});if(!gl)return;
  var VS="attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
  var FS="precision mediump float;varying vec2 uv;uniform sampler2D T;uniform float t;uniform vec2 px;"+
  "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}"+
  "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}"+
  "float fb(vec2 p){return .55*n(p)+.3*n(p*2.03+7.1)+.15*n(p*4.1+3.3);}"+
  "float L(vec3 c){return dot(c,vec3(.299,.587,.114));}"+
  "void main(){vec4 base=texture2D(T,uv);if(base.a<.004){gl_FragColor=vec4(0.);return;}"+
  "vec2 q=uv*vec2(3.2,4.4);vec2 fl=vec2(fb(q+vec2(t*.045,t*.03)),fb(q+vec2(5.2-t*.035,1.3+t*.04)))-.5;"+
  "vec2 o=fl*.0105;"+
  "vec2 e=px*2.;float gx=L(texture2D(T,uv+vec2(e.x,0.)).rgb)-L(texture2D(T,uv-vec2(e.x,0.)).rgb);float gy=L(texture2D(T,uv+vec2(0.,e.y)).rgb)-L(texture2D(T,uv-vec2(0.,e.y)).rgb);vec2 g=vec2(gx,gy);float ge=clamp(length(g)*2.6,0.,1.);"+
    "vec3 c=texture2D(T,uv+o).rgb;"+
  "float lu=L(c);c=mix(vec3(lu),c,1.06);c*=vec3(1.03,1.,.96);"+
  "float ph=dot(uv,vec2(.78,.62))*9.-t*.55+fl.x*5.;float band=pow(.5+.5*sin(ph),9.);"+
  "float ph2=dot(uv,vec2(-.4,.9))*13.+t*.38+fl.y*6.;float band2=pow(.5+.5*sin(ph2),12.);"+
  "float spec=(band*.8+band2*.55)*(ge*.8+.04*smoothstep(.6,.95,lu))*.62;"+
  "c+=spec*vec3(1.,.91,.72);"+
  
  "c=mix(c,vec3(lu)*vec3(1.1,.97,.82),.22);float a=base.a*mix(.8,1.,clamp(ge*1.4+smoothstep(.55,.9,lu),0.,1.));gl_FragColor=vec4(c*a,a);}";
  function sh(ty,s){var o=gl.createShader(ty);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw 0;return o}
  var pr;try{pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0}catch(_){return}
  gl.useProgram(pr);var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  var lp=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
  var uT=gl.getUniformLocation(pr,"t"),uP=gl.getUniformLocation(pr,"px");
  var dpr=Math.min(1.5,window.devicePixelRatio||1);cv.width=Math.round(876*dpr);cv.height=Math.round(640*dpr);gl.viewport(0,0,cv.width,cv.height);
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,vis=true,raf=0,t0=performance.now();
  function draw(now){raf=0;gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uT,reduce?4:(now-t0)/1000);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);if(!reduce&&vis&&!document.hidden&&!document.getElementById("top").classList.contains("has-vid"))raf=requestAnimationFrame(draw)}
  var img=new Image();img.onload=function(){var tx=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tx);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(pr,"T"),0);gl.uniform2f(uP,1/img.width,1/img.height);box.classList.add("gl");raf=requestAnimationFrame(draw);
    if("IntersectionObserver"in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!raf&&!reduce)raf=requestAnimationFrame(draw)}).observe(box);
    document.addEventListener("visibilitychange",function(){if(!document.hidden&&!raf&&!reduce)raf=requestAnimationFrame(draw)})};
  img.src=m[1];
})();

/* ======================= 15. natural 3D: depth-parallax scene, dust motes, idle camera ======================= */
(function(){var hero=document.getElementById("top"),bg=document.getElementById("fxbggl"),img=document.querySelector("img.fx-herobg"),mc=document.getElementById("fxmotes");if(!hero||!img)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches,small=matchMedia("(max-width:899px)").matches;
  var vis=true,px=0,py=0,tx=0,ty=0,last=performance.now(),idleAt=performance.now()+3000,gp=0,gq=0;
  addEventListener("pointermove",function(){idleAt=performance.now()+2800},{passive:true});
  function pv(){var a=parseFloat(hero.style.getPropertyValue("--px")),b=parseFloat(hero.style.getPropertyValue("--py"));return[isNaN(a)?0:a,isNaN(b)?0:b]}
  /* ---- depth-parallax background (2.5D) ---- */
  var gl=null,uOff,uSy;
  if(bg&&!reduce){try{gl=bg.getContext("webgl",{premultipliedAlpha:true,alpha:true,antialias:false})}catch(_){}}
  if(gl){(function(){
    var VS="attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
    var FS="precision mediump float;varying vec2 uv;uniform sampler2D T,D;uniform vec2 o;uniform float sy;void main(){float d=texture2D(D,uv).r;vec2 s=o*(d-.42)*.034+vec2(0.,-sy*(d-.3)*.03);vec2 u=clamp(uv+s,.001,.999);vec4 c=texture2D(T,u);gl_FragColor=vec4(c.rgb*c.a,c.a);}";
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw 0;return o}
    var pr;try{pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw 0}catch(_){gl=null;return}
    gl.useProgram(pr);var bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);var lp=gl.getAttribLocation(pr,"p");gl.enableVertexAttribArray(lp);gl.vertexAttribPointer(lp,2,gl.FLOAT,false,0,0);
    uOff=gl.getUniformLocation(pr,"o");uSy=gl.getUniformLocation(pr,"sy");
    /* hand-built depth map: bright = near */
    var dc=document.createElement("canvas");dc.width=219;dc.height=160;var x=dc.getContext("2d"),g=x.createLinearGradient(0,0,0,160);g.addColorStop(0,"#1c1c1c");g.addColorStop(.45,"#4a4a4a");g.addColorStop(1,"#bdbdbd");x.fillStyle=g;x.fillRect(0,0,219,160);
    function blob(cx,cy,rx,ry,v,a){x.save();x.globalAlpha=a;x.fillStyle="rgb("+v+","+v+","+v+")";x.beginPath();x.ellipse(cx/4,cy/4,rx/4,ry/4,0,0,6.283);x.fill();x.restore()}
    blob(280,300,52,98,150,.95);blob(610,275,62,48,135,.9);blob(540,470,300,120,215,.95);blob(780,330,95,230,225,.92);blob(440,380,120,60,170,.7);blob(520,60,160,90,18,.8);
    x.filter="blur(5px)";x.drawImage(dc,0,0);x.filter="none";
    var dt=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,dt);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,dc);
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR)});gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.uniform1i(gl.getUniformLocation(pr,"D"),1);gl.uniform1i(gl.getUniformLocation(pr,"T"),0);
    function go(){var tx0=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tx0);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
      [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(function(k){gl.texParameteri(gl.TEXTURE_2D,k,gl.LINEAR)});gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);bg.classList.add("on");img.classList.add("gl-on")}
    if(img.complete&&img.naturalWidth)go();else img.addEventListener("load",go)
  })()}
  /* ---- dust motes drifting through the light ---- */
  var mx=mc&&mc.getContext("2d"),M=[];if(mx&&!reduce){for(var i=0;i<(small?14:30);i++)M.push({x:Math.random()*876,y:Math.random()*640,z:Math.random(),r:Math.random()*1.6+.7,s:Math.random()*6.28,v:Math.random()*.2+.06})}
  function frame(now){var dt=Math.min(.05,(now-last)/1000);last=now;
    if(now>idleAt){var t=now/1000;tx=Math.sin(t*.37)*.55+Math.sin(t*.91)*.12;ty=Math.cos(t*.29)*.38;hero.style.setProperty("--px",tx.toFixed(4));hero.style.setProperty("--py",ty.toFixed(4))}
    var p=pv();px+=(p[0]-px)*Math.min(1,dt*6);py+=(p[1]-py)*Math.min(1,dt*6);
    if(gl&&bg.classList.contains("on")&&!hero.classList.contains("has-vid")){var sy=parseFloat(hero.style.getPropertyValue("--sy"))||0;gl.viewport(0,0,bg.width,bg.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(uOff,px,py);gl.uniform1f(uSy,sy);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
    if(mx&&M.length){mx.clearRect(0,0,876,640);mx.globalCompositeOperation="lighter";
      for(var k=0;k<M.length;k++){var m=M[k];m.s+=dt*.6;m.x+=(Math.sin(m.s)*.12+m.v*.6)*(.5+m.z)+px*.25*(m.z-.3);m.y-=m.v*(.4+m.z)*.6+py*.05;if(m.y<-6)m.y=646;if(m.x>886)m.x=-6;if(m.x<-10)m.x=886;
        var a=(.18+.5*m.z)*(.55+.45*Math.sin(m.s*1.7)),r=m.r*(1+m.z*1.4),gr=mx.createRadialGradient(m.x,m.y,0,m.x,m.y,r*3);gr.addColorStop(0,"rgba(255,244,214,"+a+")");gr.addColorStop(1,"rgba(255,230,170,0)");mx.fillStyle=gr;mx.beginPath();mx.arc(m.x,m.y,r*3,0,6.283);mx.fill()}}
    if(vis&&!document.hidden)requestAnimationFrame(frame)}
  if(reduce){return}
  if("IntersectionObserver"in window)new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!vis){vis=true;last=performance.now();requestAnimationFrame(frame)}vis=v}).observe(hero);
  document.addEventListener("visibilitychange",function(){if(!document.hidden&&vis){last=performance.now();requestAnimationFrame(frame)}});
  requestAnimationFrame(frame);
})();

/* ======================= 16. Flow hero video ======================= */
(function(){var v=document.getElementById("fxvid"),h=document.getElementById("top");if(!v||!h)return;
  h.classList.add("has-vid");
  v.addEventListener("error",function(){h.classList.remove("has-vid");v.remove()});
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;if(reduce){v.removeAttribute("autoplay");return}
  function play(){var p=v.play();if(p&&p.catch)p.catch(function(){})}
  play();document.addEventListener("pointerdown",play,{once:true});
  if("IntersectionObserver"in window)new IntersectionObserver(function(es){es[0].isIntersecting?play():v.pause()}).observe(v);
  document.addEventListener("visibilitychange",function(){document.hidden?v.pause():play()});
})();

/* ======================= 17. Elephant Flow clip (colour + matte packed side by side, composited on a canvas) ======================= */


})();

/* ======================= 18. Ask Fursat concierge (banquets, catering, visit, contact) ======================= */
(function(){
var WA="919059670033",MAP="https://www.google.com/maps/search/?api=1&query=Fursat+Kitchen+Bar+Capital+Park+Madhapur+Hyderabad";
var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
var IC={
 hall:'<path d="M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6M12 9v.01"/>',
 cater:'<path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 8V6M10 6h4"/><path d="M2 20h20"/>',
 pin:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
 users:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.2a3 3 0 0 1 0 5.6M18 14.3c1.8.8 3 2.6 3 4.7"/>',
 send:'<path d="M4 12l16-7-6 15-2.5-6.5z"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 glass:'<path d="M5 4h14l-7 9zM12 13v7M8 20h8"/>',
 ring:'<circle cx="12" cy="15" r="5"/><path d="M9.5 6.5L12 3l2.5 3.5L12 9z"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
 cake:'<path d="M4 20h16v-7H4zM6 13V9h12v4M12 9V6M12 3.5v.01"/>',
 spark:'<path d="M12 3l2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1L12 3z"/>',
 menu:'<path d="M5 4v8a3 3 0 0 0 3 3v5M8 4v6M11 4v8a3 3 0 0 1-3 3M17 20V4c-2 1.5-3 4-3 7h3"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 ig:'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
 wa:'<path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.04L2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.2 15.02l-.3-.18-3 .79.8-2.92-.2-.31A8.1 8.1 0 0 1 12.04 3.8z"/>'
};
function ic(n,c){return '<svg class="cc-i'+(c?' '+c:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+IC[n]+'</svg>'}
function inr(n){return "₹"+Number(n).toLocaleString("en-IN")}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function wa(msg){window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(msg),"_blank","noopener")}

var TABS=[["banq","Banquets","hall"],["cater","Catering & buffets","cater"],["visit","Visit us","pin"],["talk","Contact","phone"]];
var ROUTES=[
 ["banq",/banquet|\bhall\b|wedding|marriage|reception|engagement|sangeet|shaadi|venue|corporate|conference|function|\bevents?\b|bar bash|beer bash|open bar|platinum|gold package|silver package|party (package|hall|booking|venue|plan)|plan (a |my )?(party|event)/i],
 ["cater",/cater|buffet|bulk|package|per person|per head|group order|large group|headcount|quote/i],
 ["visit",/where|location|address|direction|map\b|route|reach|parking|landmark|timing|hours|open(ing)?\b|close|closing|when do|what time|reserve|reservation|book a table|table for|madhapur|capital park/i],
 ["talk",/contact|phone|call us|number|whatsapp|insta|email|talk to|speak to|owner|manager|enquir/i]
];
function route(q){q=String(q||"").trim();if(q.length<3)return null;for(var i=0;i<ROUTES.length;i++)if(ROUTES[i][1].test(q))return ROUTES[i][0];return null}

var el,body,tabsEl,titleEl,st={tab:"banq",occ:"Wedding",guests:60,date:"",diet:"Veg + Non-veg"},last=null;
function build(){if(el)return;
 el=document.createElement("div");el.className="cc";el.id="fxcc";el.hidden=true;
 el.innerHTML='<div class="cc-bd" data-cc="x"></div><div class="cc-sh" role="dialog" aria-modal="true" aria-labelledby="cc-t"><i class="cc-glow" aria-hidden="true"></i><header class="cc-hd"><div><p class="cc-ey">'+ic("spark")+'Ask Fursat <b>Concierge</b></p><h3 id="cc-t"></h3></div><button class="cc-x" type="button" data-cc="x" aria-label="Close">'+ic("x")+'</button></header><nav class="cc-tabs" id="cc-tabs" role="tablist"></nav><form class="cc-ask" id="cc-ask" role="search"><input id="cc-q" type="text" maxlength="120" placeholder="Ask anything: hall for 150 guests, buffet price, where to park…" aria-label="Ask Fursat anything"><button type="submit" aria-label="Ask">'+ic("arrow")+'</button></form><div class="cc-bo" id="cc-bo"></div><footer class="cc-ft"><span>Prices are per person and indicative. Final menu, date and quote are confirmed on WhatsApp.</span><a href="https://bjnexusai.com" target="_blank" rel="noopener">Designed &amp; developed by BJNexus AI</a></footer></div>';
 document.body.appendChild(el);
 body=el.querySelector("#cc-bo");tabsEl=el.querySelector("#cc-tabs");titleEl=el.querySelector("#cc-t");
 tabsEl.innerHTML=TABS.map(function(t){return '<button type="button" role="tab" data-tab="'+t[0]+'">'+ic(t[2])+'<span>'+t[1]+'</span></button>'}).join("")+'<i class="cc-pill" aria-hidden="true"></i>';
 el.addEventListener("click",onClick);
 el.querySelector("#cc-ask").addEventListener("submit",function(e){e.preventDefault();var q=el.querySelector("#cc-q").value,r=route(q);if(r){show(r)}else{closeIt();feed(q)}});
 el.addEventListener("keydown",function(e){
  if(e.key==="Escape"){closeIt();return}
  if(e.key==="Tab"){var f=[].filter.call(el.querySelectorAll("button,input,a[href],textarea"),function(n){return n.offsetParent!==null});if(!f.length)return;var a=f[0],z=f[f.length-1];
   if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
}
function feed(q){var i=document.getElementById("af-q"),s=document.getElementById("af-send");if(!i||!s)return;i.value=q;s.__ccPass=1;s.click()}

function pk(){return(window.FursatPackages&&window.FursatPackages.packages)||[]}
function party(){return pk().filter(function(p){return p.k==="party"})}
function buffets(){return pk().filter(function(p){return p.k==="buffet"})}

function secLine(p){return p.sec&&p.sec.length?p.sec.map(function(s){return s.n+" "+s.t.replace(/\s*·.*$/,"").toLowerCase()}).slice(0,4).join(" · "):""}

function viewBanq(){
 var occ=[["Weddings & receptions","ring","Sit-down or buffet spreads for the big day."],["Parties & bar bashes","glass","Open-bar tiers with starters, mains and dessert."],["Corporate & get-togethers","brief","Team lunches, launches and celebrations."],["Birthdays & anniversaries","cake","Intimate to lively, with your menu your way."]];
 var h='<section class="cc-hero cc-in"><p class="cc-kick">One address, four moods</p><h4>Your celebration, <em>hosted by Fursat</em></h4><p>Weddings, parties and corporate events at Capital Park, Madhapur. Pick a package or tell us your headcount and we will shape the rest.</p><div class="cc-row"><button class="cc-btn pri" data-cc="pk">'+ic("menu")+'See all packages</button><button class="cc-btn" data-cc="plan">'+ic("cal")+'Plan my event</button></div></section>';
 h+='<div class="cc-occ">'+occ.map(function(o,i){return '<article class="cc-occ-i cc-in" style="--i:'+(i+1)+'">'+ic(o[1],"big")+'<h5>'+o[0]+'</h5><p>'+o[2]+'</p></article>'}).join("")+'</div>';
 var P=party();
 if(P.length){h+='<h4 class="cc-h cc-in" style="--i:5">Party packages <small>per person</small></h4><div class="cc-pk">'+P.map(function(p,i){return '<button class="cc-card cc-in tilt" style="--c:'+p.c+';--i:'+(i+6)+'" data-cc="pk" data-id="'+p.id+'"><span class="cc-tag">'+esc(p.tag)+'</span><b class="cc-t">'+esc(p.t)+'</b><span class="cc-pr"><i data-n="'+p.price+'">'+inr(p.price)+'</i></span><span class="cc-m">'+(p.serve?'Open bar · '+esc(p.serve):(p.veg?'Veg only':'Food package'))+'</span><span class="cc-go">View menu '+ic("arrow")+'</span></button>'}).join("")+'</div>'}
 h+=plan();
 return h}

function plan(){
 var occs=["Wedding","Birthday","Corporate","Anniversary","Get-together"],diets=["Veg","Veg + Non-veg","Open bar + food"];
 return '<section class="cc-plan cc-in" id="cc-plan" style="--i:14"><h4>Plan my event <small>takes 20 seconds</small></h4><div class="cc-f"><label>Occasion</label><div class="cc-chips" data-grp="occ">'+occs.map(function(o){return '<button type="button" class="'+(st.occ===o?'on':'')+'" data-cc="occ" data-v="'+o+'">'+o+'</button>'}).join("")+'</div></div><div class="cc-f two"><div><label>Guests</label><div class="cc-step"><button type="button" data-cc="g-" aria-label="Fewer guests">−</button><output id="cc-g">'+st.guests+'</output><button type="button" data-cc="g+" aria-label="More guests">+</button></div></div><div><label for="cc-d">Date</label><input id="cc-d" type="date" value="'+st.date+'"></div></div><div class="cc-f"><label>Food &amp; drinks</label><div class="cc-chips" data-grp="diet">'+diets.map(function(o){return '<button type="button" class="'+(st.diet===o?'on':'')+'" data-cc="diet" data-v="'+o+'">'+o+'</button>'}).join("")+'</div></div><button class="cc-btn wa" data-cc="send">'+ic("wa")+'Send enquiry on WhatsApp'+ic("arrow")+'</button></section>'}

function viewCater(){
 var B=buffets();
 var h='<section class="cc-hero cc-in alt"><p class="cc-kick">Bites &amp; Buffet</p><h4>Buffets that <em>feed the whole room</em></h4><p>Complete spreads from welcome drink to dessert, priced per person. Veg and veg + non-veg options.</p><div class="cc-row"><button class="cc-btn pri" data-cc="pkb">'+ic("menu")+'Browse buffet menus</button><a class="cc-btn" href="https://www.instagram.com/fursat_bitesandbuffet" target="_blank" rel="noopener">'+ic("ig")+'@fursat_bitesandbuffet</a></div></section>';
 if(B.length){h+='<h4 class="cc-h cc-in" style="--i:2">Buffet packages <small>per person</small></h4><div class="cc-bf">'+B.map(function(p,i){var n=p.sec.length;return '<button class="cc-bfi cc-in" style="--c:'+p.c+';--i:'+(i+3)+'" data-cc="pkb" data-id="'+p.id+'"><span class="cc-dot '+(p.veg?'v':'n')+'" title="'+(p.veg?'Vegetarian':'Veg and non-veg')+'"></span><span class="cc-bt"><b>'+inr(p.price)+'</b><small>'+(p.veg?'Veg buffet':'Veg + Non-veg buffet')+'</small></span><span class="cc-bm">'+n+'-part spread · '+esc(secLine(p))+'</span>'+ic("arrow")+'</button>'}).join("")+'</div>'}
 h+='<section class="cc-note cc-in" style="--i:9">'+ic("check")+'<p><b>Planning for a big headcount or an off-site event?</b> Share the date, place and guest count on WhatsApp and we will confirm what we can do.</p><button class="cc-btn wa sm" data-cc="wa-cater">'+ic("wa")+'Ask about catering</button></section>';
 return h}

function viewVisit(){
 var zones=[["Café","Slow coffees and shakes"],["Kitchen","Dine-in favourites"],["Bar","Cocktails after dark"],["Banquets","Weddings & parties"]];
 return '<section class="cc-hero cc-in alt2"><p class="cc-kick">Find us</p><h4>Capital Park, <em>Madhapur</em></h4><p>Hyderabad, Telangana. Tap Directions and your maps app takes it from there.</p><div class="cc-row"><a class="cc-btn pri" href="'+MAP+'" target="_blank" rel="noopener">'+ic("pin")+'Get directions</a><button class="cc-btn" data-cc="book">'+ic("cal")+'Reserve a table</button></div></section>'
 +'<div class="cc-two"><article class="cc-box cc-in" style="--i:2">'+ic("clock","big")+'<h5>Timings</h5><p>Table slots run from 12 PM to 10 PM. Hours can change on special days, so confirm today’s timing on WhatsApp before you head over.</p><button class="cc-link" data-cc="wa-hours">Check today’s hours '+ic("arrow")+'</button></article><article class="cc-box cc-in" style="--i:3">'+ic("pin","big")+'<h5>Address</h5><p>Capital Park, Madhapur, Hyderabad</p><a class="cc-link" href="'+MAP+'" target="_blank" rel="noopener">Open in maps '+ic("arrow")+'</a></article></div>'
 +'<h4 class="cc-h cc-in" style="--i:4">Four spaces, one address</h4><div class="cc-zones">'+zones.map(function(z,i){return '<article class="cc-zone cc-in" style="--i:'+(i+5)+'"><b>'+z[0]+'</b><span>'+z[1]+'</span></article>'}).join("")+'</div>'}

function viewTalk(){
 var ig=[["@fursatind.in","Kitchen & Bar"],["@fursat_bitesandbuffet","Bites & Buffet"],["@fursatbanquets","Banquets"],["@fursatsocialclub","Social Club"]];
 return '<section class="cc-hero cc-in alt3"><p class="cc-kick">Talk to a human</p><h4>We reply <em>fastest on WhatsApp</em></h4><p>Questions, bookings, quotes or a quick hello.</p><div class="cc-row"><button class="cc-btn wa" data-cc="wa-hi">'+ic("wa")+'WhatsApp us</button><a class="cc-btn" href="tel:+919059670033">'+ic("phone")+'+91 90596 70033</a></div></section>'
 +'<h4 class="cc-h cc-in" style="--i:2">Follow the feast</h4><div class="cc-ig">'+ig.map(function(g,i){return '<a class="cc-igi cc-in" style="--i:'+(i+3)+'" href="https://www.instagram.com/'+g[0].slice(1)+'" target="_blank" rel="noopener">'+ic("ig","big")+'<b>'+g[0]+'</b><small>'+g[1]+'</small></a>'}).join("")+'</div>'
 +'<section class="cc-note cc-in" style="--i:8">'+ic("menu")+'<p><b>Looking for dishes instead?</b> Tell Ask Fursat your mood and it will suggest what to order.</p><button class="cc-btn sm" data-cc="dishes">Pick by mood</button></section>'}

var VIEWS={banq:viewBanq,cater:viewCater,visit:viewVisit,talk:viewTalk},TITLES={banq:"Banquets &amp; celebrations",cater:"Catering &amp; buffets",visit:"Visit Fursat",talk:"Talk to Fursat"};
function pill(){var b=tabsEl.querySelector('[data-tab="'+st.tab+'"]'),p=tabsEl.querySelector(".cc-pill");if(!b||!p)return;p.style.width=b.offsetWidth+"px";p.style.transform="translateX("+b.offsetLeft+"px)"}
function countUp(){if(reduce)return;[].forEach.call(body.querySelectorAll("[data-n]"),function(n){var to=+n.getAttribute("data-n"),t0=null;function f(t){if(t0===null)t0=t;var k=Math.min(1,(t-t0)/700);n.textContent=inr(Math.round(to*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)}requestAnimationFrame(f)})}
function show(tab){st.tab=tab;titleEl.innerHTML=TITLES[tab];[].forEach.call(tabsEl.querySelectorAll("button"),function(b){var on=b.getAttribute("data-tab")===tab;b.classList.toggle("on",on);b.setAttribute("aria-selected",on)});pill();body.classList.remove("swap");body.innerHTML=VIEWS[tab]();body.scrollTop=0;void body.offsetWidth;body.classList.add("swap");countUp()}
function openIt(tab,q){build();last=document.activeElement;el.hidden=false;document.documentElement.style.overflow="hidden";show(tab||"banq");requestAnimationFrame(function(){el.classList.add("on");pill()});if(q)el.querySelector("#cc-q").value="";setTimeout(function(){var b=el.querySelector(".cc-x");b&&b.focus({preventScroll:true})},80)}
function closeIt(){if(!el||el.hidden)return;el.classList.remove("on");document.documentElement.style.overflow="";setTimeout(function(){el.hidden=true},reduce?0:300);if(last&&last.focus)try{last.focus({preventScroll:true})}catch(e){}}

function onClick(e){var t=e.target.closest("[data-cc],[data-tab]");if(!t)return;
 var tab=t.getAttribute("data-tab");if(tab){show(tab);return}
 var a=t.getAttribute("data-cc"),P=window.FursatPackages;
 if(a==="x")closeIt();
 else if(a==="pk"){closeIt();P&&P.open({tab:"party"})}
 else if(a==="pkb"){closeIt();P&&P.open({tab:"menu"})}
 else if(a==="plan"){var p=el.querySelector("#cc-plan");p&&p.scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"})}
 else if(a==="occ"||a==="diet"){st[a]=t.getAttribute("data-v");[].forEach.call(t.parentNode.children,function(c){c.classList.toggle("on",c===t)})}
 else if(a==="g-"||a==="g+"){st.guests=Math.max(10,Math.min(2000,st.guests+(a==="g+"?10:-10)));el.querySelector("#cc-g").textContent=st.guests}
 else if(a==="send"){var d=el.querySelector("#cc-d");st.date=d?d.value:"";wa("Hi Fursat! I would like to plan a "+st.occ.toLowerCase()+" for about "+st.guests+" guests"+(st.date?" on "+st.date:"")+". Food and drinks: "+st.diet+". Please share hall options, availability and a quote.")}
 else if(a==="wa-cater")wa("Hi Fursat! I would like to know about buffet and catering options. Guests: ____ , date: ____ , place: ____ .");
 else if(a==="wa-hours")wa("Hi Fursat! Could you confirm today’s opening hours?");
 else if(a==="wa-hi")wa("Hi Fursat! I would like to know more.");
 else if(a==="book"){closeIt();var b=document.querySelector('[data-open="book"]');b&&b.click()}
 else if(a==="dishes"){closeIt();var i=document.getElementById("af-q");if(i){i.scrollIntoView({block:"center",behavior:reduce?"auto":"smooth"});setTimeout(function(){i.focus()},400)}}
}
/* tilt on cards */
document.addEventListener("pointermove",function(e){if(!el||el.hidden||reduce||e.pointerType==="touch")return;var c=e.target.closest&&e.target.closest(".cc-card");if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty("--rx",((e.clientY-r.top)/r.height-.5)*-7+"deg");c.style.setProperty("--ry",((e.clientX-r.left)/r.width-.5)*9+"deg")});
document.addEventListener("pointerout",function(e){var c=e.target.closest&&e.target.closest(".cc-card");if(c){c.style.removeProperty("--rx");c.style.removeProperty("--ry")}});
window.addEventListener("resize",function(){el&&!el.hidden&&pill()});

/* hook the Ask Fursat input: info questions go to the concierge, dish questions to the original engine */
function intercept(e){
 var q=document.getElementById("af-q"),s=document.getElementById("af-send");if(!q||!s)return;
 if(e.type==="keydown"){if(e.key!=="Enter"||e.target!==q)return}
 else{var b=e.target.closest&&e.target.closest("#af-send");if(!b)return;if(b.__ccPass){b.__ccPass=0;return}}
 var r=route(q.value);if(!r)return;e.preventDefault();e.stopImmediatePropagation();openIt(r);q.value=""}
document.addEventListener("keydown",intercept,true);document.addEventListener("click",intercept,true);

/* topic chips at the front of the Ask Fursat chip row */
function chips(){var t=document.getElementById("af-track");if(!t||t.querySelector(".cc-chip"))return;
 var f=document.createDocumentFragment();
 [["banq","Banquets","hall"],["cater","Catering","cater"],["visit","Timings & map","clock"],["talk","Contact","phone"]].forEach(function(c){var b=document.createElement("button");b.type="button";b.className="af-chip cc-chip";b.innerHTML=ic(c[2])+"<span>"+c[1]+"</span>";b.addEventListener("click",function(ev){ev.stopPropagation();openIt(c[0])});f.appendChild(b)});
 t.insertBefore(f,t.firstChild);var m=document.getElementById("af-marquee");if(m)m.classList.add("cc-scroll")}
chips();
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-open='concierge']");if(!t)return;e.preventDefault();openIt(t.getAttribute("data-pick")||"banq")});
window.FursatConcierge={open:openIt,route:route};
})();

/* ---------- 18. smooth 3D tilt + glare on the signature cards (fine pointers only) ---------- */
(function(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var cards=[].slice.call(document.querySelectorAll(".fx-card"));if(!cards.length)return;
  var st=new Map(),raf=0;
  cards.forEach(function(c){st.set(c,{rx:0,ry:0,gx:50,gy:50,go:0,trx:0,try_:0,tgx:50,tgy:50,tgo:0,ty:0,tty:0});
    c.addEventListener("pointermove",function(e){if(innerWidth<900)return;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height,s=st.get(c);
      c.classList.add("tl");s.try_=(x-.5)*14;s.trx=-(y-.5)*11;s.tgx=x*100;s.tgy=y*100;s.tgo=1;s.tty=-8;go()},{passive:true});
    c.addEventListener("pointerleave",function(){var s=st.get(c);s.try_=0;s.trx=0;s.tgo=0;s.tty=0;go()});
  });
  function go(){if(!raf)raf=requestAnimationFrame(tick)}
  /* spring (stiffness 170, damping 18 = Emil's "alive but settled" feel); velocity carries through interruptions */
  function sp(s,k,t,v){var a=170*(t-s[k])-18*s[v];s[v]=(s[v]||0)+a/60/ (1);s[k]+=s[v]/60}
  function tick(){raf=0;var busy=false;
    st.forEach(function(s,c){
      s.vrx=s.vrx||0;s.vry=s.vry||0;s.vty=s.vty||0;s.vgo=s.vgo||0;
      sp(s,"rx",s.trx,"vrx");sp(s,"ry",s.try_,"vry");sp(s,"ty",s.tty,"vty");sp(s,"go",s.tgo,"vgo");s.gx+=(s.tgx-s.gx)*.25;s.gy+=(s.tgy-s.gy)*.25;
      var d=Math.abs(s.trx-s.rx)+Math.abs(s.try_-s.ry)+Math.abs(s.tgo-s.go)+Math.abs(s.tty-s.ty)+Math.abs(s.vrx)+Math.abs(s.vry);
      /* own element only: transform directly, never a parent variable */
      c.style.transform="perspective(1000px) translateY("+s.ty.toFixed(2)+"px) rotateX("+s.rx.toFixed(2)+"deg) rotateY("+s.ry.toFixed(2)+"deg)";
      var im=c.querySelector(".fx-cw,.fx-card-img"),bd=c.querySelector(".fx-card-body"),ad=c.querySelector(".fx-add");
      if(im)im.style.transform="translate3d("+(s.ry*-.9).toFixed(2)+"px,"+(s.rx*.9).toFixed(2)+"px,34px)";
      if(bd)bd.style.transform="translate3d("+(s.ry*-.4).toFixed(2)+"px,"+(s.rx*.4).toFixed(2)+"px,18px)";
      if(ad)ad.style.transform="translate3d("+(s.ry*-1.2).toFixed(2)+"px,"+(s.rx*1.2).toFixed(2)+"px,44px)";
      c.style.setProperty("--gx",s.gx.toFixed(1)+"%");c.style.setProperty("--gy",s.gy.toFixed(1)+"%");c.style.setProperty("--go",Math.max(0,Math.min(1,s.go)).toFixed(3));
      if(d>.03)busy=true;else if(s.tgo===0&&s.go<.01){c.classList.remove("tl");c.style.transform="";[im,bd,ad].forEach(function(x){x&&(x.style.transform="")})}});
    if(busy)raf=requestAnimationFrame(tick)}
})();

/* ---------- 21. Ask Fursat: cursor glare + "thinking" dots on send ---------- */
(function(){var af=document.getElementById("ask-fursat");if(!af)return;var card=af.querySelector(".af-card");if(!card)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  if(!reduce&&matchMedia("(hover:hover)").matches){
    card.addEventListener("pointermove",function(e){var r=card.getBoundingClientRect();card.style.setProperty("--mx",((e.clientX-r.left)/r.width*100).toFixed(1)+"%");card.style.setProperty("--my",((e.clientY-r.top)/r.height*100).toFixed(1)+"%");card.style.setProperty("--mo","1")},{passive:true});
    card.addEventListener("pointerleave",function(){card.style.setProperty("--mo","0")});
  }
  var send=document.getElementById("af-send"),q=document.getElementById("af-q");
  function busy(){if(!send||reduce)return;send.classList.add("busy");setTimeout(function(){send.classList.remove("busy")},750)}
  if(send)send.addEventListener("pointerdown",function(){if(q&&q.value.trim())busy()},true);
  if(q)q.addEventListener("keydown",function(e){if(e.key==="Enter"&&q.value.trim())busy()},true);
})();

/* ---------- 22. Ask Fursat widget API: events (CustomEvent + dataLayer), "/" shortcut, clear button, theming ---------- */
(function(){
  var af=document.getElementById("ask-fursat");if(!af)return;
  var VERSION="1.0.0",form=document.getElementById("af-form"),q=document.getElementById("af-q"),send=document.getElementById("af-send"),mic=document.getElementById("af-mic");
  window.dataLayer=window.dataLayer||[];
  var subs={};
  function emit(name,detail){detail=detail||{};detail.widget="ask-fursat";detail.v=VERSION;
    try{window.dataLayer.push(Object.assign({event:"fursat_"+name},detail))}catch(e){}
    try{window.dispatchEvent(new CustomEvent("fursat:"+name,{detail:detail}))}catch(e){}
    (subs[name]||[]).slice().forEach(function(f){try{f(detail)}catch(e){}})}
  window.FursatWidget={version:VERSION,
    on:function(n,f){(subs[n]=subs[n]||[]).push(f);return this},
    off:function(n,f){subs[n]=(subs[n]||[]).filter(function(x){return x!==f});return this},
    focus:function(){q&&q.focus()},
    ask:function(t){if(!q)return;q.value=t||"";q.dispatchEvent(new Event("input",{bubbles:true}));if(send)send.click()},
    open:function(k){window.FursatConcierge&&window.FursatConcierge.open(k||"")},
    theme:function(o){Object.keys(o||{}).forEach(function(k){af.style.setProperty("--fw-"+k,o[k])})}};
  /* privacy: payloads never carry what the guest typed or said — only its length and the channel */
  document.addEventListener("click",function(e){var t=e.target;if(!t||!t.closest||!af.contains(t))return;
    var chip=t.closest(".af-chip");if(chip){emit("chip_clicked",{label:(chip.textContent||"").trim().slice(0,40)});return}
    if(t.closest(".pk-open")){emit("cta_clicked",{cta:"party_packages"});return}
    if(t.closest(".af-contact .wa")){emit("cta_clicked",{cta:"whatsapp"});return}
    if(t.closest("#af-mic")){emit("voice_toggled",{});return}
    if(t.closest("#af-send")&&q&&q.value.trim())emit("ask_submitted",{channel:"click",q_len:q.value.trim().length})},true);
  if(q){
    q.addEventListener("keydown",function(e){if(e.key==="Enter"&&q.value.trim())emit("ask_submitted",{channel:"enter",q_len:q.value.trim().length})},true);
    var f1=false;q.addEventListener("focus",function(){if(!f1){f1=true;emit("input_focused",{})}});
  }
  /* "/" focuses the box (like search on GitHub/YouTube) */
  document.addEventListener("keydown",function(e){if(e.key!=="/"||e.ctrlKey||e.metaKey||e.altKey)return;var a=document.activeElement,tg=a&&a.tagName;if(tg==="INPUT"||tg==="TEXTAREA"||tg==="SELECT"||(a&&a.isContentEditable))return;if(innerWidth<900||!q)return;e.preventDefault();q.focus();emit("shortcut_used",{})});
  /* clear button + hint */
  if(form&&q){
    var kbd=document.createElement("span");kbd.className="af-kbd";kbd.setAttribute("aria-hidden","true");kbd.textContent="/";
    var clr=document.createElement("button");clr.type="button";clr.className="af-clear";clr.setAttribute("aria-label","Clear");clr.innerHTML="&times;";
    var anchor=mic||send;form.insertBefore(clr,anchor);form.insertBefore(kbd,clr);
    function sync(){form.classList.toggle("has-text",!!q.value)}
    q.addEventListener("input",sync);clr.addEventListener("click",function(){q.value="";sync();q.focus()});sync();
    if(mic&&!mic.title)mic.title="Voice uses your browser’s speech service";
  }
  emit("widget_loaded",{});
})();


/* ---------- 23. glass nav: sliding indicator that follows hover / focus and rests on the active link ---------- */
(function(){
  var nav=document.querySelector(".fx-nav");if(!nav)return;
  var ind=document.createElement("span");ind.className="fx-nav-ind";ind.setAttribute("aria-hidden","true");nav.insertBefore(ind,nav.firstChild);
  var links=[].slice.call(nav.querySelectorAll("a"));
  function rest(){return nav.querySelector("a.on")||links[0]}
  function to(a){
    if(!a||!a.offsetWidth)return;
    ind.style.width=a.offsetWidth+"px";ind.style.transform="translate3d("+a.offsetLeft+"px,0,0)";ind.classList.add("show");
    links.forEach(function(l){l.classList.toggle("hot",l===a)});
  }
  links.forEach(function(a){
    a.addEventListener("pointerenter",function(){to(a)});
    a.addEventListener("focus",function(){to(a)});
    a.addEventListener("click",function(){if(a.classList.contains("soon"))return;links.forEach(function(l){l.classList.remove("on")});a.classList.add("on")});
  });
  nav.addEventListener("pointerleave",function(){to(rest())});
  nav.addEventListener("focusout",function(){setTimeout(function(){if(!nav.contains(document.activeElement))to(rest())},0)});
  function init(){to(rest())}
  init();addEventListener("resize",init);setTimeout(init,600);setTimeout(init,2200);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(init);
})();

/* ---------- 24. signature cards: each card slowly rotates through more real dishes (crossfade + text swap) ---------- */
(function(){
  var cards=[].slice.call(document.querySelectorAll(".fx-card[data-dishes]"));if(!cards.length)return;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  cards.forEach(function(c,ci){
    var D;try{D=JSON.parse(c.getAttribute("data-dishes"))}catch(e){return}
    var sl=[].slice.call(c.querySelectorAll(".fx-sl")),body=c.querySelector(".fx-card-body"),h=body.querySelector("h3"),p=body.querySelector("p"),pr=body.querySelector(".fx-price"),ad=c.querySelector(".fx-add");
    if(sl.length<2||D.length!==sl.length||reduce)return;
    var i=0,paused=false,vis=true;
    c.addEventListener("mouseenter",function(){paused=true});c.addEventListener("mouseleave",function(){paused=false});
    if("IntersectionObserver"in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(c);
    function step(){
      if(paused||!vis||document.hidden){setTimeout(step,900);return}
      var n=(i+1)%sl.length;sl[n].classList.add("on");sl[i].classList.remove("on");body.classList.add("sw");
      setTimeout(function(){h.textContent=D[n][0];p.textContent=D[n][1];pr.textContent=D[n][2];c.setAttribute("data-name",D[n][0]);c.setAttribute("data-price",D[n][3]||0);if(ad)ad.setAttribute("aria-label","Add "+D[n][0]+" to my picks");body.classList.remove("sw")},520);
      i=n;setTimeout(step,6200)}
    setTimeout(step,4200+ci*2100)});
})();

/* ---------- 25. smooth video: decode the embedded clips into blob URLs (proper range seeking + gapless loops) instead of huge data: URIs ---------- */
(function(){
  if(!window.fetch||!window.URL||!URL.createObjectURL)return;
  function blob(u){return fetch(u).then(function(r){return r.blob()}).then(function(b){return URL.createObjectURL(b)})}
  [].forEach.call(document.querySelectorAll("video:not(.fx-pl-rv)"),function(v){
    var s=v.getAttribute("src");
    if(s&&s.indexOf("data:")===0){var was=!v.paused;blob(s).then(function(u){var t=v.currentTime||0;v.src=u;v.preload="auto";try{v.currentTime=t}catch(e){}if(was||v.autoplay||v.hasAttribute("data-play")){var p=v.play();p&&p.catch&&p.catch(function(){})}}).catch(function(){})}
    
  })
})();


/* ---------- 26. hero: ONE baked master video (design + our dishes + dish clips + burn transitions, seamless loop); the elephant arch follows its clock ---------- */
(function(){
  var v=document.getElementById("fxplv");
  if(!v)return;
  if(matchMedia("(prefers-reduced-motion:reduce)").matches){v.removeAttribute("autoplay");return}
  var vis=true;
  function play(){var p=v.play();p&&p.catch&&p.catch(function(){})}
  var ready=false,live=false,hero=document.getElementById("top");
  function start(){if(live||!ready||!(hero&&hero.classList.contains("go")))return;live=true;try{v.currentTime=2.45}catch(e){}play()}
  v.addEventListener("loadedmetadata",function(){try{v.currentTime=2.45}catch(e){}},{once:true});
  var d=v.getAttribute("data-src"),sm=v.getAttribute("data-src-sm");if(sm&&(matchMedia("(max-width:899px)").matches||(navigator.connection&&navigator.connection.saveData)))d=sm;
  function loaded(){ready=true;start()}
  if(d.indexOf("data:")===0){fetch(d).then(function(r){return r.blob()}).then(function(b){v.src=URL.createObjectURL(b);v.load();loaded()}).catch(function(){v.src=d;loaded()})}else{v.src=d;v.load();loaded()}
  if(hero&&window.MutationObserver)new MutationObserver(start).observe(hero,{attributes:true,attributeFilter:["class"]});
  if("IntersectionObserver"in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis){if(live)play()}else v.pause()}).observe(document.getElementById("top")||v);
  document.addEventListener("visibilitychange",function(){if(document.hidden)v.pause();else if(vis&&live)play()});
})();

/* ---------- 27. intro control: one "Skip intro" opens the site straight away; crawlers, repeat visits and no-JS never see the intro ---------- */
(function(){
  var ids=["heli","intro","gate","lcap"],de=document.documentElement,bot=/bot|crawl|spider|slurp|lighthouse|pagespeed|facebookexternalhit|embedly|whatsapp|telegram|preview|mediapartners/i.test(navigator.userAgent||""),seen=false;
  try{seen=sessionStorage.getItem("fz_seen")==="1"}catch(e){}
  function any(){return ids.some(function(i){return document.getElementById(i)})}
  function skipAll(){ids.forEach(function(i){var e=document.getElementById(i);e&&e.remove()});de.classList.remove("lock");var h=document.getElementById("top");h&&h.classList.add("go");
    try{sessionStorage.setItem("fz_seen","1")}catch(e){}var b=document.getElementById("fxskipall");b&&b.remove();scrollTo(0,0)}
  if(bot||seen){skipAll();return}
  if(!any())return;
  var b=document.createElement("button");b.id="fxskipall";b.type="button";b.textContent="Skip intro";b.setAttribute("aria-label","Skip intro and open the site");b.addEventListener("click",skipAll);document.body.appendChild(b);
  var g=document.getElementById("gatebtn");if(g)g.addEventListener("click",function(){try{sessionStorage.setItem("fz_seen","1")}catch(e){}},true);
  var iv=setInterval(function(){if(!any()){clearInterval(iv);b.remove()}},600);
})();

/* ---------- 28. phone card carousel: current card + dots ---------- */
(function(){var w=document.getElementById("fxcards");if(!w)return;var cs=[].slice.call(w.querySelectorAll(".fx-card")).slice(0,3);if(cs.length<2)return;
  var dots=document.createElement("div");dots.className="fx-dots";dots.setAttribute("aria-hidden","true");cs.forEach(function(){dots.appendChild(document.createElement("i"))});w.parentNode.insertBefore(dots,w.nextSibling);
  var ds=[].slice.call(dots.children),cur=-1,t=0;
  function upd(){t=0;var r=w.getBoundingClientRect(),mid=r.left+r.width/2,b=0,bd=1e9;cs.forEach(function(c,i){var q=c.getBoundingClientRect(),d=Math.abs(q.left+q.width/2-mid);if(d<bd){bd=d;b=i}});
    if(b!==cur){cur=b;cs.forEach(function(c,i){c.classList.toggle("cur",i===b);ds[i].classList.toggle("on",i===b)})}}
  w.addEventListener("scroll",function(){if(!t)t=requestAnimationFrame(upd)},{passive:true});addEventListener("resize",upd);upd();
  ds.forEach(function(d,i){d.addEventListener("click",function(){cs[i].scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"})})});
})();
