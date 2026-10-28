
(function(){
var $=function(i){return document.getElementById(i)},cl=function(v,a,b){return Math.max(a,Math.min(b,v))};
var e5=function(t){t=cl(t,0,1);return t<.5?16*t*t*t*t*t:1-Math.pow(-2*t+2,5)/2};
var calm=matchMedia("(prefers-reduced-motion:reduce)").matches,H=document.documentElement;
var hero=$("top"),intro=$("intro"),ibox=$("ibox"),icard=$("icard"),lgo=$("lgo"),lcap=$("lcap"),D=7000,t0=null,done=false,go=false,ringed=false,Sz=0;
var ring=document.createElement("div");ring.className="lring";intro.appendChild(lgo);intro.appendChild(ring);
function frame(p){var vw=innerWidth,vh=innerHeight,s=Math.max(vw/700,vh/875),ox=(vw-700*s)/2,oy=(vh-875*s)/2,X=ox+497.6*s,Y=oy+321.6*s,r0=32*s,d=2*r0,
 S=Math.min(vw*.6,vh*.46,300),sx=vw/2,sy=vh*.42,a=e5((p-.12)/.40),b=e5((p-.56)/.44),z=1+1.5*b,R=r0+(Math.hypot(vw,vh)/z*1.06-r0)*b,
 cxp=sx-vw*.16,cyp=sy-vh*.2,u=1-a,
 cx=u*u*sx+2*u*a*cxp+a*a*X,cy=u*u*sy+2*u*a*cyp+a*a*Y,
 settle=Math.sin(cl((p-.47)/.12,0,1)*Math.PI)*.07,
 k=(d/S-1)*a+1+settle,float=Math.sin(p*55)*5*u,rot=-9*u+Math.sin(p*36)*2.4*u;
 if(Sz!==S){Sz=S;lgo.style.width=lgo.style.height=S+"px"}
 icard.style.filter="blur("+(u*10).toFixed(1)+"px) brightness("+(.42+.58*a).toFixed(2)+") saturate("+(.82+.18*a).toFixed(2)+")";
 lgo.style.transform="translate3d("+(cx-S/2).toFixed(1)+"px,"+(cy-S/2+float).toFixed(1)+"px,0) rotate("+rot.toFixed(2)+"deg) scale("+(k*(1+.35*b)).toFixed(4)+")";
 lgo.style.opacity=(1-e5(b*1.7)).toFixed(2);
 if(a>.985&&!ringed){ringed=true;ring.style.cssText="width:"+d+"px;height:"+d+"px;--x:"+(X-d/2).toFixed(1)+"px;--y:"+(Y-d/2).toFixed(1)+"px";ring.classList.add("pop")}
 var f=2+26*b,m="radial-gradient(circle at "+X.toFixed(1)+"px "+Y.toFixed(1)+"px,transparent "+R.toFixed(1)+"px,#000 "+(R+f).toFixed(1)+"px)";
 ibox.style.transformOrigin=X.toFixed(1)+"px "+Y.toFixed(1)+"px";ibox.style.transform="scale("+z.toFixed(3)+")";
 if(b>0){intro.style.background="transparent";ibox.style.webkitMaskImage=ibox.style.maskImage=m}
 lcap.style.opacity=cl(1-a*3,0,1);lcap.style.transform="translateY("+(a*26).toFixed(1)+"px)";
 if(b>.3&&!go){go=true;hero.classList.add("go")}}
function finish(){if(done)return;done=true;go=true;hero.classList.add("go");intro.remove();lcap.remove();H.classList.remove("lock");scrollTo(0,0)}
function tick(now){if(done)return;if(t0===null)t0=now;var p=cl((now-t0-400)/D,0,1);frame(p);p<1?requestAnimationFrame(tick):finish()}
if(calm){finish()}else{H.classList.add("lock");frame(0);window.__fzGo=function(){if(window.__fzS)return;window.__fzS=1;requestAnimationFrame(tick)};
 var skip=function(){if(t0!==null&&performance.now()-t0>1200)finish()};["wheel","touchmove","keydown","pointerdown"].forEach(function(n){addEventListener(n,skip,{passive:true})})}
var tx=0,ty=0,cx0=0,cy0=0,fine=matchMedia("(pointer:fine)").matches;
if(!calm){if(fine)addEventListener("pointermove",function(e){tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5},{passive:true});
 (function dp(t){if(scrollY<innerHeight*1.05){if(!fine){tx=Math.sin(t/3200)*.28;ty=Math.cos(t/4100)*.12}cx0+=(tx-cx0)*.06;cy0+=(ty-cy0)*.06;hero.style.setProperty("--px",cx0.toFixed(4));hero.style.setProperty("--py",cy0.toFixed(4))}requestAnimationFrame(dp)})(0)}
var CFG={musicStart:27},mu=new Audio("/assets/611fb91032.mp3"),ac,an,fd,avg=0,last=0,B=0,on=false,sb=$("snd"),bp=.504,ph=0,dance=0;
mu.loop=true;window.__fzMu=mu;mu.preload="auto";mu.volume=.85;
mu.addEventListener("loadedmetadata",function(){if(mu.duration>CFG.musicStart+3&&mu.currentTime<1)mu.currentTime=CFG.musicStart},{once:true});
function music(v){if(v){if(!ac&&/^https?:/.test(location.protocol)){try{ac=new(window.AudioContext||window.webkitAudioContext)();var s=ac.createMediaElementSource(mu);an=ac.createAnalyser();an.fftSize=256;fd=new Uint8Array(an.frequencyBinCount);s.connect(an);an.connect(ac.destination)}catch(e){an=null}}
 if(ac&&ac.resume)ac.resume();mu.play().then(function(){on=true;beat()}).catch(function(){on=false;sb.setAttribute("aria-pressed","false");sb.lastElementChild.textContent="Set the mood"})}else{mu.pause();on=false}
 sb.setAttribute("aria-pressed",v);sb.lastElementChild.textContent=v?"Mood on":"Set the mood";sb.classList.remove("nudge")}
sb.onclick=function(){music(!on)};
function lock(){var f=ph-Math.round(ph);ph-=f*.22}
function beat(t){if(!on){B=0;hero.style.setProperty("--b",0);return}t=t||performance.now();
 if(an){an.getByteFrequencyData(fd);var e=(fd[1]+fd[2]+fd[3]+fd[4])/1020;avg=avg*.96+e*.04;if(e>avg*1.22+.07&&t-last>250){B=1;last=t;lock()}}else if(t-last>504){B=1;last=t;lock()}
 B*=.9;if(B<.01)B=0;hero.style.setProperty("--b",B.toFixed(3));requestAnimationFrame(beat)}
var st={bend:0,bob:0,ear:0,sq:0,tilt:0,nod:0},lt=0;
(function dl(ms){requestAnimationFrame(dl);var t=ms/1000,dt=Math.min(t-lt,.1);lt=t;if(calm)return;
 dance+=((on?1:0)-dance)*(1-Math.exp(-dt*3.2));if(on)ph+=dt/bp;
 var idle=1-dance,sw=Math.sin(Math.PI*ph),th=Math.pow(1-Math.abs(Math.sin(Math.PI*ph)),2),hit=Math.min(1,th*.75+B*.45);
 st.bend=sw*dance+Math.sin(t*.8)*.32*idle;st.tilt=st.bend;
 st.bob=hit*dance+(Math.sin(t*1.5)*.5+.5)*.22*idle;
 st.ear=Math.sin(2*Math.PI*(ph-.12))*dance*(.85+.35*B)+Math.sin(t*1.35)*.3*idle;
 st.sq=hit*dance;st.nod=-hit*dance*.016+Math.sin(t*.8+.6)*.01*idle;
 hero.style.setProperty("--sw",(st.bend*2.4).toFixed(2));hero.style.setProperty("--bn",st.bob.toFixed(3))})(0);

document.addEventListener("visibilitychange",function(){if(document.hidden&&on){mu.pause()}else if(on){mu.play().catch(function(){})}});
var af=document.querySelector(".askwrap .af");if(af){if("IntersectionObserver"in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){af.classList.add("in");o.disconnect()}},{threshold:.12}).observe(af)}else af.classList.add("in")}
})();


(function(){var by=document.getElementById("by"),t=document.getElementById("byt");if(!by||!t)return;var txt="Designed & being developed by",calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
function fin(){t.textContent=txt;by.classList.add("fin")}
if(calm){fin();return}
var i=0;function type(){if(i<=txt.length){t.textContent=txt.slice(0,i++);setTimeout(type,i<4?260:48+Math.random()*50)}else setTimeout(function(){by.classList.add("fin")},350)}
var h=document.getElementById("top"),started=false;function go(){if(started)return;started=true;setTimeout(type,1400)}
if(h.classList.contains("go"))go();else new MutationObserver(function(m,o){if(h.classList.contains("go")){o.disconnect();go()}}).observe(h,{attributes:true,attributeFilter:["class"]});
})();
