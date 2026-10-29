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
  var host=document.getElementById("as-host"),say=document.getElementById("as-say"),stage=host&&host.querySelector(".as-stage"),pt=0,sayT=0;
  function pose(n,ms,next){if(!host)return;clearTimeout(pt);host.setAttribute("data-pose",n);if(ms)pt=setTimeout(function(){next?next():pose("idle")},ms)}
  function talk(t){if(!say||say.textContent===t)return;clearTimeout(sayT);say.classList.add("is-swap");sayT=setTimeout(function(){say.textContent=t;say.classList.remove("is-swap")},calm?0:150)}
  function stars(){if(calm||!stage)return;for(var i=0;i<8;i++){var s=document.createElement("span"),a=i/8*Math.PI*2,d=70+Math.random()*30;s.className="as-star";s.style.setProperty("--sx",Math.cos(a)*d+"px");s.style.setProperty("--sy",Math.sin(a)*d-16+"px");s.addEventListener("animationend",function(){this.remove()});stage.appendChild(s)}}
  var HI={food:"Hungry? Tell me your mood.",drinks:"Thirsty? Let\u2019s find a sip.",sree:"Sreemukhi\u2019s picks, all in one place."};
  function react(n){if(n>0){pose("chew",900,function(){pose("cheer",1300);stars();talk(n+(n===1?" pick":" picks")+" for you!")});talk("Mmm, let me think\u2026")}else{pose("idle");talk("Nothing yet. Try another mood.")}}
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
  function render(text,top){
    var sree=mode==="sree",anyAlc=top.some(function(r){return r.it.a});
    var wa="https://wa.me/919059670033?text="+encodeURIComponent("Hi Fursat! I would like to reserve a table.");
    var h='<h2 class="as-rh" id="as-rh" tabindex="-1">'+(sree?"Sreemukhi\u2019s Special Menu":top.length?(mode==="drinks"?"Drinks for \u201c":"Picks for \u201c")+esc(text)+"\u201d":"Nothing matched \u201c"+esc(text)+"\u201d")+"</h2>";
    if(top.length){h+='<ol class="as-list">'+top.map(function(r,k){var it=r.it,meta=[it.c,it.a?"Contains alcohol, 21+":"",it.v==="veg"?"Veg":it.v==="nonveg"?"Non-veg":""].concat(it.s?["Spicy"]:[]).filter(Boolean).join(", ");
      return '<li class="as-row" style="--k:'+k+'"><div><p class="as-n" translate="no">'+esc(it.n)+'</p><p class="as-m">'+esc(meta)+(function(w){return w.length?" \u2013 "+esc(w.join(", ")):""})(r.why.filter(function(x){return!(x==="Spicy"&&it.s)}))+"</p>"+(it.d?'<p class="as-d">'+esc(it.d)+"</p>":"")+'</div><p class="as-pr">'+(it.f?"from ":"")+"\u20b9"+it.p+"</p></li>"}).join("")+"</ol>"}
    else h+='<p class="as-d">Try \u201csomething spicy under 400\u201d, \u201cdessert\u201d or \u201cchicken biryani\u201d.</p>';
    h+='<p class="as-fine">Prices from the Fursat printed menu. Taxes extra.'+(anyAlc?" Alcohol is served to guests aged 21 and above only.":"")+'</p><a class="as-wa" href="'+wa+'" target="_blank" rel="noopener">Reserve a table on WhatsApp</a>';
    out.innerHTML=h;out.hidden=false;var hd=document.getElementById("as-rh");hd.scrollIntoView({behavior:calm?"auto":"smooth",block:"start"});hd.focus({preventScroll:true})}
  function go(){var text=q.value.trim();if(!text&&mode!=="sree"){q.focus();return}ready.then(function(){var top=run(text);render(text,top);if(text||mode!=="sree")react(top.length)})}
  var PH={food:"Birthday with friends\u2026",drinks:"Something cold and refreshing\u2026",sree:"Filter Sreemukhi\u2019s menu\u2026"};
  function setMode(m){mode=m;document.querySelectorAll("[data-tab]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.tab===m?"true":"false")});
    document.querySelectorAll("[data-for]").forEach(function(c){c.hidden=c.dataset.for!==m});q.placeholder=PH[m];pose("idle");talk(HI[m]);q.value="";out.hidden=true;out.innerHTML="";
    if(m==="sree")ready.then(function(){render("",run(""))})}
  document.querySelectorAll("[data-tab]").forEach(function(b){b.addEventListener("click",function(){setMode(b.dataset.tab)})});
  send.addEventListener("click",go);
  q.addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();go()}});
  document.querySelectorAll("[data-mood]").forEach(function(b){b.addEventListener("click",function(){q.value=b.textContent;go()})});
  window.fursatRun=function(t){return run(t).map(function(r){return r.it.n+" "+r.it.p})};
})();
