/* ---------- 30. hero video: pause / play control (WCAG 2.2.2 + Vercel rule: autoplay motion over 5s needs a pause control).
   Wraps v.play so the scroll/visibility logic in 10.js cannot restart a video the visitor paused. ---------- */
(function(){
  var v=document.getElementById("fxplv"),b=document.getElementById("fxpv");
  if(!v||!b)return;
  var calm=matchMedia("(prefers-reduced-motion:reduce)").matches;
  var orig=v.play.bind(v),user=calm; /* reduced motion: starts paused, the button plays it */
  v.play=function(){return user?Promise.resolve():orig()};
  function set(){b.dataset.s=user?"paused":"playing";b.setAttribute("aria-label",user?"Play background video":"Pause background video")}
  b.addEventListener("click",function(){
    user=!user;
    if(user)v.pause();else{var p=orig();if(p&&p.catch)p.catch(function(){})}
    set()
  });
  set()
})();
