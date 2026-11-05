(function(){
  var calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  // sliding underline under the Food / Drinks / Sreemukhi tabs
  var tabs=document.querySelector(".ac-tabs"),ind=tabs&&tabs.querySelector(".ac-ind");
  function place(){
    var b=tabs.querySelector("[aria-pressed=true]");if(!b)return;
    ind.style.transform="translateX("+b.offsetLeft+"px) scaleX("+b.offsetWidth+")";
  }
  if(tabs&&ind){
    tabs.classList.add("fx");place();
    requestAnimationFrame(function(){requestAnimationFrame(function(){if(!calm)tabs.classList.add("on")})});
    tabs.addEventListener("click",function(){requestAnimationFrame(place)});
    addEventListener("resize",place);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
  }
  // soft light that follows the mouse across each mood chip
  document.querySelectorAll(".ac-chips button").forEach(function(c){
    c.addEventListener("pointermove",function(e){
      if(e.pointerType!=="mouse")return;
      var r=c.getBoundingClientRect();
      c.style.setProperty("--mx",(e.clientX-r.left)+"px");
      c.style.setProperty("--my",(e.clientY-r.top)+"px");
    });
  });
})();
