/* ---------- 29. hero dish names: label follows the baked hero video's own clock ----------
   Edit CLIPS if the video is re-rendered. t0/t1 = seconds in hero-master-v2.mp4. No entry = no label (elephant intro/outro).
   data-dish on #fxdn carries the current dish name, ready for a later "click -> menu page" route. */
(function(){
  var v=document.getElementById("fxplv"),box=document.getElementById("fxdn"),nm=document.getElementById("fxdn-n"),bar=document.getElementById("fxdn-b");
  if(!v||!box||!nm)return;
  var CLIPS=[
    {t0:2.4, t1:4.3, n:"Ustad Nalli Gosht Biryani"},
    {t0:4.3, t1:8.0, n:"Life Fursat Bhai"},
    {t0:8.0, t1:11.7,n:"Death By Chocolate"},
    {t0:11.7,t1:15.4,n:"Life Fursat Bhai"},
    {t0:15.4,t1:19.6,n:"Fursat Rahasyam"},
    {t0:19.6,t1:22.75,n:"Iced Latte"},
    {t0:22.75,t1:27.8,n:"Cafe Latte"},
    {t0:27.8,t1:32.3,n:"Hot Cappuccino"}
  ];
  var calm=matchMedia("(prefers-reduced-motion:reduce)").matches,cur=-2,raf=0,tok=0,EASE="cubic-bezier(.23,1,.32,1)";
  function find(t){for(var i=0;i<CLIPS.length;i++)if(t>=CLIPS[i].t0&&t<CLIPS[i].t1)return i;return -1}
  function words(n){nm.textContent="";n.split(" ").forEach(function(w,k,a){var s=document.createElement("span");s.textContent=w;if(k<a.length-1)s.style.marginRight=".26em";nm.appendChild(s)})}
  function enter(n,first){
    words(n);box.dataset.dish=n;box.hidden=false;
    if(!nm.firstChild.animate)return;
    if(calm){nm.animate([{opacity:0},{opacity:1}],{duration:160,easing:"ease"});return}
    /* Emil: strong ease-out, blur masks the swap, small travel, stagger so it reads as one gesture */
    [].forEach.call(nm.children,function(s,k){s.animate([{opacity:0,transform:"translateY(.55em)",filter:"blur(4px)"},{opacity:1,transform:"none",filter:"blur(0)"}],{duration:280,delay:k*40,easing:EASE,fill:"backwards"})});
    if(first)box.animate([{opacity:0,transform:"translateY(10px) scale(.97)"},{opacity:1,transform:"none"}],{duration:240,easing:EASE})
  }
  function leave(done){
    if(calm||!nm.firstChild||!nm.firstChild.animate){done();return}
    var last;[].forEach.call(nm.children,function(s){last=s.animate([{opacity:1,transform:"none",filter:"blur(0)"},{opacity:0,transform:"translateY(-.3em)",filter:"blur(2px)"}],{duration:100,easing:EASE,fill:"forwards"})});
    last.finished.then(done,done)
  }
  function show(i){
    if(i===cur)return;
    var prev=cur;cur=i;var my=++tok;
    if(prev>=0&&i>=0&&CLIPS[prev].n===CLIPS[i].n)return;     /* same dish continues: label stays still */
    if(i<0){leave(function(){if(my!==tok)return;if(calm){box.hidden=true;return}var a=box.animate([{opacity:1},{opacity:0}],{duration:160,easing:"ease-out",fill:"forwards"});a.finished.then(function(){if(my===tok)box.hidden=true;a.cancel()},function(){})});return}
    if(box.hidden||prev<0){box.getAnimations&&box.getAnimations().forEach(function(a){a.cancel()});enter(CLIPS[i].n,true);return}
    leave(function(){if(my!==tok)return;enter(CLIPS[i].n,false)})
  }
  function tick(){
    var t=v.currentTime,i=find(t);show(i);
    if(i>=0&&bar)bar.style.transform="scaleX("+Math.min(1,(t-CLIPS[i].t0)/(CLIPS[i].t1-CLIPS[i].t0)).toFixed(3)+")";
    raf=v.paused?0:requestAnimationFrame(tick)
  }
  function kick(){if(!raf)raf=requestAnimationFrame(tick)}
  v.addEventListener("playing",kick);
  v.addEventListener("seeked",function(){tick()});
  v.addEventListener("pause",function(){cancelAnimationFrame(raf);raf=0});
  if(!v.paused)kick();
})();
