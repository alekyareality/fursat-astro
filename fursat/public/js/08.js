(function(){
var $=function(i){return document.getElementById(i)},b=$("vz"),tx=$("vz-t"),A=new Audio("/assets/5fbd3b2fe9.mp3");
A.preload="auto";A.volume=1;
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){}}
var want=true,blocked=false,ended=false,hid=false,tm=0;
function duck(on){var m=window.__fzMu;if(m)m.volume=on?.2:.85}
function ui(){var playing=!A.paused&&!A.ended;b.classList.toggle("ask",want&&blocked&&A.paused&&!ended);b.classList.toggle("off",!want);
 b.setAttribute("aria-pressed",want&&!ended?"true":"false");
 var t=!want?"Voice off":ended?"Replay voice":"Voice on";tx.textContent=t;
 b.setAttribute("aria-label",!want?"Turn intro voice on":ended?"Replay intro voice":playing?"Turn intro voice off":"Play intro voice")}
function play(){var p;try{p=A.play()}catch(e){}
 if(p&&p.then)p.then(function(){blocked=false;ui();if(window.__fzV===undefined){window.__fzV=1;window.__fzOnV&&window.__fzOnV(1)}},function(){blocked=true;ui();arm();if(window.__fzV===undefined){window.__fzV=0;window.__fzOnV&&window.__fzOnV(0)}});else ui()}
function fade(cb){clearInterval(tm);var v=A.volume,st=v/10;tm=setInterval(function(){v-=st;if(v<=.02){clearInterval(tm);A.pause();A.volume=1;cb&&cb()}else A.volume=Math.max(v,0)},30)}
A.addEventListener("playing",function(){duck(true);ui()});
A.addEventListener("pause",function(){duck(false);ui()});
A.addEventListener("ended",function(){ended=true;duck(false);ui()});
var armed=false;function gest(e){if(!want||ended||!A.paused||b.contains(e.target))return;disarm();play()}
function arm(){if(armed)return;armed=true;["pointerdown","pointerup","touchstart","touchend","mousedown","keydown","click"].forEach(function(n){document.addEventListener(n,gest,true)})}
function disarm(){armed=false;["pointerdown","pointerup","touchstart","touchend","mousedown","keydown","click"].forEach(function(n){document.removeEventListener(n,gest,true)})}
["pointerdown","keydown"].forEach(function(n){b.addEventListener(n,function(e){e.stopPropagation()})});
b.addEventListener("click",function(){
 if(ended){A.currentTime=0;ended=false;want=true;disarm();play();return}
 if(want&&!A.paused){want=false;fade(ui);ui();return}
 want=true;disarm();play()});
document.addEventListener("visibilitychange",function(){if(document.hidden){if(!A.paused){A.pause();hid=true}}else if(hid){hid=false;if(want)play()}});
var mv=setInterval(function(){if($("intro"))return;clearInterval(mv);var r=document.querySelector(".top .r"),sn=$("snd");
 if(r){b.classList.remove("fix");r.insertBefore(b,sn||null)}},250);
arm();A.addEventListener("canplaythrough",function(){if(want&&A.paused&&!ended)play()},{once:true});if(want)play();else ui();
})();