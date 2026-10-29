/* ---------- 30. Instagram reels stage: centre card plays muted, tap it for sound, neighbours peek; loads only what is near, pauses offscreen ---------- */
(function(){
  var root=document.getElementById("reels"),track=document.getElementById("rl-track");
  if(!root||!track)return;
  var cards=[].slice.call(track.querySelectorAll(".rl-card")),prev=document.getElementById("rl-prev"),next=document.getElementById("rl-next"),live=document.getElementById("rl-live");
  var calm=matchMedia("(prefers-reduced-motion:reduce)").matches,saver=!!(navigator.connection&&navigator.connection.saveData),auto=!calm&&!saver;
  var active=-1,shown=-1,inView=false,raf=0,settle=0;
  root.classList.add("js");document.documentElement.classList.add("js");
  function vid(c){return c.querySelector("video")}
  function setS(c,s){
    c.setAttribute("data-s",s);var b=c.querySelector(".rl-snd");if(!b)return;
    b.setAttribute("aria-label",s==="sound"?"Turn sound off":s==="paused"?"Play with sound":"Turn sound on")
  }
  function ensure(i,how){
    var c=cards[i];if(!c)return;var v=vid(c);if(!v)return;
    if(!v.getAttribute("src")){v.setAttribute("src",v.getAttribute("data-src"));v.preload=how||"metadata";
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
  function activate(i){
    if(i===active)return;
    active=i;stopOthers(i);
    ensure(i,"auto");ensure(i+1);ensure(i-1);
    if(live)live.textContent="Reel "+(i+1)+" of "+cards.length+": "+cards[i].querySelector(".rl-n").textContent;
    sync(true)
  }
  function sync(fromStart){
    if(active<0)return;var v=vid(cards[active]);if(!v)return;
    if(inView&&auto&&!document.hidden){if(v.paused)play(active,fromStart)}
    else if(!v.paused)v.pause()
  }
  function centre(){
    var r=track.getBoundingClientRect(),mid=r.left+r.width/2,best=0,bd=1e9;
    cards.forEach(function(c,i){var b=c.getBoundingClientRect(),d=Math.abs(b.left+b.width/2-mid);if(d<bd){bd=d;best=i}});
    return best
  }
  function paint(i){
    shown=i;
    cards.forEach(function(c,k){c.classList.toggle("is-active",k===i)});
    prev.disabled=i<=0;next.disabled=i>=cards.length-1
  }
  function go(i,instant){
    i=Math.max(0,Math.min(cards.length-1,i));var c=cards[i];
    track.scrollTo({left:c.offsetLeft-(track.clientWidth-c.offsetWidth)/2,behavior:calm||instant?"auto":"smooth"})
  }
  function onScroll(){
    if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;var i=centre();if(i!==shown)paint(i);clearTimeout(settle);settle=setTimeout(function(){activate(shown)},140)})
  }
  track.addEventListener("scroll",onScroll,{passive:true});
  prev.addEventListener("click",function(){go(shown-1)});
  next.addEventListener("click",function(){go(shown+1)});
  track.addEventListener("keydown",function(e){
    if(e.key==="ArrowRight"){e.preventDefault();go(shown+1,true)}
    else if(e.key==="ArrowLeft"){e.preventDefault();go(shown-1,true)}
  });
  cards.forEach(function(c,i){
    var f=c.querySelector(".rl-frame");
    f.addEventListener("click",function(){
      if(i!==shown){go(i);return}
      var v=vid(c);if(!v)return;
      if(v.paused){ensure(i,"auto");v.muted=false;var p=v.play();p&&p.catch&&p.catch(function(){});setS(c,"sound")}
      else{v.muted=!v.muted;setS(c,v.muted?"muted":"sound")}
    })
  });
  paint(0);
  /* entrance + visibility */
  if("IntersectionObserver" in window){
    new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting)root.classList.add("rl-in");
      inView=e.intersectionRatio>=.35;
      if(active<0&&inView)activate(shown);else sync(false)
    })},{threshold:[0,.2,.35,.6]}).observe(root)
  }else{root.classList.add("rl-in");inView=true;activate(0)}
  document.addEventListener("visibilitychange",function(){sync(false)});
})();
