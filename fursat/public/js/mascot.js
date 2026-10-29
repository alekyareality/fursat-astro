(function(){
  var root=document.getElementById("ms");if(!root)return;
  var body=document.getElementById("ms-body"),panel=document.getElementById("ms-panel"),bubble=document.getElementById("ms-bubble"),
      feed=document.getElementById("ms-feed"),ticket=document.getElementById("ms-ticket"),say=document.getElementById("ms-say"),
      tilt=document.getElementById("ms-tilt"),copy=document.getElementById("ms-copy"),code=root.getAttribute("data-code"),
      chips=root.querySelectorAll("[data-feed]"),fed={},K="fursat-coupon",calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function get(){try{return localStorage.getItem(K)}catch(e){return null}}
  function put(){try{localStorage.setItem(K,"1")}catch(e){}}
  var timer=0;
  function pose(n,ms){clearTimeout(timer);if(n==="idle")body.removeAttribute("data-pose");else body.setAttribute("data-pose",n);
    if(ms)timer=setTimeout(function(){body.removeAttribute("data-pose")},ms)}
  function stars(){if(calm)return;for(var i=0;i<8;i++){var s=document.createElement("span"),a=i/8*Math.PI*2,d=44+Math.random()*22;
    s.className="ms-star";s.style.setProperty("--sx",Math.cos(a)*d+"px");s.style.setProperty("--sy",Math.sin(a)*d-12+"px");
    s.addEventListener("animationend",function(){this.remove()});body.appendChild(s)}}
  function showTicket(){feed.hidden=true;ticket.hidden=false}
  function open(){panel.hidden=false;body.setAttribute("aria-expanded","true");root.classList.add("is-open");bubble.hidden=true;
    var f=panel.querySelector("button:not([hidden])");if(f)f.focus({preventScroll:true})}
  function close(back){panel.hidden=true;body.setAttribute("aria-expanded","false");root.classList.remove("is-open");if(back)body.focus({preventScroll:true})}
  body.addEventListener("click",function(){panel.hidden?open():close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!panel.hidden)close(true)});
  document.addEventListener("pointerdown",function(e){if(!panel.hidden&&!root.contains(e.target))close()});
  chips.forEach(function(c){c.addEventListener("click",function(){
    var t=c.getAttribute("data-feed");fed[t]=true;c.setAttribute("aria-pressed","true");
        if(fed.drink&&fed.food){put();pose("cheer",1500);stars();say.textContent="Yum! Here is your coupon.";showTicket()}
    else{pose("chew",950);say.textContent=fed.drink?"Tasty! Now some food, please.":"Yum! Now a drink, please."}})});
  copy.addEventListener("click",function(){
    function done(){copy.textContent="Copied";setTimeout(function(){copy.textContent="Copy code"},1600)}
    try{navigator.clipboard.writeText(code).then(done,function(){})}catch(e){}});
  if(get()){showTicket()}
  else setTimeout(function(){if(panel.hidden){bubble.hidden=false;setTimeout(function(){bubble.hidden=true},8000)}},3500);
  if(!calm&&matchMedia("(hover: hover) and (pointer: fine)").matches){
    var raf=0;addEventListener("pointermove",function(e){
      if(raf)return;raf=requestAnimationFrame(function(){raf=0;var r=body.getBoundingClientRect(),
        dx=(e.clientX-(r.left+r.width/2))/260,dy=(e.clientY-(r.top+r.height/2))/260;
        if(Math.abs(dx)>1.4||Math.abs(dy)>1.4){tilt.style.setProperty("--ry","0deg");tilt.style.setProperty("--rx","0deg");return}
        tilt.style.setProperty("--ry",Math.max(-1,Math.min(1,dx))*16+"deg");tilt.style.setProperty("--rx",Math.max(-1,Math.min(1,dy))*-12+"deg")})},{passive:true})}
})();
