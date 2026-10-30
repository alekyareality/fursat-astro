/* mascot panel: open upward and stay on screen, close on outside click / Esc */
(function(){
  var ms=document.getElementById("ms"),pn=document.getElementById("ms-panel"),bd=document.getElementById("ms-body");
  if(!ms||!pn||!bd)return;
  var st=document.createElement("style");
  st.textContent=".ms-panel{position:absolute!important;right:0;left:auto!important;top:auto!important;bottom:calc(100% + 10px);width:min(92vw,340px);max-height:min(70vh,520px);overflow:auto;overscroll-behavior:contain;z-index:41}"+
    "@media(max-width:600px){.ms{right:8px!important}.ms-panel{width:min(94vw,340px)}}";
  document.head.appendChild(st);
  function close(){if(!pn.hidden&&bd.getAttribute("aria-expanded")==="true")bd.click();else if(!pn.hidden)pn.hidden=true}
  document.addEventListener("click",function(e){if(pn.hidden)return;if(ms.contains(e.target))return;close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!pn.hidden){close();bd.focus()}});
})();
