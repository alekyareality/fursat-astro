(function(){
  var root=document.getElementById("ms");if(!root)return;
  var body=document.getElementById("ms-body"),panel=document.getElementById("ms-panel"),bubble=document.getElementById("ms-bubble"),
      feed=document.getElementById("ms-feed"),ticket=document.getElementById("ms-ticket"),say=document.getElementById("ms-say"),
      tilt=document.getElementById("ms-tilt"),copy=document.getElementById("ms-copy"),codeEl=document.getElementById("ms-code"),dot=document.getElementById("ms-dot"),
      code=root.getAttribute("data-code"),tray=document.getElementById("ms-tray"),fed={},busy=false,K="fursat-coupon",
      calm=matchMedia("(prefers-reduced-motion: reduce)").matches,timer=0;
  var ICON={drink:'<path d="M5 4h14l-7 8z"/><path d="M12 12v7M8 20h8M13.5 7.5 17 2"/>',food:'<path d="M4 16a8 8 0 0 1 16 0z"/><path d="M3 19.5h18"/><circle cx="12" cy="5.5" r="1.3"/>'};
  function get(){try{return localStorage.getItem(K)}catch(e){return null}}
  function put(){try{localStorage.setItem(K,"1")}catch(e){}}
  function pose(n,ms){clearTimeout(timer);if(n==="idle")body.removeAttribute("data-pose");else body.setAttribute("data-pose",n);
    if(ms)timer=setTimeout(function(){body.removeAttribute("data-pose")},ms)}
  function stars(){if(calm)return;for(var i=0;i<12;i++){var s=document.createElement("span"),a=i/12*Math.PI*2,d=54+Math.random()*34;
    s.className="ms-star";s.style.setProperty("--sx",Math.cos(a)*d+"px");s.style.setProperty("--sy",Math.sin(a)*d-14+"px");
    s.addEventListener("animationend",function(){this.remove()});body.appendChild(s)}}
  function showTicket(focus){feed.hidden=true;ticket.hidden=false;dot.hidden=true;panel.scrollIntoView({block:"end",behavior:calm?"auto":"smooth"});if(focus&&!panel.hidden)copy.focus({preventScroll:true})}
  function open(){panel.hidden=false;body.setAttribute("aria-expanded","true");root.classList.add("is-open");bubble.hidden=true;
    if(get()&&ticket.hidden)showTicket();
    var f=panel.querySelector("button:not([hidden])");if(f&&!ticket.hidden)f.focus({preventScroll:true});else if(f)f.focus({preventScroll:true});
    panel.scrollIntoView({block:"end",behavior:calm?"auto":"smooth"})}
  function close(back){panel.hidden=true;body.setAttribute("aria-expanded","false");root.classList.remove("is-open");if(!get())bubble.hidden=false;if(back)body.focus({preventScroll:true})}
  body.addEventListener("click",function(){panel.hidden?open():close()});
  bubble.addEventListener("click",open);
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!panel.hidden)close(true)});
  document.addEventListener("pointerdown",function(e){if(!panel.hidden&&!root.contains(e.target)&&!(e.target.closest&&e.target.closest(".ms-fly")))close()});
  /* a small drink or dish flies from the button into the elephant's mouth */
  function fly(kind,from,done){
    if(calm){done();return}
    var a=from.getBoundingClientRect(),b=body.getBoundingClientRect(),el=document.createElement("span");
    el.className="ms-fly";el.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[kind]+'</svg>';
    var x0=a.left+a.width/2-22,y0=a.top+a.height/2-22,dx=b.left+b.width/2-22-x0,dy=b.top+b.height*.58-22-y0;
    el.style.transform="translate("+x0+"px,"+y0+"px)";document.body.appendChild(el);
    var an=el.animate([
      {transform:"translate("+x0+"px,"+y0+"px) scale(1) rotate(0deg)",opacity:1},
      {transform:"translate("+(x0+dx*.45)+"px,"+(y0+dy*.45-46)+"px) scale(1.15) rotate(-14deg)",opacity:1,offset:.45},
      {transform:"translate("+(x0+dx)+"px,"+(y0+dy)+"px) scale(.25) rotate(8deg)",opacity:0}
    ],{duration:560,easing:"cubic-bezier(.45,0,.55,1)",fill:"forwards"});
    an.onfinish=an.oncancel=function(){el.remove();done()}}
  var drag=null,suppress=false;
  function hit(x,y){var r=body.getBoundingClientRect(),m=24;return x>r.left-m&&x<r.right+m&&y>r.top-m&&y<r.bottom+m}
  function feast(){
    if(busy||(fed.drink&&fed.food))return;busy=true;
    var r=tray.getBoundingClientRect(),src={getBoundingClientRect:function(){return r}},n=0;
    tray.disabled=true;say.textContent="Ooh, yes please!";
    ["drink","food"].forEach(function(t,k){setTimeout(function(){fly(t,src,function(){
      fed[t]=true;pose("chew",650);n++;
      if(n===2){busy=false;put();pose("cheer",1500);stars();say.textContent="Yum! Here is your coupon.";
        setTimeout(function(){showTicket(true)},calm?0:900)}})},calm?0:k*320)})}
  tray.addEventListener("pointerdown",function(e){
    if(busy||tray.disabled)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false};
    try{tray.setPointerCapture(e.pointerId)}catch(_){}});
  tray.addEventListener("pointermove",function(e){
    if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<6)return;drag.moved=true;tray.setAttribute("data-drag","");
    tray.style.transform="translate("+dx+"px,"+dy+"px) scale(1.06) rotate("+Math.max(-8,Math.min(8,dx/18))+"deg)";
    if(hit(e.clientX,e.clientY))body.setAttribute("data-hot","");else body.removeAttribute("data-hot")});
  function endDrag(e){
    if(!drag||e.pointerId!==drag.id)return;var d=drag;drag=null;body.removeAttribute("data-hot");
    if(!d.moved)return;suppress=true;setTimeout(function(){suppress=false},60);
    var ok=e.type==="pointerup"&&hit(e.clientX,e.clientY);
    if(ok)feast();
    tray.removeAttribute("data-drag");tray.style.transform=""}
  tray.addEventListener("pointerup",endDrag);tray.addEventListener("pointercancel",endDrag);
  tray.addEventListener("click",function(){if(suppress)return;feast()});
  copy.addEventListener("click",function(){
    function done(){copy.textContent="Copied";setTimeout(function(){copy.textContent="Copy code"},1600)}
    function fallback(){try{var r=document.createRange();r.selectNodeContents(codeEl);var s=getSelection();s.removeAllRanges();s.addRange(r);
      if(document.execCommand("copy"))done();else copy.textContent="Press and hold the code"}catch(e){}}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(code).then(done,fallback);else fallback()});
  if(get()){dot.hidden=true}
  if(get())bubble.hidden=true;
  if("IntersectionObserver" in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){root.classList.add("is-in");o.disconnect()}})},{threshold:.3}).observe(root);else root.classList.add("is-in");
  if(!calm&&matchMedia("(hover: hover) and (pointer: fine)").matches){
    var raf=0;addEventListener("pointermove",function(e){
      if(raf)return;raf=requestAnimationFrame(function(){raf=0;var r=body.getBoundingClientRect(),
        dx=(e.clientX-(r.left+r.width/2))/260,dy=(e.clientY-(r.top+r.height/2))/260;
        if(Math.abs(dx)>1.4||Math.abs(dy)>1.4){tilt.style.setProperty("--ry","0deg");tilt.style.setProperty("--rx","0deg");return}
        tilt.style.setProperty("--ry",Math.max(-1,Math.min(1,dx))*16+"deg");tilt.style.setProperty("--rx",Math.max(-1,Math.min(1,dy))*-12+"deg")})},{passive:true})}
})();
