(function(){"use strict";
var ss=window.speechSynthesis;if(!ss||!window.SpeechSynthesisUtterance)return;
var viaVoice=0,tm=0,cur=null,btn=null,mo=null;
function clean(s){return String(s).replace(/\u20B9\s?([\d,]+)/g,"$1 rupees").replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu,"").replace(/&/g," and ").replace(/\s+/g," ").trim()}
function pickVoice(){var v=ss.getVoices()||[];return v.filter(function(x){return /en[-_]IN/i.test(x.lang)})[0]||v.filter(function(x){return /^en/i.test(x.lang)})[0]||null}
function names(){var n=[].slice.call(document.querySelectorAll(".af-sheet .af-item .af-nm")).slice(0,3).map(function(e){return clean(e.textContent)}).filter(Boolean);
 return n.length?(n.length>1?"Top picks: "+n.slice(0,-1).join(", ")+" and "+n[n.length-1]+".":"Top pick: "+n[0]+"."):""}
function setBtn(on){if(!btn)return;btn.setAttribute("aria-pressed",on?"true":"false");btn.textContent=on?"\u23F9 Stop":"\uD83D\uDD0A Listen"}
function stop(){try{ss.cancel()}catch(e){}cur=null;setBtn(false)}
function speak(){var r=document.getElementById("af-reply");if(!r||!r.textContent.trim())return;
 stop();var t=clean(r.textContent).replace(/\.?\s*\(([^)]*)\)\s*$/,". $1").replace(/\.?\s*$/,".");var nm=names();if(nm)t+=" "+nm;
 var u=new SpeechSynthesisUtterance(t);u.lang="en-IN";var v=pickVoice();if(v){u.voice=v;u.lang=v.lang}u.rate=1;
 u.onend=u.onerror=function(){if(cur===u){cur=null;setBtn(false)}};cur=u;setBtn(true);ss.speak(u)}
function shown(){var l=document.querySelector(".af-layer");return l&&l.classList.contains("show")}
function ensureBtn(){var r=document.getElementById("af-reply");if(!r)return;if(btn&&btn.isConnected)return;
 btn=document.createElement("button");btn.type="button";btn.className="fz-spk";btn.setAttribute("aria-label","Read the reply aloud");setBtn(false);
 btn.addEventListener("click",function(){cur?stop():speak()});r.insertAdjacentElement("afterend",btn)}
function onReply(){clearTimeout(tm);tm=setTimeout(function(){if(!shown())return;ensureBtn();if(viaVoice){viaVoice=0;speak()}},750)}
function attach(){var r=document.getElementById("af-reply");if(!r||r._fzs)return;r._fzs=1;
 new MutationObserver(onReply).observe(r,{childList:true,characterData:true,subtree:true});
 var l=r.closest(".af-layer");if(l)new MutationObserver(function(){if(!l.classList.contains("show"))stop()}).observe(l,{attributes:true,attributeFilter:["class"]})}
attach();
new MutationObserver(attach).observe(document.body,{childList:true});
document.addEventListener("click",function(e){var t=e.target;
 if(t.closest&&t.closest("#af-mic")){viaVoice=1;stop()}else if(t.closest&&t.closest("#af-send,.af-chip,[data-act=close]")){if(!t.closest("[data-act=close]"))viaVoice=0;else stop()}},true);
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target&&e.target.id==="af-q")viaVoice=0;if(e.key==="Escape")stop()},true);
addEventListener("pagehide",stop);document.addEventListener("visibilitychange",function(){if(document.hidden)stop()});
})();