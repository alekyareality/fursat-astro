/* ---------- 30. magnetic hero buttons (decorative; mouse only; ≤6px; eases home on leave) ---------- */
(function(){
  if(!matchMedia("(hover:hover) and (pointer:fine)").matches||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
  var els=[].slice.call(document.querySelectorAll(".fx-btns .pill,.fx-btns .fx-ghost,.fx-reserve"));
  els.forEach(function(el){
    var tx=0,ty=0,x=0,y=0,raf=0;
    function loop(){x+=(tx-x)*.16;y+=(ty-y)*.16;el.style.translate=x.toFixed(2)+"px "+y.toFixed(2)+"px";
      if(Math.abs(tx-x)<.05&&Math.abs(ty-y)<.05&&tx===0&&ty===0){el.style.translate="";raf=0;return}raf=requestAnimationFrame(loop)}
    function go(){if(!raf)raf=requestAnimationFrame(loop)}
    el.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;var r=el.getBoundingClientRect(),k=Math.min(6,Math.max(3,r.width*.04));
      tx=Math.max(-k,Math.min(k,(e.clientX-(r.left+r.width/2))*.18));ty=Math.max(-k,Math.min(k,(e.clientY-(r.top+r.height/2))*.18));go()});
    el.addEventListener("pointerleave",function(){tx=0;ty=0;go()});
  })
})();
