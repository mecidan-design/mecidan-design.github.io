(function(){
  var root=document.documentElement, btns=document.querySelectorAll('.lang button');
  var T={
    en:{title:'Philosophy, made walkable',
        desc:'Classroom tools for secondary school philosophy: a complete Descartes unit, a political philosophy module on Hobbes, the Leviathan frontispiece, the role-playing game Terra, and standalone lessons on Plato and early modernity.',
        cv:'Animation: a group of peripatetic philosophers walking in circles, thinking and discussing'},
    es:{title:'Filosofía para caminar',
        desc:'Herramientas para Filosofía en el secundario: una unidad completa de Descartes, un módulo de filosofía política sobre Hobbes, el frontispicio del Leviatán, el juego de rol Terra y clases sueltas sobre Platón y la modernidad temprana.',
        cv:'Animación: un grupo de filósofos peripatéticos caminando en círculos, pensando y discutiendo'}
  };
  function set(l,save){
    root.setAttribute('data-lang',l); root.lang=l;
    document.title=T[l].title;
    var m=document.querySelector('meta[name="description"]'); if(m) m.content=T[l].desc;
    var c=document.getElementById('walk'); if(c) c.setAttribute('aria-label',T[l].cv);
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.set===l))});
    if(save){try{localStorage.setItem('site-lang',l)}catch(e){}}
  }
  var start=null;
  try{start=localStorage.getItem('site-lang')}catch(e){}
  if(start!=='es'&&start!=='en') start=/^es/i.test(navigator.language||'')?'es':'en';
  set(start,false);
  btns.forEach(function(b){b.addEventListener('click',function(){set(b.dataset.set,true)})});
})();
