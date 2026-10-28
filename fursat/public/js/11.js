(function(){var g=document.getElementById("gate"),btn=document.getElementById("gatebtn");if(!g)return;
if(!window.__fzGo){g.remove();return}
var started=false,shown=false;
function start(){if(started)return;started=true;g.classList.remove("on");g.classList.add("out");setTimeout(function(){g.remove()},700);window.__fzGo()}
function show(){if(started||shown)return;shown=true;g.classList.add("on");try{btn.focus({preventScroll:true})}catch(e){}}
window.__fzOnV=function(ok){ok?start():show()};
if(window.__fzV!==undefined)window.__fzOnV(window.__fzV);
setTimeout(function(){if(!started&&!shown)show()},900);
btn.addEventListener("click",start);
})();