/* ---------- 31. hero: after the master video ends, play the reels, then restart the master ---------- */
(function(){
  var v=document.getElementById("fxplv"),pl=document.getElementById("fxpl");
  if(!v||!pl)return;
  if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var LIST=[
    "/assets/reels/reel-fursat-happened-v1.mp4",
    "/assets/reels/reel-dynamite-prawns-v1.mp4",
    "/assets/reels/reel-veg-combo-v1.mp4",
    "/assets/reels/reel-inside-fursat-v1.mp4"
  ];
  var st=document.createElement("style");
  st.textContent=".fx-rl{position:absolute;inset:0;z-index:3;display:flex;justify-content:center;align-items:center;background:rgba(10,14,8,.62);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .5s,visibility 0s .5s}"+
    ".fx-rl.on{opacity:1;visibility:visible;transition:opacity .5s}"+
    ".fx-rl video{height:90%;aspect-ratio:9/16;object-fit:cover;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.45)}"+
    "@media(min-width:900px){.fx-rl{justify-content:flex-end;padding-right:6vw}}";
  document.head.appendChild(st);
  var box=document.createElement("div");box.className="fx-rl";box.setAttribute("aria-hidden","true");
  var r=document.createElement("video");
  r.muted=true;r.playsInline=true;r.preload="none";r.disablePictureInPicture=true;
  r.setAttribute("playsinline","");r.setAttribute("webkit-playsinline","");
  box.appendChild(r);pl.appendChild(box);
  var i=0,on=false;
  function userPaused(){var b=document.getElementById("fxpv");return !!(b&&b.dataset.s==="paused")}
  function load(n){r.src=LIST[n];r.load()}
  function playR(){var p=r.play();if(p&&p.catch)p.catch(next)}
  function begin(){on=true;i=0;load(0);box.classList.add("on");playR()}
  function next(){if(!on)return;i++;if(i>=LIST.length){finish();return}load(i);playR()}
  function finish(){on=false;box.classList.remove("on");r.pause();r.removeAttribute("src");r.load();try{v.currentTime=2.45}catch(e){}var p=v.play();if(p&&p.catch)p.catch(function(){})}
  v.loop=false;
  v.addEventListener("ended",begin);
  r.addEventListener("ended",next);
  r.addEventListener("error",next);
  var b=document.getElementById("fxpv");
  if(b)b.addEventListener("click",function(){if(!on)return;if(userPaused())r.pause();else playR()});
  if("IntersectionObserver" in window)new IntersectionObserver(function(es){if(!on)return;if(es[0].isIntersecting){if(!userPaused())playR()}else r.pause()}).observe(document.getElementById("top")||pl);
  document.addEventListener("visibilitychange",function(){if(!on)return;if(document.hidden)r.pause();else if(!userPaused())playR()});
})();
