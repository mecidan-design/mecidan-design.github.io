/* Starts each puppet when its section scrolls into view and pauses it off screen.
   IntersectionObserver only. Without it, every puppet simply shows at rest. */
(function(){
  var cuts=document.querySelectorAll('.cut');
  if(!cuts.length) return;
  var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(still||!('IntersectionObserver' in window)){
    cuts.forEach(function(c){c.classList.add('in','on')});
    return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var c=e.target;
      if(e.isIntersecting){c.classList.add('in','on')}
      else{c.classList.remove('on')}
    });
  },{threshold:.2});
  cuts.forEach(function(c){io.observe(c)});
})();
