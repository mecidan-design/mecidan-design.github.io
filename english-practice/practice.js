/* English practice page: pop in on scroll, word by word title, a joking monster.
   IntersectionObserver only, no scroll listeners. Everything still works without motion. */
(function(){
  var d=document;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* title: each word hops in one after the other */
  var h=d.querySelector('.hero h1');
  if(h&&!reduce){
    var text=h.textContent.trim();
    h.setAttribute('aria-label',text);
    h.innerHTML=text.split(/\s+/).map(function(w,i){
      return '<span class="hw" aria-hidden="true" style="--i:'+i+'">'+w+'</span>';
    }).join(' ');
    var style=d.createElement('style');
    style.textContent='.hw{animation:hw 900ms cubic-bezier(0.34,1.56,0.64,1) calc(var(--i) * 140ms) backwards}'+
      '@keyframes hw{0%{opacity:0;transform:translateY(-48px) rotate(-8deg) scale(.6)}100%{opacity:1}}';
    d.head.appendChild(style);
  }

  /* pop in cards, rows and headings, staggered inside each group */
  var pops=[].slice.call(d.querySelectorAll('.pop'));
  pops.forEach(function(el){
    var sibs=[].slice.call(el.parentNode.children).filter(function(n){return n.classList.contains('pop')});
    el.style.setProperty('--i',String(sibs.indexOf(el)%4));
  });
  if(!('IntersectionObserver' in window)||reduce){
    pops.forEach(function(el){el.classList.add('in')});
  }else{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -5% 0px'});
    pops.forEach(function(el){io.observe(el)});
  }

  /* pause the hero's endless motion when it is off screen */
  var hero=d.querySelector('.hero');
  if(hero&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){hero.classList.toggle('off',!es[0].isIntersecting)},{threshold:0}).observe(hero);
  }

  /* the monster tells jokes */
  var jokes=[
    'Why did the verb go to school? To learn its past simple.',
    'I am, you are, he is, and I am out of snacks.',
    'What is a pirate\'s favorite letter? You think it is R, but it is the C.',
    'Adjectives describe things. This page is purple, loud and extremely correct.',
    'Why was the comma tired? It kept stopping for a pause.',
    'I have already finished my homework. Yet here I am, talking to you.',
    'Which word is always spelled wrong? Wrong.',
    'Why did the student bring a ladder? To reach a higher level.'
  ];
  var n=0,btn=d.getElementById('mascot'),say=d.getElementById('joke'),box=d.getElementById('confetti');
  var colors=['#FFD23F','#FF3D7F','#00C2CB','#8FE04A','#FF7A1A','#FFFDF5'];
  function burst(){
    if(reduce||!box||!box.animate) return;
    for(var i=0;i<18;i++){
      var p=d.createElement('i'),a=Math.random()*Math.PI*2,r=80+Math.random()*90;
      p.style.background=colors[i%colors.length];
      box.appendChild(p);
      var a1=p.animate([
        {transform:'translate(0,0) rotate(0) scale(.4)',opacity:1},
        {transform:'translate('+Math.cos(a)*r+'px,'+(Math.sin(a)*r-60)+'px) rotate('+(Math.random()*540)+'deg) scale(1)',opacity:1,offset:.6},
        {transform:'translate('+Math.cos(a)*r*1.1+'px,'+(Math.sin(a)*r+40)+'px) rotate(720deg) scale(.8)',opacity:0}
      ],{duration:1100,easing:'cubic-bezier(0.32,0.72,0,1)'});
      a1.onfinish=(function(el){return function(){el.remove()}})(p);
    }
  }
  if(btn&&say){
    btn.addEventListener('click',function(){
      say.textContent=jokes[n%jokes.length]; n++;
      say.classList.remove('swap'); void say.offsetWidth; say.classList.add('swap');
      btn.classList.remove('hop'); void btn.offsetWidth; btn.classList.add('hop');
      burst();
    });
  }
})();
