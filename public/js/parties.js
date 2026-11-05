(function(){
  var calm=matchMedia("(prefers-reduced-motion: reduce)").matches,fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
  var S={occ:null,pkg:null,n:30},D=null;
  var $=function(s){return document.querySelector(s)},cards=$("#pp-cards"),occ=$("#pp-occ"),rng=$("#pp-n"),sum=$("#pp-sum");
  var fmt=function(v){return "\u20b9"+Math.round(v).toLocaleString("en-IN")};
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function tier(){return D.tiers.filter(function(t){return t.id===S.pkg})[0]}
  function wa(){var t=tier(),m="Hi Fursat! I would like to plan a party"+(S.occ?" ("+occLabel()+")":"")+" for about "+S.n+" guests"+(t?", interested in the "+t.name+" package.":".");
    return "https://wa.me/"+D.wa+"?text="+encodeURIComponent(m)}
  function occLabel(){return D.occasions.filter(function(o){return o[0]===S.occ})[0][1]}
  function draw(){
    var rec=S.occ?D.tiers.filter(function(t){return t.for.indexOf(S.occ)>-1}).map(function(t){return t.id}):[];
    cards.innerHTML=D.tiers.map(function(t){var on=S.pkg===t.id;
      return '<button type="button" role="radio" class="pc'+(on?' on':'')+(rec.indexOf(t.id)>-1?' rec':'')+'" aria-checked="'+on+'" data-id="'+t.id+'">'
      +'<span class="pc-img"><img src="'+t.img+'" alt="" loading="lazy" decoding="async"></span>'
      +(rec.indexOf(t.id)>-1?'<span class="pc-rec">Good for '+esc(occLabel().toLowerCase())+'</span>':'')
      +'<span class="pc-b"><span class="pc-tag">'+esc(t.tag)+'</span><span class="pc-n" translate="no">'+esc(t.name)+'</span>'
      +'<span class="pc-p">'+(t.from?'from ':'')+fmt(t.pp)+'<small> per person</small></span>'
      +'<ul>'+t.includes.map(function(i){return'<li>'+esc(i)+'</li>'}).join("")+'</ul>'
      +'<span class="pc-min">From '+t.min+' guests'+(t.alc?' &middot; alcohol 21+ only':'')+(t.confirmed?'':' &middot; sample')+'</span></span></button>'}).join("");
    var t=tier(),est=$("#pp-est"),go=$("#pp-go");
    $("#pp-nv").textContent=S.n;
    if(t){sum.classList.add("on");$("#pp-sn").textContent=t.name;est.textContent=(t.from?"from ":"")+fmt(t.pp*S.n);$("#pp-sub").textContent=S.n+" guests \u00d7 "+fmt(t.pp)+", taxes extra"+(t.confirmed?"":" (sample price)")}
    else{sum.classList.remove("on");$("#pp-sn").textContent="Pick a package";est.textContent="";$("#pp-sub").textContent="Slide the guests, choose a package"}
    go.href=wa();
    $("#pp-ribbon").hidden=D.tiers.every(function(t){return t.confirmed});
    rng.style.setProperty("--p",((S.n-rng.min)/(rng.max-rng.min)*100)+"%");
  }
  function ready(d){D=d;
    occ.innerHTML=d.occasions.map(function(o){return'<button type="button" aria-pressed="false" data-o="'+o[0]+'">'+esc(o[1])+'</button>'}).join("");
    occ.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
      S.occ=S.occ===b.dataset.o?null:b.dataset.o;
      occ.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x.dataset.o===S.occ?"true":"false")});
      if(S.occ&&!S.pkg){var r=D.tiers.filter(function(t){return t.for.indexOf(S.occ)>-1})[0];if(r)S.pkg=r.id}
      draw()});
    cards.addEventListener("click",function(e){var b=e.target.closest(".pc");if(!b)return;S.pkg=b.dataset.id;draw();var n=cards.querySelector('[data-id="'+S.pkg+'"]');n&&n.focus({preventScroll:true})});
    rng.addEventListener("input",function(){S.n=+rng.value;draw()});
    cards.addEventListener("keydown",function(e){if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft"&&e.key!=="ArrowDown"&&e.key!=="ArrowUp")return;
      e.preventDefault();var ids=D.tiers.map(function(t){return t.id}),i=ids.indexOf(S.pkg);i=(i+(e.key==="ArrowRight"||e.key==="ArrowDown"?1:ids.length-1))%ids.length;S.pkg=ids[i];draw();cards.querySelector('[data-id="'+S.pkg+'"]').focus({preventScroll:true})});
    if(fine&&!calm)cards.addEventListener("pointermove",function(e){var c=e.target.closest(".pc");if(!c||e.pointerType!=="mouse")return;
      var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.setProperty("--ry",(-y*8).toFixed(2)+"deg");c.style.setProperty("--rx",(x*10).toFixed(2)+"deg");c.style.setProperty("--gx",(x*100+50)+"%");c.style.setProperty("--gy",(y*100+50)+"%")});
    cards.addEventListener("pointerout",function(e){var c=e.target.closest(".pc");if(c){c.style.removeProperty("--rx");c.style.removeProperty("--ry")}});
    draw()}
  fetch("/data/packages.json").then(function(r){return r.json()}).then(ready).catch(function(){cards.innerHTML='<p class="pp-err">Packages are loading slowly. Message us on WhatsApp and we will send the full list.</p>'});
})();
