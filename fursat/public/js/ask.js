(function(){
  var q=document.getElementById("af-q"),send=document.getElementById("af-send"),out=document.getElementById("as-results");
  if(!q||!send||!out)return;
  window.fursatAsk=true;
  var mode="food",calm=matchMedia("(prefers-reduced-motion: reduce)").matches,items=[],ready=fetch("/data/menu.json").then(function(r){return r.json()}).then(function(j){items=j}).catch(function(){items=[]});
  var STOP=/^(i|im|i'm|am|a|an|the|and|or|for|with|me|my|to|of|in|it|its|it's|is|some|something|want|feel|like|looking|need|give|show|find|something|under|below|than|less|rs|inr|please|veg|vegetarian|nonveg|non|spicy|spice|hot|want|something|dish|food|eat|eating|good|best)$/;
  var MOODS=[
    {re:/hungry|starving|full meal|heavy|filling|lunch|dinner|big appetite/,cats:["Biryani & rice","Mains","South Indian","Regional specials"],w:3,why:"Filling"},
    {re:/rain|monsoon|cold weather|winter|cosy|cozy|comfort/,cats:["Soups","Hot coffee","Tea","Quick bites","Regional specials"],kw:/pakodi|soup|chai|paya|hot chocolate|masala tea|ginger/i,w:3,why:"Warm and comforting"},
    {re:/spic(y|e)|fiery|kick|\bhot\b|karam/,spicy:1,w:4,why:"Spicy"},
    {re:/birthday|party|friends|group|sharing|share|celebrat|gang|get.?together/,cats:["Starters","Pizza","Quick bites","Desserts","Finger bites","Mocktails"],w:2,why:"Good to share"},
    {re:/sweet|dessert|cake|chocolate|treat/,cats:["Desserts","Cookies","Milk shakes"],w:4,why:"Sweet"},
    {re:/coffee|latte|caffeine|espresso|wake up/,cats:["Hot coffee","Cold coffee & frappes","Iced coffee"],w:4,why:"Coffee"},
    {re:/\btea\b|chai/,cats:["Tea"],w:4,why:"Tea"},
    {re:/drink|thirsty|refresh|cool|summer|mocktail|juice|shake|smoothie/,cats:["Mocktails","Soft drinks","Smoothies","Milk shakes"],w:4,why:"Refreshing"},
    {re:/light|healthy|diet|salad|fit\b/,cats:["Salads","Healthy bowls","Soups"],w:4,why:"Light"},
    {re:/breakfast|morning|brunch/,cats:["All day breakfast","Finger bites","Cookies"],w:4,why:"Breakfast"},
    {re:/\bkids?\b|child|little one/,cats:["Kids menu","Pizza","Cookies"],w:4,why:"Kid friendly"},
    {re:/snack|starter|appetizer|appetiser|finger|munch/,cats:["Starters","Quick bites","Finger bites"],w:3,why:"Snack"},
    {re:/romantic|date night|anniversary/,cats:["Desserts","Mocktails","Pasta","Pizza"],w:2,why:"Date night"}
  ];
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  var HI={food:"Something spicy under 400",drinks:"Something cold and refreshing",sree:"Filter Sreemukhi\u2019s menu"};
  function inMode(it){return mode==="food"?it.k==="food":mode==="drinks"?(it.k==="drink"&&!it.a):it.k==="sree"}
  function run(text){
    var t=text.toLowerCase().replace(/[\u2019']/g,"'"),max=null,m=t.match(/(?:under|below|less than|within|upto|up to|max|budget|\u20b9|rs\.?)\s*(?:rs\.?|\u20b9)?\s*(\d{2,4})/);
    if(m)max=+m[1];
    var nonveg=/non[- ]?veg|chicken|mutton|prawn|fish|egg|lamb|meat|kodi/.test(t),veg=!nonveg&&/\bveg(etarian)?\b|paneer|mushroom|pure veg/.test(t);
    var rules=MOODS.filter(function(r){return r.re.test(t)});
    var toks=t.replace(/\d+/g," ").split(/[^a-z']+/).filter(function(w){return w.length>2&&!STOP.test(w)});
    var res=items.map(function(it,idx){
      if(!inMode(it))return null;
      if(max&&it.p>max)return null;
      var v=it.v||"";if(veg&&v!=="veg"&&v!=="opt")return null;if(nonveg&&v!=="nonveg"&&v!=="opt")return null;
      var s=0,why=[],hay=(it.n+" "+(it.d||"")+" "+(it.t||"")+" "+it.c).toLowerCase();
      rules.forEach(function(r){var ci=r.cats?r.cats.indexOf(it.c):-1,hit=ci>-1||(r.spicy&&it.s)||(r.kw&&r.kw.test(it.n));if(hit){s+=r.w+(ci>-1?(r.cats.length-ci)*.3:0);if(why.indexOf(r.why)<0)why.push(r.why)}});
      toks.forEach(function(w){if(hay.indexOf(w)>-1)s+=5});
      if(max&&s>0)why.push("Under \u20b9"+max);
      return s>0?{it:it,s:s,why:why,i:idx}:null}).filter(Boolean);
    if(mode==="sree"&&!res.length)res=items.map(function(it,idx){return inMode(it)?{it:it,s:1,why:[],i:idx}:null}).filter(Boolean);
    res.sort(function(a,b){return b.s-a.s||a.i-b.i});
    if(mode==="sree")return res;
    var per={},top=[];res.forEach(function(r){per[r.it.c]=(per[r.it.c]||0)+1;if(per[r.it.c]<=2&&top.length<6)top.push(r)});
    return top}
  var LEAF='<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-leaf"/></svg>',LEAFS='<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-spice"/></svg>',BADGE='<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-badge"/></svg>',SPRIG='<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-sprig"/></svg>';
  var gq=null;
  function loadGsap(cb){if(window.gsap)return cb(window.gsap);if(gq){gq.push(cb);return}gq=[cb];
    var sc=document.createElement("script");sc.src="/js/gsap.min.js";
    sc.onload=function(){var f=gq;gq=null;f.forEach(function(x){x(window.gsap)})};
    sc.onerror=function(){var f=gq;gq=null;f.forEach(function(x){x(null)})};document.head.appendChild(sc)}
  /* focal moment: the leaf "blooms" open from its stem corner, price seal pops last */
  function bloom(){
    if(calm)return;var cards=[].slice.call(out.querySelectorAll(".mc"));if(!cards.length)return;
    out.classList.add("pre");var stop=setTimeout(function(){out.classList.remove("pre")},2200);
    loadGsap(function(g){clearTimeout(stop);
      if(!g||!cards[0].isConnected){out.classList.remove("pre");return}
      var imgs=cards.map(function(c){return c.querySelector(".mc-img")}),seals=cards.map(function(c){return c.querySelector(".mc-seal")}),
          odd=function(i){return i%2===0},
          from=function(i){return"circle(0% at "+(odd(i)?"0% 100%":"100% 0%")+")"},
          to=function(i){return"circle(150% at "+(odd(i)?"0% 100%":"100% 0%")+")"};
      var tl=g.timeline({defaults:{ease:"expo.out"},onComplete:function(){g.set(cards.concat(imgs,seals,out.querySelectorAll(".mc-img img,.mc-ph svg")),{clearProps:"all"})}});
      tl.add(function(){out.classList.remove("pre")},0)
        .from(out.querySelector(".rs-h"),{y:12,autoAlpha:0,duration:.5},0)
        .from(cards,{y:28,autoAlpha:0,duration:.7,stagger:{each:.07,amount:.4}},.05)
        .fromTo(imgs,{clipPath:from},{clipPath:to,duration:.9,stagger:{each:.07,amount:.4}},.08)
        .from(out.querySelectorAll(".mc-img img,.mc-ph svg"),{scale:1.18,duration:1.1,stagger:{each:.07,amount:.4}},.08)
        .from(seals,{scale:.9,autoAlpha:0,duration:.45,stagger:{each:.07,amount:.4}},.45)})}
  function render(text,top,quiet){
    var sree=mode==="sree",anyAlc=top.some(function(r){return r.it.a});
    var wa="https://wa.me/919059670033?text="+encodeURIComponent("Hi Fursat! I would like to reserve a table.");
    var ttl=sree?"Sreemukhi\u2019s Special Menu":top.length?(mode==="drinks"?"Drinks for \u201c":"Picks for \u201c")+esc(text)+"\u201d":"Nothing matched \u201c"+esc(text)+"\u201d";
    var h='<h2 class="rs-h" id="as-rh" tabindex="-1">'+LEAFS+"<span>"+ttl+"</span></h2>";
    if(top.length){h+='<ol class="rs-list">'+top.map(function(r,k){var it=r.it,meta=[it.c,it.a?"Contains alcohol, 21+":"",it.v==="veg"?"Veg":it.v==="nonveg"?"Non-veg":""].concat(it.s?["Spicy"]:[]).filter(Boolean).join(", ");
      var why=r.why.filter(function(x){return!(x==="Spicy"&&it.s)});
      var tn=0;for(var ci=0;ci<it.c.length;ci++)tn+=it.c.charCodeAt(ci);
      var tags=[it.c,it.a?"Contains alcohol, 21+":""].filter(Boolean).join(" \u00b7 "),
          vg=it.v==="veg"?'<span class="mc-vg is-veg" role="img" aria-label="Veg"></span>':it.v==="nonveg"?'<span class="mc-vg is-nv" role="img" aria-label="Non-veg"></span>':"",
          chips=why.slice(0,2).concat(it.s&&why.indexOf("Spicy")<0?["Spicy"]:[]).slice(0,2).map(function(w){return"<li>"+esc(w)+"</li>"}).join("");
      return '<li class="mc" data-t="'+(tn%4)+'" style="--k:'+k+'"><div class="mc-fig"><div class="mc-img">'+(it.img?'<img src="'+esc(it.img)+'" alt="'+esc(it.n)+'" width="640" height="576" loading="lazy" decoding="async">':'<span class="mc-ph">'+LEAF+'</span>')+'</div><span class="mc-seal">'+(it.f?"<small>from</small>":"")+"<b>\u20b9"+it.p+'</b></span></div><div class="mc-b"><h3 class="mc-n" translate="no">'+vg+"<span>"+esc(it.n)+'</span></h3><p class="mc-m">'+esc(tags)+"</p>"+(chips?'<ul class="mc-w" aria-label="Why this pick">'+chips+"</ul>":"")+"</div></li>"}).join("")+"</ol>"}
    else h+='<p class="rs-none">Try \u201csomething spicy under 400\u201d, \u201cdessert\u201d or \u201cchicken biryani\u201d.</p>';
    h+='<div class="rs-sep" aria-hidden="true">'+SPRIG+'</div><a class="rs-wa" href="'+wa+'" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.04L2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2zm0 1.8a8.1 8.1 0 1 1-4.2 15.02l-.3-.18-3 .79.8-2.92-.2-.31A8.1 8.1 0 0 1 12.04 3.8zM8.6 7.4c-.2 0-.5.07-.75.35-.26.28-1 .97-1 2.37s1.03 2.75 1.17 2.94c.14.19 2 3.17 4.9 4.32 2.4.95 2.9.76 3.42.71.52-.05 1.68-.69 1.92-1.35.24-.66.24-1.23.17-1.35-.07-.12-.26-.19-.54-.33-.28-.14-1.68-.83-1.94-.92-.26-.1-.45-.14-.64.14-.19.28-.73.92-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.2-.44-2.28-1.4-.84-.75-1.41-1.68-1.58-1.96-.16-.28-.02-.43.12-.57.13-.13.28-.33.43-.5.14-.16.19-.28.28-.47.1-.19.05-.35-.02-.5-.07-.14-.62-1.55-.86-2.1-.22-.5-.45-.5-.64-.51z"/></svg><span>Reserve a table on WhatsApp</span><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-arrow"/></svg></a>'
      +'<p class="rs-fine">Prices from the Fursat printed menu. Taxes extra.'+(anyAlc?" Alcohol is served to guests aged 21 and above only.":"")+"</p>";
    out.innerHTML=h;out.hidden=false;if(quiet)return;bloom();var hd=document.getElementById("as-rh");hd.scrollIntoView({behavior:calm?"auto":"smooth",block:"start"});hd.focus({preventScroll:true})}
  function go(){var text=q.value.trim();if(!text&&mode!=="sree"){q.focus();return}ready.then(function(){render(text,run(text))})}
  function setMode(m){mode=m;document.querySelectorAll("[data-tab]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.tab===m?"true":"false")});
    document.querySelectorAll("[data-for]").forEach(function(c){c.hidden=c.dataset.for!==m});q.placeholder=HI[m];q.value="";out.hidden=true;out.innerHTML="";
    if(m==="sree")ready.then(function(){render("",run(""))});else preview()}
  document.querySelectorAll("[data-tab]").forEach(function(b){b.addEventListener("click",function(){setMode(b.dataset.tab)})});
  send.addEventListener("click",go);
  q.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();go()}});
  document.querySelectorAll("[data-mood]").forEach(function(b){b.addEventListener("click",function(){q.value=b.dataset.mood;go()})});
  var mic=document.getElementById("af-mic"),SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(mic&&SR){mic.hidden=false;var rec=null;mic.addEventListener("click",function(){
    if(rec){rec.stop();return}
    rec=new SR();rec.lang="en-IN";rec.interimResults=false;rec.maxAlternatives=1;mic.setAttribute("aria-pressed","true");
    rec.onresult=function(e){q.value=e.results[0][0].transcript;go()};
    rec.onend=rec.onerror=function(){rec=null;mic.setAttribute("aria-pressed","false")};
    try{rec.start()}catch(x){rec=null;mic.setAttribute("aria-pressed","false")}})}
  function preview(){ready.then(function(){if(mode==="sree")return;var t=HI[mode];render(t,run(t).slice(0,3),true)})}
  preview();
  window.fursatRun=function(t){return run(t).map(function(r){return r.it.n+" "+r.it.p})};
})();
