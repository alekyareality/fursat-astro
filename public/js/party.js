(function(){
  var calm=matchMedia("(prefers-reduced-motion: reduce)").matches,host=document.getElementById("pa-host"),stage=host&&host.querySelector(".pa-stage"),pt=0;
  var pkg=document.getElementById("pa-pkg"),n=document.getElementById("pa-n"),total=document.getElementById("pa-total"),wa=document.getElementById("pa-wa"),WA="919059670033";
  function pose(p,ms){if(!host)return;clearTimeout(pt);host.setAttribute("data-pose",p);if(ms)pt=setTimeout(function(){host.setAttribute("data-pose","idle")},ms)}
  function stars(){if(calm||!stage)return;for(var i=0;i<8;i++){var s=document.createElement("span"),a=i/8*Math.PI*2,d=56+Math.random()*24;s.className="pa-star";s.style.setProperty("--sx",Math.cos(a)*d+"px");s.style.setProperty("--sy",Math.sin(a)*d-14+"px");s.addEventListener("animationend",function(){this.remove()});stage.appendChild(s)}}
  function inr(v){return"\u20b9"+Math.round(v).toLocaleString("en-IN")}
  function guests(){var v=parseInt(n.value,10);return isNaN(v)?0:Math.max(0,Math.min(500,v))}
  function update(){if(!pkg||!n)return;var o=pkg.options[pkg.selectedIndex],price=+o.getAttribute("data-price"),g=guests(),name=o.textContent.split(" \u2013 ")[0];
    total.textContent=g?"About "+inr(price*g)+" + taxes":"Enter the number of guests";
    wa.href="https://wa.me/"+WA+"?text="+encodeURIComponent("Hi Fursat! I would like to plan a party. Package: "+name+" ("+inr(price)+" + taxes per guest). Guests: "+(g||"to be confirmed")+". Estimate: "+(g?inr(price*g)+" + taxes":"-")+".")}
  if(pkg&&n){pkg.addEventListener("change",function(){update();window.dispatchEvent(new CustomEvent("fursat:pkg"))});n.addEventListener("input",update);
    document.getElementById("pa-minus").addEventListener("click",function(){n.value=Math.max(1,guests()-1);update()});
    document.getElementById("pa-plus").addEventListener("click",function(){n.value=Math.min(500,guests()+1);update()});update()}
  document.querySelectorAll("[data-plan]").forEach(function(b){b.addEventListener("click",function(){
    if(pkg){pkg.value=b.getAttribute("data-plan");update()}
    pose("cheer",1500);stars();window.dispatchEvent(new CustomEvent("fursat:plan"));var t=document.getElementById("pa-plan");if(t)t.scrollIntoView({behavior:calm?"auto":"smooth",block:"start"});if(n)n.focus({preventScroll:true})})});
  var tabs=document.querySelectorAll("[data-tab]"),groups=document.querySelectorAll("[data-group].pa-group");
  tabs.forEach(function(t){t.addEventListener("click",function(){var id=t.getAttribute("data-tab");
    tabs.forEach(function(x){x.setAttribute("aria-pressed",x===t?"true":"false")});
    groups.forEach(function(g){var on=g.getAttribute("data-group")===id;g.hidden=!on;if(on){var r=g.querySelector(".pk-row");if(r)r.scrollLeft=0}})})});
  if(!calm&&matchMedia("(hover: hover) and (pointer: fine)").matches){
    document.querySelectorAll(".pk").forEach(function(c){var f=c.querySelector(".pk-face"),raf=0;
      c.addEventListener("pointermove",function(e){if(raf)return;raf=requestAnimationFrame(function(){raf=0;var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        f.style.setProperty("--ry",x*10+"deg");f.style.setProperty("--rx",y*-8+"deg")})});
      c.addEventListener("pointerleave",function(){f.style.setProperty("--ry","0deg");f.style.setProperty("--rx","0deg")})})}
  if(!calm&&stage&&matchMedia("(hover: hover) and (pointer: fine)").matches){var raf2=0;
    function look(x,y){var r=stage.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=Math.max(-1,Math.min(1,(x-cx)/(innerWidth/2))),dy=Math.max(-1,Math.min(1,(y-cy)/(innerHeight/2)));
      stage.style.setProperty("--ry",dx*8+"deg");stage.style.setProperty("--rx",dy*-5+"deg");stage.style.setProperty("--sh",dx*-6+"px")}
    window.addEventListener("pointermove",function(e){if(raf2)return;raf2=requestAnimationFrame(function(){raf2=0;look(e.clientX,e.clientY)})},{passive:true});
    document.documentElement.addEventListener("pointerleave",function(){stage.style.setProperty("--ry","0deg");stage.style.setProperty("--rx","0deg");stage.style.setProperty("--sh","0px")})}
})();
