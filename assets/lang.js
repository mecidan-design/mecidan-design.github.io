/* ES / EN switch shared by the portfolio pages. Texts live in data-l="en" and data-l="es" spans.
   The choice is remembered in this browser only. Attributes (alt, aria-label, title) swap through data-es-* and data-en-*. */
(function(){
  var root=document.documentElement, btns=document.querySelectorAll('.lang button');
  var T=window.LANG_T||{};
  var ATTRS=['alt','aria-label','title'];
  function set(l,save){
    root.setAttribute('data-lang',l); root.lang=l;
    if(T[l]){
      document.title=T[l].title;
      var m=document.querySelector('meta[name="description"]'); if(m) m.content=T[l].desc;
    }
    ATTRS.forEach(function(a){
      document.querySelectorAll('[data-es-'+a+']').forEach(function(el){
        el.setAttribute(a,el.getAttribute('data-'+l+'-'+a));
      });
    });
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.set===l))});
    if(save){try{localStorage.setItem('site-lang',l)}catch(e){}}
  }
  var start=null;
  try{start=localStorage.getItem('site-lang')}catch(e){}
  if(start!=='es'&&start!=='en') start=/^es/i.test(navigator.language||'')?'es':'en';
  set(start,false);
  btns.forEach(function(b){b.addEventListener('click',function(){set(b.dataset.set,true)})});
})();
