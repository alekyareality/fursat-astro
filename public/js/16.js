/* ---------- 30. Instagram reels: slow right-to-left drift. Each reel floats in on a gentle wave, swells toward the visitor as it reaches the centre, plays muted, then drifts on.
   The section colour cross-fades between each reel's data-tone. Drag or swipe, arrows, thumbnails and tap-for-sound all still work.
   Tune the feel with the three numbers just below. ---------- */
(function(){
  var SPEED=.22;   /* cards per second at full drift (lower = slower) */
  var DWELL=.15;   /* 0..1: how much the drift slows while a reel is centred (lower = it lingers longer) */
  var GAP=.82;     /* spacing between reels as a fraction of one card width */

  var root=document.getElementById("reels"),track=document.getElementById("rl-track");
  if(!root||!track)return;
  var cards=[].slice.call(track.querySelectorAll(".rl-card")),n=cards.length;
  if(!n)return;
  var prev=document.getElementById("rl-prev"),next=document.getElementById("rl-next"),live=document.getElementById("rl-live"),cur=document.getElementById("rl-cur");
  var rail=[].slice.call(root.querySelectorAll(".rl-th"));
  var calm=matchMedia("(prefers-reduced-motion:reduce)").matches,
      saver=!!(navigator.connection&&navigator.connection.saveData),
      lite=(navigator.hardwareConcurrency||8)<=4||(navigator.deviceMemory||8)<=4,
      auto=!calm&&!saver;
  var pos=0,target=null,active=-1,inView=false,raf=0,last=0,resumeAt=0,skip=false,W=260;
  var hovered=-1,focusHold=false,dragging=false,dragged=false,flick=[];
  var tones=cards.map(function(c){return c.getAttribute("data-tone")||"#17200F"});
  var lastO=[],lastZ=[],lastV=[];

  root.classList.add("js","dr");if(lite)root.classList.add("lite");document.documentElement.classList.add("js");

  /* background: one colour layer per reel, cross-faded by opacity (cheap for the GPU), plus two slow waves */
  var bgs=document.createElement("div");bgs.className="rl-bgs";bgs.setAttribute("aria-hidden","true");
  var layers=tones.map(function(t){var i=document.createElement("i");i.style.background=t;bgs.appendChild(i);return i});
  var wv=document.createElement("div");wv.className="rl-wv";wv.setAttribute("aria-hidden","true");wv.innerHTML="<i></i><i></i>";
  root.insertBefore(wv,root.firstChild);root.insertBefore(bgs,root.firstChild);

  function mod(a,m){return((a%m)+m)%m}
  function wrap(d){d=mod(d+n/2,n)-n/2;return d}
  function ss(x){return x<=0?0:x>=1?1:x*x*(3-2*x)}
  function vid(c){return c.querySelector("video")}
  function setS(c,s){
    c.setAttribute("data-s",s);var b=c.querySelector(".rl-snd");if(!b)return;
    b.setAttribute("aria-label",s==="sound"?"Turn sound off":s==="paused"?"Play with sound":"Turn sound on")
  }
  /* ---- video: load only what is near, one plays at a time, pause offscreen ---- */
  function ensure(i,how){
    var c=cards[mod(i,n)];if(!c)return;var v=vid(c);if(!v)return;
    if(!v.getAttribute("src")){v.setAttribute("src",v.getAttribute("data-src"));v.preload=how||"metadata";
      v.addEventListener("error",function(){v.removeAttribute("src");setS(c,"paused")});
      var bar=c.querySelector(".rl-bar i");
      v.addEventListener("timeupdate",function(){if(bar&&v.duration)bar.style.transform="scaleX("+Math.min(1,v.currentTime/v.duration).toFixed(3)+")"});
    }else if(how==="auto")v.preload="auto"
  }
  function play(i,fromStart){
    var c=cards[i],v=vid(c);if(!v)return;ensure(i,"auto");
    if(fromStart){try{v.currentTime=0}catch(e){}}
    v.muted=true;setS(c,"muted");
    var p=v.play();if(p&&p.catch)p.catch(function(){setS(c,"paused")})
  }
  function stopOthers(keep){
    cards.forEach(function(c,k){if(k===keep)return;var v=vid(c);if(!v)return;if(!v.paused)v.pause();v.muted=true;setS(c,"muted")})
  }
  function sync(fromStart){
    if(active<0)return;var v=vid(cards[active]);if(!v)return;
    if(inView&&auto&&!document.hidden){if(v.paused)play(active,fromStart)}
    else{
      if(!v.paused)v.pause();
      var c=cards[active];if(!auto&&v.paused&&c.getAttribute("data-s")==="muted")setS(c,"paused")
    }
  }
  function paint(i){
    cards.forEach(function(c,k){c.classList.toggle("is-active",k===i)});
    if(cur)cur.textContent=("0"+(i+1)).slice(-2);
    rail.forEach(function(b,k){b.setAttribute("aria-current",k===i?"true":"false")});
    root.style.setProperty("--rl-bg",tones[i])
  }
  function activate(i){
    if(i===active)return;
    active=i;stopOthers(i);paint(i);
    ensure(i,"auto");ensure(i+1);ensure(i-1);
    if(live)live.textContent="Reel "+(i+1)+" of "+n+": "+cards[i].querySelector(".rl-n").textContent;
    sync(true)
  }

  /* ---- layout: every frame, place each card from its distance d to the centre ---- */
  function tint(){
    var base=Math.floor(pos),t=pos-base,i0=mod(base,n),i1=mod(base+1,n);
    var s=t<.3?0:t>.7?1:ss((t-.3)/.4);   /* hold the colour while a reel is centred, blend between them */
    for(var k=0;k<n;k++){
      var o=n<2?1:k===i1?1:k===i0?1-s:0,z=k===i0?2:k===i1?1:0;
      o=Math.round(o*100)/100;
      if(lastO[k]!==o){layers[k].style.opacity=o;lastO[k]=o}
      if(lastZ[k]!==z){layers[k].style.zIndex=z;lastZ[k]=z}
    }
  }
  function render(now){
    var still=calm||lite;
    for(var k=0;k<n;k++){
      var d=wrap(k-pos),a=Math.abs(d),near=Math.min(a,1),c=cards[k];
      var x=d*W*GAP,s=1.07-.29*near-.08*Math.max(0,a-1);
      var r=Math.max(-1.4,Math.min(1.4,d))*20;
      var y=still?0:Math.sin(now*.0011+k*1.9+d*.9)*8,rz=still?0:Math.sin(now*.0008+k*2.3)*1.1;
      var o=a<=1?1-.4*a:Math.max(0,.6*(1-(a-1)/.85));
      c.style.transform="translate3d("+x.toFixed(1)+"px,"+y.toFixed(1)+"px,0) rotateY("+r.toFixed(1)+"deg) rotateZ("+rz.toFixed(2)+"deg) scale("+s.toFixed(3)+")";
      c.style.opacity=o.toFixed(2);
      var z=(100-a*20)|0;if(lastV[k]!==z){c.style.zIndex=z;lastV[k]=z}
      var hide=o<.02;if(c._h!==hide){c._h=hide;c.style.visibility=hide?"hidden":"";c.style.pointerEvents=hide||a>1.3?"none":""}
    }
    tint();
    var i=mod(Math.round(pos),n);if(i!==active&&(inView||active>=0))activate(i)
  }

  /* ---- the drift ---- */
  function soundOn(){return active>=0&&cards[active].getAttribute("data-s")==="sound"}
  function drifting(now){return !calm&&now>=resumeAt&&!dragging&&hovered!==active&&!focusHold&&!soundOn()}
  function running(){return inView&&!document.hidden&&!calm}
  function tick(now){
    raf=0;if(!running())return;
    var dt=Math.min(.05,(now-last)/1000||0);last=now;
    if(target!==null){
      pos+=(target-pos)*(1-Math.exp(-dt*5.5));
      if(Math.abs(target-pos)<.003){pos=target;target=null;resumeAt=now+2600}
    }else if(drifting(now)){
      var e=Math.abs(pos-Math.round(pos));
      pos+=SPEED*(DWELL+(1-DWELL)*ss(e/.3))*dt
    }
    if(lite){skip=!skip;if(skip){raf=requestAnimationFrame(tick);return}}
    render(now);raf=requestAnimationFrame(tick)
  }
  function kick(){if(!raf&&running()){last=performance.now();raf=requestAnimationFrame(tick)}}
  function go(i,instant){
    var base=Math.round(pos),tg=base+wrap(i-base);
    resumeAt=performance.now()+3000;
    if(calm||instant||!inView){pos=tg;target=null;render(performance.now());sync(true)}
    else{target=tg;kick()}
  }
  function step(dir){
    var base=target!==null?target:Math.round(pos);
    resumeAt=performance.now()+3000;
    if(calm||!inView){pos=base+dir;target=null;render(performance.now());sync(true)}
    else{target=base+dir;kick()}
  }

  /* ---- input: drag or swipe, buttons, keys, thumbnails, tap ---- */
  function mv(e){
    var dx=e.clientX-flick.sx;
    if(Math.abs(dx)>6)dragged=true;
    if(dragged){pos=flick.p0-dx/(W*GAP);flick.h.push([e.timeStamp,e.clientX]);if(flick.h.length>6)flick.h.shift();if(calm)render(performance.now())}
  }
  function up(){
    removeEventListener("pointermove",mv);removeEventListener("pointerup",up);removeEventListener("pointercancel",up);
    dragging=false;resumeAt=performance.now()+3000;
    if(!dragged)return;
    var h=flick.h,v=0;
    if(h.length>1){var a=h[0],b=h[h.length-1],dt=(b[0]-a[0])/1000;if(dt>0)v=-((b[1]-a[1])/dt)/(W*GAP)}
    var tg=Math.round(pos+Math.max(-.6,Math.min(.6,v*.12)));
    if(calm){pos=tg;render(performance.now());sync(true)}else{target=tg;kick()}
  }
  track.addEventListener("pointerdown",function(e){
    if(e.button>0)return;
    dragging=true;dragged=false;target=null;flick={sx:e.clientX,p0:pos,h:[[e.timeStamp,e.clientX]]};
    addEventListener("pointermove",mv);addEventListener("pointerup",up);addEventListener("pointercancel",up)
  });
  prev.addEventListener("click",function(){step(-1)});
  next.addEventListener("click",function(){step(1)});
  rail.forEach(function(b,k){b.addEventListener("click",function(){go(k)})});
  track.addEventListener("keydown",function(e){
    if(e.key==="ArrowRight"){e.preventDefault();step(1)}
    else if(e.key==="ArrowLeft"){e.preventDefault();step(-1)}
  });
  track.addEventListener("focusin",function(e){focusHold=!!(e.target.matches&&e.target.matches(":focus-visible"))});
  track.addEventListener("focusout",function(){focusHold=false});
  cards.forEach(function(c,i){
    var f=c.querySelector(".rl-frame");
    f.addEventListener("click",function(){
      if(dragged){dragged=false;return}
      if(i!==active){go(i);return}
      var v=vid(c);if(!v)return;
      if(v.paused){ensure(i,"auto");v.muted=false;var p=v.play();p&&p.catch&&p.catch(function(){});setS(c,"sound")}
      else{v.muted=!v.muted;setS(c,v.muted?"muted":"sound")}
    });
    f.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse")hovered=i});
    f.addEventListener("pointerleave",function(){if(hovered===i)hovered=-1});
  });
  if(!calm&&matchMedia("(hover:hover) and (pointer:fine)").matches)cards.forEach(function(c,k){
    var f=c.querySelector(".rl-frame");
    f.addEventListener("pointermove",function(e){if(k!==active)return;var b=f.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;
      f.style.setProperty("--ry",((x-.5)*12).toFixed(2)+"deg");f.style.setProperty("--rx",((.5-y)*10).toFixed(2)+"deg");
      f.style.setProperty("--gx",(x*100).toFixed(1)+"%");f.style.setProperty("--gy",(y*100).toFixed(1)+"%")});
    f.addEventListener("pointerleave",function(){["--rx","--ry"].forEach(function(p){f.style.removeProperty(p)})})
  });

  function measure(){W=cards[0].offsetWidth||W;render(performance.now())}
  paint(0);measure();addEventListener("resize",measure);addEventListener("load",measure);

  /* ---- entrance + only run while the stage is on screen ---- */
  if("IntersectionObserver" in window){
    new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)root.classList.add("rl-in")})},{threshold:[0,.2]}).observe(root);
    new IntersectionObserver(function(es){es.forEach(function(e){
      inView=e.intersectionRatio>=.35;
      if(inView){if(active<0)activate(mod(Math.round(pos),n));kick()}
      sync(false)
    })},{threshold:[0,.35,.6]}).observe(track.parentNode)
  }else{root.classList.add("rl-in");inView=true;activate(0);kick()}
  document.addEventListener("visibilitychange",function(){sync(false);kick()});
})();
