(function(){
var WA="919059670033",$=function(i){return document.getElementById(i)},d=$("wz"),f=$("wz-f");if(!d||!f)return;
var lg=document.querySelector(".top .brand");if(lg)$("wz-logo").src=lg.src;
var n=$("wz-n"),m=$("wz-m"),o=$("wz-o"),pv=$("wz-pv"),er=$("wz-e"),go=$("wz-go"),last=null;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}}
function digits(){var x=m.value.replace(/\D/g,"");if(x.length>10&&x.indexOf("91")===0)x=x.slice(2);if(x.length===11&&x[0]==="0")x=x.slice(1);return x}
function picks(){return Array.prototype.map.call(f.querySelectorAll("input[name=wzi]:checked"),function(c){return c.value})}
function msg(direct){if(direct)return"Hi Fursat! I would like to know more.";var p=picks(),t=["Hi Fursat! 👋 I’m "+(n.value.trim()||"…")+"."];
 t.push(p.length?"I’m interested in: "+p.join(", ")+".":"I’d like to know more about Fursat.");if(o.value.trim())t.push(o.value.trim());var x=digits();if(x)t.push("My number: +91 "+x.slice(0,5)+" "+x.slice(5));return t.join("\n")}
function pre(){pv.textContent=msg()}
function bad(el,text){el.classList.remove("bad");void el.offsetWidth;el.classList.add("bad");er.textContent=text}
function open_(pick){last=document.activeElement;f.reset();d.classList.remove("sent","out");
 var sn=ls("fz_n"),sm=ls("fz_m");if(sn)n.value=sn;if(sm)m.value=sm;
 (pick||[]).forEach(function(v){var c=f.querySelector('input[value="'+v+'"]');if(c)c.checked=true});
 er.textContent="";go.disabled=false;pre();if(!d.open)(d.showModal?d.showModal():d.setAttribute("open",""));setTimeout(function(){(n.value?m:n).focus({preventScroll:true})},60)}
function close_(){if(!d.open)return;d.classList.add("out");setTimeout(function(){d.classList.remove("out");d.close&&d.close();if(last&&last.focus)try{last.focus()}catch(e){}},210)}
function launch(text){var u="https://wa.me/"+WA+"?text="+encodeURIComponent(text),a=document.createElement("a");a.href=u;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();if(navigator.vibrate)try{navigator.vibrate(14)}catch(e){}}
f.addEventListener("input",function(e){if(e.target===n)$("wz-nf").classList.remove("bad");if(e.target===m){$("wz-mf").classList.remove("bad");var x=m.value.replace(/[^\d+ ]/g,"");if(x!==m.value)m.value=x}er.textContent="";pre()});
f.addEventListener("change",pre);
f.addEventListener("submit",function(e){e.preventDefault();var nm=n.value.trim();
 if(nm.length<2){bad($("wz-nf"),"Please tell us your name so we can greet you.");n.focus();return}
 var x=digits();if(x&&!/^[6-9]\d{9}$/.test(x)){bad($("wz-mf"),"Enter a valid 10-digit mobile number, or leave it blank.");m.focus();return}
 ls("fz_n",nm);ls("fz_m",x);go.disabled=true;d.classList.add("sent");launch(msg());
 setTimeout(function(){close_();go.disabled=false},2600)});
$("wz-skip").onclick=function(){launch(msg(true));close_()};
$("wz-x").onclick=close_;
d.addEventListener("click",function(e){if(e.target===d)close_()});
d.addEventListener("cancel",function(e){e.preventDefault();close_()});
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest(".af-contact .wa");if(a){e.preventDefault();e.stopPropagation();open_()}},true);
window.openFursatChat=open_;
})();